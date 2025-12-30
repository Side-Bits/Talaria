package repositories

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"
)

type TokenRepository struct {
	db       database.DBExecutor
	tokenTTL time.Duration
}

func NewTokenRepository(db database.DBExecutor, tokenTTL time.Duration) *TokenRepository {
	return &TokenRepository{db: db, tokenTTL: tokenTTL}
}

func (r *TokenRepository) Create(ctx context.Context, token *models.UserToken) error {
	query := `
        INSERT INTO user_tokens (user_id, token, created_at, expires_at, is_active)
        VALUES ($1, $2, $3, $4, $5)
    `
	_, err := r.db.Exec(ctx, query,
		token.UserID,
		token.Token,
		token.CreatedAt,
		token.ExpiresAt,
		token.IsActive,
	)
	return err
}

func (r *TokenRepository) CreateDefault(ctx context.Context, token string, userId string) error {
	query := `
        INSERT INTO user_tokens (user_id, token, created_at, expires_at, is_active)
        VALUES ($1, $2, $3, $4, $5)
    `
	_, err := r.db.Exec(ctx, query,
		userId,
		token,
		time.Now(),
		time.Now().Add(r.tokenTTL),
		true,
	)
	return err
}

func (r *TokenRepository) FindByToken(ctx context.Context, tokenString string) (*models.UserToken, error) {
	query := `
        SELECT user_id, token, created_at, expires_at, is_active
        FROM user_tokens 
        WHERE token = $1
    `

	var token models.UserToken
	err := r.db.QueryRow(ctx, query, tokenString).Scan(
		&token.UserID,
		&token.Token,
		&token.CreatedAt,
		&token.ExpiresAt,
		&token.IsActive,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("token not found")
		}
		return nil, err
	}

	return &token, nil
}

func (r *TokenRepository) FindByUserID(ctx context.Context, userID string) ([]models.UserToken, error) {
	query := `
        SELECT user_id, token, created_at, expires_at, is_active
        FROM user_tokens 
        WHERE user_id = $1 AND is_active = true
        ORDER BY created_at DESC
    `

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tokens []models.UserToken
	for rows.Next() {
		var token models.UserToken
		if err := rows.Scan(
			&token.UserID,
			&token.Token,
			&token.CreatedAt,
			&token.ExpiresAt,
			&token.IsActive,
		); err != nil {
			return nil, err
		}
		tokens = append(tokens, token)
	}

	return tokens, nil
}

func (r *TokenRepository) Deactivate(ctx context.Context, tokenString string) error {
	query := `UPDATE user_tokens SET is_active = false WHERE token = $1`
	_, err := r.db.Exec(ctx, query, tokenString)
	return err
}

// CleanupExpiredTokens removes expired tokens from the database
func (r *TokenRepository) CleanupExpiredTokens(ctx context.Context) (int64, error) {
	query := `DELETE FROM user_tokens WHERE expires_at < $1`
	result, err := r.db.Exec(ctx, query, time.Now())
	if err != nil {
		return 0, err
	}

	return result.RowsAffected(), nil
}
