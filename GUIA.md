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