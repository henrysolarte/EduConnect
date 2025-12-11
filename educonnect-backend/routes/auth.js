const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const router = express.Router();
const JWT_SECRET = 'educonnect_secret_key_2025'; // En producción, usar variable de entorno

// POST /api/register - Registrar nuevo usuario (estudiante o profesor)
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol_id } = req.body;

    // Validar campos
    if (!nombre || !email || !password || !rol_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son obligatorios' 
      });
    }

    // Validar que solo se registren estudiantes (2) o profesores (3)
    if (rol_id !== 2 && rol_id !== 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rol inválido. Solo se permiten Estudiante o Profesor' 
      });
    }

    // Verificar si el email ya existe
    const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (results.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'El email ya está registrado' 
      });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insertar nuevo usuario con el rol seleccionado
    // Los estudiantes y admins se aprueban automáticamente, los profesores requieren aprobación
    const aprobado = (rol_id === 2) ? 1 : 0; // Estudiantes aprobados automáticamente
    const sql = 'INSERT INTO usuarios (nombre, email, password_hash, rol_id, aprobado) VALUES (?, ?, ?, ?, ?)';
    
    const [result] = await db.query(sql, [nombre, email, password_hash, rol_id, aprobado]);

    res.status(201).json({
      success: true,
      message: rol_id === 3 
        ? 'Registro exitoso. Tu cuenta será revisada por un administrador.' 
        : 'Usuario registrado exitosamente',
      usuario: {
        id: result.insertId,
        nombre,
        email,
        rol_id: rol_id,
        aprobado: aprobado
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
});

// POST /api/login - Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son obligatorios' 
      });
    }

    // Buscar usuario por email con información del rol
    const sql = `
      SELECT u.*, r.nombre as rol_nombre 
      FROM usuarios u 
      INNER JOIN roles r ON u.rol_id = r.id 
      WHERE u.email = ?
    `;

    const [results] = await db.query(sql, [email]);

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    const usuario = results[0];

      // Verificar contraseña en texto plano
      if (usuario.password !== password) {
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciales inválidas' 
        });
      }

    // Verificar si el usuario está aprobado (solo para profesores)
    if (usuario.rol_id === 3 && !usuario.aprobado) {
      return res.status(403).json({ 
        success: false, 
        message: 'Tu cuenta está pendiente de aprobación por un administrador' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        rol_id: usuario.rol_id 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol_id: usuario.rol_id,
        rol_nombre: usuario.rol_nombre,
        aprobado: usuario.aprobado
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
});

// GET /api/profesores/pendientes - Obtener profesores pendientes de aprobación (solo admin)
router.get('/profesores/pendientes', async (req, res) => {
  try {
    const sql = `
      SELECT u.id, u.nombre, u.email, u.rol_id, r.nombre as rol_nombre, u.aprobado
      FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      WHERE u.rol_id = 3 AND u.aprobado = 0
      ORDER BY u.id DESC
    `;

    const [profesores] = await db.query(sql);

    res.json({
      success: true,
      profesores
    });
  } catch (error) {
    console.error('Error al obtener profesores pendientes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener profesores pendientes' 
    });
  }
});

// PUT /api/profesores/aprobar/:id - Aprobar un profesor (solo admin)
router.put('/profesores/aprobar/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe y es un profesor
    const [usuario] = await db.query(
      'SELECT * FROM usuarios WHERE id = ? AND rol_id = 3',
      [id]
    );

    if (usuario.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profesor no encontrado'
      });
    }

    // Aprobar el profesor
    await db.query(
      'UPDATE usuarios SET aprobado = 1 WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Profesor aprobado exitosamente'
    });
  } catch (error) {
    console.error('Error al aprobar profesor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al aprobar profesor' 
    });
  }
});

module.exports = router;
