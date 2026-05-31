package handlers

import (
	"errors"
	"net/http"

	"talaria/internal/api/middleware"
	"talaria/internal/domain/models"
	"talaria/internal/pkgs/utils"
	"talaria/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type CreateTravelRequest struct {
	Name      string `json:"name" binding:"required" example:"Summer vacation"`
	StartDate string `json:"start_date" binding:"required" example:"2026-07-01"`
	EndDate   string `json:"end_date" binding:"required" example:"2026-07-10"`
}

type TravelGroupResponse map[string][]models.Travel

type TravelHandler struct {
	travelService services.TravelService
}

func NewTravelHandler(travelService services.TravelService) *TravelHandler {
	return &TravelHandler{
		travelService: travelService,
	}
}

// GetTravels godoc
// @Summary List travels
// @Description Returns travels for the authenticated user.
// @Tags travels
// @Produce json
// @Security BearerAuth
// @Success 200 {object} TravelGroupResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/travels [get]
func (h *TravelHandler) GetTravels(c *gin.Context) {
	userID, ok := middleware.GetUserIDOrAbort(c)
	if !ok {
		return
	}

	travels, err := h.travelService.GetTravels(c.Request.Context(), userID)
	if err != nil {
		respondInternalError(c, "failed to fetch travels", err)
		return
	}

	c.JSON(http.StatusOK, travels)
}

// GetTravelByID godoc
// @Summary Get a travel
// @Description Returns a travel for the authenticated user.
// @Tags travels
// @Produce json
// @Security BearerAuth
// @Param id path int true "Travel ID"
// @Success 200 {object} models.Travel
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/travels/{id} [get]
func (h *TravelHandler) GetTravelByID(c *gin.Context) {
	userID, ok := middleware.GetUserIDOrAbort(c)
	if !ok {
		return
	}

	travelID, err := utils.ParsePositiveInt64Param(c, "id")
	if err != nil {
		respondBadRequest(c, "Invalid id", err)
		return
	}

	travel, err := h.travelService.GetTravelByID(c.Request.Context(), userID, travelID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			respondNotFound(c, "travel not found", err)
			return
		}

		respondInternalError(c, "failed to fetch travel", err)
		return
	}

	c.JSON(http.StatusOK, travel)
}

// CreateTravel godoc
// @Summary Create a travel
// @Description Creates a travel for the authenticated user.
// @Tags travels
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body CreateTravelRequest true "Travel payload"
// @Success 200
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/travels/create [post]
func (h *TravelHandler) CreateTravel(c *gin.Context) {
	var req CreateTravelRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		respondBadRequest(c, "invalid request body", err)
		return
	}

	userID, ok := middleware.GetUserIDOrAbort(c)

	if !ok {
		return
	}

	name := req.Name
	start_date := req.StartDate
	end_date := req.EndDate

	err := h.travelService.CreateTravel(c.Request.Context(), userID, name, start_date, end_date)
	if err != nil {
		respondInternalError(c, "failed to create travel", err)
		return
	}
}
