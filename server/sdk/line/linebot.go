package linebot

import (
	"ditto/model/config"
	"log"

	sdk "github.com/line/line-bot-sdk-go/linebot"
)

var LineBot *sdk.Client

// LineBot
func NewLineBot() {
	var err error
	LineBot, err = sdk.New(
		config.Config.LineChannelSecret,
		config.Config.LineChannelToken,
	)
	if err != nil {
		log.Fatal(err)
	}
}
