package services

import (
	"context"

	"talaria/internal/pkgs/database"
	"talaria/internal/repositories"
)

type Repos struct {
	Users      *repositories.UserRepository
	Tokens     *repositories.TokenRepository
	Clients    *repositories.ClientRepository
	Travels    *repositories.TravelRepository
	Activities *repositories.ActivityRepository
}

type RepositoryStore struct {
	db    database.TxBeginner
	repos Repos
}

func NewRepos(exec database.DBExecutor) Repos {
	return Repos{
		Users:      repositories.NewUserRepository(exec),
		Tokens:     repositories.NewTokenRepository(exec),
		Clients:    repositories.NewClientRepository(exec),
		Travels:    repositories.NewTravelRepository(exec),
		Activities: repositories.NewActivityRepository(exec),
	}
}

func NewStore(db database.TxBeginner) *RepositoryStore {
	return &RepositoryStore{
		db:    db,
		repos: NewRepos(db),
	}
}

func (s *RepositoryStore) Repos() Repos {
	return s.repos
}

func (s *RepositoryStore) InTx(ctx context.Context, fn func(repos Repos) error) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	txRepos := NewRepos(tx)

	if err := fn(txRepos); err != nil {
		return err
	}

	return tx.Commit(ctx)
}
