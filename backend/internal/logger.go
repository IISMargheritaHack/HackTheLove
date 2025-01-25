package internal

import (
	"os"
	"path/filepath"
	"strconv"

	"github.com/rs/zerolog"
)

// Possible levels:
// panic (zerolog.PanicLevel, 5)
// fatal (zerolog.FatalLevel, 4)
// error (zerolog.ErrorLevel, 3)
// warn (zerolog.WarnLevel, 2)
// info (zerolog.InfoLevel, 1)
// debug (zerolog.DebugLevel, 0)
// trace (zerolog.TraceLevel, -1)

var Logger zerolog.Logger

func init() {
	// Some customizations
	zerolog.CallerMarshalFunc = func(pc uintptr, file string, line int) string {
		return filepath.Base(file) + ":" + strconv.Itoa(line)
	}
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

	Logger = zerolog.New(os.Stdout).With().Caller().Timestamp().Logger()
}

func SetLevel(level zerolog.Level) {
	zerolog.SetGlobalLevel(level)
}

func GetLogger() *zerolog.Logger {
	return &Logger
}
