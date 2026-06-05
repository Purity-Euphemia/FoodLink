package business

import (
	"errors"
	"foodlink/internal/domain"
	"foodlink/internal/repository"
	"time"
)

type DonationService struct {
	repo *repository.Repository
}

func NewDonationService(r *repository.Repository) *DonationService {
	return &DonationService{repo: r}
}

func (s *DonationService) PostDonation(post *domain.FoodPost) error {
	if post.ExpiryDate.Before(time.Now()) {
		return errors.New("cannot post food that has already expired")
	}
	if post.Title == "" || post.Quantity == "" {
		return errors.New("title and quantity are required fields")
	}
	post.Status = "available"
	return s.repo.CreateFoodPost(post)
}
