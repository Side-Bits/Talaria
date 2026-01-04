package services

import (
	"context"
	"errors"
	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"
	"talaria/internal/pkgs/utils"
	"talaria/internal/repositories"
	"time"
)

const (
	tokenValidityPeriod = 90 * 24 * time.Hour // 90 days
	tokenLength         = 32                  // token length in bytes
)

type AuthService struct {
	db        database.TxBeginner
	userRepo  *repositories.UserRepository
	tokenRepo *repositories.TokenRepository
}

func NewAuthService(db database.TxBeginner) *AuthService {
	return &AuthService{
		db:        db,
		userRepo:  repositories.NewUserRepository(db),
		tokenRepo: repositories.NewTokenRepository(db, tokenValidityPeriod), // tokens valid for 3months
	}
}

func (s *AuthService) Register(ctx context.Context, user *models.User) (string, error) {
	// Start transaction
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer tx.Rollback(ctx) // Rollback if not committed

	hash, err := utils.HashPassword(user.Password)
	if err != nil {
		return "", err
	}

	user.Password = hash

	if err := s.userRepo.Create(ctx, user); err != nil {
		return "", err
	}

	tokenString, err := generateAndSaveNewToken(ctx, s.tokenRepo, *user)
	if err != nil {
		return "", err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		return "", err
	}

	return tokenString, nil
}

func (s *AuthService) Login(ctx context.Context, identifier string, password string) (*models.User, string, error) {
	// 1. Check user exists and password hash is correct
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, "", err
	}
	defer tx.Rollback(ctx) // Rollback if not committed

	user, err := s.userRepo.GetByUsernameOrEmail(ctx, identifier)
	if err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	if err := utils.VerifyPassword(user.Password, password); err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	tokenString, err := generateAndSaveNewToken(ctx, s.tokenRepo, *user)
	if err != nil {
		return nil, "", err
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, "", err
	}

	return user, tokenString, nil
}

func generateAndSaveNewToken(ctx context.Context, repo *repositories.TokenRepository, user models.User) (string, error) {
	tokenString, err := utils.GenerateRandomToken(tokenLength)
	if err != nil {
		return "", err
	}

	if err := repo.CreateDefault(ctx, tokenString, user.ID); err != nil {
		return "", err
	}
	return tokenString, nil
}

func (s *AuthService) ValidateToken(ctx context.Context, tokenString string) (string, error) {
	token, err := s.tokenRepo.FindByToken(ctx, tokenString)
	if err != nil {
		return "", err
	}

	if token.IsActive && token.ExpiresAt.After(time.Now()) {
		// TODO update last used timestamp
		return token.UserID, nil
	}

	return "", nil
}

// RevokeToken explicitly revokes a token
func (s *AuthService) RevokeToken(ctx context.Context, tokenString string) error {
	return s.tokenRepo.Deactivate(ctx, tokenString)
}
