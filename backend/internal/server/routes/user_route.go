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
		"email": "xxxxx@iismargheritahackbaronissi.edu.it",
		"family_name": "name",
		"given_name": "surname"
	}
*/
func (h *Handler) AddUser(c *gin.Context) {
	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format", "details": err.Error()})
		return
	}

	if err := middleware.Validate.Struct(user); err != nil {
		log.Warn().Err(err).Msg("Validation failed")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid data"})
		return
	}

	if err := h.UserRepo.AddUser(&user); err != nil {
		existingUser, errCheck := h.UserRepo.GetUser(user.Email)
		if errCheck == nil && existingUser.User.Email != "" {
			c.JSON(http.StatusConflict, gin.H{"message": "User already exists"})
			return
		}
		log.Error().Err(err).Str("email", user.Email).Msg("Database error while adding user")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error adding user"})
		return
	}

	log.Info().Str("email", user.Email).Msg("User created successfully")
	c.JSON(http.StatusCreated, gin.H{"message": "User created"})
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
