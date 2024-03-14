// Collection
package col

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	BOOK       = Type("Book")
	GAME       = Type("Game")
	GUNPLA     = Type("Gunpla")
	STATIONERY = Type("Stationary")
)

type Type string

type Col struct {
	ID    primitive.ObjectID `bson:"_id" json:"id"`
	Title string             `bson:"title" json:"title"`
	By    string             `bson:"by" json:"by"`
	Type  Type               `bson:"type" json:"type"`
	Date  string             `bson:"date" json:"date"`
	Color string             `bson:"color" json:"color"`
	Spec  string             `bson:"spec" json:"spec"`
	Price int                `bson:"price" json:"price"`

	CreatedAt time.Time `bson:"created_at" json:"-"`
	UpdatedAt time.Time `bson:"updated_at" json:"-"`
}

type Badge struct {
	Book       int `json:"book"`
	Game       int `json:"game"`
	Gunpla     int `json:"gunpla"`
	Stationery int `json:"stationery"`
}
