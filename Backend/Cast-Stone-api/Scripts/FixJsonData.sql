-- Fix JSON data in Collections table
-- Check current data
SELECT "Id", "Name", "Tags", "Images", "ProductIds", "ChildCollectionIds" 
FROM "Collections" 
LIMIT 5;

-- Update any null or invalid JSON values to proper empty arrays
UPDATE "Collections" 
SET "Tags" = '[]'::jsonb 
WHERE "Tags" IS NULL OR "Tags"::text = '' OR "Tags"::text = 'null';

UPDATE "Collections" 
SET "Images" = '[]'::jsonb 
WHERE "Images" IS NULL OR "Images"::text = '' OR "Images"::text = 'null';

UPDATE "Collections" 
SET "ProductIds" = NULL 
WHERE "ProductIds"::text = '' OR "ProductIds"::text = 'null';

UPDATE "Collections" 
SET "ChildCollectionIds" = NULL 
WHERE "ChildCollectionIds"::text = '' OR "ChildCollectionIds"::text = 'null';

-- Check Products table as well
SELECT "Id", "Name", "Tags", "Images" 
FROM "Products" 
LIMIT 5;

-- Update any null or invalid JSON values in Products
UPDATE "Products" 
SET "Tags" = '[]'::jsonb 
WHERE "Tags" IS NULL OR "Tags"::text = '' OR "Tags"::text = 'null';

UPDATE "Products" 
SET "Images" = '[]'::jsonb 
WHERE "Images" IS NULL OR "Images"::text = '' OR "Images"::text = 'null';

-- Verify the fixes
SELECT "Id", "Name", "Tags", "Images", "ProductIds", "ChildCollectionIds" 
FROM "Collections" 
LIMIT 5;

SELECT "Id", "Name", "Tags", "Images" 
FROM "Products" 
LIMIT 5;
