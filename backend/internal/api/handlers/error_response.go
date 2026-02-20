package handlers

import (
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
)

func respondBadRequest(c *gin.Context, message string, err error) {
	respondError(c, http.StatusBadRequest, message, err)
}

func respondInternalError(c *gin.Context, message string, err error) {
	respondError(c, http.StatusInternalServerError, message, err)
}

func respondError(c *gin.Context, status int, message string, err error) {
	response := gin.H{"error": message}

	if gin.Mode() == gin.DebugMode && err != nil {
		response["details"] = err.Error()
		response["stacktrace"] = string(debug.Stack())
	}

	c.JSON(status, response)
}
