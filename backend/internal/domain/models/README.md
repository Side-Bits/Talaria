# Models,  Business Entities

Define the core data structures of your application.

## Responsibilities
- Represent business entities (User, Product, Order, etc.)
- Define database mapping with struct tags
- Define JSON serialization with struct tags
- Include business logic methods on structs

## Rules
- One file per model (user.go, product.go, order.go)
- Include both JSON and database tags
- Business logic methods should be pure (no external dependencies)
- No API-specific concerns

## Example
```go
type User struct {
    ID        string    `json:"id" db:"id"`
    Email     string    `json:"email" db:"email"`
    Name      string    `json:"name" db:"name"`
    PasswordHash string `json:"-" db:"password_hash"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
    UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// Business methods
func (u *User) Validate() error {
    if u.Email == "" {
        return errors.New("email is required")
    }
    return nil
}

func (u *User) ChangeEmail(newEmail string) error {
    if !isValidEmail(newEmail) {
        return errors.New("invalid email format")
    }
    u.Email = newEmail
    return nil
}
```

