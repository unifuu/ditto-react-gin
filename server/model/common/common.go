package common

type Status string

const (
	DONE  = Status("Done")
	DOING = Status("Doing")
	TODO  = Status("Todo")
)

type Badge struct {
	Done  int `json:"done"`
	Doing int `json:"doing"`
	Todo  int `json:"todo"`
}
