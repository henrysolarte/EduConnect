const express = require('express');
const router = express.Router();
const db = require('../config/database');
const multer = require('multer');

// Configurar multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB máximo
});

// POST - Crear nueva publicación
router.post('/crear', upload.single('archivo'), async (req, res) => {
  try {
    const {
      usuario_id,
      tipo_id,
      titulo,
      autor_principal,
      correo_contacto,
      institucion,
      pais,
      area_conocimiento,
      resumen,
      palabras_clave
    } = req.body;

    // Validar campos requeridos
    if (!usuario_id || !tipo_id || !titulo || !autor_principal || !correo_contacto) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos obligatorios' 
      });
    }

    // Validar que se haya subido un archivo
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Debe subir un archivo' 
      });
    }

    // Preparar datos del archivo
    const archivoBuffer = req.file.buffer;
    const archivoNombre = req.file.originalname;
    const archivoMime = req.file.mimetype;

    // Insertar en la base de datos
    const query = `
      INSERT INTO publicaciones (
        usuario_id, tipo_id, titulo, autor_principal, correo_contacto,
        institucion, pais, area_conocimiento, resumen, palabras_clave,
        archivo, archivo_nombre, archivo_mime
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      usuario_id,
      tipo_id,
      titulo,
      autor_principal,
      correo_contacto,
      institucion || null,
      pais || null,
      area_conocimiento || null,
      resumen || null,
      palabras_clave || null,
      archivoBuffer,
      archivoNombre,
      archivoMime
    ]);

    res.json({
      success: true,
      message: 'Publicación creada exitosamente',
      publicacionId: result.insertId
    });

  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear la publicación',
      error: error.message 
    });
  }
});

// GET - Obtener todas las publicaciones
router.get('/listar', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id,
        p.titulo,
        p.autor_principal,
        p.institucion,
        p.fecha_subida,
        p.estado,
        t.nombre as tipo_documento,
        u.nombre as usuario_nombre
      FROM publicaciones p
      JOIN tipos_documento t ON p.tipo_id = t.id
      JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.fecha_subida DESC
    `;

    const [publicaciones] = await db.query(query);

    res.json({
      success: true,
      publicaciones
    });

  } catch (error) {
    console.error('Error al listar publicaciones:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las publicaciones' 
    });
  }
});

// GET - Obtener publicaciones por tipo
router.get('/tipo/:tipo_id', async (req, res) => {
  try {
    const { tipo_id } = req.params;

    const query = `
      SELECT 
        p.id,
        p.titulo,
        p.autor_principal,
        p.institucion,
        p.pais,
        p.area_conocimiento,
        p.resumen,
        p.palabras_clave,
        p.fecha_subida,
        p.estado,
        p.archivo_nombre,
        t.nombre as tipo_documento
      FROM publicaciones p
      JOIN tipos_documento t ON p.tipo_id = t.id
      WHERE p.tipo_id = ? AND p.estado = 'aprobado'
      ORDER BY p.fecha_subida DESC
    `;

    const [publicaciones] = await db.query(query, [tipo_id]);

    res.json({
      success: true,
      publicaciones
    });

  } catch (error) {
    console.error('Error al obtener publicaciones por tipo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las publicaciones' 
    });
  }
});

// GET - Obtener detalle de una publicación (sin el archivo)
router.get('/detalle/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        p.id,
        p.titulo,
        p.autor_principal,
        p.correo_contacto,
        p.institucion,
        p.pais,
        p.area_conocimiento,
        p.resumen,
        p.palabras_clave,
        p.archivo_nombre,
        p.archivo_mime,
        p.fecha_subida,
        p.estado,
        t.nombre as tipo_documento,
        u.nombre as usuario_nombre
      FROM publicaciones p
      JOIN tipos_documento t ON p.tipo_id = t.id
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = ?
    `;

    const [publicaciones] = await db.query(query, [id]);

    if (publicaciones.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Publicación no encontrada' 
      });
    }

    res.json({
      success: true,
      publicacion: publicaciones[0]
    });

  } catch (error) {
    console.error('Error al obtener detalle de publicación:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la publicación' 
    });
  }
});

// GET - Descargar archivo de una publicación
router.get('/descargar/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT archivo, archivo_nombre, archivo_mime
      FROM publicaciones
      WHERE id = ?
    `;

    const [publicaciones] = await db.query(query, [id]);

    if (publicaciones.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Publicación no encontrada' 
      });
    }

    const publicacion = publicaciones[0];

    // Configurar headers para la descarga
    res.setHeader('Content-Type', publicacion.archivo_mime);
    res.setHeader('Content-Disposition', `attachment; filename="${publicacion.archivo_nombre}"`);
    
    // Enviar el archivo
    res.send(publicacion.archivo);

  } catch (error) {
    console.error('Error al descargar archivo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al descargar el archivo' 
    });
  }
});

// GET - Obtener tipos de documento
router.get('/tipos', async (req, res) => {
  try {
    const query = 'SELECT * FROM tipos_documento ORDER BY id';
    const [tipos] = await db.query(query);

    res.json({
      success: true,
      tipos
    });

  } catch (error) {
    console.error('Error al obtener tipos de documento:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los tipos de documento' 
    });
  }
});

// GET - Obtener publicaciones pendientes de aprobación
router.get('/pendientes', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id,
        p.titulo,
        p.autor_principal,
        p.correo_contacto,
        p.institucion,
        p.pais,
        p.area_conocimiento,
        p.resumen,
        p.palabras_clave,
        p.fecha_subida,
        p.estado,
        t.nombre as tipo_documento
      FROM publicaciones p
      JOIN tipos_documento t ON p.tipo_id = t.id
      WHERE p.estado = 'en_revision'
      ORDER BY p.fecha_subida ASC
    `;

    const [publicaciones] = await db.query(query);

    res.json({
      success: true,
      publicaciones
    });

  } catch (error) {
    console.error('Error al obtener publicaciones pendientes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las publicaciones pendientes' 
    });
  }
});

// PUT - Aprobar una publicación
router.put('/aprobar/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE publicaciones 
      SET estado = 'aprobado' 
      WHERE id = ?
    `;

    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Publicación aprobada exitosamente'
    });

  } catch (error) {
    console.error('Error al aprobar publicación:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al aprobar la publicación' 
    });
  }
});

module.exports = router;
