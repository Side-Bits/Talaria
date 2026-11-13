package services

import (
	"context"

	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"
)

type ProfileService struct {
	store *RepositoryStore
}

func NewProfileService(db database.TxBeginner) *ProfileService {
	return &ProfileService{
		store: NewStore(db),
	}
}

func (s *ProfileService) GetProfile(ctx context.Context, userID int64) (*models.Profile, error) {
	return s.store.Repos().Profiles.GetProfile(ctx, userID)
}

func (s *ProfileService) UpdateProfile(ctx context.Context, userID int64, name string, surname1 string, surname2 string, birthdate string) (*models.Profile, error) {
	var profile *models.Profile
	err := s.store.InTx(ctx, func(repos Repos) error {
		if err := repos.Profiles.UpdateProfile(ctx, userID, name, surname1, surname2, birthdate); err != nil {
			return err
		}

		var err error
		profile, err = repos.Profiles.GetProfile(ctx, userID)
		return err
	})

	if err != nil {
		return nil, err
	}

	return profile, nil
}
