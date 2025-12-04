# EduConnect 🎓

EduConnect es una plataforma educativa con sistema de autenticación para estudiantes y administradores.

## Estructura del Proyecto

```
EduConnect/
├── src/                  # Frontend React
│   ├── components/       # Componentes React
│   ├── App.js           # Componente principal
│   └── ...
├── backend/             # Backend Node.js/Express
│   ├── server.js        # Servidor API
│   ├── database.sql     # Script de base de datos
│   └── README.md        # Documentación del API
├── public/              # Archivos estáticos
└── AUTENTICACION.md     # Documentación del sistema de auth
```

## Inicio Rápido

### 1. Instalar dependencias del Frontend
```bash
npm install
```

### 2. Configurar el Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de base de datos
```

### 3. Configurar Base de Datos MySQL
```bash
mysql -u root -p < backend/database.sql
```

### 4. Iniciar el Backend (Terminal 1)
```bash
cd backend
npm start
# Servidor en http://localhost:5000
```

### 5. Iniciar el Frontend (Terminal 2)
```bash
npm start
# Aplicación en http://localhost:3000
```

## Funcionalidades

- ✅ Página principal con navegación
- ✅ Registro de estudiantes
- ✅ Inicio de sesión con JWT
- ✅ Redirección según rol (admin/estudiante)
- ✅ API REST con autenticación

## Documentación Adicional

- [Sistema de Autenticación](./AUTENTICACION.md)
- [API Backend](./backend/README.md)

---

## Scripts Disponibles (Frontend React)

### `npm start`

Ejecuta la app en modo desarrollo.\
Abre [http://localhost:3000](http://localhost:3000) para verla en el navegador.

### `npm test`

Inicia el test runner en modo interactivo.

### `npm run build`

Compila la app para producción en la carpeta `build`.
