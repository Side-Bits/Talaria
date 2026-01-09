package repositories

import (
	"context"
	"database/sql"
	"fmt"
	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"

	"github.com/google/uuid"
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
        INSERT INTO users (id_user, username, email, password, terms)
        VALUES ($1, $2, $3, $4, true)
        RETURNING id_user;
    `

	id, err := uuid.NewV7()
	if err != nil {
		return fmt.Errorf("Failed to generate UUID: %w", err)
	}

	return r.db.QueryRow(ctx, query, id, user.Name, user.Email, user.Password).Scan(&user.ID)
}

func (r *UserRepository) GetByID(ctx context.Context, userID string) (*models.User, error) {
	query := `
				SELECT id_user, username, email, password FROM Users WHERE id_user = $1
		`
	var user models.User
	err := r.db.QueryRow(ctx, query, userID).Scan(&user.ID, &user.Name, &user.Email, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("GetByID %s: user not found", userID)
		}
		return nil, fmt.Errorf("GetByID %s: %e", userID, err)
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

func (r *UserRepository) GetUserIdByToken(ctx context.Context, token string) (string, error) {
	query := `
				SELECT id_user FROM Tokens WHERE token = $1 AND is_active = true
		`
	var userId string
	err := r.db.QueryRow(ctx, query, token).Scan(&userId)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("getUserIdByToken %s: unknown token", token)
		}
		return "", fmt.Errorf("getUserIdByToken %s: %e", token, err)
	}

	return userId, nil
}
