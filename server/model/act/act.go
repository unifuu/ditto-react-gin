package act

import (
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	GAMING      = Type("Gaming")
	PROGRAMMING = Type("Programming")
	READING     = Type("Reading")
)

type Type string

// Activity struct
type Activity struct {
	ID        primitive.ObjectID `json:"id" bson:"_id"`
	Type      Type               `json:"type" bson:"type"`
	Date      string             `json:"date" bson:"date"`         // 20060405
	Start     string             `json:"start" bson:"start"`       // 150304
	End       string             `json:"end" bson:"end"`           // 150304
	Duration  int                `json:"duration" bson:"duration"` // 61
	TargetID  primitive.ObjectID `json:"target_id" bson:"target_id,omitempty"`
	CreatedAt time.Time          `json:"-" bson:"created_at"`
	UpdatedAt time.Time          `json:"-" bson:"updated_at"`

	Title string `json:"title" bson:"title,omitempty"`
}

// type Summ struct {
// 	Duration int `json:"duration"`
// 	Hour     int `json:"hour"`
// 	Min      int `json:"min"`
// }

type Summary struct {
	Type     string `json:"type"`
	Duration int    `json:"duration"`
	Hour     int    `json:"hour"`
	Min      int    `json:"min"`
}

type StopWatch struct {
	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
	Duration  int       `json:"duration"`

	Type        Type   `json:"type"`
	TargetID    string `json:"target_id"`
	TargetTitle string `json:"target_title"`
}

func NewStopWatch(typ Type, id, title string) *StopWatch {
	return &StopWatch{
		StartTime:   time.Time{},
		EndTime:     time.Time{},
		Duration:    0,
		Type:        Type(typ),
		TargetID:    id,
		TargetTitle: title,
	}
}

func (sw *StopWatch) Start() error {
	if len(sw.Type) == 0 || len(sw.TargetID) == 0 {
		return fmt.Errorf("Type and TargetID cannot be empty")
	}
	sw.StartTime = time.Now()
	return nil
}

// / Set *stopwatch to nil and return end time
func (sw *StopWatch) Stop() time.Time {
	sw.EndTime = time.Now()
	sw.Duration = int(sw.EndTime.Sub(sw.StartTime).Minutes())
	endTime := sw.EndTime
	return endTime
}
