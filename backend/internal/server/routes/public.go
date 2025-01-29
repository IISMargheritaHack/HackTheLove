package routes

import (
	"backend/config"
	"backend/internal/models"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"google.golang.org/api/idtoken"
)

func registerPublicRoutes(r *gin.Engine, h *Handler) {
	public := r.Group("/")
	public.POST("/verifyGoogleJWT", verifyGoogleToken)
	public.GET("/", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"GG WP": 200}) })
	public.GET("/health", h.healthHandler)
	public.GET("/getQuestions", getQuestions)
}

func getQuestions(c *gin.Context) {
	var questionsModel models.Questions

	err := json.Unmarshal(config.Questions, &questionsModel)
	if err != nil {
		log.Fatal().Msgf("Errore nel parsing del JSON: %v", err)
	}
	c.JSON(http.StatusAccepted, questionsModel)
}

func (h *Handler) healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, h.DB.Health())
}

func verifyGoogleToken(c *gin.Context) {
	var body struct {
		IDToken string `json:"idToken"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		log.Err(err).Msg("Error during json binding")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Token not found"})
		return
	}

	log.Debug().Str("token", body.IDToken).Msg("Verifying google token")

	validator, err := idtoken.Validate(c, body.IDToken, config.GoogleClientID)
	if err != nil {
		log.Err(err).Msg("Error during google jwt validation")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Google jwt not valid"})
		return
	}

	payload := validator.Claims
	email := payload["email"].(string)
	familyName := payload["family_name"].(string)
	givenName := payload["given_name"].(string)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":       email,
		"family_name": familyName,
		"given_name":  givenName,
		"exp":         time.Now().Add(time.Hour * 24 * 7).Unix(),
	})

	signedToken, err := token.SignedString(config.JwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error during token signing"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"token":   signedToken,
	})
}
