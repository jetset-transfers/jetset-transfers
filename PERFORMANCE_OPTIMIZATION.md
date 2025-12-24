# Performance Optimization Plan - Jetset Transfers

Análisis basado en PageSpeed Insights y mejores prácticas de Next.js 15.

## FIXES CRÍTICOS IMPLEMENTADOS (2025-12-10)

### CLS (Cumulative Layout Shift): 0.574 → 0.05 (95% reducción)
**Problema**: El logo causaba un shift de 0.569
**Solución**:
- Agregado `style={{ width: 'auto', height: '2rem' }}` al logo del Header
- Agregado `style={{ width: 'auto', height: '2.5rem' }}` al logo del Footer
- Removidas clases conflictivas (h-8, h-10, w-auto)
**Impacto**: Score de CLS mejoró dramáticamente

### LCP (Largest Contentful Paint): Mejorado
**Problema**: Imagen hero sin prioridad de carga
**Solución**: Agregado `fetchPriority="high"` a la imagen hero principal
**Impacto**: La imagen hero carga antes que otros recursos

### Caché Estático: 454 KiB ahorrados
**Problema**: Sin headers de caché para assets estáticos
**Solución**: Headers de caché para `/images/*` y `/_next/static/*` (1 año, immutable)
**Impacto**: Visitas repetidas cargan 454 KiB menos

### Analytics Performance
**Solución**: requestIdleCallback para defer GA4 initialization
**Impacto**: Menor bloqueo del main thread

---

## Áreas de Mejora Identificadas

### 1. **OPTIMIZACIÓN DE IMÁGENES** (PRIORIDAD ALTA)

**Problema**: Las imágenes son el factor #1 que afecta el rendimiento.

**Soluciones implementadas**:
- next/image con lazy loading automático
- Formatos modernos (AVIF, WebP) configurados
- Sistema de detección de imágenes pesadas (>100KB) en admin

**Acciones requeridas por el usuario**:
1. **Optimizar imágenes existentes** usando las herramientas recomendadas:
   - Squoosh.app (WebP 80-85%)
   - TinyPNG
   - ImageOptim (Mac)

2. **Dimensiones recomendadas**:
   - Hero: 1920x1080px → WebP 85% (~150-200KB)
   - Destinos: 800x500px → WebP 80% (~80-100KB)
   - Vehículos: 1200x800px → WebP 80% (~100-120KB)
   - Thumbnails: 400x300px → WebP 75% (~30-50KB)

3. **Revisar imágenes pesadas en Admin Panel**:
   - Ir a `/admin/images`
   - Identificar imágenes con badge rojo (>100KB)
   - Reemplazar con versiones optimizadas

---

### 2. **JAVASCRIPT Y BUNDLE SIZE**

**Optimizaciones ya implementadas**:
- Lazy loading de componentes (CookieBanner, etc.)
- Code splitting automático de Next.js
- Dynamic imports para componentes pesados

**Bundle sizes actuales** (del build):
- Página principal: 196 KB First Load JS
- Destinos: 172 KB
- Detalle de destino: 209 KB

**Mejoras adicionales sugeridas**:

```typescript
// app/[locale]/page.tsx
// Lazy load de secciones pesadas del homepage
const ServicesSection = dynamic(() => import('@/components/home/ServicesSection'), {
  loading: () => <div className="h-96 bg-navy-50 dark:bg-navy-900 animate-pulse" />
});

const TripAdvisorSection = dynamic(() => import('@/components/home/TripAdvisorSection'), {
  loading: () => <div className="h-64 bg-navy-50 dark:bg-navy-900 animate-pulse" />
});
```

---

### 3. **FONTS OPTIMIZATION**

**Ya optimizado**:
- Using next/font para optimización automática
- Font display: swap configurado
- Preconnect a Google Fonts

**Configuración actual**:
```typescript
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
```

---

### 4. **THIRD-PARTY SCRIPTS**

**Scripts externos**:
- Google Analytics 4
- Supabase

**Optimización implementada**:
- Analytics carga solo con consentimiento de cookies
- Script de GA4 es asíncrono
- Consentimiento GDPR implementado

**Mejora adicional sugerida**:
```typescript
// Usar next/script con strategy="lazyOnload" para scripts no críticos
import Script from 'next/script';

// En layout o componente específico
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
  strategy="lazyOnload" // Carga después de que la página sea interactiva
/>
```

---

### 5. **CACHING Y REVALIDACIÓN**

**Ya configurado**:
- Static generation para páginas públicas
- ISR (Incremental Static Regeneration) para contenido dinámico

**Recomendaciones de hosting**:
- Usar Vercel (optimizado para Next.js)
- Configurar CDN para assets estáticos
- Headers de cache correctos (ya configurados en next.config.js)

---

### 6. **CSS Y ESTILOS**

**Ya optimizado**:
- Tailwind CSS con JIT compiler
- CSS Modules automáticos de Next.js
- Purge de CSS no utilizado

---

### 7. **MOBILE OPTIMIZATION**

**Ya implementado**:
- Responsive design completo
- Mobile menu optimizado
- Touch-friendly buttons (min 44x44px)
- Viewport meta tag correcto

---

## Plan de Acción Prioritario

### Fase 1: Optimización de Imágenes (URGENTE)
1. [ ] Acceder al Admin Panel → Imágenes
2. [ ] Identificar las 10-15 imágenes más pesadas (badge rojo)
3. [ ] Optimizarlas con Squoosh.app:
   - Formato: WebP
   - Calidad: 80-85%
   - Dimensiones apropiadas según categoría
4. [ ] Re-subir las imágenes optimizadas

**Impacto esperado**: Mejora de 30-50 puntos en PageSpeed

### Fase 2: Lazy Loading Adicional (MEDIO)
1. [ ] Implementar dynamic imports para secciones del homepage
2. [ ] Usar next/script con strategy="lazyOnload" para GA4

**Impacto esperado**: Mejora de 10-15 puntos en PageSpeed

### Fase 3: Hosting y CDN (BAJO)
1. [ ] Verificar hosting optimizado (Vercel recomendado)
2. [ ] Configurar CDN si no está activo
3. [ ] Verificar compresión gzip/brotli activa

**Impacto esperado**: Mejora de 5-10 puntos en PageSpeed

---

## Métricas Objetivo

### Desktop
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

### Mobile
- **Performance**: 80+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

---

## Monitoreo Continuo

**Herramientas**:
1. PageSpeed Insights: https://pagespeed.web.dev/
2. Google Search Console: Verificar Core Web Vitals
3. GA4 Dashboard: Monitorear eventos de engagement

**Frecuencia recomendada**:
- Revisar PageSpeed: Mensual
- Core Web Vitals: Semanal
- GA4 Analytics: Diario

---

## Checklist de Implementación

- [x] Sistema de detección de imágenes pesadas en admin
- [x] Google Analytics 4 con tracking completo
- [x] SEO optimizado (sitemap, robots.txt, schemas)
- [x] Lazy loading de componentes
- [x] Headers de seguridad configurados
- [x] FIX CLS: Logo dimensiones explícitas (0.574 → 0.05)
- [x] FIX LCP: fetchPriority="high" en hero image
- [x] FIX Caché: Headers para static assets (454 KiB savings)
- [x] Analytics con requestIdleCallback (defer non-critical)
- [x] FIX Accesibilidad: aria-labels en botones (100% botones accesibles)
- [x] FIX Contraste: text-muted 0.6 → 0.7, text-subtle 0.4 → 0.55
- [ ] Optimizar imágenes existentes (354 KiB - ACCIÓN REQUERIDA)
- [ ] Implementar dynamic imports adicionales
- [ ] Configurar next/script para GA4

---

## Referencias

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Performance Best Practices](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
