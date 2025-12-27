# Guía para Ejecutar las Migraciones Manualmente

Ya que no puedo ejecutar las migraciones automáticamente por limitaciones de seguridad de Supabase, aquí está la guía completa para que las ejecutes manualmente cuando tengas acceso.

## 🎯 Método Rápido (Recomendado)

### Paso 1: Abre el SQL Editor de Supabase

Abre este enlace (reemplázalo con tu ID de proyecto si es diferente):
```
https://app.supabase.com/project/vmpzvibmhlzkussqbcew/sql/new
```

### Paso 2: Ejecuta las Migraciones

Copia y pega **TODO** el siguiente SQL en el editor y haz clic en "Run":

```sql
-- ============================================
-- MIGRATION 1: Hero Carousel Fields
-- ============================================

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


-- ============================================
-- MIGRATION 2: Transfer Time to Destinations
-- ============================================

-- Add transfer_time field
ALTER TABLE destinations
ADD COLUMN IF NOT EXISTS transfer_time TEXT;

-- Add comment
COMMENT ON COLUMN destinations.transfer_time IS 'Estimated transfer time (e.g., "45 min", "1.5 hrs", "2 hours")';
```

### Paso 3: Verifica que se ejecutó correctamente

Deberías ver un mensaje de éxito como:
```
Success. No rows returned
```

## 📋 Verificación Post-Migración

Para verificar que las columnas se agregaron correctamente, ejecuta:

```sql
-- Verificar columnas de site_images
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'site_images'
ORDER BY ordinal_position;

-- Verificar columnas de destinations
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'destinations'
ORDER BY ordinal_position;
```

Deberías ver las nuevas columnas:
- **site_images**: `title_es`, `title_en`, `display_order`, `metadata`, `is_active`
- **destinations**: `transfer_time`

## 🧪 Prueba las Migraciones

### 1. Probar Hero Carousel

```sql
-- Insertar una imagen de prueba para el carrusel
INSERT INTO site_images (
  key,
  url,
  alt_es,
  alt_en,
  title_es,
  title_en,
  category,
  is_primary,
  display_order,
  metadata,
  is_active
) VALUES (
  'hero_carousel_test',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  'Paisaje tropical',
  'Tropical landscape',
  'Traslado a Tulum',
  'Transfer to Tulum',
  'hero_carousel',
  false,
  1,
  '{"price": 120, "link_url": "/es/destinations/tulum"}'::jsonb,
  true
);
```

### 2. Probar Destinations Transfer Time

```sql
-- Actualizar un destino con tiempo de traslado (ajusta el slug según tus datos)
UPDATE destinations
SET transfer_time = '1.5 hrs'
WHERE slug = 'tulum';
```

## 🔍 Solución de Problemas

### Error: "column already exists"
✅ **Esto es normal!** El SQL usa `IF NOT EXISTS` así que es seguro ejecutarlo múltiples veces.

### Error: "permission denied"
❌ Asegúrate de estar usando una cuenta con permisos de administrador en Supabase.

### Error: "table does not exist"
❌ Verifica que las tablas `site_images` y `destinations` existan en tu base de datos.

## 📝 Después de Ejecutar las Migraciones

1. **Refresca tu aplicación**:
   - Si está corriendo localmente: reinicia el servidor (`npm run dev`)
   - Si está en producción: haz un redeploy o espera unos minutos

2. **Prueba el admin**:
   - Ve a `/admin/destinations` e intenta agregar/editar un destino
   - Ve a `/admin/images` y busca la categoría "Hero Carrusel 🎠"

3. **Limpia archivos temporales** (opcional):
   ```bash
   rm migrate.mjs run-migrations.js run-migrations-direct.mjs
   ```

## 🎯 Accesos Rápidos

- **SQL Editor**: https://app.supabase.com/project/vmpzvibmhlzkussqbcew/sql
- **Table Editor**: https://app.supabase.com/project/vmpzvibmhlzkussqbcew/editor
- **Admin Panel Local**: http://localhost:3000/admin

## 💡 Consejo

Guarda las queries de verificación para usarlas en el futuro cuando necesites revisar la estructura de las tablas.

¡Listo! Una vez ejecutadas las migraciones, todas las funcionalidades nuevas deberían funcionar correctamente. 🎉
