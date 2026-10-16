package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"
	"time"
)

type TokenRepository struct {
	db database.DBExecutor
}

func NewTokenRepository(db database.DBExecutor) *TokenRepository {
	return &TokenRepository{db: db}
}

func (r *TokenRepository) CreateDefault(ctx context.Context, tokenHash string, userID int64, tokenTTL time.Duration) error {
	query := `
	      INSERT INTO session_token (id_user, token_hash, created_at, expires_at)
		    VALUES ($1, $2, $3, $4)
    `
	_, err := r.db.Exec(ctx, query,
		userID,
		tokenHash,
		time.Now(),
		time.Now().Add(tokenTTL),
	)
	return err
}

func (r *TokenRepository) FindByToken(ctx context.Context, tokenHash string) (*models.UserToken, error) {
	query := `
        SELECT id_user, token_hash, created_at, expires_at
        FROM session_token
        WHERE token_hash = $1
    `

	var token models.UserToken
	err := r.db.QueryRow(ctx, query, tokenHash).Scan(
		&token.UserID,
		&token.Token,
		&token.CreatedAt,
		&token.ExpiresAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("token not found")
		}
		return nil, err
	}

	return &token, nil
}

func (r *TokenRepository) Deactivate(ctx context.Context, tokenHash string) error {
	query := `DELETE FROM session_token WHERE token_hash = $1`
	_, err := r.db.Exec(ctx, query, tokenHash)
	return err
}

// CleanupExpiredTokens removes expired tokens from the database
func (r *TokenRepository) CleanupExpiredTokens(ctx context.Context) (int64, error) {
	query := `DELETE FROM session_token WHERE expires_at < $1`
	result, err := r.db.Exec(ctx, query, time.Now())
	if err != nil {
		return 0, err
	}

	return result.RowsAffected(), nil
}

// Removes all session tokens of a user
func (r *TokenRepository) CloseAllSessions(ctx context.Context, userId int64) error {
	query := `DELETE FROM session_token WHERE id_user = $1`
	_, err := r.db.Exec(ctx, query, userId)
	if err != nil {
		return err
	}

	return nil
}
