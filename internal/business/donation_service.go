package business

import (
	"errors"
	"foodlink/internal/domain"
	"foodlink/internal/repository"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Service struct {
	repo *repository.PostgresRepository
}

func NewService(repo *repository.PostgresRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) RegisterUser(user *domain.User) error {
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

func (s *Service) ListDonations() ([]domain.FoodPost, error) {
	return s.repo.ListActivePosts()
}

func (s *Service) ClaimDonation(postID uint, recipientID uint) error {
	post, err := s.repo.GetPostByID(postID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("donation post not found")
		}
		return err
	}

	if post.DonorID == recipientID {
		return errors.New("you cannot claim your own donation")
	}
	if post.Status != "available" {
		return errors.New("this donation is no longer available")
	}

	post.Status = "claimed"
	post.RecipientID = recipientID
	return s.repo.UpdateFoodPost(post)
}

func (s *Service) GetDashboardStats() (map[string]interface{}, error) {
	posts, err := s.repo.ListActivePosts()
	if err != nil {
		return nil, err
	}

	totalDonations, err := s.repo.GetTotalDonations()
	if err != nil {
		return nil, err
	}

	usersCount, err := s.repo.GetTotalUserCount()
	if err != nil {
		return nil, err
	}

	activeDonors, err := s.repo.GetActiveDonorsCount()
	if err != nil {
		return nil, err
	}

	stats := map[string]interface{}{
		"active_donations": len(posts),
		"total_donations":  totalDonations,
		"users_registered": usersCount,
		"active_donors":    activeDonors,
	}
	return stats, nil
}
