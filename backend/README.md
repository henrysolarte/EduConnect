# Backend - EduConnect API

## Descripción
API REST para el sistema de autenticación de EduConnect. Proporciona endpoints para registro, login y gestión de usuarios.

## Requisitos Previos

- Node.js v14 o superior
- MySQL 5.7 o superior (o MariaDB 10.3+)

## Instalación

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar base de datos

#### Opción A: Usar MySQL Workbench o CLI
Ejecutar el script `database.sql`:
```bash
mysql -u root -p < database.sql
```

#### Opción B: Ejecutar comandos manualmente
```sql
CREATE DATABASE educonnect;
USE educonnect;

CREATE TABLE roles (
    id INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO roles (id, nombre) VALUES 
(1, 'administrador'),
(2, 'estudiante');

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL DEFAULT 2,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);
```

### 3. Configurar variables de entorno

Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=educonnect
JWT_SECRET=una_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h
```

### 4. Iniciar el servidor
```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## API Endpoints

### Públicos

#### `POST /api/register`
Registra un nuevo estudiante.

**Request:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "miContraseña123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "rol_id": 2
  }
}
```

#### `POST /api/login`
Inicia sesión y obtiene un token JWT.

**Request:**
```json
{
  "email": "juan@ejemplo.com",
  "password": "miContraseña123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "rol_id": 2,
    "rol_nombre": "estudiante"
  }
}
```

### Protegidos (requieren token)

Incluir el header `Authorization: Bearer <token>` en las peticiones.

#### `GET /api/profile`
Obtiene el perfil del usuario autenticado.

**Response (200):**
```json
{
  "success": true,
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "rol_id": 2,
    "rol_nombre": "estudiante"
  }
}
```

### Solo Administradores

#### `GET /api/admin/users`
Lista todos los usuarios (requiere rol de administrador).

**Response (200):**
```json
{
  "success": true,
  "usuarios": [
    {
      "id": 1,
      "nombre": "Administrador",
      "email": "admin@educonnect.com",
      "rol_id": 1,
      "rol_nombre": "administrador"
    },
    ...
  ]
}
```

## Crear un Administrador

Los administradores no pueden registrarse desde la web. Para crear uno:

### Usando el script de base de datos
```javascript
// Ejecutar en Node.js
const bcrypt = require('bcrypt');

async function generateAdminHash() {
  const password = 'TuPasswordAdmin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash:', hash);
  console.log('\nEjecutar en MySQL:');
  console.log(`INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES ('Admin', 'admin@tudominio.com', '${hash}', 1);`);
}

generateAdminHash();
```

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Datos de entrada inválidos |
| 401 | No autorizado / Credenciales inválidas |
| 403 | Prohibido / Sin permisos |
| 404 | Recurso no encontrado |
| 429 | Demasiadas solicitudes (rate limiting) |
| 500 | Error interno del servidor |

## Seguridad

- Las contraseñas se hashean con bcrypt (10 rounds)
- Los tokens JWT expiran en 24 horas
- Rate limiting: 10 intentos por 15 min en login/register, 100 por 15 min en otras rutas
- CORS habilitado para desarrollo local
- Nunca exponer el JWT_SECRET en producción
