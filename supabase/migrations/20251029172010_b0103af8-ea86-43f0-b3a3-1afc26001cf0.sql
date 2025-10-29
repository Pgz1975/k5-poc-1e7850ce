-- Insert lesson_ordering for 15 missing Kindergarten lessons
-- Based on Bosquejo-Modulo-Kinder.md structure

-- DOMINIO 1: Conciencia Fonológica y Fonémica (domain_order = 1)
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES
  (0, '34b4d7f1-1b72-43bd-b752-19289e46204e', 5, 'DOMINIO 1: Conciencia Fonológica y Fonémica', 1), -- Introducción al lenguaje
  (0, '9fd82502-362b-4d0e-8864-5ae911245378', 6, 'DOMINIO 1: Conciencia Fonológica y Fonémica', 1), -- Las Vocales Uu
  (0, 'b5f477de-ffa9-4646-b6dd-c41c54717adc', 7, 'DOMINIO 1: Conciencia Fonológica y Fonémica', 1), -- Las consonantes
  (0, '92be01dd-dd59-4708-b2ff-c77a770c5b3d', 8, 'DOMINIO 1: Conciencia Fonológica y Fonémica', 1); -- Las Consonantes (duplicate)

-- DOMINIO 2: Fonética y Discriminación Auditiva (domain_order = 2)
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES
  (0, 'e2e2cab3-b0c4-44df-be7b-4e3ade25464d', 9, 'DOMINIO 2: Fonética y Discriminación Auditiva', 2), -- Fonética: Escucho los sonidos
  (0, 'acc140cc-d36f-4050-8f51-e8bf7968c9d1', 10, 'DOMINIO 2: Fonética y Discriminación Auditiva', 2), -- Encuentra el Sonido con Coquí
  (0, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', 11, 'DOMINIO 2: Fonética y Discriminación Auditiva', 2), -- Une los Sonidos
  (0, 'fab0dfbb-392a-4414-9ca5-3fa5f7e96272', 12, 'DOMINIO 2: Fonética y Discriminación Auditiva', 2), -- Busco Rimas
  (0, 'c408279c-0219-4af7-baee-55040879be35', 13, 'DOMINIO 2: Fonética y Discriminación Auditiva', 2); -- Actividad digital: "Escucha y habla"

-- DOMINIO 3: Decodificación y Producción Inicial (domain_order = 3)
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES
  (0, 'b3fd768e-2104-4b7c-bed0-a460e086cce8', 14, 'DOMINIO 3: Decodificación y Producción Inicial', 3), -- Forma la palabra
  (0, 'd633e0e2-da19-487d-bbf3-8eafe2bb54de', 15, 'DOMINIO 3: Decodificación y Producción Inicial', 3); -- Lectura rápida

-- DOMINIO 4: Fluidez y Comprensión Literal (domain_order = 4)
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES
  (0, 'd18b2d0d-8536-4fb2-8325-515dc9abba5c', 16, 'DOMINIO 4: Fluidez y Comprensión Literal', 4); -- Lectura corta guiada

-- English Lessons - Separate classification
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES
  (0, '909ec727-5cf4-45ff-82bb-d969c6cf5a71', 17, 'Introduction to Reading (English)', 10), -- The Little Coquí Learns to Read
  (0, '4d21a54a-26b2-45e6-b621-8d9e7d8fb082', 18, 'Phonological Awareness (English)', 11); -- Alphabet Song Extension