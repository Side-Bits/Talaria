package models

import (
	"time"
)

type UserToken struct {
	SessionId int64     `db: "id_session"`
	UserID    int64     `json:"user_id" db:"id_user"`
	Token     string    `json:"token" db:"token_hash"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	ExpiresAt time.Time `json:"expires_at" db:"expires_at"`
}

func (ut *UserToken) IsExpired() bool {
	return time.Now().After(ut.ExpiresAt)
}

func (ut *UserToken) IsValid() bool {
	return !ut.IsExpired()
}
