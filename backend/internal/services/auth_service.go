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

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrExpiredToken = errors.New("expired token")
)

type AuthService struct {
	store *RepositoryStore
}

func NewAuthService(db database.TxBeginner) *AuthService {
	return &AuthService{
		store: NewStore(db),
	}
}

func (s *AuthService) Register(ctx context.Context, user *models.User) (string, error) {
	var tokenString string
	err := s.store.InTx(ctx, func(repos Repos) error {
		hash, err := utils.HashPassword(user.Password)
		if err != nil {
			return errors.New("Failed to hash password " + user.Password + " -> " + err.Error())
		}

		user.Password = hash

		if err := repos.Users.Create(ctx, user); err != nil {
			return errors.New("Failed to create user: " + err.Error())
		}

		tokenString, err = generateAndSaveNewToken(ctx, repos.Tokens, *user)
		if err != nil {
			return errors.New("Failed to generate auth token: " + err.Error())
		}

		// TODO create client with more info (surname, photo, etc) and update user with client id.
		// For now, we just create a client with the same id as the user and empty info
		if err := repos.Clients.Create(ctx, &models.Client{ID: user.ID, Name: user.Name, Surname1: "", Surname2: "", Photo: ""}); err != nil {
			return errors.New("Failed to create client: " + err.Error())
		}

		return nil
	})
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (s *AuthService) Login(ctx context.Context, identifier string, password string) (*models.User, string, error) {
	var user *models.User
	var tokenString string

	err := s.store.InTx(ctx, func(repos Repos) error {
		var err error
		user, err = repos.Users.GetByUsernameOrEmail(ctx, identifier)
		if err != nil {
			return errors.New("invalid credentials: " + err.Error())
		}

		if err := utils.VerifyPassword(user.Password, password); err != nil {
			return errors.New("invalid credentials: " + err.Error())
		}

		tokenString, err = generateAndSaveNewToken(ctx, repos.Tokens, *user)
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return nil, "", err
	}

	return user, tokenString, nil
}

func generateAndSaveNewToken(ctx context.Context, repo *repositories.TokenRepository, user models.User) (string, error) {
	tokenString, err := utils.GenerateRandomToken(tokenLength)
	if err != nil {
		return "", err
	}

	if err := repo.CreateDefault(ctx, tokenString, user.ID, tokenValidityPeriod); err != nil {
		return "", err
	}
	return tokenString, nil
}

func (s *AuthService) ValidateToken(ctx context.Context, tokenString string) (int64, error) {
	token, err := s.store.Repos().Tokens.FindByToken(ctx, tokenString)
	if err != nil {
		return 0, ErrInvalidToken
	}

	if time.Now().After(token.ExpiresAt) {
		return 0, ErrExpiredToken
	}

	return token.UserID, nil
}

// RevokeToken explicitly revokes a token
func (s *AuthService) RevokeToken(ctx context.Context, tokenString string) error {
	return s.store.Repos().Tokens.Deactivate(ctx, tokenString)
}
