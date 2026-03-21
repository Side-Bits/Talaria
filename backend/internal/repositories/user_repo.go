package repositories

import (
	"context"
	"fmt"

	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"

	"github.com/jackc/pgx/v5"
)

type UserRepository struct {
	db database.DBExecutor
}

func NewUserRepository(db database.DBExecutor) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, user *models.User) error {
	query := `
        INSERT INTO users (username, email, password, terms)
        VALUES ($1, $2, $3, true)
        RETURNING id_user;
    `

	return r.db.QueryRow(ctx, query, user.Name, user.Email, user.Password).Scan(&user.ID)
}

func (r *UserRepository) GetByID(ctx context.Context, userID int64) (*models.User, error) {
	query := `
				SELECT id_user, username, email, password FROM users WHERE id_user = $1
		`
	var user models.User
	err := r.db.QueryRow(ctx, query, userID).Scan(&user.ID, &user.Name, &user.Email, &user.Password)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("GetByID %d: user not found", userID)
		}
		return nil, fmt.Errorf("GetByID %d: %w", userID, err)
	}

	return &user, nil
}

func (r *UserRepository) GetByUsernameOrEmail(ctx context.Context, identifier string) (*models.User, error) {
	query := `
		SELECT id_user, username, email, password
		FROM users
		WHERE username = $1 OR email = $1
		LIMIT 1
	`

	var user models.User
	err := r.db.QueryRow(ctx, query, identifier).
		Scan(&user.ID, &user.Name, &user.Email, &user.Password)

	if err == pgx.ErrNoRows {
		return nil, fmt.Errorf("GetByUsernameOrEmail %s: user not found", identifier)
	}
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) GetUserIdByToken(ctx context.Context, token string) (int64, error) {
	query := `
				SELECT id_user
				FROM session_token
				WHERE token = $1 AND expires_at > NOW()
		`
	var userID int64
	err := r.db.QueryRow(ctx, query, token).Scan(&userID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return -1, fmt.Errorf("getUserIdByToken %s: unknown token", token)
		}
		return -1, fmt.Errorf("getUserIdByToken %s: %w", token, err)
	}

	return userID, nil
}
