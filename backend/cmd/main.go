package main

import (
	"fmt"
	"talaria/internal/api/handlers"
	"talaria/internal/api/routes"
	"talaria/internal/pkgs/database"
	"talaria/internal/services"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// @title Talaria API
// @version 1.0
// @description API for Talaria travel planning.
// @host localhost:8080
// @BasePath /
// @schemes http
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	r := gin.Default() // Includes logger and recovery middleware

	dbpool := database.InitDB()
	defer dbpool.Close()

	if gin.Mode() == gin.DebugMode {
		fmt.Println("🚧 Gin running in DEBUG mode - CORS is OPEN")
		r.Use(cors.New(cors.Config{
			AllowAllOrigins:  true,
			AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
		}))

		debugDBHandler := handlers.NewDebugDBHandler(dbpool)
		r.GET("/debug/db", debugDBHandler.Page)
		r.POST("/debug/db", debugDBHandler.Page)
	}

	// Initialize
	authService := services.NewAuthService(dbpool)
	authHandler := handlers.NewAuthHandler(*authService)

	userService := services.NewUserService(dbpool)
	userHandler := handlers.NewUserHandler(*userService)
	travelService := services.NewTravelService(dbpool)
	travelHandler := handlers.NewTravelHandler(*travelService)
	activityService := services.NewActivityService(dbpool)
	activityHandler := handlers.NewActivityHandler(*activityService)

	router := routes.NewRouter(authHandler, userHandler, travelHandler, activityHandler, authService)
	router.SetupRoutes(r)

	// Start server on port 8080
	r.Run(":8080")
}
