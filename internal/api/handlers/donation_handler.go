package handlers

import (
	"foodlink/internal/business"
	"foodlink/internal/domain"
	"net/http"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *business.Service
}

func NewHandler(s *business.Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) PostDonation(c *gin.Context) {
	var post domain.FoodPost
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// DonorID would typically be pulled from the JWT context
	if err := h.service.CreateDonation(&post); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, post)
}

func (h *Handler) Login(c *gin.Context) {
	var req domain.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	user, err := h.service.Authenticate(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	
	// Simplify: In a full app, generate and return a JWT here
	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "user_id": user.ID})
}
