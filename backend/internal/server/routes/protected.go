package routes

import (
	"backend/internal/database"
	"backend/internal/models"
	"backend/internal/server/middleware"
	"backend/internal/utils"
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func registerProtectedRoutes(r *gin.RouterGroup, _ *Handler) {
	r.GET("/getUser", getUser)
	r.GET("/getSurvey", getSurvey)
	r.GET("/getPhoto", getPhoto)

	r.POST("/addUser", addUser)
	r.POST("/addSurvey", addSurvey)
	r.POST("/addPhoto", addPhoto)
	r.POST("/addUserInfo", addUserInfo)
}

// ---------- GET ----------

func getUser(c *gin.Context) {
	user, err := database.GetUser(middleware.GetEmail(c))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": 500})
		log.Err(err).Msg("Error in the database")
		return
	}

	c.JSON(http.StatusOK, user)
}

func getSurvey(c *gin.Context) {
	var survey models.Survey

	survey, err := database.GetSurvey(middleware.GetEmail(c))
	if err != nil {
		log.Debug().Err(err).Msg("Error during survey retrieval")
		c.JSON(http.StatusInternalServerError, gin.H{"error": 500})
		return
	}

	c.JSON(http.StatusOK, survey)
}

func getPhoto(c *gin.Context) {
	log.Debug().Msg("Getting photo")

	fileData, err := database.GetPhoto(middleware.GetEmail(c))
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve image"})
		}
		return
	}

	c.Header("Content-Type", "application/octet-stream")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=image_%s", middleware.GetEmail(c)))
	c.Data(http.StatusOK, "application/octet-stream", fileData)
}

// ---------- POST ----------

/*
This function init a new user in the database without the extra information like survey,photo,bio,etc...

The function will be expeted a json like this:

	{
		"email": "xxxxx@iismargheritahackbaronissi.edu.it"
		"family_name": "name",
		"given_name": "surname",
	}
*/
func addUser(c *gin.Context) {
	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error in the json bind probably json invalid": err.Error()})
		return
	}

	if err := middleware.Validate.Struct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Data invalid"})
		log.Err(err).Msg("Validation failed")
		return
	}

	if err := database.AddUser(user); err != nil {
		if user, err := database.GetUser(user.Email); err == nil && user.User.Email != "" {
			c.JSON(http.StatusBadRequest, gin.H{"message": "User already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": 500})
		log.Err(err).Msg("Error in the database")
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
func addSurvey(c *gin.Context) {
	var survey models.Survey

	if err := c.ShouldBindJSON(&survey); err != nil {
		log.Debug().Err(err).Msg("Error during json binding")
		c.JSON(http.StatusBadRequest, gin.H{"Error in the json bind probably json invalid": err.Error()})
		return
	}

	if !utils.ValidateSanitazeResponse(survey.Response) {
		log.Debug().Msg("Response not valid")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Data invalid"})
		return
	}

	if err := middleware.Validate.Struct(survey); err != nil {
		log.Debug().Err(err).Msg("Error during validation")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Data invalid"})
		log.Err(err).Msg("Validation failed")
		return
	}

	if err := database.AddSurvey(survey, middleware.GetEmail(c)); err != nil {
		log.Debug().Err(err).Msg("Error during survey insert")
		c.JSON(http.StatusInternalServerError, gin.H{"error": 500})
		log.Err(err).Msg("Error in the database")
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Survey created"})
}

func addPhoto(c *gin.Context) {
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

	var results []map[string]string
	for _, file := range files {
		log.Debug().Str("name", file.Filename).Msg("Uploading file")

		openedFile, err := file.Open()
		if err != nil {
			log.Error().Str("name", file.Filename).Err(err).Msg("Failed to open file")
			results = append(results, map[string]string{"file": file.Filename, "status": "failed", "error": "Failed to open file"})
			continue
		}

		err = database.AddPhoto(middleware.GetEmail(c), openedFile)
		openedFile.Close()
		if err != nil {
			log.Error().Str("name", file.Filename).Err(err).Msg("Failed to upload file")
			results = append(results, map[string]string{"file": file.Filename, "status": "failed", "error": err.Error()})
			continue
		}

		log.Info().Str("name", file.Filename).Msg("File uploaded successfully")
		results = append(results, map[string]string{"file": file.Filename, "status": "success"})
	}

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
func addUserInfo(c *gin.Context) {

	var user models.UserInfo
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error in the json bind probably json invalid": err.Error()})
		return
	}

	if err := middleware.Validate.Struct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Data invalid"})
		log.Err(err).Msg("Validation failed")
		return
	}

	if err := database.AddUserInfo(user, middleware.GetEmail(c)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": 402, "message": err.Error()})
		log.Err(err).Msg("Error in the database")
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User info created"})
}
