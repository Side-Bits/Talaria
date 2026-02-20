package handlers

import (
	"net/http"
	"talaria/internal/api/middleware"
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
		respondBadRequest(c, "id_travel is required", nil)
		return
	}

	activities, err := h.userService.GetActivities(c.Request.Context(), id_travel)
	if err != nil {
		respondInternalError(c, "failed to fetch activities", err)
		return
	}

	c.JSON(http.StatusOK, activities)
}

func (h *ActivityHandler) InsertActivity(c *gin.Context) {
	var data map[string]string

	if err := c.BindJSON(&data); err != nil {
		respondBadRequest(c, "invalid request body", err)
		return
	}

	id_user := middleware.GetUserID(c)

	if id_user == "" {
		respondBadRequest(c, "id_user is required", nil)
		return
	}

	id_travel := data["id_travel"]
	name := data["name"]
	description := data["description"]
	location := data["loaction"]
	start_date := data["start_date"]
	end_date := data["end_date"]

	err2 := h.userService.CreateActivity(c.Request.Context(), id_user, id_travel, name, description, location, start_date, end_date)

	if err2 != nil {
		respondInternalError(c, "failed to create activity", err2)
		return
	}
}
