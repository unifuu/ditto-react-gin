package post

import (
	h "ditto/ctr"
	mw "ditto/middleware"
	"ditto/model/blog"
	"ditto/util/datetime"
	"ditto/util/format"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func API(e *gin.Engine) {
	anon := e.Group("/api/blog/post")
	{
		anon.GET("/id/:postId", byID)
	}

	auth := e.Group("api/blog/post").Use(mw.Auth)
	{
		auth.POST("/create", create)
		auth.POST("/delete", delete)
		auth.POST("/pin", pin)
		auth.Any("/update", update)
	}
}

func byID(c *gin.Context) {
	postId := c.Param("postId")
	data := gin.H{
		"post": h.BlogService.PostByID(postId),
	}
	c.JSON(http.StatusOK, data)
}

func create(c *gin.Context) {
	title := c.PostForm("title")
	preview := c.PostForm("preview")
	tagids := c.PostForm("tags")
	content := c.PostForm("content")
	date := datetime.Today(datetime.YYYYMMDD)

	tags := h.BlogService.TagsByNames(format.StringToSlice(tagids))
	var tagIDs []primitive.ObjectID
	for _, v := range tags {
		tagIDs = append(tagIDs, v.ID)
	}

	h.BlogService.CreatePost(blog.Post{
		Content: content,
		Date:    date,
		Preview: preview,
		TagIDs:  tagIDs,
		Title:   title,
	})
	c.Redirect(http.StatusSeeOther, "/blog")
}

func delete(c *gin.Context) {
	id := c.Query("id")

	// Delete from db.game
	err := h.BlogService.DeletePost(id)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusNotFound, "Failed to delete.")
		return
	}
	c.Redirect(http.StatusSeeOther, "/blog")
}

func pin(c *gin.Context) {
	id := c.Query("id")
	p := h.BlogService.PostByID(id)
	p.IsPinned = !p.IsPinned
	h.BlogService.UpdatePost(p)
	c.JSON(http.StatusOK, gin.H{"msg": "OK"})
}

func update(c *gin.Context) {
	id := c.PostForm("id")
	title := c.PostForm("title")
	tagNames := c.PostForm("tags")
	preview := c.PostForm("preview")
	content := c.PostForm("content")

	tags := h.BlogService.TagsByNames(format.StringToSlice(tagNames))
	var tagIDs []primitive.ObjectID
	for _, v := range tags {
		tagIDs = append(tagIDs, v.ID)
	}

	p := h.BlogService.PostByID(id)
	p.Title = title
	p.TagIDs = tagIDs
	p.Preview = preview
	p.Content = content

	h.BlogService.UpdatePost(p)
	c.Redirect(http.StatusSeeOther, "/post/"+id)
}
