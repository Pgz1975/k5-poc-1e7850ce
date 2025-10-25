-- Fix Comprensión Domain: Add 5 unmapped lessons with 23 exercises
-- Start from display_order 11 to avoid conflicts

INSERT INTO lesson_ordering (
  grade_level,
  assessment_id,
  display_order,
  domain_name,
  domain_order,
  parent_lesson_id
) VALUES
  -- Lesson 1: El regalo de las palabras amables (9 exercises)
  (1, 'cf230454-3b72-4b83-a1b1-d9afc753f521', 11, 'Comprensión', 5, NULL),
  
  -- Lesson 2: UNA TARDE EN EL PARQUE (5 exercises)
  (1, '9b644e9f-9ccb-46b1-8d6c-644e63d4c4a2', 12, 'Comprensión', 5, NULL),
  
  -- Lesson 3: LECTURA MI SAPO (4 exercises)
  (1, '48051a77-1692-4822-a0ba-15291e23baeb', 13, 'Comprensión', 5, NULL),
  
  -- Lesson 4: Comprensión (4 exercises)
  (1, '22221c5f-5371-4e92-9130-171023807c38', 14, 'Comprensión', 5, NULL),
  
  -- Lesson 5: Lectura Fluida de Puerto Rico con Coquí (1 exercise)
  (1, 'd73abe8b-8e95-4103-93fe-ceb0c7538588', 15, 'Comprensión', 5, NULL)
ON CONFLICT (assessment_id, grade_level) DO NOTHING;