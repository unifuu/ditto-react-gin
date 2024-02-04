package openai

import (
	"context"
	"ditto/model/config"
	"fmt"

	openai_sdk "github.com/sashabaranov/go-openai"
)

var Client *openai_sdk.Client

func Init() {
	Client = openai_sdk.NewClient(config.Config.OpenAIToken)
}

func Request(msg string) string {
	resp, err := Client.CreateChatCompletion(
		context.Background(),
		openai_sdk.ChatCompletionRequest{
			Model: openai_sdk.GPT3Dot5Turbo,
			Messages: []openai_sdk.ChatCompletionMessage{
				{
					Role:    openai_sdk.ChatMessageRoleUser,
					Content: msg,
				},
			},
		},
	)

	if err != nil {
		fmt.Println(err)
		return ""
	}

	return resp.Choices[0].Message.Content
}
