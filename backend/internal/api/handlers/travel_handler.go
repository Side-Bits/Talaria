package handlers

import (
	"net/http"
	"talaria/internal/services"
	"github.com/gin-gonic/gin"
)

type TravelHandler struct {
	userService services.UserService
}

func NewTravelHandler(userService services.UserService) *TravelHandler {
	return &TravelHandler{
		userService: userService,
	}
}

func (h *TravelHandler) Travel(c *gin.Context) {
	h.getTravels(c)
}

func (h *TravelHandler) getTravels(c *gin.Context) {
	id_user := c.Query("id_user")

	if id_user == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id_user is required"})
		return
	}

	travels, err := h.userService.GetTravels(c.Request.Context(), id_user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, travels)
}