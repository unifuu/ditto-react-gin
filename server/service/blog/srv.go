package blog

import (
	"ditto/db/mgo"
	"ditto/model/blog"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct{}

type Service interface {
	AllPosts() []blog.Post
	AllTags() ([]blog.Tag, error)
	PostByID(id string) blog.Post
	TagByID(id any) blog.Tag
	TagByName(name string) blog.Tag
	TagsByIDs(id []string) []blog.Tag
	TagsByNames(names []string) []blog.Tag
	PostsByPage(page, limit int) ([]blog.Post, int)
	PostsByPageTag(page int, tag string, limit int) ([]blog.Post, int)
	CreatePost(p blog.Post) error
	CreateTag(t blog.Tag) error
	DeletePost(id string) error
	DeleteTag(id any) error
	UpdatePost(p blog.Post) error
	UpdateTag(t blog.Tag) error
}

func NewService() Service {
	return &service{}
}

// Get tags of the post
func tagsByPostID(id any) []blog.Tag {
	var post blog.Post
	mgo.FindID(mgo.Blogs, id).Decode(&post)

	tags := []blog.Tag{}
	for _, tid := range post.TagIDs {
		var tag blog.Tag
		mgo.FindID(mgo.Tags, tid).Decode(&tag)
		tags = append(tags, tag)
	}
	return tags
}

func (s *service) AllPosts() []blog.Post {
	var posts []blog.Post
	mgo.FindMany(mgo.Blogs, &posts, bson.D{}, bson.D{})
	return posts
}

func (s *service) AllTags() ([]blog.Tag, error) {
	var tags []blog.Tag
	err := mgo.FindMany(mgo.Tags, &tags, bson.D{}, bson.D{})
	return tags, err
}

func (s *service) CreatePost(p blog.Post) error {
	p.ID = primitive.NewObjectIDFromTimestamp(time.Now())
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()

	return mgo.Insert(mgo.Blogs, p)
}

func (s *service) CreateTag(t blog.Tag) error {
	t.ID = primitive.NewObjectIDFromTimestamp(time.Now())
	t.CreatedAt = time.Now()
	t.UpdatedAt = time.Now()

	return mgo.Insert(mgo.Tags, t)
}

func (s *service) DeletePost(id string) error {
	err := mgo.DeleteID(mgo.Blogs, id)
	if err != nil {
		return err
	}
	return nil
}

func (s *service) DeleteTag(id any) error {
	err := mgo.DeleteID(mgo.Tags, id)
	if err != nil {
		return err
	}
	return nil
}

func (s *service) PostByID(id string) blog.Post {
	var post blog.Post
	mgo.FindID(mgo.Blogs, id).Decode(&post)

	var tags []blog.Tag
	for _, id := range post.TagIDs {
		tags = append(tags, s.TagByID(id))
	}
	post.Tags = tags
	return post
}

func (s *service) PostsByPage(page int, limit int) ([]blog.Post, int) {
	var posts []blog.Post

	sort := bson.D{
		primitive.E{Key: "is_pinned", Value: -1},
		primitive.E{Key: "created_at", Value: -1},
	}
	totalPages, err := mgo.FindPage(mgo.Blogs, &posts, bson.D{}, page, limit, sort)
	if err != nil {
		return nil, 1
	}

	for i, p := range posts {
		posts[i].Tags = tagsByPostID(p.ID)
	}

	return posts, totalPages
}

func (s *service) PostsByPageTag(page int, tagName string, limit int) ([]blog.Post, int) {
	var posts []blog.Post
	tag := s.TagByName(tagName)
	tags := []primitive.ObjectID{tag.ID}

	filter := bson.D{primitive.E{Key: "tag_ids", Value: bson.D{primitive.E{Key: "$in", Value: tags}}}}
	sort := bson.D{
		primitive.E{Key: "is_pinned", Value: -1},
		primitive.E{Key: "created_at", Value: -1},
	}
	totalPages, err := mgo.FindPage(mgo.Blogs, &posts, filter, page, limit, sort)
	if err != nil {
		return nil, 1
	}

	for i, p := range posts {
		posts[i].Tags = tagsByPostID(p.ID)
	}

	return posts, totalPages
}

func (s *service) TagByID(id any) blog.Tag {
	var tag blog.Tag
	result := mgo.FindID(mgo.Tags, id)
	result.Decode(&tag)
	return tag
}

func (s *service) TagsByIDs(ids []string) []blog.Tag {
	var tags []blog.Tag
	for _, id := range ids {
		tags = append(tags, s.TagByID(id))
	}
	return tags
}

func (s *service) TagByName(name string) blog.Tag {
	var tag blog.Tag
	filter := bson.D{primitive.E{Key: "name", Value: name}}
	result := mgo.FindOne(mgo.Tags, filter)
	result.Decode(&tag)
	return tag
}

func (s *service) TagsByNames(names []string) []blog.Tag {
	var tags []blog.Tag
	for _, name := range names {
		tags = append(tags, s.TagByName(name))
	}
	return tags
}

func (s *service) UpdatePost(p blog.Post) error {
	update := bson.D{primitive.E{
		Key: "$set", Value: bson.D{
			primitive.E{Key: "title", Value: p.Title},
			primitive.E{Key: "preview", Value: p.Preview},
			primitive.E{Key: "content", Value: p.Content},
			primitive.E{Key: "tag_ids", Value: p.TagIDs},
			primitive.E{Key: "is_pinned", Value: p.IsPinned},
			primitive.E{Key: "updated_at", Value: time.Now()},
		}},
	}
	return mgo.Update(mgo.Blogs, p.ID, update)
}

func (s *service) UpdateTag(t blog.Tag) error {
	update := bson.D{primitive.E{
		Key: "$set", Value: bson.D{
			primitive.E{Key: "title", Value: t.Name},
			primitive.E{Key: "color", Value: t.Color},
			primitive.E{Key: "updated_at", Value: time.Now()},
		}},
	}
	return mgo.Update(mgo.Tags, t.ID, update)
}
