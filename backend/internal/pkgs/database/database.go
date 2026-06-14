package database

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var loadEnvOnce sync.Once

func loadEnv() {
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "local"
	}

	files := []string{
		".env",
		fmt.Sprintf(".env.%s", env), // e.g. .env.local, .env.prod
	}

	for _, f := range files {
		if err := godotenv.Overload(f); err != nil {
			// It's fine if a file doesn't exist
			if !os.IsNotExist(err) {
				log.Printf("warning: could not load %s: %v", f, err)
			}
		}
	}

	log.Printf("env loaded (APP_ENV=%s)", env)
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

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := dbpool.Ping(ctx); err != nil {
		dbpool.Close()
		log.Fatalf("Unable to connect to database: %v\n", err)
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
