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
-- Usuario administrador de ejemplo
-- Email: admin@educonnect.com
-- Password: Admin123
-- (Hash generado con bcrypt, rounds=10)
-- =============================================
-- NOTA: Este hash es para desarrollo. En producción, genera tu propio hash.
INSERT INTO usuarios (nombre, email, password_hash, rol_id) 
VALUES ('Administrador', 'admin@educonnect.com', '$2b$10$Xq8VpPKxMBHg9zQxB7vZE.YmPKX8y5ZGVA4Z7KF8r9g9G7xJ7Qp3y', 1)
ON DUPLICATE KEY UPDATE nombre = nombre;

-- =============================================
-- Ver estructura creada
-- =============================================
SELECT 'Tabla roles creada:' as mensaje;
SELECT * FROM roles;

SELECT 'Tabla usuarios creada:' as mensaje;
DESCRIBE usuarios;
