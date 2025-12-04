/**
 * Script para crear un usuario administrador
 * 
 * Uso: node create-admin.js
 * 
 * Este script genera el hash bcrypt y muestra el comando SQL
 * para insertar un usuario administrador en la base de datos.
 */

const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Escape special SQL characters to prevent injection
function escapeSqlString(str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case "\0": return "\\0";
      case "\x08": return "\\b";
      case "\x09": return "\\t";
      case "\x1a": return "\\z";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\" + char;
      default:
        return char;
    }
  });
}

async function main() {
  console.log('\n🎓 EduConnect - Crear Usuario Administrador\n');
  console.log('Este script genera el SQL para insertar un administrador.\n');

  const nombre = await question('Nombre del administrador: ');
  const email = await question('Email: ');
  const password = await question('Contraseña: ');

  if (!nombre || !email || !password) {
    console.error('\n❌ Todos los campos son requeridos');
    rl.close();
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('\n❌ La contraseña debe tener al menos 6 caracteres');
    rl.close();
    process.exit(1);
  }

  console.log('\n⏳ Generando hash de contraseña...\n');
  const hash = await bcrypt.hash(password, 10);

  // Escape inputs for SQL safety
  const safeNombre = escapeSqlString(nombre);
  const safeEmail = escapeSqlString(email);

  console.log('✅ Hash generado exitosamente!\n');
  console.log('Ejecuta el siguiente comando SQL en tu base de datos:\n');
  console.log('─'.repeat(60));
  console.log(`
INSERT INTO usuarios (nombre, email, password_hash, rol_id) 
VALUES ('${safeNombre}', '${safeEmail}', '${hash}', 1);
`);
  console.log('─'.repeat(60));
  console.log('\n⚠️  Guarda las credenciales de forma segura.');
  console.log(`   Email: ${email}`);
  console.log(`   Contraseña: (la que ingresaste)\n`);

  rl.close();
}

main().catch(console.error);
