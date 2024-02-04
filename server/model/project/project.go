package project

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	// Status
	DEVELOPED  = Status("Developed")
	DEVELOPING = Status("Developing")
	TO_DEVELOP = Status("ToDevelop")

	// Languages
	C           = Language("C")
	C_PP        = Language("C++")
	C_SHARP     = Language("C#")
	DART        = Language("Dart")
	GO          = Language("Go")
	JAVA        = Language("Java")
	JAVA_SCRIPT = Language("JavaScript")
	KOTLIN      = Language("Kotlin")
	PHP         = Language("PHP")
	PYTHON      = Language("Python")
	Ruby        = Language("Ruby")
	Rust        = Language("Rust")
	SWIFT       = Language("Swift")
	TYPE_SCRIPT = Language("TypeScript")
)

type Status string

// Project Model
type Project struct {
	ID        primitive.ObjectID `json:"id" bson:"_id"`
	Title     string             `json:"title" bson:"title"`
	Status    Status             `json:"status" bson:"status"`
	GitHubUrl string             `json:"github_url" bson:"github_url"`
	Languages []Language         `json:"language" bson:"language"`
	TotalTime int                `json:"total_time" bson:"total_time"`
	CreatedAt time.Time          `json:"-" bson:"created_at"`
	UpdatedAt time.Time          `json:"-" bson:"updated_at"`
}

type Detail struct {
	Project Project `json:"project" bson:",inline"`
	Hour    int     `json:"hour"`
	Min     int     `json:"min"`
}

// Return languages
func Languages() []Language {
	return []Language{
		C, C_PP, C_SHARP,
		GO, JAVA, JAVA_SCRIPT,
		KOTLIN, PHP, PYTHON,
		SWIFT, TYPE_SCRIPT,
	}
}

func FormatLanguages(languages []string) []Language {
	var ret []Language
	for _, e := range languages {
		ret = append(ret, Language(e))
	}
	return ret
}

// Types
type Language string
