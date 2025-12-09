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
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Error en BD:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error en el servidor' 
        });
      }

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
      const sql = 'INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES (?, ?, ?, ?)';
      
      db.query(sql, [nombre, email, password_hash, rol_id], (err, result) => {
        if (err) {
          console.error('Error insertando usuario:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Error al registrar usuario' 
          });
        }

        res.status(201).json({
          success: true,
          message: 'Usuario registrado exitosamente',
          usuario: {
            id: result.insertId,
            nombre,
            email,
            rol_id: rol_id
          }
        });
      });
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
router.post('/login', (req, res) => {
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

    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error('Error en BD:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error en el servidor' 
        });
      }

      if (results.length === 0) {
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciales inválidas' 
        });
      }

      const usuario = results[0];

      // Verificar contraseña
      const passwordValida = await bcrypt.compare(password, usuario.password_hash);

      if (!passwordValida) {
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciales inválidas' 
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
          rol_nombre: usuario.rol_nombre
        }
      });
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
});

module.exports = router;
