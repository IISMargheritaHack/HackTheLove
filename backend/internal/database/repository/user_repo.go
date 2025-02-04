package repository

import (
	"backend/internal/logger"
	"backend/internal/models"
	"database/sql"
	"errors"
	"fmt"
)

var log = logger.GetLogger()

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) GetUser(email string) (*models.CompleteUser, error) {
	var user models.CompleteUser

	query := `
		SELECT email, name, surname, phone, bio, age, sex, section, classe
		FROM users
		WHERE email = $1;
	`

	err := r.db.QueryRow(query, email).Scan(
		&user.User.Email,
		&user.User.GivenName,
		&user.User.FamilyName,
		&user.UserInfo.Phone,
		&user.UserInfo.Bio,
		&user.UserInfo.Age,
		&user.UserInfo.Sex,
		&user.UserInfo.Section,
		&user.UserInfo.Classe,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			log.Warn().Str("email", email).Msg("User not found")
			return nil, fmt.Errorf("User not found")
		}
		log.Error().Err(err).Str("email", email).Msg("Error querying user")
		return nil, err
	}

	log.Debug().Str("email", email).Msg("User retrieved successfully")
	return &user, nil
}

func (r *UserRepository) AddUser(user *models.User) error {
	query := `
		INSERT INTO users (email, name, surname)
		VALUES ($1, $2, $3)
		ON CONFLICT (email) DO NOTHING;
	`
	_, err := r.db.Exec(query, user.Email, user.GivenName, user.FamilyName)
	if err != nil {
		log.Error().Err(err).Str("email", user.Email).Msg("Error inserting user")
		return fmt.Errorf("error inserting user: %w", err)
	}

	log.Info().Str("email", user.Email).Msg("User added successfully")
	return nil
}

func (r *UserRepository) AddUserInfo(user models.UserInfo, email string) error {
	if !r.CheckIfUserExists(email) {
		return fmt.Errorf("user with email %s does not exist", email)
	}

	query := `
		UPDATE users
		SET phone = $1, bio = $2, age = $3, section = $4, sex = $5, classe = $6
		WHERE email = $7;
	`
	result, err := r.db.Exec(query, user.Phone, user.Bio, user.Age, user.Section, user.Sex, user.Classe, email)
	if err != nil {
		log.Error().Err(err).Str("email", email).Msg("Error updating user info")
		return fmt.Errorf("error updating user info for email %s: %w", email, err)
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		log.Warn().Str("email", email).Msg("No update applied, user might not exist")
		return nil
	}

	log.Info().Str("email", email).Msg("User info updated successfully")
	return nil
}

func (r *UserRepository) CheckIfUserExists(email string) bool {
	query := "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)"
	var exists bool
	err := r.db.QueryRow(query, email).Scan(&exists)
	if err != nil {
		log.Error().Err(err).Str("email", email).Msg("Error checking if user exists")
		return false
	}

	return exists
}
