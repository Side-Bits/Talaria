# Repositories: Data Access Layer

This package handles all data persistence operations.

## Responsibilities
- Database CRUD operations
- Query building and execution
- Data mapping (database rows ↔ Go structs)
- Transaction management
- Database-specific optimizations

## File Naming
- `user_repository.go` - User data operations
- `token_repository.go` - Token data operations
- `product_repository.go` - Product data operations

## Rules
- One repository per aggregate root
- Implement interfaces for testability
- No business logic - only simple data operations
- Handle database errors and convert to domain errors
- Use context for cancellation and timeouts

## Example
```go
type UserRepository interface {
    Create(ctx context.Context, user *models.User) error
    FindByID(ctx context.Context, id string) (*models.User, error)
    FindByEmail(ctx context.Context, email string) (*models.User, error)
    Update(ctx context.Context, user *models.User) error
    Delete(ctx context.Context, id string) error
}

type userRepository struct {
    db *sql.DB
}

func (r *userRepository) Create(ctx context.Context, user *models.User) error {
    query := `INSERT INTO users (...) VALUES (...)`
    // Execute query and map results
}
```
