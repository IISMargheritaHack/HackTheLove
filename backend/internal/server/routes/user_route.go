package routes

import (
	"backend/config"
	"backend/internal/models"
	"backend/internal/server/middleware"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

var timeRelease time.Time

func init() {
	var err error
	timeRelease, err = time.Parse(time.RFC3339, config.TimeReleaseMatch)
	if err != nil {
		log.Fatal().Err(err).Msg("Error parsing schedule time. The format should be RFC3339 (e.g., 2021-09-01T16:00:00Z)")
	}
}

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

func (h *Handler) GetUserByParams(c *gin.Context) {
	email := c.Query("email")
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
	log.Debug().Msgf("Time release: %s", timeRelease)

	// if !timeRelease.After(time.Now()) {
	// 	c.JSON(http.StatusForbidden, gin.H{"error": "Matches are not available yet"})
	// 	return
	// }

	email := middleware.GetEmail(c)
	matches, err := h.MatchRepo.GetMatches(email)
	if err != nil {
		log.Error().Err(err).Str("email", email).Msg("Database error while fetching matches")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching matches"})
		return
	}

	c.JSON(http.StatusOK, matches)
}

func (h *Handler) GetLikesMatches(c *gin.Context) {
	email := middleware.GetEmail(c)
	matches, err := h.MatchRepo.GetLikesMatches(email)
	if err != nil {
		log.Error().Err(err).Str("email", email).Msg("Database error while fetching matches")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching matches"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"likes_by": matches})
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
