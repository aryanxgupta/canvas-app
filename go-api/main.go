package main

import (
	"canvas-backend/api"
	"canvas-backend/internal/db"
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"google.golang.org/genai"
)

func credentials() (*cloudinary.Cloudinary, context.Context) {
	cld, _ := cloudinary.New()
	cld.Config.URL.Secure = true
	ctx := context.Background()

	return cld, ctx
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("ERROR: Unable to load the environment variables, error: %v\n", err)
	}

	DATABASE_URL := os.Getenv("DATABASE_URL")
	if DATABASE_URL == "" {
		log.Fatalln("ERROR: Unable to get the DATABASE_URL")
	}

	GOOGLE_API_KEY := os.Getenv("GOOGLE_API_KEY")
	if GOOGLE_API_KEY == "" {
		log.Fatalln("ERROR: Unable to get the GOOGLE_API_KEY")
	}

	dbpool, err := pgxpool.New(context.Background(), DATABASE_URL)
	cld, _ := credentials()
	if err != nil {
		log.Fatalf("ERROR: Unable to connect to the database, error: %v\n", err)
	}
	defer dbpool.Close()

	if err := dbpool.Ping(context.Background()); err != nil {
		log.Fatalf("ERROR: Unable to ping the database, error: %v\n", err)
	}

	log.Println("SUCCESS: Successfully connected to the database")

	gemini_client, err := genai.NewClient(context.Background(), &genai.ClientConfig{
		APIKey:  GOOGLE_API_KEY,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		log.Fatalf("ERROR: Unable to instantiate the gemini client, error: %v\n", err)
	}

	queries := db.New(dbpool)
	r := api.NewRouter(dbpool, queries, cld, gemini_client)

	server := http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("ERROR: Something went wrong while listening to server, error: %v\n", err)
		}
	}()

	sig_chan := make(chan os.Signal, 1)
	signal.Notify(sig_chan, syscall.SIGINT, syscall.SIGTERM)
	<-sig_chan

	log.Println("INFO: Shutting down server gracefully")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("ERROR: Something went wrong while shutting down, error: %v\n", err)
	}

	log.Println("SUCCESS: Server shutdown complete")
}
