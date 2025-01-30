package routes

import (
	"backend/internal/models"
	"backend/internal/server/middleware"
	"backend/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetSurvey recupera il sondaggio di un utente
func (h *Handler) GetSurvey(c *gin.Context) {
	email := middleware.GetEmail(c)
	survey, err := h.SurveyRepo.GetSurvey(email)
	if err != nil {
		log.Error().Err(err).Str("email", email).Msg("Database error while fetching survey")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching survey"})
		return
	}

	if survey == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Survey not found"})
		return
	}

	c.JSON(http.StatusOK, survey)
}

/*
Expected JSON:

	{
		"id_survey": "UUIDv4",
		"response": "11 char length response"
	}
*/
func (h *Handler) AddSurvey(c *gin.Context) {
	var survey models.Survey
	email := middleware.GetEmail(c)

	if err := c.ShouldBindJSON(&survey); err != nil {
		log.Warn().Err(err).Msg("Invalid JSON format")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format", "details": err.Error()})
		return
	}

	if !utils.ValidateSanitazeResponse(survey.Response) {
		log.Warn().Str("email", email).Msg("Invalid survey response format")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid survey response"})
		return
	}

	if err := middleware.Validate.Struct(survey); err != nil {
		log.Warn().Err(err).Str("email", email).Msg("Validation failed")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid data"})
		return
	}

	if err := h.SurveyRepo.AddSurvey(survey, email); err != nil {
		log.Error().Err(err).Str("email", email).Msg("Database error while adding survey")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error adding survey"})
		return
	}

	log.Info().Str("email", email).Msg("Survey created successfully")
	c.JSON(http.StatusCreated, gin.H{"message": "Survey created"})
}
