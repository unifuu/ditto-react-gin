package game

import (
	h "ditto/ctr"
	"ditto/db/mgo"
	mw "ditto/middleware"
	"ditto/model/game"
	"ditto/util/format"
	"ditto/util/path"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

const (
	PAGE_LIMIT = 20
)

func API(e *gin.Engine) {
	anon := e.Group("/api/blog")
	{
		anon.GET("/", index)
	}

	auth := e.Group("/api/game").Use(mw.Auth)
	{
		auth.Any("/create", create)
		auth.Any("/delete", delete)
		auth.Any("/update", update)
		auth.POST("/update_status", updateStatus)
		auth.GET("/status", query)
		auth.GET("/badges", badges)
		auth.GET("/rank/target", target)
		auth.GET("/status/:status/:platform/:page", status)
	}
}

func target(c *gin.Context) {

}

func updateStatus(c *gin.Context) {
	gameId := c.PostForm("id")
	newStatus := c.PostForm("newStatus")
	targetGame := h.GameService.ByID(gameId)
	targetGame.Status = game.Status(newStatus)
	h.GameService.Update(targetGame)
}

func badges(c *gin.Context) {
	status := game.Status(c.Query("status"))
	badges := h.GameService.Badge(status)
	c.JSON(http.StatusOK, gin.H{
		"badges": badges,
	})
}

func create(c *gin.Context) {
	switch c.Request.Method {
	case "GET":
		c.JSON(http.StatusOK, gin.H{
			"developers": h.IncService.Developers(),
			"publishers": h.IncService.Publishers(),
			"genres":     game.Genres(),
			"platforms":  game.Platforms(),
		})

	case "POST":
		title := c.PostForm("title")
		developerId := c.PostForm("developer_id")
		publisherId := c.PostForm("publisher_id")
		genre := game.Genre(c.PostForm("genre"))
		platform := game.Platform(c.PostForm("platform"))

		h.GameService.Create(game.Game{
			Title:       title,
			Status:      game.PLAYING,
			Genre:       genre,
			Platform:    platform,
			DeveloperID: format.ToObjID(developerId),
			PublisherID: format.ToObjID(publisherId),
		})
		c.Redirect(http.StatusSeeOther, "/game")
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

	// Delete from db.game
	err = h.GameService.Delete(id)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, err)
		return
	}

	// Delete from assets
	file := id + ".webp"
	root := path.Root()
	path := root + "/../assets/img/games/" + file
	os.Remove(path)
}

func index(c *gin.Context) {
	status := game.PLAYING
	data := gin.H{
		"games": h.GameService.ByStatus(status),
	}
	c.JSON(http.StatusOK, data)
}

func query(c *gin.Context) {
	status := game.Status(c.Query("status"))
	data := gin.H{
		"games": h.GameService.ByStatus(status),
	}
	c.JSON(http.StatusOK, data)
}

func update(c *gin.Context) {
	switch c.Request.Method {
	case "GET":
		id := c.Query("id")
		g := h.GameService.ByID(id)

		c.JSON(http.StatusOK, gin.H{
			"game":        g,
			"developers":  h.IncService.Developers(),
			"publishers":  h.IncService.Publishers(),
			"statuses":    game.Statuses(),
			"platforms":   game.Platforms(),
			"genres":      game.Genres(),
			"played_hour": g.TotalTime / 60,
			"played_min":  g.TotalTime % 60,
			"hltb_hour":   g.HowLongToBeat / 60,
			"hltb_min":    g.HowLongToBeat % 60,
		})

	case "POST":
		gId := c.PostForm("id")
		dId := c.PostForm("developer_id")
		pId := c.PostForm("publisher_id")

		playedHour, _ := strconv.Atoi(c.PostForm("played_hour"))
		playedMin, _ := strconv.Atoi(c.PostForm("played_min"))
		playedTime := playedHour*60 + playedMin

		hltbHour, _ := strconv.Atoi(c.PostForm("hltb_hour"))
		hltbMin, _ := strconv.Atoi(c.PostForm("hltb_min"))
		hltbTime := hltbHour*60 + hltbMin

		ranking, _ := strconv.Atoi(c.PostForm("ranking"))
		// rating, _ := strconv.Atoi(c.PostForm("rating"))

		g := h.GameService.ByID(gId)
		g.Title = c.PostForm("title")
		g.DeveloperID = format.ToObjID(dId)
		g.PublisherID = format.ToObjID(pId)
		g.Status = game.Status(c.PostForm("status"))
		g.TotalTime = playedTime
		g.HowLongToBeat = hltbTime
		g.Genre = game.Genre(c.PostForm("genre"))
		g.Platform = game.Platform(c.PostForm("platform"))
		g.Ranking = ranking
		g.Rating = c.PostForm("rating")

		file, err := c.FormFile("cover")
		// Upload image to assets
		if file != nil && err == nil {
			fn := gId + ".webp"
			root := path.Root()
			path := root + "/assets/images/games/" + fn
			c.SaveUploadedFile(file, path)
		}
		h.GameService.Update(g)
		c.Redirect(http.StatusSeeOther, "/game")
	}
}

func status(c *gin.Context) {
	status := game.Status(c.Param("status"))
	platform := game.Platform(c.Param("platform"))
	page, err := strconv.Atoi(c.Param("page"))
	if err != nil {
		page = 1
	}

	games, totalPage := h.GameService.PageByPlatformStatus(status, platform, page, PAGE_LIMIT)
	data := gin.H{
		"games":      games,
		"total_page": totalPage,
	}

	c.JSON(http.StatusOK, data)
}
