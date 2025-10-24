-- Update lesson_ordering with domain metadata for existing lessons
-- Based on lesson titles and content patterns

-- Conciencia Fonológica (Phonological Awareness) - Order 1
UPDATE lesson_ordering 
SET domain_name = 'Conciencia Fonológica', domain_order = 1
WHERE assessment_id IN (
  SELECT id FROM manual_assessments 
  WHERE title ILIKE '%fonémica%' OR title ILIKE '%phonological%'
);

-- Fonética (Phonics) - Order 2
UPDATE lesson_ordering 
SET domain_name = 'Fonética', domain_order = 2
WHERE assessment_id IN (
  SELECT id FROM manual_assessments 
  WHERE title ILIKE '%sonido%' OR title ILIKE '%phonics%' OR title ILIKE '%identificando%'
);

-- Conciencia Silábica (Syllable Awareness) - Order 3
UPDATE lesson_ordering 
SET domain_name = 'Conciencia Silábica', domain_order = 3
WHERE assessment_id IN (
  SELECT id FROM manual_assessments 
  WHERE title ILIKE '%sílaba%' OR title ILIKE '%syllable%' OR title ILIKE '%dividing%'
);

-- Vocabulario (Vocabulary) - Order 4
UPDATE lesson_ordering 
SET domain_name = 'Vocabulario', domain_order = 4
WHERE assessment_id IN (
  SELECT id FROM manual_assessments 
  WHERE title ILIKE '%palabra%' OR title ILIKE '%vocabulary%' OR title ILIKE '%doble%'
);

-- Comprensión (Comprehension) - Order 5
UPDATE lesson_ordering 
SET domain_name = 'Comprensión', domain_order = 5
WHERE assessment_id IN (
  SELECT id FROM manual_assessments 
  WHERE title ILIKE '%lectura%' OR title ILIKE '%comprehension%' OR title ILIKE '%fluida%'
);

-- Set remaining lessons without domain to a default
UPDATE lesson_ordering 
SET domain_name = 'Vocabulario', domain_order = 4
WHERE domain_name IS NULL;