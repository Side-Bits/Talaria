package services

import (
	"context"

	"talaria/internal/domain/models"
)

func (s *UserService) GetTravels(ctx context.Context, userID int64) (map[string][]models.Travel, error) {
	return s.userRepo.GetTravels(ctx, userID)
}

func (s *UserService) CreateTravel(ctx context.Context, userID int64, name string, start_date string, end_date string) error {
	// TODO: Start transaction

	id_travel, err := s.userRepo.CreateTravel(ctx, name, start_date, end_date)
	if err != nil {
		return err
	}

	err = s.userRepo.AddClientTravels(ctx, id_travel, userID)

	// TODO Commit transaction

	return err
}

// TODO GetTravel

func (s *UserService) GetActivities(ctx context.Context, userID string) ([]models.Activity, error) {
	return s.userRepo.GetActivities(ctx, userID)
}

func (s *UserService) CreateActivity(ctx context.Context, userID int64, activity models.Activity) error {
	// TODO Start transaction

	id_activity, err := s.userRepo.CreateActivity(ctx, activity)
	if err != nil {
		return err
	}

	if err := s.userRepo.AddClientActivities(ctx, id_activity, userID); err != nil {
		return err
	}

	// TODO Commit transaction

	return nil
}

// TODO GetActivity
