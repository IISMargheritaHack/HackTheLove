package internal

type User struct {
	Email      string `json:"email" validate:"required,email,email_host"`
	FamilyName string `json:"family_name"  validate:"required"`
	GivenName  string `json:"given_name"  validate:"required"`
}

type UserInfo struct {
	Phone   string `json:"phone"  validate:"required,e164"`
	Bio     string `json:"bio"  validate:"required"`
	Age     int    `json:"age"  validate:"required"`
	Section string `json:"section"  validate:"required"`
	Sex     bool   `json:"sex"  validate:"required"`
}

type CompleteUser struct {
	User     User     `json:"user"`
	UserInfo UserInfo `json:"user_info"`
}

type Survey struct {
	IdSurvey string `json:"id_survey"`
	Response string `json:"response" validate:"required"`
}

type Question struct {
	ID       int        `json:"id"`
	Question string     `json:"question"`
	Options  [][]string `json:"options"`
	Weight   float64    `json:"weight"`
}

type Questions struct {
	Questions []Question `json:"questions"`
}
