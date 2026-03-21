package models

type Client struct {
	ID       int64  `json:"id_user"`
	Name     string `json:"name"`
	Surname1 string `json:"surname1"`
	Surname2 string `json:"surname2,omitempty"`
	Photo    string `json:"photo,omitempty"`
}
