package services

import (
	"context"
	"time"

	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"
	"talaria/internal/pkgs/utils"
	"talaria/internal/repositories"
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

	if err := s.userRepo.Create(ctx, user); err != nil {
		return "", err
	}

	// Generate and save token
	tokenString, err := utils.GenerateRandomToken(tokenLength)
	if err != nil {
		return "", err
	}

	if err := s.tokenRepo.CreateDefault(ctx, tokenString, user.ID); err != nil {
		return "", err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
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

func hashPassword(password string) string {
	// TODO
	// Use bcrypt or similar
	return password // placeholder
}
