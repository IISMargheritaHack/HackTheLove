package routes

import (
	"github.com/gin-gonic/gin"
)

func registerProtectedRoutes(r *gin.RouterGroup, h *Handler) {
	r.GET("/getUser", h.GetUser)
	r.GET("/getSurvey", h.GetSurvey)
	r.GET("/getPhoto", h.GetPhoto)
	r.GET("/getMatches", h.GetMatches)

	r.POST("/addSurvey", h.AddSurvey)
	r.POST("/addPhoto", h.AddPhoto)
	r.POST("/addUserInfo", h.AddUserInfo)
	r.POST("/setLike", h.SetLike)
}
