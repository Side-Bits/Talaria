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
		SELECT id_travel, name, start_date, end_date, description, COALESCE(image, ''), tag
		FROM (
			SELECT t.id_travel,
				t.name,
				t.start_date,
				t.end_date,
				COALESCE(t.description, '') AS description,
				COALESCE(t.image, '') AS image,
				CASE WHEN end_date >= CURRENT_DATE THEN 'G' ELSE 'D' END AS tag,
				ROW_NUMBER() OVER (
					PARTITION BY CASE WHEN end_date >= CURRENT_DATE THEN 'G' ELSE 'D' END
					ORDER BY start_date ASC
				) AS n
			FROM travels AS t
				INNER JOIN clients_travels AS ct ON ct.id_travel = t.id_travel
				INNER JOIN clients AS c ON c.id_user = ct.id_user
			WHERE c.id_user = $1
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

		if err := rows.Scan(&travel.ID, &travel.Name, &travel.StartDate, &travel.EndDate, &travel.Description, &travel.Image, &tag); err != nil {
			return nil, err
		}

		tags[tag] = append(tags[tag], travel)
	}

	return tags, rows.Err()
}

func (r *TravelRepository) GetTravelByID(ctx context.Context, userID int64, travelID int64) (models.Travel, error) {
	query := `
		SELECT t.id_travel,
			t.name,
			t.start_date,
			t.end_date,
			COALESCE(t.description, ''),
			COALESCE(t.image, ''),
			t.end_date < CURRENT_DATE AS finished
		FROM travels AS t
			INNER JOIN clients_travels ct ON ct.id_travel = t.id_travel
		WHERE ct.id_user = $1 AND
			t.id_travel = $2
		LIMIT 1
	`

	var travel models.Travel
	err := r.db.QueryRow(ctx, query, userID, travelID).Scan(
		&travel.ID,
		&travel.Name,
		&travel.StartDate,
		&travel.EndDate,
		&travel.Description,
		&travel.Image,
		&travel.Finished,
	)

	if err != nil {
		return models.Travel{}, err
	}

	return travel, nil
}

func (r *TravelRepository) CreateTravel(ctx context.Context, name string, start_date string, end_date string, description string, image string) (int64, error) {
	query := `
        INSERT INTO travels (name, start_date, end_date, description, image)
        VALUES ($1, $2, $3, $4, $5)
		RETURNING id_travel
	`

	var id_travel int64

	err := r.db.QueryRow(ctx, query, name, start_date, end_date, description, image).Scan(&id_travel)

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
