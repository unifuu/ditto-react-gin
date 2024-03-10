package user

import (
	h "ditto/ctr"
	rds "ditto/db/redis"
	mw "ditto/middleware"
	"ditto/model/user"
	"net/http"

	"github.com/gin-gonic/gin"
)

func API(e *gin.Engine) {
	e.Any("/api/user/login", login)
	e.Any("/api/user/checkAuth", checkAuth)
	e.Any("/api/user/checkToken", checkToken)
}

// checkToken checks the auth token is expired or not
func checkToken(c *gin.Context) {
	var token user.AuthToken
	c.BindJSON(&token)

	userID, _ := rds.Get(token.Token)
	if len(userID) > 0 {
		c.JSON(http.StatusOK, gin.H{"msg": "OK"})
	} else {
		c.JSON(http.StatusNotFound, gin.H{"msg": "NG"})
	}
}

// Handle user login
func login(c *gin.Context) {
	var u user.User
	c.BindJSON(&u)

	auth, err := h.UserService.Login(u.Username, u.Password)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg":        "NG",
			"auth_token": "",
		})
		return
	} else {
		token := mw.SetAuth(c, auth.ID.Hex())
		c.JSON(http.StatusOK, gin.H{
			"msg":        "OK",
			"auth_token": token,
		})
	}
}

func checkAuth(c *gin.Context) {
	// Get auth token from cookie
	authToken, _ := c.Cookie("auth_token")

	// Get auth token from request header
	if len(authToken) == 0 {
		authToken = c.Request.Header.Get("auth_token")
	}

	userID, _ := rds.Get(authToken)
	if len(userID) > 0 {
		c.JSON(http.StatusOK, gin.H{"user_id": userID})
	} else {
		c.JSON(http.StatusNotFound, gin.H{"user_id": ""})
	}
}

// Handle user logout
// func logout(c *gin.Context) {
// 	mw.ClearAuth(c)
// 	c.Redirect(http.StatusSeeOther, "api/user/login")
// }
