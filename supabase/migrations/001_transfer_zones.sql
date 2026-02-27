-- =====================================================
-- TRANSFER ZONES - Sistema de zonas para Transfer One Way
-- =====================================================

-- Tabla de zonas geográficas
CREATE TABLE IF NOT EXISTS transfer_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_number INTEGER UNIQUE NOT NULL,  -- 1, 2, 3, 4, 5...
  name_es VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  description_es TEXT,
  description_en TEXT,

  -- Polígono que define la zona (array de coordenadas)
  -- Formato: [[lng, lat], [lng, lat], ...] - GeoJSON style
  boundaries JSONB NOT NULL DEFAULT '[]',

  -- Color para visualización en mapa admin
  color VARCHAR(7) DEFAULT '#3B82F6',

  -- Estado
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de precios entre zonas
CREATE TABLE IF NOT EXISTS zone_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_zone_id UUID NOT NULL REFERENCES transfer_zones(id) ON DELETE CASCADE,
  destination_zone_id UUID NOT NULL REFERENCES transfer_zones(id) ON DELETE CASCADE,

  -- Precios por tipo de vehículo
  -- Formato: [{"vehicle_name": "Sedan", "max_passengers": 3, "price_usd": 45}, ...]
  vehicle_pricing JSONB NOT NULL DEFAULT '[]',

  -- Información del trayecto
  duration_minutes INTEGER,
  distance_km DECIMAL(6,2),

  -- Estado
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Evitar duplicados de ruta
  UNIQUE(origin_zone_id, destination_zone_id)
);

-- Tabla de reservas (bookings)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Información del cliente
  customer_name VARCHAR(200) NOT NULL,
  customer_email VARCHAR(200) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,

  -- Tipo de servicio
  service_type VARCHAR(50) NOT NULL, -- 'private', 'roundtrip', 'oneway'

  -- Para Private/Round Trip
  destination_id UUID REFERENCES destinations(id),

  -- Para Transfer One Way
  origin_zone_id UUID REFERENCES transfer_zones(id),
  destination_zone_id UUID REFERENCES transfer_zones(id),
  origin_place_name VARCHAR(300),  -- Nombre del lugar (Google Places)
  origin_place_address VARCHAR(500),
  origin_lat DECIMAL(10, 8),
  origin_lng DECIMAL(11, 8),
  destination_place_name VARCHAR(300),
  destination_place_address VARCHAR(500),
  destination_lat DECIMAL(10, 8),
  destination_lng DECIMAL(11, 8),

  -- Detalles del viaje
  pickup_location VARCHAR(500),  -- Hotel/dirección de recogida
  travel_date DATE NOT NULL,
  travel_time TIME NOT NULL,
  return_date DATE,
  return_time TIME,
  num_passengers INTEGER NOT NULL DEFAULT 1,
  flight_number VARCHAR(50),

  -- Vehículo y precio
  vehicle_name VARCHAR(100) NOT NULL,
  price_usd DECIMAL(10, 2) NOT NULL,
  price_mxn DECIMAL(10, 2),

  -- Pago
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  stripe_payment_intent_id VARCHAR(200),
  stripe_session_id VARCHAR(200),
  paid_at TIMESTAMPTZ,

  -- Estado de la reserva
  booking_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  confirmation_code VARCHAR(20) UNIQUE,

  -- Notas
  customer_notes TEXT,
  internal_notes TEXT,

  -- Metadata
  locale VARCHAR(5) DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_bookings_confirmation ON bookings(confirmation_code);
CREATE INDEX IF NOT EXISTS idx_zone_pricing_origin ON zone_pricing(origin_zone_id);
CREATE INDEX IF NOT EXISTS idx_zone_pricing_dest ON zone_pricing(destination_zone_id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transfer_zones_updated_at
  BEFORE UPDATE ON transfer_zones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zone_pricing_updated_at
  BEFORE UPDATE ON zone_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar código de confirmación único
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmation_code IS NULL THEN
    NEW.confirmation_code = 'JET-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_confirmation_code
  BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION generate_confirmation_code();

-- RLS Policies
ALTER TABLE transfer_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Políticas para transfer_zones (lectura pública, escritura autenticada)
CREATE POLICY "Zonas visibles públicamente" ON transfer_zones
  FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden modificar zonas" ON transfer_zones
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para zone_pricing
CREATE POLICY "Precios visibles públicamente" ON zone_pricing
  FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden modificar precios" ON zone_pricing
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para bookings
CREATE POLICY "Usuarios pueden ver sus propias reservas" ON bookings
  FOR SELECT USING (true); -- Ajustar según necesidades

CREATE POLICY "Cualquiera puede crear reserva" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Solo admins pueden modificar reservas" ON bookings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- =====================================================
-- DATOS INICIALES - Zonas de ejemplo
-- =====================================================

INSERT INTO transfer_zones (zone_number, name_es, name_en, description_es, description_en, color, boundaries) VALUES
(1, 'Aeropuerto de Cancún', 'Cancun Airport', 'Aeropuerto Internacional de Cancún (CUN)', 'Cancun International Airport (CUN)', '#EF4444', '[]'),
(2, 'Zona Hotelera Cancún', 'Cancun Hotel Zone', 'Zona hotelera de Cancún', 'Cancun Hotel Zone', '#F97316', '[]'),
(3, 'Puerto Morelos', 'Puerto Morelos', 'Puerto Morelos y alrededores', 'Puerto Morelos and surroundings', '#EAB308', '[]'),
(4, 'Playa del Carmen', 'Playa del Carmen', 'Playa del Carmen centro y alrededores', 'Playa del Carmen downtown and surroundings', '#22C55E', '[]'),
(5, 'Puerto Aventuras / Akumal', 'Puerto Aventuras / Akumal', 'Puerto Aventuras, Akumal y Xpu-Ha', 'Puerto Aventuras, Akumal and Xpu-Ha', '#14B8A6', '[]'),
(6, 'Tulum', 'Tulum', 'Tulum pueblo y zona hotelera', 'Tulum town and hotel zone', '#3B82F6', '[]'),
(7, 'Más allá de Tulum', 'Beyond Tulum', 'Bacalar, Mahahual y más al sur', 'Bacalar, Mahahual and further south', '#8B5CF6', '[]')
ON CONFLICT (zone_number) DO NOTHING;

-- Comentario: Los boundaries (polígonos) deben ser definidos por el admin
-- usando un editor de mapa que permita dibujar las zonas
