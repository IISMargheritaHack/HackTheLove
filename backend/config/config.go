package config

import (
	"backend/internal/utils"
	_ "embed"
	"time"
)

// App
var LogLevel = utils.GetEnv("LOG_LEVEL", "debug")
var LogFile = utils.GetEnv("LOG_FILE", "")
var ScheduleTime = time.Now().Add(20 * time.Second)

const MIN_VALUE_COMPATIBILITY = 40
const BATCH_SIZE = 1000
const MAX_PHOTO_NUMBER = 5

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
