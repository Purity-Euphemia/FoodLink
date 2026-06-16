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
	PickupTime     string    `json:"pickup_time"`     // e.g. "9:00 PM - 10:00 PM"
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

// ProfileStats is the response body for GET /profile
type ProfileStats struct {
	User                *User  `json:"user"`
	DonationsCollected  int64  `json:"donations_collected"`  // claimed + completed as recipient
	DonationsPosted     int64  `json:"donations_posted"`     // all posts as donor
	MealsProvided       int64  `json:"meals_provided"`       // estimated: collected * 30
	CO2Saved            int64  `json:"co2_saved"`            // estimated: collected * 7 kg
}
