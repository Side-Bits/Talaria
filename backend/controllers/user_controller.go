package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetUserByToken(c *gin.Context) {

	userId, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"userID":  userId,
		"profile": "mock profile data",
	})

}
