# Plan de Implementación: Sistema de Reservas con Pago Directo

## Resumen del Proyecto

Implementar un sistema de reservas con **pago directo vía Stripe** (sin cotizaciones por email).

| Tipo | Descripción | Cálculo de Precio |
|------|-------------|-------------------|
| **Private Transfer** | Aeropuerto → Hotel/Destino | Precios de `destinations` actuales |
| **Round Trip** | Aeropuerto ↔ Hotel (ida y vuelta) | Precios de `destinations` actuales |
| **Transfer One Way** | Punto A → Punto B (sin equipaje) | Sistema de zonas + Google Places |

## Flujo de Usuario (Nuevo)

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. BÚSQUEDA RÁPIDA (HomePage)                                      │
│     Usuario selecciona: Tipo → Destino → Fecha → Hora              │
│                              ↓                                      │
│  2. SELECCIÓN DE VEHÍCULO (/booking)                               │
│     Ve opciones de vehículos con precios                           │
│     Selecciona vehículo deseado                                    │
│                              ↓                                      │
│  3. DATOS DEL PASAJERO                                             │
│     Nombre, Email, Teléfono, # Pasajeros, Vuelo (opcional)         │
│                              ↓                                      │
│  4. PAGO CON STRIPE                                                │
│     Checkout seguro con tarjeta                                    │
│                              ↓                                      │
│  5. CONFIRMACIÓN                                                   │
│     - Email de confirmación al CLIENTE                             │
│     - Email interno al EQUIPO JETSET                               │
│     - Reserva guardada en BD con estado "confirmed"                │
└─────────────────────────────────────────────────────────────────────┘
```

**IMPORTANTE:** Ya no hay emails de cotización. El cliente paga directamente.

---

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PÁGINA PRINCIPAL                             │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [Private Transfer ▼] [Round Trip] [Transfer One Way]       │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │                                                             │   │
│  │  📅 Fecha    🕐 Hora    📍 Origen    📍 Destino   [BUSCAR] │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Dependiendo del tipo seleccionado:                                │
│  • Private/Round Trip → Destino es dropdown de `destinations`      │
│  • Transfer One Way → Ambos campos usan Google Places Autocomplete │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Fase 1: Componente de Búsqueda Rápida (Frontend)

### 1.1 Crear componente `QuickBookingSearch`

**Ubicación:** `components/home/QuickBookingSearch.tsx`

**Campos del formulario:**
```typescript
interface QuickBookingForm {
  service_type: 'private' | 'roundtrip' | 'oneway';
  pickup_date: string;
  pickup_time: string;
  // Para Private/Round Trip:
  destination_slug?: string;  // del dropdown de destinations
  // Para Transfer One Way:
  origin_place?: GooglePlace;
  destination_place?: GooglePlace;
}

interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  lat: number;
  lng: number;
  types: string[];  // hotel, restaurant, etc.
}
```

**Comportamiento por tipo:**

| Campo | Private Transfer | Round Trip | Transfer One Way |
|-------|-----------------|------------|------------------|
| Origen | "Aeropuerto Cancún" (fijo) | "Aeropuerto Cancún" (fijo) | Google Places |
| Destino | Dropdown destinations | Dropdown destinations | Google Places |
| Precio | De `vehicle_pricing` | De `vehicle_pricing` x factor | Cálculo por zonas |

### 1.2 Integrar en HomePage

**Ubicación:** Debajo del Hero o como parte del Hero

```tsx
// app/[locale]/page.tsx
<HeroSection />
<QuickBookingSearch locale={locale} />
// o integrado dentro del Hero
```

### Archivos a crear/modificar:
- [ ] `components/home/QuickBookingSearch.tsx` (nuevo)
- [ ] `components/home/HeroSection.tsx` (modificar para integrar)
- [ ] `app/[locale]/page.tsx` (si se pone separado del hero)

---

## Fase 2: Integración Google Places API

### 2.1 Configuración de Google Cloud

**Servicios requeridos:**
- Places API
- Maps JavaScript API (para autocomplete)
- Geocoding API (opcional, para validar zonas)

**Restricciones de API Key:**
- Restringir a dominios: `jetsetcancun.com`, `localhost`
- Restringir a APIs específicas

### 2.2 Variables de entorno

```env
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 2.3 Componente de Autocomplete

**Ubicación:** `components/ui/GooglePlacesAutocomplete.tsx`

```typescript
interface GooglePlacesAutocompleteProps {
  placeholder: string;
  onSelect: (place: GooglePlace) => void;
  types?: string[];  // ['lodging', 'restaurant']
  bounds?: google.maps.LatLngBounds;  // Restringir a Riviera Maya
  locale: string;
}
```

**Configuración del Autocomplete:**
```javascript
const options = {
  types: ['establishment'],
  componentRestrictions: { country: 'mx' },
  bounds: {
    // Bounding box de Riviera Maya aproximado
    north: 21.2,  // Norte de Cancún
    south: 20.0,  // Sur de Tulum
    east: -86.7,
    west: -87.5
  },
  strictBounds: true,
  fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types']
};
```

**Filtrar resultados:**
- Priorizar: `lodging` (hoteles), `restaurant`
- Permitir también: `tourist_attraction`, `point_of_interest`

### Archivos a crear:
- [ ] `components/ui/GooglePlacesAutocomplete.tsx`
- [ ] `hooks/useGooglePlaces.ts` (opcional, para cargar script)
- [ ] `types/google-places.d.ts` (tipos de TypeScript)

---

## Fase 3: Sistema de Zonas y Precios

### 3.1 Definición de Zonas

**Tabla en Supabase:** `transfer_zones`

```sql
CREATE TABLE transfer_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_number INTEGER UNIQUE NOT NULL,  -- 1, 2, 3, 4, 5...
  name_es VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  description_es TEXT,
  description_en TEXT,
  -- Polígono que define la zona (GeoJSON)
  boundaries JSONB NOT NULL,
  -- Ejemplo: {"type": "Polygon", "coordinates": [[[lng, lat], [lng, lat], ...]]}
  color VARCHAR(7) DEFAULT '#3B82F6',  -- Para visualización en mapa
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ejemplo de zonas:
-- Zona 1: Aeropuerto Cancún
-- Zona 2: Zona Hotelera Cancún
-- Zona 3: Puerto Morelos
-- Zona 4: Playa del Carmen
-- Zona 5: Puerto Aventuras / Akumal
-- Zona 6: Tulum
-- Zona 7: Más allá de Tulum (Bacalar, etc.)
```

### 3.2 Matriz de Precios entre Zonas

**Tabla en Supabase:** `zone_pricing`

```sql
CREATE TABLE zone_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_zone_id UUID REFERENCES transfer_zones(id) ON DELETE CASCADE,
  destination_zone_id UUID REFERENCES transfer_zones(id) ON DELETE CASCADE,

  -- Precios por tipo de vehículo (JSONB)
  vehicle_pricing JSONB NOT NULL DEFAULT '[]',
  -- Ejemplo: [
  --   {"vehicle_name": "Sedan", "max_passengers": 3, "price_usd": 45},
  --   {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 65},
  --   {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 85}
  -- ]

  -- Tiempo estimado
  duration_minutes INTEGER,
  distance_km DECIMAL(6,2),

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(origin_zone_id, destination_zone_id)
);
```

### 3.3 Función para determinar zona de una coordenada

**Opción A: En el backend (API Route)**

```typescript
// app/api/get-zone/route.ts
export async function POST(request: Request) {
  const { lat, lng } = await request.json();

  // Usar PostGIS o algoritmo point-in-polygon
  const zone = await supabase
    .rpc('get_zone_for_point', { lat, lng });

  return Response.json({ zone });
}
```

**Opción B: En el frontend (más simple)**

```typescript
// lib/zones.ts
import * as turf from '@turf/turf';

export function getZoneForPoint(lat: number, lng: number, zones: Zone[]): Zone | null {
  const point = turf.point([lng, lat]);

  for (const zone of zones) {
    const polygon = turf.polygon(zone.boundaries.coordinates);
    if (turf.booleanPointInPolygon(point, polygon)) {
      return zone;
    }
  }
  return null;
}
```

### 3.4 Flujo de cálculo de precio

```
Usuario selecciona origen (Google Places)
        ↓
Obtener lat/lng del lugar
        ↓
Determinar zona del origen
        ↓
Usuario selecciona destino (Google Places)
        ↓
Obtener lat/lng del lugar
        ↓
Determinar zona del destino
        ↓
Buscar precio en zone_pricing[origen_zone → destino_zone]
        ↓
Mostrar opciones de vehículos con precios
```

### Archivos a crear:
- [ ] Migración SQL para `transfer_zones`
- [ ] Migración SQL para `zone_pricing`
- [ ] `lib/zones.ts` (utilidades de zonas)
- [ ] `app/api/calculate-price/route.ts` (API para calcular precio)

---

## Fase 4: Panel de Administración - Zonas

### 4.1 Nueva página `/admin/zones`

**Funcionalidades:**
- Ver mapa con zonas dibujadas
- CRUD de zonas
- Dibujar/editar polígonos en el mapa
- Asignar colores a zonas

### 4.2 Nueva página `/admin/zone-pricing`

**Funcionalidades:**
- Matriz de precios entre zonas
- Edición de precios por vehículo
- Vista de tabla o matriz visual

```
        │ Zona 1 │ Zona 2 │ Zona 3 │ Zona 4 │
────────┼────────┼────────┼────────┼────────┤
Zona 1  │   -    │  $45   │  $65   │  $85   │
Zona 2  │  $45   │   -    │  $35   │  $55   │
Zona 3  │  $65   │  $35   │   -    │  $40   │
Zona 4  │  $85   │  $55   │  $40   │   -    │
```

### Archivos a crear:
- [ ] `app/admin/zones/page.tsx`
- [ ] `app/admin/zones/ZonesContent.tsx`
- [ ] `app/admin/zone-pricing/page.tsx`
- [ ] `app/admin/zone-pricing/ZonePricingContent.tsx`
- [ ] `components/admin/ZoneMapEditor.tsx` (editor de mapa)

---

## Fase 5: Flujo de Reserva

### 5.1 Página de selección de vehículo

Después de buscar, el usuario va a una página donde:
1. Ve resumen de su búsqueda
2. Selecciona vehículo
3. Ve precio total
4. Procede a completar datos

**Ruta:** `/[locale]/booking?type=oneway&origin=...&dest=...&date=...`

### 5.2 Página de datos del pasajero

Formulario con:
- Nombre completo
- Email
- Teléfono/WhatsApp
- Número de pasajeros
- Notas adicionales
- (Para Private/Round Trip) Número de vuelo

### 5.3 Confirmación y guardado

Guardar en nueva tabla `bookings` con estado `pending_payment` o `confirmed`.

### Archivos a crear:
- [ ] `app/[locale]/booking/page.tsx`
- [ ] `app/[locale]/booking/BookingFlow.tsx`
- [ ] `components/booking/VehicleSelection.tsx`
- [ ] `components/booking/PassengerForm.tsx`
- [ ] `components/booking/BookingSummary.tsx`

---

## Fase 6: Pasarela de Pagos (Stripe) - PARA DESPUÉS

### 6.1 Configuración Stripe
- Crear cuenta Stripe
- Obtener API keys (test y producción)
- Configurar webhooks

### 6.2 Flujo de pago
```
Confirmar reserva → Crear Payment Intent → Checkout Stripe → Webhook confirma pago → Actualizar booking
```

### Archivos a crear (futuro):
- [ ] `app/api/create-payment-intent/route.ts`
- [ ] `app/api/webhooks/stripe/route.ts`
- [ ] `components/booking/StripeCheckout.tsx`

---

## Cronograma Estimado

| Fase | Descripción | Duración | Dependencias |
|------|-------------|----------|--------------|
| **1** | Componente QuickBookingSearch | 2-3 días | - |
| **2** | Google Places Integration | 2-3 días | API Key de Google |
| **3** | Sistema de Zonas (DB + lógica) | 3-4 días | Definición de zonas del cliente |
| **4** | Admin Panel Zonas | 3-4 días | Fase 3 |
| **5** | Flujo de Reserva completo | 4-5 días | Fases 1-4 |
| **6** | Stripe (futuro) | 3-4 días | Cuenta Stripe |

**Total estimado (sin Stripe): 14-19 días**

---

## Preguntas Pendientes para el Cliente

### Zonas
1. ¿Cuántas zonas se van a definir?
2. ¿Tienen un mapa con las zonas ya delimitadas?
3. ¿Los precios son simétricos? (zona 1→3 = zona 3→1)

### Google Places
4. ¿Ya tienen cuenta de Google Cloud?
5. ¿Presupuesto mensual para API de Google? (~$200/mes para uso moderado)

### Vehículos
6. ¿Los mismos vehículos aplican para todos los tipos de transfer?
7. ¿El precio del Round Trip es exactamente el doble o tiene descuento?

### Flujo
8. ¿El usuario debe crear cuenta o puede reservar como invitado?
9. ¿Qué información se muestra en el email de confirmación?

---

## Stack Técnico Adicional

| Tecnología | Uso |
|------------|-----|
| `@googlemaps/js-api-loader` | Cargar Google Maps API |
| `@turf/turf` | Operaciones geoespaciales (point-in-polygon) |
| `stripe` | Pasarela de pagos (futuro) |
| `@stripe/stripe-js` | Stripe en frontend (futuro) |

---

## Siguiente Paso Inmediato

**Empezar por Fase 1:** Crear el componente `QuickBookingSearch` con los 3 tabs de servicio, usando datos mock mientras se implementa el resto.

¿Desea que comience con la implementación de la Fase 1?
