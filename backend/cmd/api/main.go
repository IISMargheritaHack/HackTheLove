package main

import (
	"context"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	"backend/internal"
	"backend/internal/server"

	"github.com/rs/zerolog"
)

var l = internal.GetLogger()

func gracefulShutdown(apiServer *http.Server, done chan bool) {
	// Create context that listens for the interrupt signal from the OS.
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	// Listen for the interrupt signal.
	<-ctx.Done()

	l.Info().Msg("Shutting down gracefully, press Ctrl+C again to force")

	// The context is used to inform the server it has 5 seconds to finish
	// the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := apiServer.Shutdown(ctx); err != nil {
		l.Error().Err(err).Msg("Server forced to shutdown with error")
	}

	l.Info().Msg("Server exiting")

	// Notify the main goroutine that the shutdown is complete
	done <- true
}

func init() {
	internal.SetLevel(zerolog.DebugLevel)
}

func main() {

	server := server.NewServer()

	// Create a done channel to signal when the shutdown is complete
	done := make(chan bool, 1)

	// Run graceful shutdown in a separate goroutine
	go gracefulShutdown(server, done)

	err := server.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		l.Fatal().Err(err).Msg("HTTP server error")
	}

	// Wait for the graceful shutdown to complete
	<-done
	l.Info().Msg("Graceful shutdown complete.")
}
