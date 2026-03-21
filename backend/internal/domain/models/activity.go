package models

import (
	"time"
)

type Activity struct {
	ID          int64     `json:"id"`
	Id_travel   int64     `json:"id_travel"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Location    string    `json:"location"`
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date"`
	Price       float64   `json:"price"`
	Finished    bool      `json:"finished"`
}
