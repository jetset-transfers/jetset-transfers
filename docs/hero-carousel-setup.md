# Hero Carousel - Guía de Configuración

## Resumen
El Hero Carousel es un carrusel de imágenes destacadas que aparece en la sección derecha del Hero de la página principal. Permite mostrar destinos, servicios o promociones con título, precio y enlace opcionales.

## Características
- ✅ Auto-reproducción cada 5 segundos
- ✅ Pausa al pasar el mouse sobre el carrusel
- ✅ Navegación manual con flechas (aparecen al pasar el mouse)
- ✅ Indicadores de puntos (dots) en la parte inferior
- ✅ Títulos bilingües (español/inglés)
- ✅ Precio opcional ("Desde $XX")
- ✅ Enlace opcional (clic para navegar)
- ✅ Ordenamiento personalizable

## Pasos de Configuración

### 1. Ejecutar Migración de Base de Datos

Ejecuta el archivo SQL en tu panel de Supabase:
```
supabase-migrations/add-hero-carousel-fields.sql
```

**Cómo ejecutar:**
1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **SQL Editor**
3. Copia y pega el contenido de `add-hero-carousel-fields.sql`
4. Ejecuta la query

Esto agregará las siguientes columnas a la tabla `site_images`:
- `title_es` (TEXT) - Título en español
- `title_en` (TEXT) - Título en inglés
- `display_order` (INTEGER) - Orden de aparición
- `metadata` (JSONB) - Datos adicionales (precio, enlace)
- `is_active` (BOOLEAN) - Activar/desactivar imagen

### 2. Agregar Imágenes al Carrusel

#### Opción A: Desde el Panel de Admin (Recomendado)

1. Inicia sesión en `/admin`
2. Ve a **Imágenes del Sitio**
3. Busca la sección **Hero Carrusel** 🎠
4. Haz clic en **+ Agregar**
5. Llena el formulario:
   - **Key**: Identificador único (ej: `hero_carousel_tulum`)
   - **Categoría**: Selecciona "Hero Carrusel"
   - **Imagen**: Sube una imagen vertical (600x800 recomendado)
   - **Alt Text**: Descripción en español e inglés
   - **Título**: Nombre corto del destino/servicio (opcional)
   - **Precio**: Precio "desde" en USD (opcional)
   - **Enlace**: URL de destino al hacer clic (opcional)
   - **Orden**: Número de orden (1 = primero, 2 = segundo, etc.)

#### Opción B: Directamente en la Base de Datos

```sql
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
  'hero_carousel_tulum',
  'https://your-storage-url/images/hero_carousel/tulum.jpg',
  'Vista panorámica de las playas de Tulum con aguas turquesas',
  'Panoramic view of Tulum beaches with turquoise waters',
  'Traslado a Tulum',
  'Transfer to Tulum',
  'hero_carousel',
  false,
  1,
  '{"price": 120, "link_url": "/es/destinations/tulum"}'::jsonb,
  true
);
```

### 3. Recomendaciones de Imágenes

**Formato ideal:**
- **Dimensiones**: 600x800 px (aspecto vertical 3:4)
- **Peso**: < 100 KB (optimiza para web)
- **Formato**: JPG (calidad 80-85%) o WebP
- **Contenido**: Imágenes atractivas de destinos, vehículos o experiencias

**Herramientas de optimización:**
- [TinyPNG](https://tinypng.com) - Compresión de imágenes
- [Squoosh](https://squoosh.app) - Optimización avanzada
- [ImageOptim](https://imageoptim.com) - Para macOS

### 4. Estructura de Metadata

El campo `metadata` es un objeto JSON con los siguientes campos opcionales:

```json
{
  "price": 120,           // Número (USD)
  "link_url": "/es/destinations/tulum"  // String (URL relativa o absoluta)
}
```

**Ejemplos:**

```json
// Solo precio
{"price": 85}

// Solo enlace
{"link_url": "/es/destinations/playa-del-carmen"}

// Precio y enlace
{"price": 150, "link_url": "/es/destinations/holbox"}

// Sin metadata
null
```

## Gestión de Imágenes

### Ordenar Imágenes

El campo `display_order` define el orden de aparición:
- Valores más bajos aparecen primero
- Puedes usar cualquier número (1, 2, 3... o 10, 20, 30...)
- Recomendación: Usa múltiplos de 10 para facilitar insertar imágenes después

**Ejemplo:**
```
display_order: 10  → Primera imagen
display_order: 20  → Segunda imagen
display_order: 30  → Tercera imagen
display_order: 25  → Se inserta entre la segunda y tercera
```

### Activar/Desactivar Imágenes

Usa el campo `is_active` para ocultar imágenes temporalmente sin eliminarlas:

```sql
-- Desactivar imagen
UPDATE site_images
SET is_active = false
WHERE key = 'hero_carousel_tulum';

-- Activar imagen
UPDATE site_images
SET is_active = true
WHERE key = 'hero_carousel_tulum';
```

### Editar Imágenes

Desde el panel de admin:
1. Ve a **Imágenes del Sitio** → **Hero Carrusel**
2. Pasa el mouse sobre la imagen
3. Haz clic en el ícono de editar ✏️
4. Actualiza los campos deseados
5. Guarda los cambios

## Ejemplos de Uso

### Ejemplo 1: Destinos Populares

```sql
-- Tulum
INSERT INTO site_images (key, url, alt_es, alt_en, title_es, title_en, category, display_order, metadata, is_active)
VALUES (
  'hero_carousel_tulum',
  'https://storage.url/tulum.jpg',
  'Ruinas mayas de Tulum frente al mar Caribe',
  'Mayan ruins of Tulum by the Caribbean sea',
  'Tulum',
  'Tulum',
  'hero_carousel',
  10,
  '{"price": 120, "link_url": "/es/destinations/tulum"}'::jsonb,
  true
);

-- Playa del Carmen
INSERT INTO site_images (key, url, alt_es, alt_en, title_es, title_en, category, display_order, metadata, is_active)
VALUES (
  'hero_carousel_playa',
  'https://storage.url/playa.jpg',
  'Quinta Avenida en Playa del Carmen',
  'Fifth Avenue in Playa del Carmen',
  'Playa del Carmen',
  'Playa del Carmen',
  'hero_carousel',
  20,
  '{"price": 85, "link_url": "/es/destinations/playa-del-carmen"}'::jsonb,
  true
);
```

### Ejemplo 2: Promociones

```sql
INSERT INTO site_images (key, url, alt_es, alt_en, title_es, title_en, category, display_order, metadata, is_active)
VALUES (
  'hero_carousel_promo_verano',
  'https://storage.url/promo.jpg',
  'Promoción de verano - Descuentos en traslados',
  'Summer promotion - Discounts on transfers',
  '¡Oferta de Verano!',
  'Summer Deal!',
  'hero_carousel',
  5,
  '{"price": 65, "link_url": "/es/contact"}'::jsonb,
  true
);
```

## Solución de Problemas

### Las imágenes no aparecen
1. Verifica que `is_active = true`
2. Verifica que `category = 'hero_carousel'`
3. Revisa que las URLs de las imágenes sean accesibles
4. Limpia la caché del navegador (Ctrl+Shift+R)

### Las imágenes aparecen en orden incorrecto
1. Verifica los valores de `display_order`
2. Asegúrate de que no haya valores duplicados
3. Ordena con números más separados (10, 20, 30 en lugar de 1, 2, 3)

### El carrusel no se mueve automáticamente
1. Verifica que haya más de 1 imagen activa
2. Asegúrate de que no estés pasando el mouse sobre el carrusel (se pausa al hover)
3. Revisa la consola del navegador por errores

### Las imágenes se ven distorsionadas
1. Usa imágenes con aspecto vertical 3:4 (ej: 600x800)
2. Asegúrate de que las imágenes sean de alta calidad
3. Evita imágenes muy anchas (horizontales)

## API de Consulta

Para obtener las imágenes del carrusel en tu código:

```typescript
const { data: carouselImages } = await supabase
  .from('site_images')
  .select('id, url, alt_es, alt_en, title_es, title_en, display_order, metadata')
  .eq('category', 'hero_carousel')
  .eq('is_active', true)
  .order('display_order', { ascending: true });
```

Esto ya está implementado en `app/[locale]/page.tsx` líneas 118-136.

## Mejoras Futuras

Posibles mejoras que se pueden implementar:
- [ ] Arrastrar y soltar para reordenar imágenes en el admin
- [ ] Vista previa del carrusel en el admin
- [ ] Programación de imágenes (fechas de inicio/fin)
- [ ] A/B testing de imágenes
- [ ] Analytics de clics por imagen
- [ ] Soporte para videos en el carrusel

## Soporte

Si tienes preguntas o problemas, revisa:
- Documentación de Supabase: https://supabase.com/docs
- Next.js Image: https://nextjs.org/docs/api-reference/next/image
- CLAUDE.md en la raíz del proyecto para más detalles sobre la arquitectura
