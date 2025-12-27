-- Migration: Add transfer_time column to destinations table
-- Date: 2024-12-26
-- Description: Adds transfer_time field to store estimated transfer duration

-- Add transfer_time field
ALTER TABLE destinations
ADD COLUMN IF NOT EXISTS transfer_time TEXT;

-- Add comment
COMMENT ON COLUMN destinations.transfer_time IS 'Estimated transfer time (e.g., "45 min", "1.5 hrs", "2 hours")';

-- Update existing records with sample values (optional - adjust as needed)
-- UPDATE destinations SET transfer_time = '45 min' WHERE slug = 'zona-hotelera';
-- UPDATE destinations SET transfer_time = '1 hr' WHERE slug = 'playa-del-carmen';
-- UPDATE destinations SET transfer_time = '2 hrs' WHERE slug = 'tulum';
