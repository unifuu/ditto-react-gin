package act

import (
	h "ditto/ctr"
	mw "ditto/middleware"
	"ditto/model/act"
	"ditto/model/game"
	"ditto/model/project"
	dt "ditto/util/datetime"
	"ditto/util/format"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

var sw *act.StopWatch

func API(e *gin.Engine) {
	auth := e.Group("api/act").Use(mw.Auth)
	{
		auth.Any("/create", create)
		auth.POST("/delete", delete)
		auth.DELETE("/delete", delete)
		auth.GET("/", query)
		auth.GET("/query", query)
		auth.GET("/stopwatch", stopwatch)
		auth.Any("/stopwatch/start", start)
		auth.Any("/stopwatch/stop", stop)
		auth.POST("/stopwatch/terminate", terminate)
		auth.GET("/titles", titles)
	}
}

func create(c *gin.Context) {
	switch c.Request.Method {
	case "POST":
		typ := act.Type(c.PostForm("type"))
		date, _ := dt.ClearDate2Plain(c.PostForm("date"))
		start, _ := dt.Str2Time(c.PostForm("start") + ":00")
		end, _ := dt.Str2Time(c.PostForm("end") + ":00")
		dur := end.Sub(start).Minutes()

		targetID := c.PostForm("targetId")
		targetObjID := format.ToObjID(targetID)

		a := act.Activity{
			Type:     typ,
			Date:     date,
			Start:    dt.Time2Str(start, dt.HHMMSS),
			End:      dt.Time2Str(end, dt.HHMMSS),
			Duration: int(dur),
			TargetID: targetObjID,
		}
		err := h.ActService.Create(a)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"msg": "NG!"})
			return
		}

		switch typ {
		case act.GAMING:
			g := h.GameService.ByID(a.TargetID)
			g.TotalTime += a.Duration
			h.GameService.Update(g)

		case act.PROGRAMMING:
			p := h.ProjService.ByID(a.TargetID)
			p.TotalTime += a.Duration
			h.ProjService.Update(p)
		}

		c.Redirect(http.StatusSeeOther, "/act")
	}
}

func delete(c *gin.Context) {
	type Json struct {
		ID string `json:"id"`
	}

	var json Json
	if err := c.BindJSON(&json); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	err := h.ActService.Delete(json.ID)

	if err != nil {
		c.JSON(404, gin.H{"msg": "Failed!"})
		return
	}
	c.JSON(200, gin.H{"msg": "Done!"})
}

func query(c *gin.Context) {
	date := c.Query("date") // YYYYMMDD
	if len(date) == 0 {
		date = dt.Today(dt.YYYYMMDD)
	}

	typ := c.Query("type")
	dur := c.Query("duration")

	var acts []act.Activity
	var summary []act.Summary

	if dur == "Day" {
		acts, _ = h.ActService.DayDetail(date, typ)
		summary = h.ActService.DaySummary(date, typ)
	} else if dur == "Week" {
		acts, _ = h.ActService.WeekDetail(date, typ)
		summary = h.ActService.WeekSummary(date, typ)
	} else if dur == "Month" {
		acts, _ = h.ActService.MonthDetail(date, typ)
		summary = h.ActService.MonthSummary(date, typ)
	} else if dur == "Year" {
		acts, _ = h.ActService.YearDetail(date, typ)
		summary = h.ActService.YearSummary(date, typ)
	}

	t0, _ := time.Parse("20060102", date)

	data := gin.H{
		"date":         dt.Time2Str(t0, dt.YYYYMMDD),
		"acts":         acts,
		"summary":      summary,
		"stopwatching": sw, // For the badge
	}
	c.JSON(http.StatusOK, data)
}

func start(c *gin.Context) {
	switch c.Request.Method {
	case "GET":
		if sw != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"msg": "Stopwatch is running!",
			})
			return
		}

		typ := act.Type(c.Query("type"))
		targetId := c.Query("id")
		title := h.ActService.TitleByIDAndType(targetId, typ)

		sw = act.NewStopWatch(typ, targetId, title)
		err := sw.Start()

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"msg": "URL is invalid!",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"msg": "Stopwatch started!",
		})

	case "POST":
		typ := act.Type(c.PostForm("type"))
		targetId := c.PostForm("targetId")

		if sw == nil {
			title := h.ActService.TitleByIDAndType(targetId, typ)
			sw = act.NewStopWatch(typ, targetId, title)
			sw.Start()
		}
		c.Redirect(http.StatusSeeOther, "/act")
	}
}

func stop(c *gin.Context) {
	// Stop the stopwatch
	sw.Stop()

	// At least 5 minutes
	if sw.Duration > 0 {
		h.ActService.Create(act.Activity{
			Date:     dt.Today(dt.YYYYMMDD),
			Start:    dt.Time2Str(sw.StartTime, dt.HHMM),
			End:      dt.Time2Str(sw.EndTime, dt.HHMM),
			Duration: sw.Duration,
			Type:     sw.Type,
			TargetID: format.ToObjID(sw.TargetID),
		})

		switch sw.Type {
		case act.GAMING:
			g := h.GameService.ByID(sw.TargetID)
			g.TotalTime += sw.Duration
			h.GameService.Update(g)

		case act.PROGRAMMING:
			p := h.ProjService.ByID(sw.TargetID)
			p.TotalTime += sw.Duration
			h.ProjService.Update(p)
		}
	}

	// Reset the stopwatch
	sw = nil
	c.Redirect(http.StatusSeeOther, "/act")
}

func terminate(c *gin.Context) {
	sw = nil
	c.JSON(http.StatusOK, nil)
}

func titles(c *gin.Context) {
	data := gin.H{
		"gaming":      h.GameService.ByStatus(game.PLAYING),
		"programming": h.ProjService.ByStatus(project.DEVELOPING),
	}
	c.JSON(http.StatusOK, data)
}

func stopwatch(c *gin.Context) {
	var watch act.StopWatch
	if sw != nil {
		watch = *sw
	}
	c.JSON(http.StatusOK, watch)
}
