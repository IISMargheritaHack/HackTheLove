package internal

import "database/sql"

type User struct {
	Email      string `json:"email" validate:"required,email,email_host"`
	FamilyName string `json:"family_name"  validate:"required"`
	GivenName  string `json:"given_name"  validate:"required"`
}

type UserInfo struct {
	Phone   sql.NullString `json:"phone"  validate:"required,e164"`
	Bio     sql.NullString `json:"bio"  validate:"required"`
	Age     sql.NullInt16  `json:"age"  validate:"required"`
	Section sql.NullString `json:"section"  validate:"required"`
	Sex     sql.NullBool   `json:"sex"  validate:"required"`
}

type CompleteUser struct {
	User     User     `json:"user"`
	UserInfo UserInfo `json:"user_info"`
}
