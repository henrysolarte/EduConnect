-- Script para crear usuario administrador
-- Ejecutar este script en MySQL Workbench o phpMyAdmin

USE educonnect;

-- Insertar usuario administrador
-- Usuario: admin@admin.com
-- Password: 123456
-- Hash bcrypt generado para la contraseña "123456"
INSERT INTO usuarios (nombre, email, password, rol_id, aprobado) 
VALUES (
  'Administrador1',
  'admin@admin.com',
  '123456',
  1,
  1
);

-- Verificar que se creó correctamente
SELECT id, nombre, email, rol_id, aprobado FROM usuarios WHERE email = 'admin@admin.com';
