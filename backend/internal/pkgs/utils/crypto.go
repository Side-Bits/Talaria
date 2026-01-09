package utils

import (
	"crypto/rand"
	"encoding/base64"
	"errors"

	"github.com/alexedwards/argon2id"
)

func HashPassword(password string) (string, error) {
	if len(password) < 6 {
		return "", errors.New("password must be at least 6 characters long")
	}

	return argon2id.CreateHash(
		password,
		argon2id.DefaultParams,
	)
}

func VerifyPassword(storedHash, password string) error {
	match, err := argon2id.ComparePasswordAndHash(password, storedHash)
	if err != nil {
		return err
	}
	if !match {
		return errors.New("invalid credentials")
	}
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
