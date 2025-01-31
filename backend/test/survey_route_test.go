package test

import (
	"backend/internal/models"
	"backend/internal/server/middleware"
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func init() {
	testHandler = SetupTestHandler()
}

func TestGetSurvey_Success(t *testing.T) {
	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")
	c, w := CreateTestContext("GET", "/getSurvey", nil, token)

	middleware.JWTAuthMiddleware()(c)
	testHandler.GetSurvey(c)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetSurvey_Unauthorized(t *testing.T) {
	c, w := CreateTestContext("GET", "/getSurvey", nil, "")

	middleware.JWTAuthMiddleware()(c)
	testHandler.GetSurvey(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestGetSurvey_NotFound(t *testing.T) {
	token := GenerateTestJWT("francesco.sartori@iismargheritahackbaronissi.edu.it")
	c, w := CreateTestContext("GET", "/getSurvey", nil, token)

	middleware.JWTAuthMiddleware()(c)
	testHandler.GetSurvey(c)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestAddSurvey_Success(t *testing.T) {
	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")

	survey := models.Survey{
		Response: "acbadacadab",
	}

	c, w := CreateTestContext("POST", "/addSurvey", survey, token)

	middleware.JWTAuthMiddleware()(c)
	testHandler.AddSurvey(c)

	assert.Equal(t, http.StatusCreated, w.Code)
}

func TestAddSurvey_InvalidJSON(t *testing.T) {
	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")
	invalidJSON := `{"id_survey": "123", "response": 123}` // `response` deve essere stringa

	req, _ := http.NewRequest("POST", "/addSurvey", bytes.NewBuffer([]byte(invalidJSON)))
	req.Header.Set("Authorization", token)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = req

	middleware.JWTAuthMiddleware()(c)
	testHandler.AddSurvey(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestAddSurvey_Unauthorized(t *testing.T) {
	survey := models.Survey{
		Response: "ABCDEFGHIJK",
	}

	c, w := CreateTestContext("POST", "/addSurvey", survey, "")

	middleware.JWTAuthMiddleware()(c)
	testHandler.AddSurvey(c)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestAddSurvey_ShortResponse(t *testing.T) {
	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")

	survey := models.Survey{
		Response: "abc", // ❌ Troppo corto
	}

	c, w := CreateTestContext("POST", "/addSurvey", survey, token)

	middleware.JWTAuthMiddleware()(c)
	testHandler.AddSurvey(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestAddSurvey_InvalidCharactersInResponse(t *testing.T) {
	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")

	survey := models.Survey{
		Response: "ABCD!@#12", // ❌ Contiene caratteri non validi
	}

	c, w := CreateTestContext("POST", "/addSurvey", survey, token)

	middleware.JWTAuthMiddleware()(c)
	testHandler.AddSurvey(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
