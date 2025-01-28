package database

import (
	"backend/internal"
	"context"
	"database/sql"
	_ "embed"
	"fmt"
	"io"
	"strconv"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	_ "github.com/joho/godotenv/autoload"
)

//go:embed init.sql
var tablesQueries string

// Service represents a service that interacts with a database.
type Service interface {
	// Health returns a map of health status information.
	// The keys and values in the map are service-specific.
	Health() map[string]string

	// Close terminates the database connection.
	// It returns an error if the connection cannot be closed.
	Close() error
}

type service struct {
	db *sql.DB
}

var (
	database   = internal.GetEnv("DB_DATABASE", "postgres")
	password   = internal.GetEnv("DB_PASSWORD", "password")
	username   = internal.GetEnv("DB_USERNAME", "username")
	port       = internal.GetEnv("DB_PORT", "5432")
	host       = internal.GetEnv("DB_HOST", "localhost")
	schema     = internal.GetEnv("DB_SCHEMA", "public")
	dbInstance *service
)

var l = internal.GetLogger()

// For user the instance: db.(*service).db
func New() Service {
	// Reuse Connection
	if dbInstance != nil {
		return dbInstance
	}
	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable&search_path=%s", username, password, host, port, database, schema)

	l.Debug().Msg(connStr)

	db, err := sql.Open("pgx", connStr)
	if err != nil {
		l.Fatal().Err(err).Msg("Failed to open database connection")
	}
	dbInstance = &service{
		db: db,
	}
	return dbInstance
}

func InitTable(db Service) {
	dbInstance := db.(*service).db
	_, err := dbInstance.Exec(tablesQueries)
	if err != nil {
		l.Fatal().Err(err).Msg("Failed to initialize tables")
	}
}

// Health checks the health of the database connection by pinging the database.
// It returns a map with keys indicating various health statistics.
func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	stats := make(map[string]string)

	// Ping the database
	err := s.db.PingContext(ctx)
	if err != nil {
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("db down: %v", err)
		l.Error().Err(err).Msg("Database is down")
		return stats
	}

	// Database is up, add more statistics
	stats["status"] = "up"
	stats["message"] = "It's healthy"

	// Get database stats (like open connections, in use, idle, etc.)
	dbStats := s.db.Stats()
	stats["open_connections"] = strconv.Itoa(dbStats.OpenConnections)
	stats["in_use"] = strconv.Itoa(dbStats.InUse)
	stats["idle"] = strconv.Itoa(dbStats.Idle)
	stats["wait_count"] = strconv.FormatInt(dbStats.WaitCount, 10)
	stats["wait_duration"] = dbStats.WaitDuration.String()
	stats["max_idle_closed"] = strconv.FormatInt(dbStats.MaxIdleClosed, 10)
	stats["max_lifetime_closed"] = strconv.FormatInt(dbStats.MaxLifetimeClosed, 10)

	// Evaluate stats to provide a health message
	if dbStats.OpenConnections > 40 { // Assuming 50 is the max for this example
		stats["message"] = "The database is experiencing heavy load."
		l.Warn().Str("message", stats["message"]).Msg("Database load warning")
	}

	if dbStats.WaitCount > 1000 {
		stats["message"] = "The database has a high number of wait events, indicating potential bottlenecks."
		l.Warn().Str("message", stats["message"]).Msg("Database wait event warning")
	}

	if dbStats.MaxIdleClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many idle connections are being closed, consider revising the connection pool settings."
		l.Warn().Str("message", stats["message"]).Msg("Idle connections warning")
	}

	if dbStats.MaxLifetimeClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many connections are being closed due to max lifetime, consider increasing max lifetime or revising the connection usage pattern."
		l.Warn().Str("message", stats["message"]).Msg("Max lifetime closed warning")
	}

	return stats
}

// Close closes the database connection.
// It logs a message indicating the disconnection from the specific database.
// If the connection is successfully closed, it returns nil.
// If an error occurs while closing the connection, it returns the error.
func (s *service) Close() error {
	l.Info().Msgf("Disconnected from database: %s", database)
	return s.db.Close()
}

func GetUser(email string) (internal.CompleteUser, error) {
	var user internal.CompleteUser

	query := `
		SELECT email, name, surname, phone, bio, age, sex, section
		FROM users
		WHERE email = $1;
	`

	err := dbInstance.db.QueryRow(query, email).Scan(
		&user.User.Email,
		&user.User.GivenName,
		&user.User.FamilyName,
		&user.UserInfo.Phone,
		&user.UserInfo.Bio,
		&user.UserInfo.Age,
		&user.UserInfo.Sex,
		&user.UserInfo.Section,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return internal.CompleteUser{}, fmt.Errorf("no user found with email: %s", email)
		}
		return internal.CompleteUser{}, fmt.Errorf("error querying user: %w", err)
	}

	return user, nil
}

func GetSurvey(email string) (internal.Survey, error) {
	var survey internal.Survey

	if !CheckIfUserExists(email) {
		return internal.Survey{}, fmt.Errorf("user with email %s already exists", email)
	}

	query := `
		SELECT surveys.id_survey, surveys.response
		FROM surveys
		INNER JOIN users ON users.id_survey = surveys.id_survey
		WHERE users.email = $1;
	`

	err := dbInstance.db.QueryRow(query, email).Scan(&survey.IdSurvey, &survey.Response)
	if err != nil {
		if err == sql.ErrNoRows {
			return internal.Survey{}, fmt.Errorf("no survey found for email: %s", email)
		}
		return internal.Survey{}, fmt.Errorf("error querying survey: %w", err)
	}

	return survey, nil
}

func AddUser(user internal.User) error {
	query := "INSERT INTO users (email, name, surname) VALUES ($1, $2, $3)"
	result, err := dbInstance.db.Exec(query, user.Email, user.GivenName, user.FamilyName)
	if err != nil {
		return fmt.Errorf("error inserting user: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error retrieving affected rows: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no rows were inserted for user %s", user.Email)
	}

	l.Debug().Msgf("User added successfully: %s (Rows affected: %d)", user.Email, rowsAffected)

	return nil
}

func AddUserInfo(user internal.UserInfo, email string) error {

	if !CheckIfUserExists(email) {
		return fmt.Errorf("user with email %s already exists", email)
	}

	query := `
		UPDATE users
		SET phone = $1, bio = $2, age = $3, section = $4, sex = $5
		WHERE email = $6;
	`
	result, err := dbInstance.db.Exec(query, user.Phone, user.Bio, user.Age, user.Section, user.Sex, email)
	if err != nil {
		return fmt.Errorf("error updating user info for email %s: %w", email, err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error retrieving affected rows: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no user found with email %s, no update applied", email)
	}

	l.Debug().Msgf("User info updated successfully for email %s (Rows affected: %d)", email, rowsAffected)

	return nil
}

func AddSurvey(survey internal.Survey, email string) error {
	l.Debug().Str("Email", email).Msg("Email received")
	l.Debug().Str("Response", survey.Response).Msg("Response received")

	if !CheckIfUserExists(email) {
		return fmt.Errorf("user with email %s already exists", email)
	}

	tx, err := dbInstance.db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		} else if err != nil {
			tx.Rollback()
		} else {
			err = tx.Commit()
		}
	}()

	var surveyID string

	queryInsert := "INSERT INTO surveys (response) VALUES ($1) RETURNING id_survey"
	err = tx.QueryRow(queryInsert, survey.Response).Scan(&surveyID)
	if err != nil {
		l.Error().Err(err).Str("Response", survey.Response).Msg("Failed to insert survey")
		return fmt.Errorf("error inserting survey and retrieving ID: %w", err)
	}

	l.Debug().Str("SurveyID", surveyID).Msg("Survey ID generated")

	queryUpdate := "UPDATE users SET id_survey = $1 WHERE email = $2"
	result, err := tx.Exec(queryUpdate, surveyID, email)
	if err != nil {
		l.Error().Err(err).Str("SurveyID", surveyID).Str("Email", email).Msg("Failed to update user with survey ID")
		return fmt.Errorf("error updating user with survey ID: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error retrieving rows affected: %w", err)
	}

	if rowsAffected == 0 {
		l.Warn().Str("Email", email).Msg("No user updated with survey ID")
		return fmt.Errorf("no user found with email %s", email)
	}

	l.Debug().Str("Email", email).Str("SurveyID", surveyID).Msg("Survey successfully linked to user")

	return nil
}

func AddPhoto(email string, imageFile io.Reader) error {

	l.Debug().Str("Email", email).Msg("Email received")

	tx, err := dbInstance.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}
	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		} else if err != nil {
			tx.Rollback()
		} else {
			err = tx.Commit()
		}
	}()

	var loOID uint32
	err = tx.QueryRow("SELECT lo_create(0)").Scan(&loOID)
	if err != nil {
		return fmt.Errorf("failed to create large object: %w", err)
	}

	var loFd int
	err = tx.QueryRow("SELECT lo_open($1, $2)", loOID, 0x20000).Scan(&loFd) // 0x20000 = modalità scrittura
	if err != nil {
		return fmt.Errorf("failed to open large object: %w", err)
	}

	buf := make([]byte, 4096)
	for {
		n, readErr := imageFile.Read(buf)
		if n > 0 {
			_, errWrite := tx.Exec("SELECT lowrite($1, $2)", loFd, buf[:n])
			if errWrite != nil {
				return fmt.Errorf("failed to write to large object: %w", errWrite)
			}
		}
		if readErr != nil {
			if readErr == io.EOF {
				break
			}
			return fmt.Errorf("failed to read image file: %w", readErr)
		}
	}

	_, err = tx.Exec("SELECT lo_close($1)", loFd)
	if err != nil {
		return fmt.Errorf("failed to close large object: %w", err)
	}

	_, err = tx.Exec(`
        INSERT INTO images (email_user, lo_oid)
        VALUES ($1, $2)
    `, email, loOID)
	if err != nil {
		return fmt.Errorf("failed to insert image record: %w", err)
	}

	return nil
}

func GetImageIDByEmail(email string) (int, error) {
	var imageID int

	// Query per ottenere l'imageID
	query := `
		SELECT id_image
		FROM images
		WHERE email_user = $1
		ORDER BY uploaded_at DESC
		LIMIT 1;
	`

	err := dbInstance.db.QueryRow(query, email).Scan(&imageID)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("no images found for email: %s", email)
		}
		return 0, fmt.Errorf("failed to retrieve image ID: %w", err)
	}

	return imageID, nil
}

func GetPhoto(email string) ([]byte, error) {

	imageID, err := GetImageIDByEmail(email)

	l.Debug().Int("ImageID", imageID).Msg("ImageID received")

	tx, err := dbInstance.db.Begin()

	if err != nil {
		return nil, fmt.Errorf("failed to start transaction: %w", err)
	}
	defer func() ([]byte, error) {
		if err != nil {
			tx.Rollback()
		} else {
			commitErr := tx.Commit()
			if commitErr != nil {
				return nil, fmt.Errorf("failed to commit transaction: %w", commitErr)
			}
		}
		return nil, nil
	}()

	var loOID uint32
	err = tx.QueryRow("SELECT lo_oid FROM images WHERE id_image = $1", imageID).Scan(&loOID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("image with ID %d not found", imageID)
		}
		return nil, fmt.Errorf("failed to retrieve lo_oid: %w", err)
	}

	l.Debug().Uint32("loOID", loOID).Msg("loOID received")

	var loFd int
	err = tx.QueryRow("SELECT lo_open($1, $2)", loOID, 0x40000).Scan(&loFd) // 0x40000 = modalità lettura
	if err != nil {
		return nil, fmt.Errorf("failed to open large object: %w", err)
	}

	var fileData []byte
	for {
		var chunk []byte
		err = tx.QueryRow("SELECT loread($1, $2)", loFd, 4096).Scan(&chunk)
		if err != nil {
			if err == sql.ErrNoRows {
				break
			}
			return nil, fmt.Errorf("failed to read large object: %w", err)
		}
		if len(chunk) == 0 {
			break
		}
		fileData = append(fileData, chunk...)
	}

	defer func() {
		_, closeErr := tx.Exec("SELECT lo_close($1)", loFd)
		if closeErr != nil {
			l.Error().Err(closeErr).Msg("failed to close large object")
		}
	}()

	return fileData, nil
}

func CheckIfUserExists(email string) bool {
	user, err := GetUser(email)
	if err != nil {
		return false
	}
	if user.User.Email == "" {
		return false
	}
	return true
}
