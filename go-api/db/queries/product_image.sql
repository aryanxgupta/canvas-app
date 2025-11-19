-- name: CreateProductImage :one
INSERT INTO product_images (
  brand_kit_id,
  image_url,
  image_name
) VALUES (
  $1, $2, $3
)
RETURNING *;

-- name: ListProductImagesForBrandKit :many
SELECT * FROM product_images
WHERE brand_kit_id = $1
ORDER BY created_at;