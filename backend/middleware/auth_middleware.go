package middleware

import (
	"net/http"
	"strings"

	"deus.est/hermes/controllers"
	"deus.est/hermes/database"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing or invalid token"})
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing or invalid token"})
			return
		}

		userId, err := controllers.GetUserIdByToken(database.DB, token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": err})
		}

		// set user id in the context
		c.Set("userID", userId)
		c.Next()
	}
}
