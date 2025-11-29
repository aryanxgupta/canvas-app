package handlers

import (
	"canvas-backend/internal/db"
	"canvas-backend/types"
	"canvas-backend/util"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"google.golang.org/genai"
)

type APIState struct {
	Pool         *pgxpool.Pool
	Queries      *db.Queries
	Cld          *cloudinary.Cloudinary
	GeminiClient *genai.Client
}

func New(pool *pgxpool.Pool, queries *db.Queries, cld *cloudinary.Cloudinary, gemini_client *genai.Client) *APIState {
	return &APIState{
		Pool:         pool,
		Queries:      queries,
		Cld:          cld,
		GeminiClient: gemini_client,
	}
}

func (h *APIState) PingHandler(w http.ResponseWriter, r *http.Request) {
	response := types.APIResponse{
		Message: "Pong",
		Data:    nil,
	}
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func (h *APIState) HandleGetBrandKit(w http.ResponseWriter, r *http.Request) {
	kit_id := chi.URLParam(r, "kit_id")

	var kit_uuid pgtype.UUID
	err := kit_uuid.Scan(kit_id)

	response := types.APIResponse{}
	w.Header().Add("Content-Type", "application/json")

	if err != nil {
		response.Message = "ERROR: Cannot parse the uuid from the URL"
		w.WriteHeader(http.StatusBadRequest)
		response.Data = nil
		json.NewEncoder(w).Encode(response)
		log.Printf("ERROR: Cannot parse the uuid from the URL, error: %v\n", err)
		return
	}

	kit, err := h.Queries.GetBrandKit(r.Context(), kit_uuid)
	if err != nil {
		response.Data = nil
		if errors.Is(err, sql.ErrNoRows) {
			response.Message = "ERROR: No kits found"
			w.WriteHeader(http.StatusBadRequest)
			log.Printf("ERROR: No kits found, error: %v\n", err)
		} else {
			response.Message = "ERROR: Something went wrong"
			w.WriteHeader(http.StatusInternalServerError)
			log.Printf("ERROR: Something went wrong while fetching brandkits for id %v, error: %v\n", kit_id, err)

		}
		json.NewEncoder(w).Encode(response)
		return
	}

	images, err := h.Queries.ListProductImagesForBrandKit(r.Context(), kit_uuid)
	if err != nil {
		response.Data = nil
		response.Message = "ERROR: Something went wrong"
		w.WriteHeader(http.StatusInternalServerError)
		log.Printf("ERROR: Something went wrong while fetching brandkits for id %v, error: %v\n", kit_id, err)
		json.NewEncoder(w).Encode(response)
		return
	}

	brand_kit_response := types.BrandKitAndImagesResponse{
		BrandKit: kit,
		Images:   images,
	}

	log.Println("SUCCESS: successfully fetched the brandkit")
	response.Message = "SUCCESS: successfully fetched the brandkit"
	response.Data = brand_kit_response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func (h *APIState) HandleListBrandKits(w http.ResponseWriter, r *http.Request) {
	kits, err := h.Queries.ListBrandKits(r.Context())

	response := types.APIResponse{}
	w.Header().Add("Content-Type", "application/json")

	if err != nil {
		response.Data = nil
		response.Message = "ERROR: Something went wrong"
		w.WriteHeader(http.StatusInternalServerError)
		log.Printf("ERROR: Something went wrong while fetching brandkits, error: %v\n", err)
		json.NewEncoder(w).Encode(response)
		return
	}

	brand_kit_response := types.BrandKitResponse{
		Brandkits: kits,
	}

	log.Println("SUCCESS: Successfully fetched the brandkits")
	response.Message = "SUCCESS: Successfully fetched the brandkits"
	response.Data = brand_kit_response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func (h *APIState) HandleUploadLogo(w http.ResponseWriter, r *http.Request) {
	response := types.APIResponse{}
	response.Data = nil
	w.Header().Add("Content-Type", "application/json")

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		log.Printf("ERROR: Unable to parse the multipart form, error: %v\n", err)
		response.Message = "ERROR: File too large (max 10MB allowed)"
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	file, header, err := r.FormFile("logo_file")
	if err != nil {
		log.Printf("ERROR: Failed to get the logo_file, error: %v\n", err)
		response.Message = "ERROR: Failed to get the logo_file"
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}
	defer file.Close()

	resp, err := h.Cld.Upload.Upload(r.Context(), file, uploader.UploadParams{
		PublicID:          header.Filename,
		BackgroundRemoval: "cloudinary_ai",
		Format:            "png",
	})

	if err != nil {
		log.Printf("ERROR: Unable to upload the logo_file to cloudinary server, error: %v\n", err)
		response.Message = "ERROR: Unable to upload the file"
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	logo_upload_response := types.ImageUploadResponse{
		URL: resp.SecureURL,
	}

	log.Println("SUCCESS: Successfully uploaded the logo_file to cloudinary")
	response.Message = "SUCCESS: Successfully uploaded the file to cloudinary"
	response.Data = logo_upload_response
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (h *APIState) HandleUploadProductImage(w http.ResponseWriter, r *http.Request) {
	response := types.APIResponse{}
	response.Data = nil
	w.Header().Add("Content-Type", "application/json")

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		log.Printf("ERROR: Unable to parse the multipart form, error: %v\n", err)
		response.Message = "ERROR: File too large (max 10MB allowed)"
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	file, header, err := r.FormFile("product_file")
	if err != nil {
		log.Printf("ERROR: Failed to get the product_file, error: %v\n", err)
		response.Message = "ERROR: Failed to get the product_file"
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}
	defer file.Close()

	resp, err := h.Cld.Upload.Upload(r.Context(), file, uploader.UploadParams{
		PublicID:          header.Filename,
		BackgroundRemoval: "cloudinary_ai",
		Format:            "png",
	})

	if err != nil {
		log.Printf("ERROR: Unable to upload the product_file to cloudinary server, error: %v\n", err)
		response.Message = "ERROR: Unable to upload the file"
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	product_image_upload_response := types.ImageUploadResponse{
		URL: resp.SecureURL,
	}
	log.Println("SUCCESS: Successfully uploaded the product image to cloudinary")
	response.Message = "SUCCESS: Successfully uploaded the file to cloudinary"
	response.Data = product_image_upload_response
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (h *APIState) HandleCreateBrandKit(w http.ResponseWriter, r *http.Request) {
	response := types.APIResponse{}
	response.Data = nil
	w.Header().Add("Content-Type", "application/json")

	request_body := types.BrandKitRequest{}

	err := json.NewDecoder(r.Body).Decode(&request_body)
	if err != nil {
		log.Printf("ERROR: Unable to parse the request body, error: %v\n", err)
		response.Message = "ERROR: Unable to parse the request body"
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	var rules_text pgtype.Text
	rules_text.String = request_body.RulesText
	if request_body.RulesText != "" {
		rules_text.Valid = true
	}

	var logo_url pgtype.Text
	logo_url.String = request_body.LogoURL
	if request_body.LogoURL != "" {
		logo_url.Valid = true
	}

	tx, err := h.Pool.Begin(r.Context())
	if err != nil {
		log.Printf("ERROR: Failed to start the sql transaction, error: %v\n", err)
		response.Message = "ERROR: Something went wrong"
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}
	defer tx.Rollback(r.Context())

	qtx := h.Queries.WithTx(tx)

	brand_kit, err := qtx.CreateBrandKit(r.Context(), db.CreateBrandKitParams{
		Name:       request_body.Name,
		ColorsJson: request_body.ColorsJson,
		RulesText:  rules_text,
		LogoUrl:    logo_url,
	})

	if err != nil {
		log.Printf("ERROR: Something went wrong while creating brandkit, error: %v\n", err)
		response.Message = "ERROR: Something went wrong"
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	log.Println("SUCCESS: Successfully created the brandkit")
	for _, image_url := range request_body.Images {
		var image_name pgtype.Text
		_, err := qtx.CreateProductImage(r.Context(), db.CreateProductImageParams{
			BrandKitID: brand_kit.ID,
			ImageUrl:   image_url,
			ImageName:  image_name,
		})

		if err != nil {
			log.Printf("ERROR: Something went wrong while creating new product image, error: %v\n", err)
			response.Message = "ERROR: Something went wrong"
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(response)
			return
		}
	}

	if err := tx.Commit(r.Context()); err != nil {
		log.Printf("ERROR: Failed to commit the sql transaction, error: %v\n", err)
		response.Message = "ERROR: Something went wrong"
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}
	brand_kits := []db.BrandKit{brand_kit}

	log.Println("SUCCESS: Successfully created the product images")
	response.Message = "SUCCESS: Successfully created the product images"
	response.Data = types.BrandKitResponse{
		Brandkits: brand_kits,
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (h *APIState) HandleExport(w http.ResponseWriter, r *http.Request) {
	response := types.APIResponse{}
	response.Data = nil
	w.Header().Add("Content-Type", "application/json")

	var request_body types.ExportRequest
	err := json.NewDecoder(r.Body).Decode(&request_body)

	if err != nil {
		log.Printf("ERROR: Unable to parse the request body, error: %v\n", err)
		response.Message = "ERROR: Unable to parse the request body"
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	resp, err := h.Cld.Upload.Upload(r.Context(), request_body.URL, uploader.UploadParams{})
	if err != nil {
		log.Printf("ERROR: Unable to upload the exported image to cloudinary server, error: %v\n", err)
		response.Message = "ERROR: Unable to upload the exported image"
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	log.Println("SUCCESS: Successfully uploaded the exported image to cloudinary")
	response.Message = "SUCCESS: Successfully uploaded the exported image to cloudinary"
	response.Data = types.ExportResponse{URL: resp.SecureURL}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (h *APIState) HandleGenerateLayout(w http.ResponseWriter, r *http.Request) {
	response := types.APIResponse{}
	response.Data = nil
	w.Header().Add("Content-Type", "application/json")

	kit_id := chi.URLParam(r, "kit_id")
	if kit_id == "" {
		log.Printf("ERROR: Invalid kit id (empty), error: nil\n")
		response.Message = "ERROR: Invalid kit id (empty)"
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	var kit_uuid pgtype.UUID
	err := kit_uuid.Scan(kit_id)

	if err != nil {
		log.Printf("ERROR: Unable to kit id to uuid, error: %v\n", err)
		response.Message = "ERROR: Invalid kit id"
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	kit, err := h.Queries.GetBrandKit(r.Context(), kit_uuid)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			log.Printf("ERROR: No kits found, error: %v\n", err)
			response.Message = "ERROR: No kits found with this id"
			w.WriteHeader(http.StatusBadRequest)
		} else {
			response.Message = "ERROR: Something went wrong"
			log.Printf("ERROR: Something went wrong while fetching brandkits for id %v, error: %v\n", kit_id, err)
			w.WriteHeader(http.StatusInternalServerError)
		}
		json.NewEncoder(w).Encode(response)
		return
	}

	images, err := h.Queries.ListProductImagesForBrandKit(r.Context(), kit_uuid)
	if err != nil {
		log.Printf("ERROR: Something went wrong while fetching images for id %v, error: %v\n", kit_id, err)
		response.Message = "ERROR: Something went wrong"
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}
	if images == nil {
		images = []db.ProductImage{}
	}

	image_descriptions := make(map[string]string)

	for _, image := range images {
		description, err := h.getImageDescription(r.Context(), image.ImageUrl)
		if err != nil {
			log.Printf("ERROR: Unable to describe the image, error: %v\n", err)
			description = "A product image"
		}
		image_descriptions[image.ImageUrl] = description
	}

	var ImageUrlArray []string
	for _, image := range images {
		ImageUrlArray = append(ImageUrlArray, image.ImageUrl)
	}

	json_request := types.JsonRequest{
		UserPrompt:        kit.RulesText.String,
		Colors:            kit.ColorsJson,
		Logo:              kit.LogoUrl.String,
		ImageDescriptions: image_descriptions,
		ImageURLs:         ImageUrlArray,
	}

	result, err := h.getFabricJSON(r.Context(), json_request)
	if err != nil {
		log.Printf("ERROR: Unable to generate the fabric json")
		response.Message = "ERROR: Something went wrong"
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	var resultObj map[string]interface{}
	for k, v := range image_descriptions {
		fmt.Println(k, " ", v)
	}

	if err := json.Unmarshal([]byte(result), &resultObj); err != nil {
		log.Printf("ERROR: Unable to parse the fabric json string, error: %v\n", err)
		response.Message = "ERROR: Something went wrong"
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	log.Println("SUCCESS: Successfully fetched all data for the layout generation")
	response.Message = "SUCCESS: Successfully generated the data "
	response.Data = result
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (h *APIState) getImageDescription(ctx context.Context, image_url string) (string, error) {
	const MAX_RETRIES = 3
	var final_error error

	for i := 0; i < MAX_RETRIES; i++ {
		resp, err := http.Get(image_url)
		if err != nil {
			return "", fmt.Errorf("ERROR: Failed to download the image, error: %v", err)
		}
		defer resp.Body.Close()

		image_bytes, err := io.ReadAll(resp.Body)
		if err != nil {
			return "", fmt.Errorf("ERROR: Failed to read the image, error: %v", err)
		}

		mime_type := http.DetectContentType(image_bytes)
		prompt := util.IMAGE_DESCRIPTION_PROMPT

		parts := []*genai.Part{
			{Text: prompt},
			{InlineData: &genai.Blob{Data: image_bytes, MIMEType: mime_type}},
		}

		result, err := h.GeminiClient.Models.GenerateContent(ctx, "gemini-2.5-flash", []*genai.Content{{Parts: parts}}, nil)

		if err == nil {
			if len(result.Candidates) == 0 || len(result.Candidates[0].Content.Parts) == 0 {
				return "", fmt.Errorf("ERROR: No content generated")
			}
			text := result.Candidates[0].Content.Parts[0].Text
			return text, nil
		}

		final_error = err
		log.Printf("WARN: Gemini call attempt %d/%d failed: %v", i+1, MAX_RETRIES, err)

		if strings.Contains(err.Error(), "UNAVAILABLE") {
			time.Sleep(500 * time.Millisecond)
			continue
		} else {
			return "", final_error
		}
	}

	return "", fmt.Errorf("ERROR: All retries failed. Last error: %v", final_error)
}

func (h *APIState) getFabricJSON(ctx context.Context, json_request types.JsonRequest) (string, error) {
	const MAX_RETRIES = 3
	var final_error error

	var sb strings.Builder
	encoder := json.NewEncoder(&sb)
	encoder.SetEscapeHTML(false)
	encoder.SetIndent("", "  ")

	if err := encoder.Encode(json_request); err != nil {
		return "", fmt.Errorf("failed to encode request: %v", err)
	}

	jsonString := sb.String()

	for i := 0; i < MAX_RETRIES; i++ {
		prompt := util.FABRIC_JSON_PROMPT

		parts := []*genai.Part{
			{Text: prompt + "\n\nContext Data:\n" + jsonString},
		}

		result, err := h.GeminiClient.Models.GenerateContent(ctx, "gemini-2.5-flash", []*genai.Content{{Parts: parts}}, nil)

		if err == nil {
			if len(result.Candidates) == 0 || len(result.Candidates[0].Content.Parts) == 0 {
				return "", fmt.Errorf("ERROR: No content generated")
			}
			text := result.Candidates[0].Content.Parts[0].Text

			// Clean the response before returning
			cleanedText := cleanLLMResponse(text)

			// Validate it's actually JSON
			if !json.Valid([]byte(cleanedText)) {
				log.Printf("WARN: Invalid JSON on attempt %d/%d, retrying...", i+1, MAX_RETRIES)
				final_error = fmt.Errorf("invalid JSON received from LLM")
				time.Sleep(500 * time.Millisecond)
				continue
			}

			return cleanedText, nil
		}

		final_error = err
		log.Printf("WARN: Gemini call attempt %d/%d failed: %v", i+1, MAX_RETRIES, err)

		if strings.Contains(err.Error(), "UNAVAILABLE") {
			time.Sleep(500 * time.Millisecond)
			continue
		} else {
			return "", final_error
		}
	}

	return "", fmt.Errorf("ERROR: All retries failed. Last error: %v", final_error)
}

// cleanLLMResponse removes markdown code blocks and other formatting
func cleanLLMResponse(response string) string {
	// Trim whitespace
	cleaned := strings.TrimSpace(response)

	// Remove markdown code blocks (```json ... ``` or ``` ... ```)
	cleaned = strings.TrimPrefix(cleaned, "```json")
	cleaned = strings.TrimPrefix(cleaned, "```")
	cleaned = strings.TrimSuffix(cleaned, "```")

	// Trim again after removing backticks
	cleaned = strings.TrimSpace(cleaned)

	// Remove any leading/trailing newlines or tabs
	cleaned = strings.Trim(cleaned, "\n\r\t ")

	return cleaned
}
