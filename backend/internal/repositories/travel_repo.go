package repositories

import (
	"context"
	"talaria/internal/domain/models"
)

func (r *UserRepository) GetTravels(ctx context.Context, id_user string) ([]models.Travel, error) {
	var travels []models.Travel

	rows, err := r.db.Query(ctx, `
		SELECT travels.name, travels.start_date, travels.end_date
		FROM travels
		INNER JOIN clients_travels ON clients_travels.id_travel = travels.id_travel
		INNER JOIN clients ON clients.id_user = clients_travels.id_user
		WHERE clients.id_user = $1
	`, id_user)
	
	if err != nil { return nil, err }

	defer rows.Close()

	for rows.Next() {
		var travel models.Travel
		if err := rows.Scan(&travel.Name, &travel.StartDate, &travel.EndDate); err != nil {
			return nil, err
		}
		travels = append(travels, travel)
	}

	return travels, rows.Err()
}