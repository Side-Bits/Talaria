package handlers

import (
	"context"
	"crypto/sha256"
	"crypto/subtle"
	_ "embed"
	"encoding/hex"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const debugDBQueryTimeout = 15 * time.Second

var expectedDebugDBTables = []string{
	"activities",
	"clients",
	"clients_activities",
	"clients_travels",
	"roles",
	"session_token",
	"statuses",
	"travels",
	"users",
}

type DebugDBHandler struct {
	db *pgxpool.Pool
}

type debugDBTable struct {
	Schema string
	Name   string
	Query  string
}

type debugDBPageData struct {
	SQL         string
	Tables      []debugDBTable
	DBName      string
	DBUser      string
	DBHost      string
	DBPort      string
	Columns     []string
	Rows        [][]string
	CommandTag  string
	Error       string
	MaxRows     int
	ElapsedTime string
	Missing     []string
	Message     string
}

func NewDebugDBHandler(db *pgxpool.Pool) *DebugDBHandler {
	return &DebugDBHandler{db: db}
}

func (h *DebugDBHandler) Page(c *gin.Context) {
	if !debugDBLoginConfigured() {
		c.String(http.StatusForbidden, "DB_USER and DB_PASSWORD must be set to use the debug database page")
		return
	}
	if c.PostForm("debug_db_user") != "" || c.PostForm("debug_db_password") != "" {
		h.handleLogin(c)
		return
	}
	if c.Query("logout") == "1" {
		clearDebugDBCookie(c)
		c.Redirect(http.StatusFound, "/debug/db")
		return
	}
	if !isDebugDBAuthenticated(c) {
		renderDebugDBLogin(c, "")
		return
	}

	action := c.PostForm("action")

	data := debugDBPageData{
		SQL:     strings.TrimSpace(c.PostForm("sql")),
		MaxRows: 200,
		DBName:  os.Getenv("DB_NAME"),
		DBUser:  os.Getenv("DB_USER"),
		DBHost:  os.Getenv("DB_HOST"),
		DBPort:  os.Getenv("DB_PORT"),
	}
	if data.SQL == "" {
		data.SQL = strings.TrimSpace(c.Query("sql"))
	}

	tables, err := h.loadTables(c.Request.Context())
	if err != nil {
		data.Error = err.Error()
	} else {
		data.Tables = tables
		data.Missing = missingDebugDBTables(tables)
	}

	if action == "create_tables" {
		started := time.Now()
		if err := h.runCreateTables(c.Request.Context()); err != nil {
			data.Error = err.Error()
		} else {
			data.Message = "create_tables.sql schema section executed"
			data.ElapsedTime = time.Since(started).String()
			data.Tables, data.Error = h.reloadTables(c.Request.Context())
			data.Missing = missingDebugDBTables(data.Tables)
		}
	}

	if action == "" && shouldRunDebugSQL(c, data.SQL) {
		started := time.Now()
		result, err := h.runSQL(c.Request.Context(), data.SQL, data.MaxRows)
		data.ElapsedTime = time.Since(started).String()
		if err != nil {
			data.Error = err.Error()
		} else {
			data.Columns = result.Columns
			data.Rows = result.Rows
			data.CommandTag = result.CommandTag
		}
	}

	c.Header("Content-Type", "text/html; charset=utf-8")
	if err := debugDBTemplate.Execute(c.Writer, data); err != nil {
		c.String(http.StatusInternalServerError, err.Error())
	}
}

func (h *DebugDBHandler) handleLogin(c *gin.Context) {
	if !validDebugDBCredentials(c.PostForm("debug_db_user"), c.PostForm("debug_db_password")) {
		renderDebugDBLogin(c, "Invalid database credentials")
		return
	}

	c.SetCookie("debug_db_auth", debugDBCredentialsHash(), int((12 * time.Hour).Seconds()), "/debug/db", "", false, true)
	c.Redirect(http.StatusFound, "/debug/db")
}

func (h *DebugDBHandler) loadTables(ctx context.Context) ([]debugDBTable, error) {
	ctx, cancel := context.WithTimeout(ctx, debugDBQueryTimeout)
	defer cancel()

	rows, err := h.db.Query(ctx, `
		SELECT table_schema, table_name
		FROM information_schema.tables
		WHERE table_type = 'BASE TABLE'
			AND table_schema NOT IN ('pg_catalog', 'information_schema')
		ORDER BY table_schema, table_name
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tables []debugDBTable
	for rows.Next() {
		var table debugDBTable
		if err := rows.Scan(&table.Schema, &table.Name); err != nil {
			return nil, err
		}
		table.Query = fmt.Sprintf("SELECT * FROM %s LIMIT 100", pgx.Identifier{table.Schema, table.Name}.Sanitize())
		tables = append(tables, table)
	}

	return tables, rows.Err()
}

func (h *DebugDBHandler) reloadTables(ctx context.Context) ([]debugDBTable, string) {
	tables, err := h.loadTables(ctx)
	if err != nil {
		return nil, err.Error()
	}
	return tables, ""
}

func missingDebugDBTables(tables []debugDBTable) []string {
	found := make(map[string]bool, len(tables))
	for _, table := range tables {
		if table.Schema == "public" {
			found[table.Name] = true
		}
	}

	var missing []string
	for _, table := range expectedDebugDBTables {
		if !found[table] {
			missing = append(missing, table)
		}
	}
	return missing
}

func (h *DebugDBHandler) runCreateTables(ctx context.Context) error {
	contents, err := os.ReadFile("create_tables.sql")
	if err != nil {
		return err
	}

	schemaSQL, _, _ := strings.Cut(string(contents), "-- INSERTS")
	ctx, cancel := context.WithTimeout(ctx, debugDBQueryTimeout)
	defer cancel()

	_, err = h.db.Exec(ctx, schemaSQL)
	return err
}

func shouldRunDebugSQL(c *gin.Context, sql string) bool {
	if sql == "" {
		return false
	}
	if c.Request.Method == http.MethodPost {
		return true
	}

	firstWord := strings.ToUpper(strings.Fields(sql)[0])
	switch firstWord {
	case "SELECT", "WITH", "SHOW", "EXPLAIN", "VALUES":
		return true
	default:
		return false
	}
}

type debugDBResult struct {
	Columns    []string
	Rows       [][]string
	CommandTag string
}

func (h *DebugDBHandler) runSQL(ctx context.Context, sql string, maxRows int) (debugDBResult, error) {
	ctx, cancel := context.WithTimeout(ctx, debugDBQueryTimeout)
	defer cancel()

	rows, err := h.db.Query(ctx, sql)
	if err != nil {
		return debugDBResult{}, err
	}
	defer rows.Close()

	fields := rows.FieldDescriptions()
	result := debugDBResult{Columns: make([]string, 0, len(fields))}
	for _, field := range fields {
		result.Columns = append(result.Columns, field.Name)
	}

	for rows.Next() {
		values, err := rows.Values()
		if err != nil {
			return debugDBResult{}, err
		}

		row := make([]string, 0, len(values))
		for _, value := range values {
			row = append(row, formatDebugDBValue(value))
		}
		result.Rows = append(result.Rows, row)

		if len(result.Rows) >= maxRows {
			break
		}
	}

	if err := rows.Err(); err != nil {
		return debugDBResult{}, err
	}

	rows.Close()
	result.CommandTag = rows.CommandTag().String()
	return result, nil
}

func formatDebugDBValue(value any) string {
	if value == nil {
		return "NULL"
	}
	if bytes, ok := value.([]byte); ok {
		return string(bytes)
	}
	return fmt.Sprint(value)
}

func debugDBLoginConfigured() bool {
	return strings.TrimSpace(os.Getenv("DB_USER")) != "" && os.Getenv("DB_PASSWORD") != ""
}

func validDebugDBCredentials(user string, password string) bool {
	expectedUser := strings.TrimSpace(os.Getenv("DB_USER"))
	expectedPassword := os.Getenv("DB_PASSWORD")
	if expectedUser == "" || expectedPassword == "" || user == "" || password == "" {
		return false
	}
	userMatches := subtle.ConstantTimeCompare([]byte(user), []byte(expectedUser)) == 1
	passwordMatches := subtle.ConstantTimeCompare([]byte(password), []byte(expectedPassword)) == 1
	return userMatches && passwordMatches
}

func isDebugDBAuthenticated(c *gin.Context) bool {
	cookie, err := c.Cookie("debug_db_auth")
	if err != nil || cookie == "" {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(cookie), []byte(debugDBCredentialsHash())) == 1
}

func debugDBCredentialsHash() string {
	sum := sha256.Sum256([]byte(os.Getenv("DB_USER") + ":" + os.Getenv("DB_PASSWORD")))
	return hex.EncodeToString(sum[:])
}

func clearDebugDBCookie(c *gin.Context) {
	c.SetCookie("debug_db_auth", "", -1, "/debug/db", "", false, true)
}

func renderDebugDBLogin(c *gin.Context, message string) {
	c.Header("Content-Type", "text/html; charset=utf-8")
	c.Status(http.StatusUnauthorized)
	_ = debugDBLoginTemplate.Execute(c.Writer, struct{ Message string }{Message: message})
}

//go:embed templates/debug_db.html
var debugDBTemplateHTML string

//go:embed templates/debug_db_login.html
var debugDBLoginTemplateHTML string

var debugDBTemplate = template.Must(template.New("debug-db").Parse(debugDBTemplateHTML))

var debugDBLoginTemplate = template.Must(template.New("debug-db-login").Parse(debugDBLoginTemplateHTML))
