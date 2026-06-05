package repository

import (
	"foodlink/internal/domain"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) CreateFoodPost(post *domain.FoodPost) error {
	return r.db.Create(post).Error
}

func (r *Repository) GetActivePosts() ([]domain.FoodPost, error) {
	var posts []domain.FoodPost
	err := r.db.Where("status = ? AND expiry_date > ?", "available", "NOW()").Find(&posts).Error
	return posts, err
}

func (r *Repository) GetUserByEmail(email string) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

