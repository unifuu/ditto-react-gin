package book

import (
	"ditto/model/common"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	ANIME      = Type("Anime")
	BOOK       = Type("Book")
	DRAMA      = Type("Drama")
	GAME       = Type("Game")
	GUNPLA     = Type("Gunpla")
	LESSON     = Type("Lesson")
	MOVIE      = Type("Movie")
	STATIONERY = Type("Stationary")
)

type Type string

type Marking struct {
	ID        primitive.ObjectID `bson:"_id" json:"id"`
	Title     string             `bson:"title" json:"title"`
	Type      Type               `bson:"type" json:"type"`
	By        string             `bson:"by" json:"by"`
	Year      string             `bson:"year" json:"year"`
	Current   int                `bson:"current" json:"current"`
	Total     int                `bson:"total" json:"total"`
	Price     int                `bson:"price" json:"price"`
	Status    common.Status      `bson:"status" json:"status"`
	CreatedAt time.Time          `bson:"created_at" json:"-"`
	UpdatedAt time.Time          `bson:"updated_at" json:"-"`

	Progress   string `json:"progress" bson:"progress,omitempty"`
	Percentage string `json:"percentage" bson:"percentage,omitempty"`
}
