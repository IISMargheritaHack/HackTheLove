package server

import (
	logger "backend/internal"
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var l = logger.GetLogger()

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Add your frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true, // Enable cookies/auth
	}))

	r.GET("/", s.HelloWorldHandler)
	r.GET("/health", s.healthHandler)

	r.GET("/getUser", s.getUser)
	r.GET("/getSurvey", s.getSurvey)
	r.GET("/getPhoto", s.getPhoto)

	r.POST("/addUser", s.addUser)
	r.POST("/addSurvey", s.addSurvey)
	r.POST("/addPhoto", s.addPhoto)

	return r
}

func (s *Server) HelloWorldHandler(c *gin.Context) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	c.JSON(http.StatusOK, resp)
}

func (s *Server) healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, s.db.Health())
}

func (s *Server) getUser(c *gin.Context) {
	auth, err := c.Cookie("auth") // Viene preso il cookie AUTH dal client (generato da google pero che gira solo in runtime quindi non salvato da nessuna) viene parsato e verra usato per fare tutte le query in modo sicuro
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	user, err := parseJWT(auth)

	l.Debug().Msg(auth)
	l.Debug().Msg(fmt.Sprint(parseJWT(auth)))
	l.Debug().Str("Email", user.Email).Msg("Displayed data")

	// user, err := s.db.GetUser(auth)
}

func (s *Server) getSurvey(c *gin.Context) {}

func (s *Server) getPhoto(c *gin.Context) {}

func (s *Server) addUser(c *gin.Context) {}

func (s *Server) addSurvey(c *gin.Context) {}

func (s *Server) addPhoto(c *gin.Context) {}
