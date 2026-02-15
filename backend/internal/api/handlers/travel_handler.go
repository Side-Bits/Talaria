package handlers

import (
	"net/http"
	"talaria/internal/api/middleware"
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

func (h *TravelHandler) InsertTravel(c *gin.Context) {
	var data map[string]string

	if err := c.BindJSON(&data); err != nil {
		c.JSON(400, gin.H{"error 1": err.Error()})
		return
	}

	id_user := middleware.GetUserID(c)

	if id_user == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error 2": "id_user is required "})
		return
	}

	name := data["name"]
	start_date := data["start_date"]
	end_date := data["end_date"]

	err2 := h.userService.CreateTravel(c.Request.Context(), id_user, name, start_date, end_date)
	
	if err2 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error 3": err2.Error()})
		return
	}
}
