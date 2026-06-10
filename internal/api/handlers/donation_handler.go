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

	uid, ok := userID.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal identity error"})
		return
	}
	post.DonorID = uid

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
	postIDStr := c.Param("id")
	postID, err := strconv.ParseUint(postIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	uid, ok := userID.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal identity error"})
		return
	}

	if err := h.service.ClaimDonation(uint(postID), uid); err != nil {
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
