// Collection
package col

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	// Type
	ANIME     = Status("Anime")
	BOOK      = Status("Book")
	ELECTRICS = Status("Electrics")
	GUNPLA    = Status("Gunpla")
	MOVIE     = Status("Movie")
)

type Status string
type Type string

type Col struct {
	ID    primitive.ObjectID `bson:"_id" json:"id"`
	Title string             `bson:"title" json:"title"`
	Type  Type               `bson:"type" json:"type"`
	Date  string             `bson:"date" json:"date"`
	Color string             `bson:"color" json:"color"`
	Spec  string             `bson:"spec" json:"spec"`
	Price int                `bson:"price" json:"price"`

	CreatedAt time.Time `bson:"created_at" json:"-"`
	UpdatedAt time.Time `bson:"updated_at" json:"-"`
}
