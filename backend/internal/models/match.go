package models

type Match struct {
	UserEmail        string
	UserEmailMatched string
	Compatibility    float64
}

type Response struct {
	Email    string
	Response []string
	Sex      bool
}
