package business

import (
	"errors"
	"foodlink/internal/domain"
	"foodlink/internal/repository"
	"time"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	repo *repository.PostgresRepository
}

func NewService(repo *repository.PostgresRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) RegisterUser(user *domain.User) error {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	user.Password = string(hashedPassword)
	return s.repo.CreateUser(user)
}

func (s *Service) Authenticate(email, password string) (*domain.User, error) {
	user, err := s.repo.GetUserByEmail(email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid credentials")
	}
	return user, nil
}

func (s *Service) CreateDonation(post *domain.FoodPost) error {
	if post.ExpiryDate.Before(time.Now()) {
		return errors.New("cannot donate expired food")
	}
	post.Status = "available"
	return s.repo.CreateFoodPost(post)
}
