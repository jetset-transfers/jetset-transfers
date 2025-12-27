# ⚡ SOLUCIÓN INMEDIATA - Ejecutar Ahora

## 🔴 Error Actual
```
Could not find the 'images' column of 'vehicles' in the schema cache
```

## ✅ Solución en 3 Pasos

### Paso 1: Abre Supabase SQL Editor
🔗 **Link directo**: https://app.supabase.com/project/vmpzvibmhlzkussqbcew/sql

### Paso 2: Copia y Pega Este SQL

```sql
-- FIX: Agregar columnas faltantes a vehicles
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
```

### Paso 3: Haz Clic en "Run"

¡Listo! Ahora refresca tu aplicación (F5) y el error desaparecerá.

---

## 🎯 ¿Quieres Ejecutar TODAS las Migraciones?

Si prefieres ejecutar todas las migraciones pendientes de una vez (recomendado), usa el archivo:

📄 **[RUN-ALL-MIGRATIONS.sql](./RUN-ALL-MIGRATIONS.sql)**

Este archivo incluye:
- ✅ Hero Carousel (imágenes del carrusel)
- ✅ Transfer Time (tiempo de traslado en destinos)
- ✅ Vehicles Complete (TODAS las columnas necesarias)

---

## 📊 Estructura Completa de la Tabla `vehicles`

Después de ejecutar las migraciones, tu tabla `vehicles` tendrá:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | ID único (ya existe) |
| `name` | TEXT | Nombre del vehículo |
| `type` | TEXT | Tipo (sedan, suv, van, sprinter, luxury) |
| `capacity` | INTEGER | Capacidad de pasajeros |
| `luggage_capacity` | INTEGER | Capacidad de equipaje |
| `description_es` | TEXT | Descripción en español |
| `description_en` | TEXT | Descripción en inglés |
| `features` | JSONB | Array de características |
| `images` | JSONB | Array de URLs de imágenes |
| `display_order` | INTEGER | Orden de visualización |
| `is_active` | BOOLEAN | Activo/Inactivo |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

---

## 🔍 Verificación

Para verificar que las columnas se agregaron correctamente:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'vehicles'
ORDER BY ordinal_position;
```

---

## 🚨 Si Sigues Viendo Errores

1. **Limpia la caché del navegador**: Ctrl+Shift+R
2. **Reinicia el servidor**:
   ```bash
   npm run dev
   ```
3. **Verifica que la migración se ejecutó**: Usa la query de verificación arriba

---

## 📝 Ejemplo de Datos

Así se ve un vehículo completo en la base de datos:

```json
{
  "name": "Chevrolet Suburban",
  "type": "suv",
  "capacity": 5,
  "luggage_capacity": 3,
  "description_es": "SUV de lujo ideal para familias pequeñas",
  "description_en": "Luxury SUV ideal for small families",
  "features": ["Aire acondicionado", "GPS", "WiFi", "Asientos de cuero"],
  "images": [
    "https://storage.url/suburban-front.jpg",
    "https://storage.url/suburban-interior.jpg"
  ],
  "display_order": 1,
  "is_active": true
}
```

---

## ✨ Después de la Migración

Podrás:
- ✅ Crear y editar vehículos sin errores
- ✅ Subir múltiples imágenes por vehículo
- ✅ Agregar características/features
- ✅ Reordenar imágenes
- ✅ Gestionar todo desde el admin

---

## 🆘 Ayuda Rápida

**¿No tienes acceso a Supabase ahora mismo?**
- Guarda este archivo para ejecutarlo más tarde
- El error persistirá hasta que ejecutes la migración
- No perderás ningún dato, solo no podrás guardar vehículos

**¿Ejecutaste la migración y sigue el error?**
1. Verifica que se ejecutó sin errores en Supabase
2. Cierra y abre de nuevo tu navegador
3. Limpia la caché completamente
4. Reinicia el servidor de desarrollo

---

🎉 **¡Listo para ejecutar!**
