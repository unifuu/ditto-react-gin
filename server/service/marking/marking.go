package marking

import (
	"ditto/db/mgo"
	cm "ditto/model/common"
	mk "ditto/model/marking"
	"ditto/util/format"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct{}

type Service interface {
	All() []mk.Marking
	Badge() cm.Badge
	ByID(id any) mk.Marking
	ByStatus(status cm.Status) []mk.Marking
	Create(mk.Marking) error
	Delete(id any) error
	PageByStatusType(status cm.Status, typ mk.Type, page, limit int) ([]mk.Marking, int)
	Update(mk.Marking) error
}

func NewService() Service {
	return &service{}
}

func (s *service) All() []mk.Marking {
	var markings []mk.Marking
	mgo.FindMany(mgo.Markings, &markings, bson.D{}, bson.D{})
	return markings
}

// TODO: Fix the status == "All"
func (s *service) ByStatus(status cm.Status) []mk.Marking {
	var filter bson.D
	var markings []mk.Marking
	filter = bson.D{primitive.E{Key: "status", Value: status}}
	sort := bson.D{primitive.E{Key: "title", Value: 1}}
	mgo.FindMany(mgo.Markings, &markings, filter, sort)
	return markings
}

func (s *service) Badge() cm.Badge {
	return cm.Badge{
		Done:  countStatus(cm.DONE),
		Doing: countStatus(cm.DOING),
		Todo:  countStatus(cm.TODO),
	}
}

func (s *service) ByID(id any) mk.Marking {
	var marking mk.Marking
	mgo.FindID(mgo.Markings, id).Decode(&marking)
	return marking
}

func (s *service) Create(m mk.Marking) error {
	m.ID = primitive.NewObjectIDFromTimestamp(time.Now())
	m.CreatedAt = time.Now()
	m.UpdatedAt = time.Now()
	return mgo.Insert(mgo.Markings, m)
}

func (s *service) Delete(id any) error {
	err := mgo.DeleteID(mgo.Markings, id)
	if err != nil {
		return err
	}
	return nil
}

func (s *service) PageByStatusType(status cm.Status, typ mk.Type, page, limit int) ([]mk.Marking, int) {
	filter := bson.D{}

	if len(status) > 0 && status != "All" {
		filter = bson.D{primitive.E{Key: "status", Value: status}}
	}

	if len(typ) > 0 && typ != "All" {
		filter = append(filter, primitive.E{Key: "type", Value: typ})
	}

	var markings []mk.Marking
	sort := bson.D{primitive.E{Key: "title", Value: 1}}
	totalPages, err := mgo.FindPage(mgo.Markings, &markings, filter, page, limit, sort)
	if err != nil {
		return nil, 1
	}

	for i, m := range markings {
		markings[i].Progress = fmt.Sprintf("%v", m.Current) + " / " + fmt.Sprintf("%v", m.Total)
		markings[i].Percentage = format.Percentage(m.Current, m.Total)
	}
	return markings, totalPages
}

func (s *service) Update(m mk.Marking) error {
	update := bson.D{primitive.E{
		Key: "$set", Value: bson.D{
			primitive.E{Key: "title", Value: m.Title},
			primitive.E{Key: "by", Value: m.By},
			primitive.E{Key: "type", Value: m.Type},
			primitive.E{Key: "year", Value: m.Year},
			primitive.E{Key: "current", Value: m.Current},
			primitive.E{Key: "total", Value: m.Total},
			primitive.E{Key: "status", Value: m.Status},
			primitive.E{Key: "price", Value: m.Price},
			primitive.E{Key: "updated_at", Value: time.Now()},
		}},
	}
	return mgo.Update(mgo.Markings, m.ID, update)
}

func countStatus(status cm.Status) int {
	filter := bson.D{primitive.E{Key: "status", Value: status}}
	cnt, _ := mgo.Count(mgo.Markings, filter)
	return int(cnt)
}
