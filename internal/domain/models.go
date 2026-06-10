package domain

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string `json:"name"`
	Email    string `gorm:"uniqueIndex" json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"` // "donor", "recipient"
}

type FoodPost struct {
	gorm.Model
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	Quantity    string    `json:"quantity" binding:"required"`
	ExpiryDate  time.Time `json:"expiry_date" binding:"required"`
	DonorID     uint      `json:"donor_id"`
	RecipientID uint      `json:"recipient_id"`
	Status      string    `json:"status"` // "available", "claimed", "completed"
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}
