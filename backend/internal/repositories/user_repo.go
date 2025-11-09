package repositories

import (
	"database/sql"
	"fmt"

	"talaria/internal/models"
)

func RegisterUser(db *sql.DB, user *models.User) error {
	query := `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id;
    `
	return db.QueryRow(query, user.Name, user.Email, user.Password).Scan(&user.ID)
}

func GetUserIdByToken(db *sql.DB, token string) (string, error) {
	var userId string
	err := db.QueryRow("SELECT userId FROM Tokens WHERE token = ?", token).Scan(&userId)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("getUserIdByToken %s: unknown album", token)
		}
		return "", fmt.Errorf("getUserIdByToken %s: %e", token, err)
	}

	return userId, nil
}
