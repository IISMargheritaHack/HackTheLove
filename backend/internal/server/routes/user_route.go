package routes

import (
	"backend/internal/models"
	"backend/internal/server/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetUser(c *gin.Context) {
	email := middleware.GetEmail(c)
	user, err := h.UserRepo.GetUser(email)
	if err != nil {
		log.Error().Err(err).Str("email", email).Msg("Database error while fetching user")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching user"})
		return
	}

	if user == nil || user.User.Email == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

/*
Expected JSON:

	{
		"phone": "",
		"bio": "",
		"age": 0,
		"section": "",
		"sex": ""
	}
*/
func (h *Handler) AddUserInfo(c *gin.Context) {
	var user models.UserInfo
	email := middleware.GetEmail(c)

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format", "details": err.Error()})
		return
	}

	if err := middleware.Validate.Struct(user); err != nil {
		log.Warn().Err(err).Str("email", email).Msg("Validation failed for user info")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid data"})
		return
	}

	if err := h.UserRepo.AddUserInfo(user, email); err != nil {
		log.Error().Err(err).Str("email", email).Msg("Database error while updating user info")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating user info"})
		return
	}

	log.Info().Str("email", email).Msg("User info updated successfully")
	c.JSON(http.StatusCreated, gin.H{"message": "User info updated"})
}

func (h *Handler) GetMatches(c *gin.Context) {
	email := middleware.GetEmail(c)
	matches, err := h.MatchRepo.GetMatches(email)
	if err != nil {
		log.Error().Err(err).Str("email", email).Msg("Database error while fetching matches")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching matches"})
		return
	}

	c.JSON(http.StatusOK, matches)
}

func (h *Handler) SetLike(c *gin.Context) {
	email := middleware.GetEmail(c)

	var body struct {
		EmailMatched string `json:"email_matched" binding:"required"`
		ValueLike    int    `json:"value_like"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		log.Error().Err(err).Str("email", email).Msg("Invalid request body")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	log.Debug().Str("email", email).Msg("Setting like")
	log.Debug().Msgf("Request body: %+v", body)

	err := h.MatchRepo.SetLike(email, body.EmailMatched, body.ValueLike)
	if err != nil {
		log.Error().Err(err).Str("email", email).Msg("Database error while setting like")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error setting like"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Like set"})
}
