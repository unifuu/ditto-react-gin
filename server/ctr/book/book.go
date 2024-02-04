package book

import (
	h "ditto/ctr"
	"ditto/db/mgo"
	mw "ditto/middleware"
	"ditto/model/book"
	"ditto/util/path"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

const (
	PAGE_LIMIT = 10
)

func API(e *gin.Engine) {
	anon := e.Group("/api/book")
	{
		anon.GET("/p/:page", query)
	}

	auth := e.Group("/api/book").Use(mw.Auth)
	{
		auth.Any("/", query)
		auth.GET("/badge", badge)
		auth.Any("/create", create)
		auth.Any("/delete", delete)
		auth.Any("/update", update)
	}
}

func badge(c *gin.Context) {
	badge := h.BookService.Badge()
	c.JSON(http.StatusOK, gin.H{
		"badge": badge,
	})
}

func query(c *gin.Context) {
	status := book.Status(c.Query("status"))

	if len(status) == 0 {
		status = book.READING
	}

	page, err := strconv.Atoi(c.Query("page"))
	if err != nil {
		page = 1
	}

	books, totalPage := h.BookService.PageByStatus(status, page, PAGE_LIMIT)

	data := gin.H{
		"books":      books,
		"total_page": totalPage,
	}

	c.JSON(http.StatusOK, data)
}

func create(c *gin.Context) {
	switch c.Request.Method {
	case "GET":
		c.JSON(http.StatusOK, gin.H{
			"reading": h.BookService.ByStatus(book.READING),
		})
	case "POST":
		title := c.PostForm("title")
		author := c.PostForm("author")
		publisher := c.PostForm("publisher")
		pub_year, _ := strconv.Atoi(c.PostForm("pub_year"))
		genre := c.PostForm("genre")
		status := book.READING
		total_page, _ := strconv.Atoi(c.PostForm("total_page"))

		h.BookService.Create(book.Book{
			Title:       title,
			Author:      author,
			Publisher:   publisher,
			PubYear:     pub_year,
			Genre:       genre,
			Status:      status,
			CurrentPage: 0,
			TotalPage:   total_page,
		})
		c.Redirect(http.StatusSeeOther, "/book")
	}
}

func delete(c *gin.Context) {
	id := c.Query("id")

	// Delete from db.act
	acts, err := h.ActService.ByTargetID(id)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, err)
		return
	}

	if len(acts) != 0 {
		for _, v := range acts {
			mgo.DeleteID(mgo.Acts, v.ID)
		}
	}

	// Delete from db.book
	err = h.BookService.Delete(id)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, err)
		return
	}

	// Delete from assets
	file := id + ".webp"
	root := path.Root()
	path := root + "/../assets/img/books/" + file
	os.Remove(path)
}

func update(c *gin.Context) {
	switch c.Request.Method {
	case "GET":
		id := c.Query("id")
		b := h.BookService.ByID(id)

		c.JSON(http.StatusOK, gin.H{
			"book": b,
		})

	case "POST":
		gId := c.PostForm("id")
		year, _ := strconv.Atoi(c.PostForm("pub_year"))
		hour, _ := strconv.Atoi(c.PostForm("hour"))
		min, _ := strconv.Atoi(c.PostForm("min"))
		reatime := hour*60 + min

		curPage, _ := strconv.Atoi(c.PostForm("cur_page"))
		totalPage, _ := strconv.Atoi(c.PostForm("total_page"))

		b := h.BookService.ByID(gId)
		b.Title = c.PostForm("title")
		b.Author = c.PostForm("author")
		b.Publisher = c.PostForm("publisher")
		b.PubYear = year
		b.Status = book.Status(c.PostForm("status"))
		b.TotalTime = reatime
		b.Genre = c.PostForm("genre")
		b.CurrentPage = curPage
		b.TotalPage = totalPage

		file, err := c.FormFile("cover")
		// Upload image to assets
		if file != nil && err == nil {
			fn := gId + ".webp"
			root := path.Root()
			path := root + "/assets/images/books/" + fn
			c.SaveUploadedFile(file, path)
		}
		h.BookService.Update(b)
		c.Redirect(http.StatusSeeOther, "/book")
	}
}
