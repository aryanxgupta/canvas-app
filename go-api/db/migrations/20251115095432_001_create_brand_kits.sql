-- +goose Up
CREATE TABLE brand_kits(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    name TEXT NOT NULL, 
    colors_json JSONB, 
    rules_text TEXT, 
    logo_url TEXT, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 

-- +goose Down
DROP TABLE IF EXISTS brand_kits;
