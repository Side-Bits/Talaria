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
	var data map[string]string

	if err := c.BindJSON(&data); err != nil {
		respondBadRequest(c, "invalid request body", err)
		return
	}

	identifier := data["identifier"]
	password := data["password"]
	username := data["username"]

	user := models.User{
		Email:    identifier,
		Password: password,
		Name:     username,
	}

	token, err := h.authService.Register(c, &user)
	if err != nil {
		respondBadRequest(c, "failed to register user", err)
		return
	}

	c.JSON(http.StatusCreated, RegisterResponse{
		User:  user,
		Token: token,
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var data map[string]string

	if err := c.BindJSON(&data); err != nil {
		respondBadRequest(c, "invalid request body", err)
		return
	}

	identifier := data["identifier"]
	password := data["password"]

	user, token, err := h.authService.Login(c, identifier, password)
	if err != nil {
		respondBadRequest(c, "invalid credentials", err)
		return
	}

	c.JSON(http.StatusAccepted, RegisterResponse{
		User:  *user,
		Token: token,
	})
}
