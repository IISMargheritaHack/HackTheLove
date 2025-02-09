package config

import (
	"backend/internal/utils"
	_ "embed"
	"strconv"
	"time"
)

// App
var LogLevel = utils.GetEnv("LOG_LEVEL", "debug")
var LogFile = utils.GetEnv("LOG_FILE", "")
var ScheduleTime = utils.GetEnv("TIME_ALGO", time.Now().Add(120*time.Second).Format(time.RFC3339))
var TimeReleaseMatch = utils.GetEnv("TIME_RELEASE_MATCH", time.Now().Add(120*time.Second).Format(time.RFC3339))

var MinValueCompatibility, _ = strconv.Atoi(utils.GetEnv("MIN_VALUE_COMPATIBILITY", "40"))
var BatchSize, _ = strconv.Atoi(utils.GetEnv("BATCH_SIZE", "1000"))
var MaxPhotoNumber, _ = strconv.Atoi(utils.GetEnv("MAX_PHOTO_NUMBER", "5"))
var RequestPerSecond, _ = strconv.Atoi(utils.GetEnv("REQUEST_PER_SECOND", "50"))

// Security configuration
var JwtSecret = []byte(utils.GetEnv("SECRET_KEY", "secretkey"))
var GoogleClientID = utils.GetEnv("GOOGLE_CLIENT_ID", "443648413060-db7g7i880qktvmlemmcnthg4qptclu2l.apps.googleusercontent.com")

// Server
var AppPort = utils.GetEnv("APP_PORT", "8080")
var GINMODE = utils.GetEnv("GIN_MODE", "debug")

// Database
var DatabaseName = utils.GetEnv("DB_DATABASE", "postgres")
var PasswordDatabase = utils.GetEnv("DB_PASSWORD", "password")
var UsernameDatabase = utils.GetEnv("DB_USERNAME", "username")
var PortDatabase = utils.GetEnv("DB_PORT", "5432")
var HostDatabase = utils.GetEnv("DB_HOST", "localhost")
var SchemaDatabase = utils.GetEnv("DB_SCHEMA", "public")

// Files embedded

//go:embed questions.json
var Questions []byte

//go:embed init.sql
var TablesQueries string
