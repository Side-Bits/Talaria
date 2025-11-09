package routes

import (
	"github.com/gin-gonic/gin"
	"talaria/internal/api/handlers"
	"talaria/internal/api/middleware"
)

func PrivateRoutes(r *gin.Engine) {
	api := r.Group("/api")

	api.Use(middleware.AuthMiddleware())
	{
		// TODO authenticated routes. All must receive a valid token
		api.GET("/user", handlers.GetUserByToken)
	}
}
