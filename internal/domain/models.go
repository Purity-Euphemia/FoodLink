package domain

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string `json:"name"`
	Email    string `gorm:"uniqueIndex" json:"email"`
	Password string `json:"-"`
	Role     string `json:"role"` // "donor" or "recipient"
}

type FoodPost struct {
	gorm.Model
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Quantity    string    `json:"quantity"`
	ExpiryDate  time.Time `json:"expiry_date"`
	DonorID     uint      `json:"donor_id"`
	Status      string    `json:"status"` // "available", "claimed", "completed"
}
