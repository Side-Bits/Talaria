package routes

import (
	"deus.est/hermes/controllers"
	"github.com/gin-gonic/gin"
)

func PublicRoutes(r *gin.Engine) {
	// TODO implemet controllers
	r.POST("/login")
	r.POST("/signup", controllers.HandleRegisterUser)
}
