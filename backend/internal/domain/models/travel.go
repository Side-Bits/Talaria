package models

import (
	"time"
)

type Travel struct {
	ID       	string `json:"id"`
	Name     	string `json:"name"`
	StartDate  	time.Time `json:"start_date"`
	EndDate    	time.Time `json:"end_date"`
	Finished 	bool `json:"finished"`
}
