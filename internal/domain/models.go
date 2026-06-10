package domain

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string `json:"name"`
	Email    string `gorm:"uniqueIndex" json:"email" binding:"required,email"`
	Password string `json:"password,omitempty" binding:"required,min=6"`
	Phone    string `json:"phone"`
	Role     string `json:"role"` // "donor", "recipient"
}

type FoodPost struct {
	gorm.Model
	Title          string    `json:"title" binding:"required"`
	Description    string    `json:"description"`
	Category       string    `json:"category"` // e.g., "Veg", "Non-Veg", "Cooked"
	Quantity       string    `json:"quantity" binding:"required"`
	PickUpLocation string    `json:"pickup_location"` // For the Figma map/list view
	ImageUrl       string    `json:"image_url"`       // UI placeholder
	ExpiryDate     time.Time `json:"expiry_date" binding:"required"`
	DonorID        uint      `json:"donor_id"`
	RecipientID    uint      `json:"recipient_id,omitempty"`
	Status         string    `json:"status"` // "available", "claimed", "completed"
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}
