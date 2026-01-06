package handlers

import (
	"net/http"
	"talaria/internal/services"
	"github.com/gin-gonic/gin"
)

type ActivityHandler struct {
	userService services.UserService
}

func NewActivityHandler(userService services.UserService) *ActivityHandler {
	return &ActivityHandler{
		userService: userService,
	}
}

func (h *ActivityHandler) Activity(c *gin.Context) {
	h.getActivities(c)
}

func (h *ActivityHandler) getActivities(c *gin.Context) {
	id_travel := c.Query("id_travel")

	if id_travel == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id_travel is required"})
		return
	}

	activities, err := h.userService.GetActivities(c.Request.Context(), id_travel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, activities)
}