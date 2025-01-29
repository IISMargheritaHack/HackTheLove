package models

type Survey struct {
	IdSurvey string `json:"id_survey"`
	Response string `json:"response" validate:"required"`
}
