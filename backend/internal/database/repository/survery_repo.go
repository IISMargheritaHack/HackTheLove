package repository

import (
	"backend/internal/models"
	"database/sql"
	"errors"
	"fmt"
	"strings"
)

type SurveyRepository struct {
	db *sql.DB
}

func NewSurveyRepository(db *sql.DB) *SurveyRepository {
	return &SurveyRepository{db: db}
}

func (s *SurveyRepository) GetSurvey(email string) (*models.Survey, error) {
	var survey models.Survey

	var userExists bool
	err := s.db.QueryRow("SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)", email).Scan(&userExists)
	if err != nil {
		log.Error().Err(err).Str("email", email).Msg("Error checking if user exists")
		return nil, fmt.Errorf("error checking if user exists: %w", err)
	}
	if !userExists {
		log.Warn().Str("email", email).Msg("User does not exist")
		return nil, nil
	}

	query := `
		SELECT surveys.id_survey, surveys.response
		FROM surveys
		INNER JOIN users ON users.id_survey = surveys.id_survey
		WHERE users.email = $1;
	`
	err = s.db.QueryRow(query, email).Scan(&survey.IdSurvey, &survey.Response)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			log.Warn().Str("email", email).Msg("No survey found")
			return nil, nil
		}
		log.Error().Err(err).Str("email", email).Msg("Error querying survey")
		return nil, err
	}

	log.Debug().Str("email", email).Str("surveyID", fmt.Sprint(survey.IdSurvey)).Msg("Survey retrieved successfully")
	return &survey, nil
}

func (s *SurveyRepository) AddSurvey(survey models.Survey, email string) error {
	var userExists bool
	err := s.db.QueryRow("SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)", email).Scan(&userExists)
	if err != nil {
		log.Error().Err(err).Str("email", email).Msg("Error checking if user exists")
		return fmt.Errorf("error checking if user exists: %w", err)
	}
	if !userExists {
		log.Warn().Str("email", email).Msg("User does not exist, cannot add survey")
		return fmt.Errorf("user with email %s does not exist", email)
	}

	tx, err := s.db.Begin()
	if err != nil {
		log.Error().Err(err).Msg("Failed to start transaction")
		return fmt.Errorf("error starting transaction: %w", err)
	}

	var surveyID string
	queryInsert := "INSERT INTO surveys (response) VALUES ($1) RETURNING id_survey"
	err = tx.QueryRow(queryInsert, survey.Response).Scan(&surveyID)
	if err != nil {
		tx.Rollback()
		log.Error().Err(err).Str("response", survey.Response).Msg("Failed to insert survey")
		return fmt.Errorf("error inserting survey and retrieving ID: %w", err)
	}
	log.Debug().Str("surveyID", fmt.Sprint(surveyID)).Msg("Survey ID generated")

	queryUpdate := "UPDATE users SET id_survey = $1 WHERE email = $2"
	result, err := tx.Exec(queryUpdate, surveyID, email)
	if err != nil {
		tx.Rollback()
		log.Error().Err(err).Str("surveyID", fmt.Sprint(surveyID)).Str("email", email).Msg("Failed to link survey to user")
		return fmt.Errorf("error updating user with survey ID: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("error retrieving rows affected: %w", err)
	}
	if rowsAffected == 0 {
		tx.Rollback()
		log.Warn().Str("email", email).Msg("No user updated with survey ID")
		return fmt.Errorf("no user found with email %s", email)
	}

	if err := tx.Commit(); err != nil {
		log.Error().Err(err).Msg("Failed to commit transaction")
		return fmt.Errorf("error committing transaction: %w", err)
	}

	log.Info().Str("email", email).Str("surveyID", fmt.Sprint(surveyID)).Msg("Survey successfully linked to user")
	return nil
}

func (r *SurveyRepository) GetAllUserSurveyResponse() ([]models.Response, error) {
	query := `
	SELECT users.email, surveys.response, users.sex
	FROM surveys
	INNER JOIN users ON surveys.id_survey = users.id_survey;`
	rows, err := r.db.Query(query)
	if err != nil {
		log.Error().Err(err).Msg("Error querying all survey responses")
		return nil, fmt.Errorf("error querying all survey responses: %w", err)
	}
	defer rows.Close()

	var responses []models.Response
	for rows.Next() {
		var response models.Response
		var responseStr string
		if err := rows.Scan(&response.Email, &responseStr, &response.Sex); err != nil {
			log.Error().Err(err).Msg("Error scanning survey response")
			return nil, fmt.Errorf("error scanning survey response: %w", err)
		}
		response.Response = strings.Split(responseStr, "")
		responses = append(responses, response)
	}

	log.Debug().Msg("All survey responses retrieved successfully")
	return responses, nil
}
