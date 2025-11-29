package types

import (
	"canvas-backend/internal/db"
	"encoding/json"
)

type APIResponse struct {
	Message string `json:"message"`
	Data    any    `json:"data"`
}

type BrandKitAndImagesResponse struct {
	BrandKit db.BrandKit       `json:"brand_kit"`
	Images   []db.ProductImage `json:"product_images"`
}

type BrandKitResponse struct {
	Brandkits []db.BrandKit `json:"brand_kit"`
}

type ImageUploadResponse struct {
	URL string `json:"url"`
}

type BrandKitRequest struct {
	Name       string          `json:"name"`
	ColorsJson json.RawMessage `json:"colors_json"`
	LogoURL    string          `json:"logo_url"`
	Images     []string        `json:"image_urls"`
	RulesText  string          `json:"rules_text"`
}

type ExportRequest struct {
	URL string `json:"url"`
}

type ExportResponse struct {
	URL string `json:"url"`
}

type GenerateLayoutRequest struct {
	Prompt string `json:"prompt"`
	Format string `json:"format"`
}

type TemporaryResponse struct {
	KitInfo   db.BrandKit       `json:"kit_info"`
	Prompt    string            `json:"prompt"`
	Format    string            `json:"format"`
	ImageInfo map[string]string `json:"image_info"`
}

type JsonRequest struct {
	UserPrompt        string
	Colors            any
	Logo              string
	ImageDescriptions map[string]string
	ImageURLs         []string
}
