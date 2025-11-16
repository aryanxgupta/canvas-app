package api

import (
	"canvas-backend/handlers"
	"canvas-backend/internal/db"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"google.golang.org/genai"
)

func NewRouter(pool *pgxpool.Pool, queries *db.Queries, cld *cloudinary.Cloudinary, gemini_client *genai.Client) *chi.Mux {
	h := handlers.New(pool, queries, cld, gemini_client)

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Get("/ping", h.PingHandler)
	r.Get("/brand-kit/{kit_id}", h.HandleGetBrandKit)
	r.Post("/upload-logo", h.HandleUploadLogo)
	r.Post("/upload-product", h.HandleUploadProductImage)
	r.Post("create-brand-kit", h.HandleCreateBrandKit)
	r.Post("export-image", h.HandleExport)

	return r
}
