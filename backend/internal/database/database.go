package database

import (
	"backend/config"
	"backend/internal/logger"
	"context"
	"database/sql"
	"fmt"
	"strconv"
	"sync"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	_ "github.com/joho/godotenv/autoload"
)

type DatabaseService interface {
	GetDB() *sql.DB
	Close() error
}

type Database struct {
	db *sql.DB
}

var (
	dbInstance *Database
	once       sync.Once
)

var log = logger.GetLogger()

func New() *Database {
	once.Do(func() {
		connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable&search_path=%s", config.UsernameDatabase, config.PasswordDatabase, config.HostDatabase, config.PortDatabase, config.DatabaseName, config.SchemaDatabase)

		if connStr == "" {
			log.Fatal().Msg("DATABASE_URL not set")
		}

		db, err := sql.Open("pgx", connStr)
		if err != nil {
			log.Fatal().Err(err).Msg("Failed to open database connection")
		}

		db.SetMaxOpenConns(25)
		db.SetMaxIdleConns(25)
		db.SetConnMaxLifetime(5 * time.Minute)

		if err := db.Ping(); err != nil {
			log.Fatal().Err(err).Msg("Database is unreachable")
		}

		log.Info().Msg("Database connection established")
		dbInstance = &Database{db: db}
	})

	return dbInstance
}

// ----- UTILS -----

func (d *Database) GetDB() *sql.DB {
	return d.db
}

func (d *Database) InitTables() error {
	log.Info().Msg("Initializing database tables...")

	queries := []string{
		config.TablesQueries,
	}

	tx, err := d.db.Begin()
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to start transaction for table initialization")
		return err
	}

	for i, query := range queries {
		_, err := tx.Exec(query)
		if err != nil {
			tx.Rollback()
			log.Error().Err(err).Int("step", i).Msg("Failed to execute table initialization")
			return err
		}
		log.Info().Int("step", i).Msg("Table initialization step executed successfully")
	}

	if err := tx.Commit(); err != nil {
		log.Fatal().Err(err).Msg("Failed to commit table initialization transaction")
		return err
	}

	log.Info().Msg("Database tables initialized successfully")
	return nil
}

// Health checks the health of the database connection by pinging the database.
// It returns a map with keys indicating various health statistics.
// Health checks the database status and returns key statistics.
func (d *Database) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	stats := make(map[string]string)

	// Test database connection
	err := d.db.PingContext(ctx)
	if err != nil {
		log.Error().Err(err).Msg("Database health check failed")
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("Database down: %v", err)
		return stats
	}

	// Database is up
	stats["status"] = "up"
	stats["message"] = "Database is healthy"

	// Get database statistics
	dbStats := d.db.Stats()
	stats["open_connections"] = strconv.Itoa(dbStats.OpenConnections)
	stats["in_use"] = strconv.Itoa(dbStats.InUse)
	stats["idle"] = strconv.Itoa(dbStats.Idle)
	stats["wait_count"] = strconv.FormatInt(dbStats.WaitCount, 10)
	stats["wait_duration"] = dbStats.WaitDuration.String()
	stats["max_idle_closed"] = strconv.FormatInt(dbStats.MaxIdleClosed, 10)
	stats["max_lifetime_closed"] = strconv.FormatInt(dbStats.MaxLifetimeClosed, 10)

	// Log useful insights
	if dbStats.OpenConnections > 40 {
		log.Warn().Msg("Database experiencing high connection load")
		stats["warning"] = "High connection load"
	}

	if dbStats.WaitCount > 1000 {
		log.Warn().Msg("Database has high wait events, indicating possible bottlenecks")
		stats["warning"] = "High wait events detected"
	}

	if dbStats.MaxIdleClosed > int64(dbStats.OpenConnections)/2 {
		log.Warn().Msg("Excessive idle connections being closed, consider tuning connection pool settings")
		stats["warning"] = "Excessive idle connections closed"
	}

	if dbStats.MaxLifetimeClosed > int64(dbStats.OpenConnections)/2 {
		log.Warn().Msg("Frequent connection expiration, consider adjusting max lifetime")
		stats["warning"] = "High connection expiration rate"
	}

	log.Debug().Msg("Database health check completed successfully")
	return stats
}

// Close closes the database connection.
// It logs a message indicating the disconnection from the specific database.
// If the connection is successfully closed, it returns nil.
// If an error occurs while closing the connection, it returns the error.
func (d *Database) Close() error {
	log.Info().Msg("Closing database connection")
	return d.db.Close()
}
