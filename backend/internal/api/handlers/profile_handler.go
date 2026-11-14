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

type UpdateProfileRequest struct {
	Name     	string `json:"name" binding:"required,max=64"`
	Surname1 	string `json:"surname1" binding:"max=64"`
	Surname2 	string `json:"surname2" binding:"max=64"`
	Birthdate 	string `json:"birthdate" binding:"required"`
}

type ProfileResponse = models.Profile

type ProfileHandler struct {
	profileService services.ProfileService
}

func NewProfileHandler(profileService services.ProfileService) *ProfileHandler {
	return &ProfileHandler{profileService: profileService}
}

func (h *ProfileHandler) GetProfile(c *gin.Context) {
	userID, ok := middleware.GetUserIDOrAbort(c)
	if !ok {
		return
	}

	profile, err := h.profileService.GetProfile(c.Request.Context(), userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			respondNotFound(c, "profile not found", err)
			return
		}
		respondInternalError(c, "failed to fetch profile", err)
		return
	}

	c.JSON(http.StatusOK, profile)
}

func (h *ProfileHandler) GetProfileData(c *gin.Context) {
	userID, ok := middleware.GetUserIDOrAbort(c)
	if !ok {
		return
	}

	profileData, err := h.profileService.GetProfileData(c.Request.Context(), userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			respondNotFound(c, "profile not found", err)
			return
		}
		respondInternalError(c, "failed to fetch profileData", err)
		return
	}

	c.JSON(http.StatusOK, profileData)
}

func (h *ProfileHandler) UpdateProfile(c *gin.Context) {
	var req UpdateProfileRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		respondBadRequest(c, "invalid request body", err)
		return
	}

	userID, ok := middleware.GetUserIDOrAbort(c)
	if !ok {
		return
	}

	profile, err := h.profileService.UpdateProfile(c.Request.Context(), userID, req.Name, req.Surname1, req.Surname2, req.Birthdate)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			respondNotFound(c, "profile not found", err)
			return
		}
		respondInternalError(c, "failed to fetch profile", err)
		return
	}

	c.JSON(http.StatusOK, profile)
}