package database

import (
	"backend/internal"
	"context"
	"database/sql"
	_ "embed"
	"fmt"
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
	stm, err := dbInstance.db.Prepare("SELECT email, name, surname, phone, age, sex, bio, section FROM users WHERE email = $1")
	defer stm.Close()
	if err != nil {
		return internal.CompleteUser{}, fmt.Errorf("Error in the query of user %v", err)
	}
	var user internal.CompleteUser
	err = stm.QueryRow(email).Scan(
		&user.User.Email,
		&user.User.GivenName,
		&user.User.FamilyName,
		&user.UserInfo.Phone,
		&user.UserInfo.Bio,
		&user.UserInfo.Age,
		&user.UserInfo.Section,
		&user.UserInfo.Sex,
	)
	if err != nil {
		return internal.CompleteUser{}, fmt.Errorf("Error in the query of user %v", err)
	}
	if err != nil {
		return internal.CompleteUser{}, fmt.Errorf("Error in the query of user %v", err)
	}

	return user, nil
}

func AddUser(user internal.User) error {
	stm, err := dbInstance.db.Prepare("INSERT INTO users (email, name, surname) VALUES ($1, $2, $3)")
	defer stm.Close()
	result, err := stm.Exec(user.Email, user.GivenName, user.FamilyName)
	if err != nil {
		return fmt.Errorf("Error in the insert of user %v", err)
	}

	l.Debug().Msg(fmt.Sprint(result.RowsAffected()))

	return nil
}

func AddUserInfo(user internal.UserInfo, email string) error {

	stm, err := dbInstance.db.Prepare("UPDATE users SET phone = $1, bio = $2, age = $3, section = $4, sex = $5 WHERE email = $6;")
	defer stm.Close()
	result, err := stm.Exec(user.Phone, user.Bio, user.Age, user.Section, user.Sex, email)

	l.Debug().Msg(fmt.Sprint(result))

	if err != nil {
		return fmt.Errorf("error in the insert of user: %v", err)
	}

	return nil
}

func AddSurvey(survey internal.Survey, email string) error {
	// stm, err := dbInstance.db.Prepare("INSERT INTO survey (id_survey, response, email) VALUES ($1, $2, $3)")
	// defer stm.Close()
	// result, err := stm.Exec(survey.IdSurvey, survey.Response, email)

	// l.Debug().Msg(fmt.Sprint(result))

	// if err != nil {
	// 	return fmt.Errorf("error in the insert of survey: %v", err)
	// }

	// return nil
	return nil
}
