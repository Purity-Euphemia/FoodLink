package repository

import (
	"foodlink/internal/domain"
	"gorm.io/gorm"
)

type PostgresRepository struct {
	db *gorm.DB
}

func NewPostgresRepository(db *gorm.DB) *PostgresRepository {
	return &PostgresRepository{db: db}
}

func (r *PostgresRepository) CreateUser(user *domain.User) error {
	return r.db.Create(user).Error
}

func (r *PostgresRepository) GetUserByEmail(email string) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *PostgresRepository) CreateFoodPost(post *domain.FoodPost) error {
	return r.db.Create(post).Error
}

func (r *PostgresRepository) ListActivePosts() ([]domain.FoodPost, error) {
	var posts []domain.FoodPost
	err := r.db.Where("status = ? AND expiry_date > NOW()", "available").Find(&posts).Error
	return posts, err
}
