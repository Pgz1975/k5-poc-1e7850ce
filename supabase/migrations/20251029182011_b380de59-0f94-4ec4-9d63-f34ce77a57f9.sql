-- ============================================
-- COMPREHENSIVE FIX FOR LESSON ORDERING
-- Eliminates duplicates and standardizes domains
-- ============================================

-- GRADE 1: Consolidate English Domains
UPDATE lesson_ordering 
SET domain_name = 'English: Phonological Awareness'
WHERE grade_level = 1 AND domain_order = 10;

UPDATE lesson_ordering 
SET domain_name = 'English: Reading Comprehension'
WHERE grade_level = 1 AND domain_order = 11;

-- GRADE 2: Separate Spanish and English Content
-- Move English lessons to domain_order 10+
UPDATE lesson_ordering lo
SET domain_name = 'English: Story Narration', domain_order = 10
WHERE grade_level = 2 
  AND domain_order = 1 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Phonics & Sound Awareness', domain_order = 11
WHERE grade_level = 2 
  AND domain_order = 2 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Vocabulary & Morphology', domain_order = 12
WHERE grade_level = 2 
  AND domain_order = 3 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Comprehension', domain_order = 13
WHERE grade_level = 2 
  AND domain_order = 4 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Writing & Speaking', domain_order = 14
WHERE grade_level = 2 
  AND domain_order = 5 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Closure & Reflection', domain_order = 15
WHERE grade_level = 2 
  AND domain_order = 6 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

-- Consolidate Spanish domain names for Grade 2
UPDATE lesson_ordering
SET domain_name = 'DOMINIO 1: NARRACIÓN DE CUENTO'
WHERE grade_level = 2 AND domain_order = 1
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 2: FONÉTICA Y CONCIENCIA FONOLÓGICA'
WHERE grade_level = 2 AND domain_order = 2
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 3: VOCABULARIO Y MORFOLOGÍA'
WHERE grade_level = 2 AND domain_order = 3
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 4: COMPRENSIÓN'
WHERE grade_level = 2 AND domain_order = 4
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 5: INTEGRACIÓN DE ESCRITURA Y EXPRESIÓN ORAL'
WHERE grade_level = 2 AND domain_order = 5
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 6: CIERRE Y REFLEXIÓN'
WHERE grade_level = 2 AND domain_order = 6
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

-- GRADE 3: Separate Spanish and English Content
UPDATE lesson_ordering lo
SET domain_name = 'English: Story Narration & Guided Reading', domain_order = 10
WHERE grade_level = 3 
  AND domain_order = 1 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Phonemic & Phonics Practice', domain_order = 11
WHERE grade_level = 3 
  AND domain_order = 2 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Vocabulary in Context', domain_order = 12
WHERE grade_level = 3 
  AND domain_order = 3 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Fluency & Expression', domain_order = 13
WHERE grade_level = 3 
  AND domain_order = 4 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Comprehension & Analysis', domain_order = 14
WHERE grade_level = 3 
  AND domain_order = 5 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Writing & Reflection', domain_order = 15
WHERE grade_level = 3 
  AND domain_order = 6 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

-- Consolidate Spanish domain names for Grade 3
UPDATE lesson_ordering
SET domain_name = 'DOMINIO 1: NARRACIÓN DE CUENTO Y LECTURA GUIADA'
WHERE grade_level = 3 AND domain_order = 1
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 2: PRÁCTICA FONÉMICA Y FONÉTICA'
WHERE grade_level = 3 AND domain_order = 2
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 3: VOCABULARIO EN CONTEXTO'
WHERE grade_level = 3 AND domain_order = 3
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 4: FLUIDEZ Y EXPRESIÓN'
WHERE grade_level = 3 AND domain_order = 4
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 5: COMPRENSIÓN Y ANÁLISIS'
WHERE grade_level = 3 AND domain_order = 5
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 6: ESCRITURA Y REFLEXIÓN'
WHERE grade_level = 3 AND domain_order = 6
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

-- GRADE 4: Fix "Sin clasificar" and separate English content
UPDATE lesson_ordering
SET domain_name = 'DOMINIO 1: ORIENTACIÓN GENERAL'
WHERE grade_level = 4 AND domain_name = 'Sin clasificar';

UPDATE lesson_ordering lo
SET domain_name = 'English: Phonemic & Phonics Practice', domain_order = 10
WHERE grade_level = 4 
  AND domain_order IN (1, 2)
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Vocabulary in Context', domain_order = 11
WHERE grade_level = 4 
  AND domain_order = 3 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Fluency & Expression', domain_order = 12
WHERE grade_level = 4 
  AND domain_order = 4 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Comprehension & Analysis', domain_order = 13
WHERE grade_level = 4 
  AND domain_order = 5 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Writing & Reflection', domain_order = 14
WHERE grade_level = 4 
  AND domain_order = 6 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

-- GRADE 5: Separate Spanish and English Content
UPDATE lesson_ordering lo
SET domain_name = 'English: Story Narration & Guided Reading', domain_order = 10
WHERE grade_level = 5 
  AND domain_order = 1 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Phonemic & Phonics Practice', domain_order = 11
WHERE grade_level = 5 
  AND domain_order = 2 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Vocabulary in Context', domain_order = 12
WHERE grade_level = 5 
  AND domain_order = 3 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Fluency & Expression', domain_order = 13
WHERE grade_level = 5 
  AND domain_order = 4 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Comprehension & Analysis', domain_order = 14
WHERE grade_level = 5 
  AND domain_order = 5 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

UPDATE lesson_ordering lo
SET domain_name = 'English: Writing & Reflection', domain_order = 15
WHERE grade_level = 5 
  AND domain_order = 6 
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'en');

-- Consolidate Spanish domain names for Grade 5
UPDATE lesson_ordering
SET domain_name = 'DOMINIO 1: NARRACIÓN DE CUENTO Y LECTURA GUIADA'
WHERE grade_level = 5 AND domain_order = 1
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 2: PRÁCTICA FONÉMICA Y FONÉTICA'
WHERE grade_level = 5 AND domain_order = 2
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 3: VOCABULARIO EN CONTEXTO'
WHERE grade_level = 5 AND domain_order = 3
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 4: FLUIDEZ Y EXPRESIÓN'
WHERE grade_level = 5 AND domain_order = 4
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 5: COMPRENSIÓN Y ANÁLISIS'
WHERE grade_level = 5 AND domain_order = 5
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 6: ESCRITURA Y REFLEXIÓN'
WHERE grade_level = 5 AND domain_order = 6
  AND assessment_id IN (SELECT id FROM manual_assessments WHERE language = 'es');

-- FIX KINDERGARTEN ORPHANED EXERCISES
-- Assign parent_lesson_id to exercises without parents
UPDATE manual_assessments
SET parent_lesson_id = (
  SELECT id FROM manual_assessments parent
  WHERE parent.type = 'lesson'
    AND parent.grade_level = 0
    AND parent.title ILIKE '%letra Oo%'
  LIMIT 1
)
WHERE id IN ('2afc4bc9-ef86-4f1c-9e53-670cf6c39af0', '89e99c03-fb7f-4e04-8e98-d4b5a3f32a5c')
  AND type = 'exercise'
  AND parent_lesson_id IS NULL;

UPDATE manual_assessments
SET parent_lesson_id = (
  SELECT id FROM manual_assessments parent
  WHERE parent.type = 'lesson'
    AND parent.grade_level = 0
    AND parent.title ILIKE '%letra Mm%'
  LIMIT 1
)
WHERE id IN ('3a02a754-c4d0-4b5e-94e4-e83ea96394a8', 'fe2ae9c1-64c8-42d1-9607-25ab2c9c4b82')
  AND type = 'exercise'
  AND parent_lesson_id IS NULL;

UPDATE manual_assessments
SET parent_lesson_id = (
  SELECT id FROM manual_assessments parent
  WHERE parent.type = 'lesson'
    AND parent.grade_level = 0
    AND parent.title ILIKE '%letra Ss%'
  LIMIT 1
)
WHERE id IN ('6a6f5a6f-ec39-4e71-9aa6-8c66d3d5a9f2', '9d86a02e-5eb4-48dd-863b-c2d9f67cf754')
  AND type = 'exercise'
  AND parent_lesson_id IS NULL;

UPDATE manual_assessments
SET parent_lesson_id = (
  SELECT id FROM manual_assessments parent
  WHERE parent.type = 'lesson'
    AND parent.grade_level = 0
    AND parent.title ILIKE '%letra Aa%'
  LIMIT 1
)
WHERE id IN ('a8b5fe1c-56c7-4f9b-bb7a-1e3f7c8e4d9a', 'c9d4e8f1-7a2b-4c5d-8e9f-2a3b4c5d6e7f')
  AND type = 'exercise'
  AND parent_lesson_id IS NULL;