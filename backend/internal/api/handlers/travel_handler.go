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
	h.getTravels(c)
}

func (h *TravelHandler) getTravels(c *gin.Context) {
	id_user := c.Query("id_user")

	if id_user == "" {
		respondBadRequest(c, "id_user is required", nil)
		return
	}

	travels, err := h.userService.GetTravels(c.Request.Context(), id_user)
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

	id_user := middleware.GetUserID(c)

	if id_user == "" {
		respondBadRequest(c, "id_user is required", nil)
		return
	}

	name := req.Name
	start_date := req.StartDate
	end_date := req.EndDate

	err := h.userService.CreateTravel(c.Request.Context(), id_user, name, start_date, end_date)
	if err != nil {
		respondInternalError(c, "failed to create travel", err)
		return
	}
}
