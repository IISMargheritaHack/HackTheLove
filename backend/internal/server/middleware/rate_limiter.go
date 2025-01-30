package middleware

import (
	"backend/internal/logger"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

var log = logger.GetLogger()

const requestsPerSecond = 5

type clientLimiter struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

var ipLimiters = make(map[string]*clientLimiter)
var mu sync.Mutex

func RateLimiterMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()

		mu.Lock()
		limiter, exists := ipLimiters[ip]
		if !exists {
			limiter = &clientLimiter{
				limiter:  rate.NewLimiter(rate.Limit(requestsPerSecond), requestsPerSecond),
				lastSeen: time.Now(),
			}
			ipLimiters[ip] = limiter
		} else {
			if time.Since(limiter.lastSeen) > 5*time.Minute {
				delete(ipLimiters, ip)
			}
			limiter.lastSeen = time.Now()
		}
		mu.Unlock()

		if !limiter.limiter.Allow() {
			c.JSON(429, gin.H{"error": "Too many requests"})
			c.Abort()
			return
		}

		c.Next()
	}
}
