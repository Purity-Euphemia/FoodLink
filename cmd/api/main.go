package main

import (
	"foodlink/internal/api/handlers"
	"foodlink/internal/business"
	"foodlink/internal/domain"
	"foodlink/internal/repository"
	"log"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Configuration (In production, use environment variables)
	dsn := "host=localhost user=postgres password=password dbname=foodlink port=5432 sslmode=disable"
	
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto-migrate schema
	db.AutoMigrate(&domain.User{}, &domain.FoodPost{})

	// Dependency Injection
	repo := repository.NewRepository(db)
	donService := business.NewDonationService(repo)
	donHandler := handlers.NewDonationHandler(donService)

	// Router Setup
	r := gin.Default()

	v1 := r.Group("/api/v1")
	{
		v1.POST("/donations", donHandler.CreatePost)
	}

	log.Println("Server starting on :8080")
	r.Run(":8080")
}
