package inc

import (
	h "ditto/ctr"
	mw "ditto/middleware"
	"ditto/model/inc"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func API(e *gin.Engine) {
	auth := e.Group("/api/inc").Use(mw.Auth)
	{
		auth.GET("/", index)
		auth.POST("/create", create)
		auth.Any("/update", update)
		auth.GET("/search/:keyword", search)
	}
}

func index(c *gin.Context) {
	incs := h.IncService.All()

	data := gin.H{
		"incs": incs,
	}
	c.JSON(http.StatusOK, data)
}

func create(c *gin.Context) {
	name := c.PostForm("name")
	isDev, _ := strconv.Atoi(c.PostForm("is_developer"))
	isPub, _ := strconv.Atoi(c.PostForm("is_publisher"))

	if h.IncService.IsExists(name) {
		c.JSON(http.StatusBadRequest, gin.H{"msg": name + " is exists!"})
		return
	} else {
		h.IncService.Create(inc.Inc{
			Name:        name,
			IsDeveloper: isDev,
			IsPublisher: isPub,
		})
		c.Redirect(http.StatusSeeOther, "/game")
	}
}

// Search incs by keywords
func search(c *gin.Context) {
	keyw := c.Param("keyword")
	incs, err := h.IncService.ByName(keyw)

	if err != nil {
		c.JSON(http.StatusNotFound, nil)
		return
	}

	c.JSON(http.StatusOK, incs)
}

// Update inc
func update(c *gin.Context) {
	switch c.Request.Method {
	case "GET":
		id := c.Query("id")
		inc := h.IncService.ByID(id)
		c.JSON(http.StatusOK, gin.H{
			"inc": inc,
		})

	case "POST":
		id := c.PostForm("id")
		name := c.PostForm("name")
		isDev, _ := strconv.Atoi(c.PostForm("is_dev"))
		isPub, _ := strconv.Atoi(c.PostForm("is_pub"))

		inc := h.IncService.ByID(id)
		inc.Name = name
		inc.IsDeveloper = isDev
		inc.IsPublisher = isPub
		h.IncService.Update(inc)
		c.Redirect(http.StatusSeeOther, "/game")
	}
}
