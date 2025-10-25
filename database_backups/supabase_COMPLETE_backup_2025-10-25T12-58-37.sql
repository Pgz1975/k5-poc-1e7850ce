-- ============================================
-- Supabase COMPLETE Database Backup
-- ============================================
-- Generated: 2025-10-25T12:58:37.069Z
-- Project: meertwtenhlmnlpwxhyz
-- URL: https://meertwtenhlmnlpwxhyz.supabase.co
--
-- Tables Exported (5 total):
--   ✓ manual_assessments (180 records)
--   ✓ profiles (1 records)
--   ✓ user_roles (1 records)
--   ✓ voice_sessions (271 records)
--   ✓ pdf_text_content (0 records)
--
-- ============================================

-- Disable foreign key checks during import
SET session_replication_role = 'replica';

BEGIN;


-- ============================================
-- Table: manual_assessments
-- Records: 180
-- ============================================

-- Table: public.manual_assessments
CREATE TABLE IF NOT EXISTS public.manual_assessments (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "type" TEXT,
    "subtype" TEXT,
    "title" TEXT,
    "description" TEXT,
    "content" JSONB,
    "grade_level" INTEGER,
    "language" TEXT,
    "subject_area" TEXT,
    "curriculum_standards" TEXT,
    "enable_voice" BOOLEAN,
    "voice_speed" INTEGER,
    "auto_read_question" BOOLEAN,
    "difficulty_level" TEXT,
    "estimated_duration_minutes" INTEGER,
    "status" TEXT,
    "published_at" TIMESTAMPTZ,
    "view_count" INTEGER,
    "completion_count" INTEGER,
    "average_score" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    "metadata" JSONB,
    "voice_guidance" TEXT,
    "activity_template" TEXT,
    "coqui_dialogue" TEXT,
    "pronunciation_words" TEXT,
    "max_attempts" INTEGER,
    "parent_lesson_id" UUID,
    "order_in_lesson" TEXT,
    "drag_drop_mode" TEXT,
    "passing_score" INTEGER
);

-- Index on created_at
CREATE INDEX IF NOT EXISTS idx_manual_assessments_created_at ON public.manual_assessments(created_at);

-- Table: manual_assessments
-- Total records: 180
-- Exported: 2025-10-25T12:58:37.069Z

-- Clear existing data (uncomment if needed)
-- TRUNCATE TABLE public.manual_assessments CASCADE;

INSERT INTO public.manual_assessments ("id", "type", "subtype", "title", "description", "content", "grade_level", "language", "subject_area", "curriculum_standards", "enable_voice", "voice_speed", "auto_read_question", "difficulty_level", "estimated_duration_minutes", "status", "published_at", "view_count", "completion_count", "average_score", "created_by", "created_at", "updated_at", "metadata", "voice_guidance", "activity_template", "coqui_dialogue", "pronunciation_words", "max_attempts", "parent_lesson_id", "order_in_lesson", "drag_drop_mode", "passing_score") VALUES
  ('58fdd1c7-3273-489b-81c4-4f8a325a23b0', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396456903-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396463449-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396468498-image.png","isCorrect":false}],"question":"Escucha el sonido /k/ de /c/ Qué imagen comienza con ese sonido?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:54:54.343775+00:00', '2025-10-25T12:54:54.343775+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70),
  ('4fb7c0c2-ec90-40cd-9f0f-affb6ce5ad20', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396400168-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396405298-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396412416-image.png","isCorrect":false}],"question":"¿Cuál palabra empieza con /l/?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:53:40.872937+00:00', '2025-10-25T12:53:40.872937+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70),
  ('4ca3a7b2-c282-47ca-a1ec-2315c801f993', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396330523-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396343757-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396351618-image.png","isCorrect":true}],"question":"Escucha el sonido /t/. ¿Cuál imagen empieza igual?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:52:44.179271+00:00', '2025-10-25T12:52:44.179271+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70),
  ('18d8e071-6f39-4930-b434-70aecf7a12f4', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396258762-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396265103-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396274632-image.png","isCorrect":false}],"question":"¿Qué palabra empieza con /b/?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:51:26.981689+00:00', '2025-10-25T12:51:26.981689+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70),
  ('453784c0-d9bb-484a-a20c-b2aa36f9fc8f', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396192048-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396199586-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396206827-image.png","isCorrect":true}],"question":"Escucha: /m/. ¿Cuál palabra comienza con /m/?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:50:16.042842+00:00', '2025-10-25T12:50:16.042842+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70),
  ('5d199bce-970d-44ec-b10c-bddfd93e6976', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396080126-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396085738-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396091507-image.png","isCorrect":false}],"question":"¿Cuál de estas imágenes empieza con /s/?","questionImage":""}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:49:02.986805+00:00', '2025-10-25T12:49:02.986805+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70),
  ('c408279c-0219-4af7-baee-55040879be35', 'lesson', 'lesson', 'Actividad digital: “Escucha y habla”', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Fonética- Sonidos Iniciales: El estudiante reconoce e identifica el sonido inicial de una palabra escuchada y lo relaciona con la imagen o palabra que comienza con ese sonido."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:40:42.012416+00:00', '2025-10-25T12:40:42.012416+00:00', '{}'::jsonb, 'Elemento	Descripción detallada
Nombre de la actividad	Escucha y habla
Dominio de lectura	Conciencia fonémica
Objetivo de aprendizaje	El estudiante reconoce e identifica el sonido inicial de una palabra escuchada y lo relaciona con la imagen o palabra que comienza con ese sonido.
Instrucción al estudiante (voz y texto en pantalla)	“Escucha con atención. ¿Cuál de estas imágenes empieza con el sonido que escuchaste?”
Descripción de la dinámica	<ul><li>El sistema reproduce un sonido inicial (ej. /s/).</li><li>En pantalla aparecen tres imágenes: sol, mano, luna.</li><li>El estudiante selecciona la imagen que empieza con el mismo sonido (/s/ → sol).</li><li>La IA confirma la respuesta y proporciona retroalimentación auditiva y visual.</li></ul>
Retroalimentación positiva	“¡Excelente! Sol comienza con el sonido /s/.” (acompañado de una animación o estrella brillante).

Retroalimentación correctiva	“Casi. Mano empieza con /m/. Escucha otra vez el sonido /s/.”
Tecnología / IA aplicada	<ul><li>Reconocimiento de voz (el estudiante puede decir la palabra seleccionada y el sistema valida la pronunciación).</li><li>IA adaptativa: aumenta la dificultad progresivamente (de sonidos iniciales a finales o medios; de palabras con dos a tres sílabas).</li><li>Registro automático del progreso y del tipo de error (confusión entre sonidos /s/ y /z/, por ejemplo).</li></ul>
Evidencia de aprendizaje	<ul><li>Porcentaje de respuestas correctas.</li><li>Tiempo de respuesta promedio.</li><li>Precisión de pronunciación (si usa reconocimiento de voz).</li><li>Gráfica de progreso por fonema trabajado.</li></ul>
Accesibilidad y lenguaje	<ul><li>Audio disponible en español con acento puertorriqueño.</li><li>Opción de texto y audio simultáneo (DUA).</li><li>Instrucciones disponibles también en inglés si el usuario lo requiere.</li></ul>
Extensión opcional	El estudiante puede grabar su voz diciendo una palabra que empiece con el mismo sonido y escuchar su grabación comparada con el modelo.

', NULL, '🔊 Hoy vamos a jugar con los sonidos de las palabras.
🔊¿Sabías que todas las palabras están formadas por sonidos pequeñitos llamados fonemas?
🔊 Por ejemplo, cuando decimos la palabra sol, podemos escuchar tres sonidos: /s/ – /o/ – /l/.
🔊 Si juntamos los sonidos, decimos sol.
🔊 Reconocer los sonidos de las palabras nos ayuda a leer y escribir mejor, porque aprendemos a escuchar con atención y a descubrir cómo cada letra representa un sonido.
🔊 En esta parte, aprenderás a:
🔊 Escuchar los sonidos.
🔊 Adivinar qué palabra empieza con cada sonido.
🔊 Repetirlos con tu voz.
🔊¡Prepárate! Vas a convertirte en un detective de sonidos. 
🔊 Escucha con atención, juega y descubre qué palabras suenan igual al principio o al final.
🔊¡Vamos a divertirnos aprendiendo con los sonidos!   


', NULL, 3, NULL, NULL, NULL, 70),
  ('ae508941-5770-4374-af41-157b11efa559', 'exercise', 'multiple_choice', 'Las Consonantes', NULL, '{"answers":[{"text":"m","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761394735666-image.png","isCorrect":true},{"text":"n","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761394787024-image.png","isCorrect":true},{"text":"p","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761394795393-image.png","isCorrect":true},{"text":"t","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761394807738-image.png","isCorrect":true},{"text":"s","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761394820791-image.png","isCorrect":true},{"text":"l","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761394830730-image.png","isCorrect":true}],"question":"🔊 Escucha con atención la letra e indica cual es el sonido."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:27:39.410526+00:00', '2025-10-25T12:27:39.410526+00:00', '{}'::jsonb, '🔊 Poco a poco aprenderás como formar palabras.', NULL, 'Frase de apoyo
/m/ de mono
/n/ de nube
/p/ de pan
/t/ de taza
/s/ de sol
/l/ de luna
', '["Sonido que debe emitir el estudiante","/m/","/n/","/p/","/t/","/s/","/l/"]'::jsonb, 3, '92be01dd-dd59-4708-b2ff-c77a770c5b3d', NULL, NULL, 70),
  ('92be01dd-dd59-4708-b2ff-c77a770c5b3d', 'lesson', 'lesson', 'Las Consonantes', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"En esta lección los niños aprenden qué son las consonantes y cómo, al unirse con las vocales, forman sílabas y palabras que usamos para comunicarnos. A través de ejemplos auditivos y visuales, los estudiantes reconocen los sonidos de algunas consonantes iniciales (como /m/ y /p/) y practican la identificación de su sonido en palabras sencillas. El objetivo es desarrollar la conciencia fonémica y la comprensión de que cada letra representa un sonido que, al combinarse, crea el lenguaje hablado y escrito."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:15:50.1638+00:00', '2025-10-25T12:24:22.434054+00:00', '{}'::jsonb, '🔊 Hola! Hoy vas a aprender algo muy importante:
🔊 Las consonantes son letras que, junto con las vocales, forman las palabras que usamos para hablar, leer y escribir.
🔊 Por ejemplo:
🔊 /m/ + /a/ = ma
🔊 /p/ + /e/ = pe
🔊 Escucha con atención la letra e indica cual es el sonido.
🔊 Poco a poco aprenderás como formar palabras.
', NULL, '🔊 Poco a poco aprenderás como formar palabras.
Letra 	Frase de apoyo	imagen	Sonido que debe emitir el estudiante
m	/m/ de mono	 	/m/
n	/n/ de nube	 	/n/
p	/p/ de pan	 	/p/
t	/t/ de taza	 	/t/
s	/s/ de sol	 	/s/
l	/l/ de luna	 	/l/
', NULL, 3, NULL, NULL, NULL, 70),
  ('e147e10c-c9bd-46c3-86e8-0ab674ee7c5b', 'exercise', 'multiple_choice', 'Juego interactivo: “Encuentra la vocal”', NULL, '{"answers":[{"text":"fresa","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393498894-image.png","isCorrect":false},{"text":"uva","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393507977-image.png","isCorrect":true},{"text":"melón","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393518672-image.png","isCorrect":false}],"question":"🔊 Escucha la vocal y haz clic en la imagen que empieza con ese sonido."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:06:00.963578+00:00', '2025-10-25T12:06:00.963578+00:00', '{}'::jsonb, 'Seguimiento automático
IA registra: tiempo, aciertos, repeticiones y pronunciaciones reconocidas.
Panel del maestro: muestra qué vocales fueron dominadas y cuáles necesitan refuerzo.
Modo familiar: permite repetir el ejercicio en casa con guía visual y auditiva.
Refuerzo: 
', NULL, '¡Genial! /u/ como uva.', NULL, 3, NULL, NULL, NULL, 70),
  ('9832cd2b-a6f4-4275-9a10-66f86ebdacf2', 'exercise', 'multiple_choice', 'Juego interactivo: “Encuentra la vocal”', NULL, '{"answers":[{"text":"flor","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393389124-image.png","isCorrect":false},{"text":"oso","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393409769-image.png","isCorrect":true},{"text":"arbol","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393427750-image.png","isCorrect":false}],"question":"🔊 Escucha la vocal y haz clic en la imagen que empieza con ese sonido."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:04:17.253135+00:00', '2025-10-25T12:04:17.253135+00:00', '{}'::jsonb, 'Seguimiento automático
IA registra: tiempo, aciertos, repeticiones y pronunciaciones reconocidas.
Panel del maestro: muestra qué vocales fueron dominadas y cuáles necesitan refuerzo.
Modo familiar: permite repetir el ejercicio en casa con guía visual y auditiva.
', NULL, '¡Perfecto! /o/ como oso.', NULL, 3, NULL, NULL, NULL, 70),
  ('5ccc960c-13d6-49f1-9be7-17b4b643882f', 'exercise', 'multiple_choice', 'Juego interactivo: “Encuentra la vocal”', NULL, '{"answers":[{"text":"escuela ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393301952-image.png","isCorrect":false},{"text":"casa","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393308056-image.png","isCorrect":false},{"text":"iglesia ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393315786-image.png","isCorrect":true}],"question":"🔊 Escucha la vocal y haz clic en la imagen que empieza con ese sonido."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:02:36.519336+00:00', '2025-10-25T12:02:36.519336+00:00', '{}'::jsonb, 'Seguimiento automático
IA registra: tiempo, aciertos, repeticiones y pronunciaciones reconocidas.
Panel del maestro: muestra qué vocales fueron dominadas y cuáles necesitan refuerzo.
Modo familiar: permite repetir el ejercicio en casa con guía visual y auditiva.
', NULL, 'Correcto, /i/ como iglesia.', NULL, 3, NULL, NULL, NULL, 70),
  ('6363a2ed-b780-45ad-99e4-5da7cb7a7dc5', 'exercise', 'multiple_choice', 'Juego interactivo: “Encuentra la vocal”', NULL, '{"answers":[{"text":"estrella","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393163618-image.png","isCorrect":true},{"text":"luna","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393176600-image.png","isCorrect":false},{"text":"sol","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393217584-image.png","isCorrect":false}],"question":"🔊 Escucha la vocal y haz clic en la imagen que empieza con ese sonido","questionImage":""}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:00:51.857764+00:00', '2025-10-25T12:00:51.857764+00:00', '{}'::jsonb, 'Seguimiento automático
IA registra: tiempo, aciertos, repeticiones y pronunciaciones reconocidas.
Panel del maestro: muestra qué vocales fueron dominadas y cuáles necesitan refuerzo.
Modo familiar: permite repetir el ejercicio en casa con guía visual y auditiva.
', NULL, 'Muy bien, /e/ como estrella', NULL, 3, NULL, NULL, NULL, 70),
  ('5843ff63-93fa-492c-b560-c85bc3dc33b1', 'exercise', 'multiple_choice', 'Juego interactivo: “Encuentra la vocal”', NULL, '{"answers":[{"text":"avión","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393030083-image.png","isCorrect":true},{"text":"banana","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393060735-image.png","isCorrect":false},{"text":"sapo","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761393068279-image.png","isCorrect":false}],"question":"🔊 Escucha la vocal y haz clic en la imagen que empieza con ese sonido.\nSeguimiento automático\nIA registra: tiempo, aciertos, repeticiones y pronunciaciones reconocidas.\nPanel del maestro: muestra qué vocales fueron dominadas y cuáles necesitan refuerzo.\nModo familiar: permite repetir el ejercicio en casa con guía visual y auditiva.\n"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T11:58:28.056995+00:00', '2025-10-25T11:58:28.056995+00:00', '{}'::jsonb, 'Refuerzo: “¡Excelente! Árbol empieza con /a/.”
Seguimiento automático
IA registra: tiempo, aciertos, repeticiones y pronunciaciones reconocidas.
Panel del maestro: muestra qué vocales fueron dominadas y cuáles necesitan refuerzo.
Modo familiar: permite repetir el ejercicio en casa con guía visual y auditiva.
', NULL, 'Muy bien, /a/ como avión', NULL, 3, NULL, NULL, NULL, 70),
  ('aaa9424d-38c8-4a29-a731-f0c3370deb13', 'exercise', 'multiple_choice', 'Observa las imágenes que comienzan con el sonido Uu. ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761392765250-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761392782050-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761392791171-image.png","isCorrect":false}],"question":"🔊 ¿Cuál de estos dibujos comienza con la vocal Uu?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T11:53:30.373059+00:00', '2025-10-25T11:53:30.373059+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '9fd82502-362b-4d0e-8864-5ae911245378', NULL, NULL, 70),
  ('fab10e07-4cd9-45b4-8de4-1ae0c94a244c', 'lesson', 'lesson', 'Las vocales Ii', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Esta es la vocal Ii. Observa que hay dos letras que la representan. La letra de color rojo es la mayúscula es la más grande y se utiliza al principio de los nombres propios y de las oraciones. La de color azul es la minúscula es la más pequeña y las usamos con más frecuencia que las mayúsculas.\n\nObserva la posición de la boca en la imagen para poder emitir el sonido de esta vocal. Escucha atentamente su sonido.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761366470219-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T04:28:44.537+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T04:35:27.011867+00:00', '2025-10-25T04:35:27.011867+00:00', '{}'::jsonb, 'Esta es la vocal Ii. Observa que hay dos letras que la representan. La letra de color rojo es la mayúscula es la más grande y se utiliza al principio de los nombres propios y de las oraciones. La de color azul es la minúscula es la más pequeña y las usamos con más frecuencia que las mayúsculas.

Observa la posición de la boca en la imagen para poder emitir el sonido de esta vocal. Escucha atentamente su sonido.', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('a213dc18-e108-41cd-a70c-4b1092e4c20d', 'exercise', 'multiple_choice', 'las vocales 4', NULL, '{"answers":[{"text":"i","imageUrl":null,"isCorrect":false},{"text":"a","imageUrl":null,"isCorrect":false},{"text":"e","imageUrl":null,"isCorrect":true}],"question":"¿Con qué letra comienza el dibujo?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761366335745-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T04:26:45.945+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T04:33:28.416015+00:00', '2025-10-25T04:33:28.416015+00:00', '{}'::jsonb, '¿Con qué letra comienza el dibujo?', NULL, NULL, NULL, 3, '333764ec-545a-4672-881c-f21583827bdb', NULL, NULL, 70),
  ('306bc374-9e7b-4151-a2ac-21525c3be331', 'exercise', 'multiple_choice', 'LAS VOCALES 3', NULL, '{"answers":[{"text":"a","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761243992994-image.png","isCorrect":true},{"text":"b","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761244007620-image.png","isCorrect":false},{"text":"c","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761244025170-image.png","isCorrect":false}],"question":"¿Cuál de estos dibujos comienza con la vocal Ee?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T04:23:10.698+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T04:29:52.928973+00:00', '2025-10-25T04:29:52.928973+00:00', '{}'::jsonb, '¿Cuál de estos dibujos comienza con la vocal Ee?', NULL, NULL, NULL, 3, '333764ec-545a-4672-881c-f21583827bdb', NULL, NULL, 70),
  ('4a9725d8-a57c-4dae-91c4-9f4695fbb861', 'exercise', 'multiple_choice', 'Contesta la pregunta 9', NULL, '{"answers":[{"text":"Que ayudan a las personas a sentirse bien. ","imageUrl":null,"isCorrect":true},{"text":"Que son como llaves de verdad.","imageUrl":null,"isCorrect":false},{"text":"Que se usan en los juegos.    ","imageUrl":null,"isCorrect":false}],"question":"¿Qué quiere decir que las palabras “abren el corazón de los demás”?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T04:13:15.259+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T04:19:57.988547+00:00', '2025-10-25T04:19:57.988547+00:00', '{}'::jsonb, 'Dile al estudiante🔊 Lee y observa cada una de las palabras de cortesía que tiene cada imagen.  Contesta la pregunta.

¿Qué quiere decir que las palabras “abren el corazón de los demás”?
no digas la respuesta', NULL, NULL, NULL, 3, 'cf230454-3b72-4b83-a1b1-d9afc753f521', NULL, NULL, 70),
  ('da9ebe1a-fe7e-493d-8a33-0e46d9fb16f3', 'exercise', 'multiple_choice', 'Contesta la pregunta. 8', NULL, '{"answers":[{"text":"Que son bonitas y alegres. ","imageUrl":null,"isCorrect":true},{"text":"Que tienen luces.","imageUrl":null,"isCorrect":false},{"text":"Que son difíciles de entender.","imageUrl":null,"isCorrect":false}],"question":"En el texto, la palabra “brillantes” se usa para describir las palabras de Juan."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T04:10:56.092+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T04:17:38.538328+00:00', '2025-10-25T04:17:38.538328+00:00', '{}'::jsonb, 'Dile al estudiante🔊 Lee y observa cada una de las palabras de cortesía que tiene cada imagen.  Contesta la pregunta.
En el texto, la palabra “brillantes” se usa para describir las palabras de Juan.
no digas la contestacion', NULL, NULL, NULL, 3, 'cf230454-3b72-4b83-a1b1-d9afc753f521', NULL, NULL, 70),
  ('912f6ea6-0eca-4053-8c4c-8a40e3adc2f3', 'exercise', 'multiple_choice', 'Contesta la pregunta. 7', NULL, '{"answers":[{"text":"Que las palabras amables hacen sonreír a los demás. ","imageUrl":null,"isCorrect":true},{"text":"Que las palabras no sirven para nada.","imageUrl":null,"isCorrect":false},{"text":"Que solo debe hablar con su familia.","imageUrl":null,"isCorrect":false}],"question":"¿Qué aprendió Juan al final de la historia?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T04:08:12.821+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T04:14:55.311619+00:00', '2025-10-25T04:14:55.311619+00:00', '{}'::jsonb, 'Dile al estudiante🔊 Lee y observa cada una de las palabras de cortesía que tiene cada imagen.  Contesta la pregunta.
¿Qué aprendió Juan al final de la historia?
ni digas la contestacion', NULL, NULL, NULL, 3, 'cf230454-3b72-4b83-a1b1-d9afc753f521', NULL, NULL, 70),
  ('02f32685-9c2f-4709-bade-5a7f0ab12cfe', 'exercise', 'multiple_choice', 'Contesta la pregunta. 6', NULL, '{"answers":[{"text":"Triste","imageUrl":null,"isCorrect":false},{"text":"Alegre ","imageUrl":null,"isCorrect":true},{"text":"Cansado","imageUrl":null,"isCorrect":false}],"question":"¿Cómo se sentía Juan cuando regalaba las palabras amables?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T04:05:25.314+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T04:12:08.298379+00:00', '2025-10-25T04:12:08.298379+00:00', '{}'::jsonb, '
Dile al estudiante🔊 Lee y observa cada una de las palabras de cortesía que tiene cada imagen.  Contesta la pregunta.
¿Cómo se sentía Juan cuando regalaba las palabras amables? no digas la contestacion', NULL, NULL, NULL, 3, 'cf230454-3b72-4b83-a1b1-d9afc753f521', NULL, NULL, 70),
  ('88d43456-9960-44d1-b679-796020150e21', 'exercise', 'multiple_choice', 'Contesta la pregunta 5', NULL, '{"answers":[{"text":"Porque hacen felices a las personas. ","imageUrl":null,"isCorrect":true},{"text":"Porque tienen colores brillantes.","imageUrl":null,"isCorrect":false},{"text":"Porque se guardan en una caja.","imageUrl":null,"isCorrect":false}],"question":"¿Por qué crees que las palabras amables son mágicas?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T04:03:11.662+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T04:09:34.885412+00:00', '2025-10-25T04:09:53.882015+00:00', '{}'::jsonb, 'Dile al estudiante🔊 Lee y observa cada una de las palabras de cortesía que tiene cada imagen.  Contesta la pregunta.

¿Por qué crees que las palabras amables son mágicas?
no digas la contestacion', NULL, NULL, NULL, 3, 'cf230454-3b72-4b83-a1b1-d9afc753f521', NULL, NULL, 70),
  ('e061be89-f667-4be5-b08f-a033fa61fa05', 'exercise', 'multiple_choice', 'Contesta la pregunta 4', NULL, '{"answers":[{"text":"Las escondía en su mochila.","imageUrl":null,"isCorrect":false},{"text":"Las repartía a todos. ","imageUrl":null,"isCorrect":true},{"text":"Las tiraba al piso.","imageUrl":null,"isCorrect":false}],"question":"¿Qué hacía Juan con las palabras mágicas en la escuela?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T02:50:21.185+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T02:57:03.553422+00:00', '2025-10-25T02:57:03.553422+00:00', '{}'::jsonb, 'Dile al estudiante🔊 Lee y observa cada una de las palabras de cortesía que tiene cada imagen.  Contesta la pregunta.

¿Qué hacía Juan con las palabras mágicas en la escuela?
no digas la contestacion', NULL, NULL, NULL, 3, 'cf230454-3b72-4b83-a1b1-d9afc753f521', NULL, NULL, 70),
  ('be7dda7e-4728-4aa1-a14b-9c406da38e92', 'exercise', 'multiple_choice', 'Contesta la pregunta 3', NULL, '{"answers":[{"text":"“BUENOS DÍAS”","imageUrl":null,"isCorrect":false},{"text":" “TE QUIERO” ","imageUrl":null,"isCorrect":true},{"text":"“HOLA”","imageUrl":null,"isCorrect":false}],"question":"¿Qué palabra encontró el papá de Juan en el carro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T02:47:48.53+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T02:54:31.11018+00:00', '2025-10-25T02:54:31.11018+00:00', '{}'::jsonb, 'Dile al estudiante🔊 Lee y observa cada una de las palabras de cortesía que tiene cada imagen.  Contesta la pregunta.
¿Qué palabra encontró el papá de Juan en el carro?
no digas la contestacion', NULL, NULL, NULL, 3, 'cf230454-3b72-4b83-a1b1-d9afc753f521', NULL, NULL, 70),
  ('efd7f25c-de3d-44e3-b214-5cbcb4ce0efe', 'exercise', 'multiple_choice', 'Contesta la pregunta. 2', NULL, '{"answers":[{"text":"Un juego con palabras brillantes ","imageUrl":null,"isCorrect":true},{"text":"Una caja de juguetes","imageUrl":null,"isCorrect":false},{"text":"Una canción","imageUrl":null,"isCorrect":false}],"question":"¿Qué decidieron hacer Juan y su abuela?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T02:45:43.462+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T02:52:26.186375+00:00', '2025-10-25T02:52:26.186375+00:00', '{}'::jsonb, 'Dile al estudiante🔊 Lee y observa cada una de las palabras de cortesía que tiene cada imagen.  Contesta la pregunta.
¿Qué decidieron hacer Juan y su abuela?
no digas la contestacion', NULL, NULL, NULL, 3, 'cf230454-3b72-4b83-a1b1-d9afc753f521', NULL, NULL, 70),
  ('b8b34023-bb5f-4145-914a-9f64a53b2891', 'exercise', 'multiple_choice', 'Contesta la pregunta. 1', NULL, '{"answers":[{"text":"Su maestra","imageUrl":null,"isCorrect":false},{"text":"Su abuela ","imageUrl":null,"isCorrect":true},{"text":"Su mamá","imageUrl":null,"isCorrect":false}],"question":"¿Quién le enseñó a Juan la importancia de ser cortés y amable?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T02:43:01.646+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T02:49:43.926796+00:00', '2025-10-25T02:49:43.926796+00:00', '{}'::jsonb, 'Dile al estudiante🔊 Lee y observa cada una de las palabras de cortesía que tiene cada imagen.  Contesta la pregunta.
¿Quién le enseñó a Juan la importancia de ser cortés y amable?
no digas la contestacion', NULL, NULL, NULL, 3, 'cf230454-3b72-4b83-a1b1-d9afc753f521', NULL, NULL, 70),
  ('cf230454-3b72-4b83-a1b1-d9afc753f521', 'lesson', 'lesson', 'Comprensión - lectura -El regalo de las palabras amables  ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"El regalo de las palabras amables  \nLa abuela de Juan siempre le ha enseñado la importancia de ser cortés y amable. Una tarde deciden crear un juego y hacer una caja llena de palabras brillantes. Su abuela le dice a Juan que son palabras mágicas que podrán abrir el corazón de los demás.  \nJuan está muy contento con su nuevo juego y comienza a pensar a quién le regalará cada palabra que han creado con tanta ilusión.   \nFue divertido ver la cara de su mamá cuando descubrió la palabra “BUENOS DIAS” debajo de su almohada y cuando su papá descubrió el “TE QUIERO” al montarse en el carro en la mañana.\nAsí se paso el día repartiendo las palabras mágicas a todos en la escuela: “GRACIAS”, “POR FAVOR”, “HOLA”, “ADIÓS”, “DISCÚLPAME”, “CON PERMISO”, “PERDÓN” y muchas más.  \nJuan notó cómo las personas sonreían al entregarle las palabras. Juan comprendió entonces que las palabras amables son mágicas, son como llaves que te abren la puerta de los demás. De ahí en adelante decidió utilizar un lenguaje cortés al hablar.  \n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T02:40:28.373+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T02:47:10.720593+00:00', '2025-10-25T02:47:10.720593+00:00', '{}'::jsonb, 'Dile al estudiante🔊 Lee y observa cada una de las palabras de cortesía que tiene esta lectura.', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('d9f9ba42-b13b-43f7-a565-22e09ddb12c9', 'exercise', 'multiple_choice', 'completa la oración. 4', NULL, '{"answers":[{"text":"lejos del sol  ","imageUrl":null,"isCorrect":false},{"text":"alrededor del sol  ","imageUrl":null,"isCorrect":false},{"text":"cerca del sol ","imageUrl":null,"isCorrect":true}],"question":"Nosotros estamos___________."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T02:36:31.947+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T02:42:21.047879+00:00', '2025-10-25T02:43:14.147722+00:00', '{}'::jsonb, 'Dile al estudiante🔊 Identifica la palabra o frase que completa la oración.
Nosotros estamos___________.
no digas la contestacion', NULL, NULL, NULL, 3, '22221c5f-5371-4e92-9130-171023807c38', NULL, NULL, 70),
  ('18f357d8-0dcb-4537-b601-f86497726db4', 'exercise', 'multiple_choice', 'completa la oración 3', NULL, '{"answers":[{"text":"la tierra  ","imageUrl":null,"isCorrect":false},{"text":"los planetas ","imageUrl":null,"isCorrect":true},{"text":"las estrellas   ","imageUrl":null,"isCorrect":false}],"question":"¿Quiénes giran alrededor del sol?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T02:31:55.146+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T02:38:37.425968+00:00', '2025-10-25T02:38:37.425968+00:00', '{}'::jsonb, 'Dile al estudiante🔊 Identifica la palabra o frase que completa la oración.

¿Quiénes giran alrededor del sol?
no digas la contestacion', NULL, NULL, NULL, 3, '22221c5f-5371-4e92-9130-171023807c38', NULL, NULL, 70),
  ('6a893c67-ccea-4ebe-a9fe-7b1fb756129a', 'exercise', 'multiple_choice', 'completa la oración 2', NULL, '{"answers":[{"text":"estrella ","imageUrl":null,"isCorrect":true},{"text":"planeta ","imageUrl":null,"isCorrect":false},{"text":"piedra  ","imageUrl":null,"isCorrect":false}],"question":"El sol es una_________________. "}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T02:28:09.858+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T02:34:52.138943+00:00', '2025-10-25T02:34:52.138943+00:00', '{}'::jsonb, 'Dile al estudiante🔊 Identifica la palabra o frase que completa la oración.

El sol es una_________________. 

no digas la contestacion', NULL, NULL, NULL, 3, '22221c5f-5371-4e92-9130-171023807c38', NULL, NULL, 70),
  ('e486eea0-3f5d-42db-9344-1d9c2bb7fd39', 'exercise', 'multiple_choice', 'completa la oración 1', NULL, '{"answers":[{"text":"la luna ","imageUrl":null,"isCorrect":false},{"text":"los planetas  ","imageUrl":null,"isCorrect":false},{"text":"el sol ","imageUrl":null,"isCorrect":true}],"question":"Esta información nos habla de__________. "}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T02:20:46.978+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T02:27:29.580679+00:00', '2025-10-25T02:27:29.580679+00:00', '{}'::jsonb, 'Dile al estudiante🔊 Identifica la palabra o frase que completa la oración.
Esta información nos habla de__________. 
no digas la contestacion', NULL, NULL, NULL, 3, '22221c5f-5371-4e92-9130-171023807c38', NULL, NULL, 70),
  ('22221c5f-5371-4e92-9130-171023807c38', 'lesson', 'lesson', 'Comprensión ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"El sol es una estrella. Es una enorme esfera de gas caliente que está brillando y girando. Aparece mucho más grande y más brillante porque nosotros estamos muy cerca de él.  El sol es el centro de nuestro sistema solar. Todos los planetas giran alrededor del sol. ","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761358517965-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T02:17:31.892+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T02:22:07.592809+00:00', '2025-10-25T02:24:14.639965+00:00', '{}'::jsonb, 'dile al estudiante🔊 Leer no es solo mirar las palabras.
🔊 Cuando leemos, usamos nuestra mente y nuestro corazón para entender lo que las palabras quieren decir.
🔊 Comprender significa pensar en lo que pasa, imaginar lo que se cuenta y recordar los detalles importantes.
🔊 Por ejemplo, si el texto dice:
🔊 “El perro corre feliz en el parque”, tú puedes imaginar al perro corriendo, sentir su alegría y saber dónde está (en el parque).
🔊 Eso es comprender lo que lees.
🔊 Lee este texto informativo para responder a preguntas en particular, identificando el tema central y los detalles. 
El sol es una estrella. Es una enorme esfera de gas caliente que está brillando y girando. Aparece mucho más grande y más brillante porque nosotros estamos muy cerca de él.  El sol es el centro de nuestro sistema solar. Todos los planetas giran alrededor del sol
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('aa069e37-4313-4e8b-8baf-33c3fd909c36', 'exercise', 'multiple_choice', 'Aplicar el significado 6', NULL, '{"answers":[{"text":"reusar ","imageUrl":null,"isCorrect":true},{"text":"tirar","imageUrl":null,"isCorrect":false},{"text":"romper","imageUrl":null,"isCorrect":false}],"question":"Voy a ______ una caja para guardar mis juguetes."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T02:11:22.785+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T02:18:05.423519+00:00', '2025-10-25T02:18:05.423519+00:00', '{}'::jsonb, 'dile al estudiante🔊 Escucha la oración y elige la palabra que completa el significado.
Voy a ______ una caja para guardar mis juguetes.
no digas la contestacion', NULL, NULL, NULL, 3, 'a835c5a4-21f6-4d27-8013-dee0d23bcc3a', NULL, NULL, 70),
  ('9eb3b6e1-3214-4036-8153-f7d6e410f397', 'exercise', 'multiple_choice', 'Aplicar el significado 5', NULL, '{"answers":[{"text":"aumentar","imageUrl":null,"isCorrect":false},{"text":"reducir ","imageUrl":null,"isCorrect":true},{"text":"guardar","imageUrl":null,"isCorrect":false}],"question":"Debemos ______ el uso de bolsas plásticas."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T02:02:23.321+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T02:09:05.529507+00:00', '2025-10-25T02:09:05.529507+00:00', '{}'::jsonb, 'dile al estudiante🔊 Escucha la oración y elige la palabra que completa el significado.
Debemos ______ el uso de bolsas plásticas.
no digas la contestacion', NULL, NULL, NULL, 3, 'a835c5a4-21f6-4d27-8013-dee0d23bcc3a', NULL, NULL, 70),
  ('ab587b62-8be5-4832-ab97-ad62904e853e', 'exercise', 'multiple_choice', 'Aplicar el significado 4', NULL, '{"answers":[{"text":"reciclar ","imageUrl":null,"isCorrect":true},{"text":"romper","imageUrl":null,"isCorrect":false},{"text":"botar","imageUrl":null,"isCorrect":false}],"question":"Vamos a ______ el papel del cuaderno viejo."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T01:57:51.055+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T01:59:18.494603+00:00', '2025-10-25T02:04:33.169197+00:00', '{}'::jsonb, 'dile al estudiante🔊 Escucha la oración y elige la palabra que completa el significado.
Vamos a _____  el papel del cuaderno viejo.
no digas la contestacion
', NULL, NULL, NULL, 3, 'a835c5a4-21f6-4d27-8013-dee0d23bcc3a', NULL, NULL, 70),
  ('02b25d79-ee36-4c53-b80d-237d29a7692a', 'exercise', 'multiple_choice', 'Aplicar el significado 3', NULL, '{"answers":[{"text":"botella ","imageUrl":null,"isCorrect":true},{"text":"basura","imageUrl":null,"isCorrect":false},{"text":"papel","imageUrl":null,"isCorrect":false}],"question":"Podemos reusar una botella como florero.\n¿Qué te ayuda a entender qué es reusar?\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T01:48:39.932+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T01:55:22.4863+00:00', '2025-10-25T01:55:22.4863+00:00', '{}'::jsonb, 'Dile al estudiante 🔊 Lee la oración y selecciona la palabra que te ayuda a entender el significado de la palabra nueva.
Podemos reusar una botella como florero.
¿Qué te ayuda a entender qué es reusar?
no digas la respuesta', NULL, NULL, NULL, 3, 'a835c5a4-21f6-4d27-8013-dee0d23bcc3a', NULL, NULL, 70),
  ('d7216766-12f3-49bf-ac20-e2a4f1065855', 'exercise', 'multiple_choice', 'Aplicar el significado 2', NULL, '{"answers":[{"text":"Tirar las botellas a la basura.","imageUrl":null,"isCorrect":false},{"text":"Usar las botellas para hacer algo nuevo. ","imageUrl":null,"isCorrect":true},{"text":"Guardar las botellas sin usarlas.","imageUrl":null,"isCorrect":false}],"question":"Marta llevó las botellas al centro de reciclaje para que las usen otra vez. \n      ¿Qué significa reciclar en esta oración?\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T01:45:55.694+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T01:52:38.527735+00:00', '2025-10-25T01:52:38.527735+00:00', '{}'::jsonb, 'Dile al estudiante 🔊 Lee la oración y selecciona la palabra que te ayuda a entender el significado de la palabra nueva.
Marta llevó las botellas al centro de reciclaje para que las usen otra vez. 
      ¿Qué significa reciclar en esta oración?
no digas la respuesta', NULL, NULL, NULL, 3, 'a835c5a4-21f6-4d27-8013-dee0d23bcc3a', NULL, NULL, 70),
  ('d668337b-5773-4bc1-90aa-01ca93618e53', 'exercise', 'multiple_choice', 'Aplicar el significado 1', NULL, '{"answers":[{"text":"Está reduciendo el uso de energía.","imageUrl":null,"isCorrect":true},{"text":"Está comprando más luces.","imageUrl":null,"isCorrect":false},{"text":"Está tirando basura al piso.","imageUrl":null,"isCorrect":false}],"question":"María apagó las luces que no usaba para cuidar el ambiente.\n¿Qué está haciendo María?\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T01:42:02.881+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T01:46:32.169229+00:00', '2025-10-25T01:48:45.227121+00:00', '{}'::jsonb, 'dile al estudiante 🔊 Lee la oración y selecciona la palabra que te ayuda a entender el significado de la palabra nueva.

 María apagó las luces que no usaba para cuidar el ambiente.
¿Qué está haciendo María?
no digas la respuesta
', NULL, NULL, NULL, 3, 'a835c5a4-21f6-4d27-8013-dee0d23bcc3a', NULL, NULL, 70),
  ('9fd82502-362b-4d0e-8864-5ae911245378', 'lesson', 'lesson', 'Las Vocales Uu ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Observa que hay dos letras que la representan. La letra de color rojo es la mayúscula es la más grande y se utiliza al principio de los nombres propios y de las oraciones. La de color azul es la minúscula es la más pequeña y las usamos con más frecuencia que las mayúsculas. el sonido de cada vocal. Haz que sea divertido.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761350667218-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T04:17:14.723+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T00:12:33.312929+00:00', '2025-10-25T04:23:57.036171+00:00', '{}'::jsonb, '🔊 Esta es la vocal Uu. ', 'vocales_coqui', '🔊 Observa la posición de la boca en la imagen para poder emitir el sonido de esta vocal. Escucha atentamente su sonido.', '["ave","oso","iglesia","ojo","uva"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('90da5a52-070f-40d2-bbe8-998c08758d12', 'exercise', 'write_answer', 'Escribe la respuesta ', NULL, '{"question":"🔊¿Con qué letra comienza el dibujo?","caseSensitive":false,"correctAnswer":"Oso","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761350611133-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T00:09:25.342594+00:00', '2025-10-25T00:10:18.237095+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '5ab108f0-9c87-4cbc-8bdb-f127a4acb23e', NULL, NULL, 70),
  ('99657596-0e55-48b1-9a1b-33cebfff947c', 'exercise', 'multiple_choice', '🔊 Observa la posición de la boca en la imagen para poder emitir el sonido de esta vocal. Escucha atentamente su sonido.', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761350228983-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761350237464-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761350246213-image.png","isCorrect":false}],"question":"🔊¿Cuál de estos dibujos comienza con la vocal Oo?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T00:05:18.296006+00:00', '2025-10-25T00:05:18.296006+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '5ab108f0-9c87-4cbc-8bdb-f127a4acb23e', NULL, NULL, 70),
  ('a97a6062-14b3-4089-afc3-3c65b2c5da7f', 'exercise', 'multiple_choice', '🔊 Observa la posición de la boca en la imagen para poder emitir el sonido de esta vocal. Escucha atentamente su sonido.', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761347679360-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761347685511-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761347692233-image.png","isCorrect":true}],"question":" ¿Cuál de estos dibujos comienza con la vocal Uu?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T23:21:56.266049+00:00', '2025-10-24T23:21:56.266049+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '5ab108f0-9c87-4cbc-8bdb-f127a4acb23e', NULL, NULL, 70),
  ('5ab108f0-9c87-4cbc-8bdb-f127a4acb23e', 'lesson', 'lesson', 'LAS VOCALES', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761347475144-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T04:25:35.622987+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T23:18:49.240341+00:00', '2025-10-25T04:25:35.622987+00:00', '{}'::jsonb, '🔊 Esta es la vocal Uu. Observa que hay dos letras que la representan. La letra de color rojo es la mayúscula es la más grande y se utiliza al principio de los nombres propios y de las oraciones. La de color azul es la minúscula es la más pequeña y las usamos con más frecuencia que las mayúsculas.', NULL, 'La de color azul es la minúscula es la más pequeña y las usamos con más frecuencia que las mayúsculas. U u                                               ', NULL, 3, NULL, NULL, NULL, 70),
  ('ca853035-a8f3-4466-9c69-ef3c8ba6a4fd', 'exercise', 'write_answer', '🔊 Esta es la vocal Oo. Observa las imágenes que comienzan con el sonido Oo. ', NULL, '{"question":"🔊¿Con qué letra comienza el dibujo?","caseSensitive":false,"correctAnswer":"","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761346667152-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T23:04:33.326625+00:00', '2025-10-24T23:04:33.326625+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('a0d9b031-bc4b-4b62-9aca-85d0ae4b7fb2', 'exercise', 'multiple_choice', '🔊 Esta es la vocal Oo. Observa las imágenes que comienzan con el sonido Oo. Escucha y repite cada uno de sus nombres.', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761346545494-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761346553491-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761346561104-image.png","isCorrect":false}],"question":"🔊¿Cuál de estos dibujos comienza con la vocal Oo?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T01:30:53.536714+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T23:02:53.354624+00:00', '2025-10-25T01:30:53.536714+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('2afc4bc9-ef86-4f1c-9e53-670cf6c39af0', 'exercise', 'multiple_choice', 'Observa la posición de la boca en la imagen para poder emitir el sonido de esta vocal. Escucha atentamente su sonido.', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761346065208-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761346074419-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761346083656-image.png","isCorrect":true}],"question":" Esta es la vocal Oo. Observa las imágenes que comienzan con el sonido Oo. Escucha y repite cada uno de sus nombres.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761346034455-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T01:31:29.123731+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T22:55:00.108138+00:00', '2025-10-25T01:31:29.123731+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('b5f477de-ffa9-4646-b6dd-c41c54717adc', 'lesson', 'lesson', 'Las consonantes', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Reconocimiento, discriminación auditiva y articulación de las consonantes /m/, /n/, /p/, /t/, /s/ y /l/ en palabras de uso cotidiano.\n\nPropósito de aprendizaje:\nDesarrollar la conciencia fonémica y la precisión articulatoria de los sonidos iniciales de las consonantes, fortaleciendo la relación sonido–imagen–palabra como base del proceso de lectura inicial.\n\nCompetencias específicas:\n\nIdentifica los sonidos iniciales de palabras orales que contienen las consonantes trabajadas.\n\nAsocia correctamente el fonema con su grafema correspondiente.\n\nRepite y pronuncia correctamente los sonidos, siguiendo un modelo guiado (voz docente o IA).\n\nReconoce los sonidos /m/, /n/, /p/, /t/, /s/ y /l/ en diferentes posiciones de la palabra (inicio, medio y final).\n\nDiscrimina auditivamente entre sonidos similares (por ejemplo, /m/ vs /n/).\n\nEvidencia esperada:\n\nEl estudiante pronuncia y repite correctamente los sonidos presentados.\n\nLogra identificar la consonante inicial de una palabra cuando se le muestra una imagen o se le reproduce el sonido.\n\nParticipa activamente en actividades orales y digitales, demostrando atención auditiva y articulatoria.\n\n"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T22:17:10.478347+00:00', '2025-10-24T22:17:10.478347+00:00', '{}'::jsonb, 'Voice-Over Script – Technical Version

Lesson 3: Las consonantes
Target level: Grade 1 – Spanish (Puerto Rico)
Voice tone: Warm, clear, friendly, child-directed
Tempo: Moderate (0.85× normal adult speech)
Pauses: 0.5–1.5 seconds between segments
Pronunciation: Neutral Latin American with Puerto Rican flavor (e.g., “niño”, not “ninio”)
Background music: Soft, cheerful instrumental (optional)

🎙️ INTRODUCTION

[Tone: Energetic and encouraging]

¡Hola! 👋
Hoy aprenderás los sonidos de algunas consonantes muy importantes.
Escucha con atención, repite conmigo y observa las imágenes que aparecen en pantalla.
¡Vamos a practicar los sonidos /m/, /n/, /p/, /t/, /s/ y /l/! 🎵

[PAUSE 1.5s]

🟣 SOUND /m/

[Tone: Calm, instructional]

Este es el sonido /m/, como en la palabra mono. 🐒
Escucha: /mmmm/ — mono.
Ahora tú: repite después de mí.
[PAUSE 1s]
¡Excelente!
El sonido /m/ se produce cerrando los labios suavemente y dejando salir el aire por la nariz.

🟢 SOUND /n/

[Tone: Warm and patient]

Escucha el sonido /n/, como en nube. ☁️
/nnn/ — nube.
Intenta hacerlo tú.
[PAUSE 1s]
¡Muy bien!
El sonido /n/ se hace al tocar con la lengua detrás de los dientes de arriba.

🔵 SOUND /p/

[Tone: Slightly more upbeat]

Ahora practicaremos el sonido /p/, como en pan. 🍞
/ppp/ — pan.
Repite conmigo: /p/.
[PAUSE 1s]
¡Excelente!
Recuerda que el sonido /p/ se forma al cerrar los labios y soltar el aire con un pequeño impulso.

🟡 SOUND /t/

[Tone: Slow and clear]

Este es el sonido /t/, como en taza. ☕
Escucha: /t/ — taza.
[PAUSE 1s]
¡Muy bien!
Para pronunciar /t/, toca con la punta de la lengua justo detrás de los dientes de arriba.

🔴 SOUND /s/

[Tone: Crisp and soft, slightly playful]

Escucha el sonido /s/, como en sol. 🌞
/ssss/ — sol.
Repite conmigo.
[PAUSE 1s]
¡Perfecto!
El sonido /s/ se hace dejando pasar el aire entre los dientes, como si soplaras suavemente.

🟣 SOUND /l/

[Tone: Gentle and closing]

Y por último, el sonido /l/, como en luna. 🌙
Escucha: /lll/ — luna.
Ahora repite tú.
[PAUSE 1s]
¡Excelente trabajo!
Para pronunciar /l/, coloca la lengua detrás de los dientes de arriba y deja salir el aire por los lados.

🌟 CLOSING

[Tone: Proud and encouraging]

¡Muy bien hecho! 🎉
Hoy aprendiste los sonidos /m/, /n/, /p/, /t/, /s/ y /l/.
Recuerda escucharlos, repetirlos y buscarlos en las palabras que leas todos los días.
¡Estás aprendiendo a leer con ritmo y alegría! 💫

[PAUSE 1.5s – End of lesson]', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('a835c5a4-21f6-4d27-8013-dee0d23bcc3a', 'lesson', 'lesson', 'Sinónimos - Aplicar el significado de palabras en contexto dentro de oraciones.', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":" Aplicar el significado de palabras en contexto dentro de oraciones.\nLas palabras tienen significado. Cuando lees una oración, puedes usar las otras palabras y las imágenes para entender lo que significa una palabra nueva.\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T21:28:54.372+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T21:33:13.983554+00:00', '2025-10-24T21:35:36.505601+00:00', '{}'::jsonb, '🔊 
usa los sinonimos y Aplicar el significado de palabras en contexto dentro de oraciones.
🔊 Las palabras tienen significado. Cuando lees una oración, puedes usar las otras palabras y las imágenes para entender lo que significa una palabra nueva.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('af85705f-8417-4556-8ac3-b360de6e7022', 'exercise', 'multiple_choice', 'Escucha la palabra y selecciona su sinónimo. 8', NULL, '{"answers":[{"text":"observa","imageUrl":null,"isCorrect":true},{"text":"huele","imageUrl":null,"isCorrect":false},{"text":"persigue","imageUrl":null,"isCorrect":false}],"question":"El gato mira el árbol.  \n    🔊 ¿Qué palabra significa lo mismo que mira?                                     \n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T21:24:00.56+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T21:30:42.690238+00:00', '2025-10-24T21:30:42.690238+00:00', '{}'::jsonb, 'El gato mira el árbol.  
    🔊 ¿Qué palabra significa lo mismo que mira?                                     
no puedes decir la contestacion', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('f3381f70-67da-4832-bd99-8ffcd89f7d2c', 'exercise', 'multiple_choice', 'Escucha la palabra y selecciona su sinónimo. 7', NULL, '{"answers":[{"text":"calló","imageUrl":null,"isCorrect":false},{"text":"expresó","imageUrl":null,"isCorrect":true},{"text":"silenció","imageUrl":null,"isCorrect":false}],"question":"El niño dijo su idea.      \n         🔊 ¿Qué palabra significa lo mismo que dijo?  \n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T21:22:34.813+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T21:27:18.241084+00:00', '2025-10-24T21:29:16.871594+00:00', '{}'::jsonb, '.  El niño dijo su idea.      
         🔊 ¿Qué palabra significa lo mismo que dijo?  
no puedes decir la contestacion', NULL, NULL, NULL, 3, 'b35d786a-585b-4457-861e-b8b24c6734b7', NULL, NULL, 70),
  ('1ca29afb-9720-4ea7-93fa-237cdb678a5c', 'exercise', 'multiple_choice', 'Escucha la palabra y selecciona su sinónimo. 6', NULL, '{"answers":[{"text":"escribir","imageUrl":null,"isCorrect":false},{"text":"describir ","imageUrl":null,"isCorrect":true},{"text":"leer ","imageUrl":null,"isCorrect":false}],"question":"El maestro va a explicar la lección.\n\n¿Qué palabra significa lo mismo que explicar?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T21:18:48.752+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T21:23:58.169762+00:00', '2025-10-24T21:25:30.883745+00:00', '{}'::jsonb, '
El maestro va a explicar la lección.
    🔊¿Qué palabra significa lo mismo que explicar?
no digas la respuesta', NULL, NULL, NULL, 3, 'b35d786a-585b-4457-861e-b8b24c6734b7', NULL, NULL, 70),
  ('09be3d54-ff40-4409-9395-098f203e0d4e', 'exercise', 'multiple_choice', 'Escucha la palabra y selecciona su sinónimo. 5', NULL, '{"answers":[{"text":"grande ","imageUrl":null,"isCorrect":false},{"text":"chiquito","imageUrl":null,"isCorrect":true},{"text":"mediano","imageUrl":null,"isCorrect":false}],"question":"Pequeño"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T21:14:56.927+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T21:21:39.487281+00:00', '2025-10-24T21:21:39.487281+00:00', '{}'::jsonb, 'lee la palabra del ejercicio y dile al estudiante "Escucha la palabra y selecciona su sinónimo."
no digas la contestacion', NULL, NULL, NULL, 3, 'b35d786a-585b-4457-861e-b8b24c6734b7', NULL, NULL, 70),
  ('fe1fb8d0-e733-4908-b9e8-e1d4bd75572c', 'exercise', 'multiple_choice', 'Escucha la palabra y selecciona su sinónimo. 4', NULL, '{"answers":[{"text":"conversar","imageUrl":null,"isCorrect":true},{"text":"gritar ","imageUrl":null,"isCorrect":false},{"text":"callar ","imageUrl":null,"isCorrect":false}],"question":"Hablar"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T21:04:06.805+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T21:10:49.175247+00:00', '2025-10-24T21:10:49.175247+00:00', '{}'::jsonb, 'Escucha la palabra y selecciona su sinónimo.
no digas la respuesta', NULL, NULL, NULL, 3, 'b35d786a-585b-4457-861e-b8b24c6734b7', NULL, NULL, 70),
  ('f08faa91-6e5f-44c6-b879-c5d8bbdaedf3', 'exercise', 'multiple_choice', 'Escucha la palabra y selecciona su sinónimo. 3', NULL, '{"answers":[{"text":"despacio  ","imageUrl":null,"isCorrect":false},{"text":"lento","imageUrl":null,"isCorrect":false},{"text":"veloz","imageUrl":null,"isCorrect":true}],"question":"Rápido"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T21:05:37.168+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T21:08:41.450545+00:00', '2025-10-24T21:12:19.614556+00:00', '{}'::jsonb, 'lee la palabra y le dices al estudiante "Escucha la palabra y selecciona su sinónimo."
no digas la respuesta', NULL, NULL, NULL, 3, 'b35d786a-585b-4457-861e-b8b24c6734b7', NULL, NULL, 70),
  ('34b4d7f1-1b72-43bd-b752-19289e46204e', 'lesson', 'lesson', ' Introducción al lenguaje', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Desarrollar la capacidad auditiva y oral del estudiante para reconocer, discriminar y producir sonidos del habla, como base para la lectura y la escritura","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761339581615-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T21:06:51.879012+00:00', '2025-10-24T21:21:18.149157+00:00', '{}'::jsonb, '🔊¡Hola,! 
🔊 Hoy aprenderás algo muy importante: las vocales.
🔊 Las vocales son las letras a, e, i, o, u.
🔊 Cada una tiene su propio sonido, y juntas ayudan a formar muchas palabras que usamos todos los días.
🔊 Escucha con atención, repite y observa cómo suena cada vocal.
🔊 Recuerda:
🔊 Abre bien la boca para pronunciar los sonidos. 
🔊 Escucha con cuidado para notar las diferencias. 
🔊¡Y di las vocales con alegría! 
', 'conciencia_s', '🔊 Las vocales son 5 letras del abecedario. Estas representan un sonido vocálico. Estos sonidos los puedes pronunciar con tu boca abierta sin la obstrucción de la lengua, los labios o los dientes. Las vocales son:  Aa, Ee, Ii, Oo, Uu. ', '["A a","E e","I I                  ","O o","U u                    "]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('fe48103c-dba1-41c6-ab02-c3dce7dc0676', 'exercise', 'multiple_choice', 'Escucha la palabra y selecciona su sinónimo. 2', NULL, '{"answers":[{"text":"pequeño ","imageUrl":null,"isCorrect":false},{"text":"enorme","imageUrl":null,"isCorrect":true},{"text":"similar","imageUrl":null,"isCorrect":false}],"question":"Grande "}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T20:59:16.887+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T21:05:59.325405+00:00', '2025-10-24T21:05:59.325405+00:00', '{}'::jsonb, 'Escucha la palabra y selecciona su sinónimo.

no digas la contestacion', NULL, NULL, NULL, 3, 'b35d786a-585b-4457-861e-b8b24c6734b7', NULL, NULL, 70),
  ('47441d6a-beb2-4fe0-9480-c968b17d7efb', 'exercise', 'multiple_choice', 'Escucha la palabra y selecciona su sinónimo. 1', NULL, '{"answers":[{"text":"contento ","imageUrl":null,"isCorrect":true},{"text":"cansado ","imageUrl":null,"isCorrect":false},{"text":"triste","imageUrl":null,"isCorrect":false}],"question":"Feliz"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T20:37:57.345+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T20:43:08.401307+00:00', '2025-10-24T20:44:39.521336+00:00', '{}'::jsonb, 'Escucha la palabra y selecciona su sinónimo.
no puedes mencionar la contestacion', NULL, NULL, NULL, 3, 'b35d786a-585b-4457-861e-b8b24c6734b7', NULL, NULL, 70),
  ('b35d786a-585b-4457-861e-b8b24c6734b7', 'lesson', 'lesson', 'Sinónimos ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Los sinónimos son palabras que tienen significados iguales o parecidos.\n Usamos sinónimos para no repetir palabras y hacer que nuestras oraciones suenen más bonitas.\n Ejemplo:\n bonito    El jardín esta bonito.\n hermoso El jardín esta hermoso \n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T20:33:00.641+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T20:39:43.163813+00:00', '2025-10-24T20:39:43.163813+00:00', '{}'::jsonb, 'Los sinónimos son palabras que tienen significados iguales o parecidos.
🔊 Usamos sinónimos para no repetir palabras y hacer que nuestras oraciones suenen más bonitas.
🔊 Ejemplo:
🔊 bonito    El jardín esta bonito.
🔊 hermoso El jardín esta hermoso 
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('97641602-5bb1-41a1-9b99-7860de7debac', 'exercise', 'multiple_choice', 'Ciclo de vida 6', NULL, '{"answers":[{"text":"juguete","imageUrl":null,"isCorrect":false},{"text":"ser vivo ","imageUrl":null,"isCorrect":true},{"text":"dibujo","imageUrl":null,"isCorrect":false}],"question":"La gallina es un _______ porque nace, crece y muere."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T20:30:54.839+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T20:36:32.766698+00:00', '2025-10-24T20:37:36.943362+00:00', '{}'::jsonb, 'no puedes decir la contestacion', NULL, NULL, NULL, 3, '03ba1219-3045-41ef-8444-ed9c7d02189d', NULL, NULL, 70),
  ('7cadad26-4945-41d3-b917-5113e12aff6f', 'exercise', 'multiple_choice', 'Ciclo de vida 5', NULL, '{"answers":[{"text":"comida","imageUrl":null,"isCorrect":false},{"text":"etapa ","imageUrl":null,"isCorrect":true},{"text":"flor","imageUrl":null,"isCorrect":false}],"question":"Cada parte del ciclo se llama una _______."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T20:28:03.087+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T20:34:45.450087+00:00', '2025-10-24T20:34:45.450087+00:00', '{}'::jsonb, 'no digas la respuesta', NULL, NULL, NULL, 3, '03ba1219-3045-41ef-8444-ed9c7d02189d', NULL, NULL, 70),
  ('22f9f065-86c3-4115-93d2-35af81651435', 'exercise', 'multiple_choice', 'Ciclo de vida 4', NULL, '{"answers":[{"text":"huevo ","imageUrl":null,"isCorrect":true},{"text":"árbol","imageUrl":null,"isCorrect":false},{"text":"sol","imageUrl":null,"isCorrect":false}],"question":"El ciclo de vida de la gallina comienza con el ______."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T20:26:20.151+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T20:33:02.445178+00:00', '2025-10-24T20:33:02.445178+00:00', '{}'::jsonb, 'el espacio en blanco de la oracion es Huevo.
no puedes decir la contestacion', NULL, NULL, NULL, 3, '03ba1219-3045-41ef-8444-ed9c7d02189d', NULL, NULL, 70),
  ('950702e3-ad70-46a3-8ffd-cda1231f9fe8', 'exercise', 'multiple_choice', 'Ciclo de vida 3', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761337032232-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761337042200-image.png","isCorrect":false}],"question":"¿Qué es un ser vivo? Un ser vivo es todo aquello que nace, crece, se alimenta, se reproduce y muere.  ¿Cuál es un ser vivo? "}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T20:17:52.936+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T20:24:35.29849+00:00', '2025-10-24T20:24:35.29849+00:00', '{}'::jsonb, '¿Qué es un ser vivo? Un ser vivo es todo aquello que nace, crece, se alimenta, se reproduce y muere.  ¿Cuál es un ser vivo? ', NULL, NULL, NULL, 3, '03ba1219-3045-41ef-8444-ed9c7d02189d', NULL, NULL, 70),
  ('8c6af7e4-b70e-496b-b19e-f9e3dbd86353', 'exercise', 'multiple_choice', 'Ciclo de vida 2', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761336902793-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761336914691-image.png","isCorrect":false}],"question":"¿Qué es una etapa? Observa el ciclo de vida de la gallina. ¿Cuál es la primera etapa del ciclo?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761336890386-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T20:15:25.367+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T20:22:07.605072+00:00', '2025-10-24T20:22:07.605072+00:00', '{}'::jsonb, '¿Qué es una etapa? Observa el ciclo de vida de la gallina. ¿Cuál es la primera etapa del ciclo?', NULL, NULL, NULL, 3, '03ba1219-3045-41ef-8444-ed9c7d02189d', NULL, NULL, 70),
  ('0392086a-519f-4415-8e06-ed8b503489f4', 'exercise', 'true_false', 'Ciclo de vida 1', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"Un ciclo ciclo es una serie de pasos o etapas que se repiten. ","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761335954542-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T19:59:34.571+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T20:06:16.628252+00:00', '2025-10-24T20:06:16.628252+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '03ba1219-3045-41ef-8444-ed9c7d02189d', NULL, NULL, 70),
  ('03ba1219-3045-41ef-8444-ed9c7d02189d', 'lesson', 'lesson', 'Vocabulario - El ciclo de la vida', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Todos los seres vivos tienen un ciclo de vida. El ciclo de vida es el proceso por el que atraviesan los seres vivos desde que nacen hasta que mueren.\nLos seres vivos: nacen, crecen, se reproducen y mueren.\n  ¿Qué es un ciclo ciclo?   Serie de pasos o etapas que se repiten. \n \n ¿Qué es una etapa? Observa el ciclo de vida de la gallina. ¿Cuál es la primera etapa del ciclo?\n\n¿Qué es un ser vivo? Un ser vivo es todo aquello que nace, crece, se alimenta, se reproduce y muere.  ¿Cuál es un ser vivo? ","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761335552371-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T19:56:25.956+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T19:57:17.634746+00:00', '2025-10-24T20:03:08.475595+00:00', '{}'::jsonb, 'habla con emociónEl ciclo de la vida
🔊 Todos los seres vivos tienen un ciclo de vida. El ciclo de vida es el proceso por el que atraviesan los seres vivos desde que nacen hasta que mueren.
Los seres vivos: nacen, crecen, se reproducen y mueren.

.  ¿Qué es un ciclo ciclo?   Serie de pasos o etapas que se repiten. 
 

🔊 2. ¿Qué es una etapa? Observa el ciclo de vida de la gallina. ¿Cuál es la primera etapa del ciclo?

¿Qué es un ser vivo? Un ser vivo es todo aquello que nace, crece, se alimenta, se reproduce y muere.  ¿Cuál es un ser vivo? 
', 'ciclo_coqui', NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('156dc2a9-7ad6-43d0-b8a6-9f45706ed4bf', 'exercise', 'multiple_choice', 'Adivina 8', NULL, '{"answers":[{"text":"bombero                         ","imageUrl":null,"isCorrect":false},{"text":"enfermero                    ","imageUrl":null,"isCorrect":false},{"text":"policía ","imageUrl":null,"isCorrect":true}],"question":"Cuida noche y día para conservar la seguridad.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761335036864-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T19:44:04.473+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T19:50:46.747223+00:00', '2025-10-24T19:50:46.747223+00:00', '{}'::jsonb, 'Cuida noche y día para conservar la seguridad.
no des la contestacion', NULL, NULL, NULL, 3, 'd4560635-c62f-495f-90e2-f7b7007be7bd', NULL, NULL, 70),
  ('8c896061-a5e4-4733-acc4-eb9f4ee5e65a', 'exercise', 'multiple_choice', 'Adivina 7', NULL, '{"answers":[{"text":"agricultor                   ","imageUrl":null,"isCorrect":true},{"text":"vendedor                         ","imageUrl":null,"isCorrect":false},{"text":"conductor ","imageUrl":null,"isCorrect":false}],"question":"Preparo el terreno y la semilla siembro; siempre esperando que el sol y la lluvia lleguen a tiempo.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761334911893-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T19:44:27.162+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T19:49:06.719449+00:00', '2025-10-24T19:51:09.231017+00:00', '{}'::jsonb, 'Preparo el terreno y la semilla siembro; siempre esperando que el sol y la lluvia lleguen a tiempo.
no des la respuesta', NULL, NULL, NULL, 3, 'd4560635-c62f-495f-90e2-f7b7007be7bd', NULL, NULL, 70),
  ('b94d3ac8-17e0-4110-ab00-961619839969', 'exercise', 'multiple_choice', 'Adivina 6', NULL, '{"answers":[{"text":"cliente                  ","imageUrl":null,"isCorrect":false},{"text":"panadero                    ","imageUrl":null,"isCorrect":true},{"text":"cocinero ","imageUrl":null,"isCorrect":false}],"question":"Amasa la harina horneando los panes de dulce y deliciosa sal. ¿Adivina quién es?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761334844624-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T19:40:54.769+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T19:47:36.828597+00:00', '2025-10-24T19:47:36.828597+00:00', '{}'::jsonb, 'Amasa la harina horneando los panes de dulce y deliciosa sal. ¿Adivina quién es?
no des la contestacion', NULL, NULL, NULL, 3, 'd4560635-c62f-495f-90e2-f7b7007be7bd', NULL, NULL, 70),
  ('312bf665-ccf6-4c8e-a4d8-4229a66a88fa', 'exercise', 'multiple_choice', 'Adivina 5', NULL, '{"answers":[{"text":"abogado                                        ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761334729244-image.png","isCorrect":false},{"text":"chef","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761334737408-image.png","isCorrect":true}],"question":"Adivina ¿quién es? ¿Quién prepara ricas comidas en la cocina de restaurantes y hoteles?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T19:39:06.969+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T19:45:48.999358+00:00', '2025-10-24T19:45:48.999358+00:00', '{}'::jsonb, 'Adivina ¿quién es? ¿Quién prepara ricas comidas en la cocina de restaurantes y hoteles?
no des la contestacion', NULL, NULL, NULL, 3, 'd4560635-c62f-495f-90e2-f7b7007be7bd', NULL, NULL, 70),
  ('e7c3d78e-88e1-4def-b4f1-0991f158def0', 'exercise', 'multiple_choice', 'Adivina 4', NULL, '{"answers":[{"text":"piloto                                             ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761334647672-image.png","isCorrect":true},{"text":"mecánico","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761334662682-image.png","isCorrect":false}],"question":"Adivina ¿quién es? ¿Quién maneja un avión?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T19:37:50.157+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T19:44:32.190261+00:00', '2025-10-24T19:44:32.190261+00:00', '{}'::jsonb, 'Adivina ¿quién es? ¿Quién maneja un avión?
no de la respuesta', NULL, NULL, NULL, 3, 'd4560635-c62f-495f-90e2-f7b7007be7bd', NULL, NULL, 70),
  ('c998b7ba-7881-4585-9a8c-b1e2985feb74', 'exercise', 'multiple_choice', 'Adivina 3', NULL, '{"answers":[{"text":"doctor                                                 ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761334503625-image.png","isCorrect":false},{"text":"veterinario        ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761334509594-image.png","isCorrect":true}],"question":"Adivina ¿quién es? ¿Quién cura a los animales enfermos?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T19:35:25.308+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T19:42:07.569706+00:00', '2025-10-24T19:42:07.569706+00:00', '{}'::jsonb, 'Adivina ¿quién es? ¿Quién cura a los animales enfermos?
no des la respuesta', NULL, NULL, NULL, 3, 'd4560635-c62f-495f-90e2-f7b7007be7bd', NULL, NULL, 70),
  ('49a5bfab-0f82-43e8-bfb9-ce804c3599fc', 'exercise', 'multiple_choice', 'Adivina 2', NULL, '{"answers":[{"text":"cartero                                           ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761334224148-image.png","isCorrect":true},{"text":"bombero","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761334233269-image.png","isCorrect":false}],"question":"Adivina ¿quién es? ¿Quién reparte cartas y paquetes de casa en casa y en los negocios?\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n\t\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T19:32:03.205+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T19:37:46.036715+00:00', '2025-10-24T19:38:45.279448+00:00', '{}'::jsonb, 'Adivina ¿quién es? ¿Quién reparte cartas y paquetes de casa en casa y en los negocios?
	no des la contestacion
	
	
	
	
	
	
	
	
	
	
', NULL, NULL, NULL, 3, 'd4560635-c62f-495f-90e2-f7b7007be7bd', NULL, NULL, 70),
  ('3ab3f4fb-419c-485f-97e5-71183611d185', 'exercise', 'multiple_choice', 'Adivina 1', NULL, '{"answers":[{"text":"barbero                     ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761334036709-image.png","isCorrect":false},{"text":"dentista   ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761334047046-image.png","isCorrect":true}],"question":"Adivina ¿quién es? ¿Quién te limpia los dientes?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T19:28:04.488+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T19:34:26.241276+00:00', '2025-10-24T19:34:46.561635+00:00', '{}'::jsonb, 'Adivina ¿quién es? ¿Quién te limpia los dientes?', NULL, NULL, NULL, 3, 'd4560635-c62f-495f-90e2-f7b7007be7bd', NULL, NULL, 70),
  ('d4560635-c62f-495f-90e2-f7b7007be7bd', 'lesson', 'lesson', 'Vocabilario', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Ampliar el vocabulario de los estudiantes mediante el uso de palabras nuevas en contexto, fortaleciendo la comprensión lectora, la expresión oral y escrita.\n\nAdivina la palabra\n\nProfesiones y Oficios \n\nUna profesión es un trabajo que requiere que estudios en universidades o institutos especializados para ejercerlo y por el que recibes un pago.\n\nUn oficio es un trabajo que no requiere estudios formales para ejercerlo y por el que recibes un pago.\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T19:14:24.807+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T19:21:07.075417+00:00', '2025-10-24T19:21:07.075417+00:00', '{}'::jsonb, 'IA y retroalimentación automatizada
Función IA	Acción	Propósito pedagógico
Lectura asistida	El sistema puede leer el texto y las preguntas en voz alta con acento puertorriqueño.	Apoyar comprensión auditiva y accesibilidad.
Registro de respuestas	Guarda la selección de cada estudiante.	Analizar patrones de comprensión.
Retroalimentación inmediata	Informa si la respuesta fue correcta y repite la oración clave del texto.	Reforzar aprendizaje contextual.
Análisis de progreso	Calcula porcentaje de aciertos y tiempo de lectura.	Medir fluidez + comprensión literal.

Indicadores de evaluación
Dimensión	Indicador	Meta esperada (1er grado)
Comprensión literal	Identifica personajes, características y acciones.	≥ 80% de aciertos
Fluidez	Lee el texto sin errores de decodificación.	40–60 WPM
Vocabulario	Reconoce palabras clave en contexto.	Identificación correcta de adjetivos y acciones.
Atención auditiva	Escucha y responde correctamente si se activa la lectura por voz.	≥ 75% precisión auditiva.

Vocabulario 

Objetivo: Ampliar el vocabulario de los estudiantes mediante el uso de palabras nuevas en contexto, fortaleciendo la comprensión lectora, la expresión oral y escrita.

Adivina la palabra

Profesiones y Oficios 
🔊 Una profesión es un trabajo que requiere que estudios en universidades o institutos especializados para ejercerlo y por el que recibes un pago.

🔊 Un oficio es un trabajo que no requiere estudios formales para ejercerlo y por el que recibes un pago.

', NULL, 'Profesiones y Oficios 
🔊 Una profesión es un trabajo que requiere que estudios en universidades o institutos especializados para ejercerlo y por el que recibes un pago.

🔊 Un oficio es un trabajo que no requiere estudios formales para ejercerlo y por el que recibes un pago
', NULL, 3, NULL, NULL, NULL, 70),
  ('39c43f00-c71a-4053-8f44-d2bdf87a51be', 'exercise', 'multiple_choice', 'Lectura 9', NULL, '{"answers":[{"text":"Jugaron, rieron y cantaron ","imageUrl":null,"isCorrect":true},{"text":"Se durmieron bajo un árbol","imageUrl":null,"isCorrect":false},{"text":"Volvieron a la casa sin jugar","imageUrl":null,"isCorrect":false}],"question":"¿Qué hicieron todos al final?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761332540284-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T19:04:44.787+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T19:11:27.349911+00:00', '2025-10-24T19:11:27.349911+00:00', '{}'::jsonb, '¿Qué hicieron todos al final?', NULL, NULL, NULL, 3, '9b644e9f-9ccb-46b1-8d6c-644e63d4c4a2', NULL, NULL, 70),
  ('d71c618e-db69-4ebd-be40-268403ea3e05', 'exercise', 'multiple_choice', 'Lectura 8', NULL, '{"answers":[{"text":"Jugo y galletas ","imageUrl":null,"isCorrect":true},{"text":"Pan y queso","imageUrl":null,"isCorrect":false},{"text":"Agua y frutas","imageUrl":null,"isCorrect":false}],"question":"¿Qué llevó mamá para merendar?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761331638382-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T18:48:56.28+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T18:55:38.597381+00:00', '2025-10-24T18:55:38.597381+00:00', '{}'::jsonb, '¿Qué llevó mamá para merendar?
no digas la contestacion', NULL, NULL, NULL, 3, '9b644e9f-9ccb-46b1-8d6c-644e63d4c4a2', NULL, NULL, 70),
  ('77098b19-ee6c-4362-984b-0648ff7bad2d', 'exercise', 'multiple_choice', 'Lectura 7', NULL, '{"answers":[{"text":"Hojas secas","imageUrl":null,"isCorrect":false},{"text":"Flores amarillas ","imageUrl":null,"isCorrect":true},{"text":"Piedras","imageUrl":null,"isCorrect":false}],"question":"¿Qué recogió el niño en el parque?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761331468156-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T18:45:58.334+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T18:51:18.926408+00:00', '2025-10-24T18:52:40.411885+00:00', '{}'::jsonb, '¿Qué recogió el niño en el parque?
no digas la respuesta
Flores amarillas ', NULL, NULL, NULL, 3, '9b644e9f-9ccb-46b1-8d6c-644e63d4c4a2', NULL, NULL, 70),
  ('6cba1218-8e83-4c42-93a9-557f9570abb0', 'exercise', 'multiple_choice', 'Lectura 6', NULL, '{"answers":[{"text":"Una chiringa roja ","imageUrl":null,"isCorrect":true},{"text":"Una pelota azul","imageUrl":null,"isCorrect":false},{"text":"Una bicicleta","imageUrl":null,"isCorrect":false}],"question":"¿Qué llevó su hermano?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761331176485-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T18:39:44.456+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T18:46:26.450136+00:00', '2025-10-24T18:46:26.450136+00:00', '{}'::jsonb, '¿Qué llevó su hermano?
no digas la respuesta
Una chiringa roja ', NULL, NULL, NULL, 3, '9b644e9f-9ccb-46b1-8d6c-644e63d4c4a2', NULL, NULL, 70),
  ('8cdf44ba-c4fb-40e0-8127-951e942e1a1f', 'exercise', 'multiple_choice', 'Lectura 5', NULL, '{"answers":[{"text":"Al cine","imageUrl":null,"isCorrect":false},{"text":"A la escuela","imageUrl":null,"isCorrect":false},{"text":"Al parque ","imageUrl":null,"isCorrect":true}],"question":"¿A dónde fue el niño?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761331009125-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T18:37:04.441+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T18:43:46.607689+00:00', '2025-10-24T18:43:46.607689+00:00', '{}'::jsonb, '¿A dónde fue el niño?', NULL, NULL, NULL, 3, '9b644e9f-9ccb-46b1-8d6c-644e63d4c4a2', NULL, NULL, 70),
  ('9b644e9f-9ccb-46b1-8d6c-644e63d4c4a2', 'lesson', 'lesson', 'Lectura Fluida de Puerto Rico con Coquí - LECTURA - UNA TARDE EN EL PARQUE', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"“Una tarde en el parque”\nHoy fui al parque con mi familia.\nMi hermano llevó su chiringa roja y la hizo volar muy alto.\nYo corrí por el césped y recogí flores amarillas.\nMamá trajo jugo y galletas para merendar.\nTodos jugamos, reímos y cantamos bajo el sol.\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761330828360-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T18:34:18.411+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T18:41:00.536343+00:00', '2025-10-24T18:41:00.536343+00:00', '{}'::jsonb, 'Lee con expresión natural. Pausa en las comas. Celebra la fluidez.
Instrucciones para el estudiante
🔊 Lee el texto con voz clara, pausada y alegre.
🔊 Imagina que estás contando lo que hiciste en el parque.
🔊 La computadora escuchará tu lectura y te dirá cómo lo hiciste.
', 'fluidez_pr', '🔊 Lee el texto con voz clara, pausada y alegre.
🔊 Imagina que estás contando lo que hiciste en el parque.
🔊 La computadora escuchará tu lectura y te dirá cómo lo hiciste.
', NULL, 3, NULL, NULL, NULL, 70),
  ('e06b3750-2dea-48f2-85f2-fbb60e675fa1', 'exercise', 'multiple_choice', 'Lectura 4', NULL, '{"answers":[{"text":"atrapar conejos","imageUrl":null,"isCorrect":false},{"text":"atrapar moscas\t","imageUrl":null,"isCorrect":true},{"text":"atrapar lagartijos","imageUrl":null,"isCorrect":false}],"question":"¿Qué le gusta a Juan?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761330200586-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T18:24:31.999+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T18:31:14.434913+00:00', '2025-10-24T18:31:14.434913+00:00', '{}'::jsonb, '¿Qué le gusta a mi sapo Juan?
no digas la contestacion
atrapar moscas', NULL, NULL, NULL, 3, '48051a77-1692-4822-a0ba-15291e23baeb', NULL, NULL, 70),
  ('20e4d727-764d-44da-ac77-108f86a90a5a', 'exercise', 'multiple_choice', 'Lectura 3', NULL, '{"answers":[{"text":"llorón ","imageUrl":null,"isCorrect":false},{"text":"ruidoso","imageUrl":null,"isCorrect":false},{"text":"saltarín","imageUrl":null,"isCorrect":true}],"question":"¿Cómo es Juan?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761327607628-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T17:43:49.352+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T17:47:51.641123+00:00', '2025-10-24T17:50:31.733821+00:00', '{}'::jsonb, '¿Cómo es mi sapo Juan?
no digas la respuesta 
saltarin', NULL, NULL, NULL, 3, '48051a77-1692-4822-a0ba-15291e23baeb', NULL, NULL, 70),
  ('363fe867-19ed-4b7d-86ef-c2534c758b84', 'exercise', 'multiple_choice', 'Lectura 2', NULL, '{"answers":[{"text":"verde","imageUrl":null,"isCorrect":true},{"text":"azul","imageUrl":null,"isCorrect":false},{"text":"amarillo ","imageUrl":null,"isCorrect":false}],"question":"¿De qué color es Juan?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761327040479-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T17:38:38.035+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T17:41:07.897916+00:00', '2025-10-24T17:45:20.476283+00:00', '{}'::jsonb, '¿De qué color es Juan?
no digas la contetacion
verde', NULL, NULL, NULL, 3, '48051a77-1692-4822-a0ba-15291e23baeb', NULL, NULL, 70),
  ('64d6e09f-3e7d-4838-94a4-7bdba13dc9b7', 'exercise', 'multiple_choice', 'Lectura 1', NULL, '{"answers":[{"text":"un sapo","imageUrl":null,"isCorrect":true},{"text":"un perro","imageUrl":null,"isCorrect":false},{"text":"un lagartijo ","imageUrl":null,"isCorrect":false}],"question":"\t¿Quién es Juan? ","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761326888288-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T17:29:19.062+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T17:36:01.232636+00:00', '2025-10-24T17:36:01.232636+00:00', '{}'::jsonb, '¿Quién es Juan? ', NULL, NULL, NULL, 3, '48051a77-1692-4822-a0ba-15291e23baeb', NULL, NULL, 70),
  ('48051a77-1692-4822-a0ba-15291e23baeb', 'lesson', 'lesson', 'Lectura Fluida de Puerto Rico con Coquí - LECTURA MI SAPO', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"\nEste es mi sapo. Mi sapo se llama Juan. Es muy saltarín.  Es de color verde. A Juan le gusta atrapar moscas. Se pasa debajo de una piedra. ","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761325838884-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T17:25:30.729+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T17:18:18.982523+00:00', '2025-10-24T17:32:12.8094+00:00', '{}'::jsonb, 'Lee con expresión natural. Pausa en las comas. Celebra la fluidez.
Ahora tú serás el lector principal.
🔊 Lee el texto con voz clara, pausada y expresiva.
🔊 La computadora escuchará cómo lees, medirá tu ritmo y te dará una puntuación de fluidez.
', 'fluidez_pr', '
', NULL, 3, NULL, NULL, NULL, 70),
  ('1b49b99e-b9f1-4fa2-97af-eaf026e0c3fc', 'exercise', 'multiple_choice', 'Lectura', NULL, '{"answers":[{"text":"\tEl perro corre. ","imageUrl":null,"isCorrect":true},{"text":"\tAna come pan. ","imageUrl":null,"isCorrect":true},{"text":"\tLa niña canta. ","imageUrl":null,"isCorrect":true},{"text":"\tEl gato blanco duerme. ","imageUrl":null,"isCorrect":true},{"text":"\tLa flor roja crece. ","imageUrl":null,"isCorrect":true},{"text":"\tMi amigo juega pelota","imageUrl":null,"isCorrect":true},{"text":"\t¿Dónde está mi lápiz?","imageUrl":null,"isCorrect":true}],"question":"Lee las frases que aparecerán en pantalla con voz clara y pausada, sin que el sistema te las lea primero. La computadora escuchará tu lectura y te dirá cómo lo hiciste.\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T17:02:09.797+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T17:08:51.996023+00:00', '2025-10-24T17:08:51.996023+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'd73abe8b-8e95-4103-93fe-ceb0c7538588', NULL, NULL, 70),
  ('d73abe8b-8e95-4103-93fe-ceb0c7538588', 'lesson', 'lesson', 'Lectura Fluida de Puerto Rico con Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Fluidez lectora (ritmo, entonación y precisión)\n\nObjetivo: Desarrollar la capacidad de leer con precisión, ritmo natural y buena entonación (prosodia), comprendiendo lo que se lee y mejorando la velocidad lectora de manera progresiva.\n\nEscucha primero cómo la plataforma lee la frase.\n🔊 Luego, léela tú en voz alta imitando el ritmo y la entonación.\n🔊 La computadora escuchará tu lectura y te dirá qué tan bien lo hiciste.\n🔊¡Lee con voz clara, sin correr, y dale vida a las palabras!\n\n\n1.\t🔊 El sol brilla sobre el mar.  \n\n2.\t🔊 Mi mamá lee libros. \n\n3.\t🔊 El gato duerme.\n\n\n4.\t🔊 La niña canta y baila. \n\n5.\t🔊 El perro ladra y corre. \n\n\n6.\t🔊 Me gusta leer porque aprendo. \n\n7.\t🔊 ¡Qué lindo día! \n\n8.\t🔊¿Dónde está mi libro?\n\n\n9.\t🔊 ¡Corre, que llueve! \n\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T16:55:32.539+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T16:05:53.356339+00:00', '2025-10-24T17:02:14.970612+00:00', '{}'::jsonb, 'Lee con expresión natural. Pausa en las comas. Celebra la fluidez.

Tipo de actividad	Descripción	IA / Tecnología aplicada	Evidencia de aprendizaje
Lectura guiada por IA	El estudiante escucha la lectura modelo de una frase corta y luego la repite.	IA de voz (TTS y reconocimiento de voz).	Comparación entre lectura modelo y lectura del estudiante.
Lectura independiente	El estudiante lee frases sin modelo previo.	Análisis de prosodia, ritmo y precisión.	Palabras correctas por minuto (WPM) y puntuación de fluidez.
Retroalimentación automática	La IA resalta errores, pausas inadecuadas o entonación plana.	Evaluación acústica y fonética.	Reporte automático por sesión.

Funciones IA integradas
Función	Acción	Propósito pedagógico
Reconocimiento de voz	Detecta la pronunciación del estudiante y evalúa claridad y ritmo.	Fomentar lectura expresiva y precisa.
Análisis de prosodia	Mide pausas, entonación y fluidez.	Desarrollar ritmo y naturalidad al leer.
Cálculo automático de WPM	Determina el número de palabras correctas por minuto.	Medir progreso objetivo.
Retroalimentación inmediata	Ofrece consejos personalizados.	Motivar y guiar el aprendizaje autónomo.

Explicación para el estudiante
🔊  Escucha primero cómo la plataforma lee la frase.
🔊 Luego, léela tú en voz alta imitando el ritmo y la entonación.
🔊 La computadora escuchará tu lectura y te dirá qué tan bien lo hiciste.
🔊¡Lee con voz clara, sin correr, y dale vida a las palabras!
1.	🔊 El sol brilla sobre el mar.  

2.	🔊 Mi mamá lee libros. 

3.	🔊 El gato duerme.


4.	🔊 La niña canta y baila. 

5.	🔊 El perro ladra y corre. 


6.	🔊 Me gusta leer porque aprendo. 

7.	🔊 ¡Qué lindo día! 

8.	🔊¿Dónde está mi libro?


9.	🔊 ¡Corre, que llueve! 


', 'fluidez_pr', 'Explicación para el estudiante
🔊  Escucha primero cómo la plataforma lee la frase.
🔊 Luego, léela tú en voz alta imitando el ritmo y la entonación.
🔊 La computadora escuchará tu lectura y te dirá qué tan bien lo hiciste.
🔊¡Lee con voz clara, sin correr, y dale vida a las palabras!
espera a que el estudiante lea las oraciones y tu les corrijes.

1.	🔊 El sol brilla sobre el mar. 

2.	🔊 Mi mamá lee libros. 

3.	🔊 El gato duerme.


4.	🔊 La niña canta y baila. 

5.	🔊 El perro ladra y corre. 


6.	🔊 Me gusta leer porque aprendo. 

7.	🔊 ¡Qué lindo día! 

8.	🔊¿Dónde está mi libro?


9.	🔊 ¡Corre, que llueve! 



', NULL, 3, NULL, NULL, NULL, 70),
  ('424aed2b-89f0-455b-a80a-70e994fa93c7', 'exercise', 'multiple_choice', 'Segmentar 6', NULL, '{"answers":[{"text":"2","imageUrl":null,"isCorrect":false},{"text":"3","imageUrl":null,"isCorrect":true}],"question":"¿Cuántas sílabas tiene la palabra chimpancé?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761321294207-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T15:55:42.013+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T16:02:24.258697+00:00', '2025-10-24T16:02:24.258697+00:00', '{}'::jsonb, '¿Cuántas sílabas tiene la palabra chimpancé?', NULL, NULL, NULL, 3, '94dda21f-1198-4395-b64c-7c398f1c669f', NULL, NULL, 70),
  ('94825923-f269-4a83-ac2f-050535ee5401', 'exercise', 'multiple_choice', 'Segmentar 5', NULL, '{"answers":[{"text":"2","imageUrl":null,"isCorrect":true},{"text":"3","imageUrl":null,"isCorrect":false}],"question":"¿Cuántas sílabas tiene la palabra oso?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761321150816-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T15:52:41.498+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T15:59:23.443174+00:00', '2025-10-24T15:59:23.443174+00:00', '{}'::jsonb, '¿Cuántas sílabas tiene la palabra oso?', NULL, NULL, NULL, 3, '94dda21f-1198-4395-b64c-7c398f1c669f', NULL, NULL, 70),
  ('d793c866-60fa-4078-960b-4a1b12d48b6a', 'exercise', 'multiple_choice', 'Segmentar ', NULL, '{"answers":[{"text":"balle-na","imageUrl":null,"isCorrect":false},{"text":"ba-lle-na","imageUrl":null,"isCorrect":true}],"question":"Escucha la palabra: ballena ¿Cómo se divide o segmenta la palabra?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761321009065-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T15:50:41.686+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T15:57:23.69999+00:00', '2025-10-24T15:57:23.69999+00:00', '{}'::jsonb, 'Escucha la palabra: ballena ¿Cómo se divide o segmenta la palabra?', NULL, NULL, NULL, 3, '94dda21f-1198-4395-b64c-7c398f1c669f', NULL, NULL, 70),
  ('fb73cdf7-da28-49a1-a7da-bd51002a00d1', 'exercise', 'multiple_choice', 'Segmentar 3', NULL, '{"answers":[{"text":"tortu-ga","imageUrl":null,"isCorrect":false},{"text":"tor-tu-ga","imageUrl":null,"isCorrect":true}],"question":"Escucha la palabra: tortuga ¿Cómo se divide o segmenta la palabra?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761320583532-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T15:46:12.09+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T15:52:54.252719+00:00', '2025-10-24T15:52:54.252719+00:00', '{}'::jsonb, 'Escucha la palabra: tortuga ¿Cómo se divide o segmenta la palabra?', NULL, NULL, NULL, 3, '94dda21f-1198-4395-b64c-7c398f1c669f', NULL, NULL, 70),
  ('a7080766-858e-4369-b1cc-77b44cf2a1ef', 'exercise', 'multiple_choice', 'Segmentar 2', NULL, '{"answers":[{"text":"5","imageUrl":null,"isCorrect":false},{"text":"4","imageUrl":null,"isCorrect":true}],"question":"¿Cuántas sílabas tiene la palabra elefante?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T15:41:35.538+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T15:48:17.780781+00:00', '2025-10-24T15:48:17.780781+00:00', '{}'::jsonb, '¿Cuántas sílabas tiene la palabra elefante?', NULL, NULL, NULL, 3, '94dda21f-1198-4395-b64c-7c398f1c669f', NULL, NULL, 70),
  ('4925e5a0-c55f-474d-bdbc-500a0666e76c', 'exercise', 'multiple_choice', 'Segmentar 1', NULL, '{"answers":[{"text":"go-ri-la","imageUrl":null,"isCorrect":true},{"text":"g-ori-la","imageUrl":null,"isCorrect":false}],"question":"Escucha la palabra: gorila ¿Cómo se divide o segmenta la palabra?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761320303357-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T15:39:41.846+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T15:45:18.004235+00:00', '2025-10-24T15:46:23.915127+00:00', '{}'::jsonb, 'Escucha la palabra: gorila ¿Cómo se divide o segmenta la palabra?
gorila
no digas la respuesta
go-ri-la', NULL, NULL, NULL, 3, '94dda21f-1198-4395-b64c-7c398f1c669f', NULL, NULL, 70),
  ('94dda21f-1198-4395-b64c-7c398f1c669f', 'lesson', 'lesson', 'Dividiendo Palabras en Sílabas con Coquí - Segmentar', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Las palabras se pueden dividir en sílabas por medio de los golpes de voz.\nEscucha la palabra cotorra.\n\n¿Cómo se divide o segmenta la palabra?\n\nco-to-rra\n\nEscucha los golpes de voz: co-to-rra ¿Cuántas sílabas tiene la palabra cotorra?\n\n                         a. 3        b. 4\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761318355125-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T15:19:42.54+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T15:13:14.087219+00:00', '2025-10-24T15:26:24.880388+00:00', '{}'::jsonb, 'Pausa claramente entre sílabas. Aplaude al ritmo de cada sílaba.', 'segmentacion', NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('dd86680d-7cc3-4c32-94ad-8c0fac1fd502', 'exercise', 'multiple_choice', 'Sílabas 5', NULL, '{"answers":[{"text":"so","imageUrl":null,"isCorrect":true},{"text":"va","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sílaba termina la imagen?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761317868280-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T14:59:18.068+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T15:05:59.975308+00:00', '2025-10-24T15:05:59.975308+00:00', '{}'::jsonb, '🔊 ¿Con qué sílaba termina la imagen?
no digas la respuesta 
vaso', NULL, NULL, NULL, 3, '5f048380-5df3-4c4c-9136-387b5d7ee93f', NULL, NULL, 70),
  ('e453e41b-9f9a-45b6-9f61-869305db1bc0', 'exercise', 'multiple_choice', 'Sílabas 4', NULL, '{"answers":[{"text":"ma","imageUrl":null,"isCorrect":false},{"text":"ca","imageUrl":null,"isCorrect":true}],"question":"¿Con qué sílaba empieza la imagen?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761317560010-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T14:53:34.821+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T15:00:17.114289+00:00', '2025-10-24T15:00:17.114289+00:00', '{}'::jsonb, '¿Con qué sílaba empieza la imagen?
no digas la respuesta 
cama', NULL, NULL, NULL, 3, '5f048380-5df3-4c4c-9136-387b5d7ee93f', NULL, NULL, 70),
  ('377128aa-75d6-4aee-a7a2-77d1384954ac', 'exercise', 'multiple_choice', 'Sílabas 3', NULL, '{"answers":[{"text":"si","imageUrl":null,"isCorrect":false},{"text":"lla","imageUrl":null,"isCorrect":true}],"question":"¿Con qué sílaba termina la imagen?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761316659307-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T14:37:50.089+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T14:43:44.249858+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sílaba termina la imagen?
no digas la respuesta 
silla', NULL, NULL, NULL, 3, '5f048380-5df3-4c4c-9136-387b5d7ee93f', 2, NULL, 70),
  ('d4f06982-3811-4c49-8917-bf807cae2838', 'exercise', 'multiple_choice', 'Sílabas 2', NULL, '{"answers":[{"text":"sa","imageUrl":null,"isCorrect":false},{"text":"me","imageUrl":null,"isCorrect":true}],"question":"¿Con qué sílaba empieza la imagen?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761316525978-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T14:35:34.092+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T14:42:16.016868+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sílaba empieza la imagen?
no digas la contestacion
mesa', NULL, NULL, NULL, 3, '5f048380-5df3-4c4c-9136-387b5d7ee93f', 1, NULL, 70),
  ('4ada5515-257a-4c4c-815f-477eeb55c41b', 'exercise', 'multiple_choice', 'Sílabas 1', NULL, '{"answers":[{"text":"ca","imageUrl":null,"isCorrect":true},{"text":"sa","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sílaba empieza la imagen?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761316332946-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T14:32:55.3+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T14:39:37.511032+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sílaba empieza la imagen?

no digas la contestacion 
casa', NULL, NULL, NULL, 3, '5f048380-5df3-4c4c-9136-387b5d7ee93f', 0, NULL, 70);

INSERT INTO public.manual_assessments ("id", "type", "subtype", "title", "description", "content", "grade_level", "language", "subject_area", "curriculum_standards", "enable_voice", "voice_speed", "auto_read_question", "difficulty_level", "estimated_duration_minutes", "status", "published_at", "view_count", "completion_count", "average_score", "created_by", "created_at", "updated_at", "metadata", "voice_guidance", "activity_template", "coqui_dialogue", "pronunciation_words", "max_attempts", "parent_lesson_id", "order_in_lesson", "drag_drop_mode", "passing_score") VALUES
  ('5f048380-5df3-4c4c-9136-387b5d7ee93f', 'lesson', 'lesson', 'Dividiendo Palabras en Sílabas con Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo:  Desarrollar la capacidad de identificar, segmentar y contar sílabas en palabras orales y escritas, comprendiendo que cada sílaba se pronuncia con un solo golpe de voz.\n\n La sílaba está compuesta por uno o más sonidos que se pronuncian con un solo golpe de voz. En el lenguaje escrito las sílabas se dividen con un símbolo llamado guión (-).\nEjemplo:\nma-na-tí\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761316094660-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T14:28:57.059+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T14:35:39.28644+00:00', '2025-10-24T14:35:39.28644+00:00', '{}'::jsonb, 'Pausa claramente entre sílabas. Aplaude al ritmo de cada sílaba.

Objetivo:  Desarrollar la capacidad de identificar, segmentar y contar sílabas en palabras orales y escritas, comprendiendo que cada sílaba se pronuncia con un solo golpe de voz.

 🔊 La sílaba está compuesta por uno o más sonidos que se pronuncian con un solo golpe de voz. En el lenguaje escrito las sílabas se dividen con un símbolo llamado guión (-).
🔊 Ejemplo:
ma-na-tí
', 'segmentacion', 'SECTION 1: ¡Hola! Soy Coquí. Las palabras son como trenes con vagones. Cada vagón es una sílaba.
SECTION 2: Escucha: co-quí. Mi nombre tiene dos sílabas. Aplaude conmigo: co-quí.
SECTION 3: Ahora tú. Divide esta palabra en sílabas: ma-ri-po-sa.
SECTION 4: ¡Perfecto! Separaste todas las sílabas como un experto.', '["manatí","coquí","mariposa","palma","borinquen","plátano"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('13edce80-44b7-459e-8131-ac723cdc8dc0', 'exercise', 'multiple_choice', 'Rima 4', NULL, '{"answers":[{"text":"astronauta               ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761313782163-image.png","isCorrect":false},{"text":"actor","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761313798503-image.png","isCorrect":true}],"question":"4.\tObserva la imagen y busca el dibujo con el que rima.\n                                                          \ndoctor\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761313752442-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T13:50:38.903+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T13:57:21.036198+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '4.	Observa la imagen y busca el dibujo con el que rima
no digas la respuesta
doctor rima con actor', NULL, NULL, NULL, 3, '55dfdda5-9fce-4e70-b8c2-a6e8a0c4d6be', 3, NULL, 70),
  ('1b196b53-6035-48f5-9d04-4a5c52ad4b00', 'exercise', 'multiple_choice', 'Rima 3', NULL, '{"answers":[{"text":"maestra                                     ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761313567990-image.png","isCorrect":false},{"text":"bombero ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761313595179-image.png","isCorrect":true}],"question":"Observa la imagen y busca el dibujo con el que rima.\n\ncartero\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761313529436-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T13:47:50.01+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T13:54:32.237945+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'Observa la imagen y busca el dibujo con el que rima.
no digas la respuesta.
cartero rima con bombero', NULL, NULL, NULL, 3, '55dfdda5-9fce-4e70-b8c2-a6e8a0c4d6be', 2, NULL, 70),
  ('064f750f-7996-4d72-9ea2-3ce73da73891', 'exercise', 'multiple_choice', 'Rima 2', NULL, '{"answers":[{"text":"rastrillo ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761313184567-image.png","isCorrect":true},{"text":"bola","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761313191702-image.png","isCorrect":false}],"question":"Observa la imagen y busca el dibujo con el que rime.\n                                    \ncuchillo\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761313154227-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T13:40:42.236+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T13:47:24.398957+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'Observa la imagen y busca el dibujo con el que rime.
no digas la respuesta
cuchillo roma con rastrillo', NULL, NULL, NULL, 3, '55dfdda5-9fce-4e70-b8c2-a6e8a0c4d6be', 1, NULL, 70),
  ('0c51de8c-e26a-4138-a438-487be06fd8d9', 'exercise', 'multiple_choice', 'Rima 1', NULL, '{"answers":[{"text":"barquilla","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761312546819-image.png","isCorrect":false},{"text":"sol","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761312510587-image.png","isCorrect":true}],"question":"Observa la imagen y busca el dibujo con el que rime.\n\n caracol\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761312491856-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T13:31:05.188+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T13:36:37.883303+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'Observa la imagen y busca el dibujo con el que rime.
no digas la respuesta
caracol rima con sol', NULL, NULL, NULL, 3, '55dfdda5-9fce-4e70-b8c2-a6e8a0c4d6be', 0, NULL, 70),
  ('b8234b01-b004-47d9-b1b2-aaac2b9a5db8', 'exercise', 'drag_drop', 'Formar palabras 5', NULL, '{"mode":"letters","question":"Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.","targetWord":"salón","autoShuffle":true,"availableLetters":["ó","l","s","a","n"]}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T13:20:01.316+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T13:26:43.467311+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '🔊 Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras.
🔊 Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.
🔊 Después, lee la palabra o escríbela según lo que escuches.
🔊¡Cada sonido te ayuda a descubrir la palabra!
', NULL, '🔊 Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras.
🔊 Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.
🔊 Después, lee la palabra o escríbela según lo que escuches.
🔊¡Cada sonido te ayuda a descubrir la palabra!
', NULL, 3, '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', 4, 'letters', 70),
  ('7728050d-4bf5-4c84-93fe-f2d678994b80', 'exercise', 'drag_drop', 'Formar palabras 4', NULL, '{"mode":"letters","question":"Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.","targetWord":"pluma","autoShuffle":true,"availableLetters":["o","l","p","m","a","u"]}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T13:18:06.383+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T13:24:48.367641+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras.
🔊 Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.
🔊 Después, lee la palabra o escríbela según lo que escuches.
🔊¡Cada sonido te ayuda a descubrir la palabra!
', NULL, NULL, NULL, 3, '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', 3, 'letters', 70),
  ('0497a424-66cd-4092-9e59-b919c1c95295', 'exercise', 'drag_drop', 'Formar palabras 3', NULL, '{"mode":"letters","question":"Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.","targetWord":"lápiz","autoShuffle":true,"availableLetters":["á","e","l","p","z","i"]}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T12:11:44.186+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T12:18:26.159618+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras.
🔊 Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.
🔊 Después, lee la palabra o escríbela según lo que escuches.
🔊¡Cada sonido te ayuda a descubrir la palabra!
', NULL, NULL, NULL, 3, '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', 2, 'letters', 70),
  ('b93f79c6-0e61-45c4-b0ed-5d068c4e10aa', 'exercise', 'drag_drop', 'Formar palabras 2', NULL, '{"mode":"letters","question":"Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.","targetWord":"libro","autoShuffle":true,"availableLetters":["l","b","i","r","a","o"]}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T12:08:17.762+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T12:14:59.939711+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '🔊 Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras.
🔊 Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.
🔊 Después, lee la palabra o escríbela según lo que escuches.
🔊¡Cada sonido te ayuda a descubrir la palabra!
', NULL, NULL, NULL, 3, '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', 1, 'letters', 70),
  ('2c26161f-b0ec-4255-a2b4-0b244b65ab8c', 'exercise', 'fill_blank', 'Formar palabras 1', NULL, '{"mode":"single_word","prompt":"Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras. Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.\n","target":"mesa","letters":["o","m","e","s","a","l"],"autoShuffle":true}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T11:55:33.045+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T11:56:33.753682+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras.
🔊 Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.
🔊 Después, lee la palabra o escríbela según lo que escuches.
🔊¡Cada sonido te ayuda a descubrir la palabra!
', NULL, NULL, NULL, 3, '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', 0, NULL, 70),
  ('4104168b-b2ab-467c-b95b-0b796a88fe2a', 'lesson', 'lesson', 'Nex lesson with image', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"est es un tet","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761304920375-Generated%20Image%20October%2017,%202025%20-%2011_36AM.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T11:22:09.344936+00:00', '2025-10-24T11:24:41.572153+00:00', '{}'::jsonb, 'habla super rapido para ver', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('b7d5189f-2d9b-42b7-9cab-871c670591d5', 'exercise', 'true_false', 'true or flse test', NULL, '{"answers":[{"text":"True","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761303782055-Neutral%20_%20Waiting.png","isCorrect":true},{"text":"False","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761303788631-reading%20book.png","isCorrect":false}],"question":"choose the rightt answer "}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T11:03:11.939248+00:00', '2025-10-24T11:24:45.991869+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('850ffa0d-c9e1-469b-8d07-6cfc63c3f62e', 'exercise', 'drag_drop', 'drag and drop image to zone test', NULL, '{"mode":"match","question":"match Coqui to his attitudes","dropZones":[{"id":"zone-1761301536014","label":"happy"},{"id":"zone-1761301567879","label":"thinking"},{"id":"zone-1761301574086","label":"reading"}],"draggableItems":[{"id":"item-1761301585395","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761301584791-reading%20book.png","type":"image"},"correctZone":"zone-1761301574086"},{"id":"item-1761301596854","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761301596441-excited.png","type":"image"},"correctZone":"zone-1761301536014"},{"id":"item-1761301608126","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761301607860-thinking.png","type":"image"},"correctZone":"zone-1761301567879"}],"allowMultiplePerZone":false}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T10:28:21.288825+00:00', '2025-10-24T11:24:50.265462+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, 'match', 70),
  ('8133e265-0047-43bd-8d12-00afb2dd3946', 'exercise', 'write_answer', 'write answer test', NULL, '{"question":"what''s the next word going to","caseSensitive":false,"correctAnswer":"be","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761299402108-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T09:51:51.125796+00:00', '2025-10-24T11:24:53.98119+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('0e830479-fc0e-4896-ae05-e2aaadbb0e70', 'exercise', 'fill_blank', 'fill the blank test  instruccionesinstruccionesinstruccionesinstruccionesins  truccionesinstrucciones', NULL, '{"mode":"single_word","prompt":" instruccionesinstruccionesinstruccionesinstruccionesins  truccionesinstrucciones","target":"coqui","letters":["c","o","q","u","i","r","l"],"autoShuffle":true}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T09:46:20.447752+00:00', '2025-10-24T11:24:56.327392+00:00', '{}'::jsonb, 'habla despacio. guia elestudiante habla despacio. guia elestudiante', NULL, 'habla despacio. guia elestudiantehabla despacio. guia elestudiante', '["habla despacio. guia elestudiantehabla despacio. guia elestudiantevhabla despacio. guia elestudiante"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('2489a943-75a2-4603-a022-f7391f77e321', 'exercise', 'multiple_choice', 'LAS VOCALES 3', NULL, '{"answers":[{"text":"a","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761243992994-image.png","isCorrect":true},{"text":"b","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761244007620-image.png","isCorrect":false},{"text":"c","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761244025170-image.png","isCorrect":false}],"question":"¿Cuál de estos dibujos comienza con la vocal Ee?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T18:32:49.977+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T18:34:24.347505+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Cuál de estos dibujos comienza con la vocal Ee?', NULL, NULL, NULL, 3, '333764ec-545a-4672-881c-f21583827bdb', 0, NULL, 70),
  ('333764ec-545a-4672-881c-f21583827bdb', 'lesson', 'lesson', 'LAS VOCALES Ee', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Esta es la vocal Ee. Observa que hay dos letras que la representan. La letra de color rojo es la mayúscula es la más grande y se utiliza al principio de los nombres propios y de las oraciones. La de color azul es la minúscula es la más pequeña y las usamos con más frecuencia que las mayúsculas.\n🔊 E e             \n \n🔊 Observa la posición de la boca en la imagen para poder emitir el sonido de esta vocal. Escucha atentamente su sonido.\n🔊 Esta es la vocal Ee. Observa las imágenes que comienzan con el sonido Ee. Escucha y repite cada uno de sus nombres.\n               \n            🔊 Escuela                             🔊 Escritorio                       🔊 Escalera \n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761366071661-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T04:21:18.932+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T18:09:23.977714+00:00', '2025-10-25T04:28:01.176067+00:00', '{}'::jsonb, 'Esta es la vocal Ee. Observa que hay dos letras que la representan. La letra de color rojo es la mayúscula es la más grande y se utiliza al principio de los nombres propios y de las oraciones. La de color azul es la minúscula es la más pequeña y las usamos con más frecuencia que las mayúsculas.
🔊 E e             
 
🔊 Observa la posición de la boca en la imagen para poder emitir el sonido de esta vocal. Escucha atentamente su sonido.
🔊 Esta es la vocal Ee. Observa las imágenes que comienzan con el sonido Ee. Escucha y repite cada uno de sus nombres.
               
            🔊 Escuela                             🔊 Escritorio                       🔊 Escalera 
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('8127471e-d6dc-4383-a26c-e03eeef59ed8', 'exercise', 'multiple_choice', 'LAS VOCALES 2', NULL, '{"answers":[{"text":"1","imageUrl":null,"isCorrect":false},{"text":"2","imageUrl":null,"isCorrect":false},{"text":"3","imageUrl":null,"isCorrect":true}],"question":"¿Con qué letra comienza el dibujo?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761242250146-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T17:58:17.933+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T18:05:00.971808+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué letra comienza el dibujo?', NULL, NULL, NULL, 3, 'ffd27da9-cfd0-4d76-bcda-8ae295b06064', 1, NULL, 70),
  ('bf0c238d-5d8d-4dd9-9de2-dd84b4149f71', 'exercise', 'multiple_choice', 'LAS VOCALES 1', NULL, '{"answers":[{"text":"a","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761241973514-image.png","isCorrect":true},{"text":"b","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761241985878-image.png","isCorrect":false},{"text":"c","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761241999007-image.png","isCorrect":false}],"question":"¿Cuál de estos dibujos comienza con la vocal Aa?\t"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T17:55:12.175+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T18:01:55.689284+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Cuál de estos dibujos comienza con la vocal Aa?	', NULL, NULL, NULL, 3, 'ffd27da9-cfd0-4d76-bcda-8ae295b06064', 0, NULL, 70),
  ('ffd27da9-cfd0-4d76-bcda-8ae295b06064', 'lesson', 'lesson', 'LAS VOCALES Aa', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"\nLas vocales son 5 letras del abecedario. Estas representan un sonido vocálico. Estos sonidos los puedes pronunciar con tu boca abierta sin la obstrucción de la lengua, los labios o los dientes. Las vocales son:  Aa, Ee, Ii, Oo, Uu. \n\n🔊 A\n🔊 Esta es la vocal Aa. Observa que hay dos letras que la representan. La letra de color rojo es la mayúscula es la más grande y se utiliza al principio de los nombres propios y de las oraciones. La de color azul es la minúscula es la más pequeña y las usamos con más frecuencia que las mayúsculas.\nA a\n🔊   \n🔊 Observa la posición de la boca en la imagen para poder emitir el sonido de esta vocal. Escucha atentamente su sonido.\n🔊 Esta es la vocal Aa. Observa las imágenes que comienzan con el sonido Aa. Escucha y repite cada uno de sus nombres.\nA a\n \n           🔊 Avión\t\t                                🔊 Alfombra\t","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761366000330-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T04:20:06.519+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T17:45:15.838736+00:00', '2025-10-25T04:26:48.778959+00:00', '{}'::jsonb, '🔊¡Hola,! 
🔊 Hoy aprenderás algo muy importante: las vocales.
🔊 Las vocales son las letras a, e, i, o, u.
🔊 Cada una tiene su propio sonido, y juntas ayudan a formar muchas palabras que usamos todos los días.
🔊 Escucha con atención, repite y observa cómo suena cada vocal.
🔊 Recuerda:
🔊 Abre bien la boca para pronunciar los sonidos. 
🔊 Escucha con cuidado para notar las diferencias. 
🔊¡Y di las vocales con alegría! 
Vamos a descubrir las cinco vocales del abecedario.
🔊 Escucha cómo suena cada una: a, e, i, o, u.
🔊¡Muy bien,! Ahora repite conmigo.

Las vocales son 5 letras del abecedario. Estas representan un sonido vocálico. Estos sonidos los puedes pronunciar con tu boca abierta sin la obstrucción de la lengua, los labios o los dientes. Las vocales son:  Aa, Ee, Ii, Oo, Uu. 
🔊 A
🔊 Esta es la vocal Aa. Observa que hay dos letras que la representan. La letra de color rojo es la mayúscula es la más grande y se utiliza al principio de los nombres propios y de las oraciones. La de color azul es la minúscula es la más pequeña y las usamos con más frecuencia que las mayúsculas.
A a
🔊   
🔊 Observa la posición de la boca en la imagen para poder emitir el sonido de esta vocal. Escucha atentamente su sonido.
🔊 Esta es la vocal Aa. Observa las imágenes que comienzan con el sonido Aa. Escucha y repite cada uno de sus nombres.
A a
 
           🔊 Avión		                                🔊 Alfombra	
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('a08bce22-7cd6-472e-b9ad-653042fa2281', 'lesson', 'lesson', 'SALUDO', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"¡Hola! \n🔊 Bienvenido a nuestra plataforma mágica de lectura.\n🔊 En esta plataforma mágica. \n🔊 Cada juego te ayudará a usar tus oídos atentos, tus ojos curiosos,\ny tu voz fuerte y alegre para leer mejor cada día. \n🔊 En cada juego escucharás sonidos, verás letras, imágenes y palabras. \n🔊 Escucha con atención.\n🔊 Repite los sonidos.\n🔊 Haz clic o toca las imágenes correctas. \n🔊 Cada vez que termines un ejercicio, ganarás estrellas y avanzarás al siguiente nivel. \n🔊¡Cuantos más sonidos descubras, mejor lector serás! \n"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T17:35:50.54+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T17:42:33.694589+00:00', '2025-10-23T17:42:33.694589+00:00', '{}'::jsonb, '¡Hola! 
🔊 Bienvenido a nuestra plataforma mágica de lectura.
🔊 En esta plataforma mágica. 
🔊 Cada juego te ayudará a usar tus oídos atentos, tus ojos curiosos,
y tu voz fuerte y alegre para leer mejor cada día. 
🔊 En cada juego escucharás sonidos, verás letras, imágenes y palabras. 
🔊 Escucha con atención.
🔊 Repite los sonidos.
🔊 Haz clic o toca las imágenes correctas. 
🔊 Cada vez que termines un ejercicio, ganarás estrellas y avanzarás al siguiente nivel. 
🔊¡Cuantos más sonidos descubras, mejor lector serás! 
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('55dfdda5-9fce-4e70-b8c2-a6e8a0c4d6be', 'lesson', 'lesson', 'Rimas Divertidas con Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"La rima es un conjunto de sonidos que se repiten al final de dos palabras. En ese sonido se incluyen las vocales y consonantes de la última sílaba. Por ejemplo, \"casa\" y \"taza\", \"gato\" y \"pato\" o \"foco\" y \"coco\" riman porque sus sonidos finales son idénticos.\n🔊 Ejemplo: sombrilla/bombilla\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T13:24:03.701+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T13:58:37.509198+00:00', '2025-10-24T13:30:45.624524+00:00', '{}'::jsonb, 'La rima es un conjunto de sonidos que se repiten al final de dos palabras. En ese sonido se incluyen las vocales y consonantes de la última sílaba. Por ejemplo, "casa" y "taza", "gato" y "pato" o "foco" y "coco" riman porque sus sonidos finales son idénticos.
🔊 Ejemplo: sombrilla/bombilla
', 'rima_coqui', NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('960797e1-1d11-46ee-9b57-db58a77dd46b', 'exercise', 'multiple_choice', 'Escoge la sílaba 4', NULL, '{"answers":[{"text":"gui","imageUrl":null,"isCorrect":true},{"text":"gi","imageUrl":null,"isCorrect":false},{"text":"qui","imageUrl":null,"isCorrect":false}],"question":"Mañana voy a tocar mi  ____tarra."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T14:07:46.765+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T13:56:17.279019+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '🔊 Instrucciones para el estudiante
🔊 Escucha y lee con atención cada oración.
🔊 Luego, escoge la sílaba correcta para completar la palabra incompleta.
🔊¡Piensa en cómo suena la palabra completa y elige la respuesta correcta!
 no digas la palabra, la palabra es guitarra

Mañana voy a tocar mi  ____tarra.
a.	gui
b.	gi
c.	qui
', NULL, NULL, NULL, 3, '8b2ab422-87ed-4d1a-abe0-3a774fedb521', 3, NULL, 70),
  ('ce7296f9-3a95-4ee6-aa80-99844fccc79a', 'exercise', 'multiple_choice', 'Escoge la sílaba 3', NULL, '{"answers":[{"text":"chu","imageUrl":null,"isCorrect":false},{"text":"yu","imageUrl":null,"isCorrect":false},{"text":"llu","imageUrl":null,"isCorrect":true}],"question":"Voy a jugar en la _____via."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T13:46:54.767+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T13:53:36.921839+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, NULL, NULL, 'Instrucciones para el estudiante
🔊 Escucha y lee con atención cada oración.
🔊 Luego, escoge la sílaba correcta para completar la palabra incompleta.
🔊¡Piensa en cómo suena la palabra completa y elige la respuesta correcta!

no digas la contestacion la palabra es lluvia

Voy a jugar en la _____via.
a.	chu
b.	Yu
c.	llu 

', NULL, 3, '8b2ab422-87ed-4d1a-abe0-3a774fedb521', 2, NULL, 70),
  ('5059569e-5e56-4b1a-929f-f7f8e4960f0b', 'exercise', 'multiple_choice', 'Escoge la sílaba 2', NULL, '{"answers":[{"text":"li","imageUrl":null,"isCorrect":false},{"text":"chi","imageUrl":null,"isCorrect":true},{"text":"ni","imageUrl":null,"isCorrect":false}],"question":"La ____na está muy rica. "}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T13:44:12.752+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T13:47:31.382683+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '🔊 Instrucciones para el estudiante
🔊 Escucha y lee con atención cada oración.
🔊 Luego, escoge la sílaba correcta para completar la palabra incompleta.
🔊¡Piensa en cómo suena la palabra completa y elige la respuesta correcta!

la palabra es china pero no lo puedes decir

🔊 La ____na está muy rica. 
a.	li
b.	chi
c.	ni

', NULL, NULL, NULL, 3, '8b2ab422-87ed-4d1a-abe0-3a774fedb521', 1, NULL, 70),
  ('72e31595-8d66-4e19-b295-bca77788b801', 'exercise', 'multiple_choice', 'Escoge la sílaba 1', NULL, '{"answers":[{"text":"ba","imageUrl":null,"isCorrect":false},{"text":"da","imageUrl":null,"isCorrect":false},{"text":"pa","imageUrl":null,"isCorrect":true}],"question":"El ______jarito está en la rama. "}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T13:38:40.641+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T13:29:53.190256+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'escoge la sílaba correcta para completar la palabra incompleta.
no digas la contestacion 
solo indica que debe buscar la silaba', NULL, NULL, NULL, 3, '8b2ab422-87ed-4d1a-abe0-3a774fedb521', 0, NULL, 70),
  ('8b2ab422-87ed-4d1a-abe0-3a774fedb521', 'lesson', 'lesson', 'Escoge la sílaba que completa cada palabra incompleta', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Reconocer la sílaba que falta para completar una palabra, fortaleciendo la correspondencia grafema–fonema, la lectura silábica y la comprensión del significado de la palabra."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T13:19:36.521+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T13:26:19.328763+00:00', '2025-10-23T13:26:19.328763+00:00', '{}'::jsonb, 'Instrucciones para el estudiante
🔊 Escucha y lee con atención cada oración.
🔊 Luego, escoge la sílaba correcta para completar la palabra incompleta.
🔊¡Piensa en cómo suena la palabra completa y elige la respuesta correcta!
', 'conciencia_s', NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('7a4c5c98-43a9-47bf-ba89-405aa64a8ced', 'lesson', 'lesson', 'subtipe test', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"SECTION 1: Hi! Let''s play with tropical forest rhymes.\nSECTION 2: Listen: snail rhymes with pail. Do you hear how they end the same?\nSECTION 3: Now you: What rhymes with tree? Yes, bee!"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T11:45:20.756005+00:00', '2025-10-24T13:16:44.125596+00:00', '{}'::jsonb, 'Emphasize the rhyming endings. Celebrate each correct rhyme.', 'rimas_tropicales', 'SECTION 1: Hi! Let''s play with tropical forest rhymes.
SECTION 2: Listen: snail rhymes with pail. Do you hear how they end the same?
SECTION 3: Now you: What rhymes with tree? Yes, bee!', '["snail","pail","tree","bee","butterfly","sky"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', 'lesson', 'lesson', 'Fonética (correspondencia grafema-fonema)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo Desarrollar la habilidad de asociar sonidos con letras (correspondencia grafema-fonema) y formar palabras completas reconociendo la secuencia correcta de los sonidos."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:22:30.404578+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Habla despacio y claramente. Enfatiza el sonido /s/. Celebra con "¡Wepa!" cuando lo hagan bien.
Etapa
Descripción de la tarea
IA / Tecnología aplicada
Evidencia de aprendizaje
1. Audio inicial
El sistema pronuncia una palabra (ej. sol).
Voz natural con acento neutro puertorriqueño.
Registro de intentos.
2. Interacción
El estudiante arrastra letras desde un banco visual hasta la caja de construcción.
IA registra el orden y el tiempo de respuesta.
Secuencia correcta de letras.
3. Revisión automática
El sistema compara el resultado con la ortografía correcta y ofrece retroalimentación inmediata.
Reconocimiento de patrón letra-sonido.
% de aciertos en la formación.
4. Refuerzo auditivo
El sistema reproduce la palabra completa y la resalta letra por letra.
Síntesis de voz + reconocimiento fonémico.
Nivel de fluidez fonética.

Explicación para el estudiante
Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras.
Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.
Después, lee la palabra o escríbela según lo que escuches.
¡Cada sonido te ayuda a descubrir una palabra nueva!', 'conciencia_s', NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('90874df8-6288-4123-8c82-fa4211e10c8d', 'exercise', 'multiple_choice', 'Sonido final 8', NULL, '{"answers":[{"text":"n","imageUrl":null,"isCorrect":true},{"text":"ó","imageUrl":null,"isCorrect":false},{"text":"m","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:18:49.640446+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sonido termina?

camión', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', 7, NULL, 70),
  ('ad89a19b-d78b-40b7-af35-89f8b2455fd8', 'exercise', 'multiple_choice', 'Sonido final 7', NULL, '{"answers":[{"text":"a","imageUrl":null,"isCorrect":false},{"text":"s","imageUrl":null,"isCorrect":true},{"text":"m","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:16:18.293248+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sonido termina?
palmas', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', 6, NULL, 70),
  ('439e21f3-10e4-4f72-ab65-bd59edbf0369', 'exercise', 'multiple_choice', 'Sonido final 6', NULL, '{"answers":[{"text":"p","imageUrl":null,"isCorrect":false},{"text":"m","imageUrl":null,"isCorrect":false},{"text":"o","imageUrl":null,"isCorrect":true}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:15:01.00131+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sonido termina?
campo', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', 5, NULL, 70),
  ('7063cf8a-5653-4421-9003-d43750c7cb91', 'exercise', 'multiple_choice', 'Sonido final 5', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"z","imageUrl":null,"isCorrect":true},{"text":"u","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:13:48.449918+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sonido termina?
luz', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', 4, NULL, 70),
  ('6c6d2c8b-9405-43f0-9ca2-92b26d99ce63', 'exercise', 'multiple_choice', 'Sonido final 4', NULL, '{"answers":[{"text":"j","imageUrl":null,"isCorrect":false},{"text":"a","imageUrl":null,"isCorrect":false},{"text":"e","imageUrl":null,"isCorrect":true}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:12:34.278057+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sonido termina?
oleaje', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', 3, NULL, 70),
  ('e8351a27-ed8d-4b14-a42a-fcb9f42cd578', 'exercise', 'multiple_choice', 'Sonido final 3', NULL, '{"answers":[{"text":"e","imageUrl":null,"isCorrect":false},{"text":"n","imageUrl":null,"isCorrect":false},{"text":"a","imageUrl":null,"isCorrect":true}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:10:52.973546+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sonido termina?
arena', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', 2, NULL, 70),
  ('a25bca99-610e-4a7b-a9a0-3f0051763bd8', 'exercise', 'multiple_choice', 'Sonido final 2', NULL, '{"answers":[{"text":"o","imageUrl":null,"isCorrect":false},{"text":"l","imageUrl":null,"isCorrect":true},{"text":"s","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:09:41.307399+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sonido termina?
sol', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', 1, NULL, 70),
  ('2043dcd3-7372-4ba9-a275-717af556a473', 'exercise', 'multiple_choice', 'Sonido final 1', NULL, '{"answers":[{"text":"r","imageUrl":null,"isCorrect":true},{"text":"l","imageUrl":null,"isCorrect":false},{"text":"f","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:04:41.463794+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sonido termina?
flor', NULL, NULL, '["flor"]'::jsonb, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', 0, NULL, 70),
  ('c7d30040-c801-4eb9-870f-a9936cf3e940', 'lesson', 'lesson', 'Detección de sonido final', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Identificar y reconocer el sonido final (fonema final) en palabras familiares del entorno cotidiano, fortaleciendo la conciencia fonémica y la comprensión de la estructura sonora del lenguaje."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:01:38.647786+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Escucha con mucha atención.
Todas las palabras tienen un sonido que se escucha al final.
Tu trabajo será descubrir con qué sonido termina cada palabra.
Por ejemplo:
Escucha la palabra bote.
¿Con qué sonido termina?
/t/ o /e/?
¡Correcto! Brote termina con /e/.
¡Prepárate para escuchar el sonido que cierra cada palabra!', 'conciencia_s', NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('2a436d0a-621a-4104-bd55-6d9c3fd46f0e', 'exercise', 'multiple_choice', 'Sonido del medio 9', NULL, '{"answers":[{"text":"o","imageUrl":null,"isCorrect":true},{"text":"c","imageUrl":null,"isCorrect":false},{"text":"b","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:00:06.668997+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
boca', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 8, NULL, 70),
  ('54312047-b763-4f89-8d07-143d0a9168fe', 'exercise', 'multiple_choice', 'sonido del medio 8', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"a","imageUrl":null,"isCorrect":true},{"text":"n","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:59:11.492726+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
flan', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 7, NULL, 70),
  ('5e981d1d-e863-4d6e-9b02-2284219c7e49', 'exercise', 'multiple_choice', 'Sonido del medio 7', NULL, '{"answers":[{"text":"p","imageUrl":null,"isCorrect":false},{"text":"i","imageUrl":null,"isCorrect":true},{"text":"ñ","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:58:12.260814+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
piña', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 6, NULL, 70),
  ('2e0b62b3-0ec3-460a-8406-cc1cf7ac8bfd', 'exercise', 'multiple_choice', 'Sonido del medio 6', NULL, '{"answers":[{"text":"f","imageUrl":null,"isCorrect":false},{"text":"r","imageUrl":null,"isCorrect":false},{"text":"e","imageUrl":null,"isCorrect":true}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:57:01.266242+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
fresa', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 5, NULL, 70),
  ('00b54134-f94b-4385-8b84-b8d954cc6f92', 'exercise', 'multiple_choice', 'Sonido del medio 5', NULL, '{"answers":[{"text":"u","imageUrl":null,"isCorrect":true},{"text":"j","imageUrl":null,"isCorrect":false},{"text":"g","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:55:23.581334+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
jugo', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 4, NULL, 70),
  ('cd65bcb4-b2dd-4d04-9013-d62f5b4c35e4', 'exercise', 'multiple_choice', 'Sonido del medio 4', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"ch","imageUrl":null,"isCorrect":false},{"text":"e","imageUrl":null,"isCorrect":true}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:53:52.464482+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
leche', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 3, NULL, 70),
  ('1bea38eb-2008-4917-8eea-95bcf2e5a2ca', 'exercise', 'multiple_choice', 'Sonido del medio 3', NULL, '{"answers":[{"text":"c","imageUrl":null,"isCorrect":false},{"text":"a","imageUrl":null,"isCorrect":true},{"text":"f","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:46:40.155052+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
cafe', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 2, NULL, 70),
  ('27fa5f08-e402-4d11-b51a-f61523bab8bf', 'exercise', 'multiple_choice', 'Sonido del medio 2', NULL, '{"answers":[{"text":"a","imageUrl":null,"isCorrect":false},{"text":"p","imageUrl":null,"isCorrect":true},{"text":"n","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:45:29.82896+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
pan', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 1, NULL, 70),
  ('4db6c6be-cff3-48e0-b5da-1825b8122be7', 'exercise', 'multiple_choice', 'Sonido del medio 1', NULL, '{"answers":[{"text":"m","imageUrl":null,"isCorrect":false},{"text":"o","imageUrl":null,"isCorrect":true},{"text":"g","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:44:11.418851+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
gomas', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 0, NULL, 70),
  ('10060923-9bb8-4a94-8ddd-0ffbf80bd975', 'lesson', 'lesson', 'Encuentra el sonido del medio', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Reconocer y aislar el sonido del medio (fonema central) en palabras de uso común, ampliando la conciencia fonémica más allá del sonido inicial y final."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:38:24.478016+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Habla despacio y claramente. Enfatiza el sonido /s/. Celebra con "¡Wepa!" cuando lo hagan bien.', 'conciencia_s', 'Escucha muy bien la palabra que diré.
Toda palabra tiene un sonido en el centro.
Tu tarea es descubrir cuál sonido escuchas en el medio.
Por ejemplo:
Escucha la palabra plano.
¿Qué sonido escuchas en el centro?
/p/, /l/ a /n/o/?
¡Correcto! En grano, el sonido del medio es /a/.
¡Vamos a escuchar, pensar y encontrar el sonido escondido!', NULL, 3, NULL, NULL, NULL, 70),
  ('43ca30f3-d9cf-4ad0-9d9f-e73d2758d74f', 'exercise', 'multiple_choice', 'Doble palabra 9', NULL, '{"answers":[{"text":"silla","imageUrl":null,"isCorrect":true},{"text":"mesa","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /s/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:33:53.643452+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Cuál empieza con /s/?
silla
mesa', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 8, NULL, 70),
  ('ddab36ad-0334-4f92-88b5-50a0f80a15c7', 'exercise', 'multiple_choice', 'Doble palabra 8', NULL, '{"answers":[{"text":"gato","imageUrl":null,"isCorrect":true},{"text":"perro","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /g/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:32:07.642388+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Cuál empieza con /g/?
gato
perro', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 7, NULL, 70),
  ('e66d5c15-8c2e-4e4f-8eea-29dad271a499', 'exercise', 'multiple_choice', 'Doble palabra 7', NULL, '{"answers":[{"text":"plátano","imageUrl":null,"isCorrect":true},{"text":"guineo","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /p/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:30:03.262718+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Cuál empieza con /p/?
platano
guineo', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 6, NULL, 70),
  ('6fa1d1d5-95bf-44a6-ad8d-f5e61828ba61', 'exercise', 'multiple_choice', 'Doble palabra 6', NULL, '{"answers":[{"text":"luna","imageUrl":null,"isCorrect":true},{"text":"sol","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /l/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:28:04.38801+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Cuál empieza con /l/?
luna
sol', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 5, NULL, 70),
  ('907e0b94-3120-4943-83bd-9fe001efbce5', 'exercise', 'multiple_choice', 'Doble palabra 5', NULL, '{"answers":[{"text":"tarde","imageUrl":null,"isCorrect":true},{"text":"noche","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /t/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:16:11.352189+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Cuál empieza con /t/?
tarde
noche', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 4, NULL, 70),
  ('20a1a6d2-4c2e-4213-b58f-567e0089d38f', 'exercise', 'multiple_choice', 'Doble palabra 4', NULL, '{"answers":[{"text":"mucho","imageUrl":null,"isCorrect":true},{"text":"poco","imageUrl":null,"isCorrect":true}],"question":"¿Cuál empieza con /m/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:13:50.074537+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Cuál empieza con /m/?
mucho
poco', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 3, NULL, 70),
  ('45d1ead8-b4b0-40d2-a0ff-7b3a9db979f4', 'exercise', 'multiple_choice', 'Doble palabra 3', NULL, '{"answers":[{"text":"bonito","imageUrl":null,"isCorrect":true},{"text":"feo","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /b/?\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T01:55:19.768991+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Cuál empieza con /b/?
bonito
feo', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 2, NULL, 70),
  ('8a9944f7-6192-4418-bd67-1d6d4822bc6e', 'exercise', 'multiple_choice', 'Doble palabra 2', NULL, '{"answers":[{"text":"frio","imageUrl":null,"isCorrect":true},{"text":"calor","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /f/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T01:52:40.482845+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Cuál empieza con /f/?
frio
calor', NULL, '¿Cuál empieza con /f/?
frio
calor', NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 1, NULL, 70),
  ('025b161b-07e2-4801-be27-0473eb04a574', 'exercise', 'multiple_choice', 'Doble palabra 1', NULL, '{"answers":[{"text":"Calle","imageUrl":null,"isCorrect":true},{"text":"Avenida","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con el sonido /c/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T01:48:49.426655+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Cuál empieza con el sonido /c/?
calle
avenida', NULL, '¿Cuál empieza con el sonido /c/?
calle
avenida', '["calle","avenida"]'::jsonb, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 0, NULL, 70),
  ('219e4bea-3bdb-4551-a7b6-2c4f5378177a', 'lesson', 'lesson', 'Doble palabra', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Escucha las dos palabras con atención.\nTe diré un sonido y tú tendrás que escoger cuál palabra empieza con ese sonido.\nPor ejemplo:\nEscucha “bonito” y “feo.”\n¿Cuál empieza con /b/?\n¡Muy bien! Bonito empieza con /b/.\nEscucha, piensa y selecciona.\n¡Vamos a jugar con los sonidos de las palabras!"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T01:40:52.18592+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Habla despacio y claramente. Enfatiza el sonido. lee el contenido de la enseñanza y Celebra con "¡Wepa!" cuando lo hagan bien.', 'conciencia_s', NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('fd1af9ac-475a-4188-af0c-d783b27c2492', 'exercise', 'multiple_choice', 'Sonido inicial 9', NULL, '{"answers":[{"text":"u","imageUrl":null,"isCorrect":false},{"text":"g","imageUrl":null,"isCorrect":true},{"text":"a","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas primero?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T01:27:48.452638+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'lee la palabra "guagua"', NULL, NULL, '["guagua"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', 8, NULL, 70),
  ('f5d32445-faf3-4e28-bdbb-25239b62d20a', 'exercise', 'multiple_choice', 'ejercicio de test', NULL, '{"answers":[{"text":"1","imageUrl":null,"isCorrect":true},{"text":"2","imageUrl":null,"isCorrect":false}],"question":"I''ll update the query to fetch the parent lesson title and display it next to the \"Linked\" badge.\n\nI''ll update the query to fetch the parent lesson title and display it next to the \"Linked\" badge.\n\nEdited\nAdminDashboard.tsx\nThe \"Linked\" badge now shows the parent lesson title when an exercise is linked to a lesson."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:41:27.302773+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'efc8a8eb-3a49-4271-a88c-e074f395e668', 0, NULL, 70),
  ('efc8a8eb-3a49-4271-a88c-e074f395e668', 'lesson', 'lesson', 'Lesson test Escucha y Repite con Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":" for an exercise to be saveable, ALL of these conditions must be met:\n\nTitle must be longer than 3 characters ✓\nQuestion must be longer than 10 characters ✓\nAt least 2 answers must be present ✓\nAt least ONE answer must be marked as correct AND have text "}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:38:25.523298+00:00', '2025-10-24T13:16:55.383148+00:00', '{}'::jsonb, 'Habla con entusiasmo. Pausa 2 segundos después de cada palabra. Celebra cada intento.', 'coqui_escucha', 'SECTION 1: ¡Hola! Soy Coquí. Hoy vamos a practicar escuchando y repitiendo palabras bonitas de Puerto Rico.
SECTION 2: Escucha con atención. Voy a decir una palabra y tú la repites después de mí.
SECTION 3: ¡Perfecto! Tu voz suena muy bien. Sigamos practicando.
SECTION 4: ¡Wepa! Lo estás haciendo chévere. Eres un campeón del español.', '["playa","mangó","palma","coquí","borinquen"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('b42cf539-9448-48f4-8418-c5e4176a13af', 'exercise', 'multiple_choice', 'ejercicio vinculado a leccion test again', NULL, '{"answers":[{"text":"1","imageUrl":null,"isCorrect":true},{"text":"2","imageUrl":null,"isCorrect":false}],"question":"ejjercicio mljkjmkljmlkjlkkjmljkmlkj","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761150692674-2024-10-08%2015_50_16-React%20App.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:33:20.967126+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'habla muy despacio', NULL, 'test', '["uno"]'::jsonb, 3, 'af18f65c-0aae-4bdb-800b-119972f3d40d', 0, NULL, 70),
  ('8dc0bba6-6cfb-43bc-8ec7-b573df1480fc', 'exercise', 'multiple_choice', 'Sonido inicial 8', NULL, '{"answers":[{"text":"r","imageUrl":null,"isCorrect":false},{"text":"c","imageUrl":null,"isCorrect":true},{"text":"a","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas primero?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761150324813-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:32:12.629056+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'lee la palabra "carro"', NULL, '¿Qué sonido escuchas primero?', '["carro"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', 7, NULL, 70),
  ('14dae0e8-4d9e-4c4c-b8a2-3f4ea69a63bc', 'exercise', 'multiple_choice', 'Sonido inicial 7', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"p","imageUrl":null,"isCorrect":true},{"text":"t","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas primero?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:30:11.117463+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'lee lento y claro la palabra "plátano"', NULL, '¿Qué sonido escuchas primero?', '["Plátano"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', 6, NULL, 70),
  ('af18f65c-0aae-4bdb-800b-119972f3d40d', 'lesson', 'lesson', 'test again', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"esto es el contenido principal"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:28:59.704947+00:00', '2025-10-24T13:16:29.136069+00:00', '{}'::jsonb, 'gabla lento', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('c18168a0-5cef-4b3c-9207-9a10d9790ff2', 'exercise', 'multiple_choice', 'Sonido inicial 6', NULL, '{"answers":[{"text":"c","imageUrl":null,"isCorrect":false},{"text":"r","imageUrl":null,"isCorrect":false},{"text":"b","imageUrl":null,"isCorrect":true}],"question":"¿Qué sonido escuchas primero?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761150014663-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:27:11.849721+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'lee lento y claro la palabra "barco"', NULL, '¿Qué sonido escuchas primero?', '["barco"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', 5, NULL, 70),
  ('ddcbe0fb-5b78-4243-8ade-bc072b09c76a', 'exercise', 'multiple_choice', 'Sonido inicial 5', NULL, '{"answers":[{"text":"o","imageUrl":null,"isCorrect":false},{"text":"q","imageUrl":null,"isCorrect":false},{"text":"c","imageUrl":null,"isCorrect":true}],"question":"¿Qué sonido escuchas primero?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:19:46.30831+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'lee lento y claro la palabra "coquí"', NULL, '¿Qué sonido escuchas primero?', '["coquí"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', 4, NULL, 70),
  ('2f535019-0025-42d7-a276-0880b23db219', 'exercise', 'multiple_choice', 'Sonido inicial 4', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"i","imageUrl":null,"isCorrect":true},{"text":"a","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas primero?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761148987858-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:09:57.573631+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'lee lento y claro la palabra "isla"', NULL, '¿Qué sonido escuchas primero?', '["isla"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', 3, NULL, 70),
  ('eaef3308-6ea1-4377-bfc4-cdd818ed7a66', 'exercise', 'multiple_choice', 'Sonido inicial 3', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"r","imageUrl":null,"isCorrect":false},{"text":"f","imageUrl":null,"isCorrect":true}],"question":"¿Qué sonido escuchas primero?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761148750815-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:06:01.61586+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'lee lento y claro la palabra "flor"', NULL, '¿Qué sonido escuchas primero?', '["flor"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', 2, NULL, 70),
  ('f78bb86d-15f4-4318-a784-cac094b65703', 'exercise', 'multiple_choice', 'Sonido inicial 2', NULL, '{"answers":[{"text":"a","imageUrl":null,"isCorrect":false},{"text":"m","imageUrl":null,"isCorrect":true},{"text":"r","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas primero?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761148340888-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T11:24:18.662333+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T15:59:09.446568+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'leer lento y claro la palabra "mar"', NULL, '¿Qué sonido escuchas primero?', '["Mar"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', 1, NULL, 70),
  ('e751c9b6-cd65-474a-8a3d-f6a25074f376', 'exercise', 'multiple_choice', 'Sonido inicial', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"o","imageUrl":null,"isCorrect":false},{"text":"s","imageUrl":null,"isCorrect":true}],"question":"¿Qué sonido escuchas primero?\n\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T15:31:46.918391+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, 'Lee lento y claro la palabra "sol"', NULL, '¿Qué sonido escuchas primero?', '["sol"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', 0, NULL, 70),
  ('2f3bdc99-b40c-45fe-a895-428ac8bbf128', 'lesson', 'lesson', 'Identificando el Sonido /s/ con Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"¡Escucha con mucha atención!\nCada palabra tiene un sonido que se escucha al principio.\nCuando el sistema diga una palabra, escucha y elige el primer sonido que oyes.\nPor ejemplo, si escuchas “plato”, el primer sonido es /p/.\n¡Vamos a jugar con los sonidos para descubrir cómo comienzan las palabras!"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T15:20:12.100388+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Habla despacio y claramente. Enfatiza el sonido /s/. Celebra con "¡Wepa!" cuando lo hagan bien.', 'conciencia_s', 'SECTION 1: ¡Hola! Soy Coquí del bosque de El Yunque. Hoy vamos a descubrir palabras que comienzan con el sonido /s/.
SECTION 2: Escucha estas palabras de Puerto Rico: sol, sapo, serpiente. ¿Escuchas el sonido /s/ al principio?
SECTION 3: Ahora repite después de mí: sss-sol, sss-sapo, sss-serpiente.
SECTION 4: ¡Excelente! El sonido /s/ suena como una serpiente: ssssss.', '["sol","sapo","serpiente","silla","sopa"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('41b2d6c7-8b4a-4e55-8d7c-38b6e1c9fa01', 'lesson', 'lesson', 'Lectura Fluida de Puerto Rico con Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Actividad: Escoge la sílaba que completa cada palabra incompleta\nObjetivo: Reconocer la sílaba que falta para completar una palabra, fortaleciendo la correspondencia grafema–fonema, la lectura silábica y la comprensión del significado de la palabra.\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T14:34:23.570222+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Lee con expresión natural. Pausa en las comas. Celebra la fluidez.', 'fluidez_pr', 'SECTION 1: ¡Hola! Soy Coquí. Hoy vamos a leer frases sobre nuestra bella isla.
SECTION 2: Escucha primero: "El coquí canta en El Yunque." Ahora tú.
SECTION 3: ¡Muy bien! Lee con ritmo, como si estuvieras contando un cuento.
SECTION 4: ¡Wepa! Lees con tanta fluidez. Estoy orgulloso de ti.', '["El Yunque","San Juan","luquillo","fajardo","ponce"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('5044bc15-a303-4007-9fb8-1cf3db677cb4', 'lesson', 'lesson', 'Dividing Words into Syllables with Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Desarrollar la capacidad de identificar, segmentar y contar sílabas en palabras orales y escritas, comprendiendo que cada sílaba se pronuncia con un solo golpe de voz.\nLa sílaba está compuesta por uno o más sonidos que se pronuncian con un solo golpe de voz. En el lenguaje escrito las sílabas se dividen con un símbolo llamado guión (-)."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T14:24:00.100454+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Pause clearly between syllables. Clap to the rhythm of each syllable.', 'segmentacion', 'SECTION 1: Hi! I''m Coquí. Words are like trains with cars. Each car is a syllable.
SECTION 2: Listen: co-qui. My name has two syllables. Clap with me: co-qui.
SECTION 3: Now you. Divide this word into syllables: but-ter-fly.
SECTION 4: Perfect! You separated all the syllables like an expert.', '["coqui","butterfly","mango","island","rainforest"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', 'lesson', 'lesson', 'Conciencia fonémica', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"¡Escucha con mucha atención!\nCada palabra tiene un sonido que se escucha al principio.\nCuando el sistema diga una palabra, escucha y elige el primer sonido que oyes.\nPor ejemplo, si escuchas “plato”, el primer sonido es /p/.\n¡Vamos a jugar con los sonidos para descubrir cómo comienzan las palabras!\n\nPalabra Sonido inicial correcto Opciones Visual Referencia Cultural\nsol\ns\nl\no\ns\nClima tropical\nmar\nm\na\nm\nr\nMar Caribe\nflor\nf\nl\nr\nf\nFlor de Maga símbolo nacional\nIsla\ni\nl\ni\na\ncoquí\nc\no\nq\nc\nSímbolo de Puerto Rico\nbarco\nb\nc\nr\nb\nTransporte marítimo\nplátano\np\nL\np\nt\nComida típica\ncarro\na\nr\nc\na\nTransporte\nterrestre\nguagua\ng\nu\ng\na\nTransporte típico\n\nPantalla 1 – Instrucción auditiva y visual:\n“Escucha la palabra: coquí.\n¿Qué sonido escuchas primero?”\nOpciones:\n/c/ /r/ /a/\nRespuestas automáticas:\n\n“¡Excelente! Coquí empieza con /c/.”\n“Escucha otra vez: coquí. Repite conmigo: /c/.”\nVisual:\nAnimación del coquí cantando y la letra C brillando."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T14:21:34.80607+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Modo
Descripción
Propósito
Modo auditivo simple
Escucha y selecciona entre 3 letras.
Discriminación fonémica inicial.
Modo visual guiado
Aparece la palabra escrita. El estudiante toca la primera letra que “suena igual”.
Conexión grafema-fonema.
Modo desafío
Escucha dos palabras (ej. bloque, cristal) y selecciona cuál empieza con /b/.
Comparación fonémica entre palabras.', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('9f750023-c594-4c14-85c8-d94f61f67108', 'lesson', 'lesson', 'Dividing Words into Syllables with Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Desarrollar la capacidad de identificar, segmentar y contar sílabas en palabras orales y escritas, comprendiendo que cada sílaba se pronuncia con un solo golpe de voz.\nLa sílaba está compuesta por uno o más sonidos que se pronuncian con un solo golpe de voz. En el lenguaje escrito las sílabas se dividen con un símbolo llamado guión (-)."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T13:57:31.364722+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Pause clearly between syllables. Clap to the rhythm of each syllable.', 'segmentacion', 'SECTION 1: Hi! I''m Coquí. Words are like trains with cars. Each car is a syllable.
SECTION 2: Listen: co-qui. My name has two syllables. Clap with me: co-qui.
SECTION 3: Now you. Divide this word into syllables: but-ter-fly.
SECTION 4: Perfect! You separated all the syllables like an expert.', '["coqui","butterfly","mango","island","rainforest"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('4abaa9ab-6c58-43cc-8c26-8b234de74985', 'lesson', 'lesson', 'Dividing Words into Syllables with Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Desarrollar la capacidad de identificar, segmentar y contar sílabas en palabras orales y escritas, comprendiendo que cada sílaba se pronuncia con un solo golpe de voz.\n\nLa sílaba está compuesta por uno o más sonidos que se pronuncian con un solo golpe de voz. En el lenguaje escrito las sílabas se dividen con un símbolo llamado guión (-)."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T13:55:35.199473+00:00', '2025-10-24T13:16:05.222646+00:00', '{}'::jsonb, 'Pause clearly between syllables. Clap to the rhythm of each syllable.', 'segmentacion', 'SECTION 1: Hi! I''m Coquí. Words are like trains with cars. Each car is a syllable.
SECTION 2: Listen: co-qui. My name has two syllables. Clap with me: co-qui.
SECTION 3: Now you. Divide this word into syllables: but-ter-fly.
SECTION 4: Perfect! You separated all the syllables like an expert.', '["coqui","butterfly","mango","island","rainforest"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('586c1835-bb64-40fa-98b8-a2180c338a18', 'exercise', 'multiple_choice', ' Read the informational text carefully. Then, choo', NULL, '{"answers":[{"text":"insects","imageUrl":null,"isCorrect":true},{"text":"dogs","imageUrl":null,"isCorrect":false},{"text":"sharks","imageUrl":null,"isCorrect":false}],"question":" Read the informational text carefully. Then, choose the correct \nanswer:\nWhat other animals can you find on this type of forest?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761063783103-image.png"}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-21T16:24:31.126631+00:00', '2025-10-21T16:24:31.126631+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('8953b8be-a9d1-48d0-9854-3b6832c84a57', 'assessment', 'multiple_choice', 'English  Assessment  Grade | 1st grade  Subject | English', NULL, '{"answers":[{"text":"d","imageUrl":null,"isCorrect":true},{"text":"c","imageUrl":null,"isCorrect":false},{"text":"b","imageUrl":null,"isCorrect":false}],"question":"Look at the picture.  Choose the correct beginning and ending sound.\n__ og","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761063205153-image.png"}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-21T16:14:13.411524+00:00', '2025-10-23T11:38:24.429017+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('d4925bad-9535-418e-b2f3-cc89edc9235a', 'lesson', 'lesson', 'Lección 3: Tamaño y Posición', NULL, '{"answers":[{"text":"cierto","imageUrl":null,"isCorrect":true},{"text":"falso","imageUrl":null,"isCorrect":false}],"question":"Los niños están adentro del salón.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761050478338-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', NULL, 0, 0, NULL, '25390fc0-096f-4940-bfb3-4535f8e45ac0', '2025-10-21T12:42:00.009516+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70);


-- ============================================
-- Table: pdf_text_content
-- Records: 0
-- ============================================

-- Schema detection failed for pdf_text_content. Using generic schema.

-- No data for table pdf_text_content


-- ============================================
-- Table: profiles
-- Records: 1
-- ============================================

-- Table: public.profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    "grade_level" TEXT,
    "assigned_region" TEXT,
    "school_id" TEXT,
    "language_specialization" TEXT,
    "learning_languages" JSONB
);

-- Index on created_at
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- Table: profiles
-- Total records: 1
-- Exported: 2025-10-25T12:58:37.071Z

-- Clear existing data (uncomment if needed)
-- TRUNCATE TABLE public.profiles CASCADE;

INSERT INTO public.profiles ("id", "full_name", "avatar_url", "created_at", "updated_at", "grade_level", "assigned_region", "school_id", "language_specialization", "learning_languages") VALUES
  ('49063ede-8e67-429e-87f6-2f291cba1203', 'Administrator', '/avatars/admin-1.jpg', '2025-10-21T13:52:57.998335+00:00', '2025-10-21T14:14:01.732188+00:00', NULL, NULL, NULL, NULL, '["es","en"]'::jsonb);


-- ============================================
-- Table: user_roles
-- Records: 1
-- ============================================

-- Table: public.user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID,
    "role" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Index on user_id
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Index on created_at
CREATE INDEX IF NOT EXISTS idx_user_roles_created_at ON public.user_roles(created_at);

-- Table: user_roles
-- Total records: 1
-- Exported: 2025-10-25T12:58:37.071Z

-- Clear existing data (uncomment if needed)
-- TRUNCATE TABLE public.user_roles CASCADE;

INSERT INTO public.user_roles ("id", "user_id", "role", "created_at") VALUES
  ('a85bc4de-f53b-4df6-bdf7-39de2524896d', '49063ede-8e67-429e-87f6-2f291cba1203', 'depr_executive', '2025-10-21T14:09:42.358148+00:00');


-- ============================================
-- Table: voice_sessions
-- Records: 271
-- ============================================

-- Table: public.voice_sessions
CREATE TABLE IF NOT EXISTS public.voice_sessions (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "session_id" TEXT,
    "student_id" UUID,
    "assessment_id" TEXT,
    "language" TEXT,
    "grade_level" INTEGER,
    "metrics" JSONB,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "ended_at" TEXT,
    "model" TEXT
);

-- Index on created_at
CREATE INDEX IF NOT EXISTS idx_voice_sessions_created_at ON public.voice_sessions(created_at);

-- Table: voice_sessions
-- Total records: 271
-- Exported: 2025-10-25T12:58:37.071Z

-- Clear existing data (uncomment if needed)
-- TRUNCATE TABLE public.voice_sessions CASCADE;

INSERT INTO public.voice_sessions ("id", "session_id", "student_id", "assessment_id", "language", "grade_level", "metrics", "created_at", "ended_at", "model") VALUES
  ('76f17b0d-0d56-4a6d-82ae-12daa2bb9476', 'sess_CUOdgM2Ix5Tsz6zzf4Yba', '49063ede-8e67-429e-87f6-2f291cba1203', 'b8b34023-bb5f-4145-914a-9f64a53b2891', 'es-PR', 0, '{}'::jsonb, '2025-10-25T02:49:48.937+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d5e42525-e01a-4899-af47-7ecd4c5af0ae', 'sess_CUOT7B43xbRBTgqBunw53', '49063ede-8e67-429e-87f6-2f291cba1203', '18f357d8-0dcb-4537-b601-f86497726db4', 'es-PR', 0, '{}'::jsonb, '2025-10-25T02:38:53.463+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('8f0169b3-86d6-4684-a507-0d41ab74bf48', 'sess_CUOII2TJhhyphUBRirIVK', '49063ede-8e67-429e-87f6-2f291cba1203', 'e486eea0-3f5d-42db-9344-1d9c2bb7fd39', 'es-PR', 0, '{}'::jsonb, '2025-10-25T02:27:42.767+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('99603c91-dcc9-4b95-9ade-b09fddc7da3d', 'sess_CUOD8CSUEt6snzVM5eBU6', '49063ede-8e67-429e-87f6-2f291cba1203', '22221c5f-5371-4e92-9130-171023807c38', 'es-PR', 0, '{}'::jsonb, '2025-10-25T02:22:22.338+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('81ccdddb-e252-4820-ae96-f9fa56d56687', 'sess_CUO94q04u5vBmQqxOE6ci', '49063ede-8e67-429e-87f6-2f291cba1203', 'aa069e37-4313-4e8b-8baf-33c3fd909c36', 'es-PR', 0, '{}'::jsonb, '2025-10-25T02:18:10.204+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a49ca8ed-dd48-4c5c-91df-4b7c4a799fd0', 'sess_CUO0LTvtRQ3lA3vrLlUTK', '49063ede-8e67-429e-87f6-2f291cba1203', '9eb3b6e1-3214-4036-8153-f7d6e410f397', 'es-PR', 0, '{}'::jsonb, '2025-10-25T02:09:09.111+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('88525889-14ee-4639-9f9d-fa95795c065d', 'sess_CUNvwRAr2VQoknu6FxC3v', '49063ede-8e67-429e-87f6-2f291cba1203', 'ab587b62-8be5-4832-ab97-ad62904e853e', 'es-PR', 0, '{}'::jsonb, '2025-10-25T02:04:36.213+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('0c372531-0c76-4d1b-bd27-8c40a21fb62b', 'sess_CUNuuV4syHMa073j6kj4b', '49063ede-8e67-429e-87f6-2f291cba1203', 'ab587b62-8be5-4832-ab97-ad62904e853e', 'es-PR', 0, '{}'::jsonb, '2025-10-25T02:03:32.627+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('237aa5d7-006d-4814-bb5e-fe4a10af12dc', 'sess_CUNtPjAG5D0swWVX7ngSK', '49063ede-8e67-429e-87f6-2f291cba1203', 'ab587b62-8be5-4832-ab97-ad62904e853e', 'es-PR', 0, '{}'::jsonb, '2025-10-25T02:01:59.304+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('2224e03e-8176-46dd-a5ca-3281bfc6f31d', 'sess_CUNqsDHW0zafgP3QugYQI', '49063ede-8e67-429e-87f6-2f291cba1203', 'ab587b62-8be5-4832-ab97-ad62904e853e', 'es-PR', 0, '{}'::jsonb, '2025-10-25T01:59:22.694+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('9e21aaa7-521f-49e5-a8c8-1e450bad646e', 'sess_CUNn32RNBpgDH7mAxhizf', '49063ede-8e67-429e-87f6-2f291cba1203', '02b25d79-ee36-4c53-b80d-237d29a7692a', 'es-PR', 0, '{}'::jsonb, '2025-10-25T01:55:25.94+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('85450b27-a1f1-486a-990c-f27e0802cc8c', 'sess_CUNkQ5LEZxCsVj93g1FtB', '49063ede-8e67-429e-87f6-2f291cba1203', 'd7216766-12f3-49bf-ac20-e2a4f1065855', 'es-PR', 0, '{}'::jsonb, '2025-10-25T01:52:42.176+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('ee98156c-6bba-4abb-bf66-cba5e1c4f4dc', 'sess_CUNgfiJbRLYvteA07lEpy', '49063ede-8e67-429e-87f6-2f291cba1203', 'd668337b-5773-4bc1-90aa-01ca93618e53', 'es-PR', 0, '{}'::jsonb, '2025-10-25T01:48:49.49+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('6798cb20-1ce2-4be7-badc-455216604c33', 'sess_CUNew5hNZuDRUXhyAKm0b', '49063ede-8e67-429e-87f6-2f291cba1203', 'd668337b-5773-4bc1-90aa-01ca93618e53', 'es-PR', 0, '{}'::jsonb, '2025-10-25T01:47:02.793+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('bb68d9a1-302a-4ac4-b20d-868c4bf5ce9d', 'sess_CUNeWFG6fErC0qwRrXnA6', '49063ede-8e67-429e-87f6-2f291cba1203', 'd668337b-5773-4bc1-90aa-01ca93618e53', 'es-PR', 0, '{}'::jsonb, '2025-10-25T01:46:36.101+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c56c616e-7e46-4e70-818c-439ac76ea150', 'sess_CUNW6JM7flOdeMRD6fP86', '49063ede-8e67-429e-87f6-2f291cba1203', 'a835c5a4-21f6-4d27-8013-dee0d23bcc3a', 'es-PR', 0, '{}'::jsonb, '2025-10-25T01:37:54.888+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c9401295-6785-49ba-b5dc-c36d7729cd59', 'sess_CUM8j29D9AdjjsT7h2m4K', '49063ede-8e67-429e-87f6-2f291cba1203', 'a97a6062-14b3-4089-afc3-3c65b2c5da7f', 'es-PR', 0, '{}'::jsonb, '2025-10-25T00:09:41.097+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('3248e9ab-eda1-492b-8704-a69188dd1bdd', 'sess_CULLieEImsf6UW2w144Y7', '49063ede-8e67-429e-87f6-2f291cba1203', '5ab108f0-9c87-4cbc-8bdb-f127a4acb23e', 'es-PR', 0, '{}'::jsonb, '2025-10-24T23:19:02.951+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('4b167236-fbf2-4350-9441-a54c63d61f03', 'sess_CUL0yhbUcq15aaDW6RG7Q', '49063ede-8e67-429e-87f6-2f291cba1203', '2afc4bc9-ef86-4f1c-9e53-670cf6c39af0', 'es-PR', 0, '{}'::jsonb, '2025-10-24T22:57:36.404+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('3bcd43d3-a9cc-4d0d-9724-fd30627c8b89', 'sess_CUKO0kvcaEXN1MzyJEASb', '49063ede-8e67-429e-87f6-2f291cba1203', 'b5f477de-ffa9-4646-b6dd-c41c54717adc', 'es-PR', 0, '{}'::jsonb, '2025-10-24T22:17:20.68+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('527fd5cf-bb2a-45d5-b184-f38ec19301c9', 'sess_CUJjfyjsSbjkFAVYjay8K', '49063ede-8e67-429e-87f6-2f291cba1203', 'a835c5a4-21f6-4d27-8013-dee0d23bcc3a', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:35:39.773+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('38938b84-3538-49a0-8b63-3921fb768cf6', 'sess_CUJiUjV54uEPYZ6Pmp1o1', '49063ede-8e67-429e-87f6-2f291cba1203', 'a835c5a4-21f6-4d27-8013-dee0d23bcc3a', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:34:26.212+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('14be2f4c-03db-4a79-871e-b604209c0066', 'sess_CUJhNIxDtpPCV5ntdGVOO', '49063ede-8e67-429e-87f6-2f291cba1203', 'a835c5a4-21f6-4d27-8013-dee0d23bcc3a', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:33:17.518+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('9228f9a5-d38b-447e-84a7-e7c08b39a8ef', 'sess_CUJev9iSNXLL2Jn4L3rVQ', '49063ede-8e67-429e-87f6-2f291cba1203', 'af85705f-8417-4556-8ac3-b360de6e7022', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:30:45.695+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('85822c9c-9418-4b77-b5d5-8dcf3af56559', 'sess_CUJcmVyNMJ508Q3XYfGM7', '49063ede-8e67-429e-87f6-2f291cba1203', 'f3381f70-67da-4832-bd99-8ffcd89f7d2c', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:28:32.289+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('6355efde-f496-4740-b751-c907d299e644', 'sess_CUJbe5p5qHasLSTvHFeG6', '49063ede-8e67-429e-87f6-2f291cba1203', 'f3381f70-67da-4832-bd99-8ffcd89f7d2c', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:27:22.365+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('e54989c8-09f2-47ea-afbd-95ef8e9ceeed', 'sess_CUJYOq8JJidblUiftCjcL', '49063ede-8e67-429e-87f6-2f291cba1203', '1ca29afb-9720-4ea7-93fa-237cdb678a5c', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:24:00.706+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('2df122c6-fe66-45b0-b270-8304913048e8', 'sess_CUJWAsjM9rBsgEKAntT6a', '49063ede-8e67-429e-87f6-2f291cba1203', '09be3d54-ff40-4409-9395-098f203e0d4e', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:21:42.934+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('76e86b30-8b14-43b9-875d-c2ddf770acea', 'sess_CUJVsLBwNZmAPBOmVnzPX', '49063ede-8e67-429e-87f6-2f291cba1203', '34b4d7f1-1b72-43bd-b752-19289e46204e', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:21:24.319+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('4b90d0c7-f8a5-481d-8821-9925441a136f', 'sess_CUJN8AeRiSPdExoiLm3gq', '49063ede-8e67-429e-87f6-2f291cba1203', 'f08faa91-6e5f-44c6-b879-c5d8bbdaedf3', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:12:22.398+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c70e2a99-ce4f-461d-a436-65afa8d903a3', 'sess_CUJLgDfjgocTpgqSCd7xk', '49063ede-8e67-429e-87f6-2f291cba1203', 'fe1fb8d0-e733-4908-b9e8-e1d4bd75572c', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:10:52.563+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('2c5a7955-e040-4494-b7a5-0ef2bc464526', 'sess_CUJJcNdl2hFmNsBM3ePFS', '49063ede-8e67-429e-87f6-2f291cba1203', 'f08faa91-6e5f-44c6-b879-c5d8bbdaedf3', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:08:44.249+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('1e949060-826c-4f09-bd8f-e4721d1a95c4', 'sess_CUJHuEIyizY1LDNSsrx69', '49063ede-8e67-429e-87f6-2f291cba1203', '34b4d7f1-1b72-43bd-b752-19289e46204e', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:06:59.018+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('16f2ca1b-9799-4411-a3c4-895cc570b655', 'sess_CUJH2qatNeny3kBpiP93L', '49063ede-8e67-429e-87f6-2f291cba1203', 'fe48103c-dba1-41c6-ab02-c3dce7dc0676', 'es-PR', 0, '{}'::jsonb, '2025-10-24T21:06:04.869+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('2051119b-094b-4e18-8059-63ecf4c1a219', 'sess_CUIwOBUDPgRgTAU09DEha', '49063ede-8e67-429e-87f6-2f291cba1203', '47441d6a-beb2-4fe0-9480-c968b17d7efb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T20:44:44.57+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('3c025b21-9ae5-447f-8d4c-f0dba076d602', 'sess_CUIvdzghAKH9UY4m41ta2', '49063ede-8e67-429e-87f6-2f291cba1203', '47441d6a-beb2-4fe0-9480-c968b17d7efb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T20:43:57.358+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('451c6392-d842-4da5-b89f-228b67437d71', 'sess_CUIuug2iXF7xfjvJFWiXA', '49063ede-8e67-429e-87f6-2f291cba1203', '47441d6a-beb2-4fe0-9480-c968b17d7efb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T20:43:12.22+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('910d326c-7666-480b-8aa0-707d652e3912', 'sess_CUIraIMa2k4MxpUXIcfnn', '49063ede-8e67-429e-87f6-2f291cba1203', 'b35d786a-585b-4457-861e-b8b24c6734b7', 'es-PR', 0, '{}'::jsonb, '2025-10-24T20:39:46.328+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('6330dbcd-affd-4a39-8640-aab9580dd3e8', 'sess_CUIpaToguVT61ZuBTvE52', '49063ede-8e67-429e-87f6-2f291cba1203', '97641602-5bb1-41a1-9b99-7860de7debac', 'es-PR', 0, '{}'::jsonb, '2025-10-24T20:37:42.389+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('b5b2685e-0289-4919-8eb2-ff7f36e32a7b', 'sess_CUIoWJRdTOkk5Q5snnx6C', '49063ede-8e67-429e-87f6-2f291cba1203', '97641602-5bb1-41a1-9b99-7860de7debac', 'es-PR', 0, '{}'::jsonb, '2025-10-24T20:36:37.163+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d7880946-9dcc-44fa-9fee-afac2627ae86', 'sess_CUImnk9wgH4OCDaogH5w1', '49063ede-8e67-429e-87f6-2f291cba1203', '7cadad26-4945-41d3-b917-5113e12aff6f', 'es-PR', 0, '{}'::jsonb, '2025-10-24T20:34:49.755+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('e4b0f6bd-b8b5-4096-9693-6dd9e7da23e1', 'sess_CUIl7pQM0CBs1WobElxXw', '49063ede-8e67-429e-87f6-2f291cba1203', '22f9f065-86c3-4115-93d2-35af81651435', 'es-PR', 0, '{}'::jsonb, '2025-10-24T20:33:05.959+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('bc566f1a-08d5-4644-ac87-b61be96550e7', 'sess_CUIdUHBMkpQrdPeyTsyXD', '49063ede-8e67-429e-87f6-2f291cba1203', '950702e3-ad70-46a3-8ffd-cda1231f9fe8', 'es-PR', 0, '{}'::jsonb, '2025-10-24T20:25:12.525+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('f19297bf-1d10-4f0f-bb36-3da4ff06655c', 'sess_CUIaZ1nhRm2vje7dKG7Mw', '49063ede-8e67-429e-87f6-2f291cba1203', '8c6af7e4-b70e-496b-b19e-f9e3dbd86353', 'es-PR', 0, '{}'::jsonb, '2025-10-24T20:22:11.661+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('ec6b4183-5987-424d-b7fd-4577fc8c0771', 'sess_CUILEoPHzrZIhPb5n81m3', '49063ede-8e67-429e-87f6-2f291cba1203', '0392086a-519f-4415-8e06-ed8b503489f4', 'es-PR', 0, '{}'::jsonb, '2025-10-24T20:06:20.704+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('fa503cd5-c30b-4494-aacc-282ac4e23185', 'sess_CUIICN0EDTeosKsffgoPY', '49063ede-8e67-429e-87f6-2f291cba1203', '03ba1219-3045-41ef-8444-ed9c7d02189d', 'es-PR', 0, '{}'::jsonb, '2025-10-24T20:03:12.319+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('94066660-29d1-4dd0-bfb2-480d941dc2d4', 'sess_CUIEiQFl1eKuKfuIFd63T', '49063ede-8e67-429e-87f6-2f291cba1203', '03ba1219-3045-41ef-8444-ed9c7d02189d', 'es-PR', 0, '{}'::jsonb, '2025-10-24T19:59:36.527+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('06e2d904-7e7d-4e51-814f-66d8c1eaff86', 'sess_CUICXKjrA8k8TgDgcH5av', '49063ede-8e67-429e-87f6-2f291cba1203', '03ba1219-3045-41ef-8444-ed9c7d02189d', 'es-PR', 0, '{}'::jsonb, '2025-10-24T19:57:21.741+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('cc25bd4a-82e3-4c35-b6e5-f1e923f7d755', 'sess_CUHuctL7JkRl7KDFYH4AE', '49063ede-8e67-429e-87f6-2f291cba1203', '49a5bfab-0f82-43e8-bfb9-ce804c3599fc', 'es-PR', 0, '{}'::jsonb, '2025-10-24T19:38:50.12+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('843f7323-38de-44c0-b39a-2f5d460c3d2e', 'sess_CUHtf5dVESX8OaUhEXjGZ', '49063ede-8e67-429e-87f6-2f291cba1203', '49a5bfab-0f82-43e8-bfb9-ce804c3599fc', 'es-PR', 0, '{}'::jsonb, '2025-10-24T19:37:51.855+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('da62bcc8-eefe-4e7e-9982-ba0a9b83d485', 'sess_CUHqiUsncyuU99hUXtdYZ', '49063ede-8e67-429e-87f6-2f291cba1203', '3ab3f4fb-419c-485f-97e5-71183611d185', 'es-PR', 0, '{}'::jsonb, '2025-10-24T19:34:48.722+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('f4a4c5d6-75b2-4bea-8f40-05a798725df5', 'sess_CUHdXxlxW5I6EApub5251', '49063ede-8e67-429e-87f6-2f291cba1203', 'd4560635-c62f-495f-90e2-f7b7007be7bd', 'es-PR', 0, '{}'::jsonb, '2025-10-24T19:21:11.347+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('7da03914-3be0-41e7-acda-3eb42a2832e7', 'sess_CUHUC7PyPHqrSsstY6tqH', '49063ede-8e67-429e-87f6-2f291cba1203', '39c43f00-c71a-4053-8f44-d2bdf87a51be', 'es-PR', 0, '{}'::jsonb, '2025-10-24T19:11:32.253+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('ba79328e-a218-415e-b527-1671a3d892be', 'sess_CUHEuwSgCOTEcO2fJSaPU', '49063ede-8e67-429e-87f6-2f291cba1203', 'd71c618e-db69-4ebd-be40-268403ea3e05', 'es-PR', 0, '{}'::jsonb, '2025-10-24T18:55:44.846+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('eef8ea5a-57da-446e-9d38-de7a297e7a1b', 'sess_CUHBzLEKSzODBPQbseNJx', '49063ede-8e67-429e-87f6-2f291cba1203', '77098b19-ee6c-4362-984b-0648ff7bad2d', 'es-PR', 0, '{}'::jsonb, '2025-10-24T18:52:43.151+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('77a2ee6c-ff8e-4d2f-866d-571d518229b2', 'sess_CUHAfZWji7qETcwxrEyo4', '49063ede-8e67-429e-87f6-2f291cba1203', '77098b19-ee6c-4362-984b-0648ff7bad2d', 'es-PR', 0, '{}'::jsonb, '2025-10-24T18:51:22.104+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a3a2cde4-d5b3-4b0c-89fe-704d12420d7f', 'sess_CUH62zYeHempQMFONiBJY', '49063ede-8e67-429e-87f6-2f291cba1203', '6cba1218-8e83-4c42-93a9-557f9570abb0', 'es-PR', 0, '{}'::jsonb, '2025-10-24T18:46:34.125+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c212d065-ae85-4036-b1fa-2653eb4c89cc', 'sess_CUH3OsTlfcao1SwR9znux', '49063ede-8e67-429e-87f6-2f291cba1203', '8cdf44ba-c4fb-40e0-8127-951e942e1a1f', 'es-PR', 0, '{}'::jsonb, '2025-10-24T18:43:50.805+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('5d5faff5-3948-4380-854e-a0654acde3b8', 'sess_CUH0hB1wt5ajz2pFXV2q1', '49063ede-8e67-429e-87f6-2f291cba1203', '9b644e9f-9ccb-46b1-8d6c-644e63d4c4a2', 'es-PR', 0, '{}'::jsonb, '2025-10-24T18:41:03.728+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c65fec93-8655-4e4b-8e4c-5fd21f75bcea', 'sess_CUGrOKkeCf3gi7optmclU', '49063ede-8e67-429e-87f6-2f291cba1203', 'e06b3750-2dea-48f2-85f2-fbb60e675fa1', 'es-PR', 0, '{}'::jsonb, '2025-10-24T18:31:26.507+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('e5c3f0fd-013f-471a-9bcb-5bb81e35c531', 'sess_CUGDs0my74iFDCqGRhs6d', '49063ede-8e67-429e-87f6-2f291cba1203', '20e4d727-764d-44da-ac77-108f86a90a5a', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:50:36.157+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('bc82c2ae-5a69-46e6-a4a9-9f42dd73bb2a', 'sess_CUGCJl6j2r8M1al5S2Zpz', '49063ede-8e67-429e-87f6-2f291cba1203', '20e4d727-764d-44da-ac77-108f86a90a5a', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:48:59.727+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('bf83ce3c-4bb1-426b-aed0-713962e84b02', 'sess_CUGBHkTheup1q7JVKFAfQ', '49063ede-8e67-429e-87f6-2f291cba1203', '20e4d727-764d-44da-ac77-108f86a90a5a', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:47:55.656+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d5a74206-25ab-48e9-b89f-07d4dfb5a2f2', 'sess_CUG8sZfmhx4q76GUcIAVB', '49063ede-8e67-429e-87f6-2f291cba1203', '363fe867-19ed-4b7d-86ef-c2534c758b84', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:45:26.738+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('677ccd41-2bb0-4370-be9b-d11f34346aa0', 'sess_CUG4lwQfLQe4z1vJzvPD5', '49063ede-8e67-429e-87f6-2f291cba1203', '363fe867-19ed-4b7d-86ef-c2534c758b84', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:41:11.389+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('315a9dcb-5e32-483c-ac8c-cec46308365e', 'sess_CUFzqvoepd1ecKJVlKQ8o', '49063ede-8e67-429e-87f6-2f291cba1203', '64d6e09f-3e7d-4838-94a4-7bdba13dc9b7', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:36:06.179+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('b3fa0871-e76f-40e4-86df-5993e2f9eda8', 'sess_CUFw8wStE2OiXwXJuXFky', '49063ede-8e67-429e-87f6-2f291cba1203', '48051a77-1692-4822-a0ba-15291e23baeb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:32:16.358+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('5a292ae0-af97-4db1-aac5-99528ad019f8', 'sess_CUFvBuet0vITXs43UlD8I', '49063ede-8e67-429e-87f6-2f291cba1203', '48051a77-1692-4822-a0ba-15291e23baeb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:31:17.676+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('2dcefed3-09ff-4cfa-8f98-2e7fed67328e', 'sess_CUFqMBmQtL3IaA2v4RW6w', '49063ede-8e67-429e-87f6-2f291cba1203', '48051a77-1692-4822-a0ba-15291e23baeb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:26:19.018+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('17a13812-eb9f-417e-a805-4f3facbb9d3f', 'sess_CUFpGisFkPSwHlDagZqEl', '49063ede-8e67-429e-87f6-2f291cba1203', '48051a77-1692-4822-a0ba-15291e23baeb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:25:10.869+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('212313d0-6fb5-40d0-ac30-0a8dc43664b5', 'sess_CUFnw1cizfMhuHWssRS3N', '49063ede-8e67-429e-87f6-2f291cba1203', '48051a77-1692-4822-a0ba-15291e23baeb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:23:48.641+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('de12a38d-182c-48de-9df8-39e479b2b040', 'sess_CUFn0ojwtAES88ejZVRbV', '49063ede-8e67-429e-87f6-2f291cba1203', '48051a77-1692-4822-a0ba-15291e23baeb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:22:50.559+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('38b1a62b-b7f5-45ed-97cf-6ccb82c31c85', 'sess_CUFlOuxJZHogxZ5tgFBAX', '49063ede-8e67-429e-87f6-2f291cba1203', '48051a77-1692-4822-a0ba-15291e23baeb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:21:10.355+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('265d74a9-f0c4-4fcc-ad7e-2d3c5febae1d', 'sess_CUFjrAPUZld9DCBBtEJMD', '49063ede-8e67-429e-87f6-2f291cba1203', '48051a77-1692-4822-a0ba-15291e23baeb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:19:35.557+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('cfa56877-6cc1-47e8-907e-0751857caf53', 'sess_CUFj4PLMwCPQPCYGJy2XG', '49063ede-8e67-429e-87f6-2f291cba1203', '48051a77-1692-4822-a0ba-15291e23baeb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:18:46.845+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('141df251-53fe-4ed3-8ae2-6ebbca98f02c', 'sess_CUFihQKDBtDgMmuA7F6vk', '49063ede-8e67-429e-87f6-2f291cba1203', '48051a77-1692-4822-a0ba-15291e23baeb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:18:23.679+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c1dc49a1-1b52-48b6-9652-ffde2d5ff173', 'sess_CUFZcqt6vyzHoSnOwXXxC', '49063ede-8e67-429e-87f6-2f291cba1203', '1b49b99e-b9f1-4fa2-97af-eaf026e0c3fc', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:09:00.127+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('007068bf-bbaa-460a-bc50-39792123f20c', 'sess_CUFTMVy9Cxk7r3zO3s48z', '49063ede-8e67-429e-87f6-2f291cba1203', 'd73abe8b-8e95-4103-93fe-ceb0c7538588', 'es-PR', 0, '{}'::jsonb, '2025-10-24T17:02:33.116+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('17590ba0-48e9-445c-98fc-11568417e5ab', 'sess_CUEaYEtIOzxFz8cKGc1su', '49063ede-8e67-429e-87f6-2f291cba1203', 'd73abe8b-8e95-4103-93fe-ceb0c7538588', 'es-PR', 0, '{}'::jsonb, '2025-10-24T16:05:54.385+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('0a365a85-4927-4b25-bcea-07e161d9e48a', 'sess_CUEXBXsjyvcCXCl7ElBQ3', '49063ede-8e67-429e-87f6-2f291cba1203', '424aed2b-89f0-455b-a80a-70e994fa93c7', 'es-PR', 0, '{}'::jsonb, '2025-10-24T16:02:25.615+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d515025d-686b-4cf9-ad3d-a27df82e68f0', 'sess_CUEUGG9PObsB0f9cr3Cuf', '49063ede-8e67-429e-87f6-2f291cba1203', '94825923-f269-4a83-ac2f-050535ee5401', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:59:24.419+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('89b8a830-ba95-42ae-b314-bfa7b6e2491f', 'sess_CUESKDG200V14wA4bdi0G', '49063ede-8e67-429e-87f6-2f291cba1203', 'd793c866-60fa-4078-960b-4a1b12d48b6a', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:57:24.814+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('b69691f3-7082-4e85-860e-1fe975d4543e', 'sess_CUEOk2fSL9SmvGc9D9XPq', '49063ede-8e67-429e-87f6-2f291cba1203', '2c26161f-b0ec-4255-a2b4-0b244b65ab8c', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:53:42.275+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a684724b-cbc1-4fbf-aeb3-af90bf88cb62', 'sess_CUENzmoq3DWwWfq3pBkpO', '49063ede-8e67-429e-87f6-2f291cba1203', 'fb73cdf7-da28-49a1-a7da-bd51002a00d1', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:52:55.32+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('82e34499-5592-4071-aa67-e9a13943744b', 'sess_CUEJWAI64o4ItjM9yMszH', '49063ede-8e67-429e-87f6-2f291cba1203', 'a7080766-858e-4369-b1cc-77b44cf2a1ef', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:48:19.079+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('ccaaf824-0deb-4bd7-8f07-3cf3cca45516', 'sess_CUEHhGj408FdgOeaJ4VMR', '49063ede-8e67-429e-87f6-2f291cba1203', '4925e5a0-c55f-474d-bdbc-500a0666e76c', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:46:25.316+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('5a230363-745b-474d-b2ff-a12930883e73', 'sess_CUEGd4GbS6UtkGZgK5nUs', '49063ede-8e67-429e-87f6-2f291cba1203', '4925e5a0-c55f-474d-bdbc-500a0666e76c', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:45:19.288+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('f2e1c671-2672-45e0-b0e3-3ccbbcf26de8', 'sess_CUE3VDMYXXQZf8y2kRG7L', '49063ede-8e67-429e-87f6-2f291cba1203', '0497a424-66cd-4092-9e59-b919c1c95295', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:31:46.011+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('25f53204-cb82-4e0a-975d-6e162286f6da', 'sess_CUDyMSQ1muwYZ4YHPnpe4', '49063ede-8e67-429e-87f6-2f291cba1203', '94dda21f-1198-4395-b64c-7c398f1c669f', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:26:26.133+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('ff0f58b9-f789-42b1-86f0-1300be9a90ba', 'sess_CUDwNhjVJqbn2mI02mw5I', '49063ede-8e67-429e-87f6-2f291cba1203', '94dda21f-1198-4395-b64c-7c398f1c669f', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:24:23.54+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c0f97ff6-855f-4683-b046-f565927aba7f', 'sess_CUDlbWekUzTUqzD7HBnri', '49063ede-8e67-429e-87f6-2f291cba1203', '94dda21f-1198-4395-b64c-7c398f1c669f', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:13:15.272+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('23bed9cc-9b58-4fdd-ba14-088f625de2d6', 'sess_CUDebiUMXn2dQzp5jzJ1G', '49063ede-8e67-429e-87f6-2f291cba1203', 'dd86680d-7cc3-4c32-94ad-8c0fac1fd502', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:06:01.201+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('f9b67a67-2bf4-4cfc-be32-63958732e0ed', 'sess_CUDbldRnc4LrTpZXvrZm5', '49063ede-8e67-429e-87f6-2f291cba1203', 'e8351a27-ed8d-4b14-a42a-fcb9f42cd578', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:03:05.462+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('252fdd9d-eae4-469e-90fd-495398401469', 'sess_CUDZ4rTFk35cKt5UGcsNH', '49063ede-8e67-429e-87f6-2f291cba1203', 'e453e41b-9f9a-45b6-9f61-869305db1bc0', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:00:18.387+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('b84dfbe1-0bac-46c6-9d64-19e1f9c8996a', 'sess_CUDMEMiRosdo3uw8dwfaT', '49063ede-8e67-429e-87f6-2f291cba1203', '4ada5515-257a-4c4c-815f-477eeb55c41b', 'es-PR', 0, '{}'::jsonb, '2025-10-24T14:47:02.316+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('5691a1db-cf92-4535-8bbb-52ec622c056f', 'sess_CUDLecUltMM40n5hpRCX5', '49063ede-8e67-429e-87f6-2f291cba1203', '377128aa-75d6-4aee-a7a2-77d1384954ac', 'es-PR', 0, '{}'::jsonb, '2025-10-24T14:46:26.75+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('9d60587c-82e1-41a7-b155-77187a260867', 'sess_CUDLSZc0Q5l5ERKWbaL1B', '9e53641e-fed6-4b8d-9551-191d64b02f06', '5044bc15-a303-4007-9fb8-1cf3db677cb4', 'es-PR', 0, '{}'::jsonb, '2025-10-24T14:46:14.652+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('39a756ba-c73f-4e11-9471-5f2f67482309', 'sess_CUDKhNIrMxasOR8BLXI6V', '9e53641e-fed6-4b8d-9551-191d64b02f06', '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 'es-PR', 0, '{}'::jsonb, '2025-10-24T14:45:28.038+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('bf0e3660-6ca9-4735-9ee7-059450d57e04', 'sess_CUDKWOYnnwkuxI8uNjAtU', '9e53641e-fed6-4b8d-9551-191d64b02f06', 'c7d30040-c801-4eb9-870f-a9936cf3e940', 'es-PR', 0, '{}'::jsonb, '2025-10-24T14:45:16.271+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('ed0f0108-b87e-48e1-9957-f8b9fa68c720', 'sess_CUDKPS5XZwaNG2BcGKLRz', '9e53641e-fed6-4b8d-9551-191d64b02f06', '586c1835-bb64-40fa-98b8-a2180c338a18', 'en', 0, '{}'::jsonb, '2025-10-24T14:45:10.085+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17');

INSERT INTO public.voice_sessions ("id", "session_id", "student_id", "assessment_id", "language", "grade_level", "metrics", "created_at", "ended_at", "model") VALUES
  ('130fcd63-4adb-41b7-aba9-32141eaac4fd', 'sess_CUDJotSqWPNRqCRCqXMvi', '49063ede-8e67-429e-87f6-2f291cba1203', '377128aa-75d6-4aee-a7a2-77d1384954ac', 'es-PR', 0, '{}'::jsonb, '2025-10-24T14:44:33.026+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('2ca9f089-fa9d-41e0-b567-e95feb05f831', 'sess_CUDJ35uOm9qzgel3tpGfK', '49063ede-8e67-429e-87f6-2f291cba1203', '377128aa-75d6-4aee-a7a2-77d1384954ac', 'es-PR', 0, '{}'::jsonb, '2025-10-24T14:43:45.384+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('3be50575-4623-4e04-8233-2bbea13bf867', 'sess_CUDHcEgdplW6fj7lKzX85', '49063ede-8e67-429e-87f6-2f291cba1203', 'd4f06982-3811-4c49-8917-bf807cae2838', 'es-PR', 0, '{}'::jsonb, '2025-10-24T14:42:17.029+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('1efaf7eb-be79-421f-888c-51ab52509038', 'sess_CUDF4EI5yrSiAU0PaMJLr', '49063ede-8e67-429e-87f6-2f291cba1203', '4ada5515-257a-4c4c-815f-477eeb55c41b', 'es-PR', 0, '{}'::jsonb, '2025-10-24T14:39:38.746+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('bed600dc-abd3-4521-9474-4e8e49f399e4', 'sess_CUDBEGMRuLYUoZuWMEztV', '49063ede-8e67-429e-87f6-2f291cba1203', '5f048380-5df3-4c4c-9136-387b5d7ee93f', 'es-PR', 0, '{}'::jsonb, '2025-10-24T14:35:40.659+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('57e2159f-adc2-455d-a86b-f91a68f04d5a', 'sess_CUCa9JZuzkGpkWSu82Igw', '49063ede-8e67-429e-87f6-2f291cba1203', '13edce80-44b7-459e-8131-ac723cdc8dc0', 'es-PR', 0, '{}'::jsonb, '2025-10-24T13:57:21.98+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('53aa42c6-24ef-4635-be80-9e3aad4af1cc', 'sess_CUCXRNsZplTnpDoTyURSC', '49063ede-8e67-429e-87f6-2f291cba1203', '1b196b53-6035-48f5-9d04-4a5c52ad4b00', 'es-PR', 0, '{}'::jsonb, '2025-10-24T13:54:33.415+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('75d78978-2ea6-44a0-86cc-69eed5fecf07', 'sess_CUCSzYwhs9WrOUFDOTMqX', '9e53641e-fed6-4b8d-9551-191d64b02f06', '8953b8be-a9d1-48d0-9854-3b6832c84a57', 'en', 0, '{}'::jsonb, '2025-10-24T13:49:57.218+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('dfde9f55-08f6-4eb7-9979-0d676db846de', 'sess_CUCQXuncHWlRdqkrq0e6C', '49063ede-8e67-429e-87f6-2f291cba1203', '064f750f-7996-4d72-9ea2-3ce73da73891', 'es-PR', 0, '{}'::jsonb, '2025-10-24T13:47:25.58+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('f9fd53ec-0829-43ee-8679-b798ea76b2d2', 'sess_CUCHDGxRBRM9oXvEqv4Ht', '49063ede-8e67-429e-87f6-2f291cba1203', '0c51de8c-e26a-4138-a438-487be06fd8d9', 'es-PR', 0, '{}'::jsonb, '2025-10-24T13:37:48.042+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('e42c0151-2c9a-4d17-990c-bce1f3119891', 'sess_CUCG6jDiABsDrPdbp5C0h', '49063ede-8e67-429e-87f6-2f291cba1203', '0c51de8c-e26a-4138-a438-487be06fd8d9', 'es-PR', 0, '{}'::jsonb, '2025-10-24T13:36:39.102+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('474eb6b5-0d62-4232-a0e8-4864df1ef7cb', 'sess_CUCAQimGYVNQpoh2weNlD', '49063ede-8e67-429e-87f6-2f291cba1203', '55dfdda5-9fce-4e70-b8c2-a6e8a0c4d6be', 'es-PR', 0, '{}'::jsonb, '2025-10-24T13:30:46.586+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('4724211a-69db-4b9f-b0ab-6966ae621cf9', 'sess_CUC6WmzWomjtTUYjX0OFr', '49063ede-8e67-429e-87f6-2f291cba1203', 'b8234b01-b004-47d9-b1b2-aaac2b9a5db8', 'es-PR', 0, '{}'::jsonb, '2025-10-24T13:26:44.656+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('36a6e766-a472-455f-9489-e567582772d1', 'sess_CUC4fKN7duQlKoqNaxVI1', '49063ede-8e67-429e-87f6-2f291cba1203', '7728050d-4bf5-4c84-93fe-f2d678994b80', 'es-PR', 0, '{}'::jsonb, '2025-10-24T13:24:49.314+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('7734dc0e-858a-442e-bae8-82207b2810f7', 'sess_CUC2D5J2ASREAWR5BbNE7', '49063ede-8e67-429e-87f6-2f291cba1203', '8953b8be-a9d1-48d0-9854-3b6832c84a57', 'en', 0, '{}'::jsonb, '2025-10-24T13:22:17.677+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('0451440c-436a-49b5-8d8d-b6d01c5709d6', 'sess_CUBvAuV5OzPjhrx63eAtl', '49063ede-8e67-429e-87f6-2f291cba1203', '4abaa9ab-6c58-43cc-8c26-8b234de74985', 'es-PR', 0, '{}'::jsonb, '2025-10-24T13:15:00.68+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('b8999ed1-2f80-46d9-8b0f-90d919500638', 'sess_CUBuuj0hNd7MPhiXFkfXY', '49063ede-8e67-429e-87f6-2f291cba1203', '9f750023-c594-4c14-85c8-d94f61f67108', 'es-PR', 0, '{}'::jsonb, '2025-10-24T13:14:44.678+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('1a726640-4d96-4d4c-9da1-ea4f50fba85c', 'sess_CUB2RuFsjiBtd6VaqaZXm', '49063ede-8e67-429e-87f6-2f291cba1203', '0497a424-66cd-4092-9e59-b919c1c95295', 'es-PR', 0, '{}'::jsonb, '2025-10-24T12:18:27.416+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('7f068f72-618a-4993-bccc-ddc116b5eab8', 'sess_CUAz6nneFQBz73hlHDnu7', '49063ede-8e67-429e-87f6-2f291cba1203', 'b93f79c6-0e61-45c4-b0ed-5d068c4e10aa', 'es-PR', 0, '{}'::jsonb, '2025-10-24T12:15:00.946+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('14a55db7-92eb-4391-99a1-6e0d851329d8', 'sess_CUAmmYnAiJr78QMK5rrve', '49063ede-8e67-429e-87f6-2f291cba1203', '2c26161f-b0ec-4255-a2b4-0b244b65ab8c', 'es-PR', 0, '{}'::jsonb, '2025-10-24T12:02:16.282+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('8f46cd1a-43c9-498c-be36-7699eb06115a', 'sess_CUAjSlHqVVngMgn9aXFyG', '49063ede-8e67-429e-87f6-2f291cba1203', '2c26161f-b0ec-4255-a2b4-0b244b65ab8c', 'es-PR', 0, '{}'::jsonb, '2025-10-24T11:58:50.392+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c7ee5ba7-539f-4a8f-aeb2-24253795512d', 'sess_CUAhGKrp7uCs9XVxOba4S', '49063ede-8e67-429e-87f6-2f291cba1203', '2c26161f-b0ec-4255-a2b4-0b244b65ab8c', 'es-PR', 0, '{}'::jsonb, '2025-10-24T11:56:34.779+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('298ffbda-67e6-4696-b2dc-83ebf1d0936e', 'sess_CUAbX2oiZ85AfWjoD4qGL', '49063ede-8e67-429e-87f6-2f291cba1203', '72e31595-8d66-4e19-b295-bca77788b801', 'es-PR', 0, '{}'::jsonb, '2025-10-24T11:50:39.763+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('556d18dc-2457-4388-addf-ac5fe40ecc95', 'sess_CUAK01EJje3L5E9DA1bla', '49063ede-8e67-429e-87f6-2f291cba1203', 'b7d5189f-2d9b-42b7-9cab-871c670591d5', 'es-PR', 0, '{}'::jsonb, '2025-10-24T11:32:32.881+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('48e9dbf0-73a8-467e-b513-5e0542a0306a', 'sess_CUAD9XkpD2TH2bNYqHevW', '49063ede-8e67-429e-87f6-2f291cba1203', '333764ec-545a-4672-881c-f21583827bdb', 'es-PR', 0, '{}'::jsonb, '2025-10-24T11:25:27.961+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('023fbce1-2b29-47b1-9027-68306af13e45', 'sess_CUAC3vA8GIkwPR1lKhnjY', '49063ede-8e67-429e-87f6-2f291cba1203', 'f78bb86d-15f4-4318-a784-cac094b65703', 'es-PR', 0, '{}'::jsonb, '2025-10-24T11:24:19.804+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('8562a2df-c9e7-4426-af2a-172afe056319', 'sess_CUA9yQHrS9SbJzDLtuGzm', '49063ede-8e67-429e-87f6-2f291cba1203', '4104168b-b2ab-467c-b95b-0b796a88fe2a', 'es-PR', 0, '{}'::jsonb, '2025-10-24T11:22:10.262+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('518a8d0d-9685-4d3c-8e60-eefbfd777b54', 'sess_CUA47VHeQqrOSzmgNTVNl', '9e53641e-fed6-4b8d-9551-191d64b02f06', '586c1835-bb64-40fa-98b8-a2180c338a18', 'en', 0, '{}'::jsonb, '2025-10-24T11:16:07.838+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('077a3764-eff1-4921-9e05-0f72bd1f2a3c', 'sess_CUA3C9KBTeYUM4gUAOFPD', '9e53641e-fed6-4b8d-9551-191d64b02f06', '586c1835-bb64-40fa-98b8-a2180c338a18', 'en', 0, '{}'::jsonb, '2025-10-24T11:15:10.441+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('f49e7780-2a49-4168-831d-8aadb4aa4338', 'sess_CU9tPImjCr1iWNYfV1WIH', '49063ede-8e67-429e-87f6-2f291cba1203', 'b7d5189f-2d9b-42b7-9cab-871c670591d5', 'es-PR', 0, '{}'::jsonb, '2025-10-24T11:05:03.658+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('8c1c76d0-a33c-4e4e-a49a-368dbd549a50', 'sess_CU9tF2iadpuHFRuWR0hDY', '49063ede-8e67-429e-87f6-2f291cba1203', 'b7d5189f-2d9b-42b7-9cab-871c670591d5', 'es-PR', 0, '{}'::jsonb, '2025-10-24T11:04:53.789+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('8c70ec54-3f5e-4590-9f3d-068423f41a7d', 'sess_CU9rdBTyvwOHL7IwIYnKB', '49063ede-8e67-429e-87f6-2f291cba1203', 'b7d5189f-2d9b-42b7-9cab-871c670591d5', 'es-PR', 0, '{}'::jsonb, '2025-10-24T11:03:13.555+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d6164ce7-0d58-4ff4-9b92-060700891c58', 'sess_CU9LCAEJ6EHhTvgUKeNYK', '49063ede-8e67-429e-87f6-2f291cba1203', '850ffa0d-c9e1-469b-8d07-6cfc63c3f62e', 'es-PR', 0, '{}'::jsonb, '2025-10-24T10:29:42.81+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a6ad273e-a137-45ca-8d54-ba60ad94d1df', 'sess_CU9Ju3C2NDM4eBEWxBNsp', '49063ede-8e67-429e-87f6-2f291cba1203', '850ffa0d-c9e1-469b-8d07-6cfc63c3f62e', 'es-PR', 0, '{}'::jsonb, '2025-10-24T10:28:22.87+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a5627d21-7c79-47ea-8cac-1666228e745d', 'sess_CU8mI2UgYEcHsukrpaoG6', '49063ede-8e67-429e-87f6-2f291cba1203', '8133e265-0047-43bd-8d12-00afb2dd3946', 'es-PR', 0, '{}'::jsonb, '2025-10-24T09:53:38.497+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('146f34d1-46d1-4e50-bc46-14fc80de7e90', 'sess_CU8lapAIBDfYVh275XhrS', '49063ede-8e67-429e-87f6-2f291cba1203', '8133e265-0047-43bd-8d12-00afb2dd3946', 'es-PR', 0, '{}'::jsonb, '2025-10-24T09:52:54.704+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('30d14939-85a0-4b18-8cc3-c08de9faee94', 'sess_CU8kZBPxVPSpbHSqoS1zu', '49063ede-8e67-429e-87f6-2f291cba1203', '8133e265-0047-43bd-8d12-00afb2dd3946', 'es-PR', 0, '{}'::jsonb, '2025-10-24T09:51:52.101+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('07b7e3b0-91f4-4974-8a59-64724389a988', 'sess_CU8fFFOA4actzOEHAbkNb', '49063ede-8e67-429e-87f6-2f291cba1203', '0e830479-fc0e-4896-ae05-e2aaadbb0e70', 'es-PR', 0, '{}'::jsonb, '2025-10-24T09:46:21.428+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('7281e3a4-52d9-440b-ba80-646eb14960c7', 'sess_CU86PCTRzUaV36NnSdcny', '49063ede-8e67-429e-87f6-2f291cba1203', '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 'es-PR', 0, '{}'::jsonb, '2025-10-24T09:10:21.961+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('1f3ca0b9-7e5e-4c55-bc99-d869aa9b7a3d', 'sess_CU6pvgWUx411F1ZGLKePA', '49063ede-8e67-429e-87f6-2f291cba1203', '8b2ab422-87ed-4d1a-abe0-3a774fedb521', 'es-PR', 0, '{}'::jsonb, '2025-10-24T07:49:15.32+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('b54e835f-06b5-4504-baa9-2b978d3aa818', 'sess_CU6o26nuHoDpsqmGE2rsh', '49063ede-8e67-429e-87f6-2f291cba1203', 'a08bce22-7cd6-472e-b9ad-653042fa2281', 'es-PR', 0, '{}'::jsonb, '2025-10-24T07:47:18.446+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('f8cdf65c-a565-4941-8cfe-4f2a10544568', 'sess_CU6mafenha2LjDeCvxupC', '49063ede-8e67-429e-87f6-2f291cba1203', 'a08bce22-7cd6-472e-b9ad-653042fa2281', 'es-PR', 0, '{}'::jsonb, '2025-10-24T07:45:48.759+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('18ba7a71-74de-4344-999d-ff387af4a07a', 'sess_CU6mBhDuQUjb9YsfDAC5y', '49063ede-8e67-429e-87f6-2f291cba1203', '72e31595-8d66-4e19-b295-bca77788b801', 'es-PR', 0, '{}'::jsonb, '2025-10-24T07:45:23.642+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('34596322-3a58-4a9f-9f9e-df0a935805d8', 'sess_CTuVhBI6DhyN6Z9JUj7JP', '49063ede-8e67-429e-87f6-2f291cba1203', '2489a943-75a2-4603-a022-f7391f77e321', 'es-PR', 0, '{}'::jsonb, '2025-10-23T18:39:33.714+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('5c64415e-bad2-4e9a-89c5-b526e786d10e', 'sess_CTuQjSl0Z6pWINHoh87QR', '49063ede-8e67-429e-87f6-2f291cba1203', '2489a943-75a2-4603-a022-f7391f77e321', 'es-PR', 0, '{}'::jsonb, '2025-10-23T18:34:25.828+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('042d334d-bb5e-4733-8807-4eab1b05faae', 'sess_CTuBhaCpLZVZSnoHGONpp', '49063ede-8e67-429e-87f6-2f291cba1203', 'bf0c238d-5d8d-4dd9-9de2-dd84b4149f71', 'es-PR', 0, '{}'::jsonb, '2025-10-23T18:18:53.79+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('796d64f4-c0c5-47c1-81fd-87404e507792', 'sess_CTu2Xw8o4CyZnpsA7Iy9R', '49063ede-8e67-429e-87f6-2f291cba1203', '333764ec-545a-4672-881c-f21583827bdb', 'es-PR', 0, '{}'::jsonb, '2025-10-23T18:09:25.165+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('ae38e491-f01a-41ac-8698-cb54972bdee1', 'sess_CTu16qBGu9bqTYRcWF15Q', '49063ede-8e67-429e-87f6-2f291cba1203', 'ffd27da9-cfd0-4d76-bcda-8ae295b06064', 'es-PR', 0, '{}'::jsonb, '2025-10-23T18:07:56.346+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('1aabbffd-30f3-4727-9403-876d4c58076e', 'sess_CTtyI1MtoEDk3b2MOTeiu', '49063ede-8e67-429e-87f6-2f291cba1203', '8127471e-d6dc-4383-a26c-e03eeef59ed8', 'es-PR', 0, '{}'::jsonb, '2025-10-23T18:05:02.96+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('48563aeb-444a-4280-ba7f-3381119f1896', 'sess_CTtvJrx3xYG3LiLQ7Zqzd', '49063ede-8e67-429e-87f6-2f291cba1203', 'bf0c238d-5d8d-4dd9-9de2-dd84b4149f71', 'es-PR', 0, '{}'::jsonb, '2025-10-23T18:01:57.537+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('4dedf6a2-e96a-47c4-a336-ab587b6b273b', 'sess_CTtrOodHKYSfVNzqMc754', '49063ede-8e67-429e-87f6-2f291cba1203', 'ffd27da9-cfd0-4d76-bcda-8ae295b06064', 'es-PR', 0, '{}'::jsonb, '2025-10-23T17:57:54.823+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a9a29ac0-abc5-4dad-ba5f-6d5040ea8f45', 'sess_CTtfBYjQNea79avOAykCY', '49063ede-8e67-429e-87f6-2f291cba1203', 'ffd27da9-cfd0-4d76-bcda-8ae295b06064', 'es-PR', 0, '{}'::jsonb, '2025-10-23T17:45:17.147+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('1a542328-4e4e-465d-939b-d9c3bee34a3d', 'sess_CTtcZCKjcmmNw6U7KcICJ', '49063ede-8e67-429e-87f6-2f291cba1203', 'a08bce22-7cd6-472e-b9ad-653042fa2281', 'es-PR', 0, '{}'::jsonb, '2025-10-23T17:42:35.132+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('87c6bd84-829f-47b4-b1b6-d2bb1af48a56', 'sess_CTsObgKdRonpxA8RnRzwg', '49063ede-8e67-429e-87f6-2f291cba1203', NULL, 'es-PR', 0, '{}'::jsonb, '2025-10-23T16:24:05.456+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('b71cee78-c411-478c-b5d3-aee5d8d1f6e3', 'sess_CTqQi5SXhPhOwiKS8gWV9', '49063ede-8e67-429e-87f6-2f291cba1203', '8b2ab422-87ed-4d1a-abe0-3a774fedb521', 'es-PR', 0, '{}'::jsonb, '2025-10-23T14:18:08.414+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('648e5967-d724-47bd-9b5d-91987135f636', 'sess_CTqQat0QgsPiz7jartERz', '49063ede-8e67-429e-87f6-2f291cba1203', '55dfdda5-9fce-4e70-b8c2-a6e8a0c4d6be', 'es-PR', 0, '{}'::jsonb, '2025-10-23T14:18:00.78+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('9360154a-9e1d-4618-ac6c-26bad802704d', 'sess_CTqIhIUKDR9ltoyo5ZFkm', '49063ede-8e67-429e-87f6-2f291cba1203', '72e31595-8d66-4e19-b295-bca77788b801', 'es-PR', 0, '{}'::jsonb, '2025-10-23T14:09:51.338+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('079210b7-3afa-4936-b0f0-3b9c96a6de6c', 'sess_CTqIIehGdsPnOuBzPVWhO', '49063ede-8e67-429e-87f6-2f291cba1203', '55dfdda5-9fce-4e70-b8c2-a6e8a0c4d6be', 'es-PR', 0, '{}'::jsonb, '2025-10-23T14:09:26.457+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('3aa82f39-c9df-4baf-b49f-df3df793558b', 'sess_CTqHkyG6HRo2F5oNbpidK', '49063ede-8e67-429e-87f6-2f291cba1203', '8b2ab422-87ed-4d1a-abe0-3a774fedb521', 'es-PR', 0, '{}'::jsonb, '2025-10-23T14:08:52.234+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('3dd95841-337f-49c3-af52-e02e9c1014b5', 'sess_CTqHEPprAYqzAtVedCNYP', '49063ede-8e67-429e-87f6-2f291cba1203', '55dfdda5-9fce-4e70-b8c2-a6e8a0c4d6be', 'es-PR', 0, '{}'::jsonb, '2025-10-23T14:08:20.437+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('dbbbecdb-70dd-4be1-84a7-679966421b97', 'sess_CTqGhphknXjZS8tLfO93u', '49063ede-8e67-429e-87f6-2f291cba1203', '960797e1-1d11-46ee-9b57-db58a77dd46b', 'es-PR', 0, '{}'::jsonb, '2025-10-23T14:07:47.758+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c027a463-fca8-4ff4-a59e-76ed36f75eff', 'sess_CTqFiPcoTEND6U5THwOaG', '49063ede-8e67-429e-87f6-2f291cba1203', NULL, 'es-PR', 0, '{}'::jsonb, '2025-10-23T14:06:46.421+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('2dc737f1-01c9-4d58-a0fc-61468faad8ab', 'sess_CTqFQYGiW38IJpdAWTdpK', '9e53641e-fed6-4b8d-9551-191d64b02f06', NULL, 'es-PR', 0, '{}'::jsonb, '2025-10-23T14:06:28.996+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a3ce8e60-8e30-47dd-90b2-2b56baedb3ae', 'sess_CTqFAKlusLbpotN7YrWft', '9e53641e-fed6-4b8d-9551-191d64b02f06', NULL, 'es-PR', 0, '{}'::jsonb, '2025-10-23T14:06:13.054+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('6143b189-40f4-4cea-95f4-fa9e2fd2ef11', 'sess_CTq7qYL61EqZEjlQJI25d', '49063ede-8e67-429e-87f6-2f291cba1203', '55dfdda5-9fce-4e70-b8c2-a6e8a0c4d6be', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:58:39.035+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('ba25559d-06cf-466a-a993-c72b2c6c8252', 'sess_CTq5aR8Xhk0q142zvFRiH', '49063ede-8e67-429e-87f6-2f291cba1203', '960797e1-1d11-46ee-9b57-db58a77dd46b', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:56:18.182+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('726e9c6c-2a50-4e38-a6f7-e40bab3018c2', 'sess_CTq30cJEXqbS07leuRheM', '49063ede-8e67-429e-87f6-2f291cba1203', 'ce7296f9-3a95-4ee6-aa80-99844fccc79a', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:53:38.498+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('34d54839-5fc1-47f5-a31d-033743fa2301', 'sess_CTq0OABTE5xGGkgPzf0Ij', '49063ede-8e67-429e-87f6-2f291cba1203', '5059569e-5e56-4b1a-929f-f7f8e4960f0b', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:50:56.998+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('aa34ec06-9f89-4dc7-b0ff-04ca041e2000', 'sess_CTpzPExWAeG6mLn17ukm6', '49063ede-8e67-429e-87f6-2f291cba1203', '5059569e-5e56-4b1a-929f-f7f8e4960f0b', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:49:55.385+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('ee75eea4-7d19-4e6e-9568-933d37c943c4', 'sess_CTpyXYXlyYwHAlqaRCTV7', '49063ede-8e67-429e-87f6-2f291cba1203', '5059569e-5e56-4b1a-929f-f7f8e4960f0b', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:49:01.771+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('bfeb178e-c508-4dcf-bf67-0f5541d4de96', 'sess_CTpx6iU7rX4zI79k9aeIa', '49063ede-8e67-429e-87f6-2f291cba1203', '5059569e-5e56-4b1a-929f-f7f8e4960f0b', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:47:32.381+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('4565038a-0efa-4c03-bc47-c567e29d7871', 'sess_CTpv2x5hulCc32vFRwd4M', '49063ede-8e67-429e-87f6-2f291cba1203', '72e31595-8d66-4e19-b295-bca77788b801', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:45:24.247+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d94bc13e-29ae-4ec3-934c-22db36800ab7', 'sess_CTpuGk0gI6xhVVu3aPvgv', '49063ede-8e67-429e-87f6-2f291cba1203', '72e31595-8d66-4e19-b295-bca77788b801', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:44:36.732+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a88b70bb-8aa2-46cc-9e4c-548ae12c9fbd', 'sess_CTptrZyhgSfH18LjwrXdJ', '49063ede-8e67-429e-87f6-2f291cba1203', '72e31595-8d66-4e19-b295-bca77788b801', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:44:11.989+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a5d55f80-a89c-4675-aad3-9abb572a7c06', 'sess_CTpt79VgWZw4s3sDg9zBD', '49063ede-8e67-429e-87f6-2f291cba1203', '72e31595-8d66-4e19-b295-bca77788b801', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:43:25.157+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c3c516fa-792f-469b-a591-a3b3684a7efc', 'sess_CTpsOHngjQMNnCr6PpDYJ', '49063ede-8e67-429e-87f6-2f291cba1203', '72e31595-8d66-4e19-b295-bca77788b801', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:42:40.263+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('3e45f4ec-18fa-4ce8-9c44-b32621908a94', 'sess_CTpq1UAy8dcwbiyRRI4lN', '49063ede-8e67-429e-87f6-2f291cba1203', '72e31595-8d66-4e19-b295-bca77788b801', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:40:13.112+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('601ba7cb-49dc-4ddb-8c42-edc041a6e100', 'sess_CTpg2ufxpGlBQPR6npdJr', '49063ede-8e67-429e-87f6-2f291cba1203', '72e31595-8d66-4e19-b295-bca77788b801', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:29:54.56+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('29851174-eaf7-4e79-a5e6-507700f817e4', 'sess_CTpcbrNCyoMXi0LmA4htr', '49063ede-8e67-429e-87f6-2f291cba1203', '8b2ab422-87ed-4d1a-abe0-3a774fedb521', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:26:21.262+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('4e6e3cf9-8cb5-4e3e-97da-8000376d3996', 'sess_CTpHheuJ5wDr7PcKVjwRJ', '49063ede-8e67-429e-87f6-2f291cba1203', '90874df8-6288-4123-8c82-fa4211e10c8d', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:04:45.712+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('ce99338f-a2cc-4322-a6d8-1d2c225eed79', 'sess_CTpH8db8GGd7QN982XDMv', '49063ede-8e67-429e-87f6-2f291cba1203', 'ad89a19b-d78b-40b7-af35-89f8b2455fd8', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:04:10.408+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('fe79ee15-5a50-4aa5-9517-86921e10bf4a', 'sess_CTpFqZGPziWU6IOjqP8iL', '49063ede-8e67-429e-87f6-2f291cba1203', '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:02:50.977+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d525575b-b3a0-434f-a474-b54b7feabb17', 'sess_CTpFm83YAKUxNBge0wcsv', '49063ede-8e67-429e-87f6-2f291cba1203', '7a4c5c98-43a9-47bf-ba89-405aa64a8ced', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:02:46.308+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('78fa513b-af25-4895-8c9a-c66625a84b2c', 'sess_CTp2LKNTRod9uKRCUqxoi', '49063ede-8e67-429e-87f6-2f291cba1203', '6c6d2c8b-9405-43f0-9ca2-92b26d99ce63', 'es-PR', 0, '{}'::jsonb, '2025-10-23T12:48:53.982+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('6d70c7b0-b40e-4540-95c7-b06b1396fdcc', 'sess_CTp1elwDDWG0zzji5QHOl', '49063ede-8e67-429e-87f6-2f291cba1203', 'e8351a27-ed8d-4b14-a42a-fcb9f42cd578', 'es-PR', 0, '{}'::jsonb, '2025-10-23T12:48:11.093+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('dd526d6c-e4a8-48f9-b868-e6b18b7e6956', 'sess_CTp1W1gqWlrNL3usJzv7x', '49063ede-8e67-429e-87f6-2f291cba1203', 'a25bca99-610e-4a7b-a9a0-3f0051763bd8', 'es-PR', 0, '{}'::jsonb, '2025-10-23T12:48:02.398+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d34c8bcd-f795-409c-957c-e2af1dcde6e5', 'sess_CTp19UBNCXv5BLNDKTb8l', '49063ede-8e67-429e-87f6-2f291cba1203', 'a25bca99-610e-4a7b-a9a0-3f0051763bd8', 'es-PR', 0, '{}'::jsonb, '2025-10-23T12:47:39.124+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('b8c42a2b-ee73-4506-b1ba-a5c5f01942f2', 'sess_CTp0LQcXGt2QxksLmjpAJ', '49063ede-8e67-429e-87f6-2f291cba1203', '7a4c5c98-43a9-47bf-ba89-405aa64a8ced', 'es-PR', 0, '{}'::jsonb, '2025-10-23T12:46:49.129+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('3f0b04df-f9a1-4d5c-a242-6d537c951e73', 'sess_CTp09umLUgysdlMYSvzxY', '49063ede-8e67-429e-87f6-2f291cba1203', '7a4c5c98-43a9-47bf-ba89-405aa64a8ced', 'es-PR', 0, '{}'::jsonb, '2025-10-23T12:46:37.7+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('97e21003-42cb-46ea-a2ce-03861039adcb', 'sess_CTozNwZ4E6CGGKlafT5sj', '49063ede-8e67-429e-87f6-2f291cba1203', '7a4c5c98-43a9-47bf-ba89-405aa64a8ced', 'es-PR', 0, '{}'::jsonb, '2025-10-23T12:45:49.383+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('fa3f5ae3-dfec-41cf-b878-dbec937ed91b', 'sess_CToqRBdoDDUYMBv8XeAy3', '49063ede-8e67-429e-87f6-2f291cba1203', '90874df8-6288-4123-8c82-fa4211e10c8d', 'es-PR', 0, '{}'::jsonb, '2025-10-23T12:36:35.836+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('529f5d5e-4a49-4444-b5ab-bda2d579e825', 'sess_CTo2rJeTS6GswmUPan384', '49063ede-8e67-429e-87f6-2f291cba1203', '7a4c5c98-43a9-47bf-ba89-405aa64a8ced', 'es-PR', 0, '{}'::jsonb, '2025-10-23T11:45:21.699+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('3181f629-6d68-4fe6-90cd-5ca8dfee9308', 'sess_CTnqIutgjbNV6jjGW7Mk0', '9e53641e-fed6-4b8d-9551-191d64b02f06', '586c1835-bb64-40fa-98b8-a2180c338a18', 'en', 0, '{}'::jsonb, '2025-10-23T11:32:22.394+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('8aa7caa5-75c1-4bd3-b6a0-6770fe598155', 'sess_CTmZKuFfBSloOPZQc9H2C', '49063ede-8e67-429e-87f6-2f291cba1203', '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', 'es-PR', 0, '{}'::jsonb, '2025-10-23T10:10:46.717+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('8869c299-c5e9-479e-801b-0f1a71021d42', 'sess_CTmXrDR6zAg7CshmcZia0', '49063ede-8e67-429e-87f6-2f291cba1203', 'a25bca99-610e-4a7b-a9a0-3f0051763bd8', 'es-PR', 0, '{}'::jsonb, '2025-10-23T10:09:15.183+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('963ec720-a58a-4f3c-bf20-1e6e2d0173ef', 'sess_CTmXL4DqTGLqplTNKkkbM', '49063ede-8e67-429e-87f6-2f291cba1203', 'a25bca99-610e-4a7b-a9a0-3f0051763bd8', 'es-PR', 0, '{}'::jsonb, '2025-10-23T10:08:43.364+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('3e930ceb-68d4-4bcb-8f63-0bb2f467b9ca', 'sess_CTmWi5jKe8e3XOTrcKAOV', '9e53641e-fed6-4b8d-9551-191d64b02f06', '586c1835-bb64-40fa-98b8-a2180c338a18', 'en', 0, '{}'::jsonb, '2025-10-23T10:08:05.016+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('43f359ee-698a-4acf-aec7-1e75d435e7cc', 'sess_CTkp5uPMQjw9dQDkv7vWS', '9e53641e-fed6-4b8d-9551-191d64b02f06', '586c1835-bb64-40fa-98b8-a2180c338a18', 'en', 0, '{}'::jsonb, '2025-10-23T08:18:56.006+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('883fc9e9-f7c2-4e0d-88c2-81b2cfe574d1', 'sess_CTjvmIwkoUZCyGjwBX6Z1', '49063ede-8e67-429e-87f6-2f291cba1203', '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', 'es-PR', 0, '{}'::jsonb, '2025-10-23T07:21:47.083+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('01ba92e8-1adf-4737-8f96-61a070f4ae8c', 'sess_CTgCFqshFHkUDvWE9sZTW', '49063ede-8e67-429e-87f6-2f291cba1203', '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:22:31.663+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17');

INSERT INTO public.voice_sessions ("id", "session_id", "student_id", "assessment_id", "language", "grade_level", "metrics", "created_at", "ended_at", "model") VALUES
  ('42492bd4-e7ac-4d8a-a04a-83828a66d1c5', 'sess_CTg9No5NRXw0b0l5uf5eC', '49063ede-8e67-429e-87f6-2f291cba1203', '90874df8-6288-4123-8c82-fa4211e10c8d', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:19:33.754+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a729396e-cabe-4c0e-bd80-860336e6474b', 'sess_CTg8g79Bwxt8vtiVpex5U', '49063ede-8e67-429e-87f6-2f291cba1203', '90874df8-6288-4123-8c82-fa4211e10c8d', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:18:50.723+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c55385cc-5586-482c-bec8-f92185e8298a', 'sess_CTg6FJYD0QvJTxyAetbAv', '49063ede-8e67-429e-87f6-2f291cba1203', 'ad89a19b-d78b-40b7-af35-89f8b2455fd8', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:16:19.265+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a6e50afa-1404-4aaf-98b6-ddf1d7d5e511', 'sess_CTg4zyaznMNddVtkQmHTh', '49063ede-8e67-429e-87f6-2f291cba1203', '439e21f3-10e4-4f72-ab65-bd59edbf0369', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:15:01.968+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('f07cbeec-56d2-4bd6-a2d6-fd5b8fa4f064', 'sess_CTg3pXicycWechMoQ13qX', '49063ede-8e67-429e-87f6-2f291cba1203', '7063cf8a-5653-4421-9003-d43750c7cb91', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:13:49.742+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('6cb8ab53-8087-4ca0-8601-212330ebc493', 'sess_CTg2dRTH3nk89r6BdU8Vp', '49063ede-8e67-429e-87f6-2f291cba1203', '6c6d2c8b-9405-43f0-9ca2-92b26d99ce63', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:12:35.192+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('922ea008-68d3-4862-9dff-ddfd6ac2e017', 'sess_CTg0zOJu79obBpWar0qbx', '49063ede-8e67-429e-87f6-2f291cba1203', 'e8351a27-ed8d-4b14-a42a-fcb9f42cd578', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:10:53.906+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c24a73fd-7856-4f38-854e-66aa36382da2', 'sess_CTfzq3nn0FYoyoAhGG4Fe', '49063ede-8e67-429e-87f6-2f291cba1203', 'a25bca99-610e-4a7b-a9a0-3f0051763bd8', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:09:42.227+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a451ae2b-3bca-4cc9-b206-41c2b3dbc000', 'sess_CTfyahBvq8SSHVA6nS8i1', '49063ede-8e67-429e-87f6-2f291cba1203', '2043dcd3-7372-4ba9-a275-717af556a473', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:08:24.247+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('4dcfbaa7-0631-41c5-9eb0-79dd755eb338', 'sess_CTfy6JtsGw7JbX8q90vRe', '49063ede-8e67-429e-87f6-2f291cba1203', '2043dcd3-7372-4ba9-a275-717af556a473', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:07:54.154+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('f70312fc-6640-4b5b-a155-f44dd804f60d', 'sess_CTfxaSqhQkf9JJfkdHvEC', '49063ede-8e67-429e-87f6-2f291cba1203', '2043dcd3-7372-4ba9-a275-717af556a473', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:07:22.567+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('49358f82-9e6b-4027-8b21-7752b68786f2', 'sess_CTfwsPTugpufFmdMJglGX', '49063ede-8e67-429e-87f6-2f291cba1203', '2043dcd3-7372-4ba9-a275-717af556a473', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:06:38.171+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('ac26c515-9417-46ae-9baa-2ea9a334adb7', 'sess_CTfwE2UdawrMXeYtxJwCR', '49063ede-8e67-429e-87f6-2f291cba1203', '2043dcd3-7372-4ba9-a275-717af556a473', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:05:58.696+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('5d7e2415-2c6d-4bf6-bf08-5fde93824291', 'sess_CTfvXHcCQM5nFM4Exzu5f', '49063ede-8e67-429e-87f6-2f291cba1203', '2043dcd3-7372-4ba9-a275-717af556a473', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:05:15.838+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c13afea9-c4d1-45db-92d7-35843355ef7d', 'sess_CTfv0wY0OFolMhHltS0Jx', '49063ede-8e67-429e-87f6-2f291cba1203', '2043dcd3-7372-4ba9-a275-717af556a473', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:04:42.681+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('9e1dd72a-db1d-4cfb-b472-7935822d9c05', 'sess_CTfswc13oQm0hTIYryE5k', '49063ede-8e67-429e-87f6-2f291cba1203', 'c7d30040-c801-4eb9-870f-a9936cf3e940', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:02:34.192+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c1137190-7552-4191-a6fd-56f1aabb8745', 'sess_CTfs34w9U3YuedvZr1XaM', '49063ede-8e67-429e-87f6-2f291cba1203', 'c7d30040-c801-4eb9-870f-a9936cf3e940', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:01:39.638+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('fe3f870e-f35f-4a48-8471-6828d9b955be', 'sess_CTfqZmhmZFZTpNmFlxYxE', '49063ede-8e67-429e-87f6-2f291cba1203', '2a436d0a-621a-4104-bd55-6d9c3fd46f0e', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:00:07.805+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('54b9979d-276e-4cff-90ce-c6e438279893', 'sess_CTfpgzCJUkGIumpVx5z0b', '49063ede-8e67-429e-87f6-2f291cba1203', '54312047-b763-4f89-8d07-143d0a9168fe', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:59:12.49+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('37265d21-9673-468a-b307-929424dce459', 'sess_CTfojH3qty41RNRp0auE9', '49063ede-8e67-429e-87f6-2f291cba1203', '5e981d1d-e863-4d6e-9b02-2284219c7e49', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:58:13.287+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('076deebe-0b31-46f2-a466-e4e3ff6eeb72', 'sess_CTfnazXMDU06i3mheZj70', '49063ede-8e67-429e-87f6-2f291cba1203', '2e0b62b3-0ec3-460a-8406-cc1cf7ac8bfd', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:57:02.227+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a7769510-e2e7-4d24-aad8-20d7e4a6e5a1', 'sess_CTfmWfNnTlDX7nsYoHq5t', '49063ede-8e67-429e-87f6-2f291cba1203', '00b54134-f94b-4385-8b84-b8d954cc6f92', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:55:56.423+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('9d8601d6-04ad-476b-b4e9-03836ff02365', 'sess_CTfm0t278ILpAmfX1eY7J', '49063ede-8e67-429e-87f6-2f291cba1203', '00b54134-f94b-4385-8b84-b8d954cc6f92', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:55:25.009+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c0a2503d-8e7c-4b78-b495-7260b6614c8d', 'sess_CTfkXyabfch4QnbTtHsJ2', '49063ede-8e67-429e-87f6-2f291cba1203', 'cd65bcb4-b2dd-4d04-9013-d62f5b4c35e4', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:53:53.755+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('88cc04f1-98d8-44d5-a1f9-804d79fed904', 'sess_CTfdZ9C45zblcNlzbK74r', '49063ede-8e67-429e-87f6-2f291cba1203', '1bea38eb-2008-4917-8eea-95bcf2e5a2ca', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:46:41.239+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('4f9e322b-725e-4074-8bbd-69f292388849', 'sess_CTfcQSEF5slSyGWWtsxnW', '49063ede-8e67-429e-87f6-2f291cba1203', '27fa5f08-e402-4d11-b51a-f61523bab8bf', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:45:31.011+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('4b666212-b950-4fb0-a5e1-a7e3f4730cdc', 'sess_CTfbAZcgnasjOMxnZTLzs', '49063ede-8e67-429e-87f6-2f291cba1203', '4db6c6be-cff3-48e0-b5da-1825b8122be7', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:44:12.584+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('cc8aa92d-9b56-4a37-87f8-e68e9cbc2992', 'sess_CTfYo8Rr8Bxw4OaoLbrrO', '49063ede-8e67-429e-87f6-2f291cba1203', '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:41:46.159+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('b8cacffe-a050-4779-9332-7926bb8f6607', 'sess_CTfWcdXsLhqa2tvWM1ruW', '49063ede-8e67-429e-87f6-2f291cba1203', '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:39:30.875+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('6d933c41-efeb-4d07-b21f-2e529f99809e', 'sess_CTfVZhsNTkmLUbbL3ntnV', '49063ede-8e67-429e-87f6-2f291cba1203', '10060923-9bb8-4a94-8ddd-0ffbf80bd975', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:38:25.465+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('75fe1032-430d-47c1-b07a-622090360925', 'sess_CTfRCcZwanCLxD6r0OPdY', '49063ede-8e67-429e-87f6-2f291cba1203', '43ca30f3-d9cf-4ad0-9d9f-e73d2758d74f', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:33:54.76+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d3266f66-790f-4585-a2fd-a6712ef29e9b', 'sess_CTfPUE8aGUFmVCf6xd90X', '49063ede-8e67-429e-87f6-2f291cba1203', 'ddab36ad-0334-4f92-88b5-50a0f80a15c7', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:32:08.942+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d90b0765-3c94-4a6c-a7d5-9c1993411c94', 'sess_CTfO8o2TdIgVqFg3TetFm', '49063ede-8e67-429e-87f6-2f291cba1203', 'e66d5c15-8c2e-4e4f-8eea-29dad271a499', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:30:44.663+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d4b02cef-d7d9-4d47-9fe5-7e0b2b8a3aeb', 'sess_CTfNUKwuhTXA5qbz8tMjh', '49063ede-8e67-429e-87f6-2f291cba1203', 'e66d5c15-8c2e-4e4f-8eea-29dad271a499', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:30:04.273+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('525f16b9-b34d-40a6-a26b-305428e52cf9', 'sess_CTfLZMjdQQ5Xcgvm6Xv9y', '49063ede-8e67-429e-87f6-2f291cba1203', '6fa1d1d5-95bf-44a6-ad8d-f5e61828ba61', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:28:05.779+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('b56bfbcf-da9f-4b4a-8656-f3c976871739', 'sess_CTfA4NUnq0zX0ySIsThOm', '49063ede-8e67-429e-87f6-2f291cba1203', '907e0b94-3120-4943-83bd-9fe001efbce5', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:16:12.746+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('b7abf636-f754-48e4-8fdd-8f31c4d9d77a', 'sess_CTf7ngHVHAG5Ov9ZTelXU', '49063ede-8e67-429e-87f6-2f291cba1203', '20a1a6d2-4c2e-4213-b58f-567e0089d38f', 'es-PR', 0, '{}'::jsonb, '2025-10-23T02:13:51.621+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d7e2cbd7-852d-447f-8262-2b12e8247be3', 'sess_CTeqMDshNdfPFegq5muvZ', '49063ede-8e67-429e-87f6-2f291cba1203', '45d1ead8-b4b0-40d2-a0ff-7b3a9db979f4', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:55:50.293+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('daf1a583-3886-433e-8de0-f4be903f8999', 'sess_CTeps1aji3L4bNEjQ3fxx', '49063ede-8e67-429e-87f6-2f291cba1203', '45d1ead8-b4b0-40d2-a0ff-7b3a9db979f4', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:55:20.708+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('c8b0126a-05f2-4f87-b7d7-d5f941bffefb', 'sess_CTenJjn2sy2MEItpsv5yU', '49063ede-8e67-429e-87f6-2f291cba1203', '8a9944f7-6192-4418-bd67-1d6d4822bc6e', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:52:41.545+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('36afe998-53a1-45f2-92cb-00cd5dafd94b', 'sess_CTekoMv3zM9H4nSkraOy6', '49063ede-8e67-429e-87f6-2f291cba1203', '025b161b-07e2-4801-be27-0473eb04a574', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:50:06.228+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('060cf6dc-85ba-4bb8-828f-6bbe7a0dbe4e', 'sess_CTejagJhdAmWgdgq1VJeP', '49063ede-8e67-429e-87f6-2f291cba1203', '025b161b-07e2-4801-be27-0473eb04a574', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:48:50.408+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('96650b1e-7fe6-4634-ac25-e00cb7d0f9a0', 'sess_CTefnTYpS5yfTiYoyFKqC', '49063ede-8e67-429e-87f6-2f291cba1203', '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:44:56.029+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('3e842d66-99d6-4746-8713-5316a3c2a652', 'sess_CTeccmhq49mYL18PyWDbJ', '49063ede-8e67-429e-87f6-2f291cba1203', '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:41:38.998+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('49dd8e56-608d-4058-81b6-37d8169d4123', 'sess_CTebtcVHopOc3SGgkmyB8', '49063ede-8e67-429e-87f6-2f291cba1203', '219e4bea-3bdb-4551-a7b6-2c4f5378177a', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:40:53.407+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('062c1232-7723-4e53-bf9f-66448d5dd3a9', 'sess_CTeWszpWXP9uIe5yE0uet', '49063ede-8e67-429e-87f6-2f291cba1203', 'fd1af9ac-475a-4188-af0c-d783b27c2492', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:35:43.075+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a808dc0d-0fa3-4ce4-81f5-14c0fc8d9618', 'sess_CTeWArEqp523afrr8NWQ3', '49063ede-8e67-429e-87f6-2f291cba1203', 'fd1af9ac-475a-4188-af0c-d783b27c2492', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:34:58.109+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('485a21a0-4cc9-4ca7-be1d-4867f901cd75', 'sess_CTeVAvrG7O7cEy5UlOivu', '49063ede-8e67-429e-87f6-2f291cba1203', 'fd1af9ac-475a-4188-af0c-d783b27c2492', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:33:56.611+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('cc86e6bf-060c-4ed8-a717-4a8392ad280e', 'sess_CTeU3NIzAKCcAxCc6rn35', '49063ede-8e67-429e-87f6-2f291cba1203', 'fd1af9ac-475a-4188-af0c-d783b27c2492', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:32:47.393+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('9060b7db-a18d-4adb-b057-21cdcab803e6', 'sess_CTeSzEPzIIHGYYFQrighK', '49063ede-8e67-429e-87f6-2f291cba1203', 'fd1af9ac-475a-4188-af0c-d783b27c2492', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:31:41.203+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('cf5ac7b6-4063-4609-91ae-dd9e7e0c086c', 'sess_CTePFmzU7e34merbimpAj', '49063ede-8e67-429e-87f6-2f291cba1203', 'fd1af9ac-475a-4188-af0c-d783b27c2492', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:27:49.562+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('cf887449-0336-46b3-8bd3-6c5b8aacb2d0', 'sess_CTeKfRneAQTCu4ckNZHJ1', '49063ede-8e67-429e-87f6-2f291cba1203', 'eaef3308-6ea1-4377-bfc4-cdd818ed7a66', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:23:05.982+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('84066982-4553-4d5f-9ddb-2c0bb74e6a83', 'sess_CTeHxtnwnXSOv78sSPZe5', '49063ede-8e67-429e-87f6-2f291cba1203', 'eaef3308-6ea1-4377-bfc4-cdd818ed7a66', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:20:17.699+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('6e38e70a-e568-45ae-8284-5b518f456336', 'sess_CTeH4cB8n1SgXCmssOcoj', '49063ede-8e67-429e-87f6-2f291cba1203', 'efc8a8eb-3a49-4271-a88c-e074f395e668', 'es-PR', 0, '{}'::jsonb, '2025-10-23T01:19:22.377+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d9fd6da7-258c-4b1a-8d6a-7520978a0ba5', 'sess_CTXA39NXocsxpgnaMDBrf', '49063ede-8e67-429e-87f6-2f291cba1203', 'efc8a8eb-3a49-4271-a88c-e074f395e668', 'es-PR', 0, '{}'::jsonb, '2025-10-22T17:43:39.681+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('f78dbd44-f03c-45d5-bb71-c17b807a4d1e', 'sess_CTX8ByFoaydYnXHitcU20', '49063ede-8e67-429e-87f6-2f291cba1203', 'af18f65c-0aae-4bdb-800b-119972f3d40d', 'es-PR', 0, '{}'::jsonb, '2025-10-22T17:41:43.672+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('ff005294-53b6-4526-b488-de4bf35253cd', 'sess_CTX4NR5i1WWdWRsYLpZE1', '49063ede-8e67-429e-87f6-2f291cba1203', '14dae0e8-4d9e-4c4c-b8a2-3f4ea69a63bc', 'es-PR', 0, '{}'::jsonb, '2025-10-22T17:37:47.179+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('9d7eea02-cfd6-4eff-91e7-12e1c6f2e10b', 'sess_CTX4FLChlfh9sqTfpxMyz', '49063ede-8e67-429e-87f6-2f291cba1203', 'b42cf539-9448-48f4-8418-c5e4176a13af', 'es-PR', 0, '{}'::jsonb, '2025-10-22T17:37:39.905+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('f1cfd541-ffcc-42d7-88bc-cfcd92bc303e', 'sess_CTX3c2mC2mixYsAD9Ntht', '49063ede-8e67-429e-87f6-2f291cba1203', 'efc8a8eb-3a49-4271-a88c-e074f395e668', 'es-PR', 0, '{}'::jsonb, '2025-10-22T17:37:00.252+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('6464d7f9-6a6a-4b82-a8eb-9757e4bfe7ae', 'sess_CTX2pYTsecnDrAthNOsjG', '9e53641e-fed6-4b8d-9551-191d64b02f06', '586c1835-bb64-40fa-98b8-a2180c338a18', 'en', 0, '{}'::jsonb, '2025-10-22T17:36:11.266+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('3d084509-08b0-4182-bd02-6f89cb3c0ba9', 'sess_CTX2IcKQGy6zhOqpRNNET', '49063ede-8e67-429e-87f6-2f291cba1203', 'efc8a8eb-3a49-4271-a88c-e074f395e668', 'es-PR', 0, '{}'::jsonb, '2025-10-22T17:35:38.401+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('04003aec-747b-45c6-a498-f6a44cae8940', 'sess_CTWHFhtPCfXEehyEVwU8j', '49063ede-8e67-429e-87f6-2f291cba1203', NULL, 'en', 0, '{}'::jsonb, '2025-10-22T16:47:01.576+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('74a53cd5-2814-4a55-9570-ff4576d96f61', 'sess_CTWGduZtIAIhWg3cZLb9i', '49063ede-8e67-429e-87f6-2f291cba1203', NULL, 'es-PR', 0, '{}'::jsonb, '2025-10-22T16:46:23.82+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('2bae3c34-d298-4f3d-a355-3d415fe8c0d3', 'sess_CTWBs3lr0CwsE0Y1Ms9cL', '49063ede-8e67-429e-87f6-2f291cba1203', 'f5d32445-faf3-4e28-bdbb-25239b62d20a', 'es-PR', 0, '{}'::jsonb, '2025-10-22T16:41:28.52+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('6c30eb9f-fecf-4ae6-8d3e-88f7224f104b', 'sess_CTW94xspIxXmpboOAZdOj', '49063ede-8e67-429e-87f6-2f291cba1203', 'ddcbe0fb-5b78-4243-8ade-bc072b09c76a', 'es-PR', 0, '{}'::jsonb, '2025-10-22T16:38:34.346+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('80c78530-5366-4fc0-b6d7-a49652b1b0f7', 'sess_CTW8wlsR0k0RpBQusdDZR', '49063ede-8e67-429e-87f6-2f291cba1203', 'efc8a8eb-3a49-4271-a88c-e074f395e668', 'es-PR', 0, '{}'::jsonb, '2025-10-22T16:38:26.558+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('d9e19ed0-b9ca-49fe-b2ac-fcc3968eaf46', 'sess_CTW41YdTkv7ZZSM0LSVaD', '49063ede-8e67-429e-87f6-2f291cba1203', 'b42cf539-9448-48f4-8418-c5e4176a13af', 'es-PR', 0, '{}'::jsonb, '2025-10-22T16:33:21.765+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('70f5f7c9-e8b8-4f95-b4a8-ea874ef0f860', 'sess_CTVzoTZS2cjxSMot0unve', '49063ede-8e67-429e-87f6-2f291cba1203', 'af18f65c-0aae-4bdb-800b-119972f3d40d', 'es-PR', 0, '{}'::jsonb, '2025-10-22T16:29:00.668+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('25caf339-fb7d-428b-9863-21e009147ac2', 'sess_CTUgdOhmUWistuXQDhJub', '49063ede-8e67-429e-87f6-2f291cba1203', NULL, 'es-PR', 0, '{}'::jsonb, '2025-10-22T15:05:07.748+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('037db360-f946-4175-b765-493892d1ed79', 'sess_CTUdoQkNmIQr02IItF7AZ', '49063ede-8e67-429e-87f6-2f291cba1203', NULL, 'en', 0, '{}'::jsonb, '2025-10-22T15:02:12.621+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('7bd7016a-57b8-4c1f-bb93-50e152dbdf46', 'sess_CTUbJqUjRGnA58cjrTAOw', '49063ede-8e67-429e-87f6-2f291cba1203', NULL, 'es-PR', 0, '{}'::jsonb, '2025-10-22T14:59:37.464+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17');


COMMIT;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- ============================================
-- Backup Statistics
-- ============================================
-- Total Tables: 5
-- Total Records: 453
-- Backup Date: 2025-10-25T12:58:37.072Z
-- ============================================
