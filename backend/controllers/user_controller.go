package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetUserById(c *gin.Context) {
	userID := c.Param("id")

	id, err := strconv.Atoi(userID)
	if err != nil || id < 0 || id >= len(models.Users) {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, models.Users[id])
}
