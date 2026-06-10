package main

import (
	"foodlink/internal/api/handlers"
	"foodlink/internal/api/middleware"
	"foodlink/internal/business"
	"foodlink/internal/domain"
	"foodlink/internal/repository"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Database Connection
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=postgres dbname=foodlink port=5432 sslmode=disable"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database")
	}

	// 2. Migrations
	db.AutoMigrate(&domain.User{}, &domain.FoodPost{})

	// 3. Initialize Layers
	repo := repository.NewPostgresRepository(db)
	service := business.NewService(repo)
	handler := handlers.NewHandler(service)

	// 4. Routes
	r := gin.Default()
	v1 := r.Group("/api/v1")
	{
		v1.POST("/register", handler.Register)
		v1.POST("/login", handler.Login)

		protected := v1.Group("/")
		protected.Use(middleware.AuthMiddleware())
		protected.POST("/donations", handler.PostDonation)
		protected.GET("/donations", handler.ListDonations)
		protected.PATCH("/donations/:id/claim", handler.ClaimDonation)
		protected.GET("/stats", handler.GetStats)
	}

	log.Println("Foodlink Backend running on :8080")
	r.Run(":8080")
}
