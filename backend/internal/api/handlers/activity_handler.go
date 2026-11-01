package handlers

import (
	"errors"
	"net/http"

	"talaria/internal/api/middleware"
	"talaria/internal/domain/models"
	"talaria/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type ActivityHandler struct {
	activityService services.ActivityService
}

func NewActivityHandler(activityService services.ActivityService) *ActivityHandler {
	return &ActivityHandler{
		activityService: activityService,
	}
}

// GetActivities godoc
// @Summary List activities
// @Description Returns activities for a travel.
// @Tags activities
// @Produce json
// @Security BearerAuth
// @Param travel_id path int true "Travel ID"
// @Success 200 {array} models.Activity
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/travels/{travel_id}/activities [get]
func (h *ActivityHandler) GetActivities(c *gin.Context) {
	travelID, ok := parseTravelID(c)
	if !ok {
		return
	}

	activities, err := h.activityService.GetActivities(c.Request.Context(), travelID)
	if err != nil {
		respondBadRequest(c, "failed to fetch activities", err)
		return
	}

	c.JSON(http.StatusOK, activities)
}

// GetActivityById godoc
// @Summary Get an Activity by ID
// @Description Returns an activity of a travel
// @Tags activities
// @Produce json
// @Security BearerAuth
// @Param travel_id path int true "Travel ID"
// @Param activity_id path int true "Activity ID"
// @Success 200 {object} models.Activity
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/travels/{travel_id}/activities/{activity_id} [get]
func (h *ActivityHandler) GetActivityById(c *gin.Context) {
	userID, ok := middleware.GetUserIDOrAbort(c)
	if !ok {
		return
	}

	travelID, activityID, ok := parseActivityIDs(c)
	if !ok {
		return
	}

	activity, err := h.activityService.GetActivity(c.Request.Context(), userID, travelID, activityID)
	if err != nil {
		respondInternalError(c, "error getitng the activity", err)
		return
	}

	c.JSON(http.StatusOK, activity)
}

// CreateActivity godoc
// @Summary Create an activity
// @Description Creates an activity for the authenticated user.
// @Tags activities
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param travel_id path int true "Travel id of the activity"
// @Param request body models.Activity true "Activity payload"
// @Success 200
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/travels/{travel_id}/activities/create [post]
func (h *ActivityHandler) CreateActivity(c *gin.Context) {
	var newActivity models.Activity

	if err := c.ShouldBindJSON(&newActivity); err != nil {
		respondBadRequest(c, "invalid request body", err)
		return
	}

	travelID, ok := parseTravelID(c)
	if !ok {
		return
	}

	newActivity.Id_travel = travelID

	userId, ok := middleware.GetUserIDOrAbort(c)
	if !ok {
		return
	}

	err2 := h.activityService.CreateActivity(c.Request.Context(), userId, newActivity)

	if err2 != nil {
		respondInternalError(c, "failed to create activity", err2)
		return
	}
}

func (h *ActivityHandler) DeleteActivity(c *gin.Context) {
	_, ok := middleware.GetUserIDOrAbort(c)
	if !ok {
		return
	}

	travelID, activityID, ok := parseActivityIDs(c)
	if !ok {
		return
	}

	if err := h.activityService.DeleteActivity(c.Request.Context(), travelID, activityID); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			respondNotFound(c, "activity not found", err)
			return
		}

		respondInternalError(c, "failed to delete activity", err)
		return
	}

	c.Status(http.StatusNoContent)
}