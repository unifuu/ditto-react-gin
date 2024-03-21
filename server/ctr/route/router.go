package route

import (
	"ditto/ctr/act"
	"ditto/ctr/blog"
	"ditto/ctr/blog/post"
	"ditto/ctr/game"
	"ditto/ctr/inc"
	"ditto/ctr/line"
	"ditto/ctr/marking"
	"ditto/ctr/project"
	"ditto/ctr/user"
	"strings"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func API(e *gin.Engine) {
	assets(e)

	// Use React as frontend
	react(e)

	act.API(e)
	blog.API(e)
	game.API(e)
	inc.API(e)
	line.API(e)
	marking.API(e)
	post.API(e)
	project.API(e)
	user.API(e)
}

func assets(e *gin.Engine) {
	e.Static("/assets", "./assets")
	// e.Static("/static", "./static")
}

func react(e *gin.Engine) {
	// Root
	e.Use(static.Serve("/", static.LocalFile("../client/build", true)))

	// Act
	e.Use(static.Serve("/act", static.LocalFile("../client/build", true)))

	// Blog
	e.Use(static.Serve("/blog", static.LocalFile("../client/build", true)))
	e.Use(static.Serve("/post", static.LocalFile("../client/build", true)))
	e.NoRoute(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.RequestURI, "/post") {
			c.File("../client/build")
		}
	})

	// Book
	e.Use(static.Serve("/book", static.LocalFile("../client/build", true)))

	// Game
	e.Use(static.Serve("/game", static.LocalFile("../client/build", true)))

	// Marking
	e.Use(static.Serve("/marking", static.LocalFile("../client/build", true)))

	// User
	e.Use(static.Serve("/fuu", static.LocalFile("../client/build", true)))
}
