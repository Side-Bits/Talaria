package middleware

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// TokenValidator is an interface for validating tokens
type TokenValidator interface {
	ValidateToken(ctx context.Context, token string) (string, error)
}

// AuthMiddleware creates a middleware that validates JWT/tokens
func AuthMiddleware(validator TokenValidator) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract token from Authorization header
		token, err := extractBearerToken(c)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "missing or invalid authorization header",
			})
			return
		}

		// Validate token and get user ID
		userID, err := validator.ValidateToken(c.Request.Context(), token)
		if err != nil {
			// Don't expose internal errors to the client
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "invalid or expired token",
			})
			return
		}

		// Store user ID in context for downstream handlers
		c.Set("userID", userID)
		c.Next()
	}
}

// extractBearerToken extracts the token from the Authorization header
func extractBearerToken(c *gin.Context) (string, error) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return "", gin.Error{Err: errors.New("missing authorization header")}
	}

	// Check if it starts with "Bearer "
	const bearerPrefix = "Bearer "
	if !strings.HasPrefix(authHeader, bearerPrefix) {
		return "", gin.Error{Err: errors.New("invalid authorization header format")}
	}

	// Extract token
	token := strings.TrimPrefix(authHeader, bearerPrefix)
	token = strings.TrimSpace(token)

	if token == "" {
		return "", gin.Error{Err: errors.New("empty token")}
	}

	return token, nil
}

// GetUserID is a helper to retrieve the userID from context
func GetUserID(c *gin.Context) (int64, bool) {
	userID, exists := c.Get("userID")
	if !exists {
		return 0, false
	}

	id, ok := userID.(int64)
	return id, ok
}
