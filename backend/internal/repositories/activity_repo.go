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