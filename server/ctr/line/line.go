// LineBot API
package line

import (
	linebot "ditto/sdk/line"
	"ditto/sdk/openai"
	"log"

	"github.com/gin-gonic/gin"
	sdk "github.com/line/line-bot-sdk-go/linebot"
)

func API(e *gin.Engine) {
	e.Any("/api/line/chat", callback)
}

func callback(c *gin.Context) {
	events, err := linebot.LineBot.ParseRequest(c.Request)
	if err != nil {
		if err == sdk.ErrInvalidSignature {
			c.Writer.WriteHeader(400)
		} else {
			c.Writer.WriteHeader(500)
		}
		return
	}

	for _, event := range events {
		if event.Type == sdk.EventTypeMessage {
			switch message := event.Message.(type) {
			// If the message is text then call ChatGPT api with the message
			case *sdk.TextMessage:
				msg := message.Text
				chatGPT(event, msg)

			// Only support text messages
			default:
				unknown(event)
			}
		}
	}
}

func chatGPT(event *sdk.Event, msg string) {
	reply(event, openai.Request(msg))
}

func unknown(event *sdk.Event) {
	if _, err := linebot.LineBot.ReplyMessage(
		event.ReplyToken,
		sdk.NewTextMessage("Unknown command..."),
	).Do(); err != nil {
		log.Print(err)
	}
}

func reply(event *sdk.Event, msg string) {
	if _, err := linebot.LineBot.ReplyMessage(
		event.ReplyToken,
		sdk.NewTextMessage(msg),
	).Do(); err != nil {
		log.Print(err)
	}
}

func boardcast(event *sdk.Event, msg string) {

}
