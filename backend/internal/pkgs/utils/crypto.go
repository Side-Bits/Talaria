package utils

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
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

func HashToken(token string) string {
	// Hash the token using SHA-256
	hash := sha256.Sum256([]byte(token))

	// Convert hash to hexadecimal (64 characters)
	tokenHash := hex.EncodeToString(hash[:])

	return tokenHash
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
func GenerateRandomToken(length int) (string, string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", "", err
	}

	token := base64.URLEncoding.EncodeToString(bytes)

	return token, HashToken(token), nil
}
