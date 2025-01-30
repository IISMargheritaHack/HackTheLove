package test

import (
	"backend/config"
	"backend/internal/server/middleware"
	"net/http"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

// Test JWT valido
func TestJWTAuthMiddleware_ValidToken(t *testing.T) {
	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")
	c, w := CreateTestContext("GET", "/getUser", nil, token)

	middleware.JWTAuthMiddleware()(c)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "francesco.memoli@iismargheritahackbaronissi.edu.it", c.GetString("email"))
}

// Test JWT mancante
func TestJWTAuthMiddleware_MissingToken(t *testing.T) {
	c, w := CreateTestContext("GET", "/getUser", nil, "")

	middleware.JWTAuthMiddleware()(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// Test JWT non valido
func TestJWTAuthMiddleware_InvalidToken(t *testing.T) {
	c, w := CreateTestContext("GET", "/getUser", nil, "invalid.token.here")

	middleware.JWTAuthMiddleware()(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// **Test JWT Scaduto**
func TestJWTAuthMiddleware_ExpiredToken(t *testing.T) {
	// Creiamo un token scaduto
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": "francesco.memoli@iismargheritahackbaronissi.edu.it",
		"exp":   time.Now().Add(-time.Hour).Unix(), // ⏳ Scaduto un'ora fa
	})
	tokenString, _ := token.SignedString(config.JwtSecret)

	c, w := CreateTestContext("GET", "/getUser", nil, tokenString)

	middleware.JWTAuthMiddleware()(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "expired") // Messaggio di errore
}

// **Test JWT con firma modificata**
func TestJWTAuthMiddleware_TamperedSignature(t *testing.T) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": "francesco.memoli@iismargheritahackbaronissi.edu.it",
		"exp":   time.Now().Add(time.Hour).Unix(),
	})
	tokenString, _ := token.SignedString([]byte("wrong_secret")) // ❌ Firma sbagliata

	c, w := CreateTestContext("GET", "/getUser", nil, tokenString)

	middleware.JWTAuthMiddleware()(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// **Test JWT senza email nel payload**
func TestJWTAuthMiddleware_MissingEmail(t *testing.T) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp": time.Now().Add(time.Hour).Unix(),
	})
	tokenString, _ := token.SignedString([]byte("my_secret_key"))

	c, w := CreateTestContext("GET", "/getUser", nil, tokenString)

	middleware.JWTAuthMiddleware()(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// **Test JWT con algoritmo non valido**
func TestJWTAuthMiddleware_InvalidAlgorithm(t *testing.T) {
	token := jwt.NewWithClaims(jwt.SigningMethodNone, jwt.MapClaims{ // ❌ Algoritmo errato
		"email": "francesco.memoli@iismargheritahackbaronissi.edu.it",
		"exp":   time.Now().Add(time.Hour).Unix(),
	})
	tokenString, _ := token.SignedString([]byte(config.JwtSecret))

	c, w := CreateTestContext("GET", "/getUser", nil, tokenString)

	middleware.JWTAuthMiddleware()(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
