package utils_test

import (
	"talaria/internal/pkgs/utils"
	"testing"
)

func TestHashPassword(t *testing.T) {
	tests := []struct {
		name     string
		password *string
		wantErr  bool
	}{
		{
			name:     "valid password",
			password: strPtr("MySecurePassword123"),
			wantErr:  false,
		},
		{
			name:     "nil password",
			password: nil,
			wantErr:  true,
		},
		{
			name:     "empty string password",
			password: strPtr(""),
			wantErr:  true,
		},
		{
			name:     "short password",
			password: strPtr("a"),
			wantErr:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			password, err := utils.HashPassword(*tt.password)
			tt.password = &password
			if (err != nil) != tt.wantErr {
				if err != nil {
					t.Errorf("HashPassword() error = %v, wantErr = %v", err, tt.wantErr)
				} else {
					t.Fatal("HashPassword() succeeded unexpectedly")
				}
			} else {
				t.Log("HashPassword() passed as expected with value :", tt.password)
			}
		})
	}
}

// helper to create a pointer from string literal
func strPtr(s string) *string {
	return &s
}
