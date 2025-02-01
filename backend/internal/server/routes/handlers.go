package routes

import (
	"backend/internal/database"
	"backend/internal/database/repository"
)

type Handler struct {
	DB         database.Database
	UserRepo   *repository.UserRepository
	SurveyRepo *repository.SurveyRepository
	PhotoRepo  *repository.PhotoRepository
	MatchRepo  *repository.MatchRepository
}

func NewHandler(db database.Database) *Handler {
	sqlDB := db.GetDB()

	return &Handler{
		DB:         db,
		UserRepo:   repository.NewUserRepository(sqlDB),
		SurveyRepo: repository.NewSurveyRepository(sqlDB),
		PhotoRepo:  repository.NewPhotoRepository(sqlDB),
		MatchRepo:  repository.NewMatchRepository(sqlDB),
	}
}
