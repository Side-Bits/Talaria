package handlers

import (
	"net/http"

	"talaria/internal/api/middleware"
	"talaria/internal/domain/models"
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

// Activity godoc
// @Summary List activities
// @Description Returns activities for a travel.
// @Tags activities
// @Produce json
// @Param id_travel query string true "Travel ID"
// @Success 200 {array} models.Activity
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /activities [get]
func (h *ActivityHandler) Activity(c *gin.Context) {
	h.getActivities(c)
}

// AuthenticatedActivity godoc
// @Summary List activities
// @Description Returns activities for a travel.
// @Tags activities
// @Produce json
// @Security BearerAuth
// @Param id_travel query string true "Travel ID"
// @Success 200 {array} models.Activity
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/activities [get]
func (h *ActivityHandler) AuthenticatedActivity(c *gin.Context) {
	h.getActivities(c)
}

func (h *ActivityHandler) getActivities(c *gin.Context) {
	id_travel := c.Query("id_travel")

	if id_travel == "" {
		respondBadRequest(c, "id_travel is required", nil)
		return
	}

	activities, err := h.activityService.GetActivities(c.Request.Context(), id_travel)
	if err != nil {
		respondInternalError(c, "failed to fetch activities", err)
		return
	}

	c.JSON(http.StatusOK, activities)
}

// InsertActivity godoc
// @Summary Create an activity
// @Description Creates an activity for the authenticated user.
// @Tags activities
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body models.Activity true "Activity payload"
// @Success 200
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/activities/create [post]
func (h *ActivityHandler) InsertActivity(c *gin.Context) {
	var newActivity models.Activity

	if err := c.ShouldBindJSON(&newActivity); err != nil {
		respondBadRequest(c, "invalid request body", err)
		return
	}

	userID := middleware.GetUserID(c)

	if userID == -1 {
		respondBadRequest(c, "id_user is required", nil)
		return
	}

	err2 := h.activityService.CreateActivity(c.Request.Context(), userID, newActivity)

	if err2 != nil {
		respondInternalError(c, "failed to create activity", err2)
		return
	}
}
