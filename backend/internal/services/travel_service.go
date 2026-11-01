package services

import (
	"context"

	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"
)

type TravelService struct {
	store *RepositoryStore
}

func NewTravelService(db database.TxBeginner) *TravelService {
	return &TravelService{
		store: NewStore(db),
	}
}

func (s *TravelService) GetTravels(ctx context.Context, userId int64) (map[string][]models.Travel, error) {
	return s.store.Repos().Travels.GetTravels(ctx, userId)
}

func (s *TravelService) GetTravelByID(ctx context.Context, userId int64, travelId int64) (models.Travel, error) {
	return s.store.Repos().Travels.GetTravelByID(ctx, userId, travelId)
}

func (s *TravelService) CreateTravel(ctx context.Context, userId int64, name string, start_date string, end_date string, description string, image string) error {
	return s.store.InTx(ctx, func(repos Repos) error {
		Id_travel, err := repos.Travels.CreateTravel(ctx, name, start_date, end_date, description, image)
		if err != nil {
			return err
		}

		return repos.Travels.AddClientTravels(ctx, Id_travel, userId)
	})
}

func (s *TravelService) DeleteTravel(ctx context.Context, travelID int64) error {
	return s.store.InTx(ctx, func(repos Repos) error {
		if err := repos.Activities.DeleteActivitiesByTravel(ctx, travelID); err != nil {
			return err
		}

		return repos.Travels.DeleteTravel(ctx, travelID)
	})
}
