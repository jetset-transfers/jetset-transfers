# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jetset Transfers is a bilingual (Spanish/English) website for a private ground transportation company based in Cancún, Mexico. The company provides safe, private, and punctual transportation from Cancun Airport to hotels and tourist destinations across the Riviera Maya. Built with Next.js 15+ App Router, TypeScript, Tailwind CSS, next-intl for internationalization, and Supabase for backend/database.

### About the Company
At Jetset Transfers, we provide safe, private and punctual transportation from Cancun Airport to Hotels and tourist destinations across the Riviera Maya. Our team focuses on delivering a professional experience with comfortable vehicles, trained drivers, and personalized attention. We are committed to offering a smooth, efficient, and worry-free journey for every traveler.

- **TripAdvisor**: https://www.tripadvisor.com.mx/Attraction_Review-g150807-d27417188-Reviews-Jetset_Transfers-Cancun_Yucatan_Peninsula.html

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Internationalization (i18n)
- **Routes**: All public pages are under `app/[locale]/` using dynamic locale segment
- **Supported locales**: `es` (Spanish, default), `en` (English)
- **Configuration**: `i18n.ts` defines request config, `middleware.ts` handles routing
- **Translation files**: `locales/{es,en}/common.json` and `locales/{es,en}/home.json`
- **Pattern**: Use `useTranslations()` hook in client components, `getTranslations()` in server components

### Next.js 15+ Specifics
- **Params as Promise**: Route params must be awaited: `const { locale } = await params;`
- **Middleware file**: Uses `middleware.ts`

### Component Structure
- `components/home/` - Homepage sections (HeroSection, ServicesSection)
- `components/layout/` - Global layout (Header, Footer)
- `components/ui/` - Reusable UI components
- `components/seo/` - SEO components (SchemaMarkup with JSON-LD schemas)
- `components/admin/` - Admin panel components (AdminLayout, AdminSidebar, ImageSelector)
- Client components use `'use client'` directive

### Admin Panel
- **Location**: `app/admin/` (no locale prefix)
- **Authentication**: Supabase Auth with protected routes
- **Pages**:
  - `/admin/dashboard` - Main dashboard
  - `/admin/destinations` - Manage transfer destinations (hotels, zones)
  - `/admin/vehicles` - Manage vehicle fleet
  - `/admin/services` - Manage transfer services
  - `/admin/images` - Image gallery management
  - `/admin/content` - Site content management
  - `/admin/messages` - Contact form messages
  - `/admin/bookings` - Manage transfer bookings
  - `/admin/settings` - Site settings

### Database (Supabase)
- **Tables**:
  - `destinations` - Transfer destinations (hotels, zones) with pricing, images (JSONB)
  - `vehicles` - Vehicle fleet with capacity, features, images (JSONB)
  - `transfer_services` - Types of transfer services (private, shared, VIP)
  - `bookings` - Customer transfer bookings
  - `site_images` - Image gallery with categories (hero, vehicles, destinations)
  - `site_content` - Dynamic site content (hero titles, etc.)
  - `contact_messages` - Contact form submissions
- **Storage**: Supabase Storage for image uploads

### Styling & Theme
- **Dark/Light Mode**: Supported via `dark` class on `<html>`, detected from system preference or localStorage
- **Tailwind**: Custom colors in `tailwind.config.ts`
- **CSS Variables**: Defined in `globals.css` with light/dark variants
- **Font**: Inter via next/font

### Color Palette
```
brand-500: #TBD       // Jetset Transfers primary color (to be defined from logo)
navy-900: #102a43     // Dark mode background (solid navy blue)
navy-950: #0d1f33     // Darker navy for backgrounds
green-500: #22c55e    // Status indicators (available badge)
```

### Theme Notes
- **Light mode**: Clean whites (#fafafa) and light grays
- **Dark mode**: Solid navy blue tones (no gradients)
- **Admin**: Always dark mode with navy-900 background
- Colors defined as CSS variables in `globals.css`

### Images & SEO
- **Logo Light Mode**: `public/images/logo/logo-jetset.webp`
- **Logo Dark Mode**: `public/images/logo/logo-jetset-dark.webp`
- **Image Structure**: `public/images/{hero,destinations,vehicles,logo,og}/`
- **Optimization**: Using `next/image` with lazy loading, blur placeholders
- **SEO Schemas** (`components/seo/SchemaMarkup.tsx`):
  - `LocalBusinessSchema` - Business info with logo
  - `OrganizationSchema` - Organization with logo and contact
  - `ServiceSchema` - Transfer services offered
  - `TransferServiceSchema` - Individual transfer route details
  - `BreadcrumbSchema` - Breadcrumb navigation
  - `FAQSchema` - FAQ pages
- **Alt Text**: Bilingual alt text for all images
- **Supabase Images**: `next.config.js` configured for Supabase Storage images

### Dynamic Services System
- Services are stored in database tables (`transfer_services`)
- Each destination can have different transfer options (private, shared, VIP)
- Icons are stored as string keys (e.g., "CheckCircleIcon", "TruckIcon") and rendered dynamically via `ICON_MAP`
- Available icons from `@heroicons/react/24/outline`

### Currency Context
- `contexts/CurrencyContext.tsx` provides currency formatting
- Supports USD and MXN with conversion
- Used across the site for price display

### Benefits System
- **Purpose**: "¿Por qué elegir Jetset?" / "Why choose Jetset?" section
- **Storage**: JSONB column in `destinations` table
- **Structure**: Array of 4 benefit objects
  ```json
  [
    { "key": "safety", "title_es": "Seguridad", "title_en": "Safety", "desc_es": "...", "desc_en": "..." },
    { "key": "comfort", "title_es": "Comodidad", "title_en": "Comfort", "desc_es": "...", "desc_en": "..." },
    { "key": "punctuality", "title_es": "Puntualidad", "title_en": "Punctuality", "desc_es": "...", "desc_en": "..." },
    { "key": "service", "title_es": "Atención personalizada", "title_en": "Personalized service", "desc_es": "...", "desc_en": "..." }
  ]
  ```
- **Admin UI**: Editable in destinations admin under "Servicios" tab
- **Fallback**: DEFAULT_BENEFITS constant used when database value is null

### Vehicle Pricing System
- **Purpose**: Multiple vehicle options per destination (e.g., SUV, Van, Sprinter)
- **Storage**: JSONB column `vehicle_pricing` in `destinations` table
- **Structure**: Array of pricing objects
  ```json
  [
    { "vehicle_name": "SUV", "max_passengers": 5, "price_usd": 75, "notes_es": "...", "notes_en": "..." },
    { "vehicle_name": "Van", "max_passengers": 10, "price_usd": 95, "notes_es": "...", "notes_en": "..." },
    { "vehicle_name": "Sprinter", "max_passengers": 14, "price_usd": 120, "notes_es": "...", "notes_en": "..." }
  ]
  ```
- **Admin UI**: Editable in destinations admin under "Precios" tab
- **Display**: Shows pricing cards in destination detail sidebar

### Transfer Types
- **Private Transfer**: Direct transportation for your group only
- **Shared Transfer**: Cost-effective option sharing with other travelers
- **VIP Transfer**: Premium vehicles with additional amenities
- **Round Trip**: Airport pickup + return transfer at discounted rate
