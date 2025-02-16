package config

import (
	"backend/internal/utils"
	_ "embed"
	"strconv"
	"strings"
)

// App
var LogLevel = utils.GetEnv("LOG_LEVEL", "info")
var LogFile = utils.GetEnv("LOG_FILE", "")
var ScheduleTime = utils.GetEnv("TIME_ALGO", "2025-02-13T22:55:00Z")              //2025-02-13T23:55:00Z
var TimeReleaseMatch = utils.GetEnv("TIME_RELEASE_MATCH", "2025-02-13T23:00:00Z") //2025-02-14T00:00:00Z

var MinValueCompatibility, _ = strconv.Atoi(utils.GetEnv("MIN_VALUE_COMPATIBILITY", "40"))
var BatchSize, _ = strconv.Atoi(utils.GetEnv("BATCH_SIZE", "1000"))
var MaxPhotoNumber, _ = strconv.Atoi(utils.GetEnv("MAX_PHOTO_NUMBER", "5"))
var RequestPerSecond, _ = strconv.Atoi(utils.GetEnv("REQUEST_PER_SECOND", "50"))

// Security configuration
var JwtSecret = []byte(utils.GetEnv("SECRET_KEY", "6a7c82a47ab1a29e9ad0cfdba5d013870b8a35ac7050ebdae4d507443e065ae3548a75a592f0c8d42b0f23b34ba046ab374051694eb872039930b4df6bce359c"))
var GoogleClientID = utils.GetEnv("GOOGLE_CLIENT_ID", "443648413060-db7g7i880qktvmlemmcnthg4qptclu2l.apps.googleusercontent.com") //443648413060-db3ivje6uto4h1jf0f11e13hb4opmhep.apps.googleusercontent.com

// Server
var AppPort = utils.GetEnv("APP_PORT", "8080")
var GINMODE = utils.GetEnv("GIN_MODE", "release")
var AllowedOrigins = strings.Split(utils.GetEnv("ALLOWED_ORIGINS", "http://localhost:5173,http://frontend:80,http://localhost:80,http://localhost,https://hackthe.love"), ",")

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
