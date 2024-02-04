package game

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Types
type Status string
type Genre string
type Platform string

const (
	// Status
	PLAYING = Status("Playing")
	PLAYED  = Status("Played")
	TO_PLAY = Status("ToPlay")

	// Platform
	PC              = Platform("PC")
	NINTENDO_SWITCH = Platform("Nintendo Switch")
	PLAY_STATION    = Platform("PlayStation")
	XBOX            = Platform("Xbox")
	MOBILE          = Platform("Mobile")

	// Genres
	ACT          = Genre("ACT")
	ARPG         = Genre("ARPG")
	CARD         = Genre("Card")
	FPS          = Genre("FPS")
	MMORPG       = Genre("MMORPG")
	MOBA         = Genre("MOBA")
	RHYTHM       = Genre("Rhythm")
	RPG          = Genre("RPG")
	RTS          = Genre("RTS")
	SANDBOX      = Genre("Sandbox")
	SIMULATION   = Genre("Simulation")
	SURVIVAL     = Genre("Survival")
	TPS          = Genre("TPS")
	TRPG         = Genre("TRPG")
	VISUAL_NOVEL = Genre("Visual Novel")
)

// Return genres
func Genres() []Genre {
	return []Genre{
		ACT, ARPG, CARD, FPS, MMORPG, MOBA, RHYTHM, RPG, RTS,
		SANDBOX, SIMULATION, SURVIVAL, TPS, VISUAL_NOVEL,
	}
}

// Return platforms
func Platforms() []Platform {
	return []Platform{
		PC, PLAY_STATION, NINTENDO_SWITCH, XBOX, MOBILE,
	}
}

// Return status
func Statuses() []Status {
	return []Status{
		PLAYING, PLAYED, TO_PLAY,
	}
}

// Badges
type Badge struct {
	// Play status
	Played  int `json:"played"`
	Playing int `json:"playing"`
	ToPlay  int `json:"to_play"`

	// Platform
	AllPlatform  int `json:"all_platform"`
	PC           int `json:"pc"`
	PlayStaion   int `json:"playstation"`
	NintenSwitch int `json:"nintendo_switch"`
	XBox         int `json:"xbox"`
	Mobile       int `json:"mobile"`
}

// Game model
type Game struct {
	ID            primitive.ObjectID `json:"id" bson:"_id"`
	Title         string             `json:"title" bson:"title"`
	Genre         Genre              `json:"genre" bson:"genre"`
	Platform      Platform           `json:"platform" bson:"platform"`
	DeveloperID   primitive.ObjectID `json:"developer_id" bson:"developer_id"`
	PublisherID   primitive.ObjectID `json:"publisher_id" bson:"publisher_id"`
	Status        Status             `json:"status" bson:"status"`
	TotalTime     int                `json:"total_time" bson:"total_time"`
	HowLongToBeat int                `json:"how_long_to_beat" bson:"how_long_to_beat"`
	Ranking       int                `json:"ranking" bson:"ranking"`
	Rating        string             `json:"rating" bson:"rating"`
	CreatedAt     time.Time          `json:"-" bson:"created_at"`
	UpdatedAt     time.Time          `json:"-" bson:"updated_at"`

	Developer string `json:"developer" bson:"developer,omitempty"`
	Publisher string `json:"publisher" bson:"publisher,omitempty"`
}

type Rating struct {
	PersonalEnjoyment int // 4
	GamePlay          int // 4
	Characters        int // 3
	Story             int // 3
	Replayability     int // 2
	TechnicalAspects  int // 2
	GraphicsAndArt    int // 1
	SoundAndMusic     int // 1
}
