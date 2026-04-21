# Guía de Desarrollo: Beisbol API

Esta guía documenta paso a paso cómo se desarrolló este proyecto.

## Requisitos Previos

- Node.js 20.x instalado
- PostgreSQL instalado y configurado
- Conocimientos básicos de JavaScript

---

## Paso 1: Inicializar el Proyecto

1. Crear carpeta del proyecto:
   ```bash
   mkdir beisbol-api && cd beisbol-api
   ```

2. Inicializar package.json:
   ```bash
   npm init -y
   ```

3. Instalar dependencias:
   ```bash
   npm install express @prisma/client
   npm install prisma nodemon --save-dev
   ```

---

## Paso 2: Configurar package.json

Editar `package.json` para agregar scripts y configuración:

```json
{
  "name": "beisbol-api",
  "version": "1.0.0",
  "main": "src/app.js",
  "type": "module",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:push": "prisma db push"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "express": "^5.2.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.9",
    "prisma": "^5.22.0"
  }
}
```

---

## Paso 3: Configurar Variables de Entorno

Crear archivo `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/beisbol_db?schema=public"
PORT=3000
```

**Nota**: Cambiar `postgres:postgres` por tu usuario y contraseña de PostgreSQL.

---

## Paso 4: Inicializar Prisma

1. Crear directorio prisma:
   ```bash
   mkdir prisma
   ```

2. Crear archivo `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Jugador {
  id     Int     @id @default(autoincrement())
  nombre String
  avg    Float
  hr     Int
  rbi    Int
  activo Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

3. Generar el cliente Prisma:
   ```bash
   npx prisma generate
   ```

---

## Paso 5: Crear Estructura de Archivos

Crear la siguiente estructura de directorios:
```
src/
├── config/
├── controllers/
├── routes/
├── models/
public/
```

---

## Paso 6: Implementar la Conexión a la Base de Datos

**Archivo**: `src/config/db.js`

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

---

## Paso 7: Implementar el Modelo de Datos

**Archivo**: `src/models/jugador.js`

Contiene las funciones que interactúan directamente con Prisma:
- `findAll()` - Obtiene todos los jugadores
- `findById(id)` - Obtiene un jugador por ID
- `create(data)` - Crea un nuevo jugador
- `update(id, data)` - Actualiza un jugador
- `delete(id)` - Elimina un jugador

---

## Paso 8: Implementar el Controlador

**Archivo**: `src/controllers/jugadorController.js`

Maneja la lógica de negocio y las respuestas HTTP:
- `getAll` - Llama al modelo y retorna JSON
- `getById` - Obtiene un jugador específico
- `create` - Valida datos y crea jugador
- `update` - Actualiza con validación
- `delete` - Elimina con validación

---

## Paso 9: Implementar las Rutas

**Archivo**: `src/routes/jugadorRoutes.js`

Define los endpoints de la API usando Express Router:
- `GET /` → listar todos
- `GET /:id` → obtener uno
- `POST /` → crear
- `PUT /:id` → actualizar
- `DELETE /:id` → eliminar

---

## Paso 10: Crear el Servidor Express

**Archivo**: `src/app.js`

Configura el servidor:
- Middleware para JSON
- Archivos estáticos (interfaz)
- Rutas de la API
- Servidor en el puerto configurado

---

## Paso 11: Crear la Interfaz de Usuario

### HTML (`public/index.html`)
- Formulario para agregar/editar jugadores
- Tabla para mostrar jugadores
- Botones de editar y eliminar

### CSS (`public/styles.css`)
- Diseño moderno con gradientes
- Estilos para formularios y tablas
- Colores profesionales

### JavaScript (`public/app.js`)

**Importante - Auto-inicialización**: `app.js` detecta automáticamente los elementos por su ID:
- Si existe `#jugadorForm` → llama `setupForm()` automáticamente
- Si existe `#jugadoresBody` → llama `loadJugadores()` automáticamente

**NO agregar scripts `DOMContentLoaded` adicionales en los HTML** - causa errores como doble submit.

- Carga jugadores del API
- Envía datos al API
- Maneja edición y eliminación
- Actualiza la interfaz dinámicamente

---

## Paso 12: Configurar la Base de Datos

1. Iniciar PostgreSQL:
   ```bash
   sudo service postgresql start
   ```

2. Crear base de datos:
   ```bash
   createdb beisbol_db
   ```

3. Aplicar esquema:
   ```bash
   npx prisma db push
   ```

---

## Paso 13: Ejecutar el Proyecto

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# O modo producción
npm start
```

Abrir `http://localhost:3000` en el navegador.

---

## Estructura MVC Explicada

- **Model** (`src/models/`): Acceso a datos, interactúa con Prisma
- **View** (`public/`): Interfaz de usuario (HTML/CSS/JS)
  - `index.html`: Menú principal
  - `agregar.html`: Formulario para agregar/editar
  - `listar.html`: Tabla con paginación y ordenamiento
- **Controller** (`src/controllers/`): Lógica de negocio, valida y procesa

---

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar en modo desarrollo |
| `npx prisma studio` | GUI de base de datos |
| `npx prisma db push` | Sincronizar cambios |
| `npx prisma generate` | Regenerar cliente |

---

## Errores Comunes y Soluciones

1. **"Can't reach database server"**
   - Solución: Verificar que PostgreSQL esté iniciado

2. **"Cannot find module '@prisma/client'"**
   - Solución: Ejecutar `npm install` y `npx prisma generate`

3. **"Port already in use"**
   - Solución: Cambiar el puerto en `.env` o matar el proceso

4. **Error de conexión a PostgreSQL**
   - Solución: Verificar credenciales en `.env` (formato: `usuario:contraseña@host:puerto/bd`)

---

## Paso 14: Páginas Separadas

Para mejor UX, la aplicación se separó en 3 páginas:

### Archivos Creados

| Archivo           | Descripción                                    |
|-------------------|-----------------------------------------------|
| `public/index.html`    | Menú con tarjetas clickeables              |
| `public/agregar.html`  | Formulario para agregar/editar jugadores  |
| `public/listar.html`  | Tabla con jugadores y controles de paginación |

### Navegación

Todas las páginas incluyen un menú de navegación:
```html
<nav class="nav-menu">
  <a href="/">Inicio</a>
  <a href="agregar.html">Agregar Jugador</a>
  <a href="listar.html">Ver Lista</a>
</nav>
```

**Modo edición**: Al presionar "Editar" en la lista, se navega a `agregar.html` con query params:
```
agregar.html?id=1&nombre=Juan&avg=0.350&hr=25&rbi=85&activo=true
```
`agregar.html` detecta estos parámetros y completa el formulario automáticamente.

---

## Paso 15: Paginado y Ordenamiento

### Cambios en el Modelo (`src/models/jugador.js`)

Se agregó soporte para paginación y ordenamiento:

```javascript
findAll: async ({ page = 1, limit = 10, sortBy = 'nombre', sortOrder = 'asc' }) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.jugador.findMany({
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.jugador.count()
  ]);

  return { data, total, totalPages: Math.ceil(total / limit) };
}
```

### Cambios en el Controlador (`src/controllers/jugadorController.js`)

El endpoint GET ahora lee query params y valida campos:

```javascript
getAll: async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || 'nombre';
  const sortOrder = req.query.sortOrder || 'asc';

  const allowedSort = ['nombre', 'avg', 'hr', 'rbi', 'activo'];
  if (!allowedSort.includes(sortBy)) {
    return res.status(400).json({ error: 'Campo de ordenamiento inválido' });
  }

  const { data: jugadores, total, totalPages } = await jugadorModel.findAll({
    page, limit, sortBy, sortOrder
  });

  res.json({
    data: jugadores,
    pagination: { page, limit, total, totalPages }
  });
}
```

### Cambios en el Frontend (`public/app.js`)

- Estados: `currentPage`, `currentLimit`, `currentSortBy`, `currentSortOrder`
- Funciones: `loadJugadores()`, `renderPagination()`, `changePage()`, `changeLimit()`, `changeSort()`
- Selector de items por página: 5, 10, 25, 50

### Interfaz de Usuario

En `listar.html`:
- Selector de cantidad de items por página
- Headers de tabla clickeables para ordenar
- Botones de paginación (Anterior, números, Siguiente)
- Info: "Página X de Y (Z total)"

---

## Parámetros de API Explicados

| Parámetro   | Valores                      | Default | Descripción          |
|-------------|-------------------------------|---------|----------------------|
| page        | 1, 2, 3...                    | 1       | Página actual        |
| limit       | 5, 10, 25, 50                 | 10      | Items por página     |
| sortBy      | nombre, avg, hr, rbi, activo  | nombre  | Campo de ordenamiento |
| sortOrder   | asc, desc                     | asc     | Dirección            |

### URLs de Ejemplo

```
/api/jugadores                    → Default (page=1, limit=10, sortBy=nombre, sortOrder=asc)
/api/jugadores?page=2             → Página 2
/api/jugadores?limit=25           → 25 items por página
/api/jugadores?sortBy=hr&sortOrder=desc  → Ordenar por HR descendente
/api/jugadores?page=3&limit=50    → Página 3 con 50 items

---

## Errores del Frontend y Soluciones

1. **Jugador se crea dos veces al enviar formulario**
   - Causa: Hay dos event listeners de submit (uno en `app.js` y otro en `agregar.html`)
   - Solución: NO agregar `DOMContentLoaded` con `setupForm()` en los HTML - `app.js` ya lo hace automáticamente

2. **Botón EDITAR no funciona**
   - Causa: `editJugador()` intenta llenar campos que no existen en `listar.html`
   - Solución: El edit navega a `agregar.html?id=1&nombre=...` (query params), y el HTML lee esos parámetros al cargar
```