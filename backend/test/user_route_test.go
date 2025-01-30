package test

import (
	"backend/internal/models"
	"backend/internal/server/middleware"
	"backend/internal/server/routes"
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

var testHandler *routes.Handler

// Inizializziamo il `Handler` per i test
func init() {
	testHandler = SetupTestHandler()
}

// Test `getUser` con JWT valido
func TestGetUser_Success(t *testing.T) {
	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")
	c, w := CreateTestContext("GET", "/getUser", nil, token)

	middleware.JWTAuthMiddleware()(c)
	testHandler.GetUser(c) // ✅ Ora il `Handler` esiste

	assert.Equal(t, http.StatusOK, w.Code)
}

// Test `getUser` senza token JWT
func TestGetUser_Unauthorized(t *testing.T) {
	c, w := CreateTestContext("GET", "/getUser", nil, "")

	middleware.JWTAuthMiddleware()(c)
	testHandler.GetUser(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// Test `addUser` con un utente valido
func TestAddUser_Success(t *testing.T) {
	token := GenerateTestJWT("giuseppe1.pio@iismargheritahackbaronissi.edu.it")

	user := models.User{
		Email:      "giuseppe1.pio@iismargheritahackbaronissi.edu.it",
		FamilyName: "Doe",
		GivenName:  "John",
	}

	c, w := CreateTestContext("POST", "/addUser", user, token)

	middleware.JWTAuthMiddleware()(c)
	testHandler.AddUser(c) // ✅ Ora il `Handler` esiste

	assert.Equal(t, http.StatusCreated, w.Code)
}

// **Test `AddUser` con JSON malformato**
func TestAddUser_InvalidJSON(t *testing.T) {
	token := GenerateTestJWT("giuseppe.pio@iismargheritahackbaronissi.edu.it")
	invalidJSON := `{"email": "test@example.com", "family_name": "Doe"}` // ❌ Manca `given_name`

	req, _ := http.NewRequest("POST", "/addUser", bytes.NewBuffer([]byte(invalidJSON)))
	req.Header.Set("Authorization", token)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = req

	middleware.JWTAuthMiddleware()(c)
	testHandler.AddUser(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

// **Test `AddUser` con utente già esistente**
func TestAddUser_AlreadyExists(t *testing.T) {
	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")

	user := models.User{
		Email:      "francesco.memoli@iismargheritahackbaronissi.edu.it", // Utente già esistente
		FamilyName: "Doe",
		GivenName:  "John",
	}

	c, w := CreateTestContext("POST", "/addUser", user, token)

	middleware.JWTAuthMiddleware()(c)
	testHandler.AddUser(c)

	assert.Equal(t, http.StatusConflict, w.Code) // ✅ Deve restituire `409 Conflict`
}

// Test `addUserInfo` con dati validi
func TestAddUserInfo_Success(t *testing.T) {
	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")

	userInfo := models.UserInfo{
		Phone:   "+393391859180",
		Bio:     "Hello World",
		Age:     25,
		Section: "A",
		Sex:     true,
	}

	c, w := CreateTestContext("POST", "/addUserInfo", userInfo, token)

	middleware.JWTAuthMiddleware()(c)
	testHandler.AddUserInfo(c)

	assert.Equal(t, http.StatusCreated, w.Code)
}

// **Test `AddUserInfo` con dati mancanti**
func TestAddUserInfo_MissingFields(t *testing.T) {
	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")

	userInfo := models.UserInfo{
		Phone: "+393391859180",
		Bio:   "", // ❌ Manca `Age`, `Section`, `Sex`
	}

	c, w := CreateTestContext("POST", "/addUserInfo", userInfo, token)

	middleware.JWTAuthMiddleware()(c)
	testHandler.AddUserInfo(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
