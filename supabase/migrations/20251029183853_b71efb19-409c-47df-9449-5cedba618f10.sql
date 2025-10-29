-- Fix Kindergarten "Las vocales" Lesson Classification
-- Add "LAS VOCALES" to Domain 1
INSERT INTO lesson_ordering (
  grade_level,
  assessment_id,
  domain_name,
  domain_order,
  display_order
)
VALUES (
  0,
  '5ab108f0-9c87-4cbc-8bdb-f127a4acb23e',
  'DOMINIO 1: CONCIENCIA FONOLÓGICA Y FONÉMICA',
  1,
  4
)
ON CONFLICT (grade_level, assessment_id) DO UPDATE
SET 
  domain_name = EXCLUDED.domain_name,
  domain_order = EXCLUDED.domain_order,
  display_order = EXCLUDED.display_order;

-- Fix Grade 3 "Sin clasificar" Lessons with safe display_order values
-- For Grade 3, highest display_order is 26, so we use 100, 101, 102 for safety

-- Move module overview to Domain 0 (Orientation/Introduction)
UPDATE lesson_ordering
SET 
  domain_name = 'ORIENTACIÓN Y BIENVENIDA',
  domain_order = 0,
  display_order = 100
WHERE assessment_id = 'ef6e8a14-cfd5-4783-b926-8e37f4d07094';

-- Move "Prefijos y sufijos" to Domain 1 (Fonética avanzada)
UPDATE lesson_ordering
SET 
  domain_name = 'DOMINIO 1: CONCIENCIA FONOLÓGICA Y FONÉTICA AVANZADA',
  domain_order = 1,
  display_order = 101
WHERE assessment_id = 'de47dda1-e4c1-40a8-9a28-90be5aa8f17c';

-- Move "Parte 1 Ejercicios" to Domain 1 (Basic practice)
UPDATE lesson_ordering
SET 
  domain_name = 'DOMINIO 1: CONCIENCIA FONOLÓGICA Y FONÉTICA AVANZADA',
  domain_order = 1,
  display_order = 102
WHERE assessment_id = '90444257-86fd-46b2-a469-104a05ee4fbb';