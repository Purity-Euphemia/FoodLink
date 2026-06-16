package middleware

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var defaultSecret = []byte("your_super_secret_key")

func GetJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		if gin.Mode() == gin.ReleaseMode {
			log.Fatal("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is not set in release mode!")
		} else {
			log.Println("WARNING: JWT_SECRET environment variable is not set. Using insecure default key for development.")
		}
		return defaultSecret
	}
	return []byte(secret)
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			return GetJWTSecret(), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		claims, claimsOk := token.Claims.(jwt.MapClaims)
		if !claimsOk {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims format"})
			c.Abort()
			return
		}

		userIDFloat, userIDOk := claims["user_id"].(float64)
		if !userIDOk {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID missing or invalid in token"})
			c.Abort()
			return
		}

		role, roleOk := claims["role"].(string)
		if !roleOk {
			// If role is missing, default to empty string or a guest role, but don't abort
			// unless it's strictly required for all authenticated users.
			// For RBAC, RoleMiddleware will handle insufficient permissions.
			role = ""
		}

		c.Set("userID", uint(userIDFloat))
		c.Set("userRole", role)
		c.Next()
	}
}

// RoleMiddleware restricts access to specific roles
func RoleMiddleware(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("userRole")
		if !exists || role != requiredRole {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied: insufficient permissions"})
			c.Abort()
			return
		}
		c.Next()
	}
}
