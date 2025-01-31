package test

import (
	"backend/internal/server/middleware"
	"backend/internal/server/routes"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

var testHandler *routes.Handler

func init() {
	testHandler = SetupTestHandler()
}

func TestGetUser_Success(t *testing.T) {
	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")
	c, w := CreateTestContext("GET", "/getUser", nil, token)

	middleware.JWTAuthMiddleware()(c)
	testHandler.GetUser(c) // ✅ Ora il `Handler` esiste

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetUser_Unauthorized(t *testing.T) {
	c, w := CreateTestContext("GET", "/getUser", nil, "")

	middleware.JWTAuthMiddleware()(c)
	testHandler.GetUser(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
