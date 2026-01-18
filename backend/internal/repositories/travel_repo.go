package repositories

import (
	"context"
	"talaria/internal/domain/models"
)

func (r *UserRepository) GetTravels(ctx context.Context, id_user string) (map[string][]models.Travel, error) {
	rows, err := r.db.Query(ctx, `
		SELECT name, start_date, end_date, tag
		FROM (
			SELECT travels.name, travels.start_date, travels.end_date,
			CASE WHEN end_date >= CURRENT_DATE THEN 'G' ELSE 'D' END AS tag,
			ROW_NUMBER() OVER (
				PARTITION BY CASE WHEN end_date >= CURRENT_DATE THEN 'G' ELSE 'D' END
				ORDER BY start_date ASC
			) AS n
			FROM travels
			INNER JOIN clients_travels ON clients_travels.id_travel = travels.id_travel
			INNER JOIN clients ON clients.id_user = clients_travels.id_user
			WHERE clients.id_user = $1
		) t
		WHERE n <= 5
		ORDER BY tag, start_date ASC;
	`, id_user)
	
	if err != nil { return nil, err }

	defer rows.Close()
	
	tags := make(map[string][]models.Travel)

	for rows.Next() {
		var travel models.Travel
		var tag string = "";

		if err := rows.Scan(&travel.Name, &travel.StartDate, &travel.EndDate, &tag); err != nil { return nil, err }
		
		tags[tag] = append(tags[tag], travel)
	}

	return tags, rows.Err()
}

func (r *UserRepository) CreateTravel(ctx context.Context, name string, start_date string, end_date string) (string, error) {
	query := `
        INSERT INTO travels (name, start_date, end_date)
        VALUES ($1, $2, $3)
		RETURNING id_travel
	`

	var id_travel string

	err := r.db.QueryRow(ctx, query, name, start_date, end_date).Scan(&id_travel)

	return id_travel, err
}

func (r *UserRepository) AddClientTravels(ctx context.Context, id_travel string, id_user string) error {
	query := `
        INSERT INTO travels (id_travel, id_user)
        VALUES ($1, $2)
	`

	_, err := r.db.Query(ctx, query, id_travel, id_user)

	return err
}