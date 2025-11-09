package routes

import (
	"github.com/gin-gonic/gin"
	"talaria/internal/api/handlers"
)

func PublicRoutes(r *gin.Engine) {
	// TODO implemet controllers
	r.POST("/login")
	r.POST("/signup", handlers.HandleRegisterUser)
}
