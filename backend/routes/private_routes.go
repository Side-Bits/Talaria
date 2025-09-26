package routes

import (
	"deus.est/hermes/controllers"
	"deus.est/hermes/middleware"
	"github.com/gin-gonic/gin"
)

func PrivateRoutes(r *gin.Engine) {
	api := r.Group("/api")

	api.Use(middleware.AuthMiddleware())
	{
		// TODO authenticated routes. All must receive a valid token
		api.GET("/user", controllers.GetUserByToken)
	}
}
