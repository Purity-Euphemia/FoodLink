package handlers

import (
	"foodlink/internal/business"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ProfileHandler exposes profile & impact stat endpoints.
type ProfileHandler struct {
	authService *business.AuthService
}

func NewProfileHandler(s *business.AuthService) *ProfileHandler {
	return &ProfileHandler{authService: s}
}

// GetProfile handles GET /api/v1/profile
// Returns the authenticated user's info and computed impact statistics (Screen 10).
func (h *ProfileHandler) GetProfile(c *gin.Context) {
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

	role, _ := c.Get("userRole")
	roleStr, _ := role.(string)

	stats, err := h.authService.GetProfileStats(uid, roleStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}
