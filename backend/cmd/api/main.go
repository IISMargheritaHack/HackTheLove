package main

import (
	"context"
	"os/signal"
	"syscall"
	"time"

	"backend/config"
	"backend/internal/logger"
	"backend/internal/server"

	"github.com/rs/zerolog"
)

var log = logger.GetLogger()

func init() {
	logLevel, err := zerolog.ParseLevel(config.LogLevel)
	if err != nil {
		logLevel = zerolog.InfoLevel
	}
	logFile := config.LogFile

	logger.InitLogger(logger.Config{
		Level:   logLevel,
		LogFile: logFile,
	})
}

func main() {
	server := server.NewServer()

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go func() {
		if err := server.Run(); err != nil {
			log.Fatal().Err(err).Msg("HTTP server error")
		}
	}()

	<-ctx.Done()

	log.Info().Msg("Shutting down gracefully, press Ctrl+C again to force")

	ctxTimeout, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctxTimeout); err != nil {
		log.Error().Err(err).Msg("Server forced to shutdown with error")
	}

	log.Info().Msg("Server exiting")
}
