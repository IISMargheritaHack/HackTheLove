package test

import (
	"backend/config"
	"backend/internal/database"
	"backend/internal/database/repository"
	"backend/internal/server/routes"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func GenerateTestJWT(email string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": email,
		"exp":   9999999999,
	})

	tokenString, _ := token.SignedString(config.JwtSecret)
	return tokenString
}

func CreateTestContext(method, path string, body interface{}, token string) (*gin.Context, *httptest.ResponseRecorder) {
	gin.SetMode(gin.TestMode)

	var jsonBody []byte
	if body != nil {
		jsonBody, _ = json.Marshal(body)
	}

	req, _ := http.NewRequest(method, path, bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", token)
	}

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = req

	return c, w
}

func SetupTestDB() *database.Database {
	db := database.New()
	return db
}

func SetupTestHandler() *routes.Handler {
	db := SetupTestDB()
	return &routes.Handler{
		DB:         *db,
		UserRepo:   repository.NewUserRepository(db.GetDB()),
		SurveyRepo: repository.NewSurveyRepository(db.GetDB()),
		PhotoRepo:  repository.NewPhotoRepository(db.GetDB()),
	}
}

func generateFakeImage() []byte {
	return []byte{
		0xFF, 0xD8, 0xFF, 0xE0,
		0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
		0x02, 0x00, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
		0xFF, 0xDB, 0x00, 0x43, 0x00,
	}
}

func CreateMultipartForm(body *bytes.Buffer, filename string) *multipart.Writer {
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("files", filename)
	if err != nil {
		fmt.Println("Errore nella creazione del file nel form:", err)
		return nil
	}

	imageData := generateFakeImage()
	_, err = io.Copy(part, bytes.NewReader(imageData))
	if err != nil {
		fmt.Println("Errore nella scrittura del file nel form:", err)
	}

	writer.Close()
	return writer
}

func CreateMultipartFormMultiple(body *bytes.Buffer, fileCount int) *multipart.Writer {
	writer := multipart.NewWriter(body)

	for i := 0; i < fileCount; i++ {
		filename := fmt.Sprintf("test%d.jpg", i+1)
		part, err := writer.CreateFormFile("files", filename)
		if err != nil {
			fmt.Println("Errore nella creazione del file nel form:", err)
			continue
		}

		imageData := generateFakeImage()
		_, err = io.Copy(part, bytes.NewReader(imageData))
		if err != nil {
			fmt.Println("Errore nella scrittura del file nel form:", err)
		}
	}

	writer.Close()
	return writer
}
