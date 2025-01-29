package routes

import (
	"backend/internal/database"
)

// Handler contiene il riferimento al database per gli handler
type Handler struct {
	DB database.Service
}

// NewHandler inizializza la struttura handler
func NewHandler(db database.Service) *Handler {
	return &Handler{DB: db}
}
