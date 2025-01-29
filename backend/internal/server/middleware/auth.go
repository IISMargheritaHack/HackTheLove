package middleware

import (
	"backend/config"
	internal "backend/internal/utils"
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
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token missing"})
			c.Abort()
			return
		}

		claims, err := ValidateJWT(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token not valid: " + err.Error()})
			c.Abort()
			return
		}

		c.Set("email", claims.Email)
		c.Next()
	}
}

func GetEmail(c *gin.Context) string {
	tokenString := c.GetHeader("Authorization")

	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token missing"})
		c.Abort()
		return ""
	}

	claims, err := ValidateJWT(tokenString)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token not valid: " + err.Error()})
		c.Abort()
		return ""
	}

	return claims.Email
}
