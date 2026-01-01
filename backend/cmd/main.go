package main

import (
	"talaria/internal/api/handlers"
	"talaria/internal/api/routes"
	"talaria/internal/pkgs/database"
	"talaria/internal/services"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default() // Includes logger and recovery middleware
	dbpool := database.InitDB()
	defer dbpool.Close()

	authService := services.NewAuthService(dbpool)
	authHandler := handlers.NewAuthHandler(*authService)

	userService := services.NewUserService(dbpool)
	userHandler := handlers.NewUserHandler(*userService)
	travelHandler := handlers.NewTravelHandler(*userService)

	router := routes.NewRouter(authHandler, userHandler, travelHandler, authService)
	router.SetupRoutes(r)

	// Start server on port 8080
	r.Run(":8080")
}
