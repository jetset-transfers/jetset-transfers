-- =============================================================================
-- Jetset Transfers - Inserción de 19 Destinos
-- Generado a partir de CONTENIDO-VIEJA-PAGINA-JETSET.md
-- Tipo de cambio aproximado: 20.5 MXN = 1 USD
-- =============================================================================

-- Eliminar destinos existentes (opcional - comentar si deseas mantener los existentes)
-- TRUNCATE TABLE public.destinations RESTART IDENTITY CASCADE;

-- =============================================================================
-- 1. TULUM
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'tulum',
  'Tulum',
  'Tulum',
  'Traslado privado desde el Aeropuerto de Cancún a Tulum. La opción más segura, rápida y fácil.',
  'Private shuttle from Cancun Airport to Tulum. The safest, fastest and easiest choice.',
  'Tulum es un tesoro de experiencias únicas en el Caribe. Es una oportunidad para conectar verdaderamente con la naturaleza e sumergirte en el misticismo de las ruinas y cultura maya. Comparado con el ajetreo de Cancún y otras ciudades importantes de Quintana Roo, Tulum ofrece un ambiente sereno y relajado, perfecto para descansar.',
  'Tulum is a treasure trove of unique experiences in the Caribbean. It''s a chance to truly connect with nature and immerse yourself in the mystique of Mayan ruins and culture. Compared to the hustle and bustle of Cancun and other major Quintana Roo cities, Tulum offers a serene and laid-back ambiance that''s perfect for relaxation.',
  '80-100 min',
  110,
  true,
  1,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 110, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 140, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 180, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Tulum", "title_en": "Transportation to Tulum", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 2. CANCUN (Zona Hotelera)
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'cancun',
  'Cancún',
  'Cancun',
  'Traslado privado desde el Aeropuerto de Cancún a la Zona Hotelera. Rápido y sin complicaciones.',
  'Private shuttle from Cancun Airport to the Hotel Zone. Fast and hassle-free.',
  'Ubicado en el norte de la Península de Yucatán, Cancún es conocido como el destino vacacional por excelencia del Caribe Mexicano. Desde su atractivo frente marítimo hasta sus bulliciosos mercados y clubes nocturnos, es el lugar ideal para una escapada memorable.',
  'Located in the north of the Yucatán Peninsula, Cancun is known to be the holiday destination in the Mexican Caribbean. From its inviting seafront to its bustling markets and nightclubs, it''s the go-to place for a memorable getaway.',
  '20-30 min',
  47,
  true,
  2,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 47, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 65, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 85, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Cancún", "title_en": "Transportation to Cancun", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 3. HOLBOX (Chiquila)
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'holbox',
  'Holbox (Chiquilá)',
  'Holbox (Chiquila)',
  'Traslado privado desde el Aeropuerto de Cancún a Chiquilá, puerto de embarque hacia Isla Holbox.',
  'Private shuttle from Cancun Airport to Chiquila, the departure port to Holbox Island.',
  'Holbox es una impresionante isla paradisíaca en la costa norte de la Península de Yucatán. Conocida por sus playas prístinas, aguas bioluminiscentes y ambiente relajado, es el escape perfecto de las multitudes. Nota: Nuestro servicio de traslado te lleva a Chiquilá, donde puedes tomar el ferry a la Isla Holbox.',
  'Holbox is a stunning island paradise off the northern coast of the Yucatán Peninsula. Known for its pristine beaches, bioluminescent waters, and laid-back vibe, it''s the perfect escape from the crowds. Note: Our shuttle service takes you to Chiquila, where you can catch a ferry to Holbox Island.',
  '120 min',
  156,
  true,
  3,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 156, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 195, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 245, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Chiquilá/Holbox", "title_en": "Transportation to Chiquila/Holbox", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 4. TERMINALES DEL AEROPUERTO
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'airport-terminals',
  'Terminales del Aeropuerto',
  'Airport Terminals',
  'Traslado privado entre terminales del Aeropuerto Internacional de Cancún.',
  'Private shuttle between Cancun International Airport terminals.',
  '¿Necesitas ir de una terminal a otra en el Aeropuerto Internacional de Cancún? Nuestro servicio de traslado entre terminales ofrece transferencias rápidas y cómodas, asegurando que llegues a tu conexión sin estrés.',
  'Need to get from one terminal to another at Cancun International Airport? Our inter-terminal shuttle service provides quick and comfortable transfers, ensuring you make your connection without stress.',
  '10 min',
  32,
  true,
  4,
  ARRAY['climate', 'luggage', 'water', 'meet_greet'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Servicio rápido para que no pierdas tu conexión", "desc_en": "Fast service so you dont miss your connection"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 32, "notes_es": "Traslado rápido entre terminales", "notes_en": "Quick transfer between terminals"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 45, "notes_es": "Para grupos con equipaje", "notes_en": "For groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte entre Terminales", "title_en": "Transportation between Terminals", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 5. AKUMAL
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'akumal',
  'Akumal',
  'Akumal',
  'Traslado privado desde el Aeropuerto de Cancún a Akumal. Nada con tortugas marinas.',
  'Private shuttle from Cancun Airport to Akumal. Swim with sea turtles.',
  'Akumal, que significa "Lugar de las Tortugas" en maya, es una pequeña comunidad de playa famosa por sus encuentros con tortugas marinas. Nada junto a estas magníficas criaturas en aguas cristalinas y disfruta del ambiente relajado de este paraíso caribeño.',
  'Akumal, meaning "Place of the Turtles" in Mayan, is a small beach resort community famous for its sea turtle encounters. Swim alongside these magnificent creatures in crystal-clear waters and enjoy the relaxed atmosphere of this Caribbean paradise.',
  '60-75 min',
  80,
  true,
  5,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 80, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 105, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 135, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Akumal", "title_en": "Transportation to Akumal", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 6. CHETUMAL
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'chetumal',
  'Chetumal',
  'Chetumal',
  'Traslado privado desde el Aeropuerto de Cancún a Chetumal, capital de Quintana Roo.',
  'Private shuttle from Cancun Airport to Chetumal, capital of Quintana Roo.',
  'Chetumal es la capital de Quintana Roo, ubicada en la frontera con Belice. Ofrece una mezcla única de culturas mexicana y caribeña, con acceso a cenotes cercanos, lagunas y la famosa Laguna de Bacalar de los Siete Colores.',
  'Chetumal is the capital of Quintana Roo, located on the border with Belize. It offers a unique blend of Mexican and Caribbean cultures, with access to nearby cenotes, lagoons, and the famous Bacalar Lagoon of Seven Colors.',
  '4-5 hrs',
  435,
  true,
  6,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 435, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 520, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 620, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Chetumal", "title_en": "Transportation to Chetumal", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 7. CHICHEN ITZA
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'chichen-itza',
  'Chichén Itzá',
  'Chichen Itza',
  'Traslado privado desde el Aeropuerto de Cancún a Chichén Itzá. Maravilla del Mundo.',
  'Private shuttle from Cancun Airport to Chichen Itza. Wonder of the World.',
  'Chichén Itzá es un impresionante sitio arqueológico con algunas de las ruinas mayas más icónicas. Déjate maravillar por la pirámide de Kukulkán y aprende sobre las civilizaciones antiguas. Si viajas de Cancún a Chichén Itzá, nuestro servicio de traslado garantiza un viaje cómodo y puntual.',
  'Chichen Itza is a breathtaking archaeological site with some of the most iconic Mayan ruins. Be amazed by the Kukulkan pyramid and learn about ancient civilizations. If you''re traveling from Cancun to Chichen Itza, our shuttle service ensures a comfortable and prompt journey.',
  '2.5-3 hrs',
  327,
  true,
  7,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 327, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 395, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 475, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Chichén Itzá", "title_en": "Transportation to Chichen Itza", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 8. CROCO CUN
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'croco-cun',
  'Croco Cun',
  'Croco Cun',
  'Traslado privado desde el Aeropuerto de Cancún a Croco Cun Zoo. Aventura con cocodrilos.',
  'Private shuttle from Cancun Airport to Croco Cun Zoo. Crocodile adventure.',
  'Crococun es un cautivador santuario de vida silvestre al sur de Cancún. Ofrece a los visitantes una oportunidad única de acercarse a la flora y fauna nativa, particularmente cocodrilos. Crococun brinda un toque refrescante de naturaleza y aventura.',
  'Crococun is a captivating wildlife sanctuary in the south of Cancun. It offers visitors a unique opportunity to get up close with native flora and fauna, particularly crocodiles. Crococun provides a refreshing touch of nature and adventure.',
  '25 min',
  48,
  true,
  8,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 48, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 65, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 85, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Croco Cun", "title_en": "Transportation to Croco Cun", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 9. MAHAHUAL
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'mahahual',
  'Mahahual',
  'Mahahual',
  'Traslado privado desde el Aeropuerto de Cancún a Mahahual. Playas vírgenes del Caribe.',
  'Private shuttle from Cancun Airport to Mahahual. Pristine Caribbean beaches.',
  'Mahahual es un tranquilo pueblo costero, donde las aguas azul claro se encuentran con playas blancas. Es el favorito de quienes buscan un ambiente relajado lejos de los grandes hoteles y las multitudes ruidosas.',
  'Mahahual is a quiet coastal town, where clear blue waters meet white beaches. It''s a favorite for those seeking a relaxed atmosphere away from big hotels and loud crowds.',
  '4 hrs',
  366,
  true,
  9,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 366, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 440, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 520, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Mahahual", "title_en": "Transportation to Mahahual", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 10. MAROMA MAYAKOBA
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'maroma-mayakoba',
  'Maroma Mayakoba',
  'Maroma Mayakoba',
  'Traslado privado desde el Aeropuerto de Cancún a Maroma/Mayakoba. Resorts de lujo.',
  'Private shuttle from Cancun Airport to Maroma/Mayakoba. Luxury resorts.',
  'Maroma/Mayakoba son escapes lujosos ubicados a lo largo de la Riviera Maya entre Puerto Morelos y Playa del Carmen. Conocidos por sus resorts de lujo, playas serenas y campos de golf de clase mundial, ofrecen una mezcla de relajación y aventura.',
  'Maroma/Mayakoba are luxurious escapes located along the Riviera Maya between Puerto Morelos and Playa del Carmen. Known for their luxurious resorts, serene beaches, and world-class golf courses, they offer a mix of relaxation and adventure.',
  '35-45 min',
  54,
  true,
  10,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 54, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 75, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 95, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Maroma/Mayakoba", "title_en": "Transportation to Maroma/Mayakoba", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 11. MERIDA
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'merida',
  'Mérida',
  'Merida',
  'Traslado privado desde el Aeropuerto de Cancún a Mérida. Ciudad Blanca de Yucatán.',
  'Private shuttle from Cancun Airport to Merida. White City of Yucatan.',
  'Mérida es una encantadora ciudad que mezcla rica historia con arte y estilo de vida moderno. Conocida por sus calles coloniales rústicas, plazas animadas y mercados locales, es un centro de cultura y tradiciones yucatecas.',
  'Merida is a charming city that blends rich history with modern art and lifestyle. Known for its rustic colonial streets, lively plazas, and local markets, it''s a hub of Yucatan culture and traditions.',
  '4-5 hrs',
  435,
  true,
  11,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 435, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 520, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 620, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Mérida", "title_en": "Transportation to Merida", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 12. MOON PALACE
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'moon-palace',
  'Moon Palace',
  'Moon Palace',
  'Traslado privado desde el Aeropuerto de Cancún a Moon Palace Resort. Todo incluido de lujo.',
  'Private shuttle from Cancun Airport to Moon Palace Resort. Luxury all-inclusive.',
  'Moon Palace es un oasis de lujo ubicado justo al sur de Cancún. Es el lugar ideal para disfrutar del lado opulento del Caribe. Mientras Cancún ofrece un ambiente animado, Moon Palace promete exclusividad y tranquilidad en un entorno de resort.',
  'Moon Palace is an oasis of luxury located just south of Cancun. It''s the ideal place to indulge in the opulent side of the Caribbean. While Cancun offers a lively atmosphere, Moon Palace promises exclusivity and tranquility in a resort setting.',
  '20-25 min',
  47,
  true,
  12,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 47, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 65, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 85, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Moon Palace", "title_en": "Transportation to Moon Palace", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 13. COSTA MUJERES
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'costa-mujeres',
  'Costa Mujeres',
  'Costa Mujeres',
  'Traslado privado desde el Aeropuerto de Cancún a Costa Mujeres. Resorts exclusivos.',
  'Private shuttle from Cancun Airport to Costa Mujeres. Exclusive resorts.',
  'Costa Mujeres es un paraíso emergente al norte de Cancún, conocido por sus playas prístinas, resorts de clase mundial y atmósfera tranquila. Ofrece una alternativa más exclusiva y pacífica a la bulliciosa Zona Hotelera mientras sigue cerca de toda la acción.',
  'Costa Mujeres is an emerging paradise north of Cancun, known for its pristine beaches, world-class resorts, and tranquil atmosphere. It offers a more exclusive and peaceful alternative to the bustling Hotel Zone while still being close to all the action.',
  '30-40 min',
  56,
  true,
  13,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 56, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 75, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 95, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Costa Mujeres", "title_en": "Transportation to Costa Mujeres", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 14. PLAYACAR
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'playacar',
  'Playacar',
  'Playacar',
  'Traslado privado desde el Aeropuerto de Cancún a Playacar. Comunidad exclusiva con golf.',
  'Private shuttle from Cancun Airport to Playacar. Exclusive community with golf.',
  'Playacar es una comunidad exclusiva de resorts ubicada justo al sur de Playa del Carmen. Con sus hermosas playas, exuberantes campos de golf y proximidad a ruinas mayas, ofrece una mezcla perfecta de relajación y exploración.',
  'Playacar is an exclusive gated resort community located just south of Playa del Carmen. With its beautiful beaches, lush golf courses, and proximity to Mayan ruins, it offers a perfect blend of relaxation and exploration.',
  '50-60 min',
  61,
  true,
  14,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 61, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 85, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 110, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Playacar", "title_en": "Transportation to Playacar", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 15. PLAYA DEL CARMEN
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'playa-del-carmen',
  'Playa del Carmen',
  'Playa del Carmen',
  'Traslado privado desde el Aeropuerto de Cancún a Playa del Carmen. Corazón de la Riviera Maya.',
  'Private shuttle from Cancun Airport to Playa del Carmen. Heart of the Riviera Maya.',
  'Playa del Carmen es una vibrante ciudad costera en el corazón de la Riviera Maya. Famosa por su peatonal Quinta Avenida, impresionantes playas y animada vida nocturna, es el destino perfecto para quienes buscan tanto relajación como emoción.',
  'Playa del Carmen is a vibrant coastal city in the heart of the Riviera Maya. Famous for its pedestrian-friendly Quinta Avenida, stunning beaches, and thriving nightlife, it''s the perfect destination for those seeking both relaxation and excitement.',
  '45-55 min',
  61,
  true,
  15,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 61, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 85, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 110, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Playa del Carmen", "title_en": "Transportation to Playa del Carmen", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 16. PUERTO AVENTURAS
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'puerto-aventuras',
  'Puerto Aventuras',
  'Puerto Aventuras',
  'Traslado privado desde el Aeropuerto de Cancún a Puerto Aventuras. Marina y delfines.',
  'Private shuttle from Cancun Airport to Puerto Aventuras. Marina and dolphins.',
  'Puerto Aventuras es una comunidad resort y marina ubicada entre Playa del Carmen y Tulum. Ofrece una combinación única de playa, golf y encuentros con delfines, siendo un destino ideal para familias y buscadores de aventura.',
  'Puerto Aventuras is a resort community and marina located between Playa del Carmen and Tulum. It offers a unique combination of beach, golf, and dolphin encounters, making it an ideal destination for families and adventure seekers.',
  '55-65 min',
  73,
  true,
  16,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 73, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 95, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 125, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Puerto Aventuras", "title_en": "Transportation to Puerto Aventuras", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 17. PUERTO MORELOS
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'puerto-morelos',
  'Puerto Morelos',
  'Puerto Morelos',
  'Traslado privado desde el Aeropuerto de Cancún a Puerto Morelos. Pueblo pesquero encantador.',
  'Private shuttle from Cancun Airport to Puerto Morelos. Charming fishing village.',
  'Puerto Morelos es un encantador pueblo pesquero entre Cancún y Playa del Carmen. Conocido por su colorido faro inclinado, excelente snorkel en el Arrecife Mesoamericano y auténtica atmósfera mexicana, es perfecto para quienes buscan una experiencia caribeña más tranquila.',
  'Puerto Morelos is a charming fishing village between Cancun and Playa del Carmen. Known for its colorful leaning lighthouse, excellent snorkeling on the Mesoamerican Reef, and authentic Mexican atmosphere, it''s perfect for those seeking a quieter Caribbean experience.',
  '25-35 min',
  78,
  true,
  17,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 78, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 95, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 125, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Puerto Morelos", "title_en": "Transportation to Puerto Morelos", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 18. VALLADOLID
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'valladolid',
  'Valladolid',
  'Valladolid',
  'Traslado privado desde el Aeropuerto de Cancún a Valladolid. Ciudad colonial mágica.',
  'Private shuttle from Cancun Airport to Valladolid. Magical colonial city.',
  'Valladolid es una encantadora ciudad colonial en el corazón de la Península de Yucatán. Conocida por sus coloridos edificios, iglesias históricas y proximidad a cenotes y Chichén Itzá, ofrece una visión auténtica de la cultura e historia mexicana.',
  'Valladolid is a charming colonial city in the heart of the Yucatan Peninsula. Known for its colorful buildings, historic churches, and proximity to cenotes and Chichen Itza, it offers an authentic glimpse into Mexican culture and history.',
  '2-2.5 hrs',
  268,
  true,
  18,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 268, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 325, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 395, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Valladolid", "title_en": "Transportation to Valladolid", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- 19. XCARET
-- =============================================================================
INSERT INTO public.destinations (
  slug, name_es, name_en, description_es, description_en,
  long_description_es, long_description_en,
  travel_time, price_from, is_active, display_order,
  services_included, benefits, vehicle_pricing, how_it_works
) VALUES (
  'xcaret',
  'Xcaret',
  'Xcaret',
  'Traslado privado desde el Aeropuerto de Cancún a Xcaret. Parque eco-arqueológico.',
  'Private shuttle from Cancun Airport to Xcaret. Eco-archaeological park.',
  'Xcaret es un parque eco-arqueológico de renombre mundial en la Riviera Maya. Con ríos subterráneos, encuentros con vida silvestre, espectáculos culturales y ruinas mayas antiguas, ofrece una experiencia inolvidable que combina naturaleza, aventura y cultura.',
  'Xcaret is a world-renowned eco-archaeological park on the Riviera Maya. With underground rivers, wildlife encounters, cultural shows, and ancient Mayan ruins, it offers an unforgettable experience combining nature, adventure, and culture.',
  '50-60 min',
  61,
  true,
  19,
  ARRAY['climate', 'luggage', 'water', 'flight_monitoring', 'meet_greet', 'insurance'],
  '[
    {"key": "safety", "title_es": "Seguridad garantizada", "title_en": "Guaranteed safety", "desc_es": "Conductores verificados y vehículos con seguro completo", "desc_en": "Verified drivers and fully insured vehicles"},
    {"key": "comfort", "title_es": "Máximo confort", "title_en": "Maximum comfort", "desc_es": "Vehículos modernos con aire acondicionado y espacio amplio", "desc_en": "Modern vehicles with AC and ample space"},
    {"key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "Monitoreo de vuelos en tiempo real para llegar siempre a tiempo", "desc_en": "Real-time flight monitoring to always arrive on time"},
    {"key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "Servicio meet & greet y asistencia con equipaje", "desc_en": "Meet & greet service and luggage assistance"}
  ]'::jsonb,
  '[
    {"vehicle_name": "SUV", "max_passengers": 5, "price_usd": 61, "notes_es": "Ideal para parejas o familias pequeñas", "notes_en": "Ideal for couples or small families"},
    {"vehicle_name": "Van", "max_passengers": 10, "price_usd": 85, "notes_es": "Perfecto para grupos medianos", "notes_en": "Perfect for medium groups"},
    {"vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 110, "notes_es": "Para grupos grandes con equipaje", "notes_en": "For large groups with luggage"}
  ]'::jsonb,
  '[
    {"step": 1, "title_es": "Planifica tu Traslado", "title_en": "Plan your Shuttle Service", "description_es": "Tu familia y amigos merecen empezar sus vacaciones sin preocupaciones. En Jetset nos aseguramos de que esto suceda y somos muy flexibles para reservar tu servicio de traslado privado.", "description_en": "You, your family and friends should get right to the good part when going on vacation. At Jetset we make sure that this happens and are highly flexible when it comes to reserving your private shuttle service.", "features_es": ["Disponibilidad 24/7 por WhatsApp", "Nuestro equipo monitorea vuelos y organiza tu llegada", "No te preocupes por manejar o negociar precios", "Siempre proporcionamos la ruta más eficiente"], "features_en": ["24/7 availability over WhatsApp", "Our staff checks flights and organizes your arrival", "You dont need to worry about driving or price negotiations", "We always provide the most efficient route"]},
    {"step": 2, "title_es": "Llegada al Aeropuerto", "title_en": "Arrival at Cancun Airport", "description_es": "Te estaremos esperando a la hora de tu llegada fuera del aeropuerto, para que la transición desde bajar del avión hasta abrir la puerta de tu hotel pase en un abrir y cerrar de ojos.", "description_en": "We will be expecting you at the time of arrival outside the airport, to make the transition from getting out of the plane to opening the door to hotel room pass by in the blink of an eye.", "features_es": ["Nuestro equipo monitorea vuelos y organiza tu llegada", "Te esperamos justo en el aeropuerto", "Comunicación continua con tu conductor por WhatsApp"], "features_en": ["Our staff checks flights and organizes your arrival", "We expect your arrival right at the airport", "Ongoing communication with your driver over WhatsApp or Messenger"]},
    {"step": 3, "title_es": "Transporte a Xcaret", "title_en": "Transportation to Xcaret", "description_es": "Nuestros conductores bilingües te llevarán a tu destino de la manera más rápida y segura posible en uno de nuestros vehículos nuevos.", "description_en": "Our bilingual drivers will get you to your destiny in the fastest and safest way possible in one of our brand new shuttles.", "features_es": ["Vehículos nuevos con aire acondicionado de doble zona", "Bebidas frescas incluidas", "Conductores bilingües y certificados"], "features_en": ["New shuttles with Dual Zone Air Conditioning", "Fresh beverages included", "Bilingual and certified drivers"]}
  ]'::jsonb
);

-- =============================================================================
-- VERIFICACIÓN
-- =============================================================================
-- Ejecuta esta consulta para verificar que se insertaron correctamente:
-- SELECT slug, name_es, price_from, travel_time FROM public.destinations ORDER BY display_order;
