package handlers

import (
	"context"
	"crypto/sha256"
	"crypto/subtle"
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

var debugDBTemplate = template.Must(template.New("debug-db").Parse(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Debug Database</title>
<style>
:root { color-scheme: light; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
body { margin: 0; background: #f6f8fa; color: #24292f; }
a { color: #0969da; }
.layout { display: grid; grid-template-columns: 280px 1fr; min-height: 100vh; }
aside { border-right: 1px solid #d0d7de; padding: 20px; background: #ffffff; }
main { position: relative; padding: 24px; overflow: auto; }
h1, h2 { margin-top: 0; }
.topbar { display: flex; justify-content: flex-end; margin-bottom: 12px; }
.info { position: relative; }
.info summary { list-style: none; width: 38px; height: 38px; display: grid; place-items: center; border: 1px solid #d0d7de; border-radius: 999px; background: #ffffff; color: #24292f; font-weight: 800; cursor: pointer; }
.info summary::-webkit-details-marker { display: none; }
.info[open] summary { border-color: #0969da; }
.info-panel { position: absolute; right: 0; z-index: 10; width: 280px; margin-top: 10px; padding: 14px; border: 1px solid #d0d7de; border-radius: 12px; background: #ffffff; box-shadow: 0 16px 40px rgba(31,35,40,.14); }
.info-panel dl { display: grid; grid-template-columns: 80px 1fr; gap: 8px; margin: 0 0 12px; }
.info-panel dt { color: #57606a; }
.info-panel dd { margin: 0; overflow-wrap: anywhere; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
.table-list { display: grid; gap: 8px; }
.table-list a { display: block; padding: 8px 10px; border: 1px solid #d0d7de; border-radius: 8px; text-decoration: none; background: #f6f8fa; }
.table-list a[hidden] { display: none; }
.table-search { width: 100%; box-sizing: border-box; margin: 0 0 12px; padding: 9px 10px; border-radius: 8px; border: 1px solid #d0d7de; background: #ffffff; color: #24292f; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
textarea { width: 100%; min-height: 180px; box-sizing: border-box; padding: 12px; border-radius: 8px; border: 1px solid #d0d7de; background: #ffffff; color: #24292f; font: 14px/1.5 ui-monospace, SFMono-Regular, Consolas, monospace; }
button, .button { display: inline-block; margin-top: 12px; padding: 10px 14px; border: 0; border-radius: 8px; background: #238636; color: #fff; font-weight: 700; cursor: pointer; text-decoration: none; }
.info-panel .button { margin-top: 0; width: 100%; box-sizing: border-box; text-align: center; }
.button.secondary, button.secondary { background: #57606a; }
.alert { margin: 16px 0; padding: 12px; border-radius: 8px; background: #ffebe9; border: 1px solid #ff8182; white-space: pre-wrap; }
.notice { margin: 16px 0; padding: 12px; border-radius: 8px; background: #ddf4ff; border: 1px solid #54aeff; }
.meta { margin: 16px 0; color: #57606a; }
.results { overflow: auto; border: 1px solid #d0d7de; border-radius: 8px; background: #ffffff; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
th, td { padding: 8px 10px; border-bottom: 1px solid #d0d7de; text-align: left; vertical-align: top; }
th { position: sticky; top: 0; background: #f6f8fa; }
td { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; white-space: pre-wrap; }
.empty { color: #57606a; }
@media (max-width: 760px) { .layout { grid-template-columns: 1fr; } aside { border-right: 0; border-bottom: 1px solid #d0d7de; } }
</style>
</head>
<body>
<div class="layout">
<aside>
<h1>Debug DB</h1>
<h2>Tables</h2>
<input class="table-search" id="tableSearch" type="search" placeholder="Search tables" autocomplete="off">
<div class="table-list">
{{range .Tables}}<a data-table-name="{{.Schema}}.{{.Name}}" href="/debug/db?sql={{urlquery .Query}}"><strong>{{.Schema}}</strong>.{{.Name}}</a>{{else}}<span class="empty">No tables found.</span>{{end}}
</div>
</aside>
<main>
<div class="topbar">
<details class="info">
<summary aria-label="Database info">i</summary>
<div class="info-panel">
<dl>
<dt>Name</dt><dd>{{.DBName}}</dd>
<dt>User</dt><dd>{{.DBUser}}</dd>
<dt>Host</dt><dd>{{.DBHost}}</dd>
<dt>Port</dt><dd>{{.DBPort}}</dd>
</dl>
<a class="button secondary" href="/debug/db?logout=1">Log out</a>
</div>
</details>
</div>
<div class="actions">
<a class="button secondary" href="/debug/db">Reload Tables</a>
{{if .Missing}}<form method="post" action="/debug/db"><input type="hidden" name="action" value="create_tables"><button type="submit">Run create_tables.sql</button></form>{{end}}
</div>
{{if .Missing}}<p class="empty">Missing expected tables: {{range $i, $table := .Missing}}{{if $i}}, {{end}}{{$table}}{{end}}</p>{{end}}
<form method="post" action="/debug/db">
<textarea name="sql" spellcheck="false" placeholder="SELECT * FROM users LIMIT 100">{{.SQL}}</textarea>
<button type="submit">Run SQL</button>
</form>
{{if .Message}}<div class="notice">{{.Message}}{{if .ElapsedTime}} in {{.ElapsedTime}}{{end}}</div>{{end}}
{{if .Error}}<div class="alert">{{.Error}}</div>{{end}}
{{if .CommandTag}}<div class="meta">{{.CommandTag}} &middot; {{len .Rows}} row(s) shown &middot; max {{.MaxRows}} &middot; {{.ElapsedTime}}</div>{{end}}
{{if .Columns}}
<div class="results"><table>
<thead><tr>{{range .Columns}}<th>{{.}}</th>{{end}}</tr></thead>
<tbody>{{range .Rows}}<tr>{{range .}}<td>{{.}}</td>{{end}}</tr>{{end}}</tbody>
</table></div>
{{else if .CommandTag}}<p class="empty">Statement completed without returned columns.</p>{{end}}
</main>
</div>
<script>
const tableSearch = document.getElementById('tableSearch');
if (tableSearch) {
  tableSearch.addEventListener('input', () => {
    const term = tableSearch.value.trim().toLowerCase();
    document.querySelectorAll('[data-table-name]').forEach((tableLink) => {
      const matches = tableLink.dataset.tableName.toLowerCase().includes(term);
      tableLink.hidden = !matches;
      tableLink.style.display = matches ? 'block' : 'none';
    });
  });
}
</script>
</body>
</html>`))

var debugDBLoginTemplate = template.Must(template.New("debug-db-login").Parse(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Debug Database Login</title>
<style>
:root { color-scheme: light; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f6f8fa; color: #24292f; }
form { width: min(360px, calc(100vw - 32px)); padding: 24px; border: 1px solid #d0d7de; border-radius: 12px; background: #ffffff; }
h1 { margin-top: 0; }
label { display: block; margin-bottom: 8px; color: #57606a; }
input { width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 8px; border: 1px solid #d0d7de; background: #ffffff; color: #24292f; }
button { margin-top: 14px; width: 100%; padding: 10px 14px; border: 0; border-radius: 8px; background: #238636; color: #fff; font-weight: 700; cursor: pointer; }
.alert { margin-bottom: 12px; padding: 10px; border-radius: 8px; background: #ffebe9; border: 1px solid #ff8182; }
</style>
</head>
<body>
<form method="post" action="/debug/db">
<h1>Debug DB</h1>
{{if .Message}}<div class="alert">{{.Message}}</div>{{end}}
<label for="debug_db_user">Database user</label>
<input id="debug_db_user" name="debug_db_user" type="text" autocomplete="username" autofocus required>
<label for="debug_db_password">Password</label>
<input id="debug_db_password" name="debug_db_password" type="password" autocomplete="current-password" required>
<button type="submit">Log in</button>
</form>
</body>
</html>`))
