package repositories

import (
	"context"
	"database/sql"
	"fmt"
	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"
	"time"
)

type TokenRepository struct {
	db       database.DBExecutor
	tokenTTL time.Duration
}

func NewTokenRepository(db database.DBExecutor, tokenTTL time.Duration) *TokenRepository {
	return &TokenRepository{db: db, tokenTTL: tokenTTL}
}

func (r *TokenRepository) CreateDefault(ctx context.Context, token string, userId string) error {
	query := `
	      INSERT INTO session_token (id_user, token, created_at, expires_at)
		    VALUES ($1, $2, $3, $4) 
	      ON CONFLICT (id_user) DO UPDATE SET 
            token = EXCLUDED.token,
            created_at = EXCLUDED.created_at,
            expires_at = EXCLUDED.expires_at;
    `
	_, err := r.db.Exec(ctx, query,
		userId,
		token,
		time.Now(),
		time.Now().Add(r.tokenTTL),
	)
	return err
}

func (r *TokenRepository) FindByToken(ctx context.Context, tokenString string) (*models.UserToken, error) {
	query := `
        SELECT id_user, token, created_at, expires_at, is_active
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
        SELECT id_user, token, created_at, expires_at, is_active
        FROM user_tokens 
        WHERE id_user = $1 AND is_active = true
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
