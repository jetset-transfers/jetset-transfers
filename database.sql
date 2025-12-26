-- ============================================
-- JETSET TRANSFERS - DATABASE SCHEMA
-- ============================================
-- Ejecutar en Supabase SQL Editor en orden
-- ============================================

-- ============================================
-- 1. TABLAS BASE (sin dependencias)
-- ============================================

-- Site Settings
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT site_settings_pkey PRIMARY KEY (id)
);

-- Site Content
CREATE TABLE public.site_content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  key character varying NOT NULL UNIQUE,
  value_es text NOT NULL,
  value_en text NOT NULL,
  category character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT site_content_pkey PRIMARY KEY (id)
);

-- Site Images
CREATE TABLE public.site_images (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  key character varying NOT NULL UNIQUE,
  url text NOT NULL,
  alt_es character varying,
  alt_en character varying,
  category character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_primary boolean DEFAULT false,
  CONSTRAINT site_images_pkey PRIMARY KEY (id)
);

-- Legal Pages
CREATE TABLE public.legal_pages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug character varying NOT NULL UNIQUE,
  title_es character varying NOT NULL,
  title_en character varying NOT NULL,
  content_es text NOT NULL DEFAULT ''::text,
  content_en text NOT NULL DEFAULT ''::text,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT legal_pages_pkey PRIMARY KEY (id)
);

-- Contact Info
CREATE TABLE public.contact_info (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  address_es text NOT NULL DEFAULT 'Aeropuerto Internacional de Cancún, Cancún, Q.R., México'::text,
  address_en text NOT NULL DEFAULT 'Cancún International Airport, Cancún, Q.R., Mexico'::text,
  phone character varying NOT NULL DEFAULT '+52 998 123 4567'::character varying,
  phone_link character varying NOT NULL DEFAULT '+529981234567'::character varying,
  email character varying NOT NULL DEFAULT 'info@jetsettransfers.com'::character varying,
  hours_es text NOT NULL DEFAULT 'Lunes a Domingo: 24 horas'::text,
  hours_en text NOT NULL DEFAULT 'Monday to Sunday: 24 hours'::text,
  whatsapp_number character varying NOT NULL DEFAULT '529981234567'::character varying,
  whatsapp_message_es text DEFAULT 'Hola, me gustaría obtener información sobre sus servicios de transporte.'::text,
  whatsapp_message_en text DEFAULT 'Hello, I would like to get information about your transportation services.'::text,
  google_maps_embed text DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2847392889904!2d-86.87699268507456!3d21.036544985994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4c2b05aef653db%3A0xce32b73c625fcd8a!2sAeropuerto%20Internacional%20de%20Canc%C3%BAn!5e0!3m2!1ses-419!2smx!4v1640000000000!5m2!1ses-419!2smx'::text,
  facebook_url text DEFAULT ''::text,
  instagram_url text DEFAULT ''::text,
  tiktok_url text DEFAULT ''::text,
  youtube_url text DEFAULT ''::text,
  tripadvisor_url text DEFAULT 'https://www.tripadvisor.com.mx/Attraction_Review-g150807-d27417188-Reviews-Jetset_Transfers-Cancun_Yucatan_Peninsula.html'::text,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  phones jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT contact_info_pkey PRIMARY KEY (id)
);

-- ============================================
-- 2. TRANSFER SERVICES
-- ============================================

CREATE TABLE public.transfer_services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label_es text NOT NULL,
  label_en text NOT NULL,
  icon text DEFAULT 'CheckCircleIcon'::text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transfer_services_pkey PRIMARY KEY (id)
);

INSERT INTO public.transfer_services (key, label_es, label_en, icon, display_order) VALUES
('ac', 'Aire acondicionado', 'Air conditioning', 'SparklesIcon', 1),
('wifi', 'WiFi a bordo', 'Onboard WiFi', 'WifiIcon', 2),
('water', 'Agua embotellada', 'Bottled water', 'BeakerIcon', 3),
('child_seat', 'Asiento para niños disponible', 'Child seat available', 'UserIcon', 4),
('flight_monitoring', 'Monitoreo en tiempo real', 'Real-time monitoring', 'ClockIcon', 5),
('meet_greet', 'Servicio meet & greet', 'Meet & greet service', 'HandRaisedIcon', 6),
('luggage', 'Asistencia con equipaje', 'Luggage assistance', 'ShoppingBagIcon', 7),
('insurance', 'Seguro de viajero', 'Traveler insurance', 'ShieldCheckIcon', 8),
('bilingual_driver', 'Conductor bilingüe', 'Bilingual driver', 'LanguageIcon', 9),
('sanitized', 'Vehículo sanitizado', 'Sanitized vehicle', 'SparklesIcon', 10);

-- ============================================
-- 3. VEHICLES
-- ============================================

CREATE TABLE public.vehicles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  slug character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  description_es text,
  description_en text,
  vehicle_type character varying NOT NULL DEFAULT 'suv',
  max_passengers integer NOT NULL DEFAULT 4,
  max_luggage integer NOT NULL DEFAULT 4,
  image_url text,
  gallery_images text[] DEFAULT ARRAY[]::text[],
  features_es text[] DEFAULT ARRAY[]::text[],
  features_en text[] DEFAULT ARRAY[]::text[],
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vehicles_pkey PRIMARY KEY (id)
);

INSERT INTO public.vehicles (slug, name, vehicle_type, max_passengers, max_luggage, description_es, description_en, features_es, features_en, display_order) VALUES
('suv-suburban', 'Suburban / SUV', 'suv', 5, 5, 'SUV de lujo ideal para familias pequeñas o parejas con equipaje.', 'Luxury SUV ideal for small families or couples with luggage.', ARRAY['Aire acondicionado', 'Asientos de piel', 'Amplio espacio para equipaje', 'USB para cargar dispositivos'], ARRAY['Air conditioning', 'Leather seats', 'Ample luggage space', 'USB charging ports'], 1),
('van-hiace', 'Van Toyota Hiace', 'van', 10, 10, 'Van amplia perfecta para grupos medianos y familias grandes.', 'Spacious van perfect for medium groups and large families.', ARRAY['Aire acondicionado', 'Espacio para 10 pasajeros', 'Compartimento grande para equipaje', 'Asientos cómodos'], ARRAY['Air conditioning', 'Space for 10 passengers', 'Large luggage compartment', 'Comfortable seats'], 2),
('sprinter', 'Mercedes Sprinter', 'sprinter', 14, 14, 'Sprinter de lujo para grupos grandes con máximo confort.', 'Luxury Sprinter for large groups with maximum comfort.', ARRAY['Aire acondicionado premium', 'Asientos ejecutivos', 'WiFi a bordo', 'Sistema de entretenimiento'], ARRAY['Premium air conditioning', 'Executive seats', 'Onboard WiFi', 'Entertainment system'], 3),
('luxury-sedan', 'Sedan de Lujo', 'sedan', 3, 3, 'Sedan ejecutivo para viajeros de negocios o parejas.', 'Executive sedan for business travelers or couples.', ARRAY['Interior de piel', 'Servicio VIP', 'Agua y snacks', 'Privacidad total'], ARRAY['Leather interior', 'VIP service', 'Water and snacks', 'Total privacy'], 4);

-- ============================================
-- 4. ZONES
-- ============================================

CREATE TABLE public.zones (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  slug character varying NOT NULL UNIQUE,
  name_es character varying NOT NULL,
  name_en character varying NOT NULL,
  description_es text,
  description_en text,
  travel_time character varying,
  distance_km numeric,
  image_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT zones_pkey PRIMARY KEY (id)
);

INSERT INTO public.zones (slug, name_es, name_en, travel_time, distance_km, display_order) VALUES
('zona-hotelera-cancun', 'Zona Hotelera Cancún', 'Cancun Hotel Zone', '20-30 min', 25, 1),
('puerto-morelos', 'Puerto Morelos', 'Puerto Morelos', '25-35 min', 35, 2),
('playa-del-carmen', 'Playa del Carmen', 'Playa del Carmen', '45-55 min', 68, 3),
('puerto-aventuras', 'Puerto Aventuras', 'Puerto Aventuras', '55-65 min', 85, 4),
('akumal', 'Akumal', 'Akumal', '65-75 min', 100, 5),
('tulum', 'Tulum', 'Tulum', '80-100 min', 130, 6),
('holbox', 'Holbox', 'Holbox', '120-150 min', 140, 7),
('costa-mujeres', 'Costa Mujeres', 'Costa Mujeres', '30-40 min', 30, 8);

-- ============================================
-- 5. DESTINATIONS
-- ============================================

CREATE TABLE public.destinations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  zone_id uuid,
  slug character varying NOT NULL UNIQUE,
  name_es character varying NOT NULL,
  name_en character varying NOT NULL,
  description_es text,
  description_en text,
  long_description_es text,
  long_description_en text,
  address text,
  travel_time character varying,
  distance_km numeric,
  price_from numeric,
  image_url text,
  gallery_images text[] DEFAULT ARRAY[]::text[],
  services_included text[] DEFAULT ARRAY['ac'::text, 'water'::text, 'luggage'::text, 'flight_monitoring'::text, 'meet_greet'::text],
  benefits jsonb DEFAULT '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo.", "desc_en": "Verified drivers and fully insured vehicles."},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio.", "desc_en": "Modern vehicles with AC and ample space."},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo en tiempo real para llegar siempre a tiempo.", "desc_en": "Real-time monitoring to always arrive on time."},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio de meet & greet y asistencia con equipaje.", "desc_en": "Meet & greet service and luggage assistance."}
  ]'::jsonb,
  vehicle_pricing jsonb DEFAULT '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 75, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 95, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 120, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  how_it_works jsonb DEFAULT '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a tu Destino", "title_en": "Transportation to your Destination", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  meta_title_es text,
  meta_title_en text,
  meta_description_es text,
  meta_description_en text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT destinations_pkey PRIMARY KEY (id),
  CONSTRAINT destinations_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zones(id)
);

-- ============================================
-- 6. BOOKINGS
-- ============================================

CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  booking_number character varying NOT NULL UNIQUE,
  customer_name character varying NOT NULL,
  customer_email character varying NOT NULL,
  customer_phone character varying NOT NULL,
  customer_country character varying,
  service_type character varying NOT NULL DEFAULT 'one_way',
  transfer_type character varying NOT NULL DEFAULT 'private',
  pickup_type character varying NOT NULL DEFAULT 'airport',
  pickup_location text,
  pickup_flight_number character varying,
  pickup_airline character varying,
  pickup_date date NOT NULL,
  pickup_time time NOT NULL,
  destination_id uuid,
  destination_zone_id uuid,
  destination_address text,
  destination_hotel text,
  return_pickup_location text,
  return_date date,
  return_time time,
  return_flight_number character varying,
  return_airline character varying,
  num_passengers integer NOT NULL DEFAULT 1,
  num_children integer DEFAULT 0,
  child_seats_needed integer DEFAULT 0,
  luggage_count integer DEFAULT 0,
  vehicle_id uuid,
  vehicle_name character varying,
  price_usd numeric NOT NULL,
  price_mxn numeric,
  discount_code character varying,
  discount_amount numeric DEFAULT 0,
  total_usd numeric NOT NULL,
  extras jsonb DEFAULT '[]'::jsonb,
  special_requests text,
  internal_notes text,
  status character varying DEFAULT 'pending',
  payment_status character varying DEFAULT 'pending',
  payment_method character varying,
  payment_reference character varying,
  driver_name character varying,
  driver_phone character varying,
  vehicle_plates character varying,
  confirmed_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  cancellation_reason text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id),
  CONSTRAINT bookings_destination_zone_id_fkey FOREIGN KEY (destination_zone_id) REFERENCES public.zones(id),
  CONSTRAINT bookings_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);

-- Función para generar número de reservación automático
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_number := 'JT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_number
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  WHEN (NEW.booking_number IS NULL)
  EXECUTE FUNCTION generate_booking_number();

-- ============================================
-- 7. CONTACT REQUESTS
-- ============================================

CREATE TABLE public.contact_requests (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  email character varying NOT NULL,
  phone character varying,
  request_type character varying DEFAULT 'quote',
  service_type character varying,
  transfer_type character varying,
  pickup_location character varying,
  pickup_location_other text,
  destination_id uuid,
  destination_other text,
  travel_date date,
  travel_time character varying,
  return_date date,
  return_time character varying,
  num_passengers integer,
  num_children integer,
  vehicle_id uuid,
  vehicle_preferred character varying,
  message text,
  status character varying DEFAULT 'pending',
  assigned_to character varying,
  response_notes text,
  responded_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_requests_pkey PRIMARY KEY (id),
  CONSTRAINT contact_requests_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id),
  CONSTRAINT contact_requests_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);

-- ============================================
-- 8. INDEXES
-- ============================================

CREATE INDEX idx_destinations_zone_id ON public.destinations(zone_id);
CREATE INDEX idx_destinations_is_active ON public.destinations(is_active);
CREATE INDEX idx_destinations_is_featured ON public.destinations(is_featured);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_pickup_date ON public.bookings(pickup_date);
CREATE INDEX idx_bookings_customer_email ON public.bookings(customer_email);
CREATE INDEX idx_bookings_booking_number ON public.bookings(booking_number);
CREATE INDEX idx_zones_is_active ON public.zones(is_active);
CREATE INDEX idx_vehicles_is_active ON public.vehicles(is_active);
CREATE INDEX idx_contact_requests_status ON public.contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON public.contact_requests(created_at);

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "Public read access" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.site_images FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.legal_pages FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "Public read active" ON public.transfer_services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON public.vehicles FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON public.zones FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON public.destinations FOR SELECT USING (is_active = true);

-- Políticas de inserción pública (formularios)
CREATE POLICY "Public insert" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert" ON public.contact_requests FOR INSERT WITH CHECK (true);

-- Políticas de admin (usuarios autenticados)
CREATE POLICY "Admin full access" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.site_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.site_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.legal_pages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.contact_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.transfer_services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.vehicles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.zones FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.destinations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.bookings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.contact_requests FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 10. INSERT INITIAL CONTACT INFO
-- ============================================

INSERT INTO public.contact_info (id) VALUES (gen_random_uuid());

-- ============================================
-- RESUMEN DE TABLAS
-- ============================================
-- site_settings      - Configuraciones del sitio
-- site_content       - Contenido dinámico (textos)
-- site_images        - Galería de imágenes
-- legal_pages        - Páginas legales
-- contact_info       - Información de contacto
-- transfer_services  - Servicios incluidos en traslados
-- vehicles           - Flota de vehículos
-- zones              - Zonas de destino
-- destinations       - Hoteles y lugares específicos
-- bookings           - Reservaciones
-- contact_requests   - Solicitudes de cotización
-- ============================================
