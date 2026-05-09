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

type RegisterRequest struct {
	Identifier string `json:"identifier" binding:"required" example:"user@example.com"`
	Password   string `json:"password" binding:"required" example:"secret-password"`
	Username   string `json:"username" binding:"required" example:"Jane Doe"`
}

type LoginRequest struct {
	Identifier string `json:"identifier" binding:"required" example:"user@example.com"`
	Password   string `json:"password" binding:"required" example:"secret-password"`
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

// Register godoc
// @Summary Register a new user
// @Description Creates a user account and returns an authentication token.
// @Tags auth
// @Accept json
// @Produce json
// @Param request body RegisterRequest true "Registration payload"
// @Success 201 {object} RegisterResponse
// @Failure 400 {object} ErrorResponse
// @Router /register [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		respondBadRequest(c, "invalid request body", err)
		return
	}

	user := models.User{
		Email:    req.Identifier,
		Password: req.Password,
		Name:     req.Username,
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

// Login godoc
// @Summary Log in
// @Description Authenticates a user and returns an authentication token.
// @Tags auth
// @Accept json
// @Produce json
// @Param request body LoginRequest true "Login payload"
// @Success 202 {object} RegisterResponse
// @Failure 400 {object} ErrorResponse
// @Router /login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		respondBadRequest(c, "invalid request body", err)
		return
	}

	user, token, err := h.authService.Login(c, req.Identifier, req.Password)
	if err != nil {
		respondBadRequest(c, "invalid credentials", err)
		return
	}

	c.JSON(http.StatusAccepted, RegisterResponse{
		User:  *user,
		Token: token,
	})
}
