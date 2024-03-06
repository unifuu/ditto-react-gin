// Collection
package col

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	ANIME     = Status("Anime")
	BOOK      = Status("Book")
	ELECTRICS = Status("Electrics")
	FURNITURE = Status("Furniture")
	GUNPLA    = Status("Gunpla")
	MOVIE     = Status("Movie")
)

type Status string
type Type string

type Col struct {
	ID     primitive.ObjectID `bson:"_id" json:"id"`
	Title  string             `bson:"title" json:"title"`
	MadeBy string             `bson:"made_by" json:"made_by"`
	Type   Type               `bson:"type" json:"type"`
	Date   string             `bson:"date" json:"date"`
	Color  string             `bson:"color" json:"color"`
	Spec   string             `bson:"spec" json:"spec"`
	Price  int                `bson:"price" json:"price"`

	CreatedAt time.Time `bson:"created_at" json:"-"`
	UpdatedAt time.Time `bson:"updated_at" json:"-"`
}

type Badge struct {
	Anime     int `json:"anime"`
	Book      int `json:"book"`
	Electrics int `json:"electrics"`
	Furniture int `json:"furniture"`
	Gunpla    int `json:"gunpla"`
	Movie     int `json:"movie"`
}
