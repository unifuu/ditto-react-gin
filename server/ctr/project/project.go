package project

import (
	h "ditto/ctr"
	mw "ditto/middleware"
	"ditto/model/project"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func API(e *gin.Engine) {
	auth := e.Group("/api/project").Use(mw.Auth)
	{
		auth.GET("/", index)
		auth.GET("/create", create)
		auth.GET("/delete", delete)
		auth.GET("/update", update)
	}
}

func create(c *gin.Context) {
	title := c.Query("title")
	languages := strings.Split(c.Query("languages"), ",")
	h.ProjService.Create(project.Project{
		Title:     title,
		Languages: project.FormatLanguages(languages),
		Status:    project.DEVELOPING,
	})
	c.JSON(http.StatusOK, "Created!")
}

func index(c *gin.Context) {
	status := c.Query("status")
	projects := h.ProjService.ByStatus(project.Status(status))
	data := gin.H{
		"projects": projects,
	}
	c.JSON(http.StatusOK, data)
}

func delete(c *gin.Context) {
	id := c.Query("id")
	h.ProjService.Delete(id)
	c.JSON(http.StatusOK, "Deleted!")
}

func update(c *gin.Context) {
	id := c.Query("id")
	title := c.Query("title")
	languages := strings.Split(c.Query("languages"), ",")

	p := h.ProjService.ByID(id)
	p.Title = title
	p.Languages = project.FormatLanguages(languages)
	h.ProjService.Update(p)

	c.JSON(http.StatusOK, "Updated!")
}
