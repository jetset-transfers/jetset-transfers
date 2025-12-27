-- Migration: Add hero carousel fields to site_images table
-- Date: 2024-12-26
-- Description: Adds title_es, title_en, display_order, and metadata fields for hero carousel functionality

-- Add title fields
ALTER TABLE site_images
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS title_en TEXT;

-- Add display_order field (for ordering carousel images)
ALTER TABLE site_images
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add metadata field (JSONB for flexible additional data like price, link_url, etc.)
ALTER TABLE site_images
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Add is_active field (to enable/disable images without deleting them)
ALTER TABLE site_images
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create index on category and display_order for better query performance
CREATE INDEX IF NOT EXISTS idx_site_images_category_order ON site_images(category, display_order);

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_site_images_is_active ON site_images(is_active);

-- Add comment to metadata column
COMMENT ON COLUMN site_images.metadata IS 'JSONB field for additional data. For hero_carousel: {price: number, link_url: string}';

-- Example usage for hero_carousel:
-- INSERT INTO site_images (key, url, alt_es, alt_en, title_es, title_en, category, is_primary, display_order, metadata, is_active)
-- VALUES (
--   'hero_carousel_tulum',
--   'https://your-supabase-storage-url.com/images/hero_carousel/tulum.jpg',
--   'Vista aérea de las playas de Tulum',
--   'Aerial view of Tulum beaches',
--   'Traslado a Tulum',
--   'Transfer to Tulum',
--   'hero_carousel',
--   false,
--   1,
--   '{"price": 120, "link_url": "/es/destinations/tulum"}'::jsonb,
--   true
-- );
