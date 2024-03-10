package col

import (
	h "ditto/ctr"
	mw "ditto/middleware"
	"ditto/model/col"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

const (
	PAGE_LIMIT = 10
)

func API(e *gin.Engine) {
	anon := e.Group("/api/book")
	{
		anon.GET("/", query)
	}

	auth := e.Group("/api/book").Use(mw.Auth)
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

func query(c *gin.Context) {
	typ := col.Type(c.Query("type"))

	page, err := strconv.Atoi(c.Query("page"))
	if err != nil {
		page = 1
	}

	books, totalPage := h.ColService.PageByType(typ, page, PAGE_LIMIT)

	data := gin.H{
		"books":      books,
		"total_page": totalPage,
	}

	c.JSON(http.StatusOK, data)
}

func create(c *gin.Context) {
	switch c.Request.Method {
	case "GET":
		// c.JSON(http.StatusOK, gin.H{
		// 	"reading": h.ColService.ByType(book.READING),
		// })
	case "POST":
		title := c.PostForm("title")
		by := c.PostForm("by")
		typ := c.PostForm("type")
		date := c.PostForm("date")
		color := c.PostForm("color")
		spec := c.PostForm("spec")
		price, _ := strconv.Atoi(c.PostForm("price"))

		h.ColService.Create(col.Col{
			Title: title,
			By:    by,
			Type:  col.Type(typ),
			Date:  date,
			Color: color,
			Spec:  spec,
			Price: price,
		})
		c.Redirect(http.StatusSeeOther, "/col")
	}
}

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

func update(c *gin.Context) {
	switch c.Request.Method {
	case "GET":
		id := c.Query("id")
		col := h.ColService.ByID(id)

		c.JSON(http.StatusOK, gin.H{
			"col": col,
		})

	case "POST":
		id := c.PostForm("id")
		title := c.PostForm("title")
		by := c.PostForm("by")
		typ := c.PostForm("type")
		date := c.PostForm("date")
		color := c.PostForm("color")
		spec := c.PostForm("spec")
		price, _ := strconv.Atoi(c.PostForm("price"))

		coll := h.ColService.ByID(id)
		coll.Title = title
		coll.By = by
		coll.Type = col.Type(typ)
		coll.Date = date
		coll.Color = color
		coll.Spec = spec
		coll.Price = price

		h.ColService.Update(coll)
		c.Redirect(http.StatusSeeOther, "/col")
	}
}
