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

func (r *PostgresRepository) ListActivePosts(category string) ([]domain.FoodPost, error) {
	var posts []domain.FoodPost
	query := r.db.Where("status = ? AND expiry_date > NOW()", "available")
	if category != "" {
		query = query.Where("category = ?", category)
	}
	err := query.Order("created_at DESC").Find(&posts).Error
	return posts, err
}

func (r *PostgresRepository) GetUserByID(id uint) (*domain.User, error) {
	var user domain.User
	err := r.db.First(&user, id).Error
	return &user, err
}

func (r *PostgresRepository) GetPostByID(id uint) (*domain.FoodPost, error) {
	var post domain.FoodPost
	err := r.db.First(&post, id).Error
	return &post, err
}

func (r *PostgresRepository) UpdateFoodPost(post *domain.FoodPost) error {
	return r.db.Save(post).Error
}

func (r *PostgresRepository) GetTotalUserCount() (int64, error) {
	var count int64
	err := r.db.Model(&domain.User{}).Count(&count).Error
	return count, err
}

func (r *PostgresRepository) GetTotalDonations() (int64, error) {
	var count int64
	err := r.db.Model(&domain.FoodPost{}).Count(&count).Error
	return count, err
}

func (r *PostgresRepository) GetActiveDonorsCount() (int64, error) {
	var count int64
	err := r.db.Model(&domain.FoodPost{}).Distinct("donor_id").Count(&count).Error
	return count, err
}

func (r *PostgresRepository) GetPostsByDonor(donorID uint) ([]domain.FoodPost, error) {
	var posts []domain.FoodPost
	err := r.db.Where("donor_id = ?", donorID).Order("created_at DESC").Find(&posts).Error
	return posts, err
}

func (r *PostgresRepository) GetPostsByRecipient(recipientID uint) ([]domain.FoodPost, error) {
	var posts []domain.FoodPost
	err := r.db.Where("recipient_id = ?", recipientID).Order("created_at DESC").Find(&posts).Error
	return posts, err
}

// CountCompletedByRecipient returns how many donations a recipient has fully collected.
func (r *PostgresRepository) CountCompletedByRecipient(userID uint) (int64, error) {
	var count int64
	err := r.db.Model(&domain.FoodPost{}).
		Where("recipient_id = ? AND status = ?", userID, "completed").
		Count(&count).Error
	return count, err
}

// CountCompletedByDonor returns how many donations a donor has had fully picked up.
func (r *PostgresRepository) CountCompletedByDonor(userID uint) (int64, error) {
	var count int64
	err := r.db.Model(&domain.FoodPost{}).
		Where("donor_id = ? AND status = ?", userID, "completed").
		Count(&count).Error
	return count, err
}
