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

type ComplianceInfo struct {
	Headline           string         `json:"headline"`
	Subhead            string         `json:"subhead"`
	CreativeMode       string         `json:"creative_mode"`
	Format             string         `json:"format"`
	ValueTile          *ValueTileInfo `json:"value_tile"`
	IsAlcoholPromotion bool           `json:"is_alcohol_promotion"`
	HasPeople          bool           `json:"has_people"`
	IsExclusive        bool           `json:"is_exclusive_product"`
	TescoFinalTag      string         `json:"tesco_final_tag"`
}

type ValueTileInfo struct {
	Type         string `json:"type"` // "clubcard", "white", "new"
	WhitePrice   string `json:"white_price"`
	OfferPrice   string `json:"offer_price"`
	RegularPrice string `json:"regular_price"`
	EndDate      string `json:"end_date"`
}

type RulesData struct {
	Prompt     string         `json:"prompt"`
	Tone       string         `json:"tone"`
	Style      string         `json:"style"`
	Tagline    string         `json:"tagline"`
	Compliance ComplianceInfo `json:"compliance"`
	TescoRules string         `json:"tesco_rules"`
}
