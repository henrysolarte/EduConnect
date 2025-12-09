const db = require('./config/database');

console.log('Consultando roles en la base de datos...\n');

db.query('SELECT * FROM roles', (err, results) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }

  if (results.length === 0) {
    console.log('⚠️  La tabla roles está VACÍA');
    console.log('\nNecesitas insertar los roles:');
    console.log('INSERT INTO roles (id, nombre, descripcion) VALUES');
    console.log("(1, 'Administrador', 'Acceso completo al sistema'),");
    console.log("(2, 'Estudiante', 'Usuario registrado desde la web'),");
    console.log("(3, 'Profesor', 'Instructor de cursos');");
  } else {
    console.log('✓ Roles encontrados:\n');
    console.table(results);
  }

  process.exit(0);
});
