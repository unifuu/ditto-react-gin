package project

import (
	"ditto/db/mgo"
	"ditto/model/project"
	proj "ditto/model/project"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	table = "project"
)

type service struct{}

type Service interface {
	All() []proj.Project
	ByID(id any) proj.Project
	ByStatus(status project.Status) []proj.Project
	Create(proj.Project) error
	Delete(id any) error
	Update(proj.Project) error
}

func NewService() Service {
	return &service{}
}

func (s *service) All() []proj.Project {
	var projects []proj.Project
	mgo.FindMany(mgo.Projects, &projects, bson.D{}, bson.D{})
	return projects
}

func (s *service) ByStatus(status proj.Status) []proj.Project {
	var filter bson.D
	var projects []proj.Project
	filter = bson.D{primitive.E{Key: "status", Value: status}}
	sort := bson.D{primitive.E{Key: "title", Value: 1}}
	mgo.FindMany(mgo.Projects, &projects, filter, sort)
	return projects
}

func (s *service) ByID(id any) proj.Project {
	var p proj.Project
	mgo.FindID(mgo.Projects, id).Decode(&p)
	return p
}

func (s *service) Create(p proj.Project) error {
	p.ID = primitive.NewObjectIDFromTimestamp(time.Now())
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
	return mgo.Insert(mgo.Projects, p)
}

func (s *service) Delete(id any) error {
	err := mgo.DeleteID(mgo.Projects, id)
	if err != nil {
		return err
	}
	return nil
}

func (s *service) Update(p proj.Project) error {
	update := bson.D{primitive.E{
		Key: "$set", Value: bson.D{
			primitive.E{Key: "title", Value: p.Title},
			primitive.E{Key: "languages", Value: p.Languages},
			primitive.E{Key: "status", Value: p.Status},
			primitive.E{Key: "total_time", Value: p.TotalTime},
			primitive.E{Key: "updated_at", Value: time.Now()},
		}},
	}
	return mgo.Update(mgo.Projects, p.ID, update)
}
