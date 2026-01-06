package services

import (
	"context"
	"talaria/internal/domain/models"
)

func (s *UserService) GetTravels(ctx context.Context, id_user string) ([]models.Travel, error) {
	return s.userRepo.GetTravels(ctx, id_user)
}

func (s *UserService) GetActivities(ctx context.Context, id_travel string) ([]models.Activity, error) {
	return s.userRepo.GetActivities(ctx, id_travel)
}

// TODO GetActivity