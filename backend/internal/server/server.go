package server

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"

	"backend/config"
	"backend/internal/database"
	"backend/internal/logger"
	"backend/internal/server/routes"
)

type Server struct {
	port int
	db   database.Service
	http *http.Server
}

var log = logger.GetLogger()

func NewServer() *Server {
	port, err := strconv.Atoi(config.AppPort)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to parse APP_PORT environment variable")
	}

	db := database.New()
	log.Info().Msg("Initializing database tables")
	database.InitTable(db)

	router := routes.InitRoutes(database.Service(db))

	server := &Server{
		port: port,
		db:   db,
		http: &http.Server{
			Addr:         fmt.Sprintf(":%d", port),
			Handler:      router,
			IdleTimeout:  time.Minute,
			ReadTimeout:  10 * time.Second,
			WriteTimeout: 30 * time.Second,
		},
	}

	log.Info().Msgf("Server is starting on port %d", port)
	return server
}

func (s *Server) Run() error {
	log.Info().Msg("Starting HTTP server")
	return s.http.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	log.Info().Msg("Shutting down server...")
	if err := s.db.Close(); err != nil {
		log.Error().Err(err).Msg("Error closing database connection")
	}
	return s.http.Shutdown(ctx)
}
