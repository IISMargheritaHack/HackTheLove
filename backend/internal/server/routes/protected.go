package routes

import (
	"backend/internal/server/middleware"

	"github.com/gin-gonic/gin"
)

func registerProtectedRoutes(r *gin.RouterGroup, h *Handler) {
	r.GET("/getUser", h.GetUser)
	r.GET("/getUserByParams", h.GetUserByParams)
	r.GET("/getSurvey", h.GetSurvey)
	r.GET("/getPhoto", h.GetPhoto)
	r.GET("/getPhotoByParams", h.GetPhotoByParams)
	r.GET("/getMatches", h.GetMatches)

	r.POST("/addSurvey", middleware.TimeRestrictionMiddleware(), h.AddSurvey)
	r.POST("/addPhoto", middleware.TimeRestrictionMiddleware(), h.AddPhoto)
	r.POST("/addUserInfo", middleware.TimeRestrictionMiddleware(), h.AddUserInfo)
	r.POST("/setLike", middleware.TimeRestrictionMiddleware(), h.SetLike)
}
