package business

import (
	"errors"
	"foodlink/internal/domain"
	"foodlink/internal/repository"
	"time"

	"gorm.io/gorm"
)

type DonationService struct {
	repo *repository.PostgresRepository
}

func NewDonationService(repo *repository.PostgresRepository) *DonationService {
	return &DonationService{repo: repo}
}

func (s *DonationService) CreateDonation(post *domain.FoodPost) error {
	if post.ExpiryDate.Before(time.Now()) {
		return errors.New("cannot donate expired food")
	}
	post.Status = "available"
	return s.repo.CreateFoodPost(post)
}

func (s *DonationService) ListDonations(category string) ([]domain.FoodPost, error) {
	return s.repo.ListActivePosts(category)
}

func (s *DonationService) ClaimDonation(postID uint, recipientID uint) error {
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

// CompletePickup transitions a claimed donation to "completed" (Screen 8 → "Mark as Picked Up").
func (s *DonationService) CompletePickup(postID uint, recipientID uint) error {
	post, err := s.repo.GetPostByID(postID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("donation post not found")
		}
		return err
	}

	if post.RecipientID != recipientID {
		return errors.New("you have not claimed this donation")
	}
	if post.Status != "claimed" {
		return errors.New("donation must be in claimed state to complete")
	}

	post.Status = "completed"
	return s.repo.UpdateFoodPost(post)
}

// GetDonationByID fetches a single food post by its ID.
func (s *DonationService) GetDonationByID(postID uint) (*domain.FoodPost, error) {
	post, err := s.repo.GetPostByID(postID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("donation not found")
		}
		return nil, err
	}
	return post, nil
}

// GetMyDonations returns posts for a user — their own donations if donor, or claimed/completed if recipient.
func (s *DonationService) GetMyDonations(userID uint, role string) ([]domain.FoodPost, error) {
	if role == "donor" {
		return s.repo.GetPostsByDonor(userID)
	}
	return s.repo.GetPostsByRecipient(userID)
}

func (s *DonationService) GetDashboardStats() (map[string]interface{}, error) {
	posts, err := s.repo.ListActivePosts("") // Pass empty string for all categories
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
