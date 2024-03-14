package col

import (
	"ditto/db/mgo"
	"ditto/model/col"
	cm "ditto/model/common"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct{}

type Service interface {
	All() []col.Col
	// Badge() col.Badge
	ByID(id any) col.Col
	ByType(typ col.Type) []col.Col
	Create(col.Col) error
	Delete(id any) error
	PageByStatusType(status cm.Status, typ col.Type, page, limit int) ([]col.Col, int)
	Update(col.Col) error
}

func NewService() Service {
	return &service{}
}

func (s *service) All() []col.Col {
	var cols []col.Col
	mgo.FindMany(mgo.Cols, &cols, bson.D{}, bson.D{})
	return cols
}

func (s *service) ByType(typ col.Type) []col.Col {
	var filter bson.D
	var cols []col.Col
	filter = bson.D{primitive.E{Key: "type", Value: typ}}
	sort := bson.D{primitive.E{Key: "title", Value: 1}}
	mgo.FindMany(mgo.Cols, &cols, filter, sort)
	return cols
}

// func (s *service) Badge() col.Badge {
// 	return col.Badge{

// 	}
// }

func (s *service) ByID(id any) col.Col {
	var c col.Col
	mgo.FindID(mgo.Cols, id).Decode(&c)
	return c
}

func (s *service) Create(c col.Col) error {
	c.ID = primitive.NewObjectIDFromTimestamp(time.Now())
	c.CreatedAt = time.Now()
	c.UpdatedAt = time.Now()
	return mgo.Insert(mgo.Cols, c)
}

func (s *service) Delete(id any) error {
	err := mgo.DeleteID(mgo.Cols, id)
	if err != nil {
		return err
	}
	return nil
}

func (s *service) PageByStatusType(status cm.Status, typ col.Type, page, limit int) ([]col.Col, int) {
	var filter bson.D

	// Check type
	if len(typ) != 0 {
		filter = bson.D{primitive.E{Key: "type", Value: typ}}
	}

	filter = append(filter, primitive.E{Key: "status", Value: status})

	var cols []col.Col
	sort := bson.D{primitive.E{Key: "title", Value: 1}}
	totalPages, err := mgo.FindPage(mgo.Cols, &cols, filter, page, limit, sort)
	if err != nil {
		return nil, 1
	}
	return cols, totalPages
}

func (s *service) Update(c col.Col) error {
	update := bson.D{primitive.E{
		Key: "$set", Value: bson.D{
			primitive.E{Key: "title", Value: c.Title},
			primitive.E{Key: "by", Value: c.By},
			primitive.E{Key: "type", Value: c.Type},
			primitive.E{Key: "date", Value: c.Date},
			primitive.E{Key: "color", Value: c.Color},
			primitive.E{Key: "spec", Value: c.Spec},
			primitive.E{Key: "price", Value: c.Price},
			primitive.E{Key: "updated_at", Value: time.Now()},
		}},
	}
	return mgo.Update(mgo.Cols, c.ID, update)
}

// func countStatus(status book.Status) int {
// 	filter := bson.D{primitive.E{Key: "status", Value: status}}
// 	cnt, _ := mgo.Count(mgo.Books, filter)
// 	return int(cnt)
// }
