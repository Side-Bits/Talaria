package handlers

import (
	"net/http"

	"talaria/internal/api/middleware"
	"talaria/internal/services"

	"github.com/gin-gonic/gin"
)

type CreateTravelRequest struct {
	Name      string `json:"name" binding:"required"`
	StartDate string `json:"start_date" binding:"required"`
	EndDate   string `json:"end_date" binding:"required"`
}

type TravelHandler struct {
	userService services.UserService
}

func NewTravelHandler(userService services.UserService) *TravelHandler {
	return &TravelHandler{
		userService: userService,
	}
}

func (h *TravelHandler) Travel(c *gin.Context) {
	userID := middleware.GetUserID(c)

	if userID == -1 {
		respondBadRequest(c, "id_user is required", nil)
		return
	}

	travels, err := h.userService.GetTravels(c.Request.Context(), userID)
	if err != nil {
		respondInternalError(c, "failed to fetch travels", err)
		return
	}

	c.JSON(http.StatusOK, travels)
}

func (h *TravelHandler) InsertTravel(c *gin.Context) {
	var req CreateTravelRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		respondBadRequest(c, "invalid request body", err)
		return
	}

	userID := middleware.GetUserID(c)

	if userID == -1 {
		respondBadRequest(c, "id_user is required", nil)
		return
	}

	name := req.Name
	start_date := req.StartDate
	end_date := req.EndDate

	err := h.userService.CreateTravel(c.Request.Context(), userID, name, start_date, end_date)
	if err != nil {
		respondInternalError(c, "failed to create travel", err)
		return
	}
}
