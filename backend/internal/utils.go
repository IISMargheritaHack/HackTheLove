package internal

import (
	"net/mail"
	"os"
	"strings"

	"github.com/go-playground/validator/v10"
)

var l = GetLogger()

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
