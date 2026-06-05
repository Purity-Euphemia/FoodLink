package handlers

import (
	"foodlink/internal/business"
	"foodlink/internal/domain"
	"net/http"
	"github.com/gin-gonic/gin"
)

type DonationHandler struct {
	service *business.DonationService
}

func NewDonationHandler(s *business.DonationService) *DonationHandler {
	return &DonationHandler{service: s}
}

func (h *DonationHandler) CreatePost(c *gin.Context) {
	var post domain.FoodPost
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// In a real app, donor_id would be extracted from the JWT token
	if err := h.service.PostDonation(&post); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, post)
}
