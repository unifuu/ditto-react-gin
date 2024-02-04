package main

import (
	"ditto/core"
)

func main() {
	core.InitAndServe()
}

// func main() {
// 	// Get a Gin engine
// 	core.Init()

// 	go func() {
// 		if err := core.Ditto.Serve(); err != nil {
// 			log.Fatal("failed to listen port.", err)
// 		}
// 	}()

// 	quit := make(chan os.Signal, 1)
// 	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
// 	<-quit
// 	log.Println("shutdown server ...")

// 	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
// 	defer cancel()
// 	if err := core.Ditto.Server.Shutdown(ctx); err != nil {
// 		log.Fatal("server shutdown:", err)
// 	}

// 	select {
// 	case <-ctx.Done():
// 		log.Println("timeout of 5 seconds.")
// 	default:
// 	}

// 	log.Println("server exiting")
// }
