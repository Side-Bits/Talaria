package utils

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
)

func HashPassword(password *string) error {
	if password == nil || *password == "" {
		return fmt.Errorf("password cannot be nil or empty")
	}

	if len(*password) < 6 {
		return fmt.Errorf("password must be at least 6 characters long")
	}

	hashed := sha256.Sum256([]byte(*password))
	*password = hex.EncodeToString(hashed[:])

	return nil
}

// generateRandomToken creates a cryptographically secure random token
func GenerateRandomToken(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(bytes), nil
}
