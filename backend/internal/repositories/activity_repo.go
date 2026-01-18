package repositories

import (
	"context"
	"talaria/internal/domain/models"
)

func (r *UserRepository) GetActivities(ctx context.Context, id_travel string) ([]models.Activity, error) {
	var activities []models.Activity

	rows, err := r.db.Query(ctx, `
		SELECT activities.name, activities.start_date, activities.end_date
		FROM activities
		WHERE activities.id_travel = $1
		ORDER BY activities.start_date ASC
	`, id_travel)

	if err != nil { return nil, err }

	defer rows.Close()

	for rows.Next() {
		var activity models.Activity
		if err := rows.Scan(&activity.Name, &activity.StartDate, &activity.EndDate); err != nil {
			return nil, err
		}
		activities = append(activities, activity)
	}

	return activities, rows.Err()
}

func (r *UserRepository) CreateActivity(ctx context.Context, id_travel string, name string, description string, location string, start_date string, end_date string) (string, error) {
	query := `
        INSERT INTO activities (id_travel, name, description, location, price, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id_activity
	`

	var id_activity string

	err := r.db.QueryRow(ctx, query, name, description, location, start_date, end_date).Scan(&id_activity)

	return id_activity, err
}

func (r *UserRepository) AddClientActivities(ctx context.Context, id_activity string, id_user string) error {
	query := `
        INSERT INTO activities (id_activity, id_user)
        VALUES ($1, $2)
	`

	_, err := r.db.Query(ctx, query, id_activity, id_user)

	return err
}