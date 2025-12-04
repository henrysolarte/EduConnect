# Sistema de Autenticación EduConnect

## Estructura de Base de Datos

### Tabla: roles
```sql
CREATE TABLE roles (
    id INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO roles (id, nombre) VALUES 
(1, 'administrador'),
(2, 'estudiante');
```

### Tabla: usuarios
```sql
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);
```

## Flujo de Registro

### Registro de Estudiantes (Público)
- **Ruta:** `/register`
- **Acceso:** Cualquier persona
- **Campos:**
  - Nombre completo
  - Email (único)
  - Contraseña
  - Confirmar contraseña
- **Proceso:**
  1. Usuario completa formulario
  2. Frontend valida que contraseñas coincidan
  3. Se envía a API: `POST /api/register`
  4. Backend hashea contraseña con bcrypt
  5. Backend inserta en BD con `rol_id = 2` (estudiante)
  6. Retorna confirmación
- **Rol asignado:** Siempre estudiante (rol_id = 2)

### Creación de Administradores (Restringido)
⚠️ **Los administradores NO se registran desde la web**

**Opciones para crear administradores:**

1. **Directamente en la base de datos:**
   ```sql
   INSERT INTO usuarios (nombre, email, password_hash, rol_id) 
   VALUES ('Admin Principal', 'admin@educonnect.com', '$2b$10$hash...', 1);
   ```

2. **Script de inicialización:**
   - Crear un script Node.js que genere el primer admin
   - Se ejecuta una sola vez en la instalación

3. **Panel de super-administración (futuro):**
   - Ruta protegida: `/admin/crear-administrador`
   - Solo accesible por administradores existentes
   - Requiere autenticación y verificación de rol_id = 1

## Flujo de Login

### Inicio de Sesión (Todos los usuarios)
- **Ruta:** `/login`
- **Acceso:** Cualquier persona
- **Campos:**
  - Email
  - Contraseña
- **Proceso:**
  1. Usuario ingresa credenciales
  2. Se envía a API: `POST /api/login`
  3. Backend busca usuario por email
  4. Backend verifica password con bcrypt.compare()
  5. Backend obtiene rol_id del usuario
  6. Backend genera token JWT con datos del usuario
  7. Frontend recibe token y rol_id
  8. **Redirección según rol:**
     - `rol_id = 1` → `/admin/dashboard` (Panel administrador)
     - `rol_id = 2` → `/estudiante/dashboard` (Área estudiante)

## API Endpoints Necesarios

### 1. POST /api/register
```javascript
// Request
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "miContraseña123"
}

// Response (éxito)
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "usuario": {
    "id": 5,
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "rol_id": 2
  }
}
```

### 2. POST /api/login
```javascript
// Request
{
  "email": "juan@ejemplo.com",
  "password": "miContraseña123"
}

// Response (éxito)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 5,
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "rol_id": 2,
    "rol_nombre": "estudiante"
  }
}
```

## Seguridad

### Contraseñas
- **Nunca** guardar contraseñas en texto plano
- Usar bcrypt para hashear (backend):
  ```javascript
  const bcrypt = require('bcrypt');
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  ```

### Tokens JWT
- Incluir: id, email, rol_id
- Expiración: 24 horas
- Almacenar en localStorage del navegador
- Enviar en header Authorization: Bearer {token}

### Protección de Rutas
- Verificar token en cada petición
- Validar rol_id para acceso a rutas admin
- Middleware de autenticación en backend

## Siguiente Paso: Backend

Para conectar esto necesitas crear un backend Node.js con:
1. Express.js (servidor)
2. MySQL/MariaDB (base de datos)
3. bcrypt (encriptación)
4. jsonwebtoken (autenticación)
5. cors (permitir peticiones desde React)

¿Quieres que te ayude a crear el backend también?
