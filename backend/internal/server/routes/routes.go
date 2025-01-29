package routes

import (
	"backend/internal/database"
	"backend/internal/logger"
	"backend/internal/server/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var log = logger.GetLogger()

func InitRoutes(db database.Service) *gin.Engine {
	r := gin.Default()
	h := NewHandler(db)

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

	registerPublicRoutes(r, h)

	protected := r.Group("/")
	protected.Use(middleware.JWTAuthMiddleware())
	registerProtectedRoutes(protected, h)

	return r
}
