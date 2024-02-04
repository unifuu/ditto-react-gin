package book

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	// Status
	READ    = Status("Read")
	READING = Status("Reading")
	TO_READ = Status("ToRead")
)

type Status string

type Book struct {
	ID          primitive.ObjectID `bson:"_id" json:"id"`
	Title       string             `bson:"title" json:"title"`
	Author      string             `bson:"author" json:"author"`
	Publisher   string             `bson:"publisher" json:"publisher"`
	PubYear     int                `bson:"pub_year" json:"pub_year"`
	Genre       string             `bson:"genre" json:"genre"`
	CurrentPage int                `bson:"cur_page" json:"cur_page"`
	TotalPage   int                `bson:"total_page" json:"total_page"`
	Status      Status             `bson:"status" json:"status"`
	TotalTime   int                `bson:"total_time" json:"total_time"`
	CreatedAt   time.Time          `bson:"created_at" json:"-"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"-"`

	Hour           int    `json:"hour" bson:"hour,omitempty"`
	Min            int    `json:"min" bson:"min,omitempty"`
	PageProgress   string `json:"page_progress" bson:"page_progress,omitempty"`
	PagePercentage string `json:"page_percentage" bson:"page_percentage,omitempty"`
	Logs           []Log  `json:"logs" bson:"logs,omitempty"`
}

type Badge struct {
	Read    int `json:"read"`
	Reading int `json:"reading"`
	ToRead  int `json:"to_read"`
}

type Log struct {
	Date        string `json:"date" bson:"date"`
	Start       string `json:"start" bson:"start"`
	End         string `json:"end" bson:"end"`
	CurrentPage int    `json:"cur_page" bson:"cur_page"`
}
