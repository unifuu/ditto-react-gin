package core

import (
	handler "ditto/ctr"
	"ditto/ctr/route"
	"ditto/db"
	mw "ditto/middleware"
	"fmt"
	"net/http"

	rds "ditto/db/redis"
	"ditto/model/config"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Initialize components, and return *http.Server
func InitAndServe() {
	// Read app.json
	config.LoadAppConfig()

	var httpPort string
	var httpsPort string

	// Set Gin mode and port
	switch config.Config.GinMode {
	case gin.ReleaseMode:
		gin.SetMode(gin.ReleaseMode)
		httpPort = fmt.Sprintf(":%d", config.Config.HttpPort)
		httpsPort = fmt.Sprintf(":%d", config.Config.HttpsPort)

		// Init LineBot
		// linebot.NewLineBot()
	default:
		gin.SetMode(gin.DebugMode)
		httpPort = fmt.Sprintf(":%d", config.Config.HttpPort)
	}

	// Get a Gin Router instance
	// httpRouter := gin.Default()
	router := gin.Default()

	// Redirect HTTP to HTTPS
	if gin.Mode() == gin.ReleaseMode {
		router.Use(mw.HTTPS())
	}

	// CORS
	router.Use(cors.Default())

	// Connect to Redis
	rds.Cli = rds.NewRedisClient()

	// Set routers
	route.API(router)

	// Initialize handler
	handler.Init()

	// Set logger
	router.Use(gin.Logger())

	// Initialize database
	db.Init()

	// OpenAI
	// openai.Init()

	// Listen and serve
	switch gin.Mode() {
	case gin.ReleaseMode:
		// HTTP server
		go http.ListenAndServe(httpPort, router)

		// HTTPS server
		http.ListenAndServeTLS(
			httpsPort,
			config.Config.TlsCertFile,
			config.Config.TlsKeyFile,
			router,
		)
	default:
		http.ListenAndServe(httpPort, router)
	}
}

// Write log to a file
// func setLog() {
// 	f, err := os.OpenFile("app.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
// 	if err != nil {
// 		log.Fatalf("error opening file: %v", err)
// 	}
// 	defer f.Close()
// 	log.SetOutput(f)
// }
