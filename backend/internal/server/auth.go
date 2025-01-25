package server

import (
	"encoding/json"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

type User struct {
	Audience      string `json:"aud"`            // The client identifier for whom the token was issued
	Issuer        string `json:"iss"`            // The URL of the token issuer
	Email         string `json:"email"`          // User's email address
	EmailVerified bool   `json:"email_verified"` // Indicates if the email address is verified
	FamilyName    string `json:"family_name"`    // User's last name
	GivenName     string `json:"given_name"`     // User's first name
	HD            string `json:"hd"`             // Host domain (Google Workspace domain, if any)
	ExpiresAt     int64  `json:"exp"`            // Token expiration timestamp (in seconds since epoch)
	IssuedAt      int64  `json:"iat"`            // Token issue timestamp (in seconds since epoch)
	NotBefore     int64  `json:"nbf"`            // Token not valid before this timestamp
	JTI           string `json:"jti"`            // Unique token identifier
	Name          string `json:"name"`           // Full name of the user
	Picture       string `json:"picture"`        // URL of the user's profile picture
	Subject       string `json:"sub"`            // Unique user identifier for the token subject
}

func parseJWT(tokenString string) (*User, error) {
	token, _, err := jwt.NewParser().ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		claimsJSON, err := json.Marshal(claims)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal claims to JSON: %v", err)
		}

		var user User
		err = json.Unmarshal(claimsJSON, &user)
		if err != nil {
			return nil, fmt.Errorf("failed to unmarshal claims to User struct: %v", err)
		}

		return &user, nil
	}

	return nil, fmt.Errorf("unable to parse claims")
}
