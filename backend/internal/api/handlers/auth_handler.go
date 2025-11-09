package handlers

import (
	"net/http"

	"talaria/internal/models"
	"talaria/internal/pkgs/database"
	"talaria/internal/repositories"

	"github.com/gin-gonic/gin"
)

func HandleRegisterUser(c *gin.Context) {
	var user models.User

	err := c.BindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, nil)
		return
	}

	err = repositories.RegisterUser(database.DB, &user)
	if err != nil {
		c.JSON(http.StatusBadRequest, nil)
		return
	}

	// generate token

	c.JSON(http.StatusOK, user)
}
