package handler

import (
	act_srv "ditto/service/act"
	blog_srv "ditto/service/blog"
	book_srv "ditto/service/book"
	game_srv "ditto/service/game"
	inc_srv "ditto/service/inc"
	proj_srv "ditto/service/project"
	user_srv "ditto/service/user"
)

var (
	ActService  act_srv.Service
	BlogService blog_srv.Service
	BookService book_srv.Service
	GameService game_srv.Service
	IncService  inc_srv.Service
	UserService user_srv.UserService
	ProjService proj_srv.Service
)

func Init() {
	ActService = act_srv.NewService()
	BlogService = blog_srv.NewService()
	BookService = book_srv.NewService()
	GameService = game_srv.NewService()
	IncService = inc_srv.NewService()
	UserService = user_srv.NewUserService()
	ProjService = proj_srv.NewService()
}