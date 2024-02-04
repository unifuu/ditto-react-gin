package format

import (
	"fmt"
	"strings"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Transform ObjectIdHex to ObjectId
func ToObjID(hex string) primitive.ObjectID {
	objID, _ := primitive.ObjectIDFromHex(hex)
	return objID
}

func Percentage(num, den int) string {
	ret := fmt.Sprintf("%.1f", (float64(num)/float64(den)*100)) + "%"

	// Format 0% and 100%
	if ret == "0.0%" {
		ret = "0%"
	}
	if ret == "100.0%" {
		ret = "100%"
	}

	return ret
}

func StringToSlice(s string) []string {
	var results []string
	if strings.Contains(s, ",") {
		results = strings.Split(s, ",")
	} else {
		results = append(results, s)
	}
	return results
}
