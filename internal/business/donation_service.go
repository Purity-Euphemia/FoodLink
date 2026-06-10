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

func (s *DonationService) ListDonations() ([]domain.FoodPost, error) {
	return s.repo.ListActivePosts()
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

func (s *DonationService) GetDashboardStats() (map[string]interface{}, error) {
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
