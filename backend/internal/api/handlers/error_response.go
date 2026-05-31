package handlers

import (
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

// Returns http.StatusBadRequest (400) with the message and the error if debud mode is enabled
func respondBadRequest(c *gin.Context, message string, err error) {
	respondError(c, http.StatusBadRequest, message, err)
}

// Returns http.StatusNotFound (404) with the message and the error if debud mode is enabled
func respondNotFound(c *gin.Context, message string, err error) {
	respondError(c, http.StatusNotFound, message, err)
}

// Returns http.StatusInternalServerError (500) with the message and the error if debud mode is
// enabled
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
