package routes

import (
	"backend/config"
	"backend/internal/server/middleware"
	"database/sql"
	"encoding/base64"
	"errors"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

var allowedMimeTypes = map[string]bool{
	"image/png":  true,
	"image/jpeg": true,
	"image/gif":  true,
}

func (h *Handler) GetPhoto(c *gin.Context) {
	email := middleware.GetEmail(c)
	log.Debug().Str("email", email).Msg("Fetching photos")

	photos, err := h.PhotoRepo.GetPhoto(email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			log.Warn().Str("email", email).Msg("No images found")
			c.JSON(http.StatusNotFound, gin.H{"error": "No images found"})
			return
		}
		log.Error().Err(err).Str("email", email).Msg("Database error while fetching photos")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve images"})
		return
	}

	var encodedImages []string
	for _, imgData := range photos {
		encodedImages = append(encodedImages, base64.StdEncoding.EncodeToString(imgData))
	}

	c.JSON(http.StatusOK, gin.H{"images": encodedImages})
}

/*
Endpoint per caricare immagini via Multipart Form
*/
func (h *Handler) AddPhoto(c *gin.Context) {
	email := middleware.GetEmail(c)

	form, err := c.MultipartForm()
	if err != nil {
		log.Warn().Str("email", email).Msg("Invalid form submission")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form submission"})
		return
	}

	files := form.File["files"]
	if len(files) == 0 {
		log.Warn().Str("email", email).Msg("No files uploaded")
		c.JSON(http.StatusBadRequest, gin.H{"error": "No files uploaded"})
		return
	}

	log.Debug().Int("number file uploaded", len(files)).Msg("File uploaded")

	if len(files) > config.MAX_PHOTO_NUMBER {
		log.Warn().Str("email", email).Msg("Too many files uploaded")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Too many files uploaded"})
		return
	}

	if !h.UserRepo.CheckIfUserExists(email) {
		log.Warn().Str("email", email).Msg("User does not exist")
		c.JSON(http.StatusBadRequest, gin.H{"error": "User does not exist"})
		return
	}

	photoNumber, err := h.PhotoRepo.GetNumberPhoto(email)
	log.Debug().Int("photo number", photoNumber).Msg("Photo number")
	if err != nil {
		log.Error().Str("email", email).Err(err).Msg("Failed to retrieve user photo number")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user photo number"})
		return
	}

	if photoNumber > config.MAX_PHOTO_NUMBER {
		log.Warn().Str("email", email).Err(err).Msg("User does not have enough space")
		c.JSON(http.StatusBadRequest, gin.H{"error": "User does not have enough space"})
		return
	}

	var results []map[string]string
	for _, file := range files {
		log.Debug().Str("email", email).Str("filename", file.Filename).Msg("Uploading file")

		openedFile, err := file.Open()
		if err != nil {
			log.Error().Str("email", email).Str("filename", file.Filename).Err(err).Msg("Failed to open file")
			results = append(results, map[string]string{"file": file.Filename, "status": "failed", "error": "Failed to open file"})
			continue
		}
		defer openedFile.Close()

		buffer := make([]byte, 512)
		_, err = openedFile.Read(buffer)
		if err != nil && err != io.EOF {
			log.Error().Str("email", email).Str("filename", file.Filename).Err(err).Msg("Failed to read file header")
			results = append(results, map[string]string{"file": file.Filename, "status": "failed", "error": "Failed to read file header"})
			continue
		}

		mimeType := http.DetectContentType(buffer)
		if !allowedMimeTypes[mimeType] {
			log.Warn().Str("email", email).Str("filename", file.Filename).Str("mime", mimeType).Msg("Invalid file format")
			results = append(results, map[string]string{"file": file.Filename, "status": "failed", "error": "Invalid file format"})
			continue
		}

		_, err = openedFile.Seek(0, io.SeekStart)
		if err != nil {
			log.Error().Str("email", email).Str("filename", file.Filename).Err(err).Msg("Failed to reset file pointer")
			results = append(results, map[string]string{"file": file.Filename, "status": "failed", "error": "Failed to reset file pointer"})
			continue
		}

		err = h.PhotoRepo.AddPhoto(email, openedFile)
		if err != nil {
			log.Error().Str("email", email).Str("filename", file.Filename).Err(err).Msg("Failed to upload file")
			results = append(results, map[string]string{"file": file.Filename, "status": "failed", "error": err.Error()})
			continue
		}

		log.Info().Str("email", email).Str("filename", file.Filename).Str("mime", mimeType).Msg("File uploaded successfully")
		results = append(results, map[string]string{"file": file.Filename, "status": "success"})
	}

	c.JSON(http.StatusOK, gin.H{"results": results})
}
