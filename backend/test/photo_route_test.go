package test

// import (
// 	"backend/internal/server/middleware"
// 	"bytes"
// 	"fmt"
// 	"net/http"
// 	"testing"

// 	"github.com/stretchr/testify/assert"
// )

// // Setup Handler di test
// func init() {
// 	testHandler = SetupTestHandler()
// }

// // Test `GetPhoto` con JWT valido e immagini disponibili
// func TestGetPhoto_Success(t *testing.T) {
// 	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")
// 	c, w := CreateTestContext("GET", "/getPhoto", nil, token)

// 	middleware.JWTAuthMiddleware()(c)
// 	testHandler.GetPhoto(c)

// 	assert.Equal(t, http.StatusOK, w.Code)
// }

// // Test `GetPhoto` senza token JWT
// func TestGetPhoto_Unauthorized(t *testing.T) {
// 	c, w := CreateTestContext("GET", "/getPhoto", nil, "")

// 	middleware.JWTAuthMiddleware()(c)
// 	testHandler.GetPhoto(c)

// 	assert.Equal(t, http.StatusUnauthorized, w.Code)
// }

// // Test `GetPhoto` con nessuna immagine trovata
// func TestGetPhoto_NotFound(t *testing.T) {
// 	token := GenerateTestJWT("giuseppe.pio@iismargheritahackbaronissi.edu.it")
// 	c, w := CreateTestContext("GET", "/getPhoto", nil, token)

// 	middleware.JWTAuthMiddleware()(c)
// 	testHandler.GetPhoto(c)

// 	assert.Equal(t, http.StatusNotFound, w.Code)
// }

// // Test `AddPhoto` con file valido
// func TestAddPhoto_Success(t *testing.T) {
// 	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")

// 	body := new(bytes.Buffer)
// 	writer := CreateMultipartForm(body, "test.jpg")

// 	// ✅ Assicuriamoci che il `Content-Type` sia impostato correttamente
// 	c, w := CreateTestContext("POST", "/addPhoto", body, token)
// 	c.Request.Header.Set("Content-Type", writer.FormDataContentType())

// 	middleware.JWTAuthMiddleware()(c)
// 	testHandler.AddPhoto(c)

// 	fmt.Println("Risposta API:", w.Body.String()) // 🔍 Debug

// 	assert.Equal(t, http.StatusOK, w.Code)
// }

// // Test `AddPhoto` senza autenticazione
// func TestAddPhoto_Unauthorized(t *testing.T) {
// 	body := new(bytes.Buffer)
// 	writer := CreateMultipartForm(body, "test.jpg")

// 	c, w := CreateTestContext("POST", "/addPhoto", body, "")
// 	c.Request.Header.Set("Content-Type", writer.FormDataContentType())

// 	middleware.JWTAuthMiddleware()(c)
// 	testHandler.AddPhoto(c)

// 	assert.Equal(t, http.StatusUnauthorized, w.Code)
// }

// // Test `AddPhoto` con file non immagine
// func TestAddPhoto_InvalidFileType(t *testing.T) {
// 	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")

// 	body := new(bytes.Buffer)
// 	writer := CreateMultipartForm(body, "test.txt")

// 	c, w := CreateTestContext("POST", "/addPhoto", body, token)
// 	c.Request.Header.Set("Content-Type", writer.FormDataContentType())

// 	middleware.JWTAuthMiddleware()(c)
// 	testHandler.AddPhoto(c)

// 	assert.Equal(t, http.StatusBadRequest, w.Code)
// 	assert.Contains(t, w.Body.String(), "Invalid file format")
// }

// // Test `AddPhoto` con troppi file
// func TestAddPhoto_TooManyFiles(t *testing.T) {
// 	token := GenerateTestJWT("francesco.memoli@iismargheritahackbaronissi.edu.it")

// 	body := new(bytes.Buffer)
// 	writer := CreateMultipartFormMultiple(body, 5+1) // Sicuro che supera il limite

// 	c, w := CreateTestContext("POST", "/addPhoto", body, token)
// 	c.Request.Header.Set("Content-Type", writer.FormDataContentType())

// 	middleware.JWTAuthMiddleware()(c)
// 	testHandler.AddPhoto(c)

// 	// 🔍 Debug: Stampiamo la risposta del server
// 	fmt.Println("Risposta API:", w.Body.String())

// 	assert.Equal(t, http.StatusBadRequest, w.Code)
// 	assert.Contains(t, w.Body.String(), "Too many files uploaded")
// }
