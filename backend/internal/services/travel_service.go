package services

import (
	"context"
	"talaria/internal/domain/models"
)

func (s *UserService) GetTravels(ctx context.Context, id_user string) ([]models.Travel, error) {
	return s.userRepo.GetTravels(ctx, id_user)
}