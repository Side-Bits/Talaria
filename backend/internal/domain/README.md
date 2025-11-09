# Domain: Business Models and Types

This package contains the core business entities, value objects, and types.

## Sub-packages

### `/models/`
- Domain entities (User, Product, Order, etc.)
- Database struct tags for SQL
- JSON struct tags for API
- Validation methods

### `/types/`
- Custom types and enums (UserRole, OrderStatus, etc.)
- Type-safe domain concepts
- Constants

### `/dto/` (optional)
- Data Transfer Objects for API requests/responses
- Only if significantly different from domain models

## Responsibilities
- Define business entities and their relationships
- Provide type safety for domain concepts
- Centralize data structures used across the application

## Rules
- No external dependencies
- Pure Go data structures
- Include validation methods on structs
- Models should represent business concepts, not database tables
