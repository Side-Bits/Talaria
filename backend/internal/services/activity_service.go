package services

import (
	"context"

	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"
)

type ActivityService struct {
	store *RepositoryStore
}

func NewActivityService(db database.TxBeginner) *ActivityService {
	return &ActivityService{
		store: NewStore(db),
	}
}

func (s *ActivityService) GetActivities(ctx context.Context, userID string) ([]models.Activity, error) {
	return s.store.Repos().Activities.GetActivities(ctx, userID)
}

func (s *ActivityService) CreateActivity(ctx context.Context, userID int64, activity models.Activity) error {
	return s.store.InTx(ctx, func(repos Repos) error {
		id_activity, err := repos.Activities.CreateActivity(ctx, activity)
		if err != nil {
			return err
		}

		return repos.Activities.AddClientActivities(ctx, id_activity, userID)
	})
}

// TODO GetActivity
