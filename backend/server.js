require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Validar configuración crítica
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Rate limiting configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Demasiadas solicitudes. Por favor, intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs (for login/register)
  message: {
    success: false,
    message: 'Demasiados intentos. Por favor, intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'educonnect'
};

// Pool de conexiones a la base de datos
let pool;
let dbConnected = false;

async function initializeDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    // Test the connection
    const connection = await pool.getConnection();
    connection.release();
    dbConnected = true;
    console.log('✅ Conexión a la base de datos establecida');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    console.log('ℹ️  El servidor continuará sin conexión a la base de datos');
    console.log('ℹ️  Configura la base de datos siguiendo las instrucciones en README.md');
  }
}

// Función auxiliar para ejecutar consultas
async function query(sql, params) {
  if (!pool || !dbConnected) {
    throw new Error('No hay conexión a la base de datos. Por favor, configura la base de datos siguiendo las instrucciones en README.md');
  }
  const [results] = await pool.execute(sql, params);
  return results;
}

// ==================== ENDPOINTS ====================

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de EduConnect funcionando correctamente',
    database: dbConnected ? 'Conectado' : 'No conectado - Configurar base de datos',
    endpoints: {
      register: 'POST /api/register',
      login: 'POST /api/login',
      profile: 'GET /api/profile (requiere token)'
    }
  });
});

// GET /api/health - Estado de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: dbConnected,
    timestamp: new Date().toISOString()
  });
});

// POST /api/register - Registro de estudiantes
app.post('/api/register', strictLimiter, async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos (nombre, email, password)'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email no es válido'
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el email ya existe
    const existingUser = await query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Este email ya está registrado'
      });
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Insertar usuario con rol_id = 2 (estudiante)
    const result = await query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES (?, ?, ?, ?)',
      [nombre, email, passwordHash, 2]
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: result.insertId,
        nombre: nombre,
        email: email,
        rol_id: 2
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/login - Inicio de sesión
app.post('/api/login', strictLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const users = await query(
      `SELECT u.id, u.nombre, u.email, u.password_hash, u.rol_id, r.nombre as rol_nombre 
       FROM usuarios u 
       JOIN roles r ON u.rol_id = r.id 
       WHERE u.email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    const user = users[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        rol_id: user.rol_id 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token: token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol_id: user.rol_id,
        rol_nombre: user.rol_nombre
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    req.user = user;
    next();
  });
}

// GET /api/profile - Obtener perfil del usuario (ruta protegida)
app.get('/api/profile', authLimiter, authenticateToken, async (req, res) => {
  try {
    const users = await query(
      `SELECT u.id, u.nombre, u.email, u.rol_id, r.nombre as rol_nombre 
       FROM usuarios u 
       JOIN roles r ON u.rol_id = r.id 
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      usuario: users[0]
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Middleware para verificar rol de administrador
function requireAdmin(req, res, next) {
  if (req.user.rol_id !== 1) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }
  next();
}

// GET /api/admin/users - Listar usuarios (solo administradores)
app.get('/api/admin/users', authLimiter, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await query(
      `SELECT u.id, u.nombre, u.email, u.rol_id, r.nombre as rol_nombre 
       FROM usuarios u 
       JOIN roles r ON u.rol_id = r.id 
       ORDER BY u.id`
    );

    res.json({
      success: true,
      usuarios: users
    });

  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Iniciar servidor
async function startServer() {
  // Validar JWT_SECRET antes de iniciar
  if (!JWT_SECRET) {
    console.error('❌ ERROR: JWT_SECRET no está configurado');
    console.error('ℹ️  Copia .env.example a .env y configura JWT_SECRET');
    process.exit(1);
  }
  
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════╗
    ║                                               ║
    ║   🎓 EduConnect API Server                    ║
    ║   Servidor corriendo en: http://localhost:${PORT}  ║
    ║                                               ║
    ╚═══════════════════════════════════════════════╝
    `);
  });
}

startServer();
