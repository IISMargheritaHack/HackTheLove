package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
)

const TIME_FORMAT = "2006-01-02 15:04:05"

const DEADLINE = "2025-02-13 23:59:59"

func TimeRestrictionMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		currentTime := time.Now().UTC()
		deadlineTime, err := time.Parse(TIME_FORMAT, DEADLINE)
		if err != nil {
			log.Error().Err(err).Msg("Failed to parse deadline time")
			c.JSON(500, gin.H{"error": "Internal server error"})
			c.Abort()
			return
		}

		log.Debug().Str("currentTime", currentTime.String()).Str("deadlineTime", deadlineTime.String()).Msg("TimeRestrictionMiddleware")

		if currentTime.After(deadlineTime) {
			c.JSON(400, gin.H{"error": "You cannot edit your profile after the deadline"})
			c.Abort()
			return
		}

		c.Next()
	}
}
