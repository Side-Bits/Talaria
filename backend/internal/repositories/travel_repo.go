package repositories

import (
	"context"

	"talaria/internal/domain/models"
	"talaria/internal/pkgs/database"
)

type TravelRepository struct {
	db database.DBExecutor
}

func NewTravelRepository(db database.DBExecutor) *TravelRepository {
	return &TravelRepository{db: db}
}

func (r *TravelRepository) GetTravels(ctx context.Context, userID int64) (map[string][]models.Travel, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id_travel, name, start_date, end_date, tag
		FROM (
			SELECT travels.id_travel, travels.name, travels.start_date, travels.end_date,
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
	`, userID)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	tags := make(map[string][]models.Travel)

	for rows.Next() {
		var travel models.Travel
		var tag string = ""

		if err := rows.Scan(&travel.ID, &travel.Name, &travel.StartDate, &travel.EndDate, &tag); err != nil {
			return nil, err
		}

		tags[tag] = append(tags[tag], travel)
	}

	return tags, rows.Err()
}

func (r *TravelRepository) GetTravelByID(ctx context.Context, userID int64, travelID int64) (models.Travel, error) {
	query := `
		SELECT t.id_travel, t.name, t.start_date, t.end_date, t.end_date < CURRENT_DATE AS finished
		FROM travels t
		INNER JOIN clients_travels ct ON ct.id_travel = t.id_travel
		WHERE ct.id_user = $1
			AND t.id_travel = $2
		LIMIT 1
	`

	var travel models.Travel
	err := r.db.QueryRow(ctx, query, userID, travelID).Scan(
		&travel.ID,
		&travel.Name,
		&travel.StartDate,
		&travel.EndDate,
		&travel.Finished,
	)
	if err != nil {
		return models.Travel{}, err
	}

	return travel, nil
}

func (r *TravelRepository) CreateTravel(ctx context.Context, name string, start_date string, end_date string) (int64, error) {
	query := `
        INSERT INTO travels (name, start_date, end_date)
        VALUES ($1, $2, $3)
		RETURNING id_travel
	`

	var id_travel int64

	err := r.db.QueryRow(ctx, query, name, start_date, end_date).Scan(&id_travel)

	return id_travel, err
}

func (r *TravelRepository) AddClientTravels(ctx context.Context, id_travel int64, userID int64) error {
	query := `
        INSERT INTO clients_travels (id_travel, id_user)
        VALUES ($1, $2)
	`

	_, err := r.db.Exec(ctx, query, id_travel, userID)

	return err
}
