# Fix: Destinations "flight_time" Column Error

## Problema
Al intentar agregar o editar un destino en el panel de administración, aparece el error:
```
Could not find the 'flight_time' column of 'destinations' in the schema cache
```

## Causa
El código del admin estaba usando una columna llamada `flight_time` que no existe en la tabla `destinations` de Supabase. Este campo era un remanente de cuando el proyecto era para vuelos chárter, pero ahora es para traslados terrestres.

## Solución

### Paso 1: Ejecutar la Migración SQL

Ejecuta el siguiente SQL en tu panel de Supabase:

**Archivo:** `supabase-migrations/add-transfer-time-to-destinations.sql`

```sql
-- Migration: Add transfer_time column to destinations table
-- Date: 2024-12-26
-- Description: Adds transfer_time field to store estimated transfer duration

-- Add transfer_time field
ALTER TABLE destinations
ADD COLUMN IF NOT EXISTS transfer_time TEXT;

-- Add comment
COMMENT ON COLUMN destinations.transfer_time IS 'Estimated transfer time (e.g., "45 min", "1.5 hrs", "2 hours")';
```

**Cómo ejecutar:**
1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Navega a **SQL Editor**
4. Crea una nueva query
5. Copia y pega el SQL de arriba
6. Haz clic en **Run**

### Paso 2: Verificar los Cambios

El código ya ha sido actualizado automáticamente. Todos los usos de `flight_time` ahora son `transfer_time`.

**Archivos actualizados:**
- `app/admin/destinations/DestinationsContent.tsx`

### Paso 3: Actualizar Destinos Existentes (Opcional)

Si tienes destinos existentes y quieres agregar tiempos de traslado estimados, puedes ejecutar:

```sql
-- Ejemplos de actualización (ajusta según tus destinos reales)
UPDATE destinations SET transfer_time = '30 min' WHERE slug = 'zona-hotelera';
UPDATE destinations SET transfer_time = '45 min' WHERE slug = 'puerto-morelos';
UPDATE destinations SET transfer_time = '1 hr' WHERE slug = 'playa-del-carmen';
UPDATE destinations SET transfer_time = '1.5 hrs' WHERE slug = 'akumal';
UPDATE destinations SET transfer_time = '2 hrs' WHERE slug = 'tulum';
UPDATE destinations SET transfer_time = '3 hrs' WHERE slug = 'bacalar';
```

### Paso 4: Probar

1. Ve a `/admin/destinations`
2. Intenta agregar un nuevo destino
3. Llena el campo "Tiempo de traslado" (ej: "45 min", "1 hr")
4. Guarda

El error debería estar resuelto.

## Formato Recomendado para Tiempo de Traslado

Usa uno de estos formatos:
- `"30 min"` - Para traslados cortos
- `"1 hr"` - Para una hora
- `"1.5 hrs"` - Para una hora y media
- `"2 hrs"` - Para dos horas o más

## Notas Técnicas

### Cambios Realizados

1. **Nueva columna en DB**: `transfer_time` (TEXT, nullable)
2. **Código actualizado**: Todos los usos de `flight_time` → `transfer_time`
3. **Interfaz TypeScript**: Actualizada con el nuevo nombre de campo

### Si Prefieres No Usar Este Campo

Si no necesitas mostrar el tiempo de traslado, puedes:

1. Dejar el campo vacío al crear destinos
2. O eliminar las referencias al campo del código (contacta para ayuda)

El campo es opcional, así que puedes dejarlo en blanco sin problemas.

## Prevención

Este error ocurrió porque había un desajuste entre:
- La estructura de la tabla en Supabase (columnas reales)
- El código TypeScript (esperaba columnas diferentes)

**Para prevenir en el futuro:**
1. Siempre verifica que las columnas existan en Supabase antes de usarlas
2. Usa migraciones SQL para agregar nuevas columnas
3. Actualiza las interfaces TypeScript para que coincidan con la DB

## Soporte

Si sigues viendo este error después de ejecutar la migración:
1. Verifica que la migración se ejecutó correctamente
2. Limpia la caché del navegador (Ctrl+Shift+R)
3. Reinicia el servidor de desarrollo (`npm run dev`)
4. Revisa la consola del navegador por errores adicionales
