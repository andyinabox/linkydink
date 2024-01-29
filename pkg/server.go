package pkg

import (
	"embed"
	"fmt"
	"html/template"
	"io/fs"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type ServerConfig struct {
	Res           embed.FS
	Port          string
	Host          string
	TemplatesGlob string
}

type Server struct {
	conf      *ServerConfig
	templates *template.Template
}

// nice
func NewServer(conf *ServerConfig) *Server {
	templates, err := template.ParseFS(conf.Res, conf.TemplatesGlob)
	if err != nil {
		panic(err)
	}
	return &Server{conf, templates}
}

func (s *Server) Run() error {
	router := mux.NewRouter()

	router.HandleFunc("/", s.GetIndex).Methods(http.MethodGet)
	// router.HandleFunc("/main.css", s.GetMainCss).Methods(http.MethodGet)
	// router.HandleFunc("/main.js", s.GetMainJs).Methods(http.MethodGet)

	embeddedFiles, err := fs.Sub(fs.FS(s.conf.Res), "res")
	if err != nil {
		return err
	}
	router.PathPrefix("/public/").Handler(http.FileServer(http.FS(embeddedFiles)))

	http.Handle("/", router)

	fmt.Printf("Running server on %s:%s", s.conf.Host, s.conf.Port)
	srv := &http.Server{
		Handler: router,
		Addr:    fmt.Sprintf("%s:%s", s.conf.Host, s.conf.Port),
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	return srv.ListenAndServe()
}
