-- Fix Grade 1 lesson_ordering domain names to match curriculum and prevent duplication

-- Domain 1: Consolidate all "Conciencia Fonológica" variations into DOMINIO 1
UPDATE lesson_ordering 
SET domain_name = 'DOMINIO 1: CONCIENCIA FONOLÓGICA Y FONÉTICA'
WHERE grade_level = 1 
  AND domain_order = 1
  AND domain_name IN ('Conciencia Fonológica', 'Conciencia Fonológica y Fonética', 'DOMINIO 1: CONCIENCIA FONOLÓGICA Y FONÉTICA');

-- Domain 2: Standardize to match curriculum
UPDATE lesson_ordering 
SET domain_name = 'DOMINIO 2: CORRESPONDENCIA GRAFEMA-FONEMA'
WHERE grade_level = 1 
  AND domain_order = 2;

-- Domain 3: Consolidate Conciencia Silábica
UPDATE lesson_ordering 
SET domain_name = 'DOMINIO 3: CONCIENCIA SILÁBICA Y FLUIDEZ'
WHERE grade_level = 1 
  AND domain_order = 3;

-- Domain 4: Standardize Vocabulario
UPDATE lesson_ordering 
SET domain_name = 'DOMINIO 4: VOCABULARIO'
WHERE grade_level = 1 
  AND domain_order = 4;

-- Domain 5: Consolidate Spanish reading comprehension
UPDATE lesson_ordering 
SET domain_name = 'DOMINIO 5: LEER Y COMPRENDER'
WHERE grade_level = 1 
  AND domain_order = 5
  AND assessment_id IN (
    SELECT id FROM manual_assessments WHERE language = 'es' AND grade_level = 1
  );

-- Move English exercises to separate domain_order to prevent mixing
UPDATE lesson_ordering
SET domain_name = 'English: Phonological Awareness',
    domain_order = 10
WHERE grade_level = 1
  AND assessment_id IN (
    SELECT id FROM manual_assessments 
    WHERE language = 'en' 
      AND grade_level = 1
      AND (title ILIKE '%phonological%' OR title ILIKE '%phonemic%')
  );

UPDATE lesson_ordering
SET domain_name = 'English: Reading Comprehension',
    domain_order = 11
WHERE grade_level = 1
  AND assessment_id IN (
    SELECT id FROM manual_assessments 
    WHERE language = 'en' 
      AND grade_level = 1
      AND (title ILIKE '%reading%' OR title ILIKE '%comprehension%')
  );

-- Fix Kindergarten domain names to match curriculum
UPDATE lesson_ordering
SET domain_name = 'DOMINIO 1: CONCIENCIA FONOLÓGICA Y FONÉMICA'
WHERE grade_level = 0
  AND domain_order = 1;

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 2: FONÉTICA Y DISCRIMINACIÓN AUDITIVA'
WHERE grade_level = 0
  AND domain_order = 2;

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 3: DECODIFICACIÓN Y PRODUCCIÓN INICIAL'
WHERE grade_level = 0
  AND domain_order = 3;

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 4: FLUIDEZ Y COMPRENSIÓN LITERAL'
WHERE grade_level = 0
  AND domain_order = 4;

UPDATE lesson_ordering
SET domain_name = 'DOMINIO 5: ESCUCHAR, LEER Y COMPRENDER'
WHERE grade_level = 0
  AND domain_order = 5;