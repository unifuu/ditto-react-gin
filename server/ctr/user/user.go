package user

import (
	h "ditto/ctr"
	rds "ditto/db/redis"
	mw "ditto/middleware"
	"ditto/model/user"
	"net/http"

	"github.com/gin-gonic/gin"
)

// TODO
// - Hash and Salt Passwords

func API(e *gin.Engine) {
	e.Any("/api/user/checkAuth", checkAuth)
	e.Any("/api/user/checkToken", checkToken)
}

// Handle user checkAuth
func checkAuth(c *gin.Context) {
	var u user.User
	c.BindJSON(&u)

	// Check the username and password is valid or not
	auth, err := h.UserService.Login(u.Username, u.Password)

	if err != nil {
		respJson(c, false, "")
	} else {
		// Generate a token and set it to Redis
		token := mw.SetAuth(c, auth.ID.Hex())

		respJson(c, true, token)
	}
}

// checkToken checks the auth token is expired or not
func checkToken(c *gin.Context) {
	var req struct {
		AuthToken string `json:"auth_token"`
	}

	// Get auth token from cookie
	authToken, _ := c.Cookie("auth_token")

	// Get auth token from request header
	if len(authToken) == 0 {
		authToken = c.Request.Header.Get("auth_token")
	}

	err := c.BindJSON(&req)
	if err == nil {
		authToken = req.AuthToken
	}

	// Get auth token from url
	if len(authToken) == 0 {
		authToken = c.Query("auth_token")
	}

	// Cannot get auth token
	if len(authToken) == 0 {
		respJson(c, false, "")
		return
	}

	// Get user id from Redis
	userID, _ := rds.Get(authToken)

	// Check the user id is exist or not
	if len(userID) > 0 {
		respJson(c, true, authToken)
	} else {
		respJson(c, false, "")
	}
}

func respJson(c *gin.Context, isAuth bool, token string) {
	if isAuth {
		c.JSON(http.StatusOK, gin.H{
			"is_auth":    true,
			"auth_token": token,
		})
	} else {
		c.JSON(http.StatusNotFound, gin.H{
			"is_auth":    false,
			"auth_token": token,
		})
	}
}
