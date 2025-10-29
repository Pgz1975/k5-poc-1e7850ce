-- STEP 2 (Fixed): Create lesson_ordering records for Grades 2-5
-- Ensuring unique display_order per grade level

-- Spanish Grade 2
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
SELECT 
  2 as grade_level,
  id as assessment_id,
  ROW_NUMBER() OVER (ORDER BY 
    CASE 
      WHEN title ILIKE '%fonética%' OR title ILIKE '%fonológica%' OR title ILIKE '%dígrafos%' THEN 1
      WHEN title ILIKE '%fluidez%' THEN 2
      WHEN title ILIKE '%vocabulario%' THEN 3
      WHEN title ILIKE '%literal%' THEN 4
      WHEN title ILIKE '%inferencial%' THEN 5
      ELSE 6
    END,
    title
  ) as display_order,
  CASE 
    WHEN title ILIKE '%fonética%' OR title ILIKE '%fonológica%' OR title ILIKE '%dígrafos%' THEN 'Fonética y Conciencia Fonológica'
    WHEN title ILIKE '%fluidez%' THEN 'Fluidez en Lectura Guiada'
    WHEN title ILIKE '%vocabulario%' THEN 'Desarrollo de Vocabulario'
    WHEN title ILIKE '%literal%' THEN 'Comprensión Literal'
    WHEN title ILIKE '%inferencial%' THEN 'Comprensión Inferencial/Crítica'
    ELSE 'Sin clasificar'
  END as domain_name,
  CASE 
    WHEN title ILIKE '%fonética%' OR title ILIKE '%fonológica%' OR title ILIKE '%dígrafos%' THEN 1
    WHEN title ILIKE '%fluidez%' THEN 2
    WHEN title ILIKE '%vocabulario%' THEN 3
    WHEN title ILIKE '%literal%' THEN 4
    WHEN title ILIKE '%inferencial%' THEN 5
    ELSE 6
  END as domain_order
FROM manual_assessments
WHERE grade_level = 2 
  AND language = 'es'
  AND type = 'lesson'
  AND parent_lesson_id IS NULL
  AND status = 'published'
  AND id NOT IN (SELECT assessment_id FROM lesson_ordering WHERE grade_level = 2);

-- English Grade 2
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
SELECT 
  2 as grade_level,
  id as assessment_id,
  (SELECT COALESCE(MAX(display_order), 0) FROM lesson_ordering WHERE grade_level = 2) + 
  ROW_NUMBER() OVER (ORDER BY 
    CASE 
      WHEN title ILIKE '%little boat%' OR title ILIKE '%parrot%' THEN 1
      WHEN title ILIKE '%phonics%' THEN 2
      WHEN title ILIKE '%vocabulary%' THEN 3
      WHEN title ILIKE '%comprehension%' THEN 4
      WHEN title ILIKE '%writing%' OR title ILIKE '%speaking%' THEN 5
      WHEN title ILIKE '%closure%' OR title ILIKE '%reflection%' THEN 6
      ELSE 7
    END,
    title
  ) as display_order,
  CASE 
    WHEN title ILIKE '%little boat%' OR title ILIKE '%parrot%' THEN 'Story Narration'
    WHEN title ILIKE '%phonics%' THEN 'Phonics & Sound Awareness'
    WHEN title ILIKE '%vocabulary%' THEN 'Vocabulary & Morphology'
    WHEN title ILIKE '%comprehension%' THEN 'Comprehension'
    WHEN title ILIKE '%writing%' OR title ILIKE '%speaking%' THEN 'Writing & Speaking Integration'
    WHEN title ILIKE '%closure%' OR title ILIKE '%reflection%' THEN 'Closure & Reflection'
    ELSE 'Uncategorized'
  END as domain_name,
  CASE 
    WHEN title ILIKE '%little boat%' OR title ILIKE '%parrot%' THEN 1
    WHEN title ILIKE '%phonics%' THEN 2
    WHEN title ILIKE '%vocabulary%' THEN 3
    WHEN title ILIKE '%comprehension%' THEN 4
    WHEN title ILIKE '%writing%' OR title ILIKE '%speaking%' THEN 5
    WHEN title ILIKE '%closure%' OR title ILIKE '%reflection%' THEN 6
    ELSE 7
  END as domain_order
FROM manual_assessments
WHERE grade_level = 2 
  AND language = 'en'
  AND type = 'lesson'
  AND parent_lesson_id IS NULL
  AND status = 'published'
  AND id NOT IN (SELECT assessment_id FROM lesson_ordering WHERE grade_level = 2);

-- Spanish Grade 3
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
SELECT 
  3 as grade_level,
  id as assessment_id,
  ROW_NUMBER() OVER (ORDER BY 
    CASE 
      WHEN title ILIKE '%dominio 1%' OR title ILIKE '%fonológ%' OR title ILIKE '%fonétic%' THEN 1
      WHEN title ILIKE '%dominio 2%' OR title ILIKE '%fluidez%' THEN 2
      WHEN title ILIKE '%dominio 3%' OR title ILIKE '%vocabulario%' OR title ILIKE '%morfolog%' THEN 3
      WHEN title ILIKE '%dominio 4%' OR title ILIKE '%comprensión%' THEN 4
      WHEN title ILIKE '%dominio 5%' OR title ILIKE '%estructura%' OR title ILIKE '%propósito%' THEN 5
      WHEN title ILIKE '%dominio 6%' OR title ILIKE '%gramática%' OR title ILIKE '%oraciones%' THEN 6
      WHEN title ILIKE '%dominio 7%' OR title ILIKE '%escrit%' THEN 7
      WHEN title ILIKE '%dominio 8%' OR title ILIKE '%oral%' OR title ILIKE '%escucha%' THEN 8
      ELSE 9
    END,
    title
  ) as display_order,
  CASE 
    WHEN title ILIKE '%dominio 1%' OR title ILIKE '%fonológ%' OR title ILIKE '%fonétic%' THEN 'Conciencia Fonológica/Fonética'
    WHEN title ILIKE '%dominio 2%' OR title ILIKE '%fluidez%' THEN 'Fluidez de Lectura'
    WHEN title ILIKE '%dominio 3%' OR title ILIKE '%vocabulario%' OR title ILIKE '%morfolog%' THEN 'Vocabulario/Morfología'
    WHEN title ILIKE '%dominio 4%' OR title ILIKE '%comprensión%' THEN 'Comprensión'
    WHEN title ILIKE '%dominio 5%' OR title ILIKE '%estructura%' OR title ILIKE '%propósito%' THEN 'Estructura de Textos/Propósito del Autor'
    WHEN title ILIKE '%dominio 6%' OR title ILIKE '%gramática%' OR title ILIKE '%oraciones%' THEN 'Gramática/Estructura de Oraciones'
    WHEN title ILIKE '%dominio 7%' OR title ILIKE '%escrit%' THEN 'Expresión Escrita'
    WHEN title ILIKE '%dominio 8%' OR title ILIKE '%oral%' OR title ILIKE '%escucha%' THEN 'Expresión Oral/Escucha Activa'
    ELSE 'Sin clasificar'
  END as domain_name,
  CASE 
    WHEN title ILIKE '%dominio 1%' OR title ILIKE '%fonológ%' OR title ILIKE '%fonétic%' THEN 1
    WHEN title ILIKE '%dominio 2%' OR title ILIKE '%fluidez%' THEN 2
    WHEN title ILIKE '%dominio 3%' OR title ILIKE '%vocabulario%' OR title ILIKE '%morfolog%' THEN 3
    WHEN title ILIKE '%dominio 4%' OR title ILIKE '%comprensión%' THEN 4
    WHEN title ILIKE '%dominio 5%' OR title ILIKE '%estructura%' OR title ILIKE '%propósito%' THEN 5
    WHEN title ILIKE '%dominio 6%' OR title ILIKE '%gramática%' OR title ILIKE '%oraciones%' THEN 6
    WHEN title ILIKE '%dominio 7%' OR title ILIKE '%escrit%' THEN 7
    WHEN title ILIKE '%dominio 8%' OR title ILIKE '%oral%' OR title ILIKE '%escucha%' THEN 8
    ELSE 9
  END as domain_order
FROM manual_assessments
WHERE grade_level = 3 
  AND language = 'es'
  AND type = 'lesson'
  AND parent_lesson_id IS NULL
  AND status = 'published';

-- English Grade 3
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
SELECT 
  3 as grade_level,
  id as assessment_id,
  (SELECT COALESCE(MAX(display_order), 0) FROM lesson_ordering WHERE grade_level = 3) + 
  ROW_NUMBER() OVER (ORDER BY title) as display_order,
  CASE 
    WHEN title ILIKE '%story%' OR title ILIKE '%narration%' OR title ILIKE '%lunchbox%' OR title ILIKE '%storm%' THEN 'Story Narration & Guided Reading'
    WHEN title ILIKE '%phonics%' OR title ILIKE '%phonemic%' THEN 'Phonemic & Phonics Practice'
    WHEN title ILIKE '%vocabulary%' THEN 'Vocabulary in Context'
    WHEN title ILIKE '%fluency%' THEN 'Fluency & Expression'
    WHEN title ILIKE '%comprehension%' THEN 'Comprehension & Analysis'
    WHEN title ILIKE '%writing%' THEN 'Writing & Reflection'
    WHEN title ILIKE '%science%' OR title ILIKE '%SEL%' OR title ILIKE '%socio%' THEN 'Science/SEL Integration'
    ELSE 'Uncategorized'
  END as domain_name,
  CASE 
    WHEN title ILIKE '%story%' OR title ILIKE '%narration%' OR title ILIKE '%lunchbox%' OR title ILIKE '%storm%' THEN 1
    WHEN title ILIKE '%phonics%' OR title ILIKE '%phonemic%' THEN 2
    WHEN title ILIKE '%vocabulary%' THEN 3
    WHEN title ILIKE '%fluency%' THEN 4
    WHEN title ILIKE '%comprehension%' THEN 5
    WHEN title ILIKE '%writing%' THEN 6
    WHEN title ILIKE '%science%' OR title ILIKE '%SEL%' OR title ILIKE '%socio%' THEN 7
    ELSE 8
  END as domain_order
FROM manual_assessments
WHERE grade_level = 3
  AND language = 'en'
  AND type = 'lesson'
  AND parent_lesson_id IS NULL
  AND status = 'published';

-- Spanish Grade 4
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
SELECT 
  4 as grade_level,
  id as assessment_id,
  ROW_NUMBER() OVER (ORDER BY 
    CASE 
      WHEN title ILIKE '%dominio 1%' OR title ILIKE '%ortográf%' OR title ILIKE '%fonológ%' THEN 1
      WHEN title ILIKE '%dominio 2%' OR title ILIKE '%fluidez%' THEN 2
      WHEN title ILIKE '%dominio 3%' OR title ILIKE '%vocabulario%' OR title ILIKE '%morfolog%' THEN 3
      WHEN title ILIKE '%dominio 4%' OR title ILIKE '%comprensión%' THEN 4
      WHEN title ILIKE '%dominio 5%' OR title ILIKE '%estructura%' OR title ILIKE '%análisis%' THEN 5
      WHEN title ILIKE '%dominio 6%' OR title ILIKE '%figurado%' OR title ILIKE '%literario%' THEN 6
      WHEN title ILIKE '%dominio 7%' OR title ILIKE '%gramática%' OR title ILIKE '%puntuación%' THEN 7
      WHEN title ILIKE '%dominio 8%' OR title ILIKE '%escucha%' OR title ILIKE '%oral%' THEN 8
      WHEN title ILIKE '%dominio 9%' OR title ILIKE '%cultural%' OR title ILIKE '%literaria%' THEN 9
      ELSE 10
    END,
    title
  ) as display_order,
  CASE 
    WHEN title ILIKE '%dominio 1%' OR title ILIKE '%ortográf%' OR title ILIKE '%fonológ%' THEN 'Conciencia fonológica y ortográfica avanzada'
    WHEN title ILIKE '%dominio 2%' OR title ILIKE '%fluidez%' THEN 'Fluidez lectora guiada y autónoma'
    WHEN title ILIKE '%dominio 3%' OR title ILIKE '%vocabulario%' OR title ILIKE '%morfolog%' THEN 'Vocabulario y morfología derivativa'
    WHEN title ILIKE '%dominio 4%' OR title ILIKE '%comprensión%' THEN 'Comprensión lectora literal e inferencial'
    WHEN title ILIKE '%dominio 5%' OR title ILIKE '%estructura%' OR title ILIKE '%análisis%' THEN 'Estructura y análisis del texto'
    WHEN title ILIKE '%dominio 6%' OR title ILIKE '%figurado%' OR title ILIKE '%literario%' THEN 'Lenguaje figurado y recursos literarios'
    WHEN title ILIKE '%dominio 7%' OR title ILIKE '%gramática%' OR title ILIKE '%puntuación%' THEN 'Uso correcto de gramática y puntuación'
    WHEN title ILIKE '%dominio 8%' OR title ILIKE '%escucha%' OR title ILIKE '%oral%' THEN 'Escucha activa y expresión oral'
    WHEN title ILIKE '%dominio 9%' OR title ILIKE '%cultural%' OR title ILIKE '%literaria%' THEN 'Integración literaria y cultural'
    ELSE 'Sin clasificar'
  END as domain_name,
  CASE 
    WHEN title ILIKE '%dominio 1%' OR title ILIKE '%ortográf%' OR title ILIKE '%fonológ%' THEN 1
    WHEN title ILIKE '%dominio 2%' OR title ILIKE '%fluidez%' THEN 2
    WHEN title ILIKE '%dominio 3%' OR title ILIKE '%vocabulario%' OR title ILIKE '%morfolog%' THEN 3
    WHEN title ILIKE '%dominio 4%' OR title ILIKE '%comprensión%' THEN 4
    WHEN title ILIKE '%dominio 5%' OR title ILIKE '%estructura%' OR title ILIKE '%análisis%' THEN 5
    WHEN title ILIKE '%dominio 6%' OR title ILIKE '%figurado%' OR title ILIKE '%literario%' THEN 6
    WHEN title ILIKE '%dominio 7%' OR title ILIKE '%gramática%' OR title ILIKE '%puntuación%' THEN 7
    WHEN title ILIKE '%dominio 8%' OR title ILIKE '%escucha%' OR title ILIKE '%oral%' THEN 8
    WHEN title ILIKE '%dominio 9%' OR title ILIKE '%cultural%' OR title ILIKE '%literaria%' THEN 9
    ELSE 10
  END as domain_order
FROM manual_assessments
WHERE grade_level = 4 
  AND language = 'es'
  AND type = 'lesson'
  AND parent_lesson_id IS NULL
  AND status = 'published';

-- English Grade 4
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
SELECT 
  4 as grade_level,
  id as assessment_id,
  (SELECT COALESCE(MAX(display_order), 0) FROM lesson_ordering WHERE grade_level = 4) + 
  ROW_NUMBER() OVER (ORDER BY title) as display_order,
  CASE 
    WHEN title ILIKE '%lemonade%' OR title ILIKE '%maple%' THEN 'Story Narration & Guided Reading'
    WHEN title ILIKE '%phonics%' OR title ILIKE '%phonemic%' THEN 'Phonemic & Phonics Practice'
    WHEN title ILIKE '%vocabulary%' THEN 'Vocabulary in Context'
    WHEN title ILIKE '%fluency%' THEN 'Fluency & Expression'
    WHEN title ILIKE '%comprehension%' THEN 'Comprehension & Analysis'
    WHEN title ILIKE '%writing%' THEN 'Writing & Reflection'
    WHEN title ILIKE '%science%' OR title ILIKE '%SEL%' THEN 'Science/SEL Integration'
    ELSE 'Uncategorized'
  END as domain_name,
  CASE 
    WHEN title ILIKE '%lemonade%' OR title ILIKE '%maple%' THEN 1
    WHEN title ILIKE '%phonics%' OR title ILIKE '%phonemic%' THEN 2
    WHEN title ILIKE '%vocabulary%' THEN 3
    WHEN title ILIKE '%fluency%' THEN 4
    WHEN title ILIKE '%comprehension%' THEN 5
    WHEN title ILIKE '%writing%' THEN 6
    WHEN title ILIKE '%science%' OR title ILIKE '%SEL%' THEN 7
    ELSE 8
  END as domain_order
FROM manual_assessments
WHERE grade_level = 4
  AND language = 'en'
  AND type = 'lesson'
  AND parent_lesson_id IS NULL
  AND status = 'published';

-- Spanish Grade 5
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
SELECT 
  5 as grade_level,
  id as assessment_id,
  ROW_NUMBER() OVER (ORDER BY 
    CASE 
      WHEN title ILIKE '%dominio 1%' OR title ILIKE '%fonológ%' OR title ILIKE '%fonétic%' THEN 1
      WHEN title ILIKE '%dominio 2%' OR title ILIKE '%fluidez%' THEN 2
      WHEN title ILIKE '%dominio 3%' OR title ILIKE '%vocabulario%' THEN 3
      WHEN title ILIKE '%dominio 4%' OR title ILIKE '%comprensión%' THEN 4
      WHEN title ILIKE '%dominio 5%' OR title ILIKE '%estructura%' THEN 5
      WHEN title ILIKE '%dominio 6%' OR title ILIKE '%figurado%' THEN 6
      WHEN title ILIKE '%dominio 7%' OR title ILIKE '%escritura%' THEN 7
      WHEN title ILIKE '%dominio 8%' OR title ILIKE '%gramática%' THEN 8
      WHEN title ILIKE '%dominio 9%' OR title ILIKE '%escucha%' THEN 9
      WHEN title ILIKE '%dominio 10%' OR title ILIKE '%cultural%' THEN 10
      ELSE 11
    END,
    title
  ) as display_order,
  CASE 
    WHEN title ILIKE '%dominio 1%' OR title ILIKE '%fonológ%' OR title ILIKE '%fonétic%' THEN 'Conciencia Fonológica y Fonética'
    WHEN title ILIKE '%dominio 2%' OR title ILIKE '%fluidez%' THEN 'Fluidez de Lectura'
    WHEN title ILIKE '%dominio 3%' OR title ILIKE '%vocabulario%' THEN 'Vocabulario Académico'
    WHEN title ILIKE '%dominio 4%' OR title ILIKE '%comprensión%' THEN 'Comprensión de Lectura'
    WHEN title ILIKE '%dominio 5%' OR title ILIKE '%estructura%' THEN 'Estructura de Textos'
    WHEN title ILIKE '%dominio 6%' OR title ILIKE '%figurado%' THEN 'Lenguaje Figurado'
    WHEN title ILIKE '%dominio 7%' OR title ILIKE '%escritura%' THEN 'Escritura'
    WHEN title ILIKE '%dominio 8%' OR title ILIKE '%gramática%' THEN 'Gramática'
    WHEN title ILIKE '%dominio 9%' OR title ILIKE '%escucha%' THEN 'Escucha Activa'
    WHEN title ILIKE '%dominio 10%' OR title ILIKE '%cultural%' THEN 'Integración Cultural'
    ELSE 'Sin clasificar'
  END as domain_name,
  CASE 
    WHEN title ILIKE '%dominio 1%' OR title ILIKE '%fonológ%' OR title ILIKE '%fonétic%' THEN 1
    WHEN title ILIKE '%dominio 2%' OR title ILIKE '%fluidez%' THEN 2
    WHEN title ILIKE '%dominio 3%' OR title ILIKE '%vocabulario%' THEN 3
    WHEN title ILIKE '%dominio 4%' OR title ILIKE '%comprensión%' THEN 4
    WHEN title ILIKE '%dominio 5%' OR title ILIKE '%estructura%' THEN 5
    WHEN title ILIKE '%dominio 6%' OR title ILIKE '%figurado%' THEN 6
    WHEN title ILIKE '%dominio 7%' OR title ILIKE '%escritura%' THEN 7
    WHEN title ILIKE '%dominio 8%' OR title ILIKE '%gramática%' THEN 8
    WHEN title ILIKE '%dominio 9%' OR title ILIKE '%escucha%' THEN 9
    WHEN title ILIKE '%dominio 10%' OR title ILIKE '%cultural%' THEN 10
    ELSE 11
  END as domain_order
FROM manual_assessments
WHERE grade_level = 5 
  AND language = 'es'
  AND type = 'lesson'
  AND parent_lesson_id IS NULL
  AND status = 'published';

-- English Grade 5
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
SELECT 
  5 as grade_level,
  id as assessment_id,
  (SELECT COALESCE(MAX(display_order), 0) FROM lesson_ordering WHERE grade_level = 5) + 
  ROW_NUMBER() OVER (ORDER BY title) as display_order,
  CASE 
    WHEN title ILIKE '%drone%' OR title ILIKE '%mangrove%' THEN 'Story Narration & Guided Reading'
    WHEN title ILIKE '%phonics%' OR title ILIKE '%phonemic%' THEN 'Phonemic & Phonics Practice'
    WHEN title ILIKE '%vocabulary%' THEN 'Vocabulary in Context'
    WHEN title ILIKE '%fluency%' THEN 'Fluency & Expression'
    WHEN title ILIKE '%comprehension%' THEN 'Comprehension & Analysis'
    WHEN title ILIKE '%writing%' THEN 'Writing & Reflection'
    WHEN title ILIKE '%socio%' THEN 'Socio-Emotional Integration'
    ELSE 'Uncategorized'
  END as domain_name,
  CASE 
    WHEN title ILIKE '%drone%' OR title ILIKE '%mangrove%' THEN 1
    WHEN title ILIKE '%phonics%' OR title ILIKE '%phonemic%' THEN 2
    WHEN title ILIKE '%vocabulary%' THEN 3
    WHEN title ILIKE '%fluency%' THEN 4
    WHEN title ILIKE '%comprehension%' THEN 5
    WHEN title ILIKE '%writing%' THEN 6
    WHEN title ILIKE '%socio%' THEN 7
    ELSE 8
  END as domain_order
FROM manual_assessments
WHERE grade_level = 5
  AND language = 'en'
  AND type = 'lesson'
  AND parent_lesson_id IS NULL
  AND status = 'published';