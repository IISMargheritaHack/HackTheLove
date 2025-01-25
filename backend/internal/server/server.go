package server

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"

	"backend/internal"
	"backend/internal/database"
)

type Server struct {
	port int
	db   database.Service
}

var l = internal.GetLogger()

func NewServer() *http.Server {
	port, err := strconv.Atoi(internal.GetEnv("APP_PORT", "8080"))
	if err != nil {
		l.Fatal().Err(err).Msg("Failed to parse APP_PORT environment variable")
	}

	NewServer := &Server{
		port: port,
		db:   database.New(),
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", NewServer.port),
		Handler:      NewServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	// Pass the underlying db connection to InitTable
	l.Info().Msg("Initializing database tables")
	database.InitTable(NewServer.db)

	l.Info().Msgf("Server is starting on port %d", NewServer.port)

	return server
}
