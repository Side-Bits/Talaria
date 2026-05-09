docker compose up --build

Swagger UI is available at `http://localhost:8080/swagger/index.html`.

Regenerate the OpenAPI files after changing route annotations:

```sh
go run github.com/swaggo/swag/cmd/swag init -g cmd/main.go
```
