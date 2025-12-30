# Internal/API HTTP Layer

This package contains all HTTP-related code including handlers, middleware, and routing.

## Sub-packages

### `/handlers/`
- Handle HTTP requests and responses
- Parse and validate input
- Call service methods
- Format JSON responses
- **No business logic**

### `/middleware/`
- Authentication/authorization
- Request logging
- CORS handling
- Rate limiting
- Panic recovery

### `/routes/`
- Define URL routes and HTTP methods
- Connect routes to handler methods
- Apply middleware to routes
- Route grouping and versioning

## Responsibilities
- HTTP request/response handling
- Input validation and sanitization
- JSON serialization/deserialization
- Error handling and HTTP status codes
- Middleware chain setup

## Rules
- No direct database access
- No business logic
- Use services for all business operations
- Keep handlers thin and focused
