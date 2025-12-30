package handlers

import (
	"net/http"

	"talaria/internal/domain/models"
	"talaria/internal/services"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService services.AuthService
}

type RegisterResponse struct {
	User  models.User `json:"user"`
	Token string      `json:"token"`
}

func NewAuthHandler(authService services.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var user models.User

	err := c.BindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, nil)
		return
	}

	token, err := h.authService.Register(c, &user)
	if err != nil {
		c.JSON(http.StatusBadRequest, nil)
		return
	}

	c.JSON(http.StatusCreated, RegisterResponse{
		User:  user,
		Token: token,
	})
}
