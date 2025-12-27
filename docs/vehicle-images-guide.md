# Guía: Gestionar Imágenes de Vehículos

## ✅ ¡Solucionado!

Ahora puedes gestionar las imágenes de tus vehículos directamente desde el formulario de admin.

## 📍 Cómo Acceder

**Ruta**: `/admin/vehicles`

**URL**: `http://localhost:3000/admin/vehicles`

## 🎨 Nueva Sección de Imágenes

Cuando crees o edites un vehículo, verás una nueva sección llamada **"Imágenes del Vehículo"** con el ícono 📷.

### Características:

✅ **Agregar múltiples imágenes** - Puedes añadir tantas como necesites
✅ **Selector visual** - Escoge de tu galería o sube nuevas
✅ **Reordenar imágenes** - Usa las flechas ← → para cambiar el orden
✅ **Eliminar imágenes** - Botón ❌ al pasar el mouse
✅ **Vista previa** - Ve todas las imágenes en un grid
✅ **Imagen principal** - La primera será la principal (marcada con #1)

## 📝 Cómo Agregar Imágenes

### Paso 1: Abre el formulario de vehículo

1. Ve a `/admin/vehicles`
2. Haz clic en **"+ Agregar"** para crear nuevo vehículo
3. O haz clic en **✏️ Editar** en un vehículo existente

### Paso 2: Llena los datos básicos

- Nombre del vehículo
- Tipo (Sedán, SUV, Van, Sprinter, Lujo)
- Capacidad de pasajeros
- Capacidad de equipaje
- Descripciones en español e inglés
- Características

### Paso 3: Agregar imágenes

Desplázate hasta la sección **"Imágenes del Vehículo"**:

1. **Haz clic en "Seleccionar imagen"**
2. Se abrirá un modal con dos opciones:

   **Opción A: Galería de imágenes**
   - Busca en tus imágenes existentes
   - Filtra por categoría "Vehículos"
   - Haz clic en la imagen que quieras usar

   **Opción B: Subir nueva imagen**
   - Haz clic en **"Subir nueva imagen"**
   - Selecciona el archivo desde tu computadora
   - Se subirá automáticamente y se agregará al vehículo

   **Opción C: URL directa**
   - Cambia a la pestaña "Ingresar URL"
   - Pega la URL de una imagen externa
   - Haz clic en "Usar esta imagen"

3. **Repite** para agregar más imágenes

### Paso 4: Organizar imágenes

Una vez agregadas las imágenes, puedes:

#### Reordenar (Cambiar el orden)
- Pasa el mouse sobre una imagen
- Haz clic en **←** para moverla a la izquierda
- Haz clic en **→** para moverla a la derecha
- La primera imagen (#1) será la principal

#### Eliminar
- Pasa el mouse sobre una imagen
- Haz clic en el **❌** (esquina superior derecha)

### Paso 5: Guardar

Haz clic en **"Guardar"** al final del formulario.

## 🎯 Ejemplo Completo

### Vehículo: Chevrolet Suburban

```
Nombre: Chevrolet Suburban
Tipo: SUV
Capacidad: 5 pasajeros
Equipaje: 3 maletas

Imágenes (en orden):
1️⃣ Exterior frontal - Vista 3/4 (PRINCIPAL)
2️⃣ Interior - Asientos
3️⃣ Maletero abierto
4️⃣ Exterior lateral
```

## 💡 Mejores Prácticas

### Orden de Imágenes Recomendado

1. **Primera imagen** (Principal) - Exterior frontal o 3/4
2. **Segunda imagen** - Interior/asientos
3. **Tercera imagen** - Maletero/espacio de equipaje
4. **Imágenes adicionales** - Detalles, características especiales

### Calidad de Imágenes

- **Formato**: JPG o WebP
- **Tamaño**: Máx 500KB por imagen (idealmente <200KB)
- **Dimensiones**: 1200x800 px (aspecto 3:2)
- **Fondo**: Preferiblemente fondo neutro o transparente

### Nombres Descriptivos

Al subir imágenes, usa nombres claros:
- ✅ `suburban-exterior-front.jpg`
- ✅ `van-interior-seats.jpg`
- ❌ `IMG_1234.jpg`

## 🔍 Dónde se Usan las Imágenes

Las imágenes de vehículos se muestran en:

1. **Página de Vehículos** (`/es/vehicles`)
   - La primera imagen aparece en las tarjetas

2. **Página de Detalle** (`/es/vehicles/[slug]`)
   - Galería con todas las imágenes
   - Navegación entre imágenes

3. **Página de Destinos** (si aplicable)
   - Al mostrar opciones de vehículos para cada destino

## 🐛 Solución de Problemas

### La imagen no se ve
- Verifica que la URL sea correcta
- Asegúrate de que la imagen sea pública (no requiera autenticación)
- Prueba abriendo la URL en una nueva pestaña

### No puedo subir imagen
- Verifica el tamaño del archivo (<10MB)
- Solo se permiten formatos: JPG, PNG, WebP, GIF
- Revisa tu conexión a internet

### No puedo reordenar
- Asegúrate de tener al menos 2 imágenes
- Haz clic en las flechas ← → que aparecen al pasar el mouse

### Los cambios no se guardan
- Asegúrate de hacer clic en **"Guardar"** al final del formulario
- Verifica que no haya errores en otros campos obligatorios
- Revisa la consola del navegador por errores

## 🎨 Vista del Formulario

```
┌──────────────────────────────────────────┐
│ Nombre del vehículo                      │
│ Tipo                                     │
│ Capacidad...                             │
│ Descripciones...                         │
│ Características...                       │
│                                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                          │
│ 📷 Imágenes del Vehículo                 │
│                                          │
│ ┌────────┐ ┌────────┐ ┌────────┐        │
│ │  #1    │ │  #2    │ │  #3    │        │
│ │ [IMG]  │ │ [IMG]  │ │ [IMG]  │        │
│ │  ❌ ←→ │ │  ❌ ←→ │ │  ❌ ←→ │        │
│ └────────┘ └────────┘ └────────┘        │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ 📸 Agregar imagen                    │ │
│ │ Selecciona o sube una nueva imagen   │ │
│ │                                      │ │
│ │ [Seleccionar imagen]                 │ │
│ │ URL: _______________________         │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ 💡 La primera imagen será la principal  │
│                                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                          │
│ ☑️ Activo                                │
│                                          │
│ [Cancelar]  [Guardar]                   │
└──────────────────────────────────────────┘
```

## 🚀 Próximos Pasos

1. ✅ Agrega imágenes a todos tus vehículos
2. ✅ Organiza el orden de las imágenes
3. ✅ Verifica cómo se ven en la página pública
4. ✅ Optimiza las imágenes si cargan lento

## 📚 Recursos Adicionales

- **Optimizar imágenes**: [TinyPNG](https://tinypng.com)
- **Editar imágenes**: [Photopea](https://www.photopea.com) (gratis, online)
- **Remover fondos**: [Remove.bg](https://www.remove.bg)

¡Listo! Ahora puedes gestionar todas las imágenes de tus vehículos desde el admin. 🎉
