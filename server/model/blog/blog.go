package blog

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Detail struct
type Detail struct {
	Post Post
	Tags []Tag
}

func (p *Post) SetTags(tags []Tag) {
	var tagIDs []primitive.ObjectID
	for _, v := range tags {
		tagIDs = append(tagIDs, v.ID)
	}
	p.TagIDs = tagIDs
}

// Post struct
type Post struct {
	ID        primitive.ObjectID   `json:"id" bson:"_id"`
	Title     string               `json:"title" bson:"title"`
	Preview   string               `json:"preview" bson:"preview"`
	Content   string               `json:"content" bson:"content"`
	TagIDs    []primitive.ObjectID `json:"tag_ids" bson:"tag_ids"`
	Tags      []Tag                `json:"tags"`
	Date      string               `json:"date" bson:"date"`
	IsPinned  bool                 `json:"is_pinned" bson:"is_pinned"`
	CreatedAt time.Time            `bson:"created_at" json:"-"`
	UpdatedAt time.Time            `bson:"updated_at" json:"-"`
}

// Tag struct
type Tag struct {
	ID        primitive.ObjectID `json:"id" bson:"_id"`
	Name      string             `json:"name" bson:"name"`
	Color     string             `json:"color" bson:"color"`
	CreatedAt time.Time          `bson:"created_at" json:"-"`
	UpdatedAt time.Time          `bson:"updated_at" json:"-"`
}
