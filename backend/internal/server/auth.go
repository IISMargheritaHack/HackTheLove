package server

import (
	"backend/internal"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(internal.GetEnv("SECRET_KEY", "secretkey"))
var GoogleClientID = []byte(internal.GetEnv("GOOGLE_CLIENT_ID", "443648413060-db7g7i880qktvmlemmcnthg4qptclu2l.apps.googleusercontent.com"))

type Claims struct {
	Email string `json:"email" validate:"required,email,email_host"`
	jwt.RegisteredClaims
}

func ValidateJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Sign method not valid")
		}
		return jwtSecret, nil
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
