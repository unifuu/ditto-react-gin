package blog

import (
	h "ditto/ctr"
	mw "ditto/middleware"
	"ditto/model/blog"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

const (
	PAGE_LIMIT = 5
)

func API(e *gin.Engine) {
	anon := e.Group("/api/blog")
	{
		anon.GET("/tag/:tag/p/:page", byTag)
		anon.GET("/p/:page", index)
		anon.GET("/tag", getTags)
	}

	auth := e.Group("/api/blog").Use(mw.Auth)
	{
		auth.POST("/tag/create", createTag)
		auth.GET("/tag/delete", deleteTag)
		auth.POST("/tag/update", updateTag)
	}
}

func byTag(c *gin.Context) {
	tag := c.Param("tag")
	page, err := strconv.Atoi(c.Param("page"))
	if err != nil {
		page = 1
	}

	posts, totalPage := h.BlogService.PostsByPageTag(page, tag, PAGE_LIMIT)
	data := gin.H{
		"posts":      posts,
		"total_page": totalPage,
	}
	c.JSON(http.StatusOK, data)
}

func createTag(c *gin.Context) {
	name := c.PostForm("name")
	color := c.PostForm("color")

	h.BlogService.CreateTag(blog.Tag{
		Name:  name,
		Color: color,
	})
	c.Redirect(http.StatusSeeOther, "/blog")
}

func getTags(c *gin.Context) {
	tags, _ := h.BlogService.AllTags()
	data := gin.H{
		"tags": tags,
	}
	c.JSON(http.StatusOK, data)
}

func index(c *gin.Context) {
	page, err := strconv.Atoi(c.Param("page"))
	if err != nil {
		page = 1
	}

	posts, totalPage := h.BlogService.PostsByPage(page, PAGE_LIMIT)
	data := gin.H{
		"posts":      posts,
		"total_page": totalPage,
	}
	c.JSON(http.StatusOK, data)
}

func updateTag(c *gin.Context) {
	id := c.PostForm("id")
	t := h.BlogService.TagByID(id)
	t.Name = c.PostForm("name")
	t.Color = c.PostForm("color")

	h.BlogService.UpdateTag(t)
	c.Redirect(http.StatusSeeOther, "/blog")
}

func deleteTag(c *gin.Context) {
	id := c.Query("id")
	err := h.BlogService.DeleteTag(id)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusNotFound, "Failed to delete this tag.")
	} else {
		c.JSON(http.StatusOK, nil)
	}
}
