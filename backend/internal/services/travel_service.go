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

func (s *TravelService) GetTravels(ctx context.Context, userID int64) (map[string][]models.Travel, error) {
	return s.store.Repos().Travels.GetTravels(ctx, userID)
}

func (s *TravelService) CreateTravel(ctx context.Context, userID int64, name string, start_date string, end_date string) error {
	return s.store.InTx(ctx, func(repos Repos) error {
		id_travel, err := repos.Travels.CreateTravel(ctx, name, start_date, end_date)
		if err != nil {
			return err
		}

		return repos.Travels.AddClientTravels(ctx, id_travel, userID)
	})
}
