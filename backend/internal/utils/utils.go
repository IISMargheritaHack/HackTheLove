package utils

import (
	"backend/internal/logger"
	"net/mail"
	"os"
	"strings"
	"unicode"

	"github.com/go-playground/validator/v10"
)

var log = logger.GetLogger()

func GetEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func EmailHost(fl validator.FieldLevel) bool {
	email := fl.Field().String()
	parsedEmail, err := mail.ParseAddress(email)
	if err != nil {
		return false
	}

	parts := strings.Split(parsedEmail.Address, "@")
	if len(parts) != 2 {
		return false
	}

	if parts[1] == "iismargheritahackbaronissi.edu.it" {
		return true
	}

	return false
}

func ValidateSanitazeResponse(response string) bool {
	whiteList := "abcd"

	if len(response) != 11 {
		log.Warn().Msg("Response length not valid")
		return false
	}

	for _, r := range response {
		if !strings.Contains(whiteList, string(r)) {
			log.Warn().Msg("Response not valid")
			return false
		}
	}
	return true
}

func CapitalizeWords(s string) string {
	s = strings.ToLower(s)
	words := strings.Fields(s)
	for i, word := range words {
		if len(word) > 0 {
			words[i] = string(unicode.ToUpper(rune(word[0]))) + word[1:]
		}
	}
	return strings.Join(words, " ")
}
