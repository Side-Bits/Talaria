package models

import (
	"time"
)

type UserToken struct {
	UserID    string    `json:"user_id" db:"user_id"`
	Token     string    `json:"token" db:"token"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	ExpiresAt time.Time `json:"expires_at" db:"expires_at"`
	IsActive  bool      `json:"is_active" db:"is_active"`
}

func (ut *UserToken) IsExpired() bool {
	return time.Now().After(ut.ExpiresAt)
}

func (ut *UserToken) IsValid() bool {
	return ut.IsActive && !ut.IsExpired()
}
