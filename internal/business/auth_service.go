package business

import (
	"errors"
	"foodlink/internal/domain"
	"foodlink/internal/repository"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	repo *repository.PostgresRepository
}

func NewAuthService(repo *repository.PostgresRepository) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) RegisterUser(user *domain.User) error {
	if user.Password == "" {
		return errors.New("password is required")
	}

	// Check if user already exists
	existingUser, err := s.repo.GetUserByEmail(user.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err // Return actual database error
	}
	if err == nil && existingUser.ID != 0 { // User found
		return errors.New("user with this email already exists")
	}
	if user.Role == "" {
		user.Role = "recipient" // Default role
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	return s.repo.CreateUser(user)
}

func (s *AuthService) Authenticate(email, password string) (*domain.User, error) {
	user, err := s.repo.GetUserByEmail(email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid credentials")
	}
	return user, nil
}
