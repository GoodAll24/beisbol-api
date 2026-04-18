# Beisbol API

API REST para la gestión de jugadores de béisbol con operaciones CRUD completas.

## Descripción

Sistema de gestión de jugadores de béisbol desarrollado con Node.js, Express, Prisma ORM y PostgreSQL. Cumple con los requisitos de la asignatura Práctica Profesional:
- CRUD completo (Create, Read, Update, Delete)
- 3 tipos de datos distintos: String (nombre), Float (avg), Int (hr, rbi), Boolean (activo)
- Estructura profesional MVC

## Tecnologías

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Gestor de Paquetes**: npm/yarn

## Estructura del Proyecto

```
beisbol-api/
├── prisma/
│   └── schema.prisma          # Definición del modelo
├── src/
│   ├── config/
│   │   └── db.js              # Conexión a Prisma
│   ├── controllers/
│   │   └── jugadorController.js  # Lógica de negocio
│   ├── routes/
│   │   └── jugadorRoutes.js   # Rutas de la API
│   ├── models/
│   │   └── jugador.js         # Modelo de datos
│   └── app.js                 # Servidor Express
├── public/
│   ├── index.html             # Interfaz de usuario
│   ├── styles.css             # Estilos
│   └── app.js                 # Lógica del cliente
├── .env                       # Variables de entorno
└── package.json
```

## Instalación

1. **Clonar o copiar el proyecto**

2. **Instalar dependencias:**
   ```bash
   cd beisbol-api
   npm install
   ```

3. **Configurar variables de entorno:**
   Editar el archivo `.env` con los datos de tu conexión PostgreSQL:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/beisbol_db?schema=public"
   PORT=3000
   ```

4. **Iniciar PostgreSQL** y crear la base de datos:
   ```bash
   sudo service postgresql start
   createdb beisbol_db
   ```

5. **Aplicar el esquema a la base de datos:**
   ```bash
   npx prisma db push
   ```

6. **Ejecutar el servidor:**
   ```bash
   # Desarrollo (con hot-reload)
   npm run dev

   # Producción
   npm start
   ```

7. **Acceder a la aplicación:**
   Abrir en el navegador: `http://localhost:3000`

## Modelo de Datos

### Jugador

| Campo    | Tipo      | Descripción                    |
|----------|-----------|--------------------------------|
| id       | Int       | ID único (auto-incremental)    |
| nombre   | String    | Nombre del jugador             |
| avg      | Float     | Promedio de bateo (0.000-1.000)|
| hr       | Int       | Home Runs                      |
| rbi      | Int       | Carreras Empujadas             |
| activo   | Boolean   | Estado del jugador             |
| createdAt| DateTime  | Fecha de creación              |
| updatedAt| DateTime  | Fecha de última actualización  |

## Endpoints de la API

| Método | Endpoint           | Descripción                |
|--------|--------------------|----------------------------|
| GET    | /api/jugadores     | Listar todos los jugadores |
| GET    | /api/jugadores/:id | Obtener un jugador por ID  |
| POST   | /api/jugadores     | Crear nuevo jugador        |
| PUT    | /api/jugadores/:id | Actualizar un jugador      |
| DELETE | /api/jugadores/:id | Eliminar un jugador        |

### Ejemplos de Uso

**Crear jugador:**
```bash
curl -X POST http://localhost:3000/api/jugadores \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan Pérez", "avg": 0.350, "hr": 25, "rbi": 85, "activo": true}'
```

**Listar jugadores:**
```bash
curl http://localhost:3000/api/jugadores
```

**Actualizar jugador:**
```bash
curl -X PUT http://localhost:3000/api/jugadores/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan Pérez Actualizado", "avg": 0.360}'
```

**Eliminar jugador:**
```bash
curl -X DELETE http://localhost:3000/api/jugadores/1
```

## Scripts Disponibles

| Script            | Descripción                           |
|-------------------|---------------------------------------|
| `npm start`       | Iniciar el servidor en producción    |
| `npm run dev`     | Iniciar con hot-reload (desarrollo)  |
| `npx prisma studio` | Abrir GUI de Prisma               |
| `npx prisma generate` | Regenerar el cliente Prisma    |
| `npx prisma db push` | Sincronizar schema con BD        |

## Licencia

MIT