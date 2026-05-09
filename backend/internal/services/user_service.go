package services

import (
	"context"

	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"
)

type UserService struct {
	store *RepositoryStore
}

func NewUserService(db database.TxBeginner) *UserService {
	return &UserService{
		store: NewStore(db),
	}
}

func (s *UserService) GetUserByID(ctx context.Context, userID int64) (*models.User, error) {
	return s.store.Repos().Users.GetByID(ctx, userID)
}
