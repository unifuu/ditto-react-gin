package todo

type Todo struct {
	ID        string `json:"id"`
	Content   string `json:"content"`
	Deadline  string `json:"deadline"`
	IsChecked bool   `json:"is_checked"`
}
