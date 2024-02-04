package book

import (
	"ditto/db/mgo"
	"ditto/model/book"
	"ditto/util/format"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct{}

type Service interface {
	All() []book.Book
	Badge() book.Badge
	ByID(id any) book.Book
	ByStatus(status book.Status) []book.Book
	Create(book.Book) error
	CreateLog(id any, log book.Log) error
	Delete(id any) error
	// Details(id any) []book.Detail
	PageByStatus(status book.Status, page, limit int) ([]book.Book, int)
	Update(book.Book) error
}

func NewService() Service {
	return &service{}
}

func (s *service) All() []book.Book {
	var books []book.Book
	mgo.FindMany(mgo.Books, &books, bson.D{}, bson.D{})
	return books
}

func (s *service) ByStatus(status book.Status) []book.Book {
	var filter bson.D
	var books []book.Book
	filter = bson.D{primitive.E{Key: "status", Value: status}}
	sort := bson.D{primitive.E{Key: "title", Value: 1}}
	mgo.FindMany(mgo.Books, &books, filter, sort)
	return books
}

func (s *service) Badge() book.Badge {
	readCnt := countStatus(book.READ)
	readingCnt := countStatus(book.READING)
	toReadCnt := countStatus(book.TO_READ)

	return book.Badge{
		Read:    readCnt,
		Reading: readingCnt,
		ToRead:  toReadCnt,
	}
}

func (s *service) ByID(id any) book.Book {
	var b book.Book
	mgo.FindID(mgo.Books, id).Decode(&b)
	return b
}

func (s *service) Create(b book.Book) error {
	b.ID = primitive.NewObjectIDFromTimestamp(time.Now())
	b.CreatedAt = time.Now()
	b.UpdatedAt = time.Now()
	return mgo.Insert(mgo.Books, b)
}

func (s *service) CreateLog(id any, log book.Log) error {
	b := s.ByID(id)
	b.Logs = append(b.Logs, log)

	update := bson.D{primitive.E{
		Key: "$set", Value: bson.D{
			primitive.E{Key: "logs", Value: b.Logs},
			primitive.E{Key: "updated_at", Value: time.Now()},
		}},
	}
	return mgo.Update(mgo.Books, b.ID, update)
}

func (s *service) Delete(id any) error {
	err := mgo.DeleteID(mgo.Books, id)
	if err != nil {
		return err
	}
	return nil
}

func (s *service) PageByStatus(status book.Status, page, limit int) ([]book.Book, int) {
	var filter bson.D

	// Check status
	if len(status) != 0 {
		filter = bson.D{primitive.E{Key: "status", Value: status}}
	} else {
		// If empty then set status to "Reading"
		filter = bson.D{primitive.E{Key: "status", Value: book.READING}}
	}

	var books []book.Book
	sort := bson.D{primitive.E{Key: "title", Value: 1}}
	totalPages, err := mgo.FindPage(mgo.Books, &books, filter, page, limit, sort)
	if err != nil {
		return nil, 1
	}

	for i, b := range books {
		books[i].Hour = b.TotalTime / 60
		books[i].Min = b.TotalTime % 60
		books[i].PageProgress = fmt.Sprintf("%v", b.CurrentPage) + " / " + fmt.Sprintf("%v", b.TotalPage)
		books[i].PagePercentage = format.Percentage(b.CurrentPage, b.TotalPage)
	}
	return books, totalPages
}

func (s *service) Update(b book.Book) error {
	update := bson.D{primitive.E{
		Key: "$set", Value: bson.D{
			primitive.E{Key: "title", Value: b.Title},
			primitive.E{Key: "author", Value: b.Author},
			primitive.E{Key: "genre", Value: b.Genre},
			primitive.E{Key: "cur_page", Value: b.CurrentPage},
			primitive.E{Key: "total_page", Value: b.TotalPage},
			primitive.E{Key: "publisher", Value: b.Publisher},
			primitive.E{Key: "pub_year", Value: b.PubYear},
			primitive.E{Key: "status", Value: b.Status},
			primitive.E{Key: "total_time", Value: b.TotalTime},
			primitive.E{Key: "logs", Value: b.Logs},
			primitive.E{Key: "updated_at", Value: time.Now()},
		}},
	}
	return mgo.Update(mgo.Books, b.ID, update)
}

func countStatus(status book.Status) int {
	filter := bson.D{primitive.E{Key: "status", Value: status}}
	cnt, _ := mgo.Count(mgo.Books, filter)
	return int(cnt)
}
