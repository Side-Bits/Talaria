package repositories

import (
	"context"

	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"
)

type ProfileRepository struct {
	db database.DBExecutor
}

func NewProfileRepository(db database.DBExecutor) *ProfileRepository {
	return &ProfileRepository{db: db}
}

func (r *ProfileRepository) GetProfile(ctx context.Context, userID int64) (*models.Profile, error) {
	query := `
		SELECT c.id_user,
			u.username,
			u.email,
			c.name,
			c.surname1,
			COALESCE(c.surname2, ''),
			c.birthdate,
			COALESCE(c.photo, ''),
			c.currency,
			c.language
		FROM clients c
		JOIN users u ON u.id_user = c.id_user
		WHERE c.id_user = $1
	`

	var profile models.Profile
	err := r.db.QueryRow(ctx, query, userID).Scan(
		&profile.ID,
		&profile.Username,
		&profile.Email,
		&profile.Name,
		&profile.Surname1,
		&profile.Surname2,
		&profile.Birthdate,
		&profile.Photo,
		&profile.Currency,
		&profile.Language,
	)

	if err != nil {
		return nil, err
	}

	return &profile, nil
}

func (r *ProfileRepository) GetProfileData(ctx context.Context, userID int64) (*models.ProfileData, error) {
	query := `
		SELECT c.id_user,
			u.username,
			u.email,
			c.name,
			c.surname1,
			COALESCE(c.surname2, ''),
			c.birthdate,
			COALESCE(c.photo, ''),
			c.currency,
			c.language,
			(
				SELECT COUNT(*)
				FROM clients_travels ct
				JOIN travels t ON t.id_travel = ct.id_travel
				WHERE ct.id_user = c.id_user
					AND t.id_status IN (1, 2, 4)
			),
			0::bigint,
			u.created_at
		FROM clients c
		JOIN users u ON u.id_user = c.id_user
		WHERE c.id_user = $1
	`

	var profile models.ProfileData
	err := r.db.QueryRow(ctx, query, userID).Scan(
		&profile.ID,
		&profile.Username,
		&profile.Email,
		&profile.Name,
		&profile.Surname1,
		&profile.Surname2,
		&profile.Birthdate,
		&profile.Photo,
		&profile.Currency,
		&profile.Language,
		&profile.NumTrips,
		&profile.NumCountries,
		&profile.Since,
	)

	if err != nil {
		return nil, err
	}

	return &profile, nil
}

func (r *ProfileRepository) UpdateProfile(ctx context.Context, userID int64, name string, surname1 string, surname2 string, birthdate string) error {
	query := `
		UPDATE clients
		SET name = $2, surname1 = $3, surname2 = $4, birthdate = $5
		WHERE id_user = $1
	`

	// TODO: update other parameters

	_, err := r.db.Exec(ctx, query, userID, name, surname1, surname2, birthdate)
	return err
}
