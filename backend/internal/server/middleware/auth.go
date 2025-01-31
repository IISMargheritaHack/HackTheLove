package middleware

import (
	"backend/config"
	internal "backend/internal/utils"
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
)

var Validate = validator.New()

func init() {
	Validate.RegisterValidation("email_host", internal.EmailHost)
}

type Claims struct {
	Email string `json:"email" validate:"required,email,email_host"`
	jwt.RegisteredClaims
}

func ValidateJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Sign method not valid")
		}
		return config.JwtSecret, nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, fmt.Errorf("Token expired")
		}
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("Token non valido")
}

func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		claims, err := ValidateJWT(tokenString)
		if err != nil {
			if err.Error() == "Token expired" {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Token expired"})
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			}
			c.Abort()
			return
		}

		c.Set("email", claims.Email)
		c.Next()
	}
}

func GetEmail(c *gin.Context) string {
	email, exists := c.Get("email")
	if !exists {
		log.Warn().Msg("Email not found in context")
		return ""
	}
	return email.(string)
}
