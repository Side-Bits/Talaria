package repositories

import (
	"context"
	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"
)

type ClientRepository struct {
	db database.DBExecutor
}

func NewClientRepository(db database.DBExecutor) *ClientRepository {
	return &ClientRepository{db: db}
}

func (r *ClientRepository) Create(ctx context.Context, client *models.Client) error {
	query := `
        INSERT INTO clients (id_user, name, surname1, surname2, photo)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_user;
    `

	return r.db.QueryRow(ctx, query, client.ID, client.Name, client.Surname1, client.Surname2, client.Photo).Scan(&client.ID)
}
