package routes

import (
	"net/http"
	_ "talaria/docs"
	"talaria/internal/api/handlers"
	"talaria/internal/api/middleware"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type Router struct {
	authHandler     *handlers.AuthHandler
	userHandler     *handlers.UserHandler
	travelHandler   *handlers.TravelHandler
	activityHandler *handlers.ActivityHandler
	tokenService    middleware.TokenValidator
}

func NewRouter(authHandler *handlers.AuthHandler, userHandler *handlers.UserHandler, travelHandler *handlers.TravelHandler, activityHandler *handlers.ActivityHandler, tokenService middleware.TokenValidator) *Router {
	return &Router{
		authHandler:     authHandler,
		userHandler:     userHandler,
		travelHandler:   travelHandler,
		activityHandler: activityHandler,
		tokenService:    tokenService,
	}
}

func (rt *Router) SetupRoutes(r *gin.Engine) {
	// Swagger docs
	r.GET("/api/docs", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/api/docs/index.html")
	})
	r.GET("api/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Public routes
	rt.setupPublicRoutes(r)

	// Private routes
	rt.setupPrivateRoutes(r)
}

func (rt *Router) setupPublicRoutes(r *gin.Engine) {
	r.POST("/register", rt.authHandler.Register)
	r.POST("/login", rt.authHandler.Login)
}

func (rt *Router) setupPrivateRoutes(r *gin.Engine) {
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware(rt.tokenService))
	{
		api.GET("/user", rt.userHandler.GetUserByToken)
		api.GET("/travels", rt.travelHandler.GetTravels)
		api.POST("/travels/create", rt.travelHandler.CreateTravel)
		api.GET("/travels/:travel_id", rt.travelHandler.GetTravelByID)
		api.GET("/travels/:travel_id/activities", rt.activityHandler.GetActivities)
		api.POST("/travels/:travel_id/activities/create", rt.activityHandler.CreateActivity)
		api.GET("/travels/:travel_id/activities/:activity_id", rt.activityHandler.GetActivityById)
	}
}
