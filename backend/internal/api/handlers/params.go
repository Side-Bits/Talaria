package handlers

import (
	"talaria/internal/pkgs/utils"

	"github.com/gin-gonic/gin"
)

func parseTravelID(c *gin.Context) (int64, bool) {
	travelID, err := utils.ParsePositiveInt64Param(c, "travel_id")
	if err != nil {
		respondBadRequest(c, "invalid travel id", err)
		return 0, false
	}

	return travelID, true
}

func parseActivityIDs(c *gin.Context) (int64, int64, bool) {
	travelID, ok := parseTravelID(c)
	if !ok {
		return 0, 0, false
	}

	activityID, err := utils.ParsePositiveInt64Param(c, "activity_id")
	if err != nil {
		respondBadRequest(c, "invalid activity id", err)
		return 0, 0, false
	}

	return travelID, activityID, true
}
