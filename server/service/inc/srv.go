package inc

import (
	"ditto/db/mgo"
	"ditto/model/inc"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct{}

type Service interface {
	All() []inc.Inc
	IsExists(name string) bool
	ByID(id any) inc.Inc
	ByName(name string) ([]inc.Inc, error)
	Create(inc inc.Inc) error
	Developers() []inc.Inc
	Publishers() []inc.Inc
	Update(inc inc.Inc) error
}

func NewService() Service {
	return &service{}
}

func (s *service) All() []inc.Inc {
	var incs []inc.Inc
	mgo.FindMany(mgo.Incs, &incs, bson.D{}, bson.D{})
	return incs
}

func (s *service) ByID(id any) inc.Inc {
	var inc inc.Inc
	result := mgo.FindID(mgo.Incs, id)
	result.Decode(&inc)
	return inc
}

func (s *service) ByName(name string) ([]inc.Inc, error) {
	var incs []inc.Inc

	// qry := bson.D{primitive.E{Key: "name", Value: "/" + name + "/"}}
	// filter := bson.D{{Key: "name", Value: primitive.Regex{Pattern: "/" + name + "/", Options: ""}}}
	filter := bson.D{{Key: "name", Value: primitive.Regex{Pattern: name, Options: "i"}}}
	srt := bson.D{primitive.E{Key: "name", Value: 1}}
	err := mgo.FindMany(mgo.Incs, &incs, filter, srt)
	return incs, err
}

func (s *service) Create(inc inc.Inc) error {
	inc.ID = primitive.NewObjectIDFromTimestamp(time.Now())
	inc.CreatedAt = time.Now()
	inc.UpdatedAt = time.Now()
	return mgo.Insert(mgo.Incs, inc)
}

func (s *service) Developers() []inc.Inc {
	var incs []inc.Inc
	qry := bson.D{primitive.E{Key: "is_developer", Value: 1}}
	srt := bson.D{primitive.E{Key: "name", Value: 1}}
	mgo.FindMany(mgo.Incs, &incs, qry, srt)
	return incs
}

func (s *service) IsExists(name string) bool {
	var inc inc.Inc

	filter := bson.D{primitive.E{Key: "name", Value: name}}
	result := mgo.FindOne(mgo.Incs, filter)
	err := result.Decode(&inc)

	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			return false
		}
	}

	return true
}

func (s *service) Publishers() []inc.Inc {
	var incs []inc.Inc
	qry := bson.D{primitive.E{Key: "is_publisher", Value: 1}}
	srt := bson.D{primitive.E{Key: "name", Value: 1}}
	mgo.FindMany(mgo.Incs, &incs, qry, srt)
	return incs
}

func (s *service) Update(inc inc.Inc) error {
	update := bson.D{primitive.E{
		Key: "$set", Value: bson.D{
			primitive.E{Key: "name", Value: inc.Name},
			primitive.E{Key: "is_developer", Value: inc.IsDeveloper},
			primitive.E{Key: "is_publisher", Value: inc.IsPublisher},
			primitive.E{Key: "updated_at", Value: time.Now()},
		}},
	}
	return mgo.Update(mgo.Incs, inc.ID, update)
}
