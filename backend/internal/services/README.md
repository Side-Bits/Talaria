# Services: Business Logic Layer

This package contains the business logic and use cases of your application.

## Responsibilities
- Implement business rules and validation
- Coordinate between multiple repositories
- Handle transactions
- Transform data between layers
- Orchestrate complex operations

## File Naming
- `user_service.go` - User-related business logic
- `auth_service.go` - Authentication business logic
- `order_service.go` - Order processing logic
- `payment_service.go` - Payment processing logic

## Rules
- No HTTP concerns
- No direct database access (use repositories)
- One service per domain aggregate
- Services can use other services
- Return domain models, not DTOs

## Example
```go
type UserService struct {
    userRepo repositories.UserRepository
    emailService *EmailService
}

func (s *UserService) RegisterUser(ctx context.Context, email, name, password string) (*models.User, error) {
    // 1. Validate input
    // 2. Check if user exists
    // 3. Hash password
    // 4. Create user
    // 5. Send welcome email
    // 6. Return user
}
```
