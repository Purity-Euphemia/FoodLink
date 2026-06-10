package handlers

import (
	"foodlink/internal/business"
	"foodlink/internal/domain"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type DonationHandler struct {
	service *business.DonationService
}

func NewDonationHandler(s *business.DonationService) *DonationHandler {
	return &DonationHandler{service: s}
}

func (h *DonationHandler) PostDonation(c *gin.Context) {
	var post domain.FoodPost
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Pull DonorID from middleware context
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	post.DonorID = userID.(uint) // userID is already uint from middleware

	if err := h.service.CreateDonation(&post); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, post)
}

func (h *DonationHandler) ListDonations(c *gin.Context) {
	posts, err := h.service.ListDonations()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch donations"})
		return
	}
	c.JSON(http.StatusOK, posts)
}

func (h *DonationHandler) ClaimDonation(c *gin.Context) {
	postIDStr := c.Param("id")                          // Assuming ID is part of the URL path
	postID, err := strconv.ParseUint(postIDStr, 10, 64) // Use 64-bit for uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	} // userID is already uint from middleware

	if err := h.service.ClaimDonation(uint(postID), userID.(uint)); err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Donation claimed successfully"})
}

func (h *DonationHandler) GetStats(c *gin.Context) {
	stats, err := h.service.GetDashboardStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch stats"})
		return
	}
	c.JSON(http.StatusOK, stats)
}
