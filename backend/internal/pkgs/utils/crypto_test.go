package utils_test

import (
	"talaria/internal/pkgs/utils"
	"testing"
)

func TestHashPassword(t *testing.T) {
	tests := []struct {
		name     string
		password string
		wantErr  bool
	}{
		{
			name:     "valid password",
			password: "MySecurePassword123",
			wantErr:  false,
		},
		{
			name:     "empty string password",
			password: "",
			wantErr:  true,
		},
		{
			name:     "short password",
			password: "a",
			wantErr:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := utils.HashPassword(tt.password)
			if (err != nil) != tt.wantErr {
				t.Fatalf("HashPassword() error = %v, wantErr = %v", err, tt.wantErr)
			}
		})
	}
}
