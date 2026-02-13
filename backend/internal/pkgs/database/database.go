package database

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"os"
	"strings"
	"sync"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var loadEnvOnce sync.Once

func loadEnv() {
	loadEnvOnce.Do(func() {
		_ = godotenv.Load(".env")
	})
}

func defaultString(value string, fallback string) string {
	if value == "" {
		return fallback
	}
	return value
}

func resolveSSLMode() string {
	if sslMode := strings.TrimSpace(os.Getenv("DB_SSL_MODE")); sslMode != "" {
		return sslMode
	}

	switch strings.ToLower(strings.TrimSpace(os.Getenv("DB_MODE"))) {
	case "external":
		return "require"
	default:
		return "disable"
	}
}

func buildDatabaseURL() string {
	host := defaultString(os.Getenv("DB_HOST"), "localhost")
	port := defaultString(os.Getenv("DB_PORT"), "5432")
	name := strings.TrimSpace(os.Getenv("DB_NAME"))
	user := strings.TrimSpace(os.Getenv("DB_USER"))
	password := os.Getenv("DB_PASSWORD")
	sslMode := resolveSSLMode()

	if name == "" || user == "" {
		log.Fatal("missing DB_NAME or DB_USER for database connection")
	}

	return fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		url.QueryEscape(user),
		url.QueryEscape(password),
		host,
		port,
		name,
		url.QueryEscape(sslMode),
	)
}

func InitDB() *pgxpool.Pool {
	loadEnv()
	databaseURL := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	if databaseURL == "" {
		databaseURL = buildDatabaseURL()
	}

	dbpool, err := pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v\n", err)
	}
	return dbpool
}

type DBExecutor interface {
	Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
	Exec(ctx context.Context, sql string, args ...any) (pgconn.CommandTag, error)
}

type TxBeginner interface {
	DBExecutor
	Begin(ctx context.Context) (pgx.Tx, error)
}
