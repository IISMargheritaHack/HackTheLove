package models

type Match struct {
	UserEmail1    string  `json:"user_email1"`
	UserEmail2    string  `json:"user_email2"`
	LikeUser1     int     `json:"like_user1"`
	LikeUser2     int     `json:"like_user2"`
	Compatibility float64 `json:"compatibility"`
}

type Response struct {
	Email    string   `json:"email"`
	Response []string `json:"response"`
	Sex      bool     `json:"sex"`
}
