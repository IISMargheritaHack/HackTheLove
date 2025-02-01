package models

type Match struct {
	UserEmail1    string
	UserEmail2    string
	LikeUser1     bool
	LikeUser2     bool
	Compatibility float64
}

type Response struct {
	Email    string
	Response []string
	Sex      bool
}
