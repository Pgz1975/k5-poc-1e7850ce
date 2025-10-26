-- Duplicate a Grade 1 lesson and representative exercises for deterministic voice testing
-- Inserts rely on existing manual_assessments from the 2025-10-26 backup.

-- 1) Create the test lesson (based on Dividiendo Palabras en Sílabas con Coquí)
WITH src AS (
  SELECT *
  FROM manual_assessments
  WHERE id = '5f048380-5df3-4c4c-9136-387b5d7ee93f'
)
INSERT INTO manual_assessments (
  id,
  title,
  type,
  subtype,
  grade_level,
  language,
  subject_area,
  content,
  created_at,
  updated_at,
  created_by,
  enable_voice,
  voice_guidance,
  coqui_dialogue,
  pronunciation_words,
  parent_lesson_id,
  order_in_lesson,
  auto_read_question,
  max_attempts,
  passing_score,
  status,
  description,
  activity_template,
  estimated_duration_minutes,
  voice_speed,
  metadata,
  published_at,
  completion_count,
  average_score,
  drag_drop_mode,
  curriculum_standards,
  difficulty_level,
  view_count
)
SELECT
  'b8edf8f2-63ce-4479-832c-7801c6d9785f'::uuid,
  'TEST G1 Lesson – Biliteracy Syllable Coach',
  type,
  subtype,
  grade_level,
  language,
  subject_area,
  jsonb_set(
    coalesce(content, '{}'::jsonb),
    '{question}',
    to_jsonb('[TEST] Biliteracy Coach: ' || coalesce(content->>'question', 'Lee el texto en voz alta.')),
    true
  ),
  now(),
  now(),
  created_by,
  true,
  $LESSON_VG$
🔊 Lee el objetivo lentamente y modela cómo separar palabras en sílabas.
1. Resume el objetivo en 1 oración infantil.
2. Demuestra cómo aplaudir por cada sílaba.
3. Pide al estudiante repetir tus ejemplos usando las sílabas resaltadas.
4. Refuerza la regla con una palabra nueva y espera que la repitan antes de continuar.
$LESSON_VG$,
  $LESSON_DIALOG$
SECTION 1: Hola amiguito, hoy eres un detective de sílabas. ¿Listo para aplaudir conmigo?
SECTION 2: Mira esta palabra mágica. Primero yo digo "co-quí" y tú repites.
SECTION 3: Ahora viene 🔊 "ma-na-tí". Aplaude tres veces y repítela en voz alta.
SECTION 4: Inventemos una nueva palabra divertida. Divide "borinquen" y dime cuántas sílabas escuchaste.
SECTION 5: Despídete celebrando su esfuerzo y recuérdale que puede pedirme más palabras cuando quiera practicar.
$LESSON_DIALOG$,
  COALESCE(pronunciation_words, ARRAY['coquí','borinquen','palma','playa','sol','luna']),
  NULL,
  NULL,
  COALESCE(auto_read_question, true),
  COALESCE(max_attempts, 3),
  COALESCE(passing_score, 70),
  'published',
  'Duplicated for deterministic voice testing (Grade 1 lesson).',
  activity_template,
  COALESCE(estimated_duration_minutes, 5),
  COALESCE(voice_speed, 1),
  jsonb_build_object('is_test_fixture', true, 'source_record', id, 'created_from_backup', '2025-10-26'),
  now(),
  0,
  0,
  drag_drop_mode,
  curriculum_standards,
  difficulty_level,
  0
FROM src;

-- Helper to build modified exercise content
CREATE OR REPLACE FUNCTION public._append_test_label(original jsonb, label text)
RETURNS jsonb AS $$
BEGIN
  RETURN jsonb_set(
    COALESCE(original, '{}'::jsonb),
    '{question}',
    to_jsonb('[TEST] ' || label || ' ' || COALESCE(original->>'question', 'Lee el texto en voz alta.')),
    true
  );
END;
$$ LANGUAGE plpgsql;

-- Utility metadata JSON
CREATE OR REPLACE FUNCTION public._test_metadata(source_id uuid)
RETURNS jsonb AS $$
BEGIN
  RETURN jsonb_build_object(
    'is_test_fixture', true,
    'source_record', source_id,
    'created_from_backup', '2025-10-26'
  );
END;
$$ LANGUAGE plpgsql;

-- 2) Multiple-choice exercise (order 1)
WITH src AS (
  SELECT *
  FROM manual_assessments
  WHERE id = '025b161b-07e2-4801-be27-0473eb04a574'
)
INSERT INTO manual_assessments (
  id,
  title,
  type,
  subtype,
  grade_level,
  language,
  subject_area,
  content,
  created_at,
  updated_at,
  created_by,
  enable_voice,
  voice_guidance,
  coqui_dialogue,
  pronunciation_words,
  parent_lesson_id,
  order_in_lesson,
  auto_read_question,
  max_attempts,
  passing_score,
  status,
  description,
  activity_template,
  estimated_duration_minutes,
  voice_speed,
  metadata,
  published_at,
  completion_count,
  average_score,
  drag_drop_mode,
  curriculum_standards,
  difficulty_level,
  view_count
)
SELECT
  'daeedbd1-1e68-4efd-9b2d-7183762c5086'::uuid,
  'TEST G1 Exercise – Sound Hunt (MCQ)',
  type,
  subtype,
  grade_level,
  language,
  subject_area,
  public._append_test_label(content, 'Escucha el sonido /c/.'),
  now(),
  now(),
  created_by,
  true,
  $MC_VG$
Di: 🔊 "Escucha el sonido /c/." Lee cada respuesta lentamente, espera la elección del estudiante y pídele que repita la palabra elegida. Si se confunde, modela la sílaba inicial y vuelve a preguntar sin revelar la respuesta correcta de inmediato.
$MC_VG$,
  $MC_DIALOG$
1. Presenta el reto: "Vamos a cazar palabras que empiezan con /c/."
2. Lee "calle" y "avenida" con energía. Pausa para que respondan.
3. Ofrece una pista si dudan: "La palabra correcta suena como coquí".
4. Asegúrate de que repitan la palabra correcta antes de continuar con otros ejemplos.
$MC_DIALOG$,
  ARRAY['calle','casa','coquí'],
  'b8edf8f2-63ce-4479-832c-7801c6d9785f'::uuid,
  1,
  COALESCE(auto_read_question, true),
  COALESCE(max_attempts, 3),
  COALESCE(passing_score, 70),
  'published',
  'Test duplicate for multiple-choice pronunciation coverage.',
  activity_template,
  COALESCE(estimated_duration_minutes, 5),
  COALESCE(voice_speed, 1),
  public._test_metadata(id),
  now(),
  0,
  0,
  drag_drop_mode,
  curriculum_standards,
  difficulty_level,
  0
FROM src;

-- 3) Fill-in-the-blank exercise (order 2)
WITH src AS (
  SELECT *
  FROM manual_assessments
  WHERE id = '0e830479-fc0e-4896-ae05-e2aaadbb0e70'
)
INSERT INTO manual_assessments (
  id,
  title,
  type,
  subtype,
  grade_level,
  language,
  subject_area,
  content,
  created_at,
  updated_at,
  created_by,
  enable_voice,
  voice_guidance,
  coqui_dialogue,
  pronunciation_words,
  parent_lesson_id,
  order_in_lesson,
  auto_read_question,
  max_attempts,
  passing_score,
  status,
  description,
  activity_template,
  estimated_duration_minutes,
  voice_speed,
  metadata,
  published_at,
  completion_count,
  average_score,
  drag_drop_mode,
  curriculum_standards,
  difficulty_level,
  view_count
)
SELECT
  '3acf5c5a-95fb-4b5a-a3f1-1c671c2c8d85'::uuid,
  'TEST G1 Exercise – Missing Vowel (Fill Blank)',
  type,
  subtype,
  grade_level,
  language,
  subject_area,
  public._append_test_label(content, 'Completa la palabra con la vocal correcta.'),
  now(),
  now(),
  created_by,
  true,
  $FB_VG$
Explica que falta una vocal. 🔊 Lee la oración completa antes de pedir la respuesta. Escucha lo que dice el estudiante; si responde con un sonido incorrecto, modela la vocal correcta y pídele que repita la palabra completa.
$FB_VG$,
  $FB_DIALOG$
PASO 1: "Mira esta palabra misteriosa. Falta una vocal."
PASO 2: Lee la palabra incompleta enfatizando el espacio vacío.
PASO 3: Pregunta "¿Qué vocal debemos poner?" y espera la respuesta.
PASO 4: Confirma repitiendo la palabra completa y celebrando su esfuerzo.
$FB_DIALOG$,
  ARRAY['sol','suma','sopa'],
  'b8edf8f2-63ce-4479-832c-7801c6d9785f'::uuid,
  2,
  COALESCE(auto_read_question, true),
  COALESCE(max_attempts, 3),
  COALESCE(passing_score, 70),
  'published',
  'Test duplicate for fill-in-the-blank guidance.',
  activity_template,
  COALESCE(estimated_duration_minutes, 5),
  COALESCE(voice_speed, 1),
  public._test_metadata(id),
  now(),
  0,
  0,
  drag_drop_mode,
  curriculum_standards,
  difficulty_level,
  0
FROM src;

-- 4) Drag-and-drop exercise (order 3)
WITH src AS (
  SELECT *
  FROM manual_assessments
  WHERE id = 'b8234b01-b004-47d9-b1b2-aaac2b9a5db8'
)
INSERT INTO manual_assessments (
  id,
  title,
  type,
  subtype,
  grade_level,
  language,
  subject_area,
  content,
  created_at,
  updated_at,
  created_by,
  enable_voice,
  voice_guidance,
  coqui_dialogue,
  pronunciation_words,
  parent_lesson_id,
  order_in_lesson,
  auto_read_question,
  max_attempts,
  passing_score,
  status,
  description,
  activity_template,
  estimated_duration_minutes,
  voice_speed,
  metadata,
  published_at,
  completion_count,
  average_score,
  drag_drop_mode,
  curriculum_standards,
  difficulty_level,
  view_count
)
SELECT
  '3a9a822a-46f5-42bd-ab7c-113be7084ff2'::uuid,
  'TEST G1 Exercise – Build the Word (Drag & Drop)',
  type,
  subtype,
  grade_level,
  language,
  subject_area,
  public._append_test_label(content, 'Arrastra las letras para formar la palabra secreta.'),
  now(),
  now(),
  created_by,
  true,
  $DD_VG$
Describe el reto: 🔊 "Arrastra las letras para formar la palabra salón". Pronuncia la palabra completa, luego deletrea lentamente cada letra. Observa si colocan una pieza incorrecta y ofrece pistas sobre la posición correcta antes de revelar la respuesta.
$DD_VG$,
  $DD_DIALOG$
INTRO: "Vamos a construir la palabra salón como si fuera un rompecabezas".
PASO 1: Pronuncia "sa-lón" destacando cada sílaba.
PASO 2: Deja que el estudiante arrastre y espera 5 segundos antes de ayudar.
PASO 3: Si se equivoca, menciona "La letra con acento va al final".
CIERRE: Repite la palabra completa juntos y celebra con un ¡plin plin! imaginario.
$DD_DIALOG$,
  ARRAY['salón','sal','sol'],
  'b8edf8f2-63ce-4479-832c-7801c6d9785f'::uuid,
  3,
  COALESCE(auto_read_question, true),
  COALESCE(max_attempts, 3),
  COALESCE(passing_score, 70),
  'published',
  'Test duplicate for drag-and-drop coaching.',
  activity_template,
  COALESCE(estimated_duration_minutes, 5),
  COALESCE(voice_speed, 1),
  public._test_metadata(id),
  now(),
  0,
  0,
  drag_drop_mode,
  curriculum_standards,
  difficulty_level,
  0
FROM src;

-- 5) True/false exercise (order 4)
WITH src AS (
  SELECT *
  FROM manual_assessments
  WHERE id = '0392086a-519f-4415-8e06-ed8b503489f4'
)
INSERT INTO manual_assessments (
  id,
  title,
  type,
  subtype,
  grade_level,
  language,
  subject_area,
  content,
  created_at,
  updated_at,
  created_by,
  enable_voice,
  voice_guidance,
  coqui_dialogue,
  pronunciation_words,
  parent_lesson_id,
  order_in_lesson,
  auto_read_question,
  max_attempts,
  passing_score,
  status,
  description,
  activity_template,
  estimated_duration_minutes,
  voice_speed,
  metadata,
  published_at,
  completion_count,
  average_score,
  drag_drop_mode,
  curriculum_standards,
  difficulty_level,
  view_count
)
SELECT
  '9ff0f689-c956-4d7a-951e-f4c5b0fa48d1'::uuid,
  'TEST G1 Exercise – Life Cycle Facts (True/False)',
  type,
  subtype,
  grade_level,
  language,
  subject_area,
  public._append_test_label(content, 'Responde si la oración es verdadera o falsa.'),
  now(),
  now(),
  created_by,
  true,
  $TF_VG$
🔊 Lee la afirmación completa sin revelar la respuesta. Pregunta "¿Verdadero o falso?" y espera mínimo 3 segundos. Si la respuesta no llega, ofrece una pista relacionada y vuelve a preguntar antes de confirmar.
$TF_VG$,
  $TF_DIALOG$
1. Introduce el tema: "Estamos estudiando el ciclo de vida".
2. Lee la oración lentamente usando gestos verbales como "Observa esta parte".
3. Pregunta por la respuesta y valida la idea que compartan.
4. Explica por qué es verdadero o falso usando vocabulario simple.
$TF_DIALOG$,
  ARRAY['ciclo','vida','etapas'],
  'b8edf8f2-63ce-4479-832c-7801c6d9785f'::uuid,
  4,
  COALESCE(auto_read_question, true),
  COALESCE(max_attempts, 3),
  COALESCE(passing_score, 70),
  'published',
  'Test duplicate for true/false scaffolding.',
  activity_template,
  COALESCE(estimated_duration_minutes, 5),
  COALESCE(voice_speed, 1),
  public._test_metadata(id),
  now(),
  0,
  0,
  drag_drop_mode,
  curriculum_standards,
  difficulty_level,
  0
FROM src;

-- 6) Write-answer exercise (order 5)
WITH src AS (
  SELECT *
  FROM manual_assessments
  WHERE id = '8133e265-0047-43bd-8d12-00afb2dd3946'
)
INSERT INTO manual_assessments (
  id,
  title,
  type,
  subtype,
  grade_level,
  language,
  subject_area,
  content,
  created_at,
  updated_at,
  created_by,
  enable_voice,
  voice_guidance,
  coqui_dialogue,
  pronunciation_words,
  parent_lesson_id,
  order_in_lesson,
  auto_read_question,
  max_attempts,
  passing_score,
  status,
  description,
  activity_template,
  estimated_duration_minutes,
  voice_speed,
  metadata,
  published_at,
  completion_count,
  average_score,
  drag_drop_mode,
  curriculum_standards,
  difficulty_level,
  view_count
)
SELECT
  '9b83f8a7-a4b6-424d-8b30-8616a540d2cd'::uuid,
  'TEST G1 Exercise – Predict the Word (Write Answer)',
  type,
  subtype,
  grade_level,
  language,
  subject_area,
  public._append_test_label(content, 'Escribe o di la palabra que sigue.'),
  now(),
  now(),
  created_by,
  true,
  $WA_VG$
🔊 Lee el enunciado de la oración incompleta y explica que deben adivinar la palabra que sigue. Permite que respondan oralmente primero; si la idea es correcta pero incompleta, pídeles que la deletreen o la escriban. Solo revela la respuesta después de dos intentos.
$WA_VG$,
  $WA_DIALOG$
A. Presenta el juego: "Voy a leer esta oración y tú me dices qué palabra sigue".
B. Lee la oración enfatizando la cadencia.
C. Pregunta "¿Cuál crees que es la palabra secreta?" y espera su intento.
D. Si fallan, ofrece una pista sobre la rima o sonido inicial antes de repetir la consigna.
$WA_DIALOG$,
  ARRAY['siguiente','palabra','rima'],
  'b8edf8f2-63ce-4479-832c-7801c6d9785f'::uuid,
  5,
  COALESCE(auto_read_question, true),
  COALESCE(max_attempts, 3),
  COALESCE(passing_score, 70),
  'published',
  'Test duplicate for constructed-response prompts.',
  activity_template,
  COALESCE(estimated_duration_minutes, 5),
  COALESCE(voice_speed, 1),
  public._test_metadata(id),
  now(),
  0,
  0,
  drag_drop_mode,
  curriculum_standards,
  difficulty_level,
  0
FROM src;

-- 7) Register the lesson inside lesson_ordering for Grade 1 so testers can locate it easily
INSERT INTO lesson_ordering (
  id,
  assessment_id,
  parent_lesson_id,
  grade_level,
  display_order,
  domain_name,
  domain_order,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'b8edf8f2-63ce-4479-832c-7801c6d9785f'::uuid,
  NULL,
  1,
  (SELECT COALESCE(MAX(display_order), 0) + 1 FROM lesson_ordering WHERE grade_level = 1),
  'TEST_G1_FIXTURES',
  NULL,
  now(),
  now()
);

-- Clean up helper functions (they are only needed during this migration)
DROP FUNCTION public._append_test_label(jsonb, text);
DROP FUNCTION public._test_metadata(uuid);
