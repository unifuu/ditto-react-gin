package mw

import (
	"crypto/rand"
	db_redis "ditto/db/redis"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

const (
	// 3 months
	REDIS_EXPIRATION = time.Duration(24 * 30 * 3 * time.Hour)

	// 3 months
	GIN_COOKIE_EXPIRATION = 1 * 60 * 60 * 24 * 30 * 3
)

// Set user authentication token to Redis
func SetAuth(c *gin.Context, userID string) string {
	b := make([]byte, 64)
	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		panic("Failed to generate a random value...")
	}
	token := base64.URLEncoding.EncodeToString(b)

	if err := db_redis.Set(token, userID, REDIS_EXPIRATION); err != nil {
		panic("Failed to set session key to Redis..." + err.Error())
	}

	c.SetCookie("auth_token", token, GIN_COOKIE_EXPIRATION, "/", "", false, false)
	return token
}

// Get authentication token
func getAuth(c *gin.Context) any {
	authToken, _ := c.Cookie("auth_token")

	if authToken == "undefined" {
		authToken = ""
	}

	// If cannot get auth token from cookie
	if len(authToken) == 0 {
		if len(c.Request.Header["Auth_token"]) > 0 {
			authToken = c.Request.Header["auth_token"][0]
		}
	}
	userID, err := db_redis.Get(authToken)

	switch {
	case err == redis.Nil:
		fmt.Println("Cannot not find user from token...")
		return nil
	case err != nil:
		fmt.Println("Error occurred", err.Error())
		return nil
	}
	return userID
}

func ClearAuth(c *gin.Context) {
	authToken, _ := c.Cookie("auth_token")
	db_redis.Del(authToken)
	c.SetCookie("auth_token", "", -1, "/", "", false, false)
}

// Check user authority
func Auth(c *gin.Context) {
	uid := getAuth(c)
	if uid == nil {
		c.Abort()
		return
	}
	c.Next()
}

// Redirect HTTP to HTTPS
func HTTPS() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.TLS == nil && c.Request.Host != "" {
			url := "https://" + c.Request.Host + c.Request.RequestURI
			c.Redirect(http.StatusMovedPermanently, url)
			c.Abort()
			return
		}

		// If the request is already using HTTPS just call the c.Next()
		c.Next()
	}
}

// func Secure() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		secureMiddleware := secure.New(secure.Options{
// 			SSLRedirect: true,
// 			SSLHost:     "localhost:443",
// 		})
// 		err := secureMiddleware.Process(c.Writer, c.Request)

// 		if err != nil {
// 			c.Abort()
// 		}
// 		c.Next()
// 	}
// }

// Check if the User-Agent suggets a mobile device
func isMobile(useragent string) bool {
	mobileKeywords := []string{"Mobile", "Android", "iPhone", "iPad", "Windows Phone", "okhttp"}
	for _, keyword := range mobileKeywords {
		if strings.Contains(useragent, keyword) {
			return true
		}
	}
	return false
}
