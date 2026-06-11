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
	if user.Email == "" {
		return errors.New("email is required")
	}
	if user.Password == "" {
		return errors.New("password is required")
	}

	// Check if user already exists
	_, err := s.repo.GetUserByEmail(user.Email)
	if err == nil {
		// If err is nil, a user with this email was found
		return errors.New("user with this email already exists")
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		// Some other database error occurred, not just "record not found"
		return err
	}
	// If err is gorm.ErrRecordNotFound, it means the user does not exist, so we can proceed.

	if user.Role == "" {
		user.Role = "recipient" // Default role
	} else if user.Role != "donor" && user.Role != "recipient" {
		return errors.New("invalid role: must be donor or recipient")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	return s.repo.CreateUser(user)
}

func (s *AuthService) Authenticate(email, password string) (*domain.User, error) {
	user, err := s.repo.GetUserByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid credentials")
		}
		// Internal system/database error
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}
	return user, nil
}
