package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"talaria/internal/models"
	"talaria/internal/pkgs/database"
)

func GetUserByToken(c *gin.Context) {
	userId, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	user, err := getUserById(c, userId.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

func getUserById(c *gin.Context, id int) (models.User, error) {
	var user models.User

	row := database.DB.QueryRowContext(
		c.Request.Context(),
		"SELECT id, name, email FROM users WHERE id=$1",
		id,
	)

	err := row.Scan(&user.ID, &user.Name, &user.Email)

	return user, err
}
