package handlers

import (
	"net/http"
	"talaria/internal/api/middleware"
	"talaria/internal/domain/models"
	"talaria/internal/services"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService services.UserService
}

type UserResponse = models.User

func NewUserHandler(userService services.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// GetUserByToken godoc
// @Summary Get current user
// @Description Returns the authenticated user from the bearer token.
// @Tags users
// @Produce json
// @Security BearerAuth
// @Success 200 {object} UserResponse
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/user [get]
func (h *UserHandler) GetUserByToken(c *gin.Context) {
	userID, ok := middleware.GetUserIDOrAbort(c)
	if !ok {
		return
	}

	user, err := h.userService.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		respondInternalError(c, "failed to fetch user", err)
		return
	}

	c.JSON(http.StatusOK, user)
}

// LogoutAll godoc
// @Summary Closes all sessions of an user
// @Description Removes all token sessoins of an user closing all the open sessions
// @Tags users
// @Security BearerAuth
// @Success 204
// @Failure 500 {object} ErrorResponse
// @Router /api/logoutall [get]
func (h *UserHandler) LogoutAll(c *gin.Context) {
	userId, ok := middleware.GetUserIDOrAbort(c)
	if !ok {
		return
	}

	err := h.userService.CloseAllSessions(c, userId)
	if err != nil {
		respondInternalError(c, "Failed to close all sessions", err)
		return
	}

	c.Status(http.StatusNoContent)
}
