// routes/router.go
package routes

import (
	"talaria/internal/api/handlers"
	"talaria/internal/api/middleware"

	"github.com/gin-gonic/gin"
)

type Router struct {
	authHandler  *handlers.AuthHandler
	userHandler  *handlers.UserHandler
	tokenService middleware.TokenValidator
}

func NewRouter(authHandler *handlers.AuthHandler, userHandler *handlers.UserHandler, tokenService middleware.TokenValidator) *Router {
	return &Router{
		authHandler:  authHandler,
		userHandler:  userHandler,
		tokenService: tokenService,
	}
}

func (rt *Router) SetupRoutes(r *gin.Engine) {
	// Public routes
	rt.setupPublicRoutes(r)

	// Private routes
	rt.setupPrivateRoutes(r)
}

func (rt *Router) setupPublicRoutes(r *gin.Engine) {
	r.POST("/register", rt.authHandler.Register)
	// r.POST("/login", rt.authHandler.Login)
}

func (rt *Router) setupPrivateRoutes(r *gin.Engine) {
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware(rt.tokenService))
	{
		api.GET("/user", rt.userHandler.GetUserByToken)
	}
}
