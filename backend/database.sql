-- =============================================
-- Script de inicialización de base de datos
-- EduConnect - Sistema de Autenticación
-- =============================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS educonnect;
USE educonnect;

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Insertar roles
INSERT INTO roles (id, nombre) VALUES 
(1, 'administrador'),
(2, 'estudiante')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL DEFAULT 2,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Crear índice para búsqueda por email
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- =============================================
-- Para crear un usuario administrador, usa el script
-- create-admin.js que genera un hash seguro:
--
-- cd backend
-- node create-admin.js
-- 
-- O manualmente:
-- 1. Genera el hash con: node -e "require('bcrypt').hash('TuPassword', 10).then(console.log)"
-- 2. Ejecuta el INSERT con tu hash generado
-- =============================================

-- =============================================
-- Ver estructura creada
-- =============================================
SELECT 'Tabla roles creada:' as mensaje;
SELECT * FROM roles;

SELECT 'Tabla usuarios creada:' as mensaje;
DESCRIBE usuarios;
