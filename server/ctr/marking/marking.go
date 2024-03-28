package marking

import (
	h "ditto/ctr"
	mw "ditto/middleware"
	cm "ditto/model/common"
	mk "ditto/model/marking"
	"ditto/util/format"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

const (
	PAGE_LIMIT = 20
)

func API(e *gin.Engine) {
	anon := e.Group("/api/marking")
	{
		anon.GET("/", index)
	}

	auth := e.Group("/api/marking").Use(mw.Auth)
	{
		auth.GET("/badge", badge)
		auth.Any("/create", create)
		auth.Any("/delete", delete)
		anon.GET("/query", query)
		auth.Any("/update", update)
	}
}

func badge(c *gin.Context) {
	badge := h.MarkingService.Badge()
	c.JSON(http.StatusOK, gin.H{
		"badge": badge,
	})
}

func index(c *gin.Context) {
	typ := mk.Type(c.Query("Type"))
	status := cm.DOING

	page, err := strconv.Atoi(c.Query("page"))
	if err != nil {
		page = 1
	}

	markings, totalPage := h.MarkingService.PageByStatusType(status, typ, page, PAGE_LIMIT)

	data := gin.H{
		"markings":   markings,
		"total_page": totalPage,
	}

	c.JSON(http.StatusOK, data)
}

func create(c *gin.Context) {
	switch c.Request.Method {
	case "GET":

	case "POST":
		title := c.PostForm("title")
		by := c.PostForm("by")
		typ := mk.Type(c.PostForm("type"))
		year := c.PostForm("year")
		status := cm.DOING
		total, _ := strconv.Atoi(c.PostForm("total"))
		price, _ := strconv.Atoi(c.PostForm("price"))

		h.MarkingService.Create(mk.Marking{
			Title:   title,
			By:      by,
			Type:    typ,
			Year:    year,
			Status:  status,
			Current: 0,
			Total:   total,
			Price:   price,
		})
		c.Redirect(http.StatusSeeOther, "/marking")
	}
}

func delete(c *gin.Context) {
	id := c.Query("id")

	err := h.MarkingService.Delete(id)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, err)
		return
	}

	c.Redirect(http.StatusSeeOther, "/marking")
}

func query(c *gin.Context) {
	typ := mk.Type(c.Query("type"))
	status := cm.Status(c.Query("status"))
	page := format.FormatPage(c.Query("page"))
	markings, totalPage := h.MarkingService.PageByStatusType(status, typ, page, PAGE_LIMIT)

	data := gin.H{
		"markings":   markings,
		"total_page": totalPage,
	}
	c.JSON(http.StatusOK, data)
}

func update(c *gin.Context) {
	switch c.Request.Method {
	case "GET":
		id := c.Query("id")
		m := h.MarkingService.ByID(id)

		c.JSON(http.StatusOK, gin.H{
			"marking": m,
		})

	case "POST":
		id := c.PostForm("id")
		current, _ := strconv.Atoi(c.PostForm("current"))
		total, _ := strconv.Atoi(c.PostForm("total"))
		price, _ := strconv.Atoi(c.PostForm("price"))

		m := h.MarkingService.ByID(id)
		m.Title = c.PostForm("title")
		m.By = c.PostForm("by")
		m.Type = mk.Type(c.PostForm("type"))
		m.Year = c.PostForm("year")
		m.Status = cm.Status(c.PostForm("status"))
		m.Current = current
		m.Total = total
		m.Price = price

		h.MarkingService.Update(m)
		c.Redirect(http.StatusSeeOther, "/marking")
	}
}
