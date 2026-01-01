package services

import (
	"context"
	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"
	"talaria/internal/repositories"
)

type UserService struct {
	userRepo repositories.UserRepository
}

func NewUserService(db database.DBExecutor) *UserService {
	return &UserService{
		userRepo: *repositories.NewUserRepository(db),
	}
}

func (s *UserService) GetUserByID(ctx context.Context, id_user string) (*models.User, error) {
	return s.userRepo.GetByID(ctx, id_user)
}