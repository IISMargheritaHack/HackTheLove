package models

type Question struct {
	ID       int      `json:"id"`
	Question string   `json:"question"`
	Options  []string `json:"options"`
	Values   []string `json:"values"`
	Weight   float32  `json:"weight"`
}

type Questions struct {
	Questions []Question `json:"questions"`
}
