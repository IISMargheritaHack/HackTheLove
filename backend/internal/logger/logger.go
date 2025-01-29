package logger

import (
	"io"
	"os"
	"path/filepath"
	"strconv"
	"sync"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

var (
	once     sync.Once
	instance zerolog.Logger
)

type Config struct {
	Level   zerolog.Level
	LogFile string
}

func InitLogger(cfg Config) {
	once.Do(func() {
		zerolog.CallerMarshalFunc = func(pc uintptr, file string, line int) string {
			return filepath.Base(file) + ":" + strconv.Itoa(line)
		}
		zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

		var writers []io.Writer

		if cfg.LogFile != "" {
			file, err := os.OpenFile(cfg.LogFile, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
			if err == nil {
				writers = append(writers, file)
			} else {
				log.Warn().Err(err).Msg("Unable to open log file, falling back to stdout")
			}
		}

		writers = append(writers, os.Stdout)

		multiWriter := io.MultiWriter(writers...)

		if cfg.Level == zerolog.DebugLevel {
			instance = zerolog.New(zerolog.ConsoleWriter{Out: multiWriter}).
				With().Caller().Timestamp().Logger().Level(cfg.Level)
		} else {
			instance = zerolog.New(multiWriter).
				With().Caller().Timestamp().Logger().Level(cfg.Level)
		}

		zerolog.SetGlobalLevel(cfg.Level)

		log.Info().Msg("Logger initialized successfully")
	})
}

func GetLogger() *zerolog.Logger {
	return &instance
}
