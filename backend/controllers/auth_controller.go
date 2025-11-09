package controllers

import (
	"net/http"

	"deus.est/hermes/database"
	"deus.est/hermes/models"
	"deus.est/hermes/repositories"
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
