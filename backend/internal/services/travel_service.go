package services

import (
	"context"
	"talaria/internal/domain/models"
)

func (s *UserService) GetTravels(ctx context.Context, id_user string) (map[string][]models.Travel, error) {
	return s.userRepo.GetTravels(ctx, id_user)
}

func (s *UserService) CreateTravel(ctx context.Context, id_user string, name string, start_date string, end_date string) error {
	// Start transaction

	id_travel, nil := s.userRepo.CreateTravel(ctx, name, start_date, end_date)

	s.userRepo.AddClientTravels(ctx, id_travel, id_user)

	// Commit transaction

	return nil
}

// TODO GetTravel

func (s *UserService) GetActivities(ctx context.Context, id_user string) ([]models.Activity, error) {
	return s.userRepo.GetActivities(ctx, id_user)
}

func (s *UserService) CreateActivity(ctx context.Context, id_user string, id_travel string, name string, description string, location string, start_date string, end_date string) error {
	// Start transaction

	id_activity, nil := s.userRepo.CreateActivity(ctx, id_travel, name, description, location, start_date, end_date)

	s.userRepo.AddClientActivities(ctx, id_activity, id_user)

	// Commit transaction

	return nil
}

// TODO GetActivity