package controllers

import (
	"database/sql"
	"fmt"
)

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
