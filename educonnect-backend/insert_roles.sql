-- Script para insertar los roles en la base de datos educonnect
-- Ejecutar este script en MySQL Workbench

USE educonnect;

-- Insertar los tres roles
INSERT INTO roles (id, nombre, descripcion) VALUES 
(1, 'Administrador', 'Acceso completo al sistema'),
(2, 'Estudiante', 'Usuario registrado desde la web'),
(3, 'Profesor', 'Instructor de cursos');

-- Verificar que se insertaron correctamente
SELECT * FROM roles;
