package col

import (
	h "ditto/ctr"
	mw "ditto/middleware"
	"ditto/model/col"
	"ditto/model/common"
	"ditto/util/format"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

const (
	PAGE_LIMIT = 10
)

func API(e *gin.Engine) {
	anon := e.Group("/api/col")
	{
		anon.GET("/", index)
		anon.GET("/index", index)
	}

	auth := e.Group("/api/col").Use(mw.Auth)
	{
		// auth.GET("/badge", badge)
		auth.Any("/create", create)
		auth.Any("/delete", delete)
		auth.Any("/update", update)
	}
}

// func badge(c *gin.Context) {
// 	badge := h.ColService.Badge()
// 	c.JSON(http.StatusOK, gin.H{
// 		"badge": badge,
// 	})
// }

// create handles create a new collection
func create(c *gin.Context) {
	switch c.Request.Method {
	case "GET":
		// c.JSON(http.StatusOK, gin.H{
		// 	"reading": h.ColService.ByType(book.READING),
		// })

	case "POST":
		h.ColService.Create(col.Col{
			Title: c.PostForm("title"),
			By:    c.PostForm("by"),
			Type:  col.Type(c.PostForm("type")),
			Date:  c.PostForm("date"),
			Color: c.PostForm("color"),
			Spec:  c.PostForm("spec"),
			Price: format.ParseInt(c.PostForm("price")),
		})
		c.Redirect(http.StatusSeeOther, "/col")
	}
}

// delete handles delete the collection
func delete(c *gin.Context) {
	id := c.Query("id")

	// Delete from db.book
	err := h.ColService.Delete(id)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, err)
		return
	}
}

// index handles the query without authorization
func index(c *gin.Context) {
	page := format.FormatPage(c.Query("page"))
	cols, totalPage := h.ColService.PageByStatusType(common.DOING, "", page, PAGE_LIMIT)

	data := gin.H{
		"cols":       cols,
		"total_page": totalPage,
	}
	c.JSON(http.StatusOK, data)
}

// query handles query the collection from database
func query(c *gin.Context) {
	typ := col.Type(c.Query("type"))
	page := format.FormatPage(c.Query("page"))
	cols, totalPage := h.ColService.PageByStatusType(common.DOING, typ, page, PAGE_LIMIT)

	data := gin.H{
		"cols":       cols,
		"total_page": totalPage,
	}
	c.JSON(http.StatusOK, data)
}

// update handles update the collection
func update(c *gin.Context) {
	switch c.Request.Method {
	case "GET":
		col := h.ColService.ByID(c.Query("id"))
		c.JSON(http.StatusOK, gin.H{"col": col})

	case "POST":
		coll := h.ColService.ByID(c.PostForm("id"))
		coll.Title = c.PostForm("title")
		coll.By = c.PostForm("by")
		coll.Type = col.Type(c.PostForm("type"))
		coll.Date = c.PostForm("date")
		coll.Color = c.PostForm("color")
		coll.Spec = c.PostForm("spec")
		coll.Price = format.ParseInt(c.PostForm("price"))

		h.ColService.Update(coll)
		c.Redirect(http.StatusSeeOther, "/col")
	}
}
