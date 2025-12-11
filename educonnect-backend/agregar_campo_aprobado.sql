-- Script para agregar campo de aprobación a la tabla usuarios
-- Ejecutar este script en MySQL Workbench o phpMyAdmin

USE educonnect;

-- Agregar campo aprobado (por defecto 0 = no aprobado, 1 = aprobado)
ALTER TABLE usuarios 
ADD COLUMN aprobado BOOLEAN DEFAULT 0 AFTER rol_id;

-- Los administradores y estudiantes se aprueban automáticamente
UPDATE usuarios SET aprobado = 1 WHERE rol_id IN (1, 2);

-- Los profesores quedan en estado pendiente (aprobado = 0) hasta que un admin los apruebe
-- Puedes cambiar esto si quieres aprobar profesores existentes:
-- UPDATE usuarios SET aprobado = 1 WHERE rol_id = 3;

-- Verificar los cambios
SELECT id, nombre, email, rol_id, aprobado FROM usuarios;
