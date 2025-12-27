# FIX: Error "features column not found"

## 🔴 Problema
Al intentar editar o guardar un vehículo, aparece el error:
```
Could not find the 'features' column of 'vehicles' in the schema cache
```

## ✅ Solución

Ejecuta el siguiente SQL en tu panel de Supabase para agregar la columna `features` faltante:

### SQL a Ejecutar

```sql
-- Add features column to vehicles table
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

-- Add comment
COMMENT ON COLUMN vehicles.features IS 'Array of vehicle features/amenities (e.g., ["Air conditioning", "WiFi", "USB ports"])';
```

### Cómo Ejecutarlo

1. **Abre Supabase SQL Editor**:
   - Ve a: https://app.supabase.com/project/vmpzvibmhlzkussqbcew/sql

2. **Pega el SQL de arriba** en el editor

3. **Haz clic en "Run"**

4. **Refresca tu aplicación** (Ctrl+Shift+R)

5. **Intenta guardar el vehículo de nuevo**

## 🎯 Verificación

Para verificar que la columna se agregó correctamente, ejecuta:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'vehicles'
ORDER BY ordinal_position;
```

Deberías ver `features` en la lista con tipo `jsonb`.

## 📝 Qué hace esta columna

La columna `features` almacena las características del vehículo como un array JSON:
- Aire acondicionado
- WiFi
- Cargadores USB
- Asientos de cuero
- GPS
- etc.

## 🐛 Si el error persiste

1. Verifica que la migración se ejecutó sin errores
2. Limpia la caché del navegador (Ctrl+Shift+Delete)
3. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📋 Migraciones Completas Recomendadas

Si quieres ejecutar TODAS las migraciones pendientes de una vez:

```sql
-- ============================================
-- MIGRATION 1: Hero Carousel Fields
-- ============================================

ALTER TABLE site_images
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS metadata JSONB,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_site_images_category_order ON site_images(category, display_order);
CREATE INDEX IF NOT EXISTS idx_site_images_is_active ON site_images(is_active);

COMMENT ON COLUMN site_images.metadata IS 'JSONB field for additional data. For hero_carousel: {price: number, link_url: string}';

-- ============================================
-- MIGRATION 2: Transfer Time to Destinations
-- ============================================

ALTER TABLE destinations
ADD COLUMN IF NOT EXISTS transfer_time TEXT;

COMMENT ON COLUMN destinations.transfer_time IS 'Estimated transfer time (e.g., "45 min", "1.5 hrs", "2 hours")';

-- ============================================
-- MIGRATION 3: Features to Vehicles
-- ============================================

ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN vehicles.features IS 'Array of vehicle features/amenities (e.g., ["Air conditioning", "WiFi", "USB ports"])';
```

Copia y pega TODO el bloque de arriba si prefieres ejecutar todas las migraciones juntas.

## ✨ Después de la Migración

Una vez ejecutada la migración, podrás:
- ✅ Guardar vehículos sin errores
- ✅ Agregar características/features al vehículo
- ✅ Subir y gestionar imágenes
- ✅ Editar vehículos existentes

¡Listo! 🎉
