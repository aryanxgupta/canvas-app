-- +goose Up
CREATE TABLE product_images(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    brand_kit_id UUID NOT NULL REFERENCES brand_kits(id) ON DELETE CASCADE, 
    image_url TEXT NOT NULL, 
    image_name TEXT, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 

CREATE INDEX ON product_images (brand_kit_id); 

-- +goose Down
DROP TABLE IF EXISTS product_images; 
