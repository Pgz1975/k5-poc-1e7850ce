-- Insert lesson_ordering for 17 missing Grade 1 lessons
-- Based on Bosquejo-de-Primer-grado.md structure

-- DOMINIO 1: CONCIENCIA FONOLÓGICA Y FONÉTICA (domain_order = 1)
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES
  (1, 'de84f864-0fbe-4900-ac7e-373add74df94', 18, 'DOMINIO 1: CONCIENCIA FONOLÓGICA Y FONÉTICA', 1); -- PHASE 1 – LISTENING WARM-UP

-- DOMINIO 2: CORRESPONDENCIA GRAFEMA-FONEMA (domain_order = 2)
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES
  (1, 'fab10e07-4cd9-45b4-8de4-1ae0c94a244c', 19, 'DOMINIO 2: CORRESPONDENCIA GRAFEMA-FONEMA', 2); -- Las vocales Ii

-- DOMINIO 3: CONCIENCIA SILÁBICA Y FLUIDEZ (domain_order = 3)
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES
  (1, '5f048380-5df3-4c4c-9136-387b5d7ee93f', 20, 'DOMINIO 3: CONCIENCIA SILÁBICA Y FLUIDEZ', 3), -- Dividiendo Palabras en Sílabas con Coquí
  (1, '94dda21f-1198-4395-b64c-7c398f1c669f', 21, 'DOMINIO 3: CONCIENCIA SILÁBICA Y FLUIDEZ', 3), -- Dividiendo Palabras en Sílabas con Coquí - Segmentar
  (1, '4abaa9ab-6c58-43cc-8c26-8b234de74985', 22, 'DOMINIO 3: CONCIENCIA SILÁBICA Y FLUIDEZ', 3); -- Dividing Words into Syllables with Coquí

-- DOMINIO 4: VOCABULARIO (domain_order = 4)
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES
  (1, 'b35d786a-585b-4457-861e-b8b24c6734b7', 23, 'DOMINIO 4: VOCABULARIO', 4), -- Sinónimos
  (1, 'a835c5a4-21f6-4d27-8013-dee0d23bcc3a', 24, 'DOMINIO 4: VOCABULARIO', 4), -- Sinónimos - Aplicar el significado de palabras en contexto
  (1, 'd4560635-c62f-495f-90e2-f7b7007be7bd', 25, 'DOMINIO 4: VOCABULARIO', 4), -- Vocabilario
  (1, '03ba1219-3045-41ef-8444-ed9c7d02189d', 26, 'DOMINIO 4: VOCABULARIO', 4); -- Vocabulario - El ciclo de la vida

-- DOMINIO 5: LEER Y COMPRENDER (domain_order = 5)
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES
  (1, 'a6a08262-78a7-4ae0-84ed-afa9b36a9b6e', 27, 'DOMINIO 5: LEER Y COMPRENDER', 5), -- Story: The Mystery at Maple Creek
  (1, '3ed3a797-e6b1-4144-a06a-f83e3400dc57', 28, 'DOMINIO 5: LEER Y COMPRENDER', 5), -- REINFORCEMENT & FAMILY CONNECTION
  (1, '4104168b-b2ab-467c-b95b-0b796a88fe2a', 29, 'DOMINIO 5: LEER Y COMPRENDER', 5), -- Nex lesson with image
  (1, '7a4c5c98-43a9-47bf-ba89-405aa64a8ced', 30, 'DOMINIO 5: LEER Y COMPRENDER', 5); -- subtipe test

-- English Lessons - Separate classification
-- Phonological Awareness (English) (domain_order = 10)
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES
  (1, 'ca0473f5-a116-4b00-8cdb-79c22c05af42', 31, 'Phonological Awareness (English)', 10), -- PHONEMIC AWARENESS & PHONICS PRACTICE
  (1, 'b79894b4-25b5-46ea-86ae-aa40540dc5b4', 32, 'Phonological Awareness (English)', 10); -- Listen and Repeat with Coquí

-- Reading Comprehension (English) (domain_order = 11)
INSERT INTO lesson_ordering (grade_level, assessment_id, display_order, domain_name, domain_order)
VALUES
  (1, '6fcc761b-8032-48e8-a2bb-fb408a79d690', 33, 'Reading Comprehension (English)', 11), -- "A Day in Old San Juan"
  (1, '434fb2ee-4302-4e0e-8c34-c49f470852fe', 34, 'Reading Comprehension (English)', 11); -- VOCABULARY & COMPREHENSION