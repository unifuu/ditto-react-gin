package act

import (
	"ditto/db/mgo"
	"ditto/model/act"
	"ditto/service/game"
	"ditto/service/project"
	"ditto/util/datetime"
	dt "ditto/util/datetime"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Service interface {
	ByTargetID(targetID any) ([]act.Activity, error)
	Create(act act.Activity) error
	DayDetail(date string, typ string) ([]act.Activity, error)
	DaySummary(date string, typ string) []act.Summary
	Delete(actId string) error
	Duration(ymd string) int
	MonthDetail(date string, typ string) ([]act.Activity, error)
	MonthSummary(date string, typ string) []act.Summary
	TitleByIDAndType(id any, typ act.Type) string
	WeekDetail(date string, typ string) ([]act.Activity, error)
	WeekSummary(date string, typ string) []act.Summary
	YearDetail(date string, typ string) ([]act.Activity, error)
	YearSummary(date string, typ string) []act.Summary
}

type service struct{}

func NewService() Service {
	return &service{}
}

func (s *service) ByTargetID(targetID any) ([]act.Activity, error) {
	var acts []act.Activity

	// sort := bson.D{
	// 	primitive.E{Key: "$sort", Value: bson.D{
	// 		primitive.E{Key: "start", Value: 1},
	// 		primitive.E{Key: "end", Value: 1},
	// 	}},
	// }

	err := mgo.FindMany(mgo.Acts, &acts, bson.D{{Key: "target_id", Value: targetID}}, bson.D{})
	return acts, err
}

func (s *service) Create(a act.Activity) error {
	a.ID = primitive.NewObjectIDFromTimestamp(time.Now())
	a.CreatedAt = time.Now()
	a.UpdatedAt = time.Now()
	return mgo.Insert(mgo.Acts, a)
}

func (s *service) DayDetail(date string, typ string) ([]act.Activity, error) {
	var details []act.Activity

	if len(date) == 0 {
		return nil, fmt.Errorf("Bad date: " + date)
	}

	var filter bson.D
	if len(typ) == 0 || typ == "All" {
		filter = bson.D{
			primitive.E{Key: "$match", Value: bson.D{primitive.E{Key: "date", Value: date}}},
		}
	} else {
		filter = bson.D{
			primitive.E{Key: "$match", Value: bson.D{
				primitive.E{Key: "date", Value: date},
				primitive.E{Key: "type", Value: typ},
			}},
		}
	}

	sort := bson.D{
		primitive.E{Key: "$sort", Value: bson.D{
			primitive.E{Key: "start", Value: 1},
			primitive.E{Key: "end", Value: 1},
		}},
	}

	pipe := mongo.Pipeline{filter, sort}
	err := mgo.Aggregate(mgo.Acts, pipe, &details)

	gameSrv := game.NewService()
	projSrv := project.NewService()

	for i, a := range details {
		switch a.Type {
		case act.GAMING:
			details[i].Title = gameSrv.TitleByID(a.TargetID)
		case act.PROGRAMMING:
			details[i].Title = projSrv.ByID(a.TargetID).Title
		}
	}
	return details, err
}

func (s *service) DaySummary(date string, typ string) []act.Summary {
	var sum []act.Summary

	// Check parameter
	if len(date) < 8 {
		return nil
	}

	var filter bson.D
	if len(typ) == 0 || typ == "All" {
		filter = bson.D{
			primitive.E{Key: "$match", Value: bson.D{primitive.E{Key: "date", Value: date}}},
		}
	} else {
		filter = bson.D{
			primitive.E{Key: "$match", Value: bson.D{
				primitive.E{Key: "date", Value: date},
				primitive.E{Key: "type", Value: typ},
			}},
		}
	}

	group := bson.D{primitive.E{Key: "$group", Value: bson.D{
		primitive.E{Key: "_id", Value: "$type"},
		primitive.E{Key: "type", Value: bson.D{{Key: "$first", Value: "$type"}}},
		primitive.E{Key: "target_id", Value: bson.D{{Key: "$first", Value: "$target_id"}}},
		primitive.E{Key: "duration", Value: bson.D{
			primitive.E{Key: "$sum", Value: "$duration"}},
		}},
	}}

	pipe := []bson.D{filter, group}
	mgo.Aggregate(mgo.Acts, pipe, &sum)

	for i, v := range sum {
		sum[i].Hour = v.Duration / 60
		sum[i].Min = v.Duration % 60
	}
	return sum
}

func (s *service) Delete(id string) error {
	return mgo.DeleteID(mgo.Acts, id)
}

func (s *service) Duration(date string) int {
	if len(date) == 0 {
		return 0
	}

	result := []bson.M{}
	var match bson.D

	if len(date) == 6 {
		match = bson.D{
			primitive.E{Key: "$match", Value: bson.D{
				primitive.E{Key: "date", Value: primitive.Regex{Pattern: "^" + date, Options: "m"}},
			}},
		}
	} else {
		match = bson.D{primitive.E{Key: "$match", Value: bson.D{
			primitive.E{Key: "date", Value: date},
		}}}
	}

	group := bson.D{
		primitive.E{Key: "$group", Value: bson.D{
			primitive.E{Key: "_id", Value: "$type"},
			primitive.E{Key: "duration", Value: bson.D{
				primitive.E{Key: "$sum", Value: "$duration"}}},
		}},
	}

	pipeline := []bson.D{match, group}
	if mgo.Aggregate(mgo.Acts, pipeline, &result) != nil {
		return 0
	}

	if len(result) == 0 {
		return 0
	}

	return int(result[0]["duration"].(int32))
}

func (s *service) MonthDetail(date string, typ string) ([]act.Activity, error) {
	if len(date) == 0 {
		return nil, fmt.Errorf("unknown date")
	}

	var month string
	if len(date) == 0 {
		month = dt.Today(dt.YYYYMMDD)
	} else if len(date) > 6 {
		month = date[0:6]
	}

	var filter bson.D
	if len(typ) == 0 || typ == "All" {
		filter = bson.D{
			primitive.E{Key: "$match", Value: bson.D{
				primitive.E{Key: "date", Value: primitive.Regex{Pattern: "^" + month, Options: "m"}},
			}},
		}
	} else {
		filter = bson.D{
			primitive.E{Key: "$match", Value: bson.D{
				primitive.E{Key: "date", Value: primitive.Regex{Pattern: "^" + month, Options: "m"}},
				primitive.E{Key: "type", Value: typ},
			}},
		}
	}

	group := bson.D{
		{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$target_id"},
			{Key: "type", Value: bson.D{{Key: "$first", Value: "$type"}}},
			{Key: "target_id", Value: bson.D{{Key: "$first", Value: "$target_id"}}},
			{Key: "duration", Value: bson.D{{Key: "$sum", Value: "$duration"}}},
		}},
	}

	sort := bson.D{{Key: "$sort", Value: bson.D{{Key: "type", Value: 1}, {Key: "duration", Value: 1}}}}
	pipe := mongo.Pipeline{filter, group, sort}

	var details []act.Activity
	err := mgo.Aggregate(mgo.Acts, pipe, &details)
	if err != nil {
		return nil, err
	}

	for i, a := range details {
		switch a.Type {
		case act.GAMING:
			gameSrv := game.NewService()
			details[i].Title = gameSrv.TitleByID(a.TargetID)
		case act.PROGRAMMING:
			projSrv := project.NewService()
			details[i].Title = projSrv.ByID(a.TargetID).Title
		}
	}
	return details, nil
}

func (s *service) MonthSummary(date string, typ string) []act.Summary {
	var sum []act.Summary

	// Check parameter
	if len(date) < 6 {
		return sum
	}

	var filter bson.D
	if len(typ) == 0 || typ == "All" {
		filter = bson.D{
			primitive.E{Key: "$match", Value: bson.D{
				primitive.E{Key: "date", Value: primitive.Regex{Pattern: "^" + date[0:6], Options: "m"}},
			}},
		}
	} else {
		filter = bson.D{
			primitive.E{Key: "$match", Value: bson.D{
				primitive.E{Key: "date", Value: primitive.Regex{Pattern: "^" + date[0:6], Options: "m"}},
				primitive.E{Key: "type", Value: typ},
			}},
		}
	}

	group := bson.D{
		primitive.E{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$type"},
			{Key: "type", Value: bson.D{{Key: "$first", Value: "$type"}}},
			{Key: "duration", Value: bson.D{
				primitive.E{Key: "$sum", Value: "$duration"}}},
		}},
	}

	pipe := []bson.D{filter, group}
	mgo.Aggregate(mgo.Acts, pipe, &sum)

	for i, v := range sum {
		sum[i].Hour = v.Duration / 60
		sum[i].Min = v.Duration % 60
	}
	return sum
}

func (s *service) TitleByIDAndType(id any, typ act.Type) string {
	switch typ {
	case act.GAMING:
		gameSrv := game.NewService()
		return gameSrv.TitleByID(id)
	case act.PROGRAMMING:
		projSrv := project.NewService()
		return projSrv.ByID(id).Title
	default:
		return ""
	}
}

func (s *service) WeekDetail(date string, typ string) ([]act.Activity, error) {
	if len(date) == 0 {
		return nil, fmt.Errorf("unknown date")
	}

	weekdays := datetime.Weekdays(date)
	filter := bson.D{
		primitive.E{
			Key: "$match",
			Value: bson.D{
				primitive.E{
					Key: "date",
					Value: bson.D{
						primitive.E{
							Key:   "$in",
							Value: weekdays,
						},
					},
				},
			},
		},
	}

	if len(typ) > 0 && typ != "All" {
		filter[0].Value = append(filter[0].Value.(bson.D), primitive.E{Key: "type", Value: typ})
	}

	group := bson.D{
		{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$target_id"},
			{Key: "type", Value: bson.D{{Key: "$first", Value: "$type"}}},
			{Key: "target_id", Value: bson.D{{Key: "$first", Value: "$target_id"}}},
			{Key: "duration", Value: bson.D{{Key: "$sum", Value: "$duration"}}},
		}},
	}

	sort := bson.D{{Key: "$sort", Value: bson.D{{Key: "type", Value: 1}, {Key: "duration", Value: 1}}}}
	pipe := mongo.Pipeline{filter, group, sort}

	var details []act.Activity
	err := mgo.Aggregate(mgo.Acts, pipe, &details)
	if err != nil {
		return nil, err
	}

	for i, a := range details {
		switch a.Type {
		case act.GAMING:
			gameSrv := game.NewService()
			details[i].Title = gameSrv.TitleByID(a.TargetID)
		case act.PROGRAMMING:
			projSrv := project.NewService()
			details[i].Title = projSrv.ByID(a.TargetID).Title
		}
	}
	return details, nil
}

func (s *service) WeekSummary(date string, typ string) []act.Summary {
	var sum []act.Summary

	// Check parameter
	if len(date) < 6 {
		return sum
	}

	weekdays := datetime.Weekdays(date)

	filter := bson.D{
		primitive.E{
			Key: "$match",
			Value: bson.D{
				primitive.E{
					Key: "date",
					Value: bson.D{
						primitive.E{
							Key:   "$in",
							Value: weekdays,
						},
					},
				},
			},
		},
	}

	if len(typ) > 0 && typ != "All" {
		filter[0].Value = append(filter[0].Value.(bson.D), primitive.E{Key: "type", Value: typ})
	}

	group := bson.D{
		primitive.E{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$type"},
			{Key: "type", Value: bson.D{{Key: "$first", Value: "$type"}}},
			{Key: "duration", Value: bson.D{
				primitive.E{Key: "$sum", Value: "$duration"}}},
		}},
	}

	pipe := []bson.D{filter, group}
	mgo.Aggregate(mgo.Acts, pipe, &sum)

	for i, v := range sum {
		sum[i].Hour = v.Duration / 60
		sum[i].Min = v.Duration % 60
	}
	return sum
}

func (s *service) YearDetail(date string, typ string) ([]act.Activity, error) {
	if len(date) == 0 {
		return nil, fmt.Errorf("unknown date")
	}

	var year string
	if len(date) == 0 {
		year = dt.Today(dt.YYYYMMDD)[0:4]
	} else if len(date) > 4 {
		year = date[0:4]
	}

	var filter bson.D
	if len(typ) == 0 || typ == "All" {
		filter = bson.D{
			primitive.E{Key: "$match", Value: bson.D{
				primitive.E{Key: "date", Value: primitive.Regex{Pattern: "^" + year, Options: "m"}},
			}},
		}
	} else {
		filter = bson.D{
			primitive.E{Key: "$match", Value: bson.D{
				primitive.E{Key: "date", Value: primitive.Regex{Pattern: "^" + year, Options: "m"}},
				primitive.E{Key: "type", Value: typ},
			}},
		}
	}

	group := bson.D{
		{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$target_id"},
			{Key: "type", Value: bson.D{{Key: "$first", Value: "$type"}}},
			{Key: "target_id", Value: bson.D{{Key: "$first", Value: "$target_id"}}},
			{Key: "duration", Value: bson.D{{Key: "$sum", Value: "$duration"}}},
		}},
	}

	sort := bson.D{{Key: "$sort", Value: bson.D{{Key: "type", Value: 1}, {Key: "duration", Value: 1}}}}
	pipe := mongo.Pipeline{filter, group, sort}

	var details []act.Activity
	err := mgo.Aggregate(mgo.Acts, pipe, &details)
	if err != nil {
		return nil, err
	}

	for i, a := range details {
		switch a.Type {
		case act.GAMING:
			gameSrv := game.NewService()
			details[i].Title = gameSrv.TitleByID(a.TargetID)
		case act.PROGRAMMING:
			projSrv := project.NewService()
			details[i].Title = projSrv.ByID(a.TargetID).Title
		}
	}
	return details, nil
}

func (s *service) YearSummary(date string, typ string) []act.Summary {
	// result := []bson.M{}
	var sum []act.Summary

	// Check parameter
	if len(date) < 4 {
		return sum
	}

	var filter bson.D
	if len(typ) == 0 || typ == "All" {
		filter = bson.D{
			primitive.E{Key: "$match", Value: bson.D{
				primitive.E{Key: "date", Value: primitive.Regex{Pattern: "^" + date[0:4], Options: "m"}},
			}},
		}
	} else {
		filter = bson.D{
			primitive.E{Key: "$match", Value: bson.D{
				primitive.E{Key: "date", Value: primitive.Regex{Pattern: "^" + date[0:4], Options: "m"}},
				primitive.E{Key: "type", Value: typ},
			}},
		}
	}

	group := bson.D{
		primitive.E{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$type"},
			{Key: "type", Value: bson.D{{Key: "$first", Value: "$type"}}},
			{Key: "duration", Value: bson.D{
				primitive.E{Key: "$sum", Value: "$duration"}}},
		}},
	}

	pipe := []bson.D{filter, group}
	mgo.Aggregate(mgo.Acts, pipe, &sum)

	for i, v := range sum {
		sum[i].Hour = v.Duration / 60
		sum[i].Min = v.Duration % 60
	}
	return sum
}
