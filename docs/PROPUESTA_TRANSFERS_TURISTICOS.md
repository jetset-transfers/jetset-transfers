# Propuesta: Módulo de Transfers Turísticos

## Contexto del Problema

Actualmente el sistema maneja **traslados aeropuerto-hotel** (Destinos), donde:
- El cliente llega al aeropuerto de Cancún
- Se le recoge y traslada a su hotel/hospedaje
- Se considera equipaje en el servicio

Se requiere un **nuevo tipo de servicio** llamado **"Transfers Turísticos"** para:
- Clientes **ya hospedados** en la Riviera Maya
- Traslados entre **zonas turísticas** (no involucran aeropuerto)
- **Sin equipaje** (el cliente ya está instalado en su hotel)
- Enfoque en **experiencias turísticas** y movilidad local

---

## Propuestas de Implementación

### Propuesta A: Rutas Predefinidas (Recomendada)

**Concepto:** Crear un catálogo de rutas turísticas populares con precios fijos.

#### Estructura de Datos

```sql
-- Nueva tabla: tourist_transfers
CREATE TABLE tourist_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,

  -- Información de la ruta
  origin_name_es VARCHAR(200) NOT NULL,
  origin_name_en VARCHAR(200) NOT NULL,
  destination_name_es VARCHAR(200) NOT NULL,
  destination_name_en VARCHAR(200) NOT NULL,

  -- Descripción del servicio
  description_es TEXT,
  description_en TEXT,

  -- Tiempo estimado y distancia
  duration_minutes INTEGER,
  distance_km DECIMAL(5,2),

  -- Categoría (playa, zona arqueológica, cenotes, pueblos, parques)
  category VARCHAR(50),

  -- Precios por vehículo (JSONB)
  vehicle_pricing JSONB DEFAULT '[]',
  -- Ejemplo: [{"vehicle_name": "Sedan", "max_passengers": 3, "price_usd": 45}]

  -- Imágenes
  images JSONB DEFAULT '[]',
  featured_image VARCHAR(500),

  -- Estado
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Ejemplos de Rutas

| Origen | Destino | Categoría | Duración |
|--------|---------|-----------|----------|
| Cancún Hotel Zone | Chichén Itzá | Zona Arqueológica | 2.5 hrs |
| Playa del Carmen | Tulum Ruinas | Zona Arqueológica | 45 min |
| Cancún Hotel Zone | Xcaret | Parque Temático | 1 hr |
| Riviera Maya | Cenote Ik Kil | Cenotes | 2 hrs |
| Playa del Carmen | Cozumel Ferry | Transporte | 15 min |
| Tulum | Laguna Bacalar | Naturaleza | 2 hrs |

#### Ventajas
- ✅ Precios claros y predefinidos
- ✅ Fácil de administrar desde el panel
- ✅ SEO optimizado (páginas por ruta)
- ✅ El cliente sabe exactamente qué esperar
- ✅ Reutiliza la lógica actual de `vehicle_pricing`

#### Desventajas
- ❌ Menos flexible para rutas personalizadas
- ❌ Requiere mantener catálogo actualizado

---

### Propuesta B: Origen-Destino Dinámico

**Concepto:** El cliente selecciona punto de origen y destino, el sistema calcula precio.

#### Estructura de Datos

```sql
-- Tabla de zonas/puntos de interés
CREATE TABLE transfer_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name_es VARCHAR(200) NOT NULL,
  name_en VARCHAR(200) NOT NULL,
  zone_type VARCHAR(50), -- 'hotel_zone', 'archaeological', 'beach', 'park', 'town'
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true
);

-- Tabla de precios entre zonas
CREATE TABLE zone_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_zone_id UUID REFERENCES transfer_zones(id),
  destination_zone_id UUID REFERENCES transfer_zones(id),
  vehicle_pricing JSONB DEFAULT '[]',
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(origin_zone_id, destination_zone_id)
);
```

#### Flujo del Usuario
1. Selecciona zona de origen (ej: "Zona Hotelera Cancún")
2. Selecciona zona de destino (ej: "Chichén Itzá")
3. Sistema muestra vehículos disponibles y precios
4. Completa formulario de contacto

#### Ventajas
- ✅ Máxima flexibilidad
- ✅ El cliente puede armar su ruta
- ✅ Escala bien con muchas zonas

#### Desventajas
- ❌ Más complejo de administrar (matriz de precios)
- ❌ Requiere definir precios para cada combinación
- ❌ UX más compleja para el usuario

---

### Propuesta C: Híbrido (Rutas + Personalizado)

**Concepto:** Ofrecer rutas populares predefinidas + opción de cotización personalizada.

#### Implementación
1. **Rutas Populares:** Catálogo de las 10-15 rutas más solicitadas (Propuesta A)
2. **Ruta Personalizada:** Formulario libre donde el cliente describe su necesidad

```
┌─────────────────────────────────────────────────────┐
│  TRANSFERS TURÍSTICOS                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🏛️ Rutas Populares                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │Chichén  │ │ Tulum   │ │ Xcaret  │  ...          │
│  │Itzá     │ │ Ruinas  │ │ Park    │               │
│  └─────────┘ └─────────┘ └─────────┘               │
│                                                     │
│  ────────────────────────────────────────────────  │
│                                                     │
│  📍 ¿No encuentras tu ruta?                        │
│  [Solicitar cotización personalizada]              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Ventajas
- ✅ Lo mejor de ambos mundos
- ✅ Cubre casos comunes + excepciones
- ✅ Genera leads para rutas nuevas

---

## Comparación de Propuestas

| Criterio | Propuesta A | Propuesta B | Propuesta C |
|----------|-------------|-------------|-------------|
| Complejidad de desarrollo | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Facilidad de administración | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Flexibilidad para el cliente | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| SEO y marketing | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Tiempo de implementación | 1-2 semanas | 3-4 semanas | 2-3 semanas |

---

## Recomendación: Propuesta A (Rutas Predefinidas)

**Razón:** Es la opción más práctica para iniciar, permite:
1. Lanzar rápido con las rutas más populares
2. Recopilar datos de qué rutas solicitan los clientes
3. Expandir el catálogo según demanda real
4. Mantener consistencia con el diseño actual de "Destinos"

---

## Diseño de UI/UX Propuesto

### Nueva Sección en Menú Principal
```
Inicio | Destinos | Transfers | Vehículos | Contacto
                      ↑
              (Nueva sección)
```

### Página de Transfers (`/transfers`)

```
┌─────────────────────────────────────────────────────────────┐
│  TRANSFERS TURÍSTICOS                                       │
│  Explora la Riviera Maya con transporte privado y seguro   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Filtros: Todos | Zonas Arqueológicas | Parques | Cenotes]│
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ 🏛️ Chichén Itzá  │  │ 🏛️ Tulum Ruinas  │                │
│  │ Desde $XX USD    │  │ Desde $XX USD    │                │
│  │ ~2.5 hrs         │  │ ~45 min          │                │
│  │ [Ver detalles]   │  │ [Ver detalles]   │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ 🎢 Xcaret        │  │ 💧 Cenote Ik Kil │                │
│  │ Desde $XX USD    │  │ Desde $XX USD    │                │
│  │ ~1 hr            │  │ ~2 hrs           │                │
│  │ [Ver detalles]   │  │ [Ver detalles]   │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Página de Detalle (`/transfers/chichen-itza`)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Volver a Transfers                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │                         │  │ RESERVA TU TRANSFER     │  │
│  │    [Imagen principal]   │  │                         │  │
│  │                         │  │ Origen: Zona Hotelera   │  │
│  │                         │  │ Destino: Chichén Itzá   │  │
│  └─────────────────────────┘  │ Duración: ~2.5 horas    │  │
│                               │                         │  │
│  TRANSFER A CHICHÉN ITZÁ     │ ┌─────────────────────┐  │  │
│                               │ │ Sedan (3 pax)       │  │  │
│  Visita una de las 7         │ │ $XXX USD            │  │  │
│  maravillas del mundo...     │ │ [Seleccionar]       │  │  │
│                               │ └─────────────────────┘  │  │
│  ✓ Transporte privado        │ ┌─────────────────────┐  │  │
│  ✓ Conductor bilingüe        │ │ SUV (5 pax)         │  │  │
│  ✓ Sin equipaje requerido    │ │ $XXX USD            │  │  │
│  ✓ Aire acondicionado        │ │ [Seleccionar]       │  │  │
│                               │ └─────────────────────┘  │  │
│  📍 Zonas de recogida:       │ ┌─────────────────────┐  │  │
│  • Cancún Zona Hotelera      │ │ Van (10 pax)        │  │  │
│  • Playa del Carmen          │ │ $XXX USD            │  │  │
│  • Riviera Maya              │ │ [Seleccionar]       │  │  │
│                               │ └─────────────────────┘  │  │
└─────────────────────────────────────────────────────────────┘
```

---

## Cambios en el Formulario de Contacto

### Nuevo Tipo de Servicio

```typescript
// Tipos de servicio actualizados
type ServiceType =
  | 'transfer'      // Aeropuerto → Hotel (actual)
  | 'roundtrip'     // Ida y vuelta aeropuerto (actual)
  | 'tourist'       // NUEVO: Transfer turístico
  | 'general';      // Consulta general (actual)
```

### Campos Específicos para Tourist Transfer

| Campo | Tipo | Requerido | Notas |
|-------|------|-----------|-------|
| `tourist_route_id` | UUID | Sí | Ruta seleccionada |
| `pickup_zone` | String | Sí | Zona de recogida (hotel/zona) |
| `pickup_hotel` | String | Sí | Nombre específico del hotel |
| `travel_date` | Date | Sí | Fecha del transfer |
| `pickup_time` | Time | Sí | Hora de recogida |
| `return_transfer` | Boolean | No | ¿Incluir regreso? |
| `return_time` | Time | Condicional | Si incluye regreso |
| `vehicle_selected` | String | Sí | Vehículo seleccionado |
| `num_passengers` | Integer | Sí | Número de pasajeros |

**Nota:** No se incluye campo de equipaje porque estos transfers asumen sin equipaje.

---

## Cambios en Panel de Administración

### Nueva Sección: Transfers Turísticos (`/admin/transfers`)

Funcionalidades:
- CRUD de rutas turísticas
- Gestión de precios por vehículo
- Categorización de rutas
- Activar/desactivar rutas
- Ordenar por popularidad

### Estructura Similar a Destinos Actual

Se puede reutilizar gran parte del código de `/admin/destinations`:
- Componente de edición de `vehicle_pricing`
- Selector de imágenes
- Toggle de estado activo
- Sistema de ordenamiento

---

## Plan de Implementación (Propuesta A)

### Fase 1: Base de Datos (2-3 días)
- [ ] Crear tabla `tourist_transfers`
- [ ] Crear políticas RLS en Supabase
- [ ] Seed con 5-10 rutas iniciales

### Fase 2: Panel Admin (3-4 días)
- [ ] Página `/admin/transfers`
- [ ] CRUD completo de rutas
- [ ] Gestión de vehicle_pricing
- [ ] Carga de imágenes

### Fase 3: Frontend Público (3-4 días)
- [ ] Página listado `/[locale]/transfers`
- [ ] Página detalle `/[locale]/transfers/[slug]`
- [ ] Integración con formulario de contacto
- [ ] Traducciones ES/EN

### Fase 4: Formulario y Notificaciones (2 días)
- [ ] Nuevo tipo de servicio `tourist`
- [ ] Campos específicos del formulario
- [ ] Actualizar emails de notificación

### Fase 5: QA y Ajustes (2 días)
- [ ] Pruebas de flujo completo
- [ ] Ajustes de UI/UX
- [ ] Optimización SEO

**Tiempo total estimado: 12-15 días**

---

## Preguntas para el Cliente

1. **Rutas iniciales:** ¿Cuáles son las 10 rutas más solicitadas actualmente?

2. **Zonas de recogida:** ¿Se recoge solo en hoteles o también en direcciones específicas?

3. **Vehículos:** ¿Los mismos vehículos aplican para transfers turísticos o hay diferencias?

4. **Viaje redondo:** ¿Se ofrece esperar en el destino y regresar al hotel? ¿Cómo se cobra?

5. **Tiempo de espera:** ¿Hay cargo adicional si el cliente quiere que el conductor espere?

6. **Horarios:** ¿Hay restricciones de horario para ciertos destinos?

7. **Precios:** ¿Los precios varían según la zona de recogida dentro de la Riviera Maya?

---

## Conclusión

La **Propuesta A (Rutas Predefinidas)** es la más viable para comenzar:
- Menor tiempo de desarrollo
- Fácil de administrar
- Escalable según demanda
- Consistente con el diseño actual

Se puede evolucionar hacia la Propuesta C (Híbrido) en el futuro agregando la opción de cotización personalizada una vez que se tenga data de las rutas más solicitadas.
