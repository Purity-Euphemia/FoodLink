package main

import (
	"foodlink/internal/api/handlers"
	"foodlink/internal/api/middleware"
	"foodlink/internal/business"
	"foodlink/internal/domain"
	"foodlink/internal/repository"
	"log"
	"os"
	"time"

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

	// Database Connection Pool configuration
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get database instance for pooling: %v", err)
	}
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// 2. Migrations
	if err := db.AutoMigrate(&domain.User{}, &domain.FoodPost{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// 3. Initialize Layers
	repo := repository.NewPostgresRepository(db)
	authService := business.NewAuthService(repo)
	authHandler := handlers.NewAuthHandler(authService)
	donService := business.NewDonationService(repo)
	donHandler := handlers.NewDonationHandler(donService)

	// 4. Routes
	r := gin.Default()

	// CORS Middleware - Essential for Frontend Integration
	r.Use(func(c *gin.Context) {
		origin := os.Getenv("FRONTEND_URL")
		if origin == "" {
			origin = "*"
		}
		c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	v1 := r.Group("/api/v1")
	{
		v1.POST("/register", authHandler.Register)
		v1.POST("/login", authHandler.Login)

		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.POST("/donations", middleware.RoleMiddleware("donor"), donHandler.PostDonation)
			protected.GET("/donations", donHandler.ListDonations)
			protected.PATCH("/donations/:id/claim", middleware.RoleMiddleware("recipient"), donHandler.ClaimDonation)
			protected.GET("/stats", donHandler.GetStats)
		}
	}

	log.Println("Foodlink Backend running on :8080")
	r.Run(":8080")
}
