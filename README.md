# Jetset Transfers - Private Ground Transportation

Sitio web moderno para Jetset Transfers, empresa de transporte terrestre privado en Cancún y la Riviera Maya.

## Tecnologías

- **Next.js 15+** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **next-intl** - Internacionalización (ES/EN)
- **Supabase** - Backend y base de datos
- **Heroicons** - Iconos

## Estructura del Proyecto

```
jetset-transfers/
├── app/
│   ├── [locale]/           # Rutas internacionalizadas
│   │   ├── destinations/   # Destinos de traslado
│   │   ├── contact/        # Página de contacto
│   │   └── page.tsx        # Página principal
│   ├── admin/              # Panel de administración
│   └── globals.css         # Estilos globales
├── components/
│   ├── home/               # Componentes de la página principal
│   ├── admin/              # Componentes del panel admin
│   └── layout/             # Header y Footer
├── locales/                # Traducciones (es/en)
└── lib/
    └── supabase/           # Cliente de Supabase
```

## Comandos

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## Internacionalización

- **Español (ES)** - Idioma por defecto
- **English (EN)**

Rutas:
- `/es` - Versión en español
- `/en` - Versión en inglés

## Panel de Administración

Acceso en `/admin` con autenticación de Supabase.

Páginas disponibles:
- Dashboard - Estadísticas generales
- Destinos - Gestión de destinos de traslado
- Zonas - Zonas de servicio
- Vehículos - Flota de vehículos
- Imágenes - Galería de imágenes
- Contenido - Contenido del sitio
- Mensajes - Solicitudes de contacto
- Configuración - Ajustes del sitio

## Base de Datos (Supabase)

Tablas principales:
- `destinations` - Destinos de traslado con precios
- `zones` - Zonas de servicio
- `vehicles` - Flota de vehículos
- `site_images` - Galería de imágenes
- `site_content` - Contenido dinámico
- `contact_requests` - Mensajes de contacto

## Contacto

- **TripAdvisor**: https://www.tripadvisor.com.mx/Attraction_Review-g150807-d27417188-Reviews-Jetset_Transfers-Cancun_Yucatan_Peninsula.html

---

Desarrollado para Jetset Transfers
