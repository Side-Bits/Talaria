package handlers

import (
	"net/http"

	"talaria/internal/api/middleware"
	"talaria/internal/domain/models"
	"talaria/internal/pkgs/utils"
	"talaria/internal/services"

	"github.com/gin-gonic/gin"
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
	id_travel := c.Param("travel_id")

	if id_travel == "" {
		respondBadRequest(c, "travel id is required", nil)
		return
	}

	activities, err := h.activityService.GetActivities(c.Request.Context(), id_travel)
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

	travelID, err := utils.ParsePositiveInt64Param(c, "travel_id")
	if err != nil {
		respondBadRequest(c, "invalid travel id", err)
		return
	}

	activityID, err := utils.ParsePositiveInt64Param(c, "activity_id")
	if err != nil {
		respondBadRequest(c, "invalid activity id", err)
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

	// TODO: Està bé?
	travelID, err := utils.ParsePositiveInt64Param(c, "travel_id")
	if err != nil {
		respondBadRequest(c, "invalid travel id", err)
		return
	}

	newActivity.Id_travel = travelID

	userID, ok := middleware.GetUserIDOrAbort(c)
	if !ok {
		return
	}

	err2 := h.activityService.CreateActivity(c.Request.Context(), userID, newActivity)

	if err2 != nil {
		respondInternalError(c, "failed to create activity", err2)
		return
	}
}
