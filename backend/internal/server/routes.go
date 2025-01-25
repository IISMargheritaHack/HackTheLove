package server

import (
	"backend/internal"
	"backend/internal/database"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

func init() {
	validate.RegisterValidation("email_host", internal.EmailHost)
}

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Add your frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true, // Enable cookies/auth
	}), JWTAuthMiddleware())

	r.GET("/", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"GG WP": 200}) })
	r.GET("/health", s.healthHandler)

	r.GET("/getUser", s.getUser)
	r.GET("/getSurvey", s.getSurvey)
	r.GET("/getPhoto", s.getPhoto)
	r.GET("/getQuestions", s.getQuestions)

	r.POST("/addUser", s.addUser)
	r.POST("/addSurvey", s.addSurvey)
	r.POST("/addPhoto", s.addPhoto)
	r.POST("/addUserInfo", s.addUserInfo)

	return r
}

func (s *Server) healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, s.db.Health())
}

func (s *Server) getUser(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")

	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token missing"})
		c.Abort()
		return
	}

	claims, err := ValidateJWT(tokenString)

	user, err := database.GetUser(claims.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": 500})
		l.Err(err).Msg("Error in the database")
		return
	}

	c.JSON(http.StatusOK, user)
}

func (s *Server) getSurvey(c *gin.Context) {}

func (s *Server) getPhoto(c *gin.Context) {}

func (s *Server) getQuestions(c *gin.Context) {}

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

func (s *Server) addSurvey(c *gin.Context) {}

func (s *Server) addPhoto(c *gin.Context) {}

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
		c.JSON(http.StatusInternalServerError, gin.H{"error": 500})
		l.Err(err).Msg("Error in the database")
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User info created"})
}
