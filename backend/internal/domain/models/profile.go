package models

import "time"

type Profile struct {
	ID        int64      `json:"id_user"`
	Name      string     `json:"name"`
	Surname1  string     `json:"surname1"`
	Surname2  string     `json:"surname2,omitempty"`
	Birthdate *time.Time `json:"birthdate"`
	Photo     string     `json:"photo,omitempty"`
	Currency  string     `json:"currency"`
	Language  string     `json:"language"`
	Username  string     `json:"username"`
	Email     string     `json:"email"`
}

type ProfileData struct {
	Profile
	NumTrips     int64     `json:"numTrips"`
	NumCountries int64     `json:"numCountries"`
	Since        time.Time `json:"since"`
}
