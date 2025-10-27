-- Backfill domain_name and domain_order for legacy Grade 2 lessons
-- Only update records where domain_name is NULL to avoid overwriting V2 lessons

-- Update Dominio 1: Fonética y Conciencia Fonológica
UPDATE lesson_ordering 
SET 
  domain_name = 'Fonética y Conciencia Fonológica',
  domain_order = 1
WHERE domain_name IS NULL
  AND assessment_id IN (
    SELECT id FROM manual_assessments 
    WHERE grade_level = 2 
      AND type = 'lesson'
      AND language = 'es'
      AND (title ILIKE '%Dominio 1%' OR title ILIKE '%Fonética%')
  );

-- Update Dominio 2: Fluidez Lectora
UPDATE lesson_ordering 
SET 
  domain_name = 'Fluidez Lectora',
  domain_order = 2
WHERE domain_name IS NULL
  AND assessment_id IN (
    SELECT id FROM manual_assessments 
    WHERE grade_level = 2 
      AND type = 'lesson'
      AND language = 'es'
      AND (title ILIKE '%Dominio 2%' OR title ILIKE '%Fluidez%')
  );

-- Update Dominio 3: Desarrollo de Vocabulario
UPDATE lesson_ordering 
SET 
  domain_name = 'Desarrollo de Vocabulario',
  domain_order = 3
WHERE domain_name IS NULL
  AND assessment_id IN (
    SELECT id FROM manual_assessments 
    WHERE grade_level = 2 
      AND type = 'lesson'
      AND language = 'es'
      AND (title ILIKE '%Dominio 3%' OR title ILIKE '%Vocabulario%')
  );

-- Update Dominio 4: Comprensión Literal
UPDATE lesson_ordering 
SET 
  domain_name = 'Comprensión Literal',
  domain_order = 4
WHERE domain_name IS NULL
  AND assessment_id IN (
    SELECT id FROM manual_assessments 
    WHERE grade_level = 2 
      AND type = 'lesson'
      AND language = 'es'
      AND (title ILIKE '%Dominio 4%' OR title ILIKE '%Comprensión Literal%')
  );

-- Update Dominio 5: Comprensión Inferencial
UPDATE lesson_ordering 
SET 
  domain_name = 'Comprensión Inferencial',
  domain_order = 5
WHERE domain_name IS NULL
  AND assessment_id IN (
    SELECT id FROM manual_assessments 
    WHERE grade_level = 2 
      AND type = 'lesson'
      AND language = 'es'
      AND (title ILIKE '%Dominio 5%' OR title ILIKE '%Comprensión Inferencial%')
  );