-- name: CreateBrandKit :one
INSERT INTO brand_kits (
  name,
  colors_json,
  rules_text,
  logo_url
) VALUES (
  $1, $2, $3, $4
)
RETURNING *;

-- name: ListBrandKits :many
SELECT * FROM brand_kits
ORDER BY created_at DESC; 

-- name: GetBrandKit :one
SELECT * FROM brand_kits
WHERE id = $1;