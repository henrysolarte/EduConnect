const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const publicacionesRoutes = require('./routes/publicaciones');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', authRoutes);
app.use('/api/publicaciones', publicacionesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API EduConnect funcionando' });
});

app.listen(PORT, () => {
  console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
});
