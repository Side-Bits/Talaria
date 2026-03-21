package repositories

import (
	"context"
	"talaria/internal/domain/models"
)

func (r *UserRepository) GetActivities(ctx context.Context, id_travel string) ([]models.Activity, error) {
	var activities []models.Activity

	rows, err := r.db.Query(ctx, `
		SELECT activities.id_activity, activities.id_travel, activities.name,
			activities.description, activities.location, activities.start_date,
			activities.end_date, activities.price
		FROM activities
		WHERE activities.id_travel = $1
		ORDER BY activities.start_date ASC
	`, id_travel)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var activity models.Activity
		if err := rows.Scan(
			&activity.ID,
			&activity.Id_travel,
			&activity.Name,
			&activity.Description,
			&activity.Location,
			&activity.StartDate,
			&activity.EndDate,
			&activity.Price,
		); err != nil {
			return nil, err
		}
		activities = append(activities, activity)
	}

	return activities, rows.Err()
}

func (r *UserRepository) CreateActivity(ctx context.Context, id_travel string, name string, description string, location string, start_date string, end_date string) (string, error) {
	query := `
        INSERT INTO activities (id_travel, name, description, location, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id_activity
	`

	var id_activity string

	err := r.db.QueryRow(ctx, query, id_travel, name, description, location, start_date, end_date).Scan(&id_activity)

	return id_activity, err
}

func (r *UserRepository) AddClientActivities(ctx context.Context, id_activity string, id_user string) error {
	query := `
        INSERT INTO clients_activities (id_activity, id_user)
        VALUES ($1, $2)
	`

	_, err := r.db.Exec(ctx, query, id_activity, id_user)

	return err
}
