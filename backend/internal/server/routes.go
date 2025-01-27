package server

import (
	"backend/internal"
	"backend/internal/database"
	"database/sql"
	_ "embed"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"google.golang.org/api/idtoken"
)

var validate = validator.New()

//go:embed questions.json
var questions []byte

func init() {
	validate.RegisterValidation("email_host", internal.EmailHost)
}

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
			"http://frontend:80",
			"http://localhost:80",
			"http://localhost",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	public := r.Group("/")
	public.POST("/verifyGoogleJWT", s.verifyGoogleToken)
	public.GET("/", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"GG WP": 200}) })
	public.GET("/health", s.healthHandler)
	public.GET("/getQuestions", s.getQuestions)

	protected := r.Group("/")
	protected.Use(JWTAuthMiddleware())
	{
		protected.GET("/getUser", s.getUser)
		protected.GET("/getSurvey", s.getSurvey)
		protected.GET("/getPhoto", s.getPhoto)

		protected.POST("/addUser", s.addUser)
		protected.POST("/addSurvey", s.addSurvey)
		protected.POST("/addPhoto", s.addPhoto)
		protected.POST("/addUserInfo", s.addUserInfo)
	}

	return r
}

func (s *Server) healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, s.db.Health())
}

func (s *Server) getUser(c *gin.Context) {
	user, err := database.GetUser(GetEmail(c))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": 500})
		l.Err(err).Msg("Error in the database")
		return
	}

	c.JSON(http.StatusOK, user)
}

func (s *Server) getSurvey(c *gin.Context) {
	var survey internal.Survey

	survey, err := database.GetSurvey(GetEmail(c))
	if err != nil {
		l.Debug().Err(err).Msg("Error during survey retrieval")
		c.JSON(http.StatusInternalServerError, gin.H{"error": 500})
		return
	}

	c.JSON(http.StatusOK, survey)
}

func (s *Server) getPhoto(c *gin.Context) {

	// Ottieni i dati del file
	fileData, err := database.GetPhoto(GetEmail(c))
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve image"})
		}
		return
	}

	// Imposta gli header per il file
	c.Header("Content-Type", "application/octet-stream")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=image_%d", GetEmail(c)))
	c.Data(http.StatusOK, "application/octet-stream", fileData)
}

func (s *Server) getQuestions(c *gin.Context) {
	var questionsModel internal.Questions

	err := json.Unmarshal(questions, &questionsModel)
	if err != nil {
		log.Fatalf("Errore nel parsing del JSON: %v", err)
	}
	c.JSON(http.StatusAccepted, questionsModel)
}

/*
This function init a new user in the database without the extra information like survey,photo,bio,etc...

The function will be expeted a json like this:

	{
		"email": "xxxxx@iismargheritahackbaronissi.edu.it"
		"family_name": "name",
		"given_name": "surname",
	}
*/
func (s *Server) addUser(c *gin.Context) {
	var user internal.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error in the json bind probably json invalid": err.Error()})
		return
	}

	if err := validate.Struct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Data invalid"})
		l.Err(err).Msg("Validation failed")
		return
	}

	if err := database.AddUser(user); err != nil {
		if user, err := database.GetUser(user.Email); err == nil && user.User.Email != "" {
			c.JSON(http.StatusBadRequest, gin.H{"message": "User already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": 500})
		l.Err(err).Msg("Error in the database")
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created"})
}

/*
Expected json:

	{
		"id_survey": "UUIDv4",
		"response": "11 char lenght response",
	}
*/
func (s *Server) addSurvey(c *gin.Context) {
	var survey internal.Survey

	if err := c.ShouldBindJSON(&survey); err != nil {
		l.Debug().Err(err).Msg("Error during json binding")
		c.JSON(http.StatusBadRequest, gin.H{"Error in the json bind probably json invalid": err.Error()})
		return
	}

	if !internal.ValidateSanitazeResponse(survey.Response) {
		l.Debug().Msg("Response not valid")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Data invalid"})
		return
	}

	if err := validate.Struct(survey); err != nil {
		l.Debug().Err(err).Msg("Error during validation")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Data invalid"})
		l.Err(err).Msg("Validation failed")
		return
	}

	if err := database.AddSurvey(survey, GetEmail(c)); err != nil {
		l.Debug().Err(err).Msg("Error during survey insert")
		c.JSON(http.StatusInternalServerError, gin.H{"error": 500})
		l.Err(err).Msg("Error in the database")
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Survey created"})
}

func (s *Server) addPhoto(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form submission"})
		return
	}

	files := form.File["files"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No files uploaded"})
		return
	}

	// Colleziona i risultati
	var results []map[string]string
	for _, file := range files {
		l.Debug().Str("name", file.Filename).Msg("Uploading file")

		// Prova ad aprire il file
		openedFile, err := file.Open()
		if err != nil {
			l.Error().Str("name", file.Filename).Err(err).Msg("Failed to open file")
			results = append(results, map[string]string{"file": file.Filename, "status": "failed", "error": "Failed to open file"})
			continue
		}

		// Aggiungi la foto al database
		err = database.AddPhoto(GetEmail(c), openedFile)
		openedFile.Close() // Chiudi immediatamente il file
		if err != nil {
			l.Error().Str("name", file.Filename).Err(err).Msg("Failed to upload file")
			results = append(results, map[string]string{"file": file.Filename, "status": "failed", "error": err.Error()})
			continue
		}

		l.Info().Str("name", file.Filename).Msg("File uploaded successfully")
		results = append(results, map[string]string{"file": file.Filename, "status": "success"})
	}

	// Rispondi con i risultati aggregati
	c.JSON(http.StatusOK, gin.H{"results": results})
}

/*
Expected json:

	{
		"email": "",
		"phone": "",
		"bio": "",
		"age": 0,
		"section": "",
		"sex": "",
	}
*/
func (s *Server) addUserInfo(c *gin.Context) {

	var user internal.UserInfo
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error in the json bind probably json invalid": err.Error()})
		return
	}

	if err := validate.Struct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Data invalid"})
		l.Err(err).Msg("Validation failed")
		return
	}

	if err := database.AddUserInfo(user, GetEmail(c)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": 402, "message": err.Error()})
		l.Err(err).Msg("Error in the database")
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User info created"})
}

func (s *Server) verifyGoogleToken(c *gin.Context) {
	var body struct {
		IDToken string `json:"idToken"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		l.Err(err).Msg("Error during json binding")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Token not found"})
		return
	}

	l.Debug().Str("token", body.IDToken).Msg("Verifying google token")

	validator, err := idtoken.Validate(c, body.IDToken, GoogleClientID)
	if err != nil {
		l.Err(err).Msg("Error during google jwt validation")
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

	signedToken, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error during token signing"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"token":   signedToken,
	})
}
