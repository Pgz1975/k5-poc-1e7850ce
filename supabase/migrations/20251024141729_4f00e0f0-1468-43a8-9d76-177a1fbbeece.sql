-- Restructure lesson ordering to match curriculum guides for Kindergarten and Grade 1
-- First, delete existing ordering to avoid conflicts
DELETE FROM lesson_ordering WHERE grade_level = 1;

-- GRADE 1 (Primer Grado) - Following Bosquejo curriculum order
-- Dominio 1: Conciencia Fonológica (order 1)
-- Dominio 2: Fonética (Correspondencia Grafema-Fonema) (order 2)  
-- Dominio 3: Conciencia Silábica (order 3)
-- Dominio 4: Vocabulario (order 4)
-- Dominio 5: Comprensión (Leer y Comprender) (order 5)

INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES 
  -- Dominio 1: Conciencia Fonológica
  (1, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', 0, 'Conciencia Fonológica', 1), -- Conciencia fonémica (FIRST!)
  
  -- Dominio 2: Fonética  
  (1, '2f3bdc99-b40c-45fe-a895-428ac8bbf128', 1, 'Fonética', 2), -- Identificando el Sonido /s/
  (1, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 2, 'Fonética', 2), -- Encuentra el sonido del medio
  (1, 'c7d30040-c801-4eb9-870f-a9936cf3e940', 3, 'Fonética', 2), -- Detección de sonido final
  
  -- Dominio 3: Conciencia Silábica
  (1, '9f750023-c594-4c14-85c8-d94f61f67108', 4, 'Conciencia Silábica', 3), -- Dividing Words into Syllables 1
  (1, '5044bc15-a303-4007-9fb8-1cf3db677cb4', 5, 'Conciencia Silábica', 3), -- Dividing Words into Syllables 2
  (1, '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', 6, 'Conciencia Silábica', 3), -- Fonética (correspondencia grafema-fonema)
  (1, '8b2ab422-87ed-4d1a-abe0-3a774fedb521', 7, 'Conciencia Silábica', 3), -- Escoge la sílaba
  
  -- Dominio 4: Vocabulario
  (1, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 8, 'Vocabulario', 4), -- Doble palabra
  (1, '55dfdda5-9fce-4e70-b8c2-a6e8a0c4d6be', 9, 'Vocabulario', 4), -- Rimas Divertidas
  
  -- Dominio 5: Comprensión
  (1, '41b2d6c7-8b4a-4e55-8d7c-38b6e1c9fa01', 10, 'Comprensión', 5); -- Lectura Fluida de Puerto Rico

-- KINDERGARTEN (Grade 0) - Create ordering based on Ani_Bosquejo curriculum
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES 
  (0, 'a08bce22-7cd6-472e-b9ad-653042fa2281', 0, 'Conciencia Fonológica', 1), -- SALUDO
  (0, 'ffd27da9-cfd0-4d76-bcda-8ae295b06064', 1, 'Conciencia Fonológica', 1), -- LAS VOCALES Aa
  (0, '333764ec-545a-4672-881c-f21583827bdb', 2, 'Conciencia Fonológica', 1), -- LAS VOCALES Ee
  (0, 'd4925bad-9535-418e-b2f3-cc89edc9235a', 3, 'Fonética', 2) -- Lección 3: Tamaño y Posición
ON CONFLICT (grade_level, assessment_id) 
DO UPDATE SET
  display_order = EXCLUDED.display_order,
  domain_name = EXCLUDED.domain_name,
  domain_order = EXCLUDED.domain_order;