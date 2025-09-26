package models

type SessionToken struct {
	Token     string
	ExpiresAt int64
	UserID    int
}
