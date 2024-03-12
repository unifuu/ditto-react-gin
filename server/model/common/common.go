package common

type Status int

const (
	DONE  = Status(1)
	DOING = Status(0)
	TODO  = Status(-1)
)

type Badge struct {
	Done  int `json:"done"`
	Doing int `json:"doing"`
	Todo  int `json:"todo"`
}

func ToStatus(status string) Status {
	switch status {
	case "-1":
		return TODO
	case "0":
		return DOING
	case "1":
		return DONE
	default:
		return DOING
	}
}
