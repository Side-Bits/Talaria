# Handlers - HTTP Request Handlers

Handle specific HTTP endpoints, parse requests, call services, return responses.

## Responsibilities
- Extract and validate path parameters, query strings, and request bodies
- Call appropriate service methods
- Handle service errors and map to HTTP status codes
- Format and return JSON responses
- Set appropriate HTTP headers

## File Naming
- `user_handler.go` - User-related endpoints
- `auth_handler.go` - Authentication endpoints
- `product_handler.go` - Product-related endpoints

## Example Structure
```go
type UserHandler struct {
    userService services.UserService
}

func (h *UserHandler) GetUser(c *gin.Context) {
    // 1. Extract user ID from path
    // 2. Call userService.GetUser()
    // 3. Handle errors
    // 4. Return JSON response
}

func (h *UserHandler) CreateUser(c *gin.Context) {
    // 1. Bind and validate request body
    // 2. Call userService.CreateUser()
    // 3. Return appropriate HTTP status
}
```
