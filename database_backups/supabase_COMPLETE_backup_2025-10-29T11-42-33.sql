-- ============================================
-- Supabase COMPLETE Database Backup
-- ============================================
-- Generated: 2025-10-29T11:42:33.335Z
-- Project: meertwtenhlmnlpwxhyz
-- URL: https://meertwtenhlmnlpwxhyz.supabase.co
--
-- Tables Exported (5 total):
--   ✓ manual_assessments (782 records)
--   ✓ profiles (1 records)
--   ✓ user_roles (1 records)
--   ✓ voice_sessions (287 records)
--   ✓ pdf_text_content (0 records)
--
-- ============================================

-- Disable foreign key checks during import
SET session_replication_role = 'replica';

BEGIN;


-- ============================================
-- Table: manual_assessments
-- Records: 782
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
-- Total records: 782
-- Exported: 2025-10-29T11:42:33.335Z

-- Clear existing data (uncomment if needed)
-- TRUNCATE TABLE public.manual_assessments CASCADE;

INSERT INTO public.manual_assessments ("id", "type", "subtype", "title", "description", "content", "grade_level", "language", "subject_area", "curriculum_standards", "enable_voice", "voice_speed", "auto_read_question", "difficulty_level", "estimated_duration_minutes", "status", "published_at", "view_count", "completion_count", "average_score", "created_by", "created_at", "updated_at", "metadata", "voice_guidance", "activity_template", "coqui_dialogue", "pronunciation_words", "max_attempts", "parent_lesson_id", "order_in_lesson", "drag_drop_mode", "passing_score") VALUES
  ('20e75c37-8a28-444b-92e4-fdd119ea70dd', 'exercise', 'true_false', 'True or False ', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"“The coquí is reading.”","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761698232993-image.png"}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-29T00:44:37.415054+00:00', '2025-10-29T00:44:37.415054+00:00', '{}'::jsonb, '“The coquí is reading.”
Correct Answer: True', NULL, NULL, NULL, 3, '4d21a54a-26b2-45e6-b621-8d9e7d8fb082', NULL, NULL, 70),
  ('d0f0b24c-fe70-41fc-b72d-037774766375', 'exercise', 'multiple_choice', 'Mini Assessment – Let’s Review! / Mini Evaluación – ¡Repasemos! - Question 2 ', NULL, '{"answers":[{"text":"rain","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761698093839-image.png","isCorrect":false},{"text":"book","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761698101799-image.png","isCorrect":true},{"text":"sun","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761698109530-image.png","isCorrect":false}],"question":"Instruction (EN): Listen and choose the correct picture.\nInstrucción (ES): Escucha y elige la imagen correcta.\n"}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-29T00:42:43.74974+00:00', '2025-10-29T00:42:43.74974+00:00', '{}'::jsonb, 'Question 2 – What does the coquí hold?
Correct Answer: Book', NULL, NULL, NULL, 3, '4d21a54a-26b2-45e6-b621-8d9e7d8fb082', NULL, NULL, 70),
  ('c870ea99-ce92-41d6-84a8-e27f1c338edb', 'exercise', 'multiple_choice', 'Mini Assessment – Let’s Review! / Mini Evaluación – ¡Repasemos! - Question 1 ', NULL, '{"answers":[{"text":"sun","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761697920945-image.png","isCorrect":true},{"text":"tree","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761697928502-image.png","isCorrect":false},{"text":"book","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761697935875-image.png","isCorrect":false}],"question":"Instruction (EN): Listen and choose the correct picture.\nInstrucción (ES): Escucha y elige la imagen correcta.\n"}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-29T00:40:15.004675+00:00', '2025-10-29T00:43:08.626057+00:00', '{}'::jsonb, 'Question 1 – What do you see in the sky?
Correct Answer: Sun', NULL, NULL, NULL, 3, '4d21a54a-26b2-45e6-b621-8d9e7d8fb082', NULL, NULL, 70),
  ('b3b83860-645f-4dd1-b30d-8f93205572ba', 'exercise', 'multiple_choice', 'Exercise 3 – Letter Hunt', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761697766370-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761697773532-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761697783390-image.png","isCorrect":false}],"question":"Instruction (EN): Listen to the letter sound. Clap your hands and find the letter!\nInstrucción (ES): Escucha el sonido de la letra. ¡Aplaude tus manos y encuentra la letra!\n"}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-29T00:37:02.531565+00:00', '2025-10-29T00:37:02.531565+00:00', '{}'::jsonb, '“Find the letter that makes the /t/ sound!”	', NULL, NULL, NULL, 3, '4d21a54a-26b2-45e6-b621-8d9e7d8fb082', NULL, NULL, 70),
  ('0a9ee8e0-0432-4384-89ea-13d2ee92b6d2', 'exercise', 'multiple_choice', 'Exercise 2 – Sound Match', NULL, '{"answers":[{"text":"sun","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761697594033-image.png","isCorrect":true},{"text":"apple","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761697607834-image.png","isCorrect":false},{"text":"tree","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761697617064-image.png","isCorrect":false}],"question":"Instruction (EN): Listen to the letter sound. Clap your hands and find the letter!\nInstrucción (ES): Escucha el sonido de la letra. ¡Aplaude tus manos y encuentra la letra!\n"}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-29T00:34:13.893454+00:00', '2025-10-29T00:34:13.893454+00:00', '{}'::jsonb, '“/S/ is for sun!”', NULL, NULL, NULL, 3, '4d21a54a-26b2-45e6-b621-8d9e7d8fb082', NULL, NULL, 70),
  ('01020022-2ced-4dae-877d-339af770b4d5', 'exercise', 'true_false', 'Exercise 1 – Letter Clap', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"“/A/ is for apple?”\t","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761697437232-image.png"}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-29T00:31:27.114637+00:00', '2025-10-29T00:31:27.114637+00:00', '{}'::jsonb, '“/A/ is for apple?"', NULL, NULL, NULL, 3, '4d21a54a-26b2-45e6-b621-8d9e7d8fb082', NULL, NULL, 70),
  ('4d21a54a-26b2-45e6-b621-8d9e7d8fb082', 'lesson', 'lesson', 'Alphabet Song Extension – “Clap, Find, and Say!” / Actividad de Extensión – “Aplaude, Encuentra y Di”', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Listen to the letter sound. Clap your hands and find the letter!\nInstrucción (ES): Escucha el sonido de la letra. ¡Aplaude tus manos y encuentra la letra!","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761697360593-image.png"}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-29T00:29:46.880932+00:00', '2025-10-29T00:29:46.880932+00:00', '{}'::jsonb, 'Alphabet Song Extension – “Clap, Find, and Say!” / Actividad de Extensión – “Aplaude, Encuentra y Di”
 

Instruction (EN): Listen to the letter sound. Clap your hands and find the letter!
Instrucción (ES): Escucha el sonido de la letra. ¡Aplaude tus manos y encuentra la letra!
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('81232bd2-5a94-4fa1-8fd9-8f37af17c601', 'exercise', 'true_false', 'PHASE 7 – REFLECTION & CELEBRATION 2', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"“Reading is fun!” "}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-29T00:26:26.319858+00:00', '2025-10-29T00:26:26.319858+00:00', '{}'::jsonb, 'True or False – “Reading is fun!” ✅ True', NULL, NULL, NULL, 3, '909ec727-5cf4-45ff-82bb-d969c6cf5a71', NULL, NULL, 70),
  ('a7e00ef4-357a-45cf-a711-f5f9570baa76', 'exercise', 'drag_drop', 'PHASE 7 – REFLECTION & CELEBRATION 1', NULL, '{"mode":"match","question":"Instruction (EN): Say what you learned.\nInstrucción (ES): Di lo que aprendiste.\n","dropZones":[{"id":"zone-1761696523371","label":"Drag your favorite picture from the story. "},{"id":"zone-1761696831376","label":""}],"draggableItems":[{"id":"item-1761696574490","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761696573415-image.png","type":"image"},"correctZone":"zone-1761696523371"},{"id":"item-1761696581287","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761696580318-image.png","type":"image"},"correctZone":"zone-1761696523371"},{"id":"item-1761696589027","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761696588055-image.png","type":"image"},"correctZone":"zone-1761696523371"}],"allowMultiplePerZone":true}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-29T00:21:08.566956+00:00', '2025-10-29T00:26:50.716524+00:00', '{}'::jsonb, 'Instruction (EN): Say what you learned.
Instrucción (ES): Di lo que aprendiste.
Drag your favorite picture from the story. ', NULL, NULL, NULL, 3, '909ec727-5cf4-45ff-82bb-d969c6cf5a71', NULL, 'match', 70),
  ('8c38d5d4-0bec-404b-83d5-9121547448a2', 'exercise', 'drag_drop', 'PHASE 6 – TRACING & WRITING', NULL, '{"mode":"match","question":"Instruction (EN): Trace and say each letter.\nInstrucción (ES): Traza y di cada letra.\n","dropZones":[{"id":"zone-1761696060578","label":"A"},{"id":"zone-1761696061386","label":"S "},{"id":"zone-1761696061831","label":"T "},{"id":"zone-1761696062326","label":"Draw your favorite picture from the story. "}],"draggableItems":[{"id":"item-1761696144874","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761696143872-image.png","type":"image"},"correctZone":"zone-1761696060578"},{"id":"item-1761696155538","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761696154952-image.png","type":"image"},"correctZone":"zone-1761696061831"},{"id":"item-1761696164102","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761696163572-image.png","type":"image"},"correctZone":"zone-1761696061386"},{"id":"item-1761696221597","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761696220416-image.png","type":"image"},"correctZone":"zone-1761696062326"},{"id":"item-1761696247101","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761696246244-image.png","type":"image"},"correctZone":"zone-1761696062326"},{"id":"item-1761696261499","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761696260939-image.png","type":"image"},"correctZone":"zone-1761696062326"},{"id":"item-1761696280685","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761696279187-image.png","type":"image"},"correctZone":"zone-1761696062326"},{"id":"item-1761696300215","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761696299353-image.png","type":"image"},"correctZone":"zone-1761696062326"}],"allowMultiplePerZone":true}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-29T00:13:12.410361+00:00', '2025-10-29T00:13:12.410361+00:00', '{}'::jsonb, 'PHASE 6 – TRACING & WRITING
Instruction (EN): Trace and say each letter.
Instrucción (ES): Traza y di cada letra.
1️⃣ Trace A – say “A is for apple.” ✅		 	





2️⃣ Trace S – say “S is for sun.” ✅		 	



3️⃣ Trace T – say “T is for tree.” ✅		 



4️⃣ Draw your favorite picture from the story. ✅
', NULL, NULL, NULL, 3, '909ec727-5cf4-45ff-82bb-d969c6cf5a71', NULL, 'match', 70),
  ('b0dfdbf0-1898-429d-ac06-1ee50cddc109', 'exercise', 'drag_drop', 'PHASE 5 – LISTEN & POINT ', NULL, '{"mode":"match","question":"","dropZones":[{"id":"zone-1761695408705","label":"Coquí "},{"id":"zone-1761695409214","label":"Rain "},{"id":"zone-1761695409654","label":"Sun "},{"id":"zone-1761695410037","label":"Book "},{"id":"zone-1761695410859","label":"Tree "}],"draggableItems":[{"id":"item-1761695547773","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761695546624-image.png","type":"image"},"correctZone":"zone-1761695408705"},{"id":"item-1761695554895","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761695554415-image.png","type":"image"},"correctZone":"zone-1761695409654"},{"id":"item-1761695560792","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761695560255-image.png","type":"image"},"correctZone":"zone-1761695409214"},{"id":"item-1761695567118","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761695566642-image.png","type":"image"},"correctZone":"zone-1761695410859"},{"id":"item-1761695574243","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761695573700-image.png","type":"image"},"correctZone":"zone-1761695410037"}],"allowMultiplePerZone":false}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-29T00:04:56.643415+00:00', '2025-10-29T00:04:56.643415+00:00', '{}'::jsonb, 'Instruction (EN): Listen and point to the picture.
Instrucción (ES): Escucha y señala la imagen.
1️⃣ 🔊 “This is the coquí.” → Point to 🖼️ [Coquí ✅] 
2️⃣ 🔊 “Point to the sun.” → 🖼️ [Sun ✅] 
3️⃣ 🔊 “Point to the rain.” → 🖼️ [Rain ✅] 
4️⃣ 🔊 “Point to the tree.” → 🖼️ [Tree ✅] 
5️⃣ 🔊 “Point to the book.” → 🖼️ [Book ✅]
6️⃣ 🔊 “The coquí is happy.” → Say “Yes!” ✅ 
7️⃣ 🔊 “Point to what came first – rain – then sun – then book.” ✅ 
', NULL, NULL, NULL, 3, '909ec727-5cf4-45ff-82bb-d969c6cf5a71', NULL, 'match', 70),
  ('b65e29c3-e8bd-4807-9af8-8e35939c4063', 'assessment', 'multiple_choice', 'DOMINIO 1 – Conciencia fonológica y ortográfica 1.L.2', NULL, '{"answers":[{"text":"e-le-fan-te","imageUrl":null,"isCorrect":true},{"text":"el-e-fan-te","imageUrl":null,"isCorrect":false},{"text":") e-le-fa-nte","imageUrl":null,"isCorrect":false}],"question":"Escucha la palabra elefante. ¿Cómo se divide correctamente en sílabas?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-29T00:00:20.008366+00:00', '2025-10-29T00:00:20.008366+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('c2554adb-7637-43f9-93ca-77be7a3017cc', 'assessment', 'multiple_choice', 'DOMINIO 1 – Conciencia fonológica y ortográfica 1.L.2', NULL, '{"answers":[{"text":"dos","imageUrl":null,"isCorrect":false},{"text":"tres","imageUrl":null,"isCorrect":true},{"text":"cuatro","imageUrl":null,"isCorrect":false}],"question":"Cuántas sílabas tiene la palabra cocina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:56:07.505494+00:00', '2025-10-28T23:56:07.505494+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('ef3f2105-0cb5-48bb-9fae-16a6987c38f7', 'assessment', 'multiple_choice', 'DOMINIO 1 – Conciencia fonológica y ortográfica 1.L.1', NULL, '{"answers":[{"text":"a) /l/","imageUrl":null,"isCorrect":true},{"text":"/n/","imageUrl":null,"isCorrect":false},{"text":"/p/","imageUrl":null,"isCorrect":false}],"question":"Escucha: luna, lana, lupa. ¿Qué sonido se repite en todas las palabras?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:55:21.477939+00:00', '2025-10-28T23:55:21.477939+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('d8e53d43-3f10-4daf-b6e6-faf534d1af08', 'assessment', 'multiple_choice', 'DOMINIO 1 – Conciencia fonológica y ortográfica 1.L.1', NULL, '{"answers":[{"text":"mesa","imageUrl":null,"isCorrect":false},{"text":"maleta","imageUrl":null,"isCorrect":false},{"text":"flor","imageUrl":null,"isCorrect":true}],"question":"Escucha las palabras: mesa, maleta, flor. ¿Cuál tiene un sonido inicial diferente?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:53:49.752739+00:00', '2025-10-28T23:53:49.752739+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('89e85326-19f5-4127-bf52-ad728a9a3c5f', 'assessment', 'multiple_choice', 'DOMINIO 1 – Conciencia fonológica y ortográfica - Estándar DEPR 1.L.1', NULL, '{"answers":[{"text":"casa","imageUrl":null,"isCorrect":false},{"text":"sopa","imageUrl":null,"isCorrect":true},{"text":"flor","imageUrl":null,"isCorrect":false}],"question":"¿Cuál palabra comienza con el mismo sonido que sol?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:52:34.696952+00:00', '2025-10-28T23:52:34.696952+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('255cb596-b6cb-4d66-a68f-96f773c9bcab', 'exercise', 'multiple_choice', 'PHASE 4 – SONGS & FLUENCY ', NULL, '{"answers":[{"text":"A – /a/ – Apple 🍎 → Repeat ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761695040489-image.png","isCorrect":true},{"text":"S – /s/ – Sun ☀️ → Repeat ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761695047097-image.png","isCorrect":true},{"text":"T – /t/ – Tree 🌳 → Repeat ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761695055180-image.png","isCorrect":true},{"text":"Alphabet Song 🎵 A B C D E F G, H I J K L M N O P, Q R S T U V, W X Y and Z! “Now I know my ABCs, next time sing with me!” ","imageUrl":null,"isCorrect":true}],"question":"Instruction (EN): Listen, sing, and repeat.\nInstrucción (ES): Escucha, canta y repite.\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761695280179-image.png"}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:52:00.480445+00:00', '2025-10-28T23:55:04.940492+00:00', '{}'::jsonb, 'Instruction (EN): Listen, sing, and repeat.
Instrucción (ES): Escucha, canta y repite.
1️⃣ 🔊 A – /a/ – Apple 🍎 → Repeat and point to A. ✅
2️⃣ 🔊 S – /s/ – Sun ☀️ → Repeat and point to S. ✅
3️⃣ 🔊 T – /t/ – Tree 🌳 → Trace T in the air. ✅
 	 	 

4️⃣ 🔊 Alphabet Song 🎵
A B C D E F G, H I J K L M N O P, Q R S T U V, W X Y and Z!
“Now I know my ABCs, next time sing with me!” ✅
lee todas las oraciones en ingles y que el estudiante repita despues de ti
canta en ingles y dile al estudiante que repita no le des ejercicios', NULL, NULL, NULL, 3, '909ec727-5cf4-45ff-82bb-d969c6cf5a71', NULL, NULL, 70),
  ('a8fa57fd-fe2e-442f-a81d-2ce0dc630af3', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta. ', NULL, '{"answers":[{"text":"a.\tLa importancia de los árboles","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761694202927-ChatGPT%20Image%20Oct%2028,%202025,%2007_29_53%20PM.png","isCorrect":false},{"text":"b.\tEl valor de compartir y convivir en armonía ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761694316468-ChatGPT%20Image%20Oct%2028,%202025,%2004_41_09%20PM.png","isCorrect":true},{"text":"c.\tCómo crecen las plantas","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761694370198-ChatGPT%20Image%20Oct%2028,%202025,%2004_03_28%20PM.png","isCorrect":false}],"question":"Indica que representa el mensaje del texto.."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:39:55.960844+00:00', '2025-10-28T23:39:55.960844+00:00', '{}'::jsonb, 'Retroalimentación:
✅ “Excelente. El texto usa el árbol como símbolo de comunidad y respeto.”
❌ “Revisa: el mensaje se enfoca en la convivencia, no en la botánica.”
🎓 CIERRE DEL DOMINIO 10
🔊 “¡Muy bien, lector cultural!
Hoy descubriste que las historias, canciones y tradiciones son parte de nuestra identidad.
Leer sobre la cultura te ayuda a valorar tus raíces y respetar las de los demás.
🌟 ¡Cada texto es una ventana a la historia y el corazón de un pueblo!”
', NULL, NULL, NULL, 3, 'ac480106-3357-4fd4-b210-39c5d9de3b16', NULL, NULL, 70),
  ('ac480106-3357-4fd4-b210-39c5d9de3b16', 'lesson', 'lesson', 'DOMINIO 10: Integración Literaria y Cultural. Nivel Avanzado. ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Analizar textos literarios y culturales que reflejan valores, tradiciones, identidad y diversidad puertorriqueña y latinoamericana, conectándolos con experiencias personales y sociales."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:34:45.18479+00:00', '2025-10-28T23:34:45.18479+00:00', '{}'::jsonb, 'Leerle al estudiante; Lectura 2 – Solidaridad y empatía: El árbol que da sombra a todos
📖
En el patio de la escuela crecía un árbol grande.
Bajo su sombra, los niños jugaban, leían y conversaban.
Un día, una maestra dijo: “Este árbol nos enseña que compartir espacio y cuidado es parte de nuestra comunidad.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('1877350d-4d37-4c6f-b732-71dd5c6b0df4', 'exercise', 'true_false', 'Verdadero o Falso', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"¿La lectura muestra unión familiar y alegría?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:33:48.309134+00:00', '2025-10-28T23:33:48.309134+00:00', '{}'::jsonb, NULL, NULL, '✅ “Muy bien. La historia resalta el compartir y la convivencia familiar.”
❌ “Observa: las familias cantan y celebran juntas, lo que muestra unión.”
', NULL, 3, '622bceea-96e7-4d25-85f4-9b810c2cda7c', NULL, NULL, 70),
  ('1e4e2311-40d9-40bf-8bb6-94bdd2a19b37', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta.', NULL, '{"answers":[{"text":"El Día de San Valentín","imageUrl":null,"isCorrect":false},{"text":"El Día de Reyes ","imageUrl":null,"isCorrect":true},{"text":"Las Fiestas Patronales","imageUrl":null,"isCorrect":false}],"question":"¿Qué tradición describe el texto?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:32:41.163183+00:00', '2025-10-28T23:32:41.163183+00:00', '{}'::jsonb, 'Deber leerse la lectura 1 para mayor comprension del estudiante. ', NULL, '✅ “Correcto. La lectura presenta la celebración del Día de Reyes.”
❌ “Revisa: los elementos de yerba, camellos y Reyes son claves de esa tradición.”
', NULL, 3, '622bceea-96e7-4d25-85f4-9b810c2cda7c', NULL, NULL, 70),
  ('e12e042b-764a-49e9-9506-d10bb1d2db78', 'exercise', 'multiple_choice', 'PHASE 3 – VOCABULARY IN PICTURES 3', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761693670635-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761693677348-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761693685394-image.png","isCorrect":false}],"question":"Find the sun. "}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:28:29.006818+00:00', '2025-10-28T23:28:29.006818+00:00', '{}'::jsonb, 'Find the sun. ', NULL, NULL, NULL, 3, '909ec727-5cf4-45ff-82bb-d969c6cf5a71', NULL, NULL, 70),
  ('14d53916-5750-4bfc-bd63-0ccb852c3d69', 'exercise', 'multiple_choice', 'PHASE 3 – VOCABULARY IN PICTURES 2', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761693474967-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761693528076-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761693538210-image.png","isCorrect":true}],"question":"Find the coquí. "}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:26:34.412951+00:00', '2025-10-28T23:26:34.412951+00:00', '{}'::jsonb, 'Find the coquí. ', NULL, NULL, NULL, 3, '909ec727-5cf4-45ff-82bb-d969c6cf5a71', NULL, NULL, 70),
  ('622bceea-96e7-4d25-85f4-9b810c2cda7c', 'lesson', 'lesson', 'DOMINIO 10: Integración Literaria y Cultural. Nivel Básico. ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Analizar textos literarios y culturales que reflejan valores, tradiciones, identidad y diversidad puertorriqueña y latinoamericana, conectándolos con experiencias personales y sociales."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:25:42.570049+00:00', '2025-10-28T23:25:42.570049+00:00', '{}'::jsonb, '🌱 NIVEL BÁSICO
Lectura 1 – Tradición cultural: La fiesta de Reyes en la montaña
📖
Cada 6 de enero, los niños de Orocovis colocan yerba fresca y agua para los camellos.
Esa noche, los Reyes Magos visitan las casas y dejan dulces y regalos.
Al amanecer, las familias se reúnen para cantar y compartir y celebrar.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('95ae60e7-f3b6-43ea-af69-5f028829ac42', 'lesson', 'lesson', 'DOMINIO 10: Integración Literaria y Cultural', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Analizar textos literarios y culturales que reflejan valores, tradiciones, identidad y diversidad puertorriqueña y latinoamericana, conectándolos con experiencias personales y sociales."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:24:56.113053+00:00', '2025-10-28T23:24:56.113053+00:00', '{}'::jsonb, '🔊 “La literatura nos conecta con nuestras raíces y nos enseña a valorar quiénes somos.
En este dominio leerás textos que reflejan la vida, la música y las tradiciones de Puerto Rico.  
📖 Escucha, imagina y reflexiona sobre lo que cada historia nos enseña sobre nuestra cultura.
🎤 Al final, podrás compartir tus ideas y experiencias.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('e594432c-fd76-4460-b31c-92b2c5a88aec', 'exercise', 'true_false', 'Verdadero o Falso. ', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"¿El tono del narrador es alegre y positivo?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:23:38.148729+00:00', '2025-10-28T23:23:38.148729+00:00', '{}'::jsonb, 'Debes leer la lectura 2 para que el estudiante esntienda. ', NULL, '✅ “Muy bien. El tono transmite esperanza y ternura.”
❌ “Relee o escucha el final: la sonrisa de Ana muestra satisfacción.”
', NULL, 3, 'bf3b01e8-a270-4df2-b880-4fb319c0c037', NULL, NULL, 70),
  ('1a928e03-17a3-45c9-a7da-b5f996a11e97', 'exercise', 'multiple_choice', 'PHASE 3 – VOCABULARY IN PICTURES 1', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761693323891-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761693332614-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761693341280-image.png","isCorrect":false}],"question":"Find the book. "}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:23:04.122185+00:00', '2025-10-28T23:23:04.122185+00:00', '{}'::jsonb, 'Find the book', NULL, NULL, NULL, 3, '909ec727-5cf4-45ff-82bb-d969c6cf5a71', NULL, NULL, 70),
  ('08592f74-909f-42e3-8d1e-f7029aac956a', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta. ', NULL, '{"answers":[{"text":"Tristeza ","imageUrl":null,"isCorrect":false},{"text":"Miedo ","imageUrl":null,"isCorrect":false},{"text":"Solidaridad","imageUrl":null,"isCorrect":true}],"question":"¿Qué emoción expresa el texto?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:21:39.070296+00:00', '2025-10-28T23:21:39.070296+00:00', '{}'::jsonb, '✅ “Correcto. Ana demuestra empatía y solidaridad al ayudar a los animales.”
❌ “Piensa: las acciones de Ana reflejan ayuda y compasión.”
', NULL, NULL, NULL, 3, 'bf3b01e8-a270-4df2-b880-4fb319c0c037', NULL, NULL, 70),
  ('bf3b01e8-a270-4df2-b880-4fb319c0c037', 'lesson', 'lesson', 'DOMINIO 9: Escucha activa y expresión oral. Nivel Avanzado. ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Escuchar activamente para comprender, interpretar y responder de forma clara, respetuosa y organizada a mensajes orales, grabaciones o presentaciones."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:13:03.961804+00:00', '2025-10-28T23:13:03.961804+00:00', '{}'::jsonb, 'Lección 2 – Interpretar emociones y tono (audio narrativo)
📖 Audio: “Cuando Ana llegó al refugio, vio muchos animales tristes.
Tomó una caja de comida y comenzó a repartirla con ternura.
Los perros movieron la cola y Ana sonrió satisfecha.”


', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('864274f8-38e8-494e-9078-027351bb261e', 'exercise', 'drag_drop', 'PHASE 2 – SOUND & LETTER MATCH ', NULL, '{"mode":"match","question":"Instruction (EN): Listen and drag the sound.\nInstrucción (ES): Escucha y arrastra el sonido.\n","dropZones":[{"id":"zone-1761692487354","label":"A"},{"id":"zone-1761692488339","label":"Sun"},{"id":"zone-1761692488972","label":"Tree"},{"id":"zone-1761692490221","label":"Apple"}],"draggableItems":[{"id":"item-1761692608812","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761692607804-image.png","type":"image"},"correctZone":"zone-1761692487354"},{"id":"item-1761692622143","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761692621464-image.png","type":"image"},"correctZone":"zone-1761692488972"},{"id":"item-1761692633282","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761692632546-image.png","type":"image"},"correctZone":"zone-1761692488339"},{"id":"item-1761692643769","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761692643250-image.png","type":"image"},"correctZone":"zone-1761692490221"}],"allowMultiplePerZone":false}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:12:06.301144+00:00', '2025-10-28T23:12:06.301144+00:00', '{}'::jsonb, 'PHASE 2 – SOUND & LETTER MATCH 🔊
Instruction (EN): Listen and drag the sound.
Instrucción (ES): Escucha y arrastra el sonido.
1️⃣ 🔊 “/A/ – Apple.” → Drag A ✅
2️⃣ 🔊 “/S/ – Sun.” → Drag S ✅
3️⃣ 🔊 “/T/ – Tree.” → Drag T ✅
4️⃣ Say with me: “A – Apple!” ✅
5️⃣ Point to the letter you hear. ✅
', NULL, NULL, NULL, 3, '909ec727-5cf4-45ff-82bb-d969c6cf5a71', NULL, 'match', 70),
  ('576165c7-0b11-48eb-821d-3ef15019e4c0', 'exercise', 'true_false', 'Verdadero o Falso', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"¿Los estudiantes reciclan los viernes?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:10:06.411906+00:00', '2025-10-28T23:10:06.411906+00:00', '{}'::jsonb, NULL, NULL, '✅ “Muy bien. El texto dice que cada viernes recogen los materiales.”
❌ “Escucha de nuevo: menciona un día específico de la semana.”
', NULL, 3, 'a972371d-2c75-4b75-92f9-0c828e6babc0', NULL, NULL, 70),
  ('7903317b-f6f4-475a-8fa7-4c009a74f414', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta. ', NULL, '{"answers":[{"text":"De deportes escolares","imageUrl":null,"isCorrect":false},{"text":"De cómo cuidar el planeta reciclando ","imageUrl":null,"isCorrect":true},{"text":"De cómo preparar una feria de ciencias","imageUrl":null,"isCorrect":false}],"question":"¿De qué trata el audio?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:07:08.046205+00:00', '2025-10-28T23:07:08.046205+00:00', '{}'::jsonb, NULL, NULL, '✅ “Correcto. El mensaje principal es que reciclar protege el ambiente.”
❌ “Revisa: el audio menciona separar materiales para cuidar el planeta.”
', NULL, 3, 'a972371d-2c75-4b75-92f9-0c828e6babc0', NULL, NULL, 70),
  ('13e884ab-63cd-42c5-9118-13a7b26aeaa0', 'exercise', 'drag_drop', 'PHASE 1 – LISTENING WARM-UP ', NULL, '{"mode":"match","question":"Instruction (EN): Listen and pair.\nInstrucción (ES): Escucha y empareja.\n","dropZones":[{"id":"zone-1761692283816","label":"Sun"},{"id":"zone-1761692288846","label":"Rain"},{"id":"zone-1761692289944","label":"Tree"},{"id":"zone-1761692292693","label":"Book"}],"questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761692269978-image.png","draggableItems":[{"id":"item-1761692340427","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761692339596-image.png","type":"image"},"correctZone":"zone-1761692283816"},{"id":"item-1761692347289","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761692346766-image.png","type":"image"},"correctZone":"zone-1761692288846"},{"id":"item-1761692357319","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761692356821-image.png","type":"image"},"correctZone":"zone-1761692289944"},{"id":"item-1761692367160","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761692366708-image.png","type":"image"},"correctZone":"zone-1761692292693"}],"allowMultiplePerZone":false}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:07:02.480527+00:00', '2025-10-28T23:07:02.480527+00:00', '{}'::jsonb, 'PHASE 1 – LISTENING WARM-UP 🔊
Instruction (EN): Listen and point.
Instrucción (ES): Escucha y señala.
1️⃣ 🔊 “Sun.”   [☀️ ✅]

2️⃣ 🔊 “Rain.”   [🌧️ ✅]


3️⃣ 🔊 “Tree.”   [🌳 ✅]


4️⃣ 🔊 “Book.”  [📘 ✅]
', NULL, NULL, NULL, 3, '909ec727-5cf4-45ff-82bb-d969c6cf5a71', NULL, 'match', 70),
  ('a972371d-2c75-4b75-92f9-0c828e6babc0', 'lesson', 'lesson', 'DOMINIO 9: Escucha activa y expresión oral. Nivel Básico. ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Escuchar activamente para comprender, interpretar y responder de forma clara, respetuosa y organizada a mensajes orales, grabaciones o presentaciones."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:05:39.449561+00:00', '2025-10-28T23:05:39.449561+00:00', '{}'::jsonb, 'Lección 1 – Identificar la idea principal (audio informativo)
📖 Tema: El reciclaje en la escuela
🔊“Reciclar ayuda a cuidar el planeta. En nuestra escuela, los estudiantes separan plástico, papel y vidrio en diferentes envases. Cada viernes, un grupo recoge los materiales para llevarlos al centro de reciclaje.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('d0a86e86-b808-42f2-92c8-cd8ca7122157', 'lesson', 'lesson', 'DOMINIO 9: Escucha activa y expresión oral', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Escuchar activamente para comprender, interpretar y responder de forma clara, respetuosa y organizada a mensajes orales, grabaciones o presentaciones."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:04:21.599467+00:00', '2025-10-28T23:04:21.599467+00:00', '{}'::jsonb, '🔊 “Escuchar activamente es más que oír: es prestar atención con el corazón y la mente.
En este dominio practicarás cómo escuchar para comprender, y cómo hablar para expresar tus ideas con claridad y confianza.
Usa 🔊 Escuchar para oír atentamente, 📖 Leer para seguir el texto y 🎤 Hablar para responder o compartir tus ideas.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('96770419-d9cd-4cc0-9e0d-4d401950d9b8', 'exercise', 'multiple_choice', 'Selecciona la versión correcta de cada oración.', NULL, '{"answers":[{"text":"Donde viven los peces","imageUrl":null,"isCorrect":false},{"text":"Donde viven los peces, hay vida marina. ","imageUrl":null,"isCorrect":true}],"question":"Revisa la oración y comprueba si está completa, tiene sentido y la puntuación está correcta.\n"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T23:02:51.967462+00:00', '2025-10-28T23:02:51.967462+00:00', '{}'::jsonb, 'Brinda ejemplos al estdiante: 
📖 Ejemplo:
❌ Cuando llegamos a casa. (incompleta)
✅ Cuando llegamos a casa, preparamos la cena. (completa)
', NULL, '✅ “Excelente. Has mejorado la estructura de las oraciones.”
❌ “Recuerda: cada oración debe tener sentido completo y buena conexión.”
CIERRE DEL DOMINIO 8
🔊 “¡Excelente trabajo!
Hoy aprendiste a usar las reglas gramaticales y los signos de puntuación para escribir con precisión.
Recuerda: una buena puntuación no solo corrige, también da ritmo y claridad a tus ideas.
📖 ¡Cada punto y cada coma hacen que tus textos respiren mejor!”

', NULL, 3, 'f30a7257-4e0d-4fde-a179-dc6256ef608d', NULL, NULL, 70),
  ('dda341e6-0b10-4539-b2d7-3d04d4f692d4', 'exercise', 'multiple_choice', 'Story / Historia – The Little Coquí Learns to Read', NULL, '{"answers":[{"text":" (EN) The little coquí sees a book.                   (ES) El pequeño coquí ve un libro.","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691854346-image.png","isCorrect":true},{"text":"(EN) It rains. The coquí says, “Rain!”   (ES) Llueve. El coquí dice: “¡Lluvia!” ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691865314-image.png","isCorrect":true},{"text":"(EN) The sun is up. The coquí says, “Sun!”   (ES) El sol está arriba. El coquí dice: “¡Sol!” ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691873897-image.png","isCorrect":true},{"text":" (EN) The tree is tall. The coquí jumps.   (ES) El árbol es alto. El coquí salta. ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691885479-image.png","isCorrect":true},{"text":"(EN) The bird says, “Let’s read!” The coquí says, “A! S! T!”   (ES) El pájaro dice: “¡Vamos a leer!” El coquí dice: “¡A! ¡S! ¡T!” ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691901644-image.png","isCorrect":true}],"question":"Let''s read this story!","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691755158-image.png"}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:59:48.455435+00:00', '2025-10-28T23:01:21.819835+00:00', '{}'::jsonb, 'Story / Historia – The Little Coquí Learns to Read

1️⃣ (EN) The little coquí sees a book.                  
(ES) El pequeño coquí ve un libro.

2️⃣ (EN) It rains. The coquí says, “Rain!” ✅ 
(ES) Llueve. El coquí dice: “¡Lluvia!” ✅

3️⃣ (EN) The sun is up. The coquí says, “Sun!” ✅ 
(ES) El sol está arriba. El coquí dice: “¡Sol!” ✅

4️⃣ (EN) The tree is tall. The coquí jumps. ✅ 
(ES) El árbol es alto. El coquí salta. ✅

5️⃣ (EN) The bird says, “Let’s read!” The coquí says, “A! S! T!” ✅ 
(ES) El pájaro dice: “¡Vamos a leer!” El coquí dice: “¡A! ¡S! ¡T!” ✅
________________________________________
lee la historia complea en ingles y solo pide que en estudiante lea contigo . no des ejercicios', NULL, NULL, NULL, 3, '909ec727-5cf4-45ff-82bb-d969c6cf5a71', NULL, NULL, 70),
  ('a9598700-7719-4a25-890c-7e3a4641ea85', 'exercise', 'true_false', 'Lee la pregunta y responde verdadero o falso. ', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"¡Qué bonito día hace!\n\n¿Está bien usada la puntuación?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:58:59.385311+00:00', '2025-10-28T22:58:59.385311+00:00', '{}'::jsonb, NULL, NULL, '✅ “Correcto. Los signos de exclamación encierran toda la expresión emocional.”
❌ “Recuerda usar ambos signos: el de apertura y el de cierre.”
', NULL, 3, 'f30a7257-4e0d-4fde-a179-dc6256ef608d', NULL, NULL, 70),
  ('c75ed3b1-53cc-43df-9dbc-16bcd9eaf2ff', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta. ', NULL, '{"answers":[{"text":"Hoy traje el lápiz el libro y mi borrador.","imageUrl":null,"isCorrect":false},{"text":"Hoy traje el lápiz, el libro y mi borrador. ","imageUrl":null,"isCorrect":true},{"text":"Hoy traje lápiz, cuaderno y, borrador.","imageUrl":null,"isCorrect":false}],"question":"¿Cuál oración está escrita correctamente?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:57:34.043944+00:00', '2025-10-28T22:57:34.043944+00:00', '{}'::jsonb, NULL, NULL, '✅ “Muy bien. Las comas separan los elementos de una lista.”
❌ “Revisa: antes de la conjunción y no se usa coma en este caso.”
', NULL, 3, 'f30a7257-4e0d-4fde-a179-dc6256ef608d', NULL, NULL, 70),
  ('f30a7257-4e0d-4fde-a179-dc6256ef608d', 'lesson', 'lesson', 'DOMINIO 8: Uso correcto de gramática y puntuación. Nivel Avanzado. ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Aplicar correctamente las reglas gramaticales y los signos de puntuación (coma, punto, signos de interrogación y exclamación) para escribir oraciones coherentes y claras."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:56:12.603427+00:00', '2025-10-28T22:56:12.603427+00:00', '{}'::jsonb, 'Lección 2 – Signos de puntuación: coma, punto, signos
📘 Explicación breve IA:
🔊 “Los signos de puntuación ayudan a organizar las ideas y darles ritmo.
•	La coma separa elementos.
•	El punto marca el final de una idea completa.
•	Los signos ¿? y ¡! expresan preguntas y emociones.”
📖 Ejemplo:
Hoy traje lápiz, cuaderno y borrador. ✏️📒🩶
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('69b16b27-4dc3-4a4f-b338-bea8cf465e38', 'exercise', 'multiple_choice', 'Completa con el verbo correcto ', NULL, '{"answers":[{"text":"cantamos","imageUrl":null,"isCorrect":true},{"text":"hace","imageUrl":null,"isCorrect":false},{"text":"abren","imageUrl":null,"isCorrect":false}],"question":"Nosotros ___ la canción."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:55:13.561828+00:00', '2025-10-28T22:55:13.561828+00:00', '{}'::jsonb, NULL, NULL, '✅ “Muy bien. Cantamos concuerda con nosotros (primera persona plural).”
❌ “Observa: el verbo debe coincidir con el sujeto en número y persona.”
', NULL, 3, '0b2b0c7c-5359-4812-b619-70f74b1edf58', NULL, NULL, 70),
  ('489ae1ac-dea7-44e3-8e34-159513dadb6d', 'exercise', 'multiple_choice', 'Completa con el verbo correcto (Llena el blanco con opciones)', NULL, '{"answers":[{"text":"canta","imageUrl":null,"isCorrect":false},{"text":"hacen","imageUrl":null,"isCorrect":true},{"text":"abre","imageUrl":null,"isCorrect":false}],"question":"Selecciona el verbo correcto para completar la oración. Ellos ___ la tarea."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:54:01.835358+00:00', '2025-10-28T22:54:01.835358+00:00', '{}'::jsonb, NULL, NULL, '✅ “Excelente. Hacen concuerda con ellos (tercera persona plural).”
❌ “Recuerda: el verbo cambia según el sujeto.”
', NULL, 3, '0b2b0c7c-5359-4812-b619-70f74b1edf58', NULL, NULL, 70),
  ('147a5fa9-cbfb-4276-b18e-33194a93cb2a', 'exercise', 'drag_drop', 'Glossary / Glosario con Imágenes', NULL, '{"mode":"match","question":"\nCoquí\tA small frog from Puerto Rico\tRana pequeña de Puerto Rico\nBook / Libro\tSomething we read\tAlgo que leemos\nSun / Sol\tBright light in the sky\tLuz brillante en el cielo\nRain / Lluvia\tWater from clouds\tAgua que cae de las nubes\nTree / Árbol\tTall plant with leaves\tPlanta alta con hojas\nSing / Cantar\tMake music with your voice\tHacer música con la voz\n","dropZones":[{"id":"zone-1761691404528","label":"Coquí"},{"id":"zone-1761691412773","label":"Book / Libro"},{"id":"zone-1761691413323","label":"Sun / Sol"},{"id":"zone-1761691413785","label":"Rain / Lluvia"},{"id":"zone-1761691414229","label":"Tree / Árbol"},{"id":"zone-1761691414676","label":"Sing / Cantar"}],"questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691397431-image.png","draggableItems":[{"id":"item-1761691521857","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691520717-image.png","type":"image"},"correctZone":"zone-1761691404528"},{"id":"item-1761691530692","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691530173-image.png","type":"image"},"correctZone":"zone-1761691412773"},{"id":"item-1761691536352","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691535747-image.png","type":"image"},"correctZone":"zone-1761691413323"},{"id":"item-1761691544021","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691543561-image.png","type":"image"},"correctZone":"zone-1761691413785"},{"id":"item-1761691551940","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691551499-image.png","type":"image"},"correctZone":"zone-1761691414229"},{"id":"item-1761691559834","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691559369-image.png","type":"image"},"correctZone":"zone-1761691414676"}],"allowMultiplePerZone":false}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:54:01.412746+00:00', '2025-10-28T22:54:01.412746+00:00', '{}'::jsonb, 'Glossary / Glosario con Imágenes
Word / Palabra	Meaning (EN)	Significado (ES)	🖼️ Image Prompt
Coquí	A small frog from Puerto Rico	Rana pequeña de Puerto Rico	 
Book / Libro	Something we read	Algo que leemos	 
Sun / Sol	Bright light in the sky	Luz brillante en el cielo	 
Rain / Lluvia	Water from clouds	Agua que cae de las nubes	 
Tree / Árbol	Tall plant with leaves	Planta alta con hojas	
 Sing / Cantar	Make music with your voice	Hacer música con la voz	 
', NULL, NULL, NULL, 3, '909ec727-5cf4-45ff-82bb-d969c6cf5a71', NULL, 'match', 70),
  ('958af33d-7ecc-4f4a-8bad-2968da0bab90', 'exercise', 'fill_blank', 'Selecciona el verbo correcto para completar la oración.', NULL, '{"mode":"single_word","prompt":"El niño ___ la puerta.\n","target":"abre","letters":["a","b","r","e","u","c","h"],"autoShuffle":true}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:51:59.307954+00:00', '2025-10-28T22:51:59.307954+00:00', '{}'::jsonb, NULL, NULL, '✅ “Muy bien. Abre concuerda con el niño (tercera persona singular).”
❌ “Revisa: el verbo debe concordar con el sujeto en número y persona.”
', NULL, 3, '0b2b0c7c-5359-4812-b619-70f74b1edf58', NULL, NULL, 70),
  ('ef930d81-674a-4886-a9b2-af6b251b76ad', 'exercise', 'true_false', 'Lee la oracion y contesta si la premisa es verdadera o falsa. ', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":false},{"text":"False","imageUrl":null,"isCorrect":true}],"question":"Mi mamá y yo va al supermercado.\n\n¿Está correcta la oración?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:50:08.558408+00:00', '2025-10-28T22:50:08.558408+00:00', '{}'::jsonb, NULL, NULL, '✅ “Correcto. El verbo debe ser vamos porque el sujeto es plural.”
❌ “Observa: mi mamá y yo somos dos personas, por eso el verbo debe ser plural.”
', NULL, 3, '0b2b0c7c-5359-4812-b619-70f74b1edf58', NULL, NULL, 70),
  ('07b9a24b-c779-4cf3-9bba-8ae2203e1722', 'exercise', 'multiple_choice', 'Selecciona la respuesta correcta. ', NULL, '{"answers":[{"text":"Los niños juega en el parque.","imageUrl":null,"isCorrect":false},{"text":"Los niños juegan en el parque. ","imageUrl":null,"isCorrect":true},{"text":"Los niños jugamos en el parque.","imageUrl":null,"isCorrect":false}],"question":"Selecciona la oración que tiene concordancia correcta."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:47:20.949131+00:00', '2025-10-28T22:47:20.949131+00:00', '{}'::jsonb, NULL, NULL, '✅ “Excelente. Los niños son plural, por eso usamos juegan.”
❌ “Recuerda: el verbo debe coincidir con el número del sujeto.”
', NULL, 3, '0b2b0c7c-5359-4812-b619-70f74b1edf58', NULL, NULL, 70),
  ('909ec727-5cf4-45ff-82bb-d969c6cf5a71', 'lesson', 'lesson', 'The Little Coquí Learns to Read', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"(EN) This lesson helps children connect letters, sounds, and meaning through songs, pictures, and movement.\nStudents will identify letters A, S, T; recognize simple words (sun, rain, tree, book); repeat and sing with expression; trace letters; and answer basic questions using pictures.\n(ES) Esta lección ayuda a los niños a conectar letras, sonidos y significados por medio de canciones, imágenes y movimiento.\nLos estudiantes identificarán las letras A, S, T; reconocerán palabras simples (sol, lluvia, árbol, libro); repetirán y cantarán con expresión; trazarán letras; y responderán preguntas básicas utilizando imágenes.\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761691074922-image.png"}'::jsonb, 0, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:46:25.733238+00:00', '2025-10-28T22:46:25.733238+00:00', '{}'::jsonb, 'Title / Título: The Little Coquí Learns to Read / El Pequeño Coquí Aprende a Leer
Grade / Grado: Kindergarten – Below-Level ESL
Duration / Duración: 20 – 25 minutes
Domains / Dominios: Listening · Speaking · Phonics · Vocabulary · Pre-Reading
PRDE English Standards (2022): K.R.1 · K.R.2 · K.R.3 · K.R.4 · K.R.6 · K.L.4 · K.SL.1 · K.W.1
________________________________________
💠 Expanded Academic Lesson Purpose / Propósito Académico Expandido
(EN) This lesson helps children connect letters, sounds, and meaning through songs, pictures, and movement.
Students will identify letters A, S, T; recognize simple words (sun, rain, tree, book); repeat and sing with expression; trace letters; and answer basic questions using pictures.
(ES) Esta lección ayuda a los niños a conectar letras, sonidos y significados por medio de canciones, imágenes y movimiento.
Los estudiantes identificarán las letras A, S, T; reconocerán palabras simples (sol, lluvia, árbol, libro); repetirán y cantarán con expresión; trazarán letras; y responderán preguntas básicas utilizando imágenes.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('0b2b0c7c-5359-4812-b619-70f74b1edf58', 'lesson', 'lesson', 'DOMINIO 8: Uso correcto de gramática y puntuación. Nivel Básico. ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Aplicar correctamente las reglas gramaticales y los signos de puntuación (coma, punto, signos de interrogación y exclamación) para escribir oraciones coherentes y claras."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:45:50.849329+00:00', '2025-10-28T22:45:50.849329+00:00', '{}'::jsonb, 'Lección 1 – Concordancia entre sujeto y verbo
📘 Explicación breve IA:
🔊 “La concordancia significa que el verbo debe coincidir con el sujeto en número (singular o plural) y persona (yo, tú, él, nosotros…).
💡 Ejemplos:
•	Ella canta muy bien. (singular)
•	Ellos cantan muy bien. (plural)
•	El perro corre rápido. 🐕 (sujeto singular → verbo singular)
•	Los perros corren rápido. 🐕🐕 (sujeto plural → verbo plural)
Si el sujeto cambia, el verbo también debe cambiar.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('868bddc5-c46e-4842-bf5b-e0978e70f23d', 'lesson', 'lesson', 'DOMINIO 8: Uso correcto de gramática y puntuación', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Aplicar correctamente las reglas gramaticales y los signos de puntuación (coma, punto, signos de interrogación y exclamación) para escribir oraciones coherentes y claras."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:37:55.870307+00:00', '2025-10-28T22:37:55.870307+00:00', '{}'::jsonb, '🔊 “Las reglas gramaticales y los signos de puntuación son como señales en el camino de la escritura.
Te ayudan a ordenar tus ideas para que los demás entiendan lo que quieres decir.
En este dominio aprenderás cómo usar correctamente los verbos, la coma, el punto y los signos de interrogación y exclamación.
📖 ¡Vamos a practicar para escribir con claridad y precisión!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('e3b0440e-fdef-484a-b699-da6c8adb2ca7', 'exercise', 'multiple_choice', 'Elige la forma correcta de cada oración.', NULL, '{"answers":[{"text":"Me gusta leer pero no tengo tiempo.","imageUrl":null,"isCorrect":false},{"text":"Me gusta leer, pero no tengo tiempo. ","imageUrl":null,"isCorrect":true},{"text":"Me gusta leer. Pero no tengo tiempo.","imageUrl":null,"isCorrect":false}],"question":"me gusta leer pero no tengo tiempo."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:36:41.258143+00:00', '2025-10-28T22:37:24.054386+00:00', '{}'::jsonb, '🎓 CIERRE DEL DOMINIO 7
🔊 “¡Excelente, escritor en progreso!
Hoy aprendiste a planificar tus ideas, usar conectores y revisar tus textos.
Escribir bien no es hacerlo de una sola vez: es pensar, redactar, revisar y mejorar.
🌟 ¡Cada palabra bien escrita refleja una mente organizada y creativa!”
', NULL, '✅ “Muy bien. Agregaste la coma antes de pero para separar las ideas.”
❌ “Recuerda: la coma ayuda a unir dos oraciones relacionadas sin romper el sentido.”
', NULL, 3, 'cd1e1c10-d3b7-489d-851b-4d7964a25e4a', NULL, NULL, 70),
  ('5d634e2c-1e43-4b31-86a0-98f4ba4891cb', 'exercise', 'multiple_choice', 'Elige la forma correcta de cada oración.', NULL, '{"answers":[{"text":"hoy fui ala escuela.","imageUrl":null,"isCorrect":false},{"text":"Hoy fui a la escuela. ","imageUrl":null,"isCorrect":true},{"text":"hoy fui a la Escuela.","imageUrl":null,"isCorrect":false}],"question":"hoy fui ala escuela."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:35:16.389927+00:00', '2025-10-28T22:35:16.389927+00:00', '{}'::jsonb, NULL, NULL, '✅ “Excelente. Comienza con mayúscula y separa a la correctamente.”
❌ “Revisa: las oraciones inician con mayúscula y a la son dos palabras.”
', NULL, 3, 'cd1e1c10-d3b7-489d-851b-4d7964a25e4a', NULL, NULL, 70),
  ('dd85b3af-73a6-4a5e-9a72-06df796bce30', 'exercise', 'drag_drop', 'Lee las oraciones y selecciona el mejor orden para formar un párrafo coherente.', NULL, '{"mode":"match","question":"","dropZones":[{"id":"zone-1761690196701","label":"Luego observamos las plantas con una lupa."},{"id":"zone-1761690205349","label":"Primero sembramos una semilla en una maceta."},{"id":"zone-1761690213887","label":"Finalmente, anotamos lo que aprendimos en nuestro cuaderno."}],"draggableItems":[{"id":"item-1761690236642","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761690234957-ChatGPT%20Image%20Oct%2028,%202025,%2006_11_34%20PM.png","type":"image"},"correctZone":"zone-1761690213887"},{"id":"item-1761690304994","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761690303700-ChatGPT%20Image%20Oct%2028,%202025,%2006_11_34%20PM.png","type":"image"},"correctZone":"zone-1761690205349"},{"id":"item-1761690377236","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761690375830-ChatGPT%20Image%20Oct%2028,%202025,%2006_11_34%20PM.png","type":"image"},"correctZone":"zone-1761690196701"}],"allowMultiplePerZone":false}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:33:48.456347+00:00', '2025-10-28T22:33:48.456347+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'cd1e1c10-d3b7-489d-851b-4d7964a25e4a', NULL, 'match', 70),
  ('6406d250-4c7f-481e-b8a1-9ba573e089ea', 'exercise', 'multiple_choice', 'Selecciona la respuesta correcta. ', NULL, '{"answers":[{"text":"porque","imageUrl":null,"isCorrect":false},{"text":"sin embargo","imageUrl":null,"isCorrect":false},{"text":"después ","imageUrl":null,"isCorrect":true}],"question":"¿Cuál conector completa mejor la oración?\n\nPrimero fuimos al museo, ___ comimos en el parque.\n"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:26:55.660609+00:00', '2025-10-28T22:26:55.660609+00:00', '{}'::jsonb, NULL, NULL, '✅ “Muy bien. Después indica el orden de los eventos en el tiempo.”
❌ “Revisa: el conector correcto muestra que una acción ocurrió después de otra.”
', NULL, 3, 'cd1e1c10-d3b7-489d-851b-4d7964a25e4a', NULL, NULL, 70),
  ('cd1e1c10-d3b7-489d-851b-4d7964a25e4a', 'lesson', 'lesson', 'DOMINIO 7: Redacción Guiada. Nivel Avanzado. ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Desarrollar la capacidad de escribir textos claros, coherentes y organizados en párrafos con idea principal, detalles y cierre, aplicando conectores lógicos y normas gramaticales."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:25:19.908758+00:00', '2025-10-28T22:25:19.908758+00:00', '{}'::jsonb, '🔊 “Los conectores son palabras que unen ideas y muestran la relación entre ellas. Ayudan a que el texto sea claro y tenga buen orden.
💡 Ejemplos: primero, después, además, finalmente, porque, sin embargo.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('60bf9e40-0e94-40e4-9de6-433be5044608', 'exercise', 'true_false', 'Lee y responde si la premisa es verdadera o falsa. ', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"¿Las ideas del párrafo deben tener relación entre sí?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:24:35.664826+00:00', '2025-10-28T22:24:35.664826+00:00', '{}'::jsonb, 'Deben referirse a la lectura 1 para que el estudiante entienda. ', NULL, 'Retroalimentación:
✅ “Correcto. La coherencia une las oraciones para que el texto tenga sentido.”
❌ “Recuerda: cada oración debe apoyar la idea principal.”
', NULL, 3, '55767f47-b86b-4976-b7eb-e5d84944fc36', NULL, NULL, 70),
  ('92750f0a-3aec-4eeb-9be2-951be96f0351', 'exercise', 'drag_drop', 'Ordena las partes del párrafo.', NULL, '{"mode":"match","question":"Arrastra las oraciones para colocarlas en orden: inicio, desarrollo y cierre.","dropZones":[{"id":"zone-1761689099931","label":"Me encanta cocinar con mi familia."},{"id":"zone-1761689248981","label":"Juntos elegimos los ingredientes y seguimos la receta."},{"id":"zone-1761689258214","label":"Al final, disfrutamos la comida que preparamos. "}],"draggableItems":[{"id":"item-1761689530484","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761689528950-ChatGPT%20Image%20Oct%2028,%202025,%2006_11_34%20PM.png","type":"image"},"correctZone":"zone-1761689099931"},{"id":"item-1761689634966","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761689633495-ChatGPT%20Image%20Oct%2028,%202025,%2006_11_34%20PM.png","type":"image"},"correctZone":"zone-1761689248981"},{"id":"item-1761689664784","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761689663734-ChatGPT%20Image%20Oct%2028,%202025,%2006_11_34%20PM.png","type":"image"},"correctZone":"zone-1761689258214"}],"allowMultiplePerZone":false}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:21:34.809943+00:00', '2025-10-28T22:22:41.326481+00:00', '{}'::jsonb, '✅ “Excelente. Has organizado el párrafo correctamente.”
❌ “Revisa: el inicio presenta el tema, el desarrollo explica y el cierre concluye.”
', NULL, NULL, NULL, 3, '55767f47-b86b-4976-b7eb-e5d84944fc36', NULL, 'match', 70),
  ('5f4b5ac1-5a81-4bdc-96d8-507fc087e074', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta.', NULL, '{"answers":[{"text":"Que las flores son de colores.","imageUrl":null,"isCorrect":false},{"text":"Que cuidar una huerta da alegría. ","imageUrl":null,"isCorrect":true},{"text":"Que el agua ayuda a las plantas.","imageUrl":null,"isCorrect":false}],"question":"¿Cuál es la idea principal del texto?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:08:58.193525+00:00', '2025-10-28T22:08:58.193525+00:00', '{}'::jsonb, 'Debe referirse y leerla  Lección 1 – Estructura del párrafo', NULL, NULL, NULL, 3, '55767f47-b86b-4976-b7eb-e5d84944fc36', NULL, NULL, 70),
  ('55767f47-b86b-4976-b7eb-e5d84944fc36', 'lesson', 'lesson', 'DOMINIO 7: Redacción Guiada. Nivel Básico ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Desarrollar la capacidad de escribir textos claros, coherentes y organizados en párrafos con idea principal, detalles y cierre, aplicando conectores lógicos y normas gramaticales."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:07:34.998556+00:00', '2025-10-28T22:07:34.998556+00:00', '{}'::jsonb, 'Un párrafo tiene una idea principal, detalles que la explican y una oración final que la resume.”
📖 Ejemplo:
Mi familia y yo tenemos una huerta en casa.
Cuidamos las plantas cada día y regamos las flores.
Verlas crecer me hace sentir feliz.
', NULL, '“Escribir bien es organizar tus ideas para comunicar con claridad.
Cada texto tiene tres partes:
✏️ Inicio: presenta la idea principal.
🧩 Desarrollo: explica o da detalles.
🏁 Cierre: concluye o resume la idea.
', NULL, 3, NULL, NULL, NULL, 70),
  ('458b718d-3478-402b-a059-c1f4568f4dc1', 'lesson', 'lesson', 'DOMINIO 7: Redacción Guiada', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Desarrollar la capacidad de escribir textos claros, coherentes y organizados en párrafos con idea principal, detalles y cierre, aplicando conectores lógicos y normas gramaticales."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T22:06:30.75568+00:00', '2025-10-28T22:06:30.75568+00:00', '{}'::jsonb, '“Escribir bien es organizar tus ideas para comunicar con claridad.
Cada texto tiene tres partes:
✏️ Inicio: presenta la idea principal.
🧩 Desarrollo: explica o da detalles.
🏁 Cierre: concluye o resume la idea.
En este dominio aprenderás a planificar, escribir y revisar tus textos paso a paso.
📖 ¡Prepárate para convertir tus pensamientos en palabras!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('529c69bb-5716-40b1-8a40-3059f1b04f53', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta. ', NULL, '{"answers":[{"text":"Metáfora ","imageUrl":null,"isCorrect":false},{"text":"Personificación ","imageUrl":null,"isCorrect":true},{"text":"Hipérbole","imageUrl":null,"isCorrect":false}],"question":"¿Qué recurso literario se usa en el verso El viento le canta canciones de sal?”"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T21:50:07.830472+00:00', '2025-10-28T22:05:59.169547+00:00', '{}'::jsonb, 'Favor describir lo que es el lenguaje figurado para que el estudiante pueda responder a los ejercicios. 

🔊 El lenguaje figurado usa palabras con un significado diferente al literal para expresar ideas de forma más creativa o emocional.
💡 Ejemplo:
Literal: “El sol brilla mucho.”
Figurado: “El sol sonríe en el cielo.”
Este tipo de lenguaje hace que los textos sean más interesantes, poéticos y expresivos.
📖
El mar dormido sueña olas de cristal.
El viento le canta canciones de sal.
', NULL, '🎓 CIERRE DEL DOMINIO 6
🔊 “¡Fantástico trabajo!
Hoy aprendiste que las palabras pueden tener más poder del que parece.
Las metáforas y comparaciones pintan imágenes.
La personificación da vida a lo inanimado.
La hipérbole exagera para hacernos sentir.
🌟 ¡Sigue leyendo y disfrutando cómo la imaginación transforma el lenguaje!”

', NULL, 3, '60e1e2a6-7a04-4df7-9a5d-78261101dc53', NULL, NULL, 70),
  ('2d09f1a7-b22f-4fea-bbdd-5e12e811f303', 'exercise', 'true_false', 'Verdadero o Falso', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"He esperado esta película por mil años.\n\n¿Esta oración es una hipérbole?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T21:48:01.230465+00:00', '2025-10-28T21:48:01.230465+00:00', '{}'::jsonb, NULL, NULL, '✅ “Muy bien. La exageración muestra emoción o entusiasmo.”
❌ “Revisa: mil años es una forma exagerada de decir mucho tiempo.”
', NULL, 3, '60e1e2a6-7a04-4df7-9a5d-78261101dc53', NULL, NULL, 70),
  ('c3b19ff2-b01b-4f57-b8af-d9d65472a1da', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta. ', NULL, '{"answers":[{"text":"El sol calienta el día.","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761687600646-ChatGPT%20Image%20Oct%2028,%202025,%2005_23_01%20PM.png","isCorrect":false},{"text":"El sol sonríe sobre la playa. ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761687582633-ChatGPT%20Image%20Oct%2028,%202025,%2005_27_48%20PM.png","isCorrect":true},{"text":"El sol está muy alto.","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761687571596-ChatGPT%20Image%20Oct%2028,%202025,%2005_29_42%20PM.png","isCorrect":false}],"question":"¿En cuál oración hay personificación?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T21:46:53.695814+00:00', '2025-10-28T21:46:53.695814+00:00', '{}'::jsonb, 'Debe hacer referencia a la lectura 2 ', NULL, '✅ “Correcto. El sol no puede sonreír; el autor le da una cualidad humana.”
❌ “Recuerda: la personificación da acciones o emociones humanas a lo que no las tiene.”
', NULL, 3, '60e1e2a6-7a04-4df7-9a5d-78261101dc53', NULL, NULL, 70),
  ('60e1e2a6-7a04-4df7-9a5d-78261101dc53', 'lesson', 'lesson', 'DOMINIO 6: Lenguaje Figurado y Recursos Literarios. Nivel Avanzado ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Reconocer y analizar el uso del lenguaje figurado y los recursos literarios en textos narrativos, poéticos y descriptivos."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T21:25:04.497843+00:00', '2025-10-28T21:25:04.497843+00:00', '{}'::jsonb, 'Lección 2 – Personificación e hipérbole
📘 Explicación breve IA:
🔊 “La personificación da cualidades humanas a objetos o animales.
La hipérbole exagera para expresar una idea o emoción con fuerza.”
📖 Ejemplo:
“El viento canta entre los árboles.” (personificación)
“Tengo tanta hambre que podría comerme una montaña.” (hipérbole)
', NULL, 'Esta leccion 2 sera usada en los proximos ejercicios de nivel avanzado. ', NULL, 3, NULL, NULL, NULL, 70),
  ('95e780c7-3f2e-4490-9aef-1b7f59a30386', 'exercise', 'drag_drop', 'Identifica el tipo de comparación.', NULL, '{"mode":"match","question":"","dropZones":[{"id":"zone-1761686145655","label":"Tus manos son pétalos.                                   "},{"id":"zone-1761686153607","label":"Tus manos son suaves como pétalos."}],"draggableItems":[{"id":"item-1761686171993","content":"Metáfora ","correctZone":"zone-1761686145655"},{"id":"item-1761686178972","content":"Comparación","correctZone":"zone-1761686153607"}],"allowMultiplePerZone":false}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T21:23:23.254916+00:00', '2025-10-28T21:24:01.047876+00:00', '{}'::jsonb, NULL, NULL, '✅ “Excelente. Has distinguido entre metáfora y comparación.”
❌ “Revisa: si usa como, es una comparación; si no, una metáfora.”
', NULL, 3, '79b7e4ae-770c-4056-b882-0498a7c6eef3', NULL, 'match', 70),
  ('50502660-19c5-477b-b74e-d6e030c141b8', 'exercise', 'true_false', 'Lee y responde verdadero o falso. ', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"El tiempo es un ladrón que roba momentos.\n\n¿Esta oración es una metáfora?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T21:20:48.082927+00:00', '2025-10-28T21:20:48.082927+00:00', '{}'::jsonb, NULL, NULL, '✅ “Excelente. Compara el tiempo con un ladrón sin usar como.”
❌ “Observa: el autor no dice que parece, sino que es.”
', NULL, 3, '79b7e4ae-770c-4056-b882-0498a7c6eef3', NULL, NULL, 70),
  ('81b385b7-a111-4888-b64c-b6de8f0c05e9', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta.', NULL, '{"answers":[{"text":"Tus ojos son estrellas.","imageUrl":null,"isCorrect":false},{"text":"Tus ojos brillan como estrellas. ","imageUrl":null,"isCorrect":true},{"text":"Tus ojos iluminan el cielo.","imageUrl":null,"isCorrect":false}],"question":"¿Cuál oración es un símil?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T21:18:39.476308+00:00', '2025-10-28T21:18:39.476308+00:00', '{}'::jsonb, NULL, NULL, '✅ “Correcto. Usa la palabra como para comparar.”
❌ “Revisa: las comparaciones usan palabras como como o parece.”
', NULL, 3, '79b7e4ae-770c-4056-b882-0498a7c6eef3', NULL, NULL, 70),
  ('79b7e4ae-770c-4056-b882-0498a7c6eef3', 'lesson', 'lesson', 'DOMINIO 6: Lenguaje Figurado y Recursos Literarios. Nivel Básico. ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Reconocer y analizar el uso del lenguaje figurado y los recursos literarios en textos narrativos, poéticos y descriptivos."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:59:15.305616+00:00', '2025-10-28T20:59:15.305616+00:00', '{}'::jsonb, '🌱 NIVEL BÁSICO
Lección 1 – Símil y Metáfora 
📘 Explicación breve IA:
🔊 Un símil compara dos cosas usando palabras como como, parece o igual que.
Ejemplo: “Sus ojos brillan como estrellas.”
Una metáfora también compara, pero sin usar esas palabras; lo dice de forma directa.
Ejemplo: “Sus ojos son estrellas.”
💡 Ambas ayudan a hacer la lectura más creativa y expresiva. 
📖 Ejemplo:
“El sol es una moneda de fuego en el cielo.” (metáfora)
“El sol brilla como una moneda de oro.” (Símil)
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('6b25285b-5038-48ff-a6c0-8e857fd15f26', 'lesson', 'lesson', 'DOMINIO 6: Lenguaje Figurado y Recursos Literarios', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Reconocer y analizar el uso del lenguaje figurado y los recursos literarios en textos narrativos, poéticos y descriptivos."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:58:02.885032+00:00', '2025-10-28T20:58:02.885032+00:00', '{}'::jsonb, '🔊 “Las palabras pueden usarse de manera especial para expresar sentimientos o crear imágenes en tu mente.
Eso se llama lenguaje figurado.
Aprenderás a identificar metáforas, comparaciones, personificaciones e hipérboles.
📖 Escucha los ejemplos, observa cómo el lenguaje figurado hace más viva la lectura y participa en las actividades.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('c5288520-c022-4783-892b-ab20c1163f8e', 'exercise', 'multiple_choice', 'Lee, analiza y selecciona la alternativa correcta. ', NULL, '{"answers":[{"text":"Informar","imageUrl":null,"isCorrect":false},{"text":"Convencer","imageUrl":null,"isCorrect":true},{"text":"Entretener","imageUrl":null,"isCorrect":false}],"question":"Si el texto intenta que compres un producto o adoptes una idea, ¿cuál es su propósito?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:55:57.63097+00:00', '2025-10-28T20:55:57.63097+00:00', '{}'::jsonb, '✅ “Excelente. El texto busca influir en tus decisiones o pensamientos, por eso su propósito es convencer.”
❌ “Recuerda: los anuncios y campañas son textos persuasivos, su meta es convencer.”
', NULL, 'CIERRE DEL DOMINIO 5
🔊 “¡Muy bien, lector analítico!
Hoy aprendiste que los textos tienen una estructura que organiza las ideas y un propósito que guía al autor.
Identificar si un texto informa, entretiene o convence te ayudará a comprenderlo mejor.
📖 ¡Sigue leyendo con atención para descubrir cómo cada palabra cumple una función!”
', NULL, 3, 'e3d7625f-aaae-4f76-9c59-a6379cba5761', NULL, NULL, 70),
  ('97329473-6ab9-478e-a0b4-c69e61ce270c', 'lesson', 'lesson', 'CIERRE DEL DOMINIO 8 (voz IA) NEW ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🌟 Recuerda:\n•\tEscuchar es una forma de mostrar respeto.\n•\tHablar con calma y claridad ayuda a que los demás te entiendan.\n•\tTus palabras tienen poder: úsalas para construir y conectar.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:54:06.362296+00:00', '2025-10-28T20:54:06.362296+00:00', '{}'::jsonb, '🌈 CIERRE DEL DOMINIO 8 (voz IA)
🔊 “¡Gran trabajo!
Hoy practicaste cómo escuchar con atención y cómo expresar tus ideas con claridad y respeto.
🌟 Recuerda:
•	Escuchar es una forma de mostrar respeto.
•	Hablar con calma y claridad ayuda a que los demás te entiendan.
•	Tus palabras tienen poder: úsalas para construir y conectar.
🎤 ¡Sigue escuchando, compartiendo y comunicándote con confianza!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('ed6514be-4587-4206-b46d-e4cdf96ea403', 'exercise', 'multiple_choice', 'Lee, analiza y selecciona la alernativa correcta. ', NULL, '{"answers":[{"text":"Convencer","imageUrl":null,"isCorrect":false},{"text":"Entretener","imageUrl":null,"isCorrect":true},{"text":"Informar","imageUrl":null,"isCorrect":false}],"question":"Si el texto narra una historia imaginaria con personajes y aventuras, ¿cuál es su propósito?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:54:00.976778+00:00', '2025-10-28T20:54:00.976778+00:00', '{}'::jsonb, NULL, NULL, '✅ “Muy bien. Cuando un texto cuenta una historia para divertir o emocionar, su propósito es entretener.”
❌ “Revisa: las historias imaginarias no buscan enseñar datos ni convencer.”
', NULL, 3, 'e3d7625f-aaae-4f76-9c59-a6379cba5761', NULL, NULL, 70),
  ('92ba0527-4111-43cf-a921-457bf09e9a28', 'exercise', 'multiple_choice', 'Ejercicio 9 – Multiple Choice 9 (Intermedio) NEW ', NULL, '{"answers":[{"text":"Tristeza ","imageUrl":null,"isCorrect":false},{"text":"Cooperación","imageUrl":null,"isCorrect":true},{"text":" Soledad","imageUrl":null,"isCorrect":false}],"question":"Mi comunidad unida 🏘️\n📖 En mi comunidad, los vecinos trabajan juntos para limpiar las calles.\nCada sábado, se reúnen para recoger basura y plantar flores.\nAsí todos disfrutan de un lugar más bonito y limpio.\n🔊 ¿Qué valor demuestra la comunidad?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:53:21.274261+00:00', '2025-10-28T20:53:21.274261+00:00', '{}'::jsonb, 'Lectura 3 (Estudios Sociales)
Título: Mi comunidad unida 🏘️
📖 En mi comunidad, los vecinos trabajan juntos para limpiar las calles.
Cada sábado, se reúnen para recoger basura y plantar flores.
Así todos disfrutan de un lugar más bonito y limpio.
Ejercicio 9 – Multiple Choice
🔊 “¿Qué valor demuestra la comunidad?”
a) Tristeza 
b) Cooperación ✅ 
c) Soledad
Retroalimentación:
✅ “¡Muy bien! Cooperar es trabajar en equipo.”
❌ “Relee: dice que trabajan juntos.”
No digas la respuesta. 
La respuesta es: Cooperación ', NULL, NULL, NULL, 3, 'a1c47c81-d1bf-48f7-b249-f43a23dd3b0e', NULL, NULL, 70),
  ('c0a8596a-0be9-41c6-a15c-d702a929374d', 'exercise', 'multiple_choice', 'Lee, analiza y selecciona la alternativa correcta.', NULL, '{"answers":[{"text":"Informar","imageUrl":null,"isCorrect":true},{"text":"Entretener","imageUrl":null,"isCorrect":false},{"text":"Convencer","imageUrl":null,"isCorrect":false}],"question":"Si el texto explica cómo se organizó una comunidad, ¿cuál es el propósito del autor?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:52:36.383771+00:00', '2025-10-28T20:52:36.383771+00:00', '{}'::jsonb, NULL, NULL, '✅ “Excelente. El texto busca enseñar o dar información, por eso su propósito es informar.”

❌ “Recuerda: cuando un texto presenta datos o explica algo real, su propósito es informar.”   ', NULL, 3, 'e3d7625f-aaae-4f76-9c59-a6379cba5761', NULL, NULL, 70),
  ('c2dd0f71-f65b-4227-a70f-5c543cd1228e', 'exercise', 'true_false', 'Lee la premisa y respnde verdadero o falso. ', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"¿El texto presenta los hechos en orden cronológico?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:50:02.562594+00:00', '2025-10-28T20:50:02.562594+00:00', '{}'::jsonb, 'Debes hacer referencia a la lectura 2. ', NULL, 'Retroalimentación:
✅ “Correcto. Se usa un orden de tiempo: primero, luego, finalmente.”
❌ “Observa los conectores de tiempo: te ayudan a seguir la secuencia.”
', NULL, 3, 'e3d7625f-aaae-4f76-9c59-a6379cba5761', NULL, NULL, 70),
  ('61d8ba7d-e7b0-487f-af9c-6cb3b223b80b', 'exercise', 'multiple_choice', 'Ejercicio 6 – Multiple Choice (Intermedio) NEW', NULL, '{"answers":[{"text":"Porque son bonitos.","imageUrl":null,"isCorrect":false},{"text":"Porque ayudan al ambiente.","imageUrl":null,"isCorrect":true},{"text":"Porque hacen ruido.","imageUrl":null,"isCorrect":false}],"question":"Los árboles del parque 🌳\n📖 En el parque hay árboles grandes que dan sombra.\nLos científicos explican que los árboles purifican el aire y ayudan a los animales.\nPor eso, debemos cuidarlos y no cortar sus ramas.\n🔊 ¿Por qué son importantes los árboles?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:49:43.330666+00:00', '2025-10-28T20:49:43.330666+00:00', '{}'::jsonb, 'Título: Los árboles del parque 🌳
📖 En el parque hay árboles grandes que dan sombra.
Los científicos explican que los árboles purifican el aire y ayudan a los animales.
Por eso, debemos cuidarlos y no cortar sus ramas.
Ejercicio 6 – Multiple Choice
🔊 “¿Por qué son importantes los árboles?”
a) Porque son bonitos.
b) Porque ayudan al ambiente ✅
c) Porque hacen ruido.
Retroalimentación:
✅ “Muy bien. Escuchaste la razón científica.”
❌ “Relee: el texto dice que purifican el aire y ayudan a los animales.”
', NULL, NULL, NULL, 3, 'a1c47c81-d1bf-48f7-b249-f43a23dd3b0e', NULL, NULL, 70),
  ('78f7dd84-a477-40bf-9a4d-cccd5e6e979b', 'exercise', 'multiple_choice', 'Seleccione la alternativa correcta. ', NULL, '{"answers":[{"text":"Colocaron letreros.","imageUrl":null,"isCorrect":false},{"text":"Recogieron basura. ","imageUrl":null,"isCorrect":true},{"text":"Colocaron zafacones.","imageUrl":null,"isCorrect":false}],"question":"¿Cuál fue la primera acción que realizaron los vecinos?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761684077429-ChatGPT%20Image%20Oct%2028,%202025,%2004_41_09%20PM.png"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:48:13.883631+00:00', '2025-10-28T20:48:13.883631+00:00', '{}'::jsonb, 'Debes leer la lectura 2 para que los estudiantes comprendan.', NULL, '✅ “Muy bien. El texto indica que primero recogieron basura.”
❌ “Relee: las palabras primero, luego, finalmente muestran el orden.”
', NULL, 3, 'e3d7625f-aaae-4f76-9c59-a6379cba5761', NULL, NULL, 70),
  ('986fec22-fe5c-4996-b091-886a46c9f5de', 'exercise', 'multiple_choice', 'Ejercicio 1 – Multiple Choice (Básico) NEW ', NULL, '{"answers":[{"text":"Se despiden.","imageUrl":null,"isCorrect":false},{"text":"Se saludan.","imageUrl":null,"isCorrect":true},{"text":"Cantan una canción.","imageUrl":null,"isCorrect":false}],"question":"¿Qué hacen los estudiantes cada mañana?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:47:15.692142+00:00', '2025-10-28T20:47:15.692142+00:00', '{}'::jsonb, 'Ejercicio 1 – Multiple Choice
🔊 “¿Qué hacen los estudiantes cada mañana?”
a) Se despiden. 
b) Se saludan ✅ 
c) Cantan una canción.
Retroalimentación:
✅ “¡Excelente! Escuchaste con atención el detalle principal.”
❌ “Repite la lectura y busca qué hacen al comenzar el día.”
No digas la respuesta 
La respuesta es: Se saludan ', NULL, NULL, NULL, 3, 'a1c47c81-d1bf-48f7-b249-f43a23dd3b0e', NULL, NULL, 70),
  ('e3d7625f-aaae-4f76-9c59-a6379cba5761', 'lesson', 'lesson', 'DOMINIO 5: Estructura y análisis del texto. Nivel Avanzado. ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Identificar la estructura organizativa de los textos (inicio, desarrollo, cierre), reconocer el propósito del autor y analizar la relación entre ideas: secuencia, causa/efecto, y comparación/contraste."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:38:01.531181+00:00', '2025-10-28T20:38:01.531181+00:00', '{}'::jsonb, 'Lectura 2 – Estudios Sociales: Un líder de comunidad
📖
En el pueblo de Rincón Yauco, la Sra. Rivera organizó a los vecinos para limpiar el la playa.
Primero, formó grupos para recoger basura.
Luego, colocaron letreros para mantener el lugar limpio.
Finalmente, pusieron zafacones e la playa. 
El esfuerzo colectivo logró que la playa se viera limpia y cristalina. 

🔊 La secuencia de eventos muestra el orden en que ocurren las acciones en un texto.
Usamos palabras como primero, después, luego, finalmente para seguir el orden de los hechos.
💡 Ejemplo: Primero el sol salió, después los niños fueron al parque, y finalmente regresaron a casa.
Reconocer la secuencia ayuda a entender mejor la historia o el proceso que se describe.

', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('a1c47c81-d1bf-48f7-b249-f43a23dd3b0e', 'lesson', 'lesson', 'DOMINIO 8: EXPRESIÓN ORAL Y ESCUCHA ACTIVA NEW', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Destreza:\nEscuchar atentamente un texto corto y responder preguntas literales.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:28:34.093675+00:00', '2025-10-28T20:28:34.093675+00:00', '{}'::jsonb, 'Explicación breve IA
🔊 “Escuchar activamente significa prestar atención al tono, las palabras y las ideas del hablante.
No solo oyes: entiendes, recuerdas y respondes.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('e824232d-47ab-414a-aeee-c6f687427874', 'lesson', 'lesson', 'CIERRE DEL DOMINIO 7 (voz IA) NEW ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🌟 Recuerda:\nUsa mayúsculas, puntos y comas correctamente.\nUn párrafo tiene una idea principal y detalles.\nLos conectores unen tus ideas y dan fluidez.\n📖 ¡Cada palabra que escribes te acerca a ser un gran autor!"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:24:13.433501+00:00', '2025-10-28T20:24:13.433501+00:00', '{}'::jsonb, '🌈 CIERRE DEL DOMINIO 7 (voz IA)

🔊 “¡Fantástico trabajo!
Hoy aprendiste a escribir oraciones completas y a organizar tus ideas en párrafos.

🌟 Recuerda:

Usa mayúsculas, puntos y comas correctamente.
Un párrafo tiene una idea principal y detalles.
Los conectores unen tus ideas y dan fluidez.

📖 ¡Cada palabra que escribes te acerca a ser un gran autor!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('c5588553-f3c3-4b37-bc8a-92ed9aa98780', 'exercise', 'multiple_choice', 'Causa y Efecto. Lee y selecciona la alternativa correcta. ', NULL, '{"answers":[{"text":"Las flores se marchitan.","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761681684460-ChatGPT%20Image%20Oct%2028,%202025,%2004_01_16%20PM.png","isCorrect":false},{"text":"Las flores se reproducen. ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761681827365-ChatGPT%20Image%20Oct%2028,%202025,%2004_03_28%20PM.png","isCorrect":true},{"text":"Las flores cambian de color.","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761681950123-ChatGPT%20Image%20Oct%2028,%202025,%2004_05_35%20PM.png","isCorrect":false}],"question":"¿Qué sucede como resultado de que las abejas ayudan a las flores?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:14:45.457795+00:00', '2025-10-28T20:14:45.457795+00:00', '{}'::jsonb, NULL, NULL, '✅ “Excelente. Las abejas transportan el polen y ayudan a que las flores se reproduzcan.”
❌ “Revisa: la acción de las abejas no hace que las flores se marchiten, sino que crezcan más.”
', NULL, 3, '1b32c54b-317b-4003-b380-880339fd047b', NULL, NULL, 70),
  ('dedcce4e-d283-4ce7-b735-87877fdbf13c', 'exercise', 'multiple_choice', 'Ejercicio 8 –  Multiple Choice (Intermedio) NEW ', NULL, '{"answers":[{"text":"ganamos el concurso de lectura y todos aplaudieron. ","imageUrl":null,"isCorrect":true},{"text":"porque llegué tarde a la clase.","imageUrl":null,"isCorrect":false},{"text":"si no hubiera recreo.","imageUrl":null,"isCorrect":false}],"question":"📖 Completa la oración:\nMi mejor día en la escuela fue cuando…”\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:11:33.904974+00:00', '2025-10-28T20:11:33.904974+00:00', '{}'::jsonb, '
Ejercicio 8 –  Multiple Choice

📖 “Completa la oración:
Mi mejor día en la escuela fue cuando…”

a) ganamos el concurso de lectura y todos aplaudieron. ✅
b) porque llegué tarde a la clase.
c) si no hubiera recreo.

Retroalimentación:

✅ ¡Excelente trabajo! Usaste correctamente el conector “cuando” para expresar el momento en que ocurrió algo especial. Tu oración tiene sentido y está completa.

Si el estudiante selecciona la opción incorrecta (b):
⚠️ Casi lo logras. Recuerda que “porque” explica una causa, no un momento. Después de “Mi mejor día fue cuando…”, debes mencionar qué sucedió ese día.

Si el estudiante selecciona la opción incorrecta (c):
❌ Revisa tu respuesta. El conector “si” indica una condición, pero aquí necesitamos una idea que cuente algo que pasó en ese día especial. 
No digas la respuesta correcta. 
La respuesta correcta es: ganamos el concurso de lectura y todos aplaudieron. ', NULL, NULL, NULL, 3, '5328b8dd-a6f5-4e46-aace-372aba471287', NULL, NULL, 70),
  ('b543826e-736f-4117-b25c-7e6e0ae50ca6', 'exercise', 'drag_drop', 'Exercise 3 (FIB)', NULL, '{"mode":"match","question":"Rearrange the words to form a correct sentence:\n“measured / students / the / soil / the\"\n","dropZones":[{"id":"zone-1761681587011","label":"1"},{"id":"zone-1761681588006","label":"2"},{"id":"zone-1761681590148","label":"3"},{"id":"zone-1761681590762","label":"4"},{"id":"zone-1761681597491","label":"5"}],"draggableItems":[{"id":"item-1761681628363","content":"measured ","correctZone":"zone-1761681590148"},{"id":"item-1761681637111","content":"students ","correctZone":"zone-1761681588006"},{"id":"item-1761681645374","content":"the ","correctZone":"zone-1761681590762"},{"id":"item-1761681658144","content":"soil","correctZone":"zone-1761681597491"},{"id":"item-1761681712022","content":"The","correctZone":"zone-1761681587011"}],"allowMultiplePerZone":false}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:09:39.94188+00:00', '2025-10-28T20:09:39.94188+00:00', '{}'::jsonb, 'Rearrange the words to form a correct sentence:
“measured / students / the / soil / The"
', NULL, NULL, NULL, 3, '73810aeb-2bbf-4555-85cc-90ff8badacc8', NULL, 'match', 70),
  ('e2fb8780-b7f4-45f1-9d47-76f4b965fa96', 'exercise', 'multiple_choice', '7 – Multiple Choice (Narrativo) (Intermedio) NEW', NULL, '{"answers":[{"text":"pero","imageUrl":null,"isCorrect":false},{"text":"porque","imageUrl":null,"isCorrect":true},{"text":"aunque ","imageUrl":null,"isCorrect":false}],"question":"📖 El perro ladró porque escuchó un ruido.\n🔊 ¿Qué conector une las ideas?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:08:53.637183+00:00', '2025-10-28T20:08:53.637183+00:00', '{}'::jsonb, '7 – Multiple Choice (Narrativo)
📖 El perro ladró porque escuchó un ruido.
🔊 “¿Qué conector une las ideas?”

a) pero 
b) porque ✅ 
c) aunque
Retroalimentación:
✅ “Correcto. Porque explica la causa del ladrido.”
❌ “Escucha: porque une la causa y la acción.”
No digas la respuesta 
La respuesta es: porque ', NULL, NULL, NULL, 3, '5328b8dd-a6f5-4e46-aace-372aba471287', NULL, NULL, 70),
  ('9c095f03-d38f-4426-b60b-1748663ba895', 'exercise', 'multiple_choice', 'Ejercicio 2 – Multiple Choice (Básico) NEW', NULL, '{"answers":[{"text":"María ","imageUrl":null,"isCorrect":false},{"text":"estudia","imageUrl":null,"isCorrect":true},{"text":"atención","imageUrl":null,"isCorrect":false}],"question":"📖 María estudia con atención.\n🔊 ¿Cuál palabra indica la acción?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:04:45.71456+00:00', '2025-10-28T20:04:45.71456+00:00', '{}'::jsonb, 'Ejercicio 2 – Multiple Choice

📖 María estudia con atención.
🔊 “¿Cuál palabra indica la acción?”

a) María 
b) estudia ✅ 
c) atención

Retroalimentación:
✅ “Muy bien. Estudia es el verbo.”
❌ “El verbo indica lo que se hace.”
No digas la respuesta
La respuesta es: estudia 
', NULL, NULL, NULL, 3, '5328b8dd-a6f5-4e46-aace-372aba471287', NULL, NULL, 70),
  ('83e100b6-017e-47c6-87a3-33ea5942502a', 'exercise', 'true_false', 'Exercise 2 (True/False)', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"The word restoration shows an action that has already happened."}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:04:38.785184+00:00', '2025-10-28T20:04:59.032342+00:00', '{}'::jsonb, 'The word restoration shows an action that has already happened.
A) True ✅ B) False', NULL, NULL, NULL, 3, '73810aeb-2bbf-4555-85cc-90ff8badacc8', NULL, NULL, 70),
  ('19e9989f-107d-4f69-ad2a-eb633783bcf0', 'exercise', 'true_false', 'Lee la pregunta y responda verdadero o falso. ', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":false},{"text":"False","imageUrl":null,"isCorrect":true}],"question":"¿El propósito del autor es entretener al lector con una historia?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:04:24.136407+00:00', '2025-10-28T20:04:24.136407+00:00', '{}'::jsonb, 'La causa explica por qué ocurre algo.
El efecto muestra qué sucede como resultado.
💡 Ejemplo:
Causa: Llovió todo el día.
Efecto: El río creció.
Identificar la causa y el efecto ayuda a comprender mejor las acciones y consecuencias en un texto.
', NULL, 'Retroalimentación:
✅ “Muy bien. El propósito es informar, no entretener.”
❌ “Recuerda: los textos informativos buscan enseñar o explicar.”
', NULL, 3, '1b32c54b-317b-4003-b380-880339fd047b', NULL, NULL, 70),
  ('2dc8dba5-1511-49b0-8561-81031b874dd3', 'exercise', 'multiple_choice', 'Exercise 1 (MC)', NULL, '{"answers":[{"text":"Careless","imageUrl":null,"isCorrect":false},{"text":"Confused","imageUrl":null,"isCorrect":false},{"text":"Determined ","imageUrl":null,"isCorrect":true}],"question":"Which word best describes the students’ attitude?"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:02:47.476089+00:00', '2025-10-28T20:02:47.476089+00:00', '{}'::jsonb, 'Which word best describes the students’ attitude?
A) Determined ✅ B) Careless C) Confused
', NULL, NULL, NULL, 3, '73810aeb-2bbf-4555-85cc-90ff8badacc8', NULL, NULL, 70),
  ('73810aeb-2bbf-4555-85cc-90ff8badacc8', 'lesson', 'lesson', 'Phase 5 - Part 6 – WRITING & REFLECTION', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Read each prompt or question and complete the sentence or choose the best answer.\nInstrucción (ES): Lee cada oración o pregunta y completa la respuesta o selecciona la mejor opción.\n"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T20:01:11.980898+00:00', '2025-10-28T20:01:11.980898+00:00', '{}'::jsonb, 'Instruction (EN): Read each prompt or question and complete the sentence or choose the best answer.
Instrucción (ES): Lee cada oración o pregunta y completa la respuesta o selecciona la mejor opción.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('bbc645a8-1ad8-4cff-9dba-3fede8854bd2', 'exercise', 'true_false', 'Analytical / Higher-Order Comprehension', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"The students’ presentation inspired their community to act.\n\n"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:59:59.097719+00:00', '2025-10-28T19:59:59.097719+00:00', '{}'::jsonb, 'The students’ presentation inspired their community to act.
A) True ✅ B) False
', NULL, NULL, NULL, 3, 'f13d9eb4-5904-48df-9dea-28dc5e63c80c', NULL, NULL, 70),
  ('5328b8dd-a6f5-4e46-aace-372aba471287', 'lesson', 'lesson', 'DOMINIO 7: EXPRESIÓN ESCRITA Y PRODUCCIÓN DE TEXTOS NEW ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Destreza:\nEscribir oraciones completas, con concordancia y puntuación correcta.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:57:59.426569+00:00', '2025-10-28T19:57:59.426569+00:00', '{}'::jsonb, 'Explicación breve IA
👂 “Una oración completa tiene tres partes:
🟢 Sujeto (de quién se habla)
🟡 Verbo (acción o estado)
🔵 Complemento (dónde, cuándo, cómo o con qué)



Ejemplo:
📖 El gato duerme en la cama.

Sujeto: el gato Verbo: duerme Complemento: en la cama.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('da0017f9-1b75-49da-a013-a1a4f5f54912', 'exercise', 'write_answer', 'Inferential Thinking', NULL, '{"question":"The students took photos with a drone to record their ______ .\nChoices: A) progress  B) errors C) vacations\n","caseSensitive":false,"correctAnswer":"progress"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:56:46.441956+00:00', '2025-10-28T19:56:46.441956+00:00', '{}'::jsonb, 'The students took photos with a drone to record their ______ .
Choices: A) progress ✅ B) errors C) vacations
', NULL, NULL, NULL, 3, 'f13d9eb4-5904-48df-9dea-28dc5e63c80c', NULL, NULL, 70),
  ('e5051c70-963a-47d3-a07f-678d5ed16cdb', 'lesson', 'lesson', 'CIERRE DEL DOMINIO 6 (voz IA) NEW ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🔊 🌟 Recuerda:\n•\tEl sujeto dice quién hace la acción.\n•\tEl verbo muestra qué hace.\n•\tEl predicado completa la idea.\n•\tLos adjetivos describen, y los conectores unen.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:55:54.260363+00:00', '2025-10-28T19:55:54.260363+00:00', '{}'::jsonb, '🌈 CIERRE DEL DOMINIO 6 (voz IA)
🔊 “¡Excelente trabajo!
Hoy aprendiste que las oraciones tienen una estructura y cada palabra cumple una función.
🔊 🌟 Recuerda:
•	El sujeto dice quién hace la acción.
•	El verbo muestra qué hace.
•	El predicado completa la idea.
•	Los adjetivos describen, y los conectores unen.
📖 ¡Ahora puedes escribir oraciones completas, coherentes y llenas de significado!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('93b0db80-f580-4fa1-a27c-69270af66158', 'exercise', 'multiple_choice', 'Literal Understanding', NULL, '{"answers":[{"text":"Mangroves were being damaged by erosion ","imageUrl":null,"isCorrect":true},{"text":"There were too many crabs","imageUrl":null,"isCorrect":false},{"text":"The students missed class","imageUrl":null,"isCorrect":false}],"question":"What was Ms. Rivera’s main concern about the coastline?"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:52:22.325361+00:00', '2025-10-28T19:55:10.167289+00:00', '{}'::jsonb, 'Exercise 1 (MC)
What was Ms. Rivera’s main concern about the coastline?
A) Mangroves were being damaged by erosion ✅ B) There were too many crabs C) The students missed class
', NULL, NULL, NULL, 3, 'f13d9eb4-5904-48df-9dea-28dc5e63c80c', NULL, NULL, 70),
  ('9415bf38-eeef-4fe8-835d-d5a70ccd5ef1', 'exercise', 'multiple_choice', 'Ejercicio 9 – Multiple Choice (Intermedio) NEW ', NULL, '{"answers":[{"text":"de causa","imageUrl":null,"isCorrect":false},{"text":"de contraste ","imageUrl":null,"isCorrect":true},{"text":"de secuencia","imageUrl":null,"isCorrect":false}],"question":"📖 El clima estaba nublado, pero no llovió.\n🔊 ¿Qué tipo de conector es pero?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:51:55.887944+00:00', '2025-10-28T19:51:55.887944+00:00', '{}'::jsonb, 'Ejercicio 9 – Multiple Choice
📖 El clima estaba nublado, pero no llovió.
🔊 “¿Qué tipo de conector es pero?”
a) de causa 
b) de contraste ✅ 
c) de secuencia
Retroalimentación:
✅ “Muy bien. Pero une dos ideas opuestas.”
❌ “Escucha: una parte contradice a la otra, eso es contraste.”
No digas la respuesta
La respuesta es: de contraste ', NULL, NULL, NULL, 3, '159a4628-2b22-4021-8255-73d08e90925a', NULL, NULL, 70),
  ('414ded50-6d9a-4ebd-a1de-6d51101b4e06', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta. ', NULL, '{"answers":[{"text":"Narrativo ","imageUrl":null,"isCorrect":false},{"text":"Informativo ","imageUrl":null,"isCorrect":true},{"text":"Persuasivo","imageUrl":null,"isCorrect":false}],"question":"¿Qué tipo de texto es este?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:51:06.401636+00:00', '2025-10-28T19:51:06.401636+00:00', '{}'::jsonb, '✅ “Correcto. Este texto explica un tema real y ofrece datos: es informativo.”
❌ “Relee: no cuenta una historia, sino que explica cómo funciona algo.”
', NULL, 'Debes referirte  a ;la Lectura 1 – Ciencia: Los ecosistemas (Leccion Nivel Basico) ', NULL, 3, '1b32c54b-317b-4003-b380-880339fd047b', NULL, NULL, 70),
  ('1b32c54b-317b-4003-b380-880339fd047b', 'lesson', 'lesson', 'DOMINIO 5: Estructura y análisis del texto. Nivel Básico ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Identificar la estructura organizativa de los textos (inicio, desarrollo, cierre), reconocer el propósito del autor y analizar la relación entre ideas: secuencia, causa/efecto, y comparación/contraste."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:47:44.450475+00:00', '2025-10-28T19:47:59.389019+00:00', '{}'::jsonb, 'Lectura 1 – Ciencia: Los ecosistemas
📖
Un ecosistema es un conjunto de seres vivos que conviven en un mismo lugar.
Los animales y las plantas dependen unos de otros.
Por ejemplo, las abejas ayudan a las flores y las flores les dan alimento.
Cada parte cumple una función importante en la naturaleza.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('1d676382-703b-4546-a2f0-befe4017669c', 'lesson', 'lesson', 'DOMINIO 5: Estructura y análisis del texto', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Identificar la estructura organizativa de los textos (inicio, desarrollo, cierre), reconocer el propósito del autor y analizar la relación entre ideas: secuencia, causa/efecto, y comparación/contraste."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:43:57.525682+00:00', '2025-10-28T19:43:57.525682+00:00', '{}'::jsonb, '🔊 “Cuando leemos, cada texto tiene un propósito o intención.
El autor escribe con un objetivo específico:

Informar: cuando quiere enseñar o dar datos (Un texto sobre el clima).
Entretener: cuando busca divertir o emocionar (Un cuento o poema).
Persuadir: cuando intenta convencer al lector (Un anuncio o carta de opinión).

💡 Saber el propósito nos ayuda a entender mejor por qué el autor escribió el texto.
📖 Escucha, observa y analiza: descubrirás el orden que da sentido a las palabras.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('bab0b2cb-dd29-4149-a060-96133b0e878e', 'exercise', 'multiple_choice', 'Identifica y escoge la causa al efecto que produce.', NULL, '{"answers":[{"text":"Samuel se siente feliz ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761680021303-ChatGPT%20Image%20Oct%2028,%202025,%2002_24_34%20PM.png","isCorrect":true},{"text":"Se enoja con Valeria ❌","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761680034710-ChatGPT%20Image%20Oct%2028,%202025,%2002_38_22%20PM.png","isCorrect":false},{"text":"Samuel olvida su merienda","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761680045434-ChatGPT%20Image%20Oct%2028,%202025,%2003_27_25%20PM.png","isCorrect":false}],"question":"Valeria comparte su merienda."}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:41:26.956704+00:00', '2025-10-28T19:41:26.956704+00:00', '{}'::jsonb, '✅ “Muy bien. Has identificado la relación entre causa y efecto.”
❌ “Piensa: la acción de compartir produce una emoción positiva
', NULL, '🎓 CIERRE DEL DOMINIO 4
🔊 “¡Excelente trabajo!
Has practicado cómo entender lo que el texto dice y también lo que te quiere hacer pensar.
La lectura literal te da información.
La lectura inferencial te enseña a razonar y sentir.
📖 ¡Sigue leyendo con mente curiosa y corazón atento!”
', NULL, 3, '29c9c7cc-aa5f-4813-9266-f2852d586b33', NULL, NULL, 70),
  ('7d6b7b55-4247-4428-bf5b-2e1266d1d346', 'exercise', 'multiple_choice', 'Ejercicio 6 – Multiple Choice (Intermedio) NEW ', NULL, '{"answers":[{"text":"pintó","imageUrl":null,"isCorrect":false},{"text":"casa","imageUrl":null,"isCorrect":false},{"text":"grande","imageUrl":null,"isCorrect":true}],"question":"📖 El niño pintó una casa grande.\n🔊 ¿Cuál palabra es un adjetivo?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:40:30.83348+00:00', '2025-10-28T19:40:30.83348+00:00', '{}'::jsonb, '🎯 Destreza:
Usar adjetivos, conectores y puntuación para crear oraciones más completas y coherentes.

Explicación breve IA
🔊 “Podemos hacer nuestras oraciones más interesantes si añadimos:
•	Adjetivos, para describir (ej. flor roja).
•	Conectores, para unir ideas (ej. y, pero, porque, aunque).
•	Puntuación, para separar y organizar.”
Ejercicio 6 – Multiple Choice
📖 El niño pintó una casa grande.
🔊 “¿Cuál palabra es un adjetivo?”
a) pintó b) casa c) grande ✅
Retroalimentación:
✅ “Muy bien. Grande describe cómo es la casa.”
❌ “El adjetivo describe una característica.”
No digas la respuesta. 
La respuesta es: grande', NULL, NULL, NULL, 3, '159a4628-2b22-4021-8255-73d08e90925a', NULL, NULL, 70);

INSERT INTO public.manual_assessments ("id", "type", "subtype", "title", "description", "content", "grade_level", "language", "subject_area", "curriculum_standards", "enable_voice", "voice_speed", "auto_read_question", "difficulty_level", "estimated_duration_minutes", "status", "published_at", "view_count", "completion_count", "average_score", "created_by", "created_at", "updated_at", "metadata", "voice_guidance", "activity_template", "coqui_dialogue", "pronunciation_words", "max_attempts", "parent_lesson_id", "order_in_lesson", "drag_drop_mode", "passing_score") VALUES
  ('c0135dd6-669c-424f-83a2-a5d3a8a7fb46', 'exercise', 'multiple_choice', 'Ejercicio 1 – Multiple Choice (Básica) NEW', NULL, '{"answers":[{"text":"corre ","imageUrl":null,"isCorrect":false},{"text":"el perro ","imageUrl":null,"isCorrect":true},{"text":"parque","imageUrl":null,"isCorrect":false}],"question":"📖 El perro corre en el parque.\n🔊 ¿Cuál es el sujeto?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:36:53.70364+00:00', '2025-10-28T19:36:53.70364+00:00', '{}'::jsonb, '🎯 Destreza:
Reconocer el sujeto y el predicado, así como los sustantivos y verbos principales en oraciones sencillas.
Explicación breve IA
🔊 “El sujeto es quien realiza la acción.
El predicado dice qué hace o cómo es.
Ejemplo:
📖 María canta en el coro.
Sujeto: María
Predicado: canta en el coro.”
Ejercicio 1 – Multiple Choice
📖 El perro corre en el parque.
🔊 “¿Cuál es el sujeto?”
a) corre 
b) el perro ✅ 
c) parque
Retroalimentación:
✅ “Correcto. El perro es quien realiza la acción.”
❌ “Recuerda: el sujeto responde a la pregunta ‘¿quién?’.”
No digas la respuesta. 
La respuesta es: el perro ', NULL, NULL, NULL, 3, '159a4628-2b22-4021-8255-73d08e90925a', NULL, NULL, 70),
  ('0ef8efe8-41b4-4b3b-a6e2-a497390ff865', 'exercise', 'multiple_choice', 'Identifica y escoge la causa al efecto que produce.', NULL, '{"answers":[{"text":"Samuel se siente feliz ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761679551320-ChatGPT%20Image%20Oct%2028,%202025,%2002_24_34%20PM.png","isCorrect":true},{"text":"Se enoja con Valeria ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761679532846-ChatGPT%20Image%20Oct%2028,%202025,%2002_38_22%20PM.png","isCorrect":false},{"text":"Samuel olvida su merienda","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761679653039-ChatGPT%20Image%20Oct%2028,%202025,%2003_27_25%20PM.png","isCorrect":false}],"question":"Valeria comparte su merienda "}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:34:42.786527+00:00', '2025-10-28T19:34:42.786527+00:00', '{}'::jsonb, 'Retroalimentación:
✅ “Muy bien. Has identificado la relación entre causa y efecto.”
❌ “Piensa: la acción de compartir produce una emoción positiva.”
', NULL, '🎓 CIERRE DEL DOMINIO 4
🔊 “¡Excelente trabajo!
Has practicado cómo entender lo que el texto dice y también lo que te quiere hacer pensar.
La lectura literal te da información.
La lectura inferencial te enseña a razonar y sentir.
📖 ¡Sigue leyendo con mente curiosa y corazón atento!”
', NULL, 3, '29c9c7cc-aa5f-4813-9266-f2852d586b33', NULL, NULL, 70),
  ('159a4628-2b22-4021-8255-73d08e90925a', 'lesson', 'lesson', 'DOMINIO 6: GRAMÁTICA Y ESTRUCTURA ORACIONAL NEW', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Destreza:\nReconocer el sujeto y el predicado, así como los sustantivos y verbos principales en oraciones sencillas.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:31:42.471164+00:00', '2025-10-28T19:31:42.471164+00:00', '{}'::jsonb, 'Explicación breve IA
🔊 “El sujeto es quien realiza la acción.
El predicado dice qué hace o cómo es.
Ejemplo:
📖 María canta en el coro.
Sujeto: María
Predicado: canta en el coro.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('fe153f9c-0bde-4c58-98ef-81caca887c6f', 'lesson', 'lesson', 'CIERRE DEL DOMINIO 5 (voz IA) NEW', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🔊 🌟 Recuerda:\n•\tEl inicio presenta el tema o los personajes.\n•\tEl desarrollo muestra los hechos o datos.\n•\tEl cierre concluye la historia o resume la idea.\n•\tEl propósito del autor puede ser informar, entretener o persuadir.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:23:14.740947+00:00', '2025-10-28T19:23:14.740947+00:00', '{}'::jsonb, '🌈 CIERRE DEL DOMINIO 5 (voz IA)
🔊 “¡Excelente trabajo!
Hoy aprendiste que todos los textos tienen una estructura y un propósito.
🔊 🌟 Recuerda:
•	El inicio presenta el tema o los personajes.
•	El desarrollo muestra los hechos o datos.
•	El cierre concluye la historia o resume la idea.
•	El propósito del autor puede ser informar, entretener o persuadir.
📖 ¡Ahora puedes analizar cualquier texto como un lector experto!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('b5e0e9a5-bd06-4afb-bcd5-162f35900510', 'exercise', 'true_false', 'Ejercicio 7 – Sí / No (Intermedio) NEW ', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"El reciclaje salva el planeta ♻️\n📖 Reciclar ayuda a reducir la basura y cuidar los recursos naturales.\nSeparar el plástico, el papel y el vidrio permite usarlos de nuevo.\nSi todos reciclamos, el planeta será más limpio.\n¿El texto explica beneficios y razones para reciclar?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:20:35.520419+00:00', '2025-10-28T19:20:35.520419+00:00', '{}'::jsonb, 'El reciclaje salva el planeta ♻️
📖 Reciclar ayuda a reducir la basura y cuidar los recursos naturales.
Separar el plástico, el papel y el vidrio permite usarlos de nuevo.
Si todos reciclamos, el planeta será más limpio.
Ejercicio 7 – Sí / No
🔊 “¿El texto explica beneficios y razones para reciclar?”
✅ Sí ❌ No
Retroalimentación:
✅ “Correcto. Da razones para cuidar el planeta.”
❌ “Escucha de nuevo: menciona reducir basura y cuidar recursos.”
No digas la respuesta. ', NULL, NULL, NULL, 3, 'dfa92697-ee8f-43c6-b0a8-ca8a00797142', NULL, NULL, 70),
  ('f94be980-1c02-4f10-8db5-f07a239e31ee', 'exercise', 'multiple_choice', 'Ejercicio 6 – Multiple Choice 9 (Intermedio) NEW ', NULL, '{"answers":[{"text":"Entretener ","imageUrl":null,"isCorrect":false},{"text":"Persuadir ","imageUrl":null,"isCorrect":true},{"text":"Asustar","imageUrl":null,"isCorrect":false}],"question":"El reciclaje salva el planeta ♻️\n📖 Reciclar ayuda a reducir la basura y cuidar los recursos naturales.\nSeparar el plástico, el papel y el vidrio permite usarlos de nuevo.\nSi todos reciclamos, el planeta será más limpio.\n¿Cuál es el propósito de este texto?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:16:46.31047+00:00', '2025-10-28T19:16:46.31047+00:00', '{}'::jsonb, 'Lectura 3 (Informativo – Ciencia)
Título: El reciclaje salva el planeta ♻️
📖 Reciclar ayuda a reducir la basura y cuidar los recursos naturales.
Separar el plástico, el papel y el vidrio permite usarlos de nuevo.
Si todos reciclamos, el planeta será más limpio.
Ejercicio 6 – Multiple Choice
🔊 “¿Cuál es el propósito de este texto?”
a) Entretener 
b) Persuadir ✅ 
c) Asustar
Retroalimentación:
✅ “Excelente. El autor quiere convencerte de reciclar.”
❌ “Relee: usa frases como ‘Si todos reciclamos’.”
No digas la respuesta. 
La respuesta es: Persuadir', NULL, NULL, NULL, 3, 'dfa92697-ee8f-43c6-b0a8-ca8a00797142', NULL, NULL, 70),
  ('f13d9eb4-5904-48df-9dea-28dc5e63c80c', 'lesson', 'lesson', 'Phase 5 - Part 5 – READING COMPREHENSION', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Read each question carefully and choose the correct answer.\nInstrucción (ES): Lee cada pregunta con atención y selecciona la respuesta correcta.\n"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:13:11.864715+00:00', '2025-10-28T19:16:04.614648+00:00', '{}'::jsonb, 'Part 5 – READING COMPREHENSION
Instruction (EN): Read each question carefully and choose the correct answer.
Instrucción (ES): Lee cada pregunta con atención y selecciona la respuesta correcta.
lee en ingles', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('74a4944c-e414-4b22-b973-aec3ab1707fe', 'exercise', 'multiple_choice', 'Exercise 3 – Reflection (MC)', NULL, '{"answers":[{"text":"It helps listeners understand and stay engaged ","imageUrl":null,"isCorrect":true},{"text":"It makes reading faster","imageUrl":null,"isCorrect":false},{"text":"It changes the story’s facts","imageUrl":null,"isCorrect":false}],"question":"Why is reading with expression important?"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:11:08.843041+00:00', '2025-10-28T19:27:18.552216+00:00', '{}'::jsonb, '🔊 Exercise 3 – Reflection (MC)
Why is reading with expression important?
A) It helps listeners understand and stay engaged ✅
B) It makes reading faster
C) It changes the story’s facts
lee en ingles', NULL, NULL, NULL, 3, '5ca9c6d6-50d4-4dfb-8c89-a8d22642dbda', NULL, NULL, 70),
  ('84450482-daef-4dda-a249-59ff4bff26bf', 'exercise', 'true_false', 'Exercise 2 – Intonation (True/False)', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"Choose the best reading rhythm: “The students / planted / new seedlings.\""}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:09:10.706425+00:00', '2025-10-28T19:27:43.785131+00:00', '{}'::jsonb, 'Exercise 2 – Intonation (True/False)
When reading a question, your voice rises at the end.
A) True ✅ B) False
lee en ingles', NULL, NULL, NULL, 3, '5ca9c6d6-50d4-4dfb-8c89-a8d22642dbda', NULL, NULL, 70),
  ('2028dad2-869d-43af-ac6e-b89afa60c51e', 'exercise', 'multiple_choice', 'Ejercicio 1 – Multiple Choice (Básico) NEW ', NULL, '{"answers":[{"text":"Cuando Camila estaba nerviosa ","imageUrl":null,"isCorrect":true},{"text":"Cuando dibujó el amanecer","imageUrl":null,"isCorrect":false},{"text":"Cuando sonrió","imageUrl":null,"isCorrect":false}],"question":"El dibujo de Camila 🎨\n📖 Camila estaba nerviosa porque era el día del concurso de arte.\nTomó sus lápices y comenzó a dibujar un amanecer.\nCuando terminó, sonrió al ver su dibujo lleno de colores brillantes.\n¿Qué parte del texto presenta el problema o situación inicial?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:07:45.12791+00:00', '2025-10-28T19:07:45.12791+00:00', '{}'::jsonb, 'Título: El dibujo de Camila 🎨
📖 Camila estaba nerviosa porque era el día del concurso de arte.
Tomó sus lápices y comenzó a dibujar un amanecer.
Cuando terminó, sonrió al ver su dibujo lleno de colores brillantes.
Ejercicio 1 – Multiple Choice
🔊 “¿Qué parte del texto presenta el problema o situación inicial?”
a) Cuando Camila estaba nerviosa ✅ 
b) Cuando dibujó el amanecer 
c) Cuando sonrió
Retroalimentación:
✅ “Correcto. El inicio presenta la situación: Camila estaba nerviosa.”
❌ “Piensa: ¿qué sucede primero en la historia?
No digas la respuesta. 
La respuesta correcta es: Cuando Camila estaba nerviosa ', NULL, NULL, NULL, 3, 'dfa92697-ee8f-43c6-b0a8-ca8a00797142', NULL, NULL, 70),
  ('37322f15-dc66-40ec-9cdd-2e0b88e1bce0', 'exercise', 'multiple_choice', '🔊 Exercise 1 – Tone (MC)', NULL, '{"answers":[{"text":"Tired","imageUrl":null,"isCorrect":false},{"text":"Sad","imageUrl":null,"isCorrect":false},{"text":"Proud ","imageUrl":null,"isCorrect":true}],"question":"\n\nWhat tone should you use?\n\n"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:06:47.056509+00:00', '2025-10-28T19:28:17.962297+00:00', '{}'::jsonb, '🔊 Exercise 1 – Tone (MC)
Listen: “The mangroves made it through the storm!”
What tone should you use?
A) Proud ✅ B) Sad C) Tired
lee en ingles', NULL, NULL, NULL, 3, '5ca9c6d6-50d4-4dfb-8c89-a8d22642dbda', NULL, NULL, 70),
  ('5ca9c6d6-50d4-4dfb-8c89-a8d22642dbda', 'lesson', 'lesson', 'Phase 4 - Part 4 – FLUENCY & EXPRESSION ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Listen to each audio example and practice reading with expression.\nInstrucción (ES): Escucha cada ejemplo de audio y practica leer con expresión.\n"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:03:10.614653+00:00', '2025-10-28T19:16:27.670944+00:00', '{}'::jsonb, '
Phase 4 - Part 4 – FLUENCY & EXPRESSION 
Instruction (EN): Listen to each audio example and practice reading with expression.
Instrucción (ES): Escucha cada ejemplo de audio y practica leer con expresión.
lee en ingles
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('0dc95a41-56f1-4526-9ec1-02873d83b579', 'exercise', 'true_false', 'Exercise 3 – True or False ', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"The word estuary refers to where a river meets the sea."}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:01:30.55046+00:00', '2025-10-28T19:28:01.127986+00:00', '{}'::jsonb, ' True or False
The word estuary refers to where a river meets the sea.
A) True ✅ B) False

lee en ingles
', NULL, NULL, NULL, 3, '85282c1f-97b0-4d1e-a049-1777213352f9', NULL, NULL, 70),
  ('6c1dffa2-83a9-4c8d-bf94-fc052fbc5993', 'exercise', 'drag_drop', 'Exercise 2 – Synonym Match (Drag & Drop)', NULL, '{"mode":"match","question":"Synonym Match ","dropZones":[{"id":"zone-1761677459419","label":"repair"},{"id":"zone-1761677461152","label":"guard "},{"id":"zone-1761677462165","label":"watch "},{"id":"zone-1761677462751","label":"helper "}],"draggableItems":[{"id":"item-1761677503565","content":"restore ","correctZone":"zone-1761677459419"},{"id":"item-1761677514698","content":"volunteer ","correctZone":"zone-1761677462751"},{"id":"item-1761677527455","content":"protect ","correctZone":"zone-1761677461152"},{"id":"item-1761677545123","content":"observe ","correctZone":"zone-1761677462165"}],"allowMultiplePerZone":false}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T19:00:17.036485+00:00', '2025-10-28T19:28:36.511362+00:00', '{}'::jsonb, 'Synonym Match (Drag & Drop)
restore → repair ✅ protect → guard ✅ observe → watch ✅ volunteer → helper ✅
lee en ingles', NULL, NULL, NULL, 3, '85282c1f-97b0-4d1e-a049-1777213352f9', NULL, 'match', 70),
  ('7c389576-b71d-470b-8c4e-ba4696675f5e', 'exercise', 'multiple_choice', 'Exercise 1 – Context Meaning (MC)', NULL, '{"answers":[{"text":"The wearing away of land ","imageUrl":null,"isCorrect":true},{"text":"The growth of trees","imageUrl":null,"isCorrect":false},{"text":"The movement of animals","imageUrl":null,"isCorrect":false}],"question":"\nIn the sentence “The mangroves protect the shore from erosion,” what does erosion mean?\n\n"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:56:33.365229+00:00', '2025-10-28T19:28:59.164989+00:00', '{}'::jsonb, 'Exercise 1 – Context Meaning (MC)
In the sentence “The mangroves protect the shore from erosion,” what does erosion mean?
A) The wearing away of land ✅ B) The growth of trees C) The movement of animals
lee en ingles', NULL, NULL, NULL, 3, '85282c1f-97b0-4d1e-a049-1777213352f9', NULL, NULL, 70),
  ('85282c1f-97b0-4d1e-a049-1777213352f9', 'lesson', 'lesson', 'Phase 4 - Part 3 – VOCABULARY IN CONTEXT', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Read each question and choose or complete the correct answer.\nInstrucción (ES): Lee cada pregunta y selecciona o completa la respuesta correcta.\n"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:54:19.17041+00:00', '2025-10-28T19:18:27.769317+00:00', '{}'::jsonb, 'Phase 4 - Part 3 – VOCABULARY IN CONTEXT
Instruction (EN): Read each question and choose or complete the correct answer.
Instrucción (ES): Lee cada pregunta y selecciona o completa la respuesta correcta.
lee en ingles
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('bb315910-b970-4b0a-9741-8ab74a3c5e5e', 'exercise', 'multiple_choice', 'Exercise 3 – Word Stress (MC)', NULL, '{"answers":[{"text":"restoration ","imageUrl":null,"isCorrect":true},{"text":"ecosystem","imageUrl":null,"isCorrect":false},{"text":"mangrove","imageUrl":null,"isCorrect":false}],"question":"Which word is stressed on the second syllable?"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:51:43.306135+00:00', '2025-10-28T19:29:18.929516+00:00', '{}'::jsonb, 'Word Stress (MC)
Which word is stressed on the second syllable?
A) restoration ✅ B) ecosystem C) mangrove
lee en ingles', NULL, NULL, NULL, 3, '6975f61c-08b6-421a-93b9-3c2db9b1a0e2', NULL, NULL, 70),
  ('dfa92697-ee8f-43c6-b0a8-ca8a00797142', 'lesson', 'lesson', 'DOMINIO 5: ESTRUCTURA DEL TEXTO Y PROPÓSITO DEL AUTOR NEW ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Destreza:\nIdentificar el inicio, desarrollo y cierre de un texto narrativo.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:50:45.624305+00:00', '2025-10-28T18:50:45.624305+00:00', '{}'::jsonb, 'Explicación breve IA
🔊 “La estructura de un texto narrativo tiene tres partes:
🔊 🟢 Inicio: presenta a los personajes y el lugar.
🔊 🟡 Desarrollo: cuenta lo que sucede.
🔊 🔵 Cierre: explica cómo termina la historia.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('07b57af6-8e9e-40fa-8b68-1007faf97ed8', 'exercise', 'fill_blank', 'Exercise 2 – Spelling Pattern - habi___at', NULL, '{"mode":"single_word","prompt":"Spelling Pattern (FIB)\nFill in the missing letters: habi___at\n\n","target":"t","letters":["t","d","l","c"],"autoShuffle":true}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:47:55.433206+00:00', '2025-10-28T19:29:38.139083+00:00', '{}'::jsonb, ' Spelling Pattern (FIB)
Fill in the missing letters: 

lee en ingles', NULL, NULL, NULL, 3, '6975f61c-08b6-421a-93b9-3c2db9b1a0e2', NULL, NULL, 70),
  ('55d89fc3-13e0-4045-885c-53422f4b2a66', 'exercise', 'drag_drop', 'Causa y Efecto', NULL, '{"mode":"match","question":"Arrastra la causa al efecto que produce.","dropZones":[{"id":"zone-1761676331114","label":"Valeria comparte su merienda "},{"id":"zone-1761676569176","label":"Samuel olvida su merienda"}],"questionImage":"","draggableItems":[{"id":"item-1761676311961","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761676309945-ChatGPT%20Image%20Oct%2028,%202025,%2002_24_34%20PM.png","type":"image"},"correctZone":"zone-1761676331114"},{"id":"item-1761676715890","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761676712800-ChatGPT%20Image%20Oct%2028,%202025,%2002_38_22%20PM.png","type":"image"},"correctZone":"zone-1761676569176"}],"allowMultiplePerZone":false}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:45:58.507814+00:00', '2025-10-28T18:45:58.507814+00:00', '{}'::jsonb, NULL, NULL, '✅ “Muy bien. Has identificado la relación entre causa y efecto.”
❌ “Piensa: la acción de compartir produce una emoción positiva.”
', NULL, 3, 'b2a386ed-b5a5-46b8-8131-2e3c9c738ce8', NULL, 'match', 70),
  ('70d52e49-e8be-4f73-ac19-167a0bc8bee9', 'exercise', 'multiple_choice', 'Exercise 1 – Syllable Count (MC)', NULL, '{"answers":[{"text":"3","imageUrl":null,"isCorrect":false},{"text":"4","imageUrl":null,"isCorrect":true},{"text":"5","imageUrl":null,"isCorrect":false}],"question":"\nHow many syllables are in ecosystem?\n\n"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:43:34.21432+00:00', '2025-10-28T19:29:57.55841+00:00', '{}'::jsonb, 'Exercise 1 – Syllable Count (MC)
How many syllables are in ecosystem?
A) 4 ✅ B) 3 C) 5
lee en ingles', NULL, NULL, NULL, 3, '6975f61c-08b6-421a-93b9-3c2db9b1a0e2', NULL, NULL, 70),
  ('6975f61c-08b6-421a-93b9-3c2db9b1a0e2', 'lesson', 'lesson', 'Part 3 – Phase 2 Phonics & Word Work', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Read or listen to each activity and complete it.\nInstrucción (ES): Lee o escucha cada actividad y complétala.\n"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:42:03.641371+00:00', '2025-10-28T19:14:40.793458+00:00', '{}'::jsonb, 'Instruction (EN): Read or listen to each activity and complete it.
Instrucción (ES): Lee o escucha cada actividad y complétala.
lee en ingles', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('a3d70058-8fda-4654-9d96-8f3aa8d4d196', 'exercise', 'write_answer', 'Exercise 3 – Short or Long Vowel (MC)', NULL, '{"question":"\nAudio: “Listen to the word roots.” Is the vowel sound short or long?\nA) Long  B) Short\n","caseSensitive":false,"correctAnswer":"Long"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:39:17.147774+00:00', '2025-10-28T19:30:17.324105+00:00', '{}'::jsonb, ' Short or Long Vowel (MC)
Audio: “Listen to the word roots.” Is the vowel sound short or long?
A) Long ✅ B) Short
lee en ingles
', NULL, NULL, NULL, 3, '656510e7-fc93-4ce5-bd59-c01ce8fde571', NULL, NULL, 70),
  ('c98d8100-6dff-46e5-82e2-73e687b0278a', 'lesson', 'lesson', 'Cierre del Dominio 4 (voz IA) NEW', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🌟 🔊 Recuerda:\n•\tLa comprensión literal busca detalles claros.\n•\tLa comprensión inferencial usa las pistas y tu razonamiento.\n📖 Cuando lees, no solo ves palabras: descubres sentimientos, causas y significados. ✨\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:37:51.30883+00:00', '2025-10-28T18:37:51.30883+00:00', '{}'::jsonb, '🌈 Cierre del Dominio 4 (voz IA)
“🔊¡Excelente trabajo, lector o lectora!
Hoy aprendiste a distinguir entre lo que el texto dice y lo que te sugiere.
🌟 🔊 Recuerda:
•	La comprensión literal busca detalles claros.
•	La comprensión inferencial usa las pistas y tu razonamiento.
📖 Cuando lees, no solo ves palabras: descubres sentimientos, causas y significados. ✨
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('371d9ac2-78b0-42e2-927e-11dcf40fd27e', 'exercise', 'true_false', 'Exercise 2 – True or False', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"“Listen to the words mud and bud.” They end with the same sound.\n\n"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:37:06.408039+00:00', '2025-10-28T19:30:36.712462+00:00', '{}'::jsonb, '“Listen to the words mud and bud.” They end with the same sound.
A) True ✅ B) False
lee en ingles', NULL, NULL, NULL, 3, '656510e7-fc93-4ce5-bd59-c01ce8fde571', NULL, NULL, 70),
  ('2f477d06-17fe-49f8-a52a-02a2150fc76a', 'exercise', 'true_false', 'Ejercicio 10 – Sí / No (Intermedio) NEW', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"¿El texto enseña que compartir puede mejorar el día de alguien?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:35:23.495611+00:00', '2025-10-28T18:35:23.495611+00:00', '{}'::jsonb, 'Ejercicio 10 – Sí / No
👂 “¿El texto enseña que compartir puede mejorar el día de alguien?”
✅ Sí ❌ No
Retroalimentación:
✅ “Excelente. Esa es la enseñanza del texto.”
❌ “Piensa en cómo cambió el ánimo de Sofía.”
No digas la respuesta. 
La respuesta es: Sí', NULL, NULL, NULL, 3, '92644b4a-c1a3-4cd8-8f81-c143233139e8', NULL, NULL, 70),
  ('a417bc54-28a2-495f-b845-89b8f4bca89b', 'exercise', 'write_answer', 'Rhyme Match (MC)', NULL, '{"question":"\nAudio: “Listen to the word shore.” Which word rhymes with shore?\n","caseSensitive":false,"correctAnswer":"more"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:35:02.949507+00:00', '2025-10-28T19:31:03.193979+00:00', '{}'::jsonb, 'Exercise 1 – Rhyme Match (MC)
Audio: “Listen to the word shore.” Which word rhymes with shore?
A) more ✅ B) moss C) mud
lee en ingles', NULL, NULL, NULL, 3, '656510e7-fc93-4ce5-bd59-c01ce8fde571', NULL, NULL, 70),
  ('656510e7-fc93-4ce5-bd59-c01ce8fde571', 'lesson', 'lesson', 'Part 3 – Phase 1 Listening Warm-Up', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Listen carefully to each word and choose the correct answer.\nInstrucción (ES): Escucha con atención cada palabra y selecciona la respuesta correcta.\n"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:33:46.677198+00:00', '2025-10-28T19:18:37.413825+00:00', '{}'::jsonb, 'Instruction (EN): Listen carefully to each word and choose the correct answer.
Instrucción (ES): Escucha con atención cada palabra y selecciona la respuesta correcta.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('c105425f-4990-4309-81c8-41ad61ed21c7', 'lesson', 'lesson', 'Phase 2 – Story: Operation Mangrove Rescue', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"1️⃣ The Problem\nThe fifth-grade science class at Punta Luna Elementary had been studying how mangroves protect the coast from erosion. One afternoon, their teacher, Ms. Rivera, showed them photos of damaged roots after a recent storm. “The shoreline is shrinking,” she said softly. “If the trees disappear, so will the fish habitats.” María felt a pull in her chest. She raised her hand. “What can we do to help?”\n2️⃣ A Plan for Action\nMs. Rivera explained that local scientists were asking for volunteers to plant new seedlings in the nearby estuary. Excited murmurs filled the room. Roberto, the class president, suggested naming the project Operation Mangrove Rescue. The students divided into teams: one for research, one for planting, and one for data collection. They agreed to work every Saturday until the restoration was complete.\n3️⃣ Learning Before Doing\nBefore planting, each team learned about biodiversity and how ecosystems stay in balance. María’s team discovered that mangroves not only protect beaches but also shelter baby fish and filter salt water. They wrote questions for a local marine biologist: “How deep should roots go?” “What kind of mud works best?” Their curiosity grew with every answer.\n4️⃣ Planting Day\nOn a bright Saturday morning, the students arrived with boots, shovels, and notebooks. The air smelled of sea salt and wet earth. They planted each seedling carefully, measuring equal distances so the roots would spread evenly. Roberto used a drone to take photos from above, capturing neat green rows. María smiled when she noticed tiny crabs crawling between the roots — the mangroves were already bringing life back.\n5️⃣ A Storm Test\nTwo weeks later, heavy rain arrived. The class worried the new mangroves would wash away. When they returned, mud covered the path, but the seedlings were still standing strong. “The roots held the soil!” María shouted. They recorded the data: erosion reduced by 30 percent. Their teacher nodded. “This,” she said, “is how science and teamwork protect our home.”\n6️⃣ Sharing Their Findings\nBack at school, the students created a presentation for the town’s community center. They explained how restoration projects could reduce flooding and save coastal houses. Parents clapped as Roberto showed before-and-after photos, and María read their conclusion: “Healthy mangroves mean a healthy community.” Their pride filled the room.\n7️⃣ A Lasting Impact\nA month later, the mayor invited the class to paint a mural by the pier to remind everyone to protect the environment. They added bright green leaves, fish, and birds above the slogan “Together for Balance.” Every time María passed the mural, she smiled. The mangroves had survived — and so had their promise to keep Puerto Rico’s coasts alive."}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:30:05.793235+00:00', '2025-10-28T19:18:48.255073+00:00', '{}'::jsonb, 'Phase 2 – Story: Operation Mangrove Rescue

1️⃣ The Problem
The fifth-grade science class at Punta Luna Elementary had been studying how mangroves protect the coast from erosion. One afternoon, their teacher, Ms. Rivera, showed them photos of damaged roots after a recent storm. “The shoreline is shrinking,” she said softly. “If the trees disappear, so will the fish habitats.” María felt a pull in her chest. She raised her hand. “What can we do to help?”
2️⃣ A Plan for Action
Ms. Rivera explained that local scientists were asking for volunteers to plant new seedlings in the nearby estuary. Excited murmurs filled the room. Roberto, the class president, suggested naming the project Operation Mangrove Rescue. The students divided into teams: one for research, one for planting, and one for data collection. They agreed to work every Saturday until the restoration was complete.
3️⃣ Learning Before Doing
Before planting, each team learned about biodiversity and how ecosystems stay in balance. María’s team discovered that mangroves not only protect beaches but also shelter baby fish and filter salt water. They wrote questions for a local marine biologist: “How deep should roots go?” “What kind of mud works best?” Their curiosity grew with every answer.
4️⃣ Planting Day
On a bright Saturday morning, the students arrived with boots, shovels, and notebooks. The air smelled of sea salt and wet earth. They planted each seedling carefully, measuring equal distances so the roots would spread evenly. Roberto used a drone to take photos from above, capturing neat green rows. María smiled when she noticed tiny crabs crawling between the roots — the mangroves were already bringing life back.
5️⃣ A Storm Test
Two weeks later, heavy rain arrived. The class worried the new mangroves would wash away. When they returned, mud covered the path, but the seedlings were still standing strong. “The roots held the soil!” María shouted. They recorded the data: erosion reduced by 30 percent. Their teacher nodded. “This,” she said, “is how science and teamwork protect our home.”
6️⃣ Sharing Their Findings
Back at school, the students created a presentation for the town’s community center. They explained how restoration projects could reduce flooding and save coastal houses. Parents clapped as Roberto showed before-and-after photos, and María read their conclusion: “Healthy mangroves mean a healthy community.” Their pride filled the room.
7️⃣ A Lasting Impact
A month later, the mayor invited the class to paint a mural by the pier to remind everyone to protect the environment. They added bright green leaves, fish, and birds above the slogan “Together for Balance.” Every time María passed the mural, she smiled. The mangroves had survived — and so had their promise to keep Puerto Rico’s coasts alive.
lee la historia completa en ingles', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('4ab3ecf8-c941-40f7-8594-a38112b28267', 'exercise', 'multiple_choice', 'Ejercicio 9 – Multiple Choice (Intermedio) NEW', NULL, '{"answers":[{"text":"Porque dejó de llover.","imageUrl":null,"isCorrect":false},{"text":"Porque su amiga la ayudó.","imageUrl":null,"isCorrect":true},{"text":"Porque no fue a la escuela","imageUrl":null,"isCorrect":false}],"question":"El día nublado de Sofía ☁️\n📖 Sofía llegó triste a la escuela porque llovía y olvidó su sombrilla. Su amiga Laura compartió la suya. Sofía se sintió agradecida y la mañana se volvió más alegre.\n¿Por qué Sofía cambió su estado de ánimo?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:20:00.370739+00:00', '2025-10-28T18:20:00.370739+00:00', '{}'::jsonb, 'Lectura 3 (Socioemocional)
Título: El día nublado de Sofía ☁️
📖 Sofía llegó triste a la escuela porque llovía y olvidó su sombrilla. Su amiga Laura compartió la suya. Sofía se sintió agradecida y la mañana se volvió más alegre.
Ejercicio 9 – Multiple Choice
🔊 “¿Por qué Sofía cambió su estado de ánimo?”

a) Porque dejó de llover.
b) Porque su amiga la ayudó ✅
c) Porque no fue a la escuela.
No digas la respuesta. 
La respuesta es: Porque su amiga la ayudó.', NULL, NULL, NULL, 3, '92644b4a-c1a3-4cd8-8f81-c143233139e8', NULL, NULL, 70),
  ('b2a386ed-b5a5-46b8-8131-2e3c9c738ce8', 'lesson', 'lesson', 'Phase 1 – Standards Table, Expanded Academic Purpose, and Academic Glossary', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":" Expanded Academic Lesson Purpose\nThis lesson integrates language development and environmental science to promote literacy through ecological awareness and civic responsibility.\nStudents will:\n\n1️⃣ Strengthen phonemic awareness and phonics through scientific vocabulary (e.g., ecosystem, erosion, restoration).\n\n2️⃣ Apply vocabulary strategies to interpret new words in authentic contexts, using prefix/root/suffix analysis.\n\n3️⃣ Develop reading fluency by practicing oral expression of informational and narrative text.\n\n4️⃣ Demonstrate reading comprehension through literal, inferential, and analytical responses about problem-solving and environmental impact.\n\n5️⃣ Express ideas clearly through writing and reflection, connecting language use to environmental action and community service.\nThis bilingual AI-adaptive module aligns with PRDE’s vision of promoting STEAM literacy, 21st-century skills, and multilingual communication, providing scaffolds (audio 🔊 and imagery 🖼️) for diverse learning needs.\n"}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:18:45.867589+00:00', '2025-10-28T19:18:57.388518+00:00', '{}'::jsonb, 'AI-ADAPTIVE INTERACTIVE READING MODULE – GRADE 5 (ON-LEVEL)
Story Title: Operation Mangrove Rescue
Lexile Range: 690L–720L  Duration: 45–60 minutes
Integration: Science, English, and Environmental Literacy
Domains: Phonemic Awareness · Phonics · Vocabulary · Fluency · Comprehension · Writing
Format: PRDE Blue Headers · Century Gothic 12 pt · ✅ Correct Marks · 🔊 Audio Icons · 🖼️ Imagery Prompts
Instructions: Bilingual (English above Spanish). Each phase begins on a new page.
________________________________________
📘 PRDE English Standards (2022) – Grade 5 Aligned to the Five Domains of Reading
Domain of Reading	Instructional Focus	PRDE Standard Code & Descriptor
Phonemic Awareness	Identify, manipulate, and pronounce multisyllabic environmental terms.	5.L.1a – Demonstrate command of English phonology and pronunciation conventions.
Phonics & Word Recognition	Decode words with prefixes/suffixes and use roots to understand academic terms.	5.L.4a, 5.R.3A – Apply word structure and context to confirm meaning and decoding accuracy.
Fluency	Read aloud scientific and narrative text with accuracy, pacing, and expression.	5.R.4 – Read fluently and with sufficient accuracy to support comprehension.
Vocabulary	Understand and use Tier 2–3 vocabulary related to ecology and teamwork.	5.L.4b, 5.L.5a – Determine word meaning through morphology and figurative language.
Comprehension	Analyze cause and effect, summarize, and infer lessons about environmental protection.	5.R.1, 5.R.2, 5.R.3, 5.R.6 – Apply textual evidence to comprehension and inference.
________________________________________
🎯 Expanded Academic Lesson Purpose
This lesson integrates language development and environmental science to promote literacy through ecological awareness and civic responsibility.
Students will:

1️⃣ Strengthen phonemic awareness and phonics through scientific vocabulary (e.g., ecosystem, erosion, restoration).

2️⃣ Apply vocabulary strategies to interpret new words in authentic contexts, using prefix/root/suffix analysis.

3️⃣ Develop reading fluency by practicing oral expression of informational and narrative text.

4️⃣ Demonstrate reading comprehension through literal, inferential, and analytical responses about problem-solving and environmental impact.

5️⃣ Express ideas clearly through writing and reflection, connecting language use to environmental action and community service.
This bilingual AI-adaptive module aligns with PRDE’s vision of promoting STEAM literacy, 21st-century skills, and multilingual communication, providing scaffolds (audio 🔊 and imagery 🖼️) for diverse learning needs.
________________________________________




📗 Academic Glossary / Glosario Académico
Word (EN)	Meaning (EN)	Significado (ES)
mangrove	A tropical tree that grows in coastal water and protects shorelines.	Árbol tropical que crece en zonas costeras y protege las orillas.
ecosystem	A community of living things interacting with their environment.	Comunidad de seres vivos que interactúan con su entorno.
erosion	The wearing away of land by wind or water.	Desgaste de la tierra causado por el viento o el agua.
habitat	The natural home of an animal or plant.	Lugar natural donde vive un animal o planta.
restoration	The act of bringing something back to its original condition.	Acción de devolver algo a su estado original.
biodiversity	The variety of life in a particular habitat.	Diversidad de vida en un hábitat determinado.
estuary	The area where a river meets the sea.	Área donde un río se une con el mar.
roots	The part of a plant that absorbs water and holds it in place.	Parte de una planta que absorbe agua y la mantiene fija.
volunteer	A person who works by choice to help others.	Persona que trabaja por decisión propia para ayudar a otros.
balance	A state of stability or equality.	Estado de equilibrio o estabilidad.

', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('86b0a150-1bcd-4fdf-80f5-04d4ad00d3ff', 'exercise', 'true_false', 'Lee la premisa y responda verdadero o falso. ', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"¿Samuel se sintió agradecido?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:07:12.989425+00:00', '2025-10-28T18:07:12.989425+00:00', '{}'::jsonb, NULL, NULL, 'Retroalimentación:
✅ “Correcto. Su sonrisa muestra gratitud.”
❌ “Observa: el texto dice que Samuel sonrió y dio las gracias.”
', NULL, 3, '29c9c7cc-aa5f-4813-9266-f2852d586b33', NULL, NULL, 70),
  ('9a916843-cc02-44b1-813b-fff816b3a90e', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta. ', NULL, '{"answers":[{"text":"Que es importante ser popular","imageUrl":null,"isCorrect":false},{"text":"Que compartir puede hacer feliz a otros ","imageUrl":null,"isCorrect":true},{"text":"Que no debe prestar sus cosas","imageUrl":null,"isCorrect":false}],"question":"¿Qué aprendió Valeria con su acción?”"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T18:00:37.182755+00:00', '2025-10-28T18:00:37.182755+00:00', '{}'::jsonb, NULL, NULL, '✅ “Excelente. Valeria comprendió el valor de compartir y ayudar.”
❌ “Piensa: la historia muestra empatía, no interés personal.”
', NULL, 3, '29c9c7cc-aa5f-4813-9266-f2852d586b33', NULL, NULL, 70),
  ('29c9c7cc-aa5f-4813-9266-f2852d586b33', 'lesson', 'lesson', 'DOMINIO 4: Comprensión lectora literal e inferencial. Nivel Avanzado ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Comprender información explícita (literal) e inferir significados, sentimientos o causas implícitas en textos narrativos e informativos."}'::jsonb, 5, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T17:58:46.960727+00:00', '2025-10-28T19:26:34.130983+00:00', '{}'::jsonb, 'Debes leer la lectura a viva voz. 
Lectura 2 – Socioemocional: El valor de compartir
📖
En la escuela, Valeria notó que su amigo Samuel no tenía meriendas.
Sin pensarlo, partió su sándwich y se lo ofreció.
Samuel sonrió y dijo: “Gracias, pensé que nadie se daría cuenta.”
Ese día, Valeria aprendió que compartir algo pequeño puede cambiar el día de alguien.

', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('5caa17d8-9791-4111-baba-843b76b78012', 'exercise', 'multiple_choice', 'Selecciona la explicación correcta. ', NULL, '{"answers":[{"text":"Calienta los océanos","imageUrl":null,"isCorrect":false},{"text":"b)\tPermite que las plantas produzcan su alimento ","imageUrl":null,"isCorrect":true},{"text":"c)\tHace que el cielo sea azul","imageUrl":null,"isCorrect":false}],"question":"Explica ca por qué el sol es importante."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T17:57:38.943358+00:00', '2025-10-28T17:57:38.943358+00:00', '{}'::jsonb, 'Debes leer la lectura 1 para que el estudiante entienda. ', NULL, 'Excelente. Has identificado el detalle que apoya la idea principal.”
“Revisa: la importancia del sol se relaciona con la vida y las plantas.”
', NULL, 3, '85eaaf54-e966-4bba-8ab2-d2821dc5c402', NULL, NULL, 70),
  ('45e00795-47e3-4fff-aea3-8c356ace3152', 'exercise', 'true_false', 'Lee la premisa y responda verdadero o falso. ', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"El texto dice que el sol permite que las plantas respiren","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761673701560-Solar%20Energy%20in%20Action.png"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T17:55:21.311181+00:00', '2025-10-28T17:55:21.311181+00:00', '{}'::jsonb, 'Debes hacer refencia a la Lectura 1 – Ciencia: La energía del sol para que el estudiante comprenda. ', NULL, '✅ “Muy bien. El texto explica que las plantas producen oxígeno gracias a la luz del sol.”
❌ “Revisa: el texto habla del oxígeno, no de respiración directa.”
', NULL, 3, '85eaaf54-e966-4bba-8ab2-d2821dc5c402', NULL, NULL, 70),
  ('9d9e6355-00e4-46fe-b94e-0588f810804c', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta. ', NULL, '{"answers":[{"text":"Decorar el cielo","imageUrl":null,"isCorrect":false},{"text":"Iluminar las noches","imageUrl":null,"isCorrect":false},{"text":"Producir energía para la vida ","imageUrl":null,"isCorrect":true}],"question":"¿Cuál es la función principal del sol según el texto?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T17:52:32.726353+00:00', '2025-10-28T17:52:32.726353+00:00', '{}'::jsonb, 'Debes hacer refencia a la Lectura 1 – Ciencia: La energía del sol para que el estudiante comprenda. ', NULL, 'Retroalimentación:
✅ “Correcto. El texto dice que el sol es la fuente de energía principal para la vida.”
❌ “Relee: el texto menciona que las plantas necesitan la luz del sol para vivir.”
', NULL, 3, '85eaaf54-e966-4bba-8ab2-d2821dc5c402', NULL, NULL, 70),
  ('85eaaf54-e966-4bba-8ab2-d2821dc5c402', 'lesson', 'lesson', 'DOMINIO 4: Comprensión lectora literal e inferencial. Nivel Básico ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Comprender información explícita (literal) e inferir significados, sentimientos o causas implícitas en textos narrativos e informativos.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761673427874-Solar%20Energy%20in%20Action.png"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T17:50:40.857819+00:00', '2025-10-28T17:50:40.857819+00:00', '{}'::jsonb, '🔊 “Comprender un texto es más que leerlo:
Significa descubrir lo que dice y también lo que sugiere.
Lectura 1 – Ciencia: La energía del sol
📖 El sol es la fuente principal de energía para la Tierra.
Gracias a su luz, las plantas pueden producir su alimento y liberar oxígeno.
Sin el sol, la vida no podría existir. Por eso, debemos cuidar el planeta que recibe su calor cada día.

', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('56aa5b63-eafb-4d1c-8bc9-6f5abe4498ce', 'lesson', 'lesson', 'DOMINIO 4: Comprensión lectora literal e inferencial', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Comprender información explícita (literal) e inferir significados, sentimientos o causas implícitas en textos narrativos e informativos."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T17:44:49.62444+00:00', '2025-10-28T17:44:49.62444+00:00', '{}'::jsonb, '🔊 “Comprender un texto es más que leerlo:
Significa descubrir lo que dice y también lo que sugiere.
La comprensión literal es entender los datos o hechos que aparecen directamente.
La comprensión inferencial es leer entre líneas, descubrir lo que el autor no dice, pero insinúa.
📖 Escucha, lee y responde con atención.
¡Aprenderás a pensar como un lector detective!”
', NULL, 'Nivel Básico 
Nivel Avanzado ', NULL, 3, NULL, NULL, NULL, 70),
  ('b6d5310a-8c7e-4680-9b09-641ca0a35b81', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta.', NULL, '{"answers":[{"text":"agua","imageUrl":null,"isCorrect":false},{"text":"fuego ","imageUrl":null,"isCorrect":false},{"text":"tierra","imageUrl":null,"isCorrect":true}],"question":"¿Qué significa la raíz griega geo?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T17:41:13.132397+00:00', '2025-10-28T17:43:19.469199+00:00', '{}'::jsonb, 'Hacer referencia a la lectura breve de la lección - Ciencia. Este ejercicio se relaciona a las raíces griegas y su significado ', NULL, '✅ “Excelente. Geo significa ‘tierra’, como en geografía o geología.”
❌ “Observa: geo se relaciona con la tierra, no con el agua ni el fuego.”

🎓 CIERRE DEL DOMINIO 3
🔊 “¡Excelente trabajo!
Aprendiste cómo las palabras pueden cambiar su significado con pequeños fragmentos: los prefijos, sufijos y raíces.
Cuando encuentres una palabra nueva, detente y observa sus partes.
Verás que cada pedacito cuenta una historia.
🌟 ¡Sigue explorando las palabras para volverte un lector y escritor más fuerte!”

', NULL, 3, '4b3586a9-c5a7-455c-af16-5735f222dc76', NULL, NULL, 70),
  ('93b52549-20a9-4d1d-8f9e-d79407149c4b', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta. ', NULL, '{"answers":[{"text":"vida","imageUrl":null,"isCorrect":true},{"text":"luz","imageUrl":null,"isCorrect":false},{"text":"aire","imageUrl":null,"isCorrect":false}],"question":"¿Qué significa la raíz griega bio?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T17:38:13.734586+00:00', '2025-10-28T17:39:21.271662+00:00', '{}'::jsonb, 'Hacer referencia a la lectura breve de la lección - Ciencia. Este ejercicio se relaciona a las raíces griegas y su significado ', NULL, '✅ “Correcto. Auto significa ‘uno mismo’, como en automóvil o autobiografía.”
❌ “Recuerda: auto se usa para indicar que algo se hace por sí mismo.”
', NULL, 3, '4b3586a9-c5a7-455c-af16-5735f222dc76', NULL, NULL, 70),
  ('2e69c1d7-e800-4ef6-8449-176135a29819', 'exercise', 'multiple_choice', ' Selecciona la alternativa correcta.', NULL, '{"answers":[{"text":"vida","imageUrl":null,"isCorrect":false},{"text":"uno mismo","imageUrl":null,"isCorrect":true},{"text":" tierra","imageUrl":null,"isCorrect":false}],"question":"¿Qué significa la raíz griega auto?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T17:36:17.271193+00:00', '2025-10-28T17:36:17.271193+00:00', '{}'::jsonb, 'Debes hacer referencia a la lectura breve. Este ejercicios tiene que ver con las Raíces griegas y su significado ', NULL, '✅ “Correcto. Auto significa ‘uno mismo’, como en automóvil o autobiografía.”
❌ “Recuerda: auto se usa para indicar que algo se hace por sí mismo.”
', NULL, 3, '4b3586a9-c5a7-455c-af16-5735f222dc76', NULL, NULL, 70),
  ('53b7e91a-b78e-43ec-84d7-bd612acb1405', 'exercise', 'true_false', 'Lección 3 – Raíces griegas y latinas. Contesta verdadero o falso. ', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":false},{"text":"False","imageUrl":null,"isCorrect":true}],"question":"¿La palabra geología tiene relación con la vida de los animales?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T17:32:19.214003+00:00', '2025-10-28T17:33:30.467951+00:00', '{}'::jsonb, 'Debes hacer referencia a la leccion y leer la lectura breve de Ciencia para que el estudiante entienda la pregunta. ', NULL, '✅ “Correcto. Geo significa tierra; la geología estudia el suelo, no los seres vivos.”
❌ “Recuerda: bio es vida, geo es tierra.”
', NULL, 3, '4b3586a9-c5a7-455c-af16-5735f222dc76', NULL, NULL, 70),
  ('f0d31db3-4d04-47f2-abba-d2349abe5e03', 'exercise', 'multiple_choice', 'Seleccona la mejor alternativa. ', NULL, '{"answers":[{"text":"Paciencia","imageUrl":null,"isCorrect":false},{"text":"Cuidadosamente ","imageUrl":null,"isCorrect":true},{"text":"Panadero","imageUrl":null,"isCorrect":false}],"question":"¿Cuál palabra con sufijo indica cómo realiza la acción?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T17:22:40.758377+00:00', '2025-10-28T17:22:40.758377+00:00', '{}'::jsonb, NULL, NULL, 'Retroalimentación:
✅ “Correcto. El sufijo -mente indica modo o manera.”
❌ “Piensa: la palabra con -mente muestra cómo se hace algo.”
', NULL, 3, '4b3586a9-c5a7-455c-af16-5735f222dc76', NULL, NULL, 70),
  ('4b3586a9-c5a7-455c-af16-5735f222dc76', 'lesson', 'lesson', 'DOMINIO 3: Vocabulario y Morfología Derivativa. Nivel Avanzado ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Ampliar el vocabulario académico mediante el análisis de raíces, prefijos y sufijos; deducir el significado de palabras desconocidas en contexto."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T17:21:16.139215+00:00', '2025-10-28T17:29:27.592347+00:00', '{}'::jsonb, 'Lección 2 – Sufijos comunes (-ción, -mente, -ero, -ista)
Explicación breve IA:
🔊 “Los sufijos se colocan al final y cambian el tipo de palabra:
•	-ción forma nombres de acciones (educar → educación).
•	-mente forma adverbios (rápido → rápidamente).
•	-ero y -ista indican profesiones o aficiones (panadero, artista).”
Lectura breve – Estudios Sociales:
📖
En el taller de mi comunidad, el panadero trabaja con paciencia.
Cada día prepara el pan cuidadosamente y con dedicación.
Lección 3 – Raíces griegas y latinas
📘 Explicación breve IA:
🔊 “Muchas palabras vienen del griego o del latín.
Si conoces su raíz, podrás entender su significado.
Ejemplo: bio significa vida, geo tierra, auto uno mismo.”
Lectura breve – Ciencia:
📖
La biología estudia los seres vivos y sus procesos.
La geografía estudia la Tierra, sus montañas y mares.


', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('5c032f8f-b214-40f5-9b3e-d241191eaff2', 'exercise', 'drag_drop', 'Lee la definición, arrastra las letras al orden correcto y escribe la palabra completa.', NULL, '{"mode":"letters","question":"Hacer algo nuevamente o una segunda vez.","targetWord":"repetir","autoShuffle":true,"availableLetters":["r","e","p","e","t","i","r","d","m","u"]}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T17:12:48.464763+00:00', '2025-10-28T17:12:48.464763+00:00', '{}'::jsonb, 'lentamente. R – E – P – E – T – I – R – L – A', NULL, 'Drag and Roll (prefijo y significado)', NULL, 3, '720f8240-bb02-4318-ac13-b640117b2683', NULL, 'letters', 70),
  ('494eca20-796d-496b-9cf1-45b52860371e', 'exercise', 'multiple_choice', 'Ejercicio 1 – Multiple Choice (Básico) NEW ', NULL, '{"answers":[{"text":"En la escuela ","imageUrl":null,"isCorrect":false},{"text":"En el parque ","imageUrl":null,"isCorrect":true},{"text":"En su casa","imageUrl":null,"isCorrect":false}],"question":"La pelota perdida ⚽ 📖 Luis jugaba con sus amigos en el parque. De pronto, la pelota rodó hasta un jardín lleno de flores. Luis pidió permiso a la señora del jardín, recuperó la pelota y le dio las gracias. \n¿Dónde jugaba Luis?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:58:10.068788+00:00', '2025-10-28T18:21:16.432312+00:00', '{}'::jsonb, 'Lectura 1 (Narrativa – socioemocional)
Título: La pelota perdida ⚽
📖 Luis jugaba con sus amigos en el parque. De pronto, la pelota rodó hasta un jardín lleno de flores. Luis pidió permiso a la señora del jardín, recuperó la pelota y le dio las gracias.
Ejercicio 1 – Multiple Choice
🔊 “¿Dónde jugaba Luis?”

a) En la escuela 
b) En el parque ✅ 
c) En su casa
Retroalimentación:
✅ “¡Correcto! El texto dice que jugaba en el parque.”
❌ “Relee: el texto menciona el lugar donde estaba Luis.”
No digas la respuesta. 
La respuesta es: En el parque', NULL, NULL, NULL, 3, '92644b4a-c1a3-4cd8-8f81-c143233139e8', NULL, NULL, 70),
  ('92644b4a-c1a3-4cd8-8f81-c143233139e8', 'lesson', 'lesson', 'DOMINIO 4: COMPRENSIÓN LITERAL E INFERENCIAL NEW ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Destreza:\nIdentificar información explícita: personajes, lugar, tiempo, acciones y detalles del texto.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:51:15.603625+00:00', '2025-10-28T16:51:15.603625+00:00', '{}'::jsonb, 'Nivel: 3.º grado
Duración: 30–35 min
Tipo: Módulo IA de lectura y razonamiento con actividades interactivas
Estándares DEPR:
•	3.R.3.2 – Identifica detalles e ideas principales en textos narrativos e informativos.
•	3.R.4.1 – Realiza inferencias basadas en información textual.
•	3.R.5.1 – Usa evidencia textual para justificar respuestas.
Explicación inicial de la destreza (voz IA 👂 / lectura 📖)
Lecturas breves narrativas e informativas con contenido académico y socioemocional
Actividades básicas (5) e intermedias (5)
Retroalimentación inmediata programable (✅ / ❌)
Conexión con los estándares DEPR
🎙️ INTRODUCCIÓN IA (voz narradora)
🔊 “¡Hola!
En este módulo aprenderás a comprender lo que lees literalmente y también a inferir, es decir, a descubrir lo que el texto sugiere aunque no lo diga directamente.
Para comprender bien un texto:
•	Observa los detalles.
•	Piensa en lo que el autor te quiere decir.
•	Usa las pistas del texto y tus conocimientos.
Usa 🔊 para escuchar el texto y 📖 para leerlo tú.
¡Vamos a convertirnos en detectives de la lectura!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('8618a2ce-7289-437b-b5c1-06f06c013330', 'lesson', 'lesson', 'CIERRE DEL DOMINIO 3 (voz IA) NEW ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🔊 🌟 Recuerda:\n•\tEl contexto te da pistas.\n•\tLos prefijos y sufijos cambian el sentido.\n•\tLas raíces nos dicen el significado base.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:38:01.62519+00:00', '2025-10-28T16:38:01.62519+00:00', '{}'::jsonb, '🌈 CIERRE DEL DOMINIO 3 (voz IA)
🔊 “¡Magnífico trabajo!
Hoy aprendiste a descubrir el significado de palabras nuevas usando el contexto y las partes de las palabras.
🔊 🌟 Recuerda:
•	El contexto te da pistas.
•	Los prefijos y sufijos cambian el sentido.
•	Las raíces nos dicen el significado base.
📖 🔊¡Ahora entiendes mejor lo que lees y puedes usar palabras más precisas al escribir y hablar!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('08177d5c-a9b3-4617-b417-3ce05d124122', 'exercise', 'write_answer', 'Fill in the blank', NULL, '{"question":"The mystery was solved by using careful ______.\n   A) observation \n   B) decoration\n   C) celebration\n","caseSensitive":false,"correctAnswer":"observation"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:37:34.572577+00:00', '2025-10-28T19:49:56.518643+00:00', '{}'::jsonb, 'The mystery was solved by using careful ______.
   A) observation ✅
   B) decoration
   C) celebration
', NULL, NULL, NULL, 3, '7f0e9ad6-acb8-4aeb-9573-b09887304265', NULL, NULL, 70),
  ('369e4934-766a-4406-b66e-8949c4f6fea1', 'exercise', 'true_false', 'True or False', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"A good reflection explains what you learned and why it matters."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:36:02.106503+00:00', '2025-10-28T19:49:37.825035+00:00', '{}'::jsonb, 'True or False: A good reflection explains what you learned and why it matters.
   A) True ✅
   B) False', NULL, NULL, NULL, 3, '7f0e9ad6-acb8-4aeb-9573-b09887304265', NULL, NULL, 70),
  ('c72045fb-8683-4848-a6e2-7f3416590d13', 'exercise', 'multiple_choice', 'The main idea ', NULL, '{"answers":[{"text":"Students used observation to solve a nature mystery. ","imageUrl":null,"isCorrect":true},{"text":"Building a treehouse is easy.","imageUrl":null,"isCorrect":false},{"text":"Beavers are dangerous.","imageUrl":null,"isCorrect":false}],"question":"What is the main idea of the story?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:35:02.666918+00:00', '2025-10-28T19:20:55.106523+00:00', '{}'::jsonb, 'What is the main idea of the story?
   A) Students used observation to solve a nature mystery. ✅
   B) Building a treehouse is easy.
   C) Beavers are dangerous.
', NULL, NULL, NULL, 3, '7f0e9ad6-acb8-4aeb-9573-b09887304265', NULL, NULL, 70),
  ('21c78505-12fb-49c0-a59b-545d44e37767', 'exercise', 'true_false', 'Vedadero o Falso. ', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"El prefijo ‘des-’ indica lo contrario.\n¿La palabra desordenar significa poner en orden?\n"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:34:12.292718+00:00', '2025-10-28T16:34:12.292718+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '720f8240-bb02-4318-ac13-b640117b2683', NULL, NULL, 70),
  ('29caef70-3bd6-4cac-a107-3fe8695e1167', 'exercise', 'multiple_choice', 'Selecciona la alternativa correcta.', NULL, '{"answers":[{"text":"Leer una sola vez","imageUrl":null,"isCorrect":false},{"text":"Leer antes","imageUrl":null,"isCorrect":false},{"text":"Leer otra vez ","imageUrl":null,"isCorrect":true}],"question":"¿Qué significa la palabra releer?"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:33:12.015794+00:00', '2025-10-28T16:33:12.015794+00:00', '{}'::jsonb, NULL, NULL, 'Retroalimentación:
✅ “Muy bien. Re- significa repetir una acción.”
❌ “Recuerda: releer quiere decir volver a leer
', NULL, 3, '720f8240-bb02-4318-ac13-b640117b2683', NULL, NULL, 70),
  ('7f0e9ad6-acb8-4aeb-9573-b09887304265', 'lesson', 'lesson', 'PHASE 6 – WRITING & REFLECTION', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Read and choose the best response. Some items ask what you would write.\nInstrucción (ES): Lee y selecciona la mejor respuesta. Algunos ejercicios piden qué escribirías."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:33:11.765388+00:00', '2025-10-28T19:20:12.559371+00:00', '{}'::jsonb, 'PHASE 6 – WRITING & REFLECTION
Instruction (EN): Read and choose the best response. Some items ask what you would write.
Instrucción (ES): Lee y selecciona la mejor respuesta. Algunos ejercicios piden qué escribirías.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('2b8e1d36-a915-4945-abeb-d995b9a96f87', 'exercise', 'drag_drop', 'Drag & Drop (Sequence)', NULL, '{"mode":"match","question":"Put the events in order:","dropZones":[{"id":"zone-1761668623416","label":"1"},{"id":"zone-1761668624693","label":"2"},{"id":"zone-1761668625487","label":"3"},{"id":"zone-1761668625982","label":"4"}],"draggableItems":[{"id":"item-1761668647629","content":"Discussed learning ","correctZone":"zone-1761668625982"},{"id":"item-1761668656743","content":"Followed the path","correctZone":"zone-1761668624693"},{"id":"item-1761668668516","content":"Saw the beaver","correctZone":"zone-1761668625487"},{"id":"item-1761668678356","content":"Heard a sound","correctZone":"zone-1761668623416"}],"allowMultiplePerZone":false}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:32:14.2839+00:00', '2025-10-28T19:49:20.70309+00:00', '{}'::jsonb, 'Drag & Drop (Sequence): Put the events in order:', NULL, NULL, NULL, 3, '643d55d1-17cd-4f0a-bf92-103e4b240ec2', NULL, 'match', 70),
  ('720f8240-bb02-4318-ac13-b640117b2683', 'lesson', 'lesson', 'DOMINIO 3: Vocabulario y Morfología Derivativa. Nivel Básico ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Lección 1 – Prefijos comunes (re-, des-, pre-)"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:31:20.694891+00:00', '2025-10-28T16:31:20.694891+00:00', '{}'::jsonb, '“El prefijo va al inicio de la palabra y cambia su significado.
•	re- significa repetir o hacer otra vez.
•	des- significa lo contrario o eliminar.
•	pre- significa antes.”

', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('666bcefe-5c9e-4e0c-910e-186bd13c4548', 'lesson', 'lesson', 'DOMINIO 3: Vocabulario y Morfología Derivativa', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Ampliar el vocabulario académico mediante el análisis de raíces, prefijos y sufijos; deducir el significado de palabras desconocidas en contexto."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:30:06.327255+00:00', '2025-10-28T16:30:06.327255+00:00', '{}'::jsonb, '🔊 “Las palabras están formadas por partes que tienen significado.
Si aprendes a reconocer sus partes —prefijos, raíces y sufijos— podrás entender y usar muchas más palabras.
Hoy vas a descubrir cómo una pequeña parte de una palabra puede cambiar todo su significado.
 Escucha, observa y selecciona la respuesta correcta para aprender cómo se forman las palabras.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('6a1fb289-b12d-4dbc-8aef-bbab8edc6c87', 'exercise', 'write_answer', 'Fill in the blank', NULL, '{"question":"Blake told them to ______ their observations.\n   A) write \n   B) ignore\n   C) erase\n","caseSensitive":false,"correctAnswer":"write"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:29:30.991249+00:00', '2025-10-28T19:49:04.626543+00:00', '{}'::jsonb, 'Blake told them to ______ their observations.
   A) write ✅
   B) ignore
   C) erase
', NULL, NULL, NULL, 3, '643d55d1-17cd-4f0a-bf92-103e4b240ec2', NULL, NULL, 70),
  ('4dc9506c-0144-451d-b817-e0e29376a23f', 'exercise', 'multiple_choice', 'Lee el texto y selecciona la opción que muestra correctamente las pausas según los signos de puntuación. ', NULL, '{"answers":[{"text":"Daniel quería aprender a tocar guitarra / pero al principio se frustraba // Sin embargo practicó cada día y al fin logró tocar su canción","imageUrl":null,"isCorrect":false},{"text":"Daniel quería aprender a tocar guitarra, pero al principio se frustraba // Sin embargo, practicó cada día / y al fin logró tocar su canción ","imageUrl":null,"isCorrect":true},{"text":"Daniel quería aprender a tocar guitarra pero al principio se frustraba / Sin embargo, practicó cada día / y al fin logró tocar su canción","imageUrl":null,"isCorrect":false}],"question":"Daniel quería aprender a tocar guitarra, pero al principio se frustraba. Sin embargo, practicó cada día, y al fin logró tocar su canción."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:28:37.800768+00:00', '2025-10-28T16:28:37.800768+00:00', '{}'::jsonb, NULL, NULL, '🎓 CIERRE DEL DOMINIO 2
🔊 “¡Muy bien!
Hoy practicaste leer con ritmo, emoción y comprensión.
Recuerda: una lectura fluida no se trata de velocidad, sino de entender y disfrutar cada palabra.
📖 ¡Sigue practicando para que tu voz transmita lo que sientes cuando lees!”
', NULL, 3, 'a9d96dd5-14ec-41cb-8c04-037d4c9b2c49', NULL, NULL, 70),
  ('a060e5cf-de22-42ed-a61f-2ee0fba73034', 'exercise', 'multiple_choice', 'The main setting ', NULL, '{"answers":[{"text":"the gym","imageUrl":null,"isCorrect":false},{"text":"the cafeteria","imageUrl":null,"isCorrect":false},{"text":"e creek behind the school ","imageUrl":null,"isCorrect":true}],"question":"What is the main setting of the story?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:28:22.07959+00:00', '2025-10-28T19:48:44.62791+00:00', '{}'::jsonb, 'What is the main setting of the story?
   A) the creek behind the school ✅
   B) the cafeteria
   C) the gym
', NULL, NULL, NULL, 3, '643d55d1-17cd-4f0a-bf92-103e4b240ec2', NULL, NULL, 70),
  ('2584b425-54ca-4b7e-9035-2b5417bda398', 'exercise', 'true_false', 'Ejercicio 10 – Sí / No (Intermedio) NEW', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"El grupo demostró cooperación durante el proyecto de ciencias.\n¿‘Cooperación’ significa trabajar juntos?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:27:02.311773+00:00', '2025-10-28T16:27:02.311773+00:00', '{}'::jsonb, 'Ejercicio 10 – Sí / No
📖 El grupo demostró cooperación durante el proyecto de ciencias.
🔊 “¿‘Cooperación’ significa trabajar juntos?”
✅ Sí ❌ No
Retroalimentación:
✅ “¡Excelente! ‘Cooperar’ es ayudar y trabajar en equipo.”
❌ “Piensa: el grupo trabajó unido; eso es cooperación.”
No digas la respuesta.', NULL, NULL, NULL, 3, 'fea97e2a-eaad-49a3-ac4d-4c3057e54fec', NULL, NULL, 70),
  ('643d55d1-17cd-4f0a-bf92-103e4b240ec2', 'lesson', 'lesson', 'PHASE 5 – READING COMPREHENSION', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Answer using details from the story.\nInstrucción (ES): Contesta usando detalles del cuento."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:26:14.491216+00:00', '2025-10-28T19:23:24.634706+00:00', '{}'::jsonb, 'PHASE 5 – READING COMPREHENSION
Instruction (EN): Answer using details from the story.
Instrucción (ES): Contesta usando detalles del cuento.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('8f85bfe5-96b7-4f68-bf6c-8a7610be45c7', 'exercise', 'multiple_choice', 'Selecciona la mejor alternativa. ', NULL, '{"answers":[{"text":"Tristeza ","imageUrl":null,"isCorrect":false},{"text":"Frustración ","imageUrl":null,"isCorrect":false},{"text":"Perseverancia ","imageUrl":null,"isCorrect":true}],"question":"¿Qué emoción debe reflejar la voz del lector al leer el texto?”"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:26:06.043484+00:00', '2025-10-28T16:26:06.043484+00:00', '{}'::jsonb, NULL, NULL, '✅ “Correcto. La historia muestra perseverancia y paciencia.”
❌ “Piensa: el personaje no se rinde; sigue intentando.”
', NULL, 3, 'a9d96dd5-14ec-41cb-8c04-037d4c9b2c49', NULL, NULL, 70),
  ('b4fa52e0-b3ed-4833-aeba-5e4ddf0bf2f5', 'exercise', 'true_false', 'True or False', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"Fluent reading uses smooth phrasing."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:25:13.678119+00:00', '2025-10-28T19:48:28.444902+00:00', '{}'::jsonb, 'True or False: Fluent reading uses smooth phrasing.
   A) True ✅
   B) False
', NULL, NULL, NULL, 3, 'bc80b702-e8c8-4828-8d3d-0b2882dcd29a', NULL, NULL, 70),
  ('e054406a-af26-4984-a447-742323dbf141', 'exercise', 'multiple_choice', 'Punctuation ', NULL, '{"answers":[{"text":"? ","imageUrl":null,"isCorrect":true},{"text":".","imageUrl":null,"isCorrect":false},{"text":"!","imageUrl":null,"isCorrect":false}],"question":"Which punctuation shows a question?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:24:23.927838+00:00', '2025-10-28T19:48:13.558324+00:00', '{}'::jsonb, 'Which punctuation shows a question?
   A) ? ✅
   B) .
   C) !
', NULL, NULL, NULL, 3, 'bc80b702-e8c8-4828-8d3d-0b2882dcd29a', NULL, NULL, 70),
  ('a9d96dd5-14ec-41cb-8c04-037d4c9b2c49', 'lesson', 'lesson', 'DOMINIO 2: Fluidez lectora guiada y autónoma. Nivel Avanzado ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Lectura 2 – Socioemocional: El valor de la paciencia\n\nDaniel quería aprender a tocar guitarra.\nAl principio, se frustraba porque no podía tocar bien.\nPero cada día practicaba un poco más, hasta que logró tocar su primera canción.\nDescubrió que la paciencia es la clave del éxito.\n"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:24:16.39058+00:00', '2025-10-28T16:24:16.39058+00:00', '{}'::jsonb, 'Instrucción IA:
🔊 “Lee el texto tú solo.
La IA evaluará tu pronunciación, ritmo y entonación.”
Retroalimentación IA:
✅ “Excelente lectura. Tu voz mostró interés y comprensión.”
⚠️ “Haz una pausa después de cada oración y pronuncia con más claridad las palabras largas.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('a9e788f2-12ee-451b-aad3-e2bbce8739f1', 'exercise', 'true_false', 'Verdadero o Falso. ', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"El texto dice que el agua se convierte en hielo antes de volver a caer."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:23:05.342573+00:00', '2025-10-28T16:23:05.342573+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'bc6933a9-67c3-43c2-b7da-0ee1b50834ef', NULL, NULL, 70),
  ('bf8436c6-9258-4434-9e5a-b64ec144021c', 'exercise', 'multiple_choice', 'Sentence ', NULL, '{"answers":[{"text":"“We solved the mystery!” ","imageUrl":null,"isCorrect":true},{"text":"“We walked on the path.”","imageUrl":null,"isCorrect":false},{"text":"“They wrote notes.”","imageUrl":null,"isCorrect":false}],"question":"Which sentence should be read with excitement?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:22:58.27646+00:00', '2025-10-28T19:47:54.863254+00:00', '{}'::jsonb, 'Which sentence should be read with excitement?
   A) “We solved the mystery!” ✅
   B) “We walked on the path.”
   C) “They wrote notes.”
', NULL, NULL, NULL, 3, 'bc80b702-e8c8-4828-8d3d-0b2882dcd29a', NULL, NULL, 70),
  ('bc6933a9-67c3-43c2-b7da-0ee1b50834ef', 'lesson', 'lesson', 'DOMINIO 2: Fluidez lectora guiada y autónoma. Nivel Básico ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Lectura 1 – Ciencia: El agua que viaja por el mundo\n \nEl agua cambia de forma sin desaparecer.\nCuando se calienta, se convierte en vapor.\nLuego, el vapor sube, se enfría y vuelve a caer como lluvia.\nAsí el agua sigue su viaje por ríos, mares y nubes.\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761668114112-ChatGPT%20Image%20Oct%2028,%202025,%2012_14_12%20PM.png"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:22:03.597256+00:00', '2025-10-28T16:22:03.597256+00:00', '{}'::jsonb, 'El agua cambia de forma sin desaparecer.
Cuando se calienta, se convierte en vapor.
Luego, el vapor sube, se enfría y vuelve a caer como lluvia.
Así el agua sigue su viaje por ríos, mares y nubes.
Actividad 1 – Lectura guiada con modelo IA
Instrucción IA:
🔊 “Escucha la lectura con atención.
Luego, léela tú en voz alta imitando el ritmo y las pausas.”
Retroalimentación IA:
✅ “Excelente ritmo. Leíste pausando correctamente en cada punto.”
⚠️ “Recuerda hacer una pausa después de cada coma y usar tono descendente al final.”
Actividad 2 – Entonación y puntuación
Instrucción IA:
📖 “Lee las oraciones en voz alta con la entonación correcta según el signo.”
Ejemplo de texto IA:
1️⃣ ¿Dónde viaja el agua después de caer como lluvia?
2️⃣ ¡Qué increíble es el ciclo del agua!
Retroalimentación IA:
✅ “Muy bien. Cambiaste el tono al usar signos de interrogación y exclamación.”
❌ “Recuerda subir la voz al preguntar y expresar emoción en las exclamaciones.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('bc80b702-e8c8-4828-8d3d-0b2882dcd29a', 'lesson', 'lesson', 'PHASE 4 – FLUENCY & EXPRESSION ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Read aloud with expression and choose the correct answer.\nInstrucción (ES): Lee en voz alta con expresión y selecciona la respuesta correcta."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:21:31.598797+00:00', '2025-10-28T19:23:40.713218+00:00', '{}'::jsonb, 'PHASE 4 – FLUENCY & EXPRESSION 🔊
Instruction (EN): Read aloud with expression and choose the correct answer.
Instrucción (ES): Lee en voz alta con expresión y selecciona la respuesta correcta.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('f788a6f2-80f0-4c40-9959-86c2ecfe95e5', 'exercise', 'true_false', 'True or False', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":false},{"text":"Falso","imageUrl":null,"isCorrect":true}],"question":"''Hammering'' means whispering softly."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:20:22.125887+00:00', '2025-10-28T19:47:36.407622+00:00', '{}'::jsonb, 'True or False: ''Hammering'' means whispering softly.
   A) False ✅
   B) True
', NULL, NULL, NULL, 3, '64a7f980-6ac2-4b8b-96b5-ec15d8998c00', NULL, NULL, 70),
  ('5d325a55-075c-47c4-aff7-764073173a50', 'exercise', 'write_answer', 'Antonym', NULL, '{"question":"Which is the best antonym for ''quiet''?\n   A) loud ✅\n   B) gentle\n   C) calm\n","caseSensitive":false,"correctAnswer":"loud"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:18:28.172339+00:00', '2025-10-28T19:47:20.937229+00:00', '{}'::jsonb, 'Which is the best antonym for ''quiet''?
   A) loud ✅
   B) gentle
   C) calm
', NULL, NULL, NULL, 3, '64a7f980-6ac2-4b8b-96b5-ec15d8998c00', NULL, NULL, 70),
  ('1b231976-36be-41cf-8783-f0eb17299ae0', 'lesson', 'lesson', 'DOMINIO 2: Fluidez lectora guiada y autónoma', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Desarrollar la capacidad de leer en voz alta con precisión, ritmo adecuado, entonación expresiva y comprensión del significado del texto."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:16:05.162265+00:00', '2025-10-28T16:16:05.162265+00:00', '{}'::jsonb, '🔊 “En este dominio, aprenderás a leer con fluidez.
Leer con fluidez no significa leer rápido, sino hacerlo con ritmo, emoción y comprensión.
Escucha primero el modelo de lectura.
Luego, léelo tú en voz alta y deja que la IA te ayude a mejorar tu ritmo, pronunciación y entonación.
🎤 ¡Vamos a practicar juntos para leer con emoción y confianza!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('4701822d-ca24-4ebd-9398-f7245d68fe5f', 'exercise', 'drag_drop', 'Arrastra cada palabra a su categoría', NULL, '{"mode":"match","question":"Arrastra cada palabra a su categoría.","dropZones":[{"id":"zone-1761666757425","label":"Aguda"},{"id":"zone-1761666768817","label":"Llana"},{"id":"zone-1761666790713","label":"Esdrújula "}],"draggableItems":[{"id":"item-1761667152545","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761667149947-ChatGPT%20Image%20Oct%2028,%202025,%2011_56_08%20AM.png","type":"image"},"correctZone":"zone-1761666757425"},{"id":"item-1761667246743","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761667243927-ChatGPT%20Image%20Oct%2028,%202025,%2011_57_34%20AM.png","type":"image"},"correctZone":"zone-1761666768817"},{"id":"item-1761667698498","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761667696267-ChatGPT%20Image%20Oct%2028,%202025,%2012_08_07%20PM.png","type":"image"},"correctZone":"zone-1761666790713"}],"allowMultiplePerZone":false}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:09:01.790644+00:00', '2025-10-28T16:15:22.388973+00:00', '{}'::jsonb, '✅ “Excelente. Has clasificado correctamente las palabras.”
❌ “Recuerda revisar en qué letra termina cada palabra para saber si lleva tilde.”
', NULL, '🎓 CIERRE DEL DOMINIO 1
🔊 “¡Excelente trabajo!
Has practicado cómo se escriben y suenan las palabras correctamente.
Recuerda: escribir bien es pensar con claridad.
Cada vez que aplicas una regla ortográfica, haces que tus ideas sean más fáciles de entender.
🌟 ¡Vamos a seguir leyendo con precisión y confianza!”
', NULL, 3, 'c71d8a48-908f-482c-bbfa-fa1cd9dd391e', NULL, 'match', 70),
  ('b93df23e-444b-4528-994a-0699a8e17054', 'exercise', 'multiple_choice', 'Ejercicio 11 – Multiple Choice (Intermedio) NEW', NULL, '{"answers":[{"text":"hacerlo por primera vez","imageUrl":null,"isCorrect":false},{"text":"hacerlo otra vez ","imageUrl":null,"isCorrect":true},{"text":"hacerlo rápido","imageUrl":null,"isCorrect":false}],"question":"¿Qué indica el prefijo re- en la palabra reconstruir?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T16:05:28.862849+00:00', '2025-10-28T16:05:28.862849+00:00', '{}'::jsonb, 'Ejercicio 11 – Multiple Choice
🔊 “¿Qué indica el prefijo re- en la palabra reconstruir?”

a) hacerlo por primera vez 
b) hacerlo otra vez ✅ 
c) hacerlo rápido
Retroalimentación:
✅ “Muy bien. Re- significa repetir la acción.”
❌ “Escucha la palabra: reconstruir = construir de nuevo.”
No digas la respuesta. 
La respuesta es: hacerlo otra vez ', NULL, NULL, NULL, 3, 'fea97e2a-eaad-49a3-ac4d-4c3057e54fec', NULL, NULL, 70),
  ('c71d8a48-908f-482c-bbfa-fa1cd9dd391e', 'lesson', 'lesson', 'Dominio 1: Conciencia fonológica y ortográfica avanzada. Reglas de acentuación', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Reconocer, aplicar y corregir el uso de las reglas ortográficas y fonológicas del español:  reglas de acentuación"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:58:07.117985+00:00', '2025-10-28T15:58:07.117985+00:00', '{}'::jsonb, '🔊 Las palabras se clasifican según la sílaba tónica, es decir, la que se pronuncia con más fuerza:
Agudas: la fuerza está en la última sílaba (café, reloj).
Llevan tilde si terminan en n, s o vocal.
Llanas: la fuerza está en la penúltima sílaba (mesa, árbol).
Llevan tilde si no terminan en n, s o vocal.
Esdrújulas: la fuerza está en la antepenúltima sílaba (pájaro, teléfono).
Siempre llevan tilde. 
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('1fa27744-db97-4f36-af21-8e5712ee2183', 'exercise', 'write_answer', 'Determina si se escribe con “y” o “ll”.  ', NULL, '{"question":"Completa la palabra con la letra correcta: \n\nMi tío tiene un __ate en la bahía de San Juan.","caseSensitive":false,"correctAnswer":"yate","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761666558456-ChatGPT%20Image%20Oct%2028,%202025,%2011_49_12%20AM.png"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:56:08.65919+00:00', '2025-10-28T15:56:08.65919+00:00', '{}'::jsonb, NULL, NULL, '✅ “Muy bien. Yate se escribe con ‘y’ al principio.”
❌ “Recuerda: las palabras que comienzan con el sonido /ya/ se escriben con ‘y’, no con ‘ll’.”
', NULL, 3, 'ce6392b5-e73a-4fd6-b80c-211f0508944e', NULL, NULL, 70),
  ('ce6392b5-e73a-4fd6-b80c-211f0508944e', 'lesson', 'lesson', 'DOMINIO 1: Conciencia fonológica y ortográfica avanzada. Uso de ll y y', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Reconocer, aplicar y corregir el uso de las reglas ortográficas y fonológicas del español: acentuación, uso de ll/y y uso de mayúsculas y puntuación básica."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:52:24.471451+00:00', '2025-10-28T15:52:24.471451+00:00', '{}'::jsonb, '🔊 Las letras ll y y suenan igual, pero no siempre se escriben igual.
Usamos ll en palabras como lluvia, llamar, semilla.
Usamos y al final de palabras (hoy, muy, rey) o en ayuda, apoyar.

Ejemplo:
La lluvia cae y moja las flores.
Lluvia lleva ll, y y une las dos ideas.

Ejercicio 9 – Sí / No
📖 El caballo corre en el potrero.
🔊 “¿Está bien escrita la palabra caballo?”
✅ Sí ✅ ❌ No
Retroalimentación:
✅ “Muy bien. Caballo se escribe con ll al final.”
❌ “Revisa: la terminación -llo se escribe con doble l.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('93083b89-8b36-403e-b4e0-576a0dcb0856', 'exercise', 'multiple_choice', 'Escucha la oración y marca la palabra escrita correctamente.', NULL, '{"answers":[{"text":"lápis","imageUrl":null,"isCorrect":false},{"text":"lápices ","imageUrl":null,"isCorrect":true},{"text":"lápiz","imageUrl":null,"isCorrect":false}],"question":"Tengo varios _______ nuevos para pintar.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761666225302-ChatGPT%20Image%20Oct%2028,%202025,%2011_43_39%20AM.png"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:50:35.259085+00:00', '2025-10-28T15:50:35.259085+00:00', '{}'::jsonb, '✅ “Excelente. Las palabras que terminan en z cambian la z por ces en plural: lápiz → lápices.”
❌ “Recuerda: en plural, las palabras terminadas en z se escriben con ces.”
', NULL, NULL, NULL, 3, 'e638e4a2-c7ce-48ff-8648-b816e9d6c973', NULL, NULL, 70),
  ('aff5f02d-68ab-444a-832a-3e9c5e16cd72', 'exercise', 'multiple_choice', 'Synonym', NULL, '{"answers":[{"text":"noise","imageUrl":null,"isCorrect":false},{"text":"reason ","imageUrl":null,"isCorrect":true},{"text":"branch","imageUrl":null,"isCorrect":false}],"question":"Which word is a synonym for ''purpose''?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:50:10.367414+00:00', '2025-10-28T19:45:42.944375+00:00', '{}'::jsonb, 'Which word is a synonym for ''purpose''?
   A) reason ✅
   B) noise
   C) branch
', NULL, NULL, NULL, 3, '64a7f980-6ac2-4b8b-96b5-ec15d8998c00', NULL, NULL, 70),
  ('64a7f980-6ac2-4b8b-96b5-ec15d8998c00', 'lesson', 'lesson', 'PHASE 3 – VOCABULARY IN CONTEXT', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Read each item and choose the best answer.\nInstrucción (ES): Lee cada ejercicio y selecciona la mejor respuesta.\n"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:48:22.483557+00:00', '2025-10-28T19:23:53.786916+00:00', '{}'::jsonb, 'Instruction (EN): Read each item and choose the best answer.
Instrucción (ES): Lee cada ejercicio y selecciona la mejor respuesta.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('fde88ff2-ebff-4376-88a2-f7f213c076fc', 'exercise', 'multiple_choice', 'Selecciona la forma correcta de la palabra.', NULL, '{"answers":[{"text":" hermozo","imageUrl":null,"isCorrect":false},{"text":"hermoco","imageUrl":null,"isCorrect":false},{"text":"hermoso","imageUrl":null,"isCorrect":true}],"question":"El mar se ve muy _______ hoy.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761666056166-ChatGPT%20Image%20Oct%2028,%202025,%2011_40_47%20AM.png"}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:48:13.358456+00:00', '2025-10-28T15:48:13.358456+00:00', '{}'::jsonb, '✅ “Muy bien. Los adjetivos terminados en -oso o -osa se escriben con s.”
❌ “Revisa: las palabras con -oso o -osa siempre llevan s.”
', NULL, NULL, NULL, 3, 'e638e4a2-c7ce-48ff-8648-b816e9d6c973', NULL, NULL, 70),
  ('53fcc499-1314-4194-b33e-2973e5c6bed7', 'exercise', 'multiple_choice', 'Beginning sound ', NULL, '{"answers":[{"text":"purple ","imageUrl":null,"isCorrect":true},{"text":"surface","imageUrl":null,"isCorrect":false},{"text":"turtle","imageUrl":null,"isCorrect":false}],"question":"Which word has the same beginning sound as purpose?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:47:19.49658+00:00', '2025-10-28T19:44:46.522606+00:00', '{}'::jsonb, 'Which word has the same beginning sound as purpose?
   A) purple ✅
   B) surface
   C) turtle
', NULL, NULL, NULL, 3, '8cfe0c75-d0ca-40ad-ad52-b259e07dd0d3', NULL, NULL, 70),
  ('3be95ebe-fe64-4e66-8a20-a8005b4ef41f', 'exercise', 'multiple_choice', 'Selección Múltiple. Escucha y elige la palabra escrita correctamente.', NULL, '{"answers":[{"text":"silo","imageUrl":null,"isCorrect":false},{"text":"cielo","imageUrl":null,"isCorrect":true},{"text":"zilo","imageUrl":null,"isCorrect":false}],"question":" El _______ brilla en el cielo por la noche."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:46:47.276815+00:00', '2025-10-28T15:46:47.276815+00:00', '{}'::jsonb, '✅ “Excelente. Cielo se escribe con c porque va antes de la letra i.”
❌ “Recuerda: antes de e o i usamos la c.” 
', NULL, NULL, NULL, 3, 'e638e4a2-c7ce-48ff-8648-b816e9d6c973', NULL, NULL, 70),
  ('b76960dc-81c5-42b5-aa47-588afae950c2', 'exercise', 'true_false', 'Ejercicio 2 – Sí / No (Básico) NEW ', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"¿La palabra solidaridad se relaciona con ayudar a otros?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:46:31.017447+00:00', '2025-10-28T15:46:31.017447+00:00', '{}'::jsonb, 'Ejercicio 2 – Sí / No
👂 “¿La palabra solidaridad se relaciona con ayudar a otros?”
✅ Sí ❌ No
Retroalimentación:
✅ “Muy bien. Solidaridad significa ayudar o apoyar a otros.”
❌ “Escucha otra vez. El texto habla de ayudar a las familias.”
No digas la respuesta. ', NULL, NULL, NULL, 3, 'fea97e2a-eaad-49a3-ac4d-4c3057e54fec', NULL, NULL, 70),
  ('277d1182-b898-44bf-be8f-99499dc9d27f', 'exercise', 'true_false', 'Syllables ', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":" Ecosystem have 4 syllables "}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:45:44.924403+00:00', '2025-10-28T19:43:53.021465+00:00', '{}'::jsonb, 'How many syllables are in ecosystem?
   A) 4 ✅
   B) 3
   C) 5
', NULL, NULL, NULL, 3, '8cfe0c75-d0ca-40ad-ad52-b259e07dd0d3', NULL, NULL, 70),
  ('e82f8402-d3a7-4e3c-a89d-53ef5989e925', 'exercise', 'multiple_choice', 'Same vowel sound ', NULL, '{"answers":[{"text":"gray","imageUrl":null,"isCorrect":false},{"text":"green ","imageUrl":null,"isCorrect":true},{"text":"rock","imageUrl":null,"isCorrect":false}],"question":"Which word has the same vowel sound as creek?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:43:21.323761+00:00', '2025-10-28T19:42:45.200038+00:00', '{}'::jsonb, 'Which word has the same vowel sound as creek?
   A) green ✅
   B) gray
   C) rock
', NULL, NULL, NULL, 3, '8cfe0c75-d0ca-40ad-ad52-b259e07dd0d3', NULL, NULL, 70),
  ('e638e4a2-c7ce-48ff-8648-b816e9d6c973', 'lesson', 'lesson', 'DOMINIO 1: Conciencia fonológica y ortográfica avanzada. Uso de c/s/z .', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Reconocer, aplicar y corregir el uso de las reglas ortográficas y fonológicas del español: acentuación, Uso de c/s/z y uso de mayúsculas y puntuación básica."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:42:56.035458+00:00', '2025-10-28T15:44:44.267178+00:00', '{}'::jsonb, '🔊 “Las letras C, S y Z pueden sonar igual, pero se escriben de forma diferente según la palabra.
🔊 “Escucha con atención y piensa en la forma de la palabra.
Si termina en -azo o -aza, usa z.
Si termina en -oso o -ista, usa s.
Si tiene ce o ci, escribe c.”
Aprender sus reglas te ayuda a escribir correctamente.”
🔊 “Las palabras terminadas en -cito, -cita o -cecito se escriben con c, excepto si vienen de palabras con s o z.”



', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('8cfe0c75-d0ca-40ad-ad52-b259e07dd0d3', 'lesson', 'lesson', 'PHASE 2 – PHONICS & WORD WORK', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Read or listen and complete each activity.\nInstrucción (ES): Lee o escucha y completa cada actividad.\n"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:41:56.496006+00:00', '2025-10-28T19:24:12.93302+00:00', '{}'::jsonb, 'PHASE 2 – PHONICS & WORD WORK

Instruction (EN): Read or listen and complete each activity.
Instrucción (ES): Lee o escucha y completa cada actividad.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('2a1d0fe5-1546-43e1-8dc6-fc42263e6e4c', 'exercise', 'multiple_choice', 'Selección Múltiple. Escoge la alternativa correcta. ', NULL, '{"answers":[{"text":"Echo la carta al buzón. ","imageUrl":null,"isCorrect":true},{"text":"Hecho la carta al buzón.","imageUrl":null,"isCorrect":false},{"text":"Esho la carta al buzón.","imageUrl":null,"isCorrect":false}],"question":"Selecciona la oración  escrita correctamente."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:41:16.701321+00:00', '2025-10-28T15:41:40.524511+00:00', '{}'::jsonb, 'Retroalimentación:
✅ “Muy bien. Echo es del verbo echar.”
❌ “Hecho significa algo realizado; echo es del verbo echar.”
', NULL, NULL, NULL, 3, '36ce8ef7-45e4-4792-a5c7-44315b39569e', NULL, NULL, 70),
  ('ee0a12e9-da02-42f1-867e-8d49b85be140', 'exercise', 'write_answer', 'Exercise B – Beginning/Ending Sound', NULL, '{"question":"Which word starts with the same sound as beaver?","caseSensitive":false,"correctAnswer":"broom"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:40:43.051495+00:00', '2025-10-28T15:40:43.051495+00:00', '{}'::jsonb, 'Exercise B – Beginning/Ending Sound
Audio: “Listen to the word beaver.”
Which word starts with the same sound as beaver?
   A) broom 
   B) tree
   C) river
', NULL, NULL, NULL, 3, 'de84f864-0fbe-4900-ac7e-373add74df94', NULL, NULL, 70),
  ('c52ba48e-e3ca-49ae-b354-0b73f5a42b64', 'exercise', 'multiple_choice', 'Exercise A – Rhyme Match', NULL, '{"answers":[{"text":"speak ","imageUrl":null,"isCorrect":true},{"text":"crack","imageUrl":null,"isCorrect":false},{"text":"quick","imageUrl":null,"isCorrect":false}],"question":"Which word rhymes with creek?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:39:09.712023+00:00', '2025-10-28T15:39:09.712023+00:00', '{}'::jsonb, 'Exercise A – Rhyme Match
Audio: “Listen to the word creek.”
Which word rhymes with creek?
A) speak 
   B) crack
   C) quick
', NULL, NULL, NULL, 3, 'de84f864-0fbe-4900-ac7e-373add74df94', NULL, NULL, 70),
  ('36ce8ef7-45e4-4792-a5c7-44315b39569e', 'lesson', 'lesson', 'DOMINIO 1: Conciencia fonológica y ortográfica avanzada: Palabras con h muda', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Reconocer, aplicar y corregir el uso de las reglas ortográficas y fonológicas del español: acentuación, Uso de la letra h y uso de mayúsculas y puntuación básica."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:38:18.043071+00:00', '2025-10-28T15:43:18.705678+00:00', '{}'::jsonb, '🔊 “En este primer dominio, aprenderás a escribir y pronunciar correctamente las palabras.
La ortografía te ayuda a comunicarte con claridad y seguridad.
Escucha, repite y selecciona la opción correcta.
Si te equivocas, no pasa nada: te explicaré por qué y podrás intentarlo otra vez.
📖 ¡Comencemos con los sonidos y letras del español!”
🌱 NIVEL BÁSICO
Actividad 1 – Uso de b y v
📘 Explicación IA:
🔊 “Las palabras que suenan igual pueden escribirse con b o v.
Por ejemplo: boca y vaca (animal) suenan igual, pero significan cosas diferentes.”
“Las letras b y v suenan igual, pero se escriben diferente.
Para saber cuál usar, recuerda estas reglas sencillas:
✏️ Se escribe b:
•	Después de m, como en tambor, embarco.
•	En palabras que terminan en -bilidad o -bundo, como amabilidad o moribundo.
•	En los verbos haber, beber, deber, y sus formas (había, bebió, debía).
🪶 Se escribe v:
•	Después de n, como en invitar, enviar.
•	En palabras que comienzan con eva-, eve-, evi-, evo-, como evitar o evidente.
•	En los verbos ir, estar, andar, tener, cuando se usan en pasado (fui → estuve → tuve → anduve).
🧠 Consejo: si dudas, piensa en otra palabra parecida o escucha cómo suena en una frase.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('de84f864-0fbe-4900-ac7e-373add74df94', 'lesson', 'lesson', 'PHASE 1 – LISTENING WARM-UP ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Listen carefully and choose the correct answer.\nInstrucción (ES): Escucha con atención y selecciona la respuesta correcta.\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:37:32.820482+00:00', '2025-10-28T15:37:32.820482+00:00', '{}'::jsonb, 'PHASE 1 – LISTENING WARM-UP 🔊
Instruction (EN): Listen carefully and choose the correct answer.
Instrucción (ES): Escucha con atención y selecciona la respuesta correcta.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('a6a08262-78a7-4ae0-84ed-afa9b36a9b6e', 'lesson', 'lesson', 'Story: The Mystery at Maple Creek', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"1. It was a bright autumn morning when Liam, Maya, Carlos, and Emma arrived at Maple Creek Elementary. Their class had been studying ecosystems, and today’s lesson was an outdoor exploration near the small creek behind the school. The air smelled of pine trees, and colorful leaves floated on the gentle water.\n\n2. As they unpacked their notebooks, a strange thumping sound echoed through the woods. It came from beyond the tall reeds. “Did you hear that?” Maya whispered. Liam nodded. “It sounded like someone hammering!” Their teacher, Ms. Blake, encouraged them to observe quietly and write down what they noticed.\n\n3. The four friends decided to follow the sound during their observation time. They moved carefully along the path, stepping over roots and crunchy leaves. The noise grew louder—thump… thump… splash! Emma stopped. “Maybe it’s someone building a treehouse!” she guessed. Carlos grinned. “Or maybe it’s a secret experiment!”\n\n4. When they reached the clearing, they gasped. A brown beaver was building a dam across part of the creek! The sound came from its strong tail and wooden branches knocking together. Maya opened her notebook. “So that’s the mystery sound!” she said, amazed. “It’s working so hard to make a home.”\n\n5. Ms. Blake arrived with the rest of the class. She explained how beavers build dams to create ponds that protect them and other animals. The friends observed quietly as the beaver paddled across the water carrying twigs. They realized that the noise they thought was strange was really part of nature’s engineering.\n\n6. On the way back, the group talked about what they had learned. “We solved the mystery!” Emma said proudly. “But more importantly,” Maya added, “we learned that every sound in nature has a purpose.” They smiled as the creek gurgled behind them—its rhythm now familiar and friendly.\n \n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:36:49.259885+00:00', '2025-10-28T15:36:49.259885+00:00', '{}'::jsonb, '1. It was a bright autumn morning when Liam, Maya, Carlos, and Emma arrived at Maple Creek Elementary. Their class had been studying ecosystems, and today’s lesson was an outdoor exploration near the small creek behind the school. The air smelled of pine trees, and colorful leaves floated on the gentle water.

2. As they unpacked their notebooks, a strange thumping sound echoed through the woods. It came from beyond the tall reeds. “Did you hear that?” Maya whispered. Liam nodded. “It sounded like someone hammering!” Their teacher, Ms. Blake, encouraged them to observe quietly and write down what they noticed.

3. The four friends decided to follow the sound during their observation time. They moved carefully along the path, stepping over roots and crunchy leaves. The noise grew louder—thump… thump… splash! Emma stopped. “Maybe it’s someone building a treehouse!” she guessed. Carlos grinned. “Or maybe it’s a secret experiment!”

4. When they reached the clearing, they gasped. A brown beaver was building a dam across part of the creek! The sound came from its strong tail and wooden branches knocking together. Maya opened her notebook. “So that’s the mystery sound!” she said, amazed. “It’s working so hard to make a home.”

5. Ms. Blake arrived with the rest of the class. She explained how beavers build dams to create ponds that protect them and other animals. The friends observed quietly as the beaver paddled across the water carrying twigs. They realized that the noise they thought was strange was really part of nature’s engineering.

6. On the way back, the group talked about what they had learned. “We solved the mystery!” Emma said proudly. “But more importantly,” Maya added, “we learned that every sound in nature has a purpose.” They smiled as the creek gurgled behind them—its rhythm now familiar and friendly.
 
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('fae11b00-807b-4f40-a81f-d4de95e9c9f8', 'exercise', 'multiple_choice', 'Selección Mútiple: Escoge la mejor contestación. ', NULL, '{"answers":[{"text":"jitara","imageUrl":null,"isCorrect":false},{"text":"guitara","imageUrl":null,"isCorrect":false},{"text":"guitarra","imageUrl":null,"isCorrect":true}],"question":"Mi hermano toca muy bien la ________."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:36:14.088357+00:00', '2025-10-28T15:36:14.088357+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '667781dd-514c-4ccd-97bb-01184dba48df', NULL, NULL, 70),
  ('17ef1889-b43b-4729-8ec3-81b19961a8fa', 'lesson', 'lesson', 'AI–ADAPTIVE INTERACTIVE READING MODULE – GRADE 4 (On Level)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"This lesson supports Grade 4 English Language Arts standards and integrates science literacy through reading comprehension, vocabulary acquisition, and fluency development. Students explore how observation, inference, and evidence work together to construct meaning in an informational narrative that blends fiction and real-world phenomena."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:35:48.437524+00:00', '2025-10-28T19:24:29.717676+00:00', '{}'::jsonb, 'AI–ADAPTIVE INTERACTIVE READING MODULE – GRADE 4 (On Level)
Story Title: “The Mystery at Maple Creek” 🌲🦫
Lexile: ~660L  Reading Level: On Grade 4  Duration: 45–50 minutes
Alignment: DEPR English Program Standards (2022)
Domains: Phonemic Awareness · Phonics · Vocabulary · Fluency · Comprehension · Writing
Expanded Lesson Purpose (Academic Version)
This lesson supports Grade 4 English Language Arts standards and integrates science literacy through reading comprehension, vocabulary acquisition, and fluency development. Students explore how observation, inference, and evidence work together to construct meaning in an informational narrative that blends fiction and real-world phenomena.

Pedagogically, this module aims to:
1. Develop comprehension by identifying main ideas, supporting details, and cause-and-effect relationships.
2. Enhance vocabulary knowledge by teaching words through context clues, morphological analysis, and semantic grouping.
3. Strengthen phonics and decoding through multisyllabic and domain-specific words.
4. Build fluency and expression by modeling phrasing, rhythm, and punctuation awareness.
5. Foster written expression through summary and reflective writing using academic English.
6. Promote interdisciplinary thinking by linking reading and science to explore how language communicates observation, evidence, and environmental understanding.

By the end of the module, students will demonstrate integrated literacy proficiency—the ability to read, analyze, and respond to complex text while applying linguistic and cognitive strategies that support critical thinking and academic English development.
Academic Glossary / Glosario Académico
Word	Meaning (EN)	Significado (ES)
beaver	A large, brown animal that builds dams in rivers or streams using branches and mud.	Un animal grande y marrón que construye presas en ríos o arroyos usando ramas y barro.
hammering	The repeated sound or action of hitting something hard, like with a hammer.	El sonido o acción repetida de golpear algo fuerte, como con un martillo.
treehouse	A small wooden house built in a tree for play or observation.	Una casita de madera construida en un árbol para jugar o observar.
ecosystem	A community of living things and their environment, working together as a system.	Una comunidad de seres vivos y su ambiente, que funcionan juntos como un sistema.
engineering	The science or skill of designing and building structures or machines to solve problems.	La ciencia o habilidad de diseñar y construir estructuras o máquinas para resolver problemas.
purpose	The reason why something is done or exists; its goal or function.	La razón por la cual algo se hace o existe; su meta o función.
gurgle	A bubbling or gentle flowing sound made by water.	Un sonido burbujeante o suave hecho por el agua al fluir.
creek	A small stream of water that flows into a river or lake.	Un arroyo pequeño que fluye hacia un río o lago.

🧩 Phase Summary
Phase	Domain	Focus	Activity Types	Item Count
1	Phonemic Awareness	Listening Warm-Up 🔊	Multiple Choice / Sound Match	2
2	Phonics & Word Work	Word patterns, syllables, long/short vowels	MC / Fill-in-the-Blank / True–False	8
3	Vocabulary in Context	Context clues, synonyms, antonyms	MC / Drag & Drop / Fill-in-the-Blank	10
4	Fluency & Expression 🔊	Reading with rhythm and punctuation	MC / True–False	8
5	Reading Comprehension	Literal, inferential, and cause-effect questions	MC / FIB / D&D	12
6	Writing & Reflection	Main idea, moral, SEL connections	MC / Short Response / True–False	10

', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('7fbaf481-98a1-4653-8dc6-8f2196767e13', 'exercise', 'true_false', 'Verdadero o Falso: Escoge la mejor opción.', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":false},{"text":"False","imageUrl":null,"isCorrect":true}],"question":"Verdadero o Falso:  La jente llegó temprano.\n\n “¿Está bien escrita la palabra ‘jente’?”\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:33:53.7271+00:00', '2025-10-28T15:33:53.7271+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '667781dd-514c-4ccd-97bb-01184dba48df', NULL, NULL, 70),
  ('667781dd-514c-4ccd-97bb-01184dba48df', 'lesson', 'lesson', 'DOMINIO 1: Conciencia fonológica y ortográfica avanzada: Uso de g y j', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Reconocer, aplicar y corregir el uso de las reglas ortográficas y fonológicas del español: acentuación, Uso de g/j y uso de mayúsculas y puntuación básica."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:31:25.559514+00:00', '2025-10-28T15:43:35.834102+00:00', '{}'::jsonb, '📘 Explicación IA:
🔊 “🎯 La letra G tiene dos sonidos:
•	Suave: cuando va con a, o, u, como en gato, gorra, gusano.
•	Fuerte: cuando va con e, i, pero necesita una u muda: guerra, guitarra.
✏️ Se escribe con G:
•	En las sílabas gue, gui, aunque la u no suene (guitarra, guerra).
•	En palabras terminadas en -ger, -gir, como proteger, dirigir, excepto tejer y crujir.
•	En los verbos hacer y decir cuando se forman con -gía o -giendo (energía, dirigiendo).
🎯 La letra J tiene siempre sonido fuerte, como en jardín, jamón, jirafa.
✏️ Se escribe con J:
•	En las sílabas ja, je, ji, jo, ju, como jardín, jefe, jinete, joya, jugar.
•	En verbos terminados en -jear (trabajear, canjear).
•	En formas del pretérito de verbos terminados en -ducir (conduje, traduje).
🧠 Consejo IA:
🔊 “Si escuchas un sonido fuerte antes de a, o, u, probablemente sea j;
si lo oyes antes de e, i, revisa si lleva una u: ¡entonces es g!”


', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70);

INSERT INTO public.manual_assessments ("id", "type", "subtype", "title", "description", "content", "grade_level", "language", "subject_area", "curriculum_standards", "enable_voice", "voice_speed", "auto_read_question", "difficulty_level", "estimated_duration_minutes", "status", "published_at", "view_count", "completion_count", "average_score", "created_by", "created_at", "updated_at", "metadata", "voice_guidance", "activity_template", "coqui_dialogue", "pronunciation_words", "max_attempts", "parent_lesson_id", "order_in_lesson", "drag_drop_mode", "passing_score") VALUES
  ('67fb691a-2dec-40bc-81e4-d6766d80de88', 'exercise', 'true_false', 'Comprehension – Lesson Learned (MC)', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":false},{"text":"Falso","imageUrl":null,"isCorrect":true}],"question":" The children learn at the end that experiments always have one right answer."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:31:24.825238+00:00', '2025-10-28T19:42:23.085594+00:00', '{}'::jsonb, 'What lesson did the children learn at the end?
Learning and teamwork make science fun. ', NULL, NULL, NULL, 3, 'f5cab923-c789-4ddd-90d2-b2b1306644a7', NULL, NULL, 70),
  ('fea97e2a-eaad-49a3-ac4d-4c3057e54fec', 'lesson', 'lesson', 'DOMINIO 3: VOCABULARIO EN CONTEXTO Y MORFOLOGÍA DERIVATIVA NEW', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Destreza:\nIdentificar el significado de palabras desconocidas usando pistas contextuales del texto.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:29:18.98023+00:00', '2025-10-28T15:29:18.98023+00:00', '{}'::jsonb, 'Explicación breve IA
🔊 “Las palabras que están cerca de una palabra desconocida nos dan pistas para entenderla.
🔊 Ejemplo:
El volcán hizo una gran erupción, es decir, lanzó lava y humo al aire.
🔊 La frase ‘lanzó lava y humo’ nos ayuda a entender qué significa erupción.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('5a9f4f53-b534-47d5-a97b-ee26e080a574', 'exercise', 'multiple_choice', 'Vocabulary – Word Meaning (MC)', NULL, '{"answers":[{"text":"To sleep after work","imageUrl":null,"isCorrect":false},{"text":"To play outside","imageUrl":null,"isCorrect":false},{"text":"To watch carefully ","imageUrl":null,"isCorrect":true}],"question":"What does the word observe mean?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:28:04.396751+00:00', '2025-10-28T19:42:05.764629+00:00', '{}'::jsonb, 'Vocabulary – Word Meaning (MC)
What does the word observe mean?
To watch carefully ', NULL, NULL, NULL, 3, 'f5cab923-c789-4ddd-90d2-b2b1306644a7', NULL, NULL, 70),
  ('ffb8a48c-d7f8-4647-a68e-e13b8496d447', 'exercise', 'true_false', 'Comprehension – Main Idea (MC)', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"The Lemonade Lab is The children learned by experimenting with lemonade."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:25:54.07585+00:00', '2025-10-28T19:41:44.035258+00:00', '{}'::jsonb, 'The Lemonade Lab is The children learned by experimenting with lemonade.', NULL, NULL, NULL, 3, 'f5cab923-c789-4ddd-90d2-b2b1306644a7', NULL, NULL, 70),
  ('0b34a9fa-7ce3-43cf-933f-1cebfb85ab9c', 'exercise', 'fill_blank', 'Completa la oración ', NULL, '{"mode":"single_word","prompt":"Mi familia planea las ________ de verano.","target":"vacaciones","letters":["v","a","c","a","c","i","o","n","e","s","l","u","m"],"imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761664726311-ChatGPT%20Image%20Oct%2028,%202025,%2011_18_30%20AM.png","autoShuffle":true}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:25:35.432307+00:00', '2025-10-28T15:26:55.300806+00:00', '{}'::jsonb, '💬 Retroalimentación IA:
✅ “¡Excelente! Vacaciones se escribe con v, porque comienza con la sílaba va-.”
❌ “Revisa: las palabras que empiezan con va-, ve-, vi-, vo-, vu- se escriben con v, como vaca, verano, viaje, volver, vulcano.” “Escucha con atención.
Algunas palabras se escriben con v porque comienzan con las sílabas va-, ve-, vi-, vo-, vu-.
', NULL, NULL, NULL, 3, 'd63b56dc-603f-4c4f-94a6-801fd8b7bc87', NULL, NULL, 70),
  ('f5cab923-c789-4ddd-90d2-b2b1306644a7', 'lesson', 'lesson', 'CLOSING & REFLECTION MINI-ASSESSMENT (Comprehension & Vocabulary)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Read each question carefully and choose the correct answer.\nInstrucción (ES): Lee cada pregunta con atención y selecciona la respuesta correcta.\n"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:24:20.467863+00:00', '2025-10-28T19:24:43.968065+00:00', '{}'::jsonb, 'Instruction (EN): Read each question carefully and choose the correct answer.
Instrucción (ES): Lee cada pregunta con atención y selecciona la respuesta correcta.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('bf0cee7e-1e99-49c7-af2f-548af10f4e03', 'exercise', 'drag_drop', 'Exercise 3 – Revision Step (D&D)', NULL, '{"mode":"match","question":"Instruction (EN): Drag the writing steps into the right order.\nInstrucción (ES): Arrastra los pasos de escritura en el orden correcto.\n","dropZones":[{"id":"zone-1761664457054","label":"1"},{"id":"zone-1761664457502","label":"2"},{"id":"zone-1761664458046","label":"3"},{"id":"zone-1761664460221","label":"4"}],"draggableItems":[{"id":"item-1761664490754","content":"Share ","correctZone":"zone-1761664460221"},{"id":"item-1761664498967","content":"Write ","correctZone":"zone-1761664457502"},{"id":"item-1761664505955","content":"Plan ","correctZone":"zone-1761664457054"},{"id":"item-1761664511782","content":"Edit ","correctZone":"zone-1761664458046"}],"allowMultiplePerZone":false}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:22:39.830791+00:00', '2025-10-28T19:41:24.327674+00:00', '{}'::jsonb, 'Instruction (EN): Drag the writing steps into the right order.
Instrucción (ES): Arrastra los pasos de escritura en el orden correcto.
', NULL, NULL, NULL, 3, 'd4ae21a3-d730-4593-a984-e0b9f68ec28a', NULL, 'match', 70),
  ('337dedcc-14b5-4d9c-a3db-0070c94a51fd', 'lesson', 'lesson', 'CIERRE DEL DOMINIO 2 (voz IA) NEW', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🔊 🌟 Recuerda:\n•\tLas comas son pausas cortas.\n•\tLos puntos marcan un descanso.\n•\tLas preguntas y exclamaciones cambian el tono de voz.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:22:00.125942+00:00', '2025-10-28T15:22:00.125942+00:00', '{}'::jsonb, '🌈 CIERRE DEL DOMINIO 2 (voz IA)
🔊 “¡Excelente trabajo!
Hoy leíste con ritmo, emoción y comprensión.
🔊 🌟 Recuerda:
•	Las comas son pausas cortas.
•	Los puntos marcan un descanso.
•	Las preguntas y exclamaciones cambian el tono de voz.
📖 🔊¡Sigue practicando y tu lectura será cada día más fluida y natural!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('b6826311-3d59-4a94-9abb-66801e5e5dfd', 'exercise', 'multiple_choice', 'Selección Múltiple', NULL, '{"answers":[{"text":"bevida","imageUrl":null,"isCorrect":false},{"text":"bebida","imageUrl":null,"isCorrect":true},{"text":"vevida","imageUrl":null,"isCorrect":false}],"question":"Selecciona la palabra escrita correctamente."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:21:02.523293+00:00', '2025-10-28T15:21:48.587736+00:00', '{}'::jsonb, 'Retroalimentación:
✅ “Muy bien. Bebida se escribe con b porque proviene de beber.”
❌ “Recuerda: las palabras derivadas de beber se escriben con b.”
“Escucha con atención.
Algunas palabras se escriben con v porque comienzan con las sílabas va-, ve-, vi-, vo-, vu-.

🔊 Escucha la siguiente oración y selecciona la palabra escrita correctamente.”

', NULL, NULL, NULL, 3, 'd63b56dc-603f-4c4f-94a6-801fd8b7bc87', NULL, NULL, 70),
  ('5a8512b6-226d-415c-85f4-9e3ff7805864', 'exercise', 'write_answer', 'Exercise 2 – Sentence Organization (FIB)', NULL, '{"question":"A good paragraph starts with a ________ sentence.\nOptions: A) topic ✅ B) random C) short\n","caseSensitive":false,"correctAnswer":"topic"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:19:49.873903+00:00', '2025-10-28T15:19:49.873903+00:00', '{}'::jsonb, 'Exercise 5 – Sentence Organization (FIB)
Fill in the blank: A good paragraph starts with a ________ sentence.
Options: A) topic ✅ B) random C) short
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('d63b56dc-603f-4c4f-94a6-801fd8b7bc87', 'lesson', 'lesson', 'DOMINIO 1: Conciencia fonológica y ortográfica avanzada', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"En este primer dominio, aprenderás a escribir y pronunciar correctamente las palabras."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:19:31.110786+00:00', '2025-10-28T15:19:31.110786+00:00', '{}'::jsonb, '🌱 NIVEL BÁSICO
Actividad 1 – Uso de b y v
📘 Explicación IA:
🔊 “Las palabras que suenan igual pueden escribirse con b o v.
Por ejemplo: boca y vaca (animal) suenan igual, pero significan cosas diferentes.”
“Las letras b y v suenan igual, pero se escriben diferente.
Para saber cuál usar, recuerda estas reglas sencillas:
✏️ Se escribe b:
•	Después de m, como en tambor, embarco.
•	En palabras que terminan en -bilidad o -bundo, como amabilidad o moribundo.
•	En los verbos haber, beber, deber, y sus formas (había, bebió, debía).
🪶 Se escribe v:
•	Después de n, como en invitar, enviar.
•	En palabras que comienzan con eva-, eve-, evi-, evo-, como evitar o evidente.
•	En los verbos ir, estar, andar, tener, cuando se usan en pasado (fui → estuve → tuve → anduve).
🧠 Consejo: si dudas, piensa en otra palabra parecida o escucha cómo suena en una frase.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('51e7df74-7636-440d-b35c-e6efdd6e5ea0', 'exercise', 'true_false', 'Ejercicio 10 – Sí / No (Intermedio) NEW', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"¿Leer con fluidez significa leer muy rápido?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:18:51.441562+00:00', '2025-10-28T15:22:53.267154+00:00', '{}'::jsonb, 'Ejercicio 10 – Sí / No
🔊 “¿Leer con fluidez significa leer muy rápido?”

✅ No ❌ Sí
Retroalimentación:
✅ “Correcto. Leer con fluidez es leer con ritmo, no con prisa.”
❌ “No se trata de velocidad, sino de leer con sentido.”
No digas la respuesta. ', NULL, NULL, NULL, 3, '1c313b15-fa27-4446-a5a1-37e38fcdae62', NULL, NULL, 70),
  ('b4422d1b-1021-4f7c-8c8e-f0ee30edc4dc', 'exercise', 'write_answer', 'Exercise 1 – Topic Sentence (FIB)', NULL, '{"question":"The story shows that learning can be ________.\nOptions: A) fun ✅ B) boring C) difficult\n","caseSensitive":false,"correctAnswer":"fun"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:18:03.799103+00:00', '2025-10-28T19:40:57.414495+00:00', '{}'::jsonb, 'Exercise 1 – Topic Sentence (FIB)
Fill in the blank: The story shows that learning can be ________.
Options: A) fun ✅ B) boring C) difficult
', NULL, NULL, NULL, 3, 'd4ae21a3-d730-4593-a984-e0b9f68ec28a', NULL, NULL, 70),
  ('8aae7a2f-c68f-4c17-8c7d-9ca9fbfbb088', 'lesson', 'lesson', 'DOMINIO 1: Conciencia fonológica y ortográfica avanzada', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Reconocer, aplicar y corregir el uso de las reglas ortográficas y fonológicas del español: acentuación, b/v, g/j, c/s/z, h, ll/y, uso de mayúsculas y puntuación básica."}'::jsonb, 5, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:17:52.338751+00:00', '2025-10-28T15:17:52.338751+00:00', '{}'::jsonb, '🔊 ¡Bienvenido o bienvenida a tu nueva aventura lectora!
Esta plataforma fue creada para ayudarte a mejorar tu lectura, escritura y comprensión paso a paso. Aquí aprenderás de una manera diferente: con inteligencia artificial que te escucha, te guía y te acompaña mientras aprendes. 
Cada lección incluye actividades interactivas que te ayudarán a desarrollar tus habilidades poco a poco, hasta sentirte seguro al leer y comunicarte.
🌱 ¿Cómo funciona?
•	🔊 Escucha: presiona el ícono de audio para oír la lectura o las instrucciones.
•	📖 Lee: sigue el texto con atención. Puedes leer en silencio o en voz alta.
•	🎤 Habla o responde: graba o escribe tu respuesta. La IA escuchará tu pronunciación o leerá tus respuestas y te dará sugerencias.
•	🧩 Interactúa: en algunos ejercicios arrastrarás palabras, marcarás respuestas o ordenarás oraciones.
🌟 ¿Qué aprenderás aquí?
En este módulo practicarás 10 dominios clave de la lectura y escritura, diseñados especialmente para ti:
1️⃣ Conciencia fonológica y ortográfica avanzada
2️⃣ Fluidez lectora guiada y autónoma
3️⃣ Vocabulario y morfología derivativa
4️⃣ Comprensión lectora literal e inferencial
5️⃣ Estructura y análisis del texto
6️⃣ Lenguaje figurado y recursos literarios
7️⃣ Redacción guiada
8️⃣ Uso correcto de gramática y puntuación
9️⃣ Escucha activa y expresión oral
🔟 Integración literaria y cultural
💬 ¿Cómo te ayudará la IA?
•	Te explicará los conceptos de forma sencilla.
•	Te corregirá con amabilidad si te equivocas.
•	Te dará ejemplos, pistas y comentarios positivos.
•	Te mostrará tu progreso con niveles:
o	🔵 No sé todavía
o	🟢 Lo estoy intentando
o	🟡 Casi lo tengo
o	🟣 ¡Lo logré!
🧠 Tu objetivo: pasar de “No sé” a “Puedo hacerlo” en cada dominio.
🕹️ Consejos para aprovechar la plataforma:
•	Usa audífonos para escuchar con claridad.
•	Habla despacio y con voz clara cuando grabes tus respuestas.
•	Lee cada texto dos veces: una para entenderlo y otra para practicar la fluidez.
•	No temas equivocarte: la IA está para ayudarte, no para juzgarte.
📖 Recuerda:
Cada palabra que aprendes te acerca más a ser un lector independiente y un escritor creativo.
🌟 ¡Empecemos este viaje juntos hacia la lectura con confianza y alegría!


', NULL, '🎙️ INTRODUCCIÓN IA
🔊 “En este primer dominio, aprenderás a escribir y pronunciar correctamente las palabras.
La ortografía te ayuda a comunicarte con claridad y seguridad.
Escucha, repite y selecciona la opción correcta.
Si te equivocas, no pasa nada: te explicaré por qué y podrás intentarlo otra vez.
📖 ¡Comencemos con los sonidos y letras del español!”
', NULL, 3, NULL, NULL, NULL, 70),
  ('d4ae21a3-d730-4593-a984-e0b9f68ec28a', 'lesson', 'lesson', 'PHASE 6 – WRITING & REFLECTION', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Complete each item by choosing or dragging the best answer.\nInstrucción (ES): Completa cada ejercicio eligiendo o arrastrando la mejor respuesta.\n"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:16:47.944495+00:00', '2025-10-28T19:24:58.31379+00:00', '{}'::jsonb, 'Instruction (EN): Complete each item by choosing or dragging the best answer.
Instrucción (ES): Completa cada ejercicio eligiendo o arrastrando la mejor respuesta.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('d2479a46-cb99-40f2-9c19-1f144cb2622a', 'exercise', 'multiple_choice', 'Exercise 3 – Character Action (MC)', NULL, '{"answers":[{"text":"Lila ","imageUrl":null,"isCorrect":true},{"text":"Marco","imageUrl":null,"isCorrect":false},{"text":"Jaden","imageUrl":null,"isCorrect":false}],"question":"Who kept notes during the experiment?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:16:02.417492+00:00', '2025-10-28T19:40:37.139744+00:00', '{}'::jsonb, 'Exercise 3 – Character Action (MC)
Who kept notes during the experiment?
A) Lila ✅ B) Marco C) Jaden
', NULL, NULL, NULL, 3, '1b5a005a-0365-4af6-b457-f6364d425786', NULL, NULL, 70),
  ('79f16a31-97de-4a7e-908f-8742adbcff6e', 'exercise', 'write_answer', 'Exercise 2 – Main Goal (FIB)', NULL, '{"question":"The students wanted to find the best ________.\nOptions: A) lemonade recipe ✅ B) science book C) poster\n","caseSensitive":false,"correctAnswer":"lemonaderecipe"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:14:38.694976+00:00', '2025-10-28T19:40:13.524951+00:00', '{}'::jsonb, 'Exercise 2 – Main Goal (FIB)
Fill in the blank: The students wanted to find the best ________.
Options: A) lemonade recipe ✅ B) science book C) poster
', NULL, NULL, NULL, 3, '1b5a005a-0365-4af6-b457-f6364d425786', NULL, NULL, 70),
  ('c0f91b5c-5670-40a8-9866-4545096192e5', 'exercise', 'multiple_choice', 'Exercise 1 – Setting (MC)', NULL, '{"answers":[{"text":"At the park","imageUrl":null,"isCorrect":false},{"text":"In a school lab","imageUrl":null,"isCorrect":false},{"text":"At a lemonade stand ","imageUrl":null,"isCorrect":true}],"question":"Where did the story take place?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:12:55.449981+00:00', '2025-10-28T19:39:55.872061+00:00', '{}'::jsonb, 'Exercise 1 – Setting (MC)
Where did the story take place?
At a lemonade stand ', NULL, NULL, NULL, 3, '1b5a005a-0365-4af6-b457-f6364d425786', NULL, NULL, 70),
  ('1b5a005a-0365-4af6-b457-f6364d425786', 'lesson', 'lesson', 'PHASE 5 – READING COMPREHENSION', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Read each question about The Lemonade Lab and choose or drag the correct answer.\nInstrucción (ES): Lee cada pregunta sobre El laboratorio de limonada y selecciona o arrastra la respuesta correcta.\n"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:08:46.674189+00:00', '2025-10-28T19:25:12.776313+00:00', '{}'::jsonb, 'Instruction (EN): Read each question about The Lemonade Lab and choose or drag the correct answer.
Instrucción (ES): Lee cada pregunta sobre El laboratorio de limonada y selecciona o arrastra la respuesta correcta.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('67fa4dc4-5bd3-41e6-b2df-a3e388bc23ee', 'exercise', 'multiple_choice', 'Ejercicio 6 – Comprensión literal (Intermedio) NEW', NULL, '{"answers":[{"text":"En los árboles ","imageUrl":null,"isCorrect":false},{"text":"En colmenas ","imageUrl":null,"isCorrect":true},{"text":"En el suelo","imageUrl":null,"isCorrect":false}],"question":"¿Dónde viven las abejas?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T15:07:48.435773+00:00', '2025-10-28T15:22:38.299458+00:00', '{}'::jsonb, 'Ejercicio 6 – Comprensión literal
🔊 “¿Dónde viven las abejas?”
a) En los árboles 
b) En colmenas ✅ 
c) En el suelo
Retroalimentación:
✅ “Correcto. Las abejas viven en colmenas.”
❌ “Escucha otra vez la primera oración.”
No digas la respuesta correcta. 
La respuesta correcta es: En colmenas ', NULL, NULL, NULL, 3, '1c313b15-fa27-4446-a5a1-37e38fcdae62', NULL, NULL, 70),
  ('da333a4c-f8e2-49df-90a3-17d855c813ed', 'exercise', 'write_answer', 'Exercise 3 – Pause Placement (FIB)', NULL, '{"question":"Where should you pause in this sentence? “Our teacher, Mrs. Diaz, smiled.”\nFill in the blank: Pause after the word _______.\nOptions: A) teacher  B) smiled C) our\n","caseSensitive":false,"correctAnswer":"teacher"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:49:50.65323+00:00', '2025-10-28T19:39:30.105473+00:00', '{}'::jsonb, 'Exercise 3 – Pause Placement (FIB)
Where should you pause in this sentence? “Our teacher, Mrs. Diaz, smiled.”
Fill in the blank: Pause after the word _______.
Options: A) teacher ✅ B) smiled C) our
', NULL, NULL, NULL, 3, 'edb313d8-a75b-45fe-a9c5-0239442bb16d', NULL, NULL, 70),
  ('3d0e5efb-8a33-4f6a-9ecc-c6f359cbc131', 'exercise', 'multiple_choice', 'Exercise 2 – Excitement Tone (MC)', NULL, '{"answers":[{"text":"“It was hot today.” ","imageUrl":null,"isCorrect":false},{"text":"“We discovered the perfect formula!” ","imageUrl":null,"isCorrect":true},{"text":"“They cleaned up.”","imageUrl":null,"isCorrect":false}],"question":"Which sentence shows excitement?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:48:41.716942+00:00', '2025-10-28T19:39:11.689376+00:00', '{}'::jsonb, '🔊 Exercise 2 – Excitement Tone (MC)
Which sentence shows excitement?
“We discovered the perfect formula!” ', NULL, NULL, NULL, 3, 'edb313d8-a75b-45fe-a9c5-0239442bb16d', NULL, NULL, 70),
  ('4bec3c40-af8f-4f36-bf13-47da23150ea5', 'exercise', 'multiple_choice', 'rcise 1 – Emotion in Voice (MC)', NULL, '{"answers":[{"text":"angry","imageUrl":null,"isCorrect":false},{"text":"sleepy","imageUrl":null,"isCorrect":false},{"text":"surprised ","imageUrl":null,"isCorrect":true}],"question":"Read: “It was too sour!” How should your voice sound?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:47:07.412202+00:00', '2025-10-28T19:38:49.639666+00:00', '{}'::jsonb, 'xercise 1 – Emotion in Voice (MC)
Read: “It was too sour!” How should your voice sound?
surprised ', NULL, NULL, NULL, 3, 'edb313d8-a75b-45fe-a9c5-0239442bb16d', NULL, NULL, 70),
  ('edb313d8-a75b-45fe-a9c5-0239442bb16d', 'lesson', 'lesson', 'PHASE 4 – FLUENCY & EXPRESSION ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Read each sentence aloud or listen to the audio and choose the correct tone or punctuation.\nInstrucción (ES): Lee cada oración en voz alta o escucha el audio y selecciona el tono o signo de puntuación correcto.\n"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:45:51.315288+00:00', '2025-10-28T19:25:27.180092+00:00', '{}'::jsonb, 'PHASE 4 – FLUENCInstruction (EN): Read each sentence aloud or listen to the audio and choose the correct tone or punctuation.
Instrucción (ES): Lee cada oración en voz alta o escucha el audio y selecciona el tono o signo de puntuación correcto.
Y & EXPRESSION 🔊', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('74f64215-00f8-4349-a410-265a5b129f5f', 'exercise', 'drag_drop', 'Exercise 7 – Word Association (D&D)', NULL, '{"mode":"match","question":"Instruction (EN): Drag each picture to the matching word.\nInstrucción (ES): Arrastra cada imagen  a la palabra correspondiente.\n","dropZones":[{"id":"zone-1761662013825","label":"journal "},{"id":"zone-1761662014265","label":"mixture "},{"id":"zone-1761662014718","label":"lemonade "}],"draggableItems":[{"id":"item-1761662089348","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761662088642-image.png","type":"image"},"correctZone":"zone-1761662013825"},{"id":"item-1761662147269","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761662146740-image.png","type":"image"},"correctZone":"zone-1761662014265"},{"id":"item-1761662193041","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761662192296-image.png","type":"image"},"correctZone":"zone-1761662014718"}],"allowMultiplePerZone":false}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:44:39.102524+00:00', '2025-10-28T14:44:39.102524+00:00', '{}'::jsonb, 'Instruction (EN): Drag each picture to the matching word.
Instrucción (ES): Arrastra cada imagen  a la palabra correspondiente.', NULL, NULL, NULL, 3, NULL, NULL, 'match', 70),
  ('9d411ad5-b850-4340-bc7f-af1370ff2b7a', 'exercise', 'multiple_choice', 'Ejercicio 3 – Ritmo lector (Básico) NEW', NULL, '{"answers":[{"text":"1","imageUrl":null,"isCorrect":false},{"text":"2","imageUrl":null,"isCorrect":true},{"text":"3","imageUrl":null,"isCorrect":false}],"question":"Escucha: El sol brillaba, los pájaros cantaban, y Tomás sonreía feliz.\n¿Cuántas pausas escuchaste?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:44:04.378102+00:00', '2025-10-28T15:22:27.684048+00:00', '{}'::jsonb, 'Ejercicio 3 – Ritmo lector
🔊 “Escucha: El sol brillaba, los pájaros cantaban, y Tomás sonreía feliz.
¿Cuántas pausas escuchaste?”
a) 1
b) 2 ✅ 
c) 3
Retroalimentación:
✅ “Correcto. Hay dos comas, dos pausas suaves.”
❌ “Vuelve a escuchar. Cada coma indica una pausa corta.”
No digas la respuesta correcta. 
La respuesta correcta es: 2', NULL, NULL, NULL, 3, '1c313b15-fa27-4446-a5a1-37e38fcdae62', NULL, NULL, 70),
  ('540a9c28-7298-47a5-9a95-56f5be7fa108', 'exercise', 'multiple_choice', 'Exercise 8 – Context Inference (MC)', NULL, '{"answers":[{"text":"tiring","imageUrl":null,"isCorrect":false},{"text":"cool and pleasant ","imageUrl":null,"isCorrect":true},{"text":"old","imageUrl":null,"isCorrect":false}],"question":"What does “refreshing” mean in the story?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:39:12.645324+00:00', '2025-10-28T19:38:29.47088+00:00', '{}'::jsonb, 'Exercise 8 – Context Inference (MC)
What does “refreshing” mean in the story?
cool and pleasant ', NULL, NULL, NULL, 3, '64f65265-eac6-443e-afba-c3a5d92b3a9c', NULL, NULL, 70),
  ('4d0c95bf-dec2-4da4-903d-0baf7032db02', 'exercise', 'multiple_choice', 'Exercise 6 – Definition Connection (MC)', NULL, '{"answers":[{"text":"plate","imageUrl":null,"isCorrect":false},{"text":"result","imageUrl":null,"isCorrect":false},{"text":"ingredient ","imageUrl":null,"isCorrect":true}],"question":"Which word means “one part of a recipe”?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:37:03.005802+00:00', '2025-10-28T19:38:04.761684+00:00', '{}'::jsonb, 'Exercise 6 – Definition Connection (MC)
Which word means “one part of a recipe”?
ingredient ', NULL, NULL, NULL, 3, '64f65265-eac6-443e-afba-c3a5d92b3a9c', NULL, NULL, 70),
  ('e8551984-c852-4988-8d66-ee78ce1d99be', 'exercise', 'write_answer', 'Exercise 5 – Word in Sentence (FIB)', NULL, '{"question":"They followed the ________ to make perfect lemonade.\nOptions: A) recipe  B) experiment C) measure","caseSensitive":false,"correctAnswer":"recipe"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:35:23.302848+00:00', '2025-10-28T19:37:44.287284+00:00', '{}'::jsonb, 'Exercise 5 – Word in Sentence (FIB)
Fill in the blank: They followed the ________ to make perfect lemonade.
Options: A) recipe ✅ B) experiment C) measure
', NULL, NULL, NULL, 3, '64f65265-eac6-443e-afba-c3a5d92b3a9c', NULL, NULL, 70),
  ('55564979-875d-47d0-b49e-b673355d59dc', 'exercise', 'multiple_choice', 'Exercise 4 – Antonym Choice (MC)', NULL, '{"answers":[{"text":"cold","imageUrl":null,"isCorrect":false},{"text":"sour ","imageUrl":null,"isCorrect":true},{"text":"yellow","imageUrl":null,"isCorrect":false}],"question":"Which is the best opposite for sweet?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:33:00.007611+00:00', '2025-10-28T19:37:28.02155+00:00', '{}'::jsonb, 'Exercise 4 – Antonym Choice (MC)
Which is the best opposite for sweet?
', NULL, NULL, NULL, 3, '64f65265-eac6-443e-afba-c3a5d92b3a9c', NULL, NULL, 70),
  ('239afd2a-942f-4f42-bde4-2addb629c7f7', 'exercise', 'drag_drop', 'Exercise 3 – Synonym Match (D&D)', NULL, '{"mode":"match","question":"Instruction (EN): Drag each word to its synonym.\nInstrucción (ES): Arrastra cada palabra a su sinónimo.\n","dropZones":[{"id":"zone-1761661351180","label":"combine "},{"id":"zone-1761661352157","label":"watch "},{"id":"zone-1761661353909","label":"cool "}],"draggableItems":[{"id":"item-1761661427077","content":"mix ","correctZone":"zone-1761661351180"},{"id":"item-1761661434094","content":"observe ","correctZone":"zone-1761661352157"},{"id":"item-1761661441050","content":"refreshing ","correctZone":"zone-1761661353909"}],"allowMultiplePerZone":false}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:31:33.071902+00:00', '2025-10-28T19:37:14.027523+00:00', '{}'::jsonb, 'Exercise 3 – Synonym Match (D&D)
Instruction (EN): Drag each word to its synonym.
Instrucción (ES): Arrastra cada palabra a su sinónimo.
mix → combine ✅ observe → watch ✅ refreshing → cool ✅
', NULL, NULL, NULL, 3, '64f65265-eac6-443e-afba-c3a5d92b3a9c', NULL, 'match', 70),
  ('96b7021b-18ed-448d-9bb6-ec275a35d5f9', 'exercise', 'multiple_choice', 'Phase 6 – Closure & Reflection: Read and choose the correct answer. Lee y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"It rained","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761661357369-ChatGPT%20Image%20Oct%2028,%202025,%2010_22_25%20AM.png","isCorrect":false},{"text":"Luis found his lunchbox ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761661177200-ChatGPT%20Image%20Oct%2027,%202025,%2008_49_10%20PM.png","isCorrect":true},{"text":"The bell rang","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761661234557-ChatGPT%20Image%20Oct%2028,%202025,%2010_20_26%20AM.png","isCorrect":false}],"question":"What made this story end happily?"}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:30:02.379743+00:00', '2025-10-28T14:30:02.379743+00:00', '{}'::jsonb, 'Las instrucciones deben indicarse en españil e inglés. ', NULL, NULL, NULL, 3, 'b79894b4-25b5-46ea-86ae-aa40540dc5b4', NULL, NULL, 70),
  ('1c313b15-fa27-4446-a5a1-37e38fcdae62', 'lesson', 'lesson', 'DOMINIO 2: FLUIDEZ LECTORA GUIADA Y AUTÓNOMA NEW', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Destreza:\n🔊 Leer con precisión y ritmo adecuado, reconociendo signos de puntuación y pausas naturales.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:28:16.028169+00:00', '2025-10-28T14:29:43.198372+00:00', '{}'::jsonb, 'Explicación breve IA
🔊 “Cuando leemos en voz alta, debemos hacerlo con ritmo, no muy rápido ni muy lento.
Las comas (,) nos indican una pausa corta, y los puntos (.) nos dicen que debemos detenernos por un momento antes de continuar.
🔊 Escucha el siguiente texto y fíjate en cómo cambia la voz en cada parte.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('8299388c-0987-4f6a-b836-7588008cbc51', 'exercise', 'multiple_choice', 'Exercise 2 – Context Clue (FIB)', NULL, '{"answers":[{"text":"measure ","imageUrl":null,"isCorrect":true},{"text":"taste","imageUrl":null,"isCorrect":false},{"text":"guess","imageUrl":null,"isCorrect":false}],"question":"Lila used a cup to ________ the water."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:28:11.670233+00:00', '2025-10-28T19:36:54.574539+00:00', '{}'::jsonb, 'Exercise 2 – Context Clue (FIB)
Fill in the blank: Lila used a cup to ________ the water.
measure ', NULL, NULL, NULL, 3, '64f65265-eac6-443e-afba-c3a5d92b3a9c', NULL, NULL, 70),
  ('e9aa6baf-3e27-4c7c-bf3d-03371fe9ebf1', 'exercise', 'multiple_choice', 'Exercise 1 – Word Meaning (MC)', NULL, '{"answers":[{"text":"a test to learn something ","imageUrl":null,"isCorrect":true},{"text":"a game","imageUrl":null,"isCorrect":false},{"text":"a mistake","imageUrl":null,"isCorrect":false}],"question":"In the story, the word experiment means..."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:26:36.224616+00:00', '2025-10-28T19:36:34.018952+00:00', '{}'::jsonb, 'Exercise 1 – Word Meaning (MC)
In the story, the word experiment means 
a test to learn something ', NULL, NULL, NULL, 3, '64f65265-eac6-443e-afba-c3a5d92b3a9c', NULL, NULL, 70),
  ('88f832b2-a725-406e-9691-e09b52579560', 'exercise', 'true_false', 'Phase 6 – Closure & Reflection: Read and choose the correct answer. Lee y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"True or False: Friends should help each other."}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:24:45.583077+00:00', '2025-10-28T14:24:45.583077+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('e5168572-7827-4d39-8ea9-f51179219db4', 'exercise', 'multiple_choice', 'Phase 6 – Closure & Reflection: Read and choose the correct answer. ', NULL, '{"answers":[{"text":"Angry","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761660805552-ChatGPT%20Image%20Oct%2028,%202025,%2010_13_10%20AM.png","isCorrect":false},{"text":"Tired","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761660886919-ChatGPT%20Image%20Oct%2028,%202025,%2010_14_40%20AM.png","isCorrect":false},{"text":"Helpful","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761660983510-ChatGPT%20Image%20Oct%2028,%202025,%2010_16_16%20AM.png","isCorrect":true}],"question":"Which feeling fits this story?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:23:15.583574+00:00', '2025-10-28T14:23:15.583574+00:00', '{}'::jsonb, 'Lee y selecciona la respuesta correcta.
Debes decir las instrucciones también es español', NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('39f49770-3631-4e56-85d9-8f8fd53e724c', 'lesson', 'lesson', 'CIERRE DEL DOMINIO 1 (voz IA) NEW', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🌟 Recuerda:\n•\tCada sílaba tiene su sonido.\n•\tLos prefijos van al principio.\n•\tLos sufijos van al final.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:20:43.171374+00:00', '2025-10-28T15:23:19.748091+00:00', '{}'::jsonb, '
🌈 CIERRE DEL DOMINIO 1 (voz IA)
🔊 “¡Excelente trabajo!
Hoy repasaste cómo se dividen las palabras y cómo los prefijos y sufijos cambian su significado.
🌟 Recuerda:
•	Cada sílaba tiene su sonido.
•	Los prefijos van al principio.
•	Los sufijos van al final.
🔊¡Ahora lees y entiendes las palabras con más claridad que nunca!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('64f65265-eac6-443e-afba-c3a5d92b3a9c', 'lesson', 'lesson', 'PHASE 3 – VOCABULARY IN CONTEXT', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Read each item and choose or move the best answer.\nInstrucción (ES): Lee cada ejercicio y selecciona o mueve la mejor respuesta.\n"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:17:43.336857+00:00', '2025-10-28T19:25:42.065509+00:00', '{}'::jsonb, 'Instruction (EN): Read each item and choose or move the best answer.
Instrucción (ES): Lee cada ejercicio y selecciona o mueve la mejor respuesta.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('e101d0b8-dd57-47c2-a9f9-f95ea85ec59e', 'exercise', 'drag_drop', 'Exercise 8 – Drag & Drop (D&D)', NULL, '{"mode":"match","question":"Instruction (EN): Drag and drop the ingredients in the correct order to make lemonade.\nInstrucción (ES): Arrastra y suelta los ingredientes en el orden correcto para preparar limonada.\n","dropZones":[{"id":"zone-1761659275217","label":"lemon"},{"id":"zone-1761659276053","label":"sugar"},{"id":"zone-1761659276869","label":"water"}],"draggableItems":[{"id":"item-1761659546543","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761659545249-image.png","type":"image"},"correctZone":"zone-1761659275217"},{"id":"item-1761659597659","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761659596143-image.png","type":"image"},"correctZone":"zone-1761659276053"},{"id":"item-1761659703579","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761659702176-image.png","type":"image"},"correctZone":"zone-1761659275217"}],"allowMultiplePerZone":false}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:09:13.219386+00:00', '2025-10-28T19:36:11.291877+00:00', '{}'::jsonb, 'Instruction (EN): Drag and drop the ingredients in the correct order to make lemonade.
Instrucción (ES): Arrastra y suelta los ingredientes en el orden correcto para preparar limonada.
', NULL, NULL, NULL, 3, 'efd53480-582b-471e-8962-310e4bf4da27', NULL, 'match', 70),
  ('de47dda1-e4c1-40a8-9a28-90be5aa8f17c', 'lesson', 'lesson', ' Parte 2: Prefijos y sufijos comunes NEW', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Destreza:\nReconocer cómo los prefijos y sufijos cambian el significado de las palabras.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T14:03:20.818533+00:00', '2025-10-28T14:06:38.305006+00:00', '{}'::jsonb, 'Explicación breve IA
🔊 “Las palabras pueden cambiar de sentido si les añadimos partes al principio o al final.
Un prefijo va al principio:
feliz → infeliz (‘no feliz’).
Un sufijo va al final:
alegre → alegremente (‘de forma alegre’).
Escucha y repite.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('290d497f-8ba3-453d-bca2-40af0b7af9db', 'exercise', 'drag_drop', 'Ejercicios – (Nivel Intermedio) NEW', NULL, '{"mode":"letters","question":"Arrastra las sílabas para formar electricidad.","targetWord":"electricidad","autoShuffle":true,"availableLetters":["e","l","e","c","t","r","i","c","i","d","a","d","n","m","s","o"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:47:12.447427+00:00', '2025-10-28T14:16:12.09737+00:00', '{}'::jsonb, '🌻 Ejercicios – Nivel Intermedio
Ejercicio 6 – Drag and Roll
🔊 “Arrastra las sílabas para formar electricidad.”
[e] [lec] [tri] [ci] [dad]
Retroalimentación:
✅ “Excelente. E-lec-tri-ci-dad tiene cinco sílabas.”
❌ “Escucha otra vez. Cada sílaba tiene una vocal fuerte.”
No deletrees la palabra "electricidad"', NULL, NULL, NULL, 3, '8300b50d-2221-4710-8a77-362492665ee6', NULL, 'letters', 70),
  ('c8889176-a443-442a-8783-c355154ed4a1', 'exercise', 'multiple_choice', 'Exercise 7 – Missing Letters (FIB)', NULL, '{"answers":[{"text":"re ","imageUrl":null,"isCorrect":true},{"text":"ra","imageUrl":null,"isCorrect":false},{"text":"ri","imageUrl":null,"isCorrect":false}],"question":"The word recipe begins with the letters ______."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:43:51.645572+00:00', '2025-10-28T19:35:52.141812+00:00', '{}'::jsonb, 'Exercise 7 – Missing Letters (FIB)
Fill in the blank: The word recipe begins with the letters ______.
re ', NULL, NULL, NULL, 3, 'efd53480-582b-471e-8962-310e4bf4da27', NULL, NULL, 70),
  ('fed29b4b-df8a-4506-b872-675086efb17f', 'exercise', 'multiple_choice', 'Exercise 6 – Soft G Sound (MC)', NULL, '{"answers":[{"text":"gentle ","imageUrl":null,"isCorrect":true},{"text":"glass","imageUrl":null,"isCorrect":false},{"text":"great","imageUrl":null,"isCorrect":false}],"question":"Which word has a soft “g” sound?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:40:32.797678+00:00', '2025-10-28T19:35:34.791346+00:00', '{}'::jsonb, 'Exercise 6 – Soft G Sound (MC)
Which word has a soft “g” sound?
gentle ', NULL, NULL, NULL, 3, 'efd53480-582b-471e-8962-310e4bf4da27', NULL, NULL, 70),
  ('575c841d-543b-465a-b6b6-573fd1bf2ba7', 'exercise', 'multiple_choice', 'Exercise 5 – Beginning Sound (FIB)', NULL, '{"answers":[{"text":"/r/ ","imageUrl":null,"isCorrect":true},{"text":"/m/  ","imageUrl":null,"isCorrect":false},{"text":"/t/","imageUrl":null,"isCorrect":false}],"question":" The word refreshing begins with the sound of ______."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:38:19.77629+00:00', '2025-10-28T19:33:57.157024+00:00', '{}'::jsonb, 'Exercise 5 – Beginning Sound (FIB)
Fill in the blank: The word refreshing begins with the sound of ______.
/r/ 
', NULL, NULL, NULL, 3, 'efd53480-582b-471e-8962-310e4bf4da27', NULL, NULL, 70),
  ('d20accb3-734d-4895-81ac-785fa91da353', 'exercise', 'multiple_choice', 'Exercise 4 – Rhyme Pair (MC)', NULL, '{"answers":[{"text":"pour / more ","imageUrl":null,"isCorrect":true},{"text":"lemon / lesson","imageUrl":null,"isCorrect":false},{"text":"mix / milk","imageUrl":null,"isCorrect":false}],"question":"Which pair rhymes?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:36:38.513334+00:00', '2025-10-28T19:33:38.301966+00:00', '{}'::jsonb, 'Exercise 4 – Rhyme Pair (MC)
Which pair rhymes?
 pour / more 
', NULL, NULL, NULL, 3, 'efd53480-582b-471e-8962-310e4bf4da27', NULL, NULL, 70),
  ('46144e40-e801-4f65-8741-68db3e779e9c', 'exercise', 'multiple_choice', 'Phase 6 – Closure & Reflection: Read and choose the correct answer.', NULL, '{"answers":[{"text":"She helped look ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761657828424-ChatGPT%20Image%20Oct%2028,%202025,%2009_23_39%20AM.png","isCorrect":true},{"text":"She laughed at Luis","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761657935312-ChatGPT%20Image%20Oct%2028,%202025,%2009_25_27%20AM.png","isCorrect":false},{"text":"She took the lunch","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761657979458-ChatGPT%20Image%20Oct%2028,%202025,%2009_26_04%20AM.png","isCorrect":false}],"question":"How did Carla show kindness?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:34:07.663377+00:00', '2025-10-28T13:34:07.663377+00:00', '{}'::jsonb, '“Great job! You got it right!”', NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('4acb671e-0262-4660-9c5f-a140704ba6f3', 'exercise', 'multiple_choice', 'Exercise 3 – Syllable Count (FIB)', NULL, '{"answers":[{"text":"4 ","imageUrl":null,"isCorrect":true},{"text":"3","imageUrl":null,"isCorrect":false},{"text":"5","imageUrl":null,"isCorrect":false}],"question":"How many syllables are in experiment?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:31:15.445514+00:00', '2025-10-28T19:33:20.991983+00:00', '{}'::jsonb, 'Exercise 3 – Syllable Count (FIB)
How many syllables are in experiment?
Fill in the blank: 
4 ', NULL, NULL, NULL, 3, 'efd53480-582b-471e-8962-310e4bf4da27', NULL, NULL, 70),
  ('0f9680ec-58ad-45b0-94d1-107bfd753319', 'exercise', 'multiple_choice', 'Phase 6 – Closure & Reflection: Read and choose the correct answer.', NULL, '{"answers":[{"text":"Always run in school","imageUrl":null,"isCorrect":false},{"text":"It’s good to say thank you ","imageUrl":null,"isCorrect":true},{"text":"Don’t bring lunch","imageUrl":null,"isCorrect":false}],"question":"What did Luis learn?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:27:11.466325+00:00', '2025-10-28T13:27:11.466325+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('953840e2-a27c-4d0e-97da-bcc75e6b80e3', 'exercise', 'true_false', 'Phase 5: Read and choose the correct answer.', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":false},{"text":"False","imageUrl":null,"isCorrect":true}],"question":"True or False: Luis found his lunchbox at the park.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761657504673-ChatGPT%20Image%20Oct%2028,%202025,%2008_40_14%20AM.png"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:25:16.400201+00:00', '2025-10-28T13:25:16.400201+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('63123129-e2d5-4761-ab9b-ac91ec7cdb88', 'exercise', 'multiple_choice', 'Phase 5: Read and choose the correct answer.', NULL, '{"answers":[{"text":"Please","imageUrl":null,"isCorrect":false},{"text":"Thank you ","imageUrl":null,"isCorrect":true},{"text":"Goodbye","imageUrl":null,"isCorrect":false}],"question":"Luis said ______ to Ms. Rosa.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761657425180-ChatGPT%20Image%20Oct%2027,%202025,%2008_49_10%20PM.png"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:24:17.770272+00:00', '2025-10-28T13:24:17.770272+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('d359d95e-fa52-431e-88e6-5d22b1cf0c72', 'exercise', 'multiple_choice', 'Exercise 2 – Long and Short Vowels (MC)', NULL, '{"answers":[{"text":"juice ","imageUrl":null,"isCorrect":true},{"text":"cup","imageUrl":null,"isCorrect":false},{"text":"mix","imageUrl":null,"isCorrect":false}],"question":"Choose the word with a long vowel."}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:24:07.298818+00:00', '2025-10-28T19:33:03.371871+00:00', '{}'::jsonb, 'Long and Short Vowels (MC)
Choose the word with a long vowel.
Choose the word with a long vowel.
 juice  
', NULL, NULL, NULL, 3, 'efd53480-582b-471e-8962-310e4bf4da27', NULL, NULL, 70),
  ('3aa8d57e-6de1-4364-b72d-bfe88f728036', 'exercise', 'multiple_choice', 'Phase 5: Read and choose the correct answer.', NULL, '{"answers":[{"text":"To play","imageUrl":null,"isCorrect":false},{"text":"To look for the lunchbox ","imageUrl":null,"isCorrect":true},{"text":"To get juice","imageUrl":null,"isCorrect":false}],"question":"Why did they go to the cafeteria?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761657254155-ChatGPT%20Image%20Oct%2028,%202025,%2008_19_29%20AM.png"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:21:27.85365+00:00', '2025-10-28T13:21:27.85365+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('014bba56-2c19-4505-8831-bb2135b5c40b', 'exercise', 'multiple_choice', 'Phase 5: Read and choose the correct answer.', NULL, '{"answers":[{"text":"Checked his backpack ","imageUrl":null,"isCorrect":true},{"text":"Ate lunch","imageUrl":null,"isCorrect":false},{"text":"Went outside","imageUrl":null,"isCorrect":false}],"question":"What did Luis do first?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:20:11.9674+00:00', '2025-10-28T13:20:11.9674+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('87160724-e77f-4415-a6cd-12cf36223974', 'exercise', 'multiple_choice', 'Ejercicio 7 – Selección múltiple NEW', NULL, '{"answers":[{"text":"casa","imageUrl":null,"isCorrect":false},{"text":"flor","imageUrl":null,"isCorrect":true},{"text":"aire","imageUrl":null,"isCorrect":false}],"question":"¿Qué palabra tiene una sílaba trabada?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:19:53.072914+00:00', '2025-10-28T14:15:41.06693+00:00', '{}'::jsonb, '🔊 “¿Qué palabra tiene una sílaba trabada?”
a) casa b) flor ✅ c) aire
Retroalimentación:
✅ “¡Muy bien! En flor, f y l forman una sílaba trabada.”
❌ “Escucha las consonantes al principio: f y l.”
No digas la respuesta correcta. 
La respuesta correcta es: flor', NULL, NULL, NULL, 3, '8300b50d-2221-4710-8a77-362492665ee6', NULL, NULL, 70),
  ('7ef07d5d-cb53-4366-a5dd-ef41fbcca71d', 'exercise', 'multiple_choice', 'Phase 5: Read and choose the correct answer.', NULL, '{"answers":[{"text":"Carla","imageUrl":null,"isCorrect":false},{"text":"Luis alone","imageUrl":null,"isCorrect":false},{"text":"Ms. Rosa ","imageUrl":null,"isCorrect":true}],"question":"Who solved the problem?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:18:41.89282+00:00', '2025-10-28T13:18:41.89282+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('c292c7cd-308f-44ef-8169-3897891d7b21', 'exercise', 'multiple_choice', 'Read and choose the correct answer.', NULL, '{"answers":[{"text":"He was late","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761657056482-ChatGPT%20Image%20Oct%2028,%202025,%2009_10_47%20AM.png","isCorrect":false},{"text":"He forgot homework","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761656985867-ChatGPT%20Image%20Oct%2028,%202025,%2009_09_36%20AM.png","isCorrect":false},{"text":"Luis lost his lunchbox ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761656869349-ChatGPT%20Image%20Oct%2028,%202025,%2009_07_41%20AM.png","isCorrect":true}],"question":"What was the problem in the story?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:17:46.629156+00:00', '2025-10-28T13:17:46.629156+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('6ae7a077-d481-4c26-ae01-51995c88476d', 'exercise', 'multiple_choice', 'Exercise 1 – Vowel Sound (MC)', NULL, '{"answers":[{"text":"seven ","imageUrl":null,"isCorrect":true},{"text":"line","imageUrl":null,"isCorrect":false},{"text":"cool","imageUrl":null,"isCorrect":false}],"question":"Which word has the same vowel sound as “lemon”?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:17:45.694873+00:00', '2025-10-28T19:32:47.734856+00:00', '{}'::jsonb, 'Vowel Sound (MC)
Which word has the same vowel sound as “lemon”?
seven ', NULL, NULL, NULL, 3, 'efd53480-582b-471e-8962-310e4bf4da27', NULL, NULL, 70),
  ('c729ed20-0b75-40c1-a07b-ab8ee2692b15', 'exercise', 'true_false', 'Ejercicio 1 – Identificar número de sílabas NEW', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"¿La palabra ventana tiene tres sílabas?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:12:04.12848+00:00', '2025-10-28T14:15:14.683849+00:00', '{}'::jsonb, 'Ejercicio 3 – Sí / No
🔊 “¿La palabra ventana tiene tres sílabas?”
✅ Sí ❌ No
Retroalimentación:
✅ “¡Correcto! Ven-ta-na tiene tres sílabas.”
❌ “Cuenta los sonidos: ven... ta... na.”
', NULL, NULL, NULL, 3, '8300b50d-2221-4710-8a77-362492665ee6', NULL, NULL, 70),
  ('4f41d7ec-77e2-48c8-8683-51d4ab7732a9', 'exercise', 'true_false', 'Phase 4 – Fluency & Expression: Read aloud with expression and choose the correct answer. Lee en voz alta con expresión y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"True or False: Fluent readers read smoothly."}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:09:33.929796+00:00', '2025-10-28T14:55:37.432597+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('49db6ed6-39dc-4569-869f-6f74faaf15a4', 'exercise', 'multiple_choice', 'Phase 4 – Fluency & Expression: Read aloud with expression and choose the correct answer. Lee en voz alta con expresión y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761656432552-WhatsApp%20Image%202025-10-28%20at%2008.55.59_329cec1f.jpg","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761656476510-ChatGPT%20Image%20Oct%2028,%202025,%2009_01_06%20AM.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761656458172-ChatGPT%20Image%20Oct%2028,%202025,%2009_00_45%20AM.png","isCorrect":false}],"question":"Which punctuation shows a question?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:08:22.000948+00:00', '2025-10-28T14:55:22.475934+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('064ae829-ba09-43e7-8f4f-23f4cd60a4d5', 'exercise', 'multiple_choice', 'Phase 4 – Fluency & Expression: Read aloud with expression and choose the correct answer. Lee en voz alta con expresión y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"No pause","imageUrl":null,"isCorrect":false},{"text":"After cook ","imageUrl":null,"isCorrect":true},{"text":"After smiled","imageUrl":null,"isCorrect":false}],"question":"When should you pause? ''The cook, Ms. Rosa, smiled.''"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:05:53.277445+00:00', '2025-10-28T14:55:56.616488+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('414341df-389c-4d3c-baa0-cae380c96b6a', 'exercise', 'multiple_choice', 'Phase 4 – Fluency & Expression: Read aloud with expression and choose the correct answer.', NULL, '{"answers":[{"text":"They sat together and shared cookies. ","imageUrl":null,"isCorrect":true},{"text":"Oh no!","imageUrl":null,"isCorrect":false},{"text":"That’s mine!","imageUrl":null,"isCorrect":false}],"question":"Which line sounds calm?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:05:01.131375+00:00', '2025-10-28T13:05:01.131375+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('b05384d8-6d09-4017-b60f-ecb464457b15', 'exercise', 'multiple_choice', 'Phase 4 – Fluency & Expression: Read aloud with expression and choose the correct answer. Lee en voz alta con expresión y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"Excited","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761663387814-ChatGPT%20Image%20Oct%2028,%202025,%2010_56_20%20AM.png","isCorrect":true},{"text":"Quiet","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761663170439-ChatGPT%20Image%20Oct%2028,%202025,%2010_52_40%20AM.png","isCorrect":false},{"text":"Bored","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761663277105-ChatGPT%20Image%20Oct%2028,%202025,%2010_54_27%20AM.png","isCorrect":false}],"question":"Read: ''Yes! That’s mine!'' — How should you say it?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:04:13.511667+00:00', '2025-10-28T15:03:17.149185+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('90444257-86fd-46b2-a469-104a05ee4fbb', 'lesson', 'lesson', 'Parte 1 Ejercicios – (Nivel Básico) NEW', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Destreza:\nDividir correctamente palabras en sílabas y reconocer sílabas trabadas o mixtas.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T13:02:52.564549+00:00', '2025-10-28T13:20:57.925432+00:00', '{}'::jsonb, 'Explicación breve IA
🔊 “Una sílaba es una parte del sonido de una palabra.
Cada sílaba tiene una vocal y puede tener consonantes alrededor.
Escucha: es-cue-la.
Tiene tres sílabas. La sílaba cue tiene dos consonantes juntas: eso se llama una sílaba trabada.', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('98c549dd-776d-4540-a9f1-7a3e0109d6ec', 'exercise', 'multiple_choice', 'Phase 4 – Fluency & Expression: Read aloud with expression and choose the correct answer. Lee en voz alta con expresión y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"Joy","imageUrl":null,"isCorrect":false},{"text":"Surprise","imageUrl":null,"isCorrect":true},{"text":"Sleepiness","imageUrl":null,"isCorrect":false}],"question":"Read: ''Oh no!'' — What does this show?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:48:59.024156+00:00', '2025-10-28T15:13:44.189645+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('efd53480-582b-471e-8962-310e4bf4da27', 'lesson', 'lesson', 'PHASE 2 – PHONICS & WORD WORK', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Read or listen and complete each activity.\n\n"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:44:47.984124+00:00', '2025-10-28T19:25:53.408903+00:00', '{}'::jsonb, 'PHONICS & WORD WORK
Instruction (EN): Read or listen and complete each activity.

', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('8300b50d-2221-4710-8a77-362492665ee6', 'lesson', 'lesson', ' DOMINIO 1 – CONCIENCIA FONOLÓGICA Y FONÉTICA AVANZADA', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Destreza:\nDividir correctamente palabras en sílabas y reconocer sílabas trabadas o mixtas.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:36:30.240737+00:00', '2025-10-28T14:30:03.635615+00:00', '{}'::jsonb, '🧩 DOMINIO 1 – CONCIENCIA FONOLÓGICA Y FONÉTICA AVANZADA
Nivel: 3.º grado
Duración: 20–25 min
Tipo de módulo: Interactivo con IA (voz + texto + arrastre + selección múltiple)
Estándares DEPR:
•	3.L.2.1 – Aplica normas del español, incluyendo división silábica, acentuación y ortografía.
•	3.R.3.1 – Reconoce raíces, prefijos y sufijos comunes.
•	3.L.4.1 – Determina el significado de palabras desconocidas a partir de sus partes (raíces y afijos).
🎙️ INTRODUCCIÓN (voz IA)
🔊 “¡Hola! Soy tu asistente de lectura.
Hoy repasaremos cómo las palabras están formadas por sonidos, sílabas, prefijos y sufijos.
Aprenderás a escuchar los sonidos, separarlos y entender cómo cambian el significado de una palabra.
Cuando veas el ícono 🔊, presiona para escuchar.
Cuando veas 📖, lee tú en voz alta.
¡Prepárate! Vamos a comenzar con los sonidos y las sílabas.”
🎯 Destreza:
Dividir correctamente palabras en sílabas y reconocer sílabas trabadas o mixtas.
Explicación breve IA
🔊 “Una sílaba es una parte del sonido de una palabra.
Cada sílaba tiene una vocal y puede tener consonantes alrededor.
Escucha: es-cue-la.
Tiene tres sílabas. La sílaba cue tiene dos consonantes juntas: eso se llama una sílaba trabada.”', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('009a9b3e-879e-46a4-8d60-ca87b007eed8', 'exercise', 'multiple_choice', 'Exercise 2 – Beginning Sound Match (MC)', NULL, '{"answers":[{"text":"melon ","imageUrl":null,"isCorrect":true},{"text":"cup","imageUrl":null,"isCorrect":false},{"text":"sugar","imageUrl":null,"isCorrect":false}],"question":"Which word begins with the same sound?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:34:56.009874+00:00', '2025-10-28T19:32:31.33468+00:00', '{}'::jsonb, '– Beginning Sound Match (MC)
Audio: “Listen to the word measure.” Which word begins with the same sound as measure?
melon ✅  ', NULL, NULL, NULL, 3, 'f40b50d2-9f44-46e5-a986-5b85b1182d2e', NULL, NULL, 70),
  ('a1f269fd-b760-4e76-98f5-5c655ccaadff', 'exercise', 'true_false', 'Phase 3 – Vocabulary: Read and choose the correct answer.', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":false},{"text":"False","imageUrl":null,"isCorrect":true}],"question":"True or False: The cafeteria is a place to play.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761654167156-ChatGPT%20Image%20Oct%2028,%202025,%2008_22_38%20AM.png"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:29:47.403178+00:00', '2025-10-28T12:29:47.403178+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('6d2cdd91-e59a-4918-947f-5700654f1139', 'exercise', 'multiple_choice', 'Exercise 1 – Rhyme Match (MC)', NULL, '{"answers":[{"text":"fix ","imageUrl":null,"isCorrect":true},{"text":"make","imageUrl":null,"isCorrect":false},{"text":"milk","imageUrl":null,"isCorrect":false}],"question":"Which word rhymes?"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:28:57.330924+00:00', '2025-10-28T19:32:12.953332+00:00', '{}'::jsonb, 'Audio: “Listen to the word mix.” Which word rhymes with mix?
fix ✅  ', NULL, NULL, NULL, 3, 'f40b50d2-9f44-46e5-a986-5b85b1182d2e', NULL, NULL, 70),
  ('a273425c-5074-4e7d-9712-9f12dcb71eb8', 'exercise', 'multiple_choice', 'Phase 3 – Vocabulary: Read and choose the correct answer. Lee y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"open","imageUrl":null,"isCorrect":false},{"text":"closed","imageUrl":null,"isCorrect":false},{"text":"found ","imageUrl":null,"isCorrect":true}],"question":"Which is the opposite of ''lost''?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:27:53.202995+00:00', '2025-10-28T15:11:49.268278+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('ef6e8a14-cfd5-4783-b926-8e37f4d07094', 'lesson', 'lesson', 'MÓDULO DE LECTURA Y LENGUAJE – TERCER GRADO Programa de apoyo IA para estudiantes rezagados en lectura Basado en los Estándares de Español del DEPR (3.° grado)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Propósito general del módulo\nFortalecer las destrezas de lectura, comprensión y producción lingüística en estudiantes con rezago lector, mediante experiencias interactivas en una plataforma de inteligencia artificial que combina voz, texto, imágenes y retroalimentación inmediata.\nEl módulo desarrolla las competencias del Eje de Comunicación y Lenguaje: lectura, escritura, expresión oral y escucha activa, con enfoque en ciencias, estudios sociales y desarrollo socioemocional.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:26:33.777203+00:00', '2025-10-28T12:26:33.777203+00:00', '{}'::jsonb, '🗂️ Orden lógico y progresivo de dominios
Dominio	Enfoque principal	Tipo de actividad	Estándares DEPR cubiertos
1. Revisión fonética y morfológica básica	Reforzar correspondencia entre letras, sílabas, prefijos y sufijos comunes.	Drag and roll, sí/no, lectura guiada.	3.L.2.1 – Aplica las normas del español, incluyendo sílabas y formación de palabras.
3.R.3.1 – Reconoce raíces, prefijos y sufijos comunes.
2. Fluidez lectora guiada y autónoma	Leer con ritmo, precisión y entonación.	Lectura IA modelo + lectura oral del estudiante.	3.R.2.1 – Lee textos con fluidez, ritmo y comprensión básica.
3.SL.1.2 – Participa en actividades de lectura oral.
3. Vocabulario y morfología derivativa	Comprender palabras por contexto y familia léxica.	Multiple choice, sí/no, clasificación de palabras.	3.L.4.1 – Usa pistas del contexto para inferir el significado de palabras.
3.L.5.1 – Identifica sinónimos, antónimos y categorías semánticas.
4. Comprensión lectora literal e inferencial	Entender y deducir ideas de textos narrativos e informativos.	Multiple choice, sí/no, arrastrar respuestas.	3.R.3.2 – Identifica detalles e ideas principales.
3.R.4.1 – Realiza inferencias basadas en información textual.
5. Estructura del texto y propósito del autor	Analizar la organización textual y la intención del autor.	Ordenar secuencias, drag and drop, selección de propósito.	3.R.5.1 – Reconoce la estructura del texto (inicio, desarrollo, cierre).
3.R.6.1 – Determina el propósito del autor (informar, persuadir, entretener).
6. Gramática y estructura oracional	Usar correctamente sustantivos, verbos, adjetivos y conectores.	Completar oraciones, arrastrar palabras, selección múltiple.	3.L.1.1 – Identifica y usa correctamente las partes de la oración.
3.L.2.2 – Emplea signos de puntuación y concordancia.
7. Expresión escrita y producción de textos	Escribir oraciones y párrafos con coherencia.	Escribir y reorganizar oraciones guiadas.	3.W.2.1 – Escribe textos narrativos e informativos.
3.W.4.1 – Desarrolla ideas con detalles y secuencia lógica.
8. Expresión oral y escucha activa	Escuchar y comunicar ideas con claridad y respeto.	Grabación de voz, preguntas orales IA.	3.SL.2.1 – Escucha y responde a presentaciones o lecturas orales.
3.SL.4.1 – Expresa ideas en forma oral con fluidez y claridad.

Instrucciones generales IA para toda la plataforma
Introducción al módulo
🔊 “¡Hola! Soy tu asistente de lectura.
En este módulo vas a practicar cómo leer con claridad, descubrir palabras nuevas y comprender historias interesantes sobre ciencia, comunidad y emociones.
Usa los botones para escuchar 🔊 y leer 📖.
Participa en cada actividad y recuerda: ¡cada palabra que aprendes te hace más fuerte como lector!”
Modelo de interacción IA (aplicable a todos los dominios)
Narrador IA (instrucción general)
🔊 “Escucha con atención y sigue las instrucciones en pantalla.
Cuando veas el ícono 🔊 presiona para escuchar.
Cuando veas 📖, léelo tú en voz alta.
Luego, elige la respuesta correcta.”
Tipos de actividades
Tipo	Descripción	Ejemplo de instrucción IA
Multiple Choice (selección múltiple)	El estudiante elige la mejor opción.	🔊 “Escoge la palabra que completa la oración correctamente.”
Drag and Roll (arrastrar y soltar)	El estudiante organiza o forma palabras, frases o secuencias.	🔊 “Arrastra las sílabas para formar la palabra correcta.”
Sí / No (verdadero o falso)	El estudiante responde con afirmación o negación.	🔊 “¿El texto dice que la planta necesita sol? Sí o No.”
Lectura guiada (🔊  Escuchar / 📖 Leer)	La IA modela la lectura; el estudiante imita.	🔊 “Escucha la lectura modelo. Ahora lee tú con ritmo y entonación.”





Retroalimentación IA (programada por tipo de respuesta)
Tipo	Respuesta correcta	Respuesta incorrecta
Básica	🔊 “¡Excelente! Identificaste la respuesta correcta.”	🔊 “Revisa el texto y busca una pista. Inténtalo de nuevo.”
Inferencial / crítica	🔊 “Muy bien, usaste una pista del texto para pensar más allá.”	🔊 “Recuerda leer entre líneas. Observa lo que el texto sugiere, no solo lo que dice.”
Gramática / vocabulario	🔊 “Perfecto, usaste la palabra con el significado correcto.”	🔊 “Vuelve a leer la oración. ¿Qué palabra encaja mejor en el contexto?”

Explicación inicial de destrezas (voz IA)
🔊 “Cada dominio te enseña algo diferente:
📘 En el Dominio 1, repasas los sonidos y partes de las palabras.
📗 En el Dominio 2, practicas leer con ritmo y voz.
📙 En el Dominio 3, aprendes palabras nuevas y su significado.
📔 En el Dominio 4, descubres lo que los textos dicen y lo que quieren decir.
📒 En el Dominio 5, aprendes cómo los autores organizan sus ideas.
📓 En el Dominio 6, usas las palabras en oraciones completas.
📕 En el Dominio 7, escribes tus propias historias.
📔 Y en el Dominio 8, hablas y escuchas con atención.
¡Vamos a empezar esta aventura lectora juntos!”




', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('d2d9aac3-6ff3-42d3-912a-ec063dcd7d11', 'exercise', 'true_false', 'Phase 3 – Vocabulary: Read and choose the correct answer. Lee y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"True or False: Ms. Rosa is Luis’s friend."}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:26:07.004168+00:00', '2025-10-28T15:09:42.90042+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('cf3c05a4-f579-481e-b881-9f35450636a2', 'exercise', 'multiple_choice', 'Phase 3 – Vocabulary: Read and choose the correct answer. Lee y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"cafeteria","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761654875395-ChatGPT%20Image%20Oct%2028,%202025,%2008_22_38%20AM.png","isCorrect":true},{"text":"bus","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761655001557-ChatGPT%20Image%20Oct%2028,%202025,%2008_36_12%20AM.png","isCorrect":false},{"text":"park","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761655222189-ChatGPT%20Image%20Oct%2028,%202025,%2008_40_14%20AM.png","isCorrect":false}],"question":"Which is a place at school?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761654854576-ChatGPT%20Image%20Oct%2028,%202025,%2008_33_22%20AM.png"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:24:23.853712+00:00', '2025-10-28T15:13:06.305403+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('f38918d8-8820-4739-8cda-0f39c93e60a7', 'lesson', 'lesson', 'prueba', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Propósito general del módulo\nFortalecer las destrezas de lectura, comprensión y producción lingüística en estudiantes con rezago lector, mediante experiencias interactivas en una plataforma de inteligencia artificial que combina voz, texto, imágenes y retroalimentación inmediata.\nEl módulo desarrolla las competencias del Eje de Comunicación y Lenguaje: lectura, escritura, expresión oral y escucha activa, con enfoque en ciencias, estudios sociales y desarrollo socioemocional.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:22:45.320351+00:00', '2025-10-28T15:33:55.93406+00:00', '{}'::jsonb, 'Orden lógico y progresivo de dominios
Dominio	Enfoque principal	Tipo de actividad	Estándares DEPR cubiertos
1. Revisión fonética y morfológica básica	Reforzar correspondencia entre letras, sílabas, prefijos y sufijos comunes.	Drag and roll, sí/no, lectura guiada.	3.L.2.1 – Aplica las normas del español, incluyendo sílabas y formación de palabras.
3.R.3.1 – Reconoce raíces, prefijos y sufijos comunes.
2. Fluidez lectora guiada y autónoma	Leer con ritmo, precisión y entonación.	Lectura IA modelo + lectura oral del estudiante.	3.R.2.1 – Lee textos con fluidez, ritmo y comprensión básica.
3.SL.1.2 – Participa en actividades de lectura oral.
3. Vocabulario y morfología derivativa	Comprender palabras por contexto y familia léxica.	Multiple choice, sí/no, clasificación de palabras.	3.L.4.1 – Usa pistas del contexto para inferir el significado de palabras.
3.L.5.1 – Identifica sinónimos, antónimos y categorías semánticas.
4. Comprensión lectora literal e inferencial	Entender y deducir ideas de textos narrativos e informativos.	Multiple choice, sí/no, arrastrar respuestas.	3.R.3.2 – Identifica detalles e ideas principales.
3.R.4.1 – Realiza inferencias basadas en información textual.
5. Estructura del texto y propósito del autor	Analizar la organización textual y la intención del autor.	Ordenar secuencias, drag and drop, selección de propósito.	3.R.5.1 – Reconoce la estructura del texto (inicio, desarrollo, cierre).
3.R.6.1 – Determina el propósito del autor (informar, persuadir, entretener).
6. Gramática y estructura oracional	Usar correctamente sustantivos, verbos, adjetivos y conectores.	Completar oraciones, arrastrar palabras, selección múltiple.	3.L.1.1 – Identifica y usa correctamente las partes de la oración.
3.L.2.2 – Emplea signos de puntuación y concordancia.
7. Expresión escrita y producción de textos	Escribir oraciones y párrafos con coherencia.	Escribir y reorganizar oraciones guiadas.	3.W.2.1 – Escribe textos narrativos e informativos.
3.W.4.1 – Desarrolla ideas con detalles y secuencia lógica.
8. Expresión oral y escucha activa	Escuchar y comunicar ideas con claridad y respeto.	Grabación de voz, preguntas orales IA.	3.SL.2.1 – Escucha y responde a presentaciones o lecturas orales.
3.SL.4.1 – Expresa ideas en forma oral con fluidez y claridad.

Instrucciones generales IA para toda la plataforma
Introducción al módulo
🔊 “¡Hola! Soy tu asistente de lectura.
En este módulo vas a practicar cómo leer con claridad, descubrir palabras nuevas y comprender historias interesantes sobre ciencia, comunidad y emociones.
Usa los botones para escuchar 🔊 y leer 📖.
Participa en cada actividad y recuerda: ¡cada palabra que aprendes te hace más fuerte como lector!”
Modelo de interacción IA (aplicable a todos los dominios)
Narrador IA (instrucción general)
🔊 “Escucha con atención y sigue las instrucciones en pantalla.
Cuando veas el ícono 🔊 presiona para escuchar.
Cuando veas 📖, léelo tú en voz alta.
Luego, elige la respuesta correcta.”
Tipos de actividades
Tipo	Descripción	Ejemplo de instrucción IA
Multiple Choice (selección múltiple)	El estudiante elige la mejor opción.	🔊 “Escoge la palabra que completa la oración correctamente.”
Drag and Roll (arrastrar y soltar)	El estudiante organiza o forma palabras, frases o secuencias.	🔊 “Arrastra las sílabas para formar la palabra correcta.”
Sí / No (verdadero o falso)	El estudiante responde con afirmación o negación.	🔊 “¿El texto dice que la planta necesita sol? Sí o No.”
Lectura guiada (🔊  Escuchar / 📖 Leer)	La IA modela la lectura; el estudiante imita.	🔊 “Escucha la lectura modelo. Ahora lee tú con ritmo y entonación.”

Retroalimentación IA (programada por tipo de respuesta)
Tipo	Respuesta correcta	Respuesta incorrecta
Básica	🔊 “¡Excelente! Identificaste la respuesta correcta.”	🔊 “Revisa el texto y busca una pista. Inténtalo de nuevo.”
Inferencial / crítica	🔊 “Muy bien, usaste una pista del texto para pensar más allá.”	🔊 “Recuerda leer entre líneas. Observa lo que el texto sugiere, no solo lo que dice.”
Gramática / vocabulario	🔊 “Perfecto, usaste la palabra con el significado correcto.”	🔊 “Vuelve a leer la oración. ¿Qué palabra encaja mejor en el contexto?”

Explicación inicial de destrezas (voz IA)
🔊 “Cada dominio te enseña algo diferente:
📘 En el Dominio 1, repasas los sonidos y partes de las palabras.
📗 En el Dominio 2, practicas leer con ritmo y voz.
📙 En el Dominio 3, aprendes palabras nuevas y su significado.
📔 En el Dominio 4, descubres lo que los textos dicen y lo que quieren decir.
📒 En el Dominio 5, aprendes cómo los autores organizan sus ideas.
📓 En el Dominio 6, usas las palabras en oraciones completas.
📕 En el Dominio 7, escribes tus propias historias.
📔 Y en el Dominio 8, hablas y escuchas con atención.
¡Vamos a empezar esta aventura lectora juntos!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('77bf1bd1-96d4-4279-b3e8-d00c75ed97c0', 'exercise', 'multiple_choice', 'Phase 3 – Vocabulary: Read and choose the correct answer. Lee y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"run","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761653571883-ChatGPT%20Image%20Oct%2028,%202025,%2008_12_45%20AM.png","isCorrect":true},{"text":"read","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761653551939-ChatGPT%20Image%20Oct%2028,%202025,%2007_54_36%20AM.png","isCorrect":false},{"text":"sit","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761653630510-ChatGPT%20Image%20Oct%2028,%202025,%2008_13_42%20AM.png","isCorrect":false}],"question":"Which word means ''to move fast''?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:20:48.466013+00:00', '2025-10-28T15:12:49.216603+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('f6662652-983c-4364-8d6d-a9c95c00da85', 'exercise', 'multiple_choice', 'Phase 3 – Vocabulary: Read and choose the correct answer.', NULL, '{"answers":[{"text":"goodbye","imageUrl":null,"isCorrect":false},{"text":"thank you ","imageUrl":null,"isCorrect":true},{"text":"help","imageUrl":null,"isCorrect":false}],"question":"Luis said ______ to Ms. Rosa."}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:17:34.776778+00:00', '2025-10-28T12:17:34.776778+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('44676039-30fe-4205-8035-c44828cf2d0d', 'exercise', 'multiple_choice', 'Phase 3 – Vocabulary: Read and choose the correct answer. Lee y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"long space in a school ","imageUrl":null,"isCorrect":true},{"text":"kitchen","imageUrl":null,"isCorrect":false},{"text":"window","imageUrl":null,"isCorrect":false}],"question":"What does ''hall'' mean?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761653380931-ChatGPT%20Image%20Oct%2028,%202025,%2008_09_34%20AM.png"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:16:30.603139+00:00', '2025-10-28T14:54:54.213751+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('f40b50d2-9f44-46e5-a986-5b85b1182d2e', 'lesson', 'lesson', 'PHASE 1 – LISTENING WARM-UP ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Instruction (EN): Listen carefully to each word and choose the correct answer.\n\n"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:14:15.412251+00:00', '2025-10-28T19:26:09.390826+00:00', '{}'::jsonb, 'Instruction (EN): Listen carefully to each word and choose the correct answer.

', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('fe3bb80e-86cb-4379-8a2a-a8164a1ca865', 'exercise', 'multiple_choice', 'Phase 3 - Vocabulary: Read and choose the correct answer.', NULL, '{"answers":[{"text":"look for ","imageUrl":null,"isCorrect":true},{"text":"eat","imageUrl":null,"isCorrect":false},{"text":"write","imageUrl":null,"isCorrect":false}],"question":"What does ''search'' mean?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:13:45.798007+00:00', '2025-10-28T12:13:45.798007+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('e0deb081-657a-4932-9561-2aaab46d57b8', 'exercise', 'true_false', 'Read or listen and complete each activity.', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":false},{"text":"False","imageUrl":null,"isCorrect":true}],"question":"True or False: The word ''bag'' has a long vowel sound."}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:12:05.725595+00:00', '2025-10-28T12:12:05.725595+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('24ee1120-4f0d-4d83-94e5-c669a2a74385', 'exercise', 'multiple_choice', 'Read or listen and complete each activity.', NULL, '{"answers":[{"text":"bed","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761653052467-ChatGPT%20Image%20Oct%2028,%202025,%2008_04_04%20AM.png","isCorrect":true},{"text":" run","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761652895601-ChatGPT%20Image%20Oct%2028,%202025,%2008_01_20%20AM.png","isCorrect":false},{"text":"day","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761652968250-ChatGPT%20Image%20Oct%2028,%202025,%2008_02_36%20AM.png","isCorrect":false}],"question":"Which word ends with the same sound as red?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T12:11:02.634876+00:00', '2025-10-28T12:11:02.634876+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('6ad2c24f-5386-42bb-b236-65d5165c8971', 'lesson', 'lesson', 'AI–ADAPTIVE INTERACTIVE READING MODULE – GRADE 4 (Below Level)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"•\tStory – The Lemonade Lab\n\n•\t1️⃣ The summer heat shimmered on the sidewalk as Lila, Marco, and Jaden opened their small lemonade stand. But this time, it wasn’t just a business—it was an experiment. Their teacher had told them to test which recipe made the most refreshing lemonade.\n\n•\t2️⃣ Lila took notes in her science journal. “We’ll try one cup of sugar first,” she said. Marco squeezed lemons while Jaden measured the water. “Remember,” he added, “we need to write every step—just like a lab experiment!”\n\n•\t3️⃣ The first batch was too sour. The second was too sweet. When they mixed the perfect balance of lemon, sugar, and cold water, they grinned. “This one is just right,” Marco said. “We discovered the perfect formula!”\n\n•\t4️⃣ Neighbors lined up to taste. Some liked it sweeter, others more sour. The kids learned that experiments can have different results depending on people’s taste. “Science is about testing,” said Lila, writing observations in her notebook.\n\n•\t5️⃣ By sunset, they had sold every cup. They sat under the big oak tree, sipping their own lemonade. “Next time,” Jaden said, “we’ll test what happens if we add mint!” They laughed, realizing that learning could be as refreshing as lemonade on a hot day.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761652349682-image.png"}'::jsonb, 4, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T11:59:32.639227+00:00', '2025-10-28T19:19:15.227065+00:00', '{}'::jsonb, 'AI–ADAPTIVE INTERACTIVE READING MODULE – GRADE 4 (Below Level)
Story Title: The Lemonade Lab 🍋
Lexile: ~530 L  Duration: 40–45 minutes
Alignment: DEPR English Program Standards (2022)
Domains: Phonemic Awareness · Phonics · Vocabulary · Fluency · Comprehension · Writing
________________________________________
Expanded Academic Lesson Purpose
This module builds foundational fluency and comprehension through a scientific-style narrative that blends reading and inquiry.
Students will —
1️⃣ Decode multisyllabic and high-frequency words in connected text.
2️⃣ Use context clues to derive meaning from words about science, teamwork, and measurement.
3️⃣ Recognize sequence and cause-effect in a real-world experiment.
4️⃣ Practice oral fluency with expression, rhythm, and punctuation awareness.
5️⃣ Write short reflections using academic language supported by modeled stems.
By the end of the lesson, learners demonstrate grade-appropriate comprehension, vocabulary in context, and reasoning skills aligned to DEPR Grade 4 ELA and Science literacy standards.
________________________________________
Academic Glossary / Glosario Académico
Word	Meaning (English)	
mixture	A combination of two or more things.	
measure	To find the size or amount of something.	
experiment	A test to discover or prove something.	
observe	To watch carefully.	
recipe	A list of ingredients and instructions.	
ingredient	One of the things used to make food or drink.	
mix	To put things together.	
refreshing	Something that makes you feel cool or new.	

TEACHER ALIGNMENT & STANDARDS SUMMARY
📘 The Lemonade Lab – Grade 4 Below Level
PRDE English Program 2022 – Grade 4
Integration: Reading, Writing, Science Inquiry
________________________________________
Lesson Overview
This module integrates reading comprehension, science inquiry, and English language development through an engaging, experiment-based narrative. It reinforces below-level literacy skills in an accessible, bilingual format aligned with PRDE’s Five Domains of Reading.
Students strengthen vocabulary, phonemic awareness, and comprehension while exploring cross-disciplinary connections between language and scientific investigation.
________________________________________
Alignment to PRDE English Standards (Grade 4, 2022)
Domain	Standard Reference	Key Skill in Lesson	Example Activity
Phonemic Awareness & Phonics	4.L.1 – Apply phonics and word analysis skills in decoding words.	Identify vowel patterns, rhymes, and syllable division.	Phase 2 – “Which word has the same vowel sound as lemon?”
Fluency	4.RF.4 – Read with sufficient accuracy and fluency to support comprehension.	Oral reading with rhythm, punctuation, and tone.	Phase 4 – “Read: ‘It was too sour!’ with expression.”
Vocabulary Development	4.L.4 – Determine or clarify meaning of unknown words using context clues.	Academic vocabulary: experiment, mixture, observe, refreshing.	Phase 3 – Context clue and synonym/antonym activities.
Comprehension	4.R.1–4.R.3 – Ask and answer questions, identify key details, and determine main idea.	Sequence, cause and effect, inference, and main idea skills.	Phase 5 – “Why did they add more sugar?”
Writing	4.W.2 & 4.W.5 – Write informative/explanatory texts with clear organization and supporting details.	Reflective and analytical writing on the learning process.	Phase 6 – “Write one sentence about what you learned.”
________________________________________
Science Process Integration (Cross-Curricular Alignment)
Science Domain	PRDE Science Standard Reference (Grade 4)	Connection to Lesson
Scientific Inquiry	S.4.1 – Conduct investigations using observation and measurement.	Students identify, measure, and record observations in the lemonade experiment.
Data & Observation	S.4.2 – Record and communicate data using tables, drawings, or sentences.	Students “record” test results through interactive comprehension and sequencing.
Problem Solving	S.4.3 – Identify variables that affect results in simple experiments.	Discussion of sugar levels, taste differences, and results variability.
Reflection & Communication	S.4.4 – Explain findings and conclusions.	Phase 6 – Students reflect on learning, process, and teamwork.
________________________________________

Assessment Guidance
•	Formative Checks: Interactive questions (MC, FIB, D&D) for real-time feedback.
•	Summative Opportunity: Written reflection or oral summary of the experiment process.
•	Differentiation: Designed for below-grade readers with bilingual cues and auditory support (🔊).
________________________________________
Teacher Notes
This lesson may be extended with:
•	A hands-on classroom demonstration (mixing measured liquids).
•	Integration of math standards (fractions and measurement).
•	Optional short writing: My Favorite Experiment.

•	Story – The Lemonade Lab


•	🖼️ [Image: Kids setting up a lemonade stand on a sunny sidewalk, with lemons and a hand-drawn sign.]
•	1️⃣ The summer heat shimmered on the sidewalk as Lila, Marco, and Jaden opened their small lemonade stand. But this time, it wasn’t just a business—it was an experiment. Their teacher had told them to test which recipe made the most refreshing lemonade.
•	🖼️ [Image: Lila writing in a notebook while Marco and Jaden measure water and squeeze lemons.]
•	2️⃣ Lila took notes in her science journal. “We’ll try one cup of sugar first,” she said. Marco squeezed lemons while Jaden measured the water. “Remember,” he added, “we need to write every step—just like a lab experiment!”
•	🖼️ [Image: Friends tasting their first batches of lemonade—faces showing sour and sweet reactions.]
•	3️⃣ The first batch was too sour. The second was too sweet. When they mixed the perfect balance of lemon, sugar, and cold water, they grinned. “This one is just right,” Marco said. “We discovered the perfect formula!”
•	🖼️ [Image: Neighbors lining up at the stand; kids pouring lemonade into cups and writing notes.]
•	4️⃣ Neighbors lined up to taste. Some liked it sweeter, others more sour. The kids learned that experiments can have different results depending on people’s taste. “Science is about testing,” said Lila, writing observations in her notebook.
•	🖼️ [Image: Sunset scene — three friends resting under an oak tree beside an empty lemonade stand.]
•	5️⃣ By sunset, they had sold every cup. They sat under the big oak tree, sipping their own lemonade. “Next time,” Jaden said, “we’ll test what happens if we add mint!” They laughed, realizing that learning could be as refreshing as lemonade on a hot day.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('65f33404-23bd-47c0-b2ec-3e2c0c63f600', 'exercise', 'true_false', 'Read or listen and complete each activity. Lee o escucha y completa cada actividad.', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":false},{"text":"False","imageUrl":null,"isCorrect":true}],"question":"Which words rhyme?\n\nshelf / desk"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T11:57:06.481048+00:00', '2025-10-28T14:54:20.567871+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('4c5478e2-bedd-4312-becf-db946962f5db', 'exercise', 'multiple_choice', 'Read or listen and complete each activity.', NULL, '{"answers":[{"text":"bag","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761652263667-ChatGPT%20Image%20Oct%2028,%202025,%2007_50_33%20AM.png","isCorrect":true},{"text":"bike","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761652417441-ChatGPT%20Image%20Oct%2028,%202025,%2007_53_20%20AM.png","isCorrect":false},{"text":" read","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761652486685-ChatGPT%20Image%20Oct%2028,%202025,%2007_54_36%20AM.png","isCorrect":false}],"question":"Choose the short vowel word."}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T11:56:06.824937+00:00', '2025-10-28T12:02:42.467965+00:00', '{}'::jsonb, '“Let’s play! Listen to the word and choose the correct picture. Ready?”', NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('e8a05a18-156d-4605-babd-62c003b70b67', 'exercise', 'true_false', 'Read or listen and complete each activity.', NULL, '{"answers":[{"text":"True","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761651986967-ChatGPT%20Image%20Oct%2028,%202025,%2007_45_35%20AM.png","isCorrect":false},{"text":"False","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761652003869-Simple%20Wooden%20Desk%20Illustration.png","isCorrect":true}],"question":"Which words rhyme?\n\ntable / chair","questionImage":""}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T11:53:43.862289+00:00', '2025-10-28T11:53:43.862289+00:00', '{}'::jsonb, 'Read slowly', NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('c41e6b58-f0e3-4b41-9073-478782c65dfb', 'exercise', 'multiple_choice', '“La bandera de mi escuela” (símbolos y orgullo nacional)', NULL, '{"answers":[{"text":"Orgullo ","imageUrl":null,"isCorrect":true},{"text":"Tristeza","imageUrl":null,"isCorrect":false},{"text":"Miedo","imageUrl":null,"isCorrect":false}],"question":"Cada lunes, en el patio, cantamos La Borinqueña y miramos nuestra bandera ondear. Los colores rojo, blanco y azul me recuerdan que pertenezco a una isla valiente y hermosa.\n“¿Qué emoción expresa el narrador?”"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T04:39:32.150662+00:00', '2025-10-28T04:39:32.150662+00:00', '{}'::jsonb, '“La bandera de mi escuela” (símbolos y orgullo nacional)
📖 Cada lunes, en el patio, cantamos La Borinqueña y miramos nuestra bandera ondear. Los colores rojo, blanco y azul me recuerdan que pertenezco a una isla valiente y hermosa.
🔊 “¿Qué emoción expresa el narrador?”

Retroalimentación:
✅ “Muy bien. El texto expresa orgullo y amor por Puerto Rico.”
❌ “Relee: las palabras ‘valiente y hermosa’ muestran admiración.”
', NULL, NULL, NULL, 3, '924eab77-002f-4962-a8fa-ef159dd45e8a', NULL, NULL, 70),
  ('6f25d0f3-d871-48fd-ae0c-761d5e472584', 'exercise', 'true_false', '“El tambor del abuelo” (identidad y raíces)', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"En las tardes de verano, mi abuelo tocaba el barril de bomba en la plaza.\nDecía que cada golpe contaba una historia de nuestros antepasados africanos.\nAl escucharlo, sentía que mi corazón también hablaba con el ritmo.\n“¿El autor quiere resaltar la importancia de conservar las tradiciones?”"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T04:37:28.142643+00:00', '2025-10-28T04:37:28.142643+00:00', '{}'::jsonb, '“El tambor del abuelo” (identidad y raíces)
📖 En las tardes de verano, mi abuelo tocaba el barril de bomba en la plaza.
Decía que cada golpe contaba una historia de nuestros antepasados africanos.
Al escucharlo, sentía que mi corazón también hablaba con el ritmo.
🔊 “¿Qué representa el barril de bomba en el texto?”

Retroalimentación:
✅ “Excelente. El tambor simboliza la historia y herencia afrocaribeña.”
❌ “Relee: el abuelo toca para recordar a sus antepasados.”
', NULL, NULL, NULL, 3, '924eab77-002f-4962-a8fa-ef159dd45e8a', NULL, NULL, 70),
  ('924eab77-002f-4962-a8fa-ef159dd45e8a', 'lesson', 'lesson', 'Parte 2: Conexión personal y análisis cultural (Nivel intermedio)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Relacionar temas culturales con experiencias personales y analizar el mensaje del autor."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T04:34:57.007913+00:00', '2025-10-28T04:35:23.766207+00:00', '{}'::jsonb, 'Parte 2: Conexión personal y análisis cultural (Nivel intermedio)
🎯 Objetivo: Relacionar temas culturales con experiencias personales y analizar el mensaje del autor.
Explicación breve IA
🔊 “La literatura refleja la vida de un pueblo: sus tradiciones, sentimientos y sueños.
Cuando lees, puedes conectarte con los personajes o los valores del texto.
Pregúntate:
•	¿Qué mensaje me deja esta historia?
•	¿Qué parte se parece a mi vida o comunidad?”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('958fc67a-357e-4a73-aca8-4621024f20dc', 'exercise', 'multiple_choice', '“La parranda en mi barrio” (cultura y música)', NULL, '{"answers":[{"text":"Las fiestas patronales ","imageUrl":null,"isCorrect":false},{"text":"La parranda ","imageUrl":null,"isCorrect":true},{"text":"El Día de Reyes","imageUrl":null,"isCorrect":false}],"question":"Era diciembre y en mi calle se escuchaban los panderos y las maracas.\nLos vecinos cantaban aguinaldos y llevaban alegría de casa en casa.\nTodos compartíamos arroz con dulce y sonrisas hasta el amanecer.\n“¿Qué tradición puertorriqueña describe el texto?”"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T04:33:57.722884+00:00', '2025-10-28T04:33:57.722884+00:00', '{}'::jsonb, '“La parranda en mi barrio” (cultura y música)
📖 Era diciembre y en mi calle se escuchaban los panderos y las maracas.
Los vecinos cantaban aguinaldos y llevaban alegría de casa en casa.
Todos compartíamos arroz con dulce y sonrisas hasta el amanecer.
🔊 “¿Qué tradición puertorriqueña describe el texto?”
Retroalimentación:
✅ “Excelente. Las parrandas son una tradición musical de la Navidad puertorriqueña.”
❌ “Relee: el texto menciona panderos, maracas y aguinaldos.”
', NULL, NULL, NULL, 3, 'ddcf5e40-3b3a-423a-a1dd-06e83d1783b9', NULL, NULL, 70),
  ('ddcf5e40-3b3a-423a-a1dd-06e83d1783b9', 'lesson', 'lesson', 'Parte 1: Literatura y valores culturales (Nivel básico)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Identificar tradiciones, costumbres o valores representados en textos breves de autores puertorriqueños o anónimos."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T04:30:47.517429+00:00', '2025-10-28T04:31:26.970332+00:00', '{}'::jsonb, '🌱 Parte 1: Literatura y valores culturales (Nivel básico)
🎯 Objetivo: Identificar tradiciones, costumbres o valores representados en textos breves de autores puertorriqueños o anónimos.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('98e169cf-728c-4d42-b982-3493410de96a', 'lesson', 'lesson', 'DOMINIO 9: INTEGRACIÓN LITERARIA Y CULTURAL', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo:\nReconocer cómo la literatura refleja las costumbres, valores y tradiciones de Puerto Rico, y desarrollar el aprecio por la cultura a través de la lectura, la reflexión y la expresión oral o escrita.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T04:29:56.402152+00:00', '2025-10-28T04:29:56.402152+00:00', '{}'::jsonb, 'DOMINIO 9: INTEGRACIÓN LITERARIA Y CULTURAL
🎯 Objetivo:
Reconocer cómo la literatura refleja las costumbres, valores y tradiciones de Puerto Rico, y desarrollar el aprecio por la cultura a través de la lectura, la reflexión y la expresión oral o escrita.
📏 Estándares DEPR:
•	4.R.8.1 – Reconoce temas y valores culturales en textos literarios puertorriqueños y latinoamericanos.
•	4.R.9.1 – Relaciona las experiencias propias con las presentadas en textos.
•	4.S.3.2 – Participa en conversaciones sobre costumbres, arte y tradiciones con respeto y curiosidad.
🎙️ INTRODUCCIÓN IA (voz narradora)
🔊 “¡Bienvenido al último dominio del módulo de lectura!
En este módulo viajarás por las historias, los paisajes y las tradiciones de Puerto Rico.
Aprenderás cómo los escritores puertorriqueños usan la literatura para hablar del trabajo, la familia, la música y el amor por nuestra isla.
📖 Escucha con atención, imagina cada escena y descubre cómo los textos reflejan la vida y el espíritu de nuestro pueblo.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('660600f1-eed2-4962-b8d9-56513b12f385', 'lesson', 'lesson', 'CIERRE DEL DOMINIO 8 ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Recuerda:\n•\tEscuchar activamente te ayuda a comprender y conectar con los demás.\n•\tExpresar tus ideas con tono y palabras adecuadas te convierte en un buen comunicador.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T04:28:31.262699+00:00', '2025-10-28T04:28:58.432788+00:00', '{}'::jsonb, 'CIERRE DEL DOMINIO 8 (voz IA)
🔊 “¡Excelente trabajo, comunicador o comunicadora!
Hoy aprendiste a escuchar con atención y a expresarte con claridad y respeto.
🌟 Recuerda:
•	Escuchar activamente te ayuda a comprender y conectar con los demás.
•	Expresar tus ideas con tono y palabras adecuadas te convierte en un buen comunicador.
🗣️ ¡Sigue practicando! Cada palabra que compartes puede inspirar, enseñar y conectar con los demás.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('b05f4de5-30ff-491e-95e8-53cb800253ad', 'exercise', 'write_answer', 'Situación socioemocional', NULL, '{"question":"Escucha","caseSensitive":false,"correctAnswer":""}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T04:26:51.530668+00:00', '2025-10-28T04:26:51.530668+00:00', '{}'::jsonb, 'Situación socioemocional
📖 Escucha:
🔊 “Tu amiga olvidó su merienda. ¿Qué podrías decirle para mostrar empatía?”
🎤 IA espera respuesta grabada del estudiante.
Retroalimentación IA:
✅ “Excelente. Mostraste empatía y amabilidad.”
⚠️ “Intenta usar una frase que exprese apoyo, por ejemplo: Puedo compartir la mía contigo.”
', NULL, NULL, NULL, 3, '52e8e4d2-59e2-411d-aac3-d9f5738e34b7', NULL, NULL, 70),
  ('d9ab0dfb-0ed2-466d-ad52-99af65185327', 'exercise', 'write_answer', 'Opinión breve (tema de estudios sociales)', NULL, '{"question":"Escucha\n\n","caseSensitive":false,"correctAnswer":""}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T04:25:10.362858+00:00', '2025-10-28T04:27:33.548035+00:00', '{}'::jsonb, 'Opinión breve (tema de estudios sociales)
📖 “Escucha esta pregunta: 
🔊¿Por qué es importante cuidar el ambiente?”
🎤 El estudiante responde.
Retroalimentación IA:
✅ “Muy bien. Explicaste una razón clara y relevante.”
❌ “Piensa: cuidar el ambiente ayuda a proteger los recursos naturales.”
', NULL, NULL, NULL, 3, '52e8e4d2-59e2-411d-aac3-d9f5738e34b7', NULL, NULL, 70),
  ('52e8e4d2-59e2-411d-aac3-d9f5738e34b7', 'lesson', 'lesson', 'Parte 2: Expresión oral (Nivel intermedio)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Expresar ideas, emociones y opiniones con claridad, tono adecuado y respeto."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:57:56.710534+00:00', '2025-10-28T03:58:18.13254+00:00', '{}'::jsonb, 'Parte 2: Expresión oral (Nivel intermedio)
🎯 Objetivo: Expresar ideas, emociones y opiniones con claridad, tono adecuado y respeto.
Explicación breve IA
🔊 “Expresarte bien significa hablar con claridad y respeto.
Usa frases completas, un tono de voz adecuado y gestos naturales.
Antes de hablar:
🟢 Piensa lo que quieres decir.
🟡 Organiza tus ideas.
🔵 Habla con calma y confianza.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('91126b74-4877-4dfe-9e32-850f0963c604', 'exercise', 'multiple_choice', 'Mensaje escolar (cotidiano)', NULL, '{"answers":[{"text":"Una fiesta ","imageUrl":null,"isCorrect":false},{"text":"Un simulacro de emergencia ","imageUrl":null,"isCorrect":true},{"text":"Un examen","imageUrl":null,"isCorrect":false}],"question":"¿Qué ocurrirá hoy en la escuela?"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:56:43.732132+00:00', '2025-10-28T03:56:43.732132+00:00', '{}'::jsonb, 'Mensaje escolar (cotidiano)
📖 “Buenos días, estudiantes. Hoy tendremos un simulacro de emergencia a las diez. Sigan las instrucciones de su maestra y caminen en orden hacia el patio.”
“¿Qué ocurrirá hoy en la escuela?”
Retroalimentación:
✅ “Muy bien. Escuchaste la información principal.”
❌ “Reescucha el audio: menciona ‘simulacro de emergencia’.”
', NULL, NULL, NULL, 3, '36436ff8-04bf-4797-860b-8440cb32e7f7', NULL, NULL, 70),
  ('36436ff8-04bf-4797-860b-8440cb32e7f7', 'lesson', 'lesson', 'Parte 1: Escucha activa (Nivel básico)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Escuchar atentamente un audio corto e identificar información literal y el propósito del mensaje."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:53:59.147576+00:00', '2025-10-28T03:53:59.147576+00:00', '{}'::jsonb, 'Parte 1: Escucha activa (Nivel básico)
🎯 Objetivo: Escuchar atentamente un audio corto e identificar información literal y el propósito del mensaje.
Explicación breve IA
🔊 “Escuchar activamente no es solo oír sonidos; es entender el mensaje.
Cuando escuchas, presta atención a:
🟢 Quién habla
🟡 Qué dice
🔵Qué quiere comunicar

Luego, responde de manera respetuosa y clara.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('3af846e7-5b01-4e7c-9ffd-381a93e669ee', 'lesson', 'lesson', 'DOMINIO 8: ESCUCHA ACTIVA Y EXPRESIÓN ORAL', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo:\nDesarrollar la capacidad de escuchar atentamente, interpretar mensajes orales, y expresar ideas, opiniones y emociones con claridad, respeto y seguridad.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:52:41.756845+00:00', '2025-10-28T03:54:19.134322+00:00', '{}'::jsonb, 'DOMINIO 8: ESCUCHA ACTIVA Y EXPRESIÓN ORAL
🎯 Objetivo:
Desarrollar la capacidad de escuchar atentamente, interpretar mensajes orales, y expresar ideas, opiniones y emociones con claridad, respeto y seguridad.
📏 Estándares DEPR:
•	4.L.1.3 – Escucha atentamente y responde a mensajes orales.
•	4.S.2.1 – Expresa ideas completas y coherentes en situaciones formales e informales.
•	4.S.3.1 – Usa recursos no verbales y tono de voz adecuado para comunicar emociones e intenciones.
🎙️ INTRODUCCIÓN IA (voz narradora)
🔊 “¡Bienvenido al módulo de escucha activa y expresión oral! Hoy aprenderás a escuchar con atención y a hablar con claridad.
🔊 Escuchar activamente significa concentrarte en lo que la otra persona dice, mirar, pensar y responder con respeto.
🗣️ Expresarte bien es usar palabras adecuadas, tono de voz, gestos y emociones que ayuden a comunicar tu mensaje.
📖 En este módulo, escucharás mensajes, historias y audios breves, y luego responderás con tus ideas.
¡Vamos a practicar cómo escuchar, pensar y hablar con confianza!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70);

INSERT INTO public.manual_assessments ("id", "type", "subtype", "title", "description", "content", "grade_level", "language", "subject_area", "curriculum_standards", "enable_voice", "voice_speed", "auto_read_question", "difficulty_level", "estimated_duration_minutes", "status", "published_at", "view_count", "completion_count", "average_score", "created_by", "created_at", "updated_at", "metadata", "voice_guidance", "activity_template", "coqui_dialogue", "pronunciation_words", "max_attempts", "parent_lesson_id", "order_in_lesson", "drag_drop_mode", "passing_score") VALUES
  ('f22e7e1b-cfa1-4514-bcd3-fce2e3773781', 'lesson', 'lesson', 'CIERRE DEL DOMINIO 7 ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Recuerda:\n•\tLos sustantivos, verbos y adjetivos son la base de una oración.\n•\tLa puntuación organiza tus ideas y muestra tus emociones.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:50:54.676677+00:00', '2025-10-28T03:51:28.7254+00:00', '{}'::jsonb, 'CIERRE DEL DOMINIO 7 (voz IA)
🔊 “¡Excelente trabajo!
Hoy aprendiste a usar la gramática y la puntuación para escribir de forma clara y correcta.
🌟 Recuerda:
•	Los sustantivos, verbos y adjetivos son la base de una oración.
•	La puntuación organiza tus ideas y muestra tus emociones.
📖 ¡Cuando escribes bien, tus palabras tienen poder y significado!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('6cd3bc62-731b-4dc5-88e9-e05de7e9ab07', 'exercise', 'multiple_choice', 'Signos de interrogación y exclamación', NULL, '{"answers":[{"text":"¿Cómo te llamas? ","imageUrl":null,"isCorrect":true},{"text":"¡Cómo te llamas!","imageUrl":null,"isCorrect":false},{"text":"Cómo te llamas?","imageUrl":null,"isCorrect":false}],"question":"Como te llamas\n¿Cuál es la forma correcta?\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:50:09.28491+00:00', '2025-10-28T03:50:09.28491+00:00', '{}'::jsonb, '(signos de interrogación y exclamación)
📖 Como te llamas
🔊 “¿Cuál es la forma correcta?”
Retroalimentación:
✅ “Muy bien. Las preguntas comienzan y terminan con signos de interrogación.”
❌ “Recuerda usar mayúscula inicial y ambos signos.”
', NULL, NULL, NULL, 3, 'c72d8d15-b063-4277-9746-0d1f079d98c9', NULL, NULL, 70),
  ('fca03b87-2038-4b45-921a-01595d3b1a65', 'exercise', 'true_false', 'Uso de la coma', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"Llevé el lápiz, el cuaderno y el borrador. \n\n¿Está bien usada la coma en esta oración?"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:47:21.525076+00:00', '2025-10-28T03:48:06.180202+00:00', '{}'::jsonb, 'Sí / No (uso de la coma)
📖 Llevé el lápiz, el cuaderno y el borrador. 
🔊 “¿Está bien usada la coma en esta oración?”
Retroalimentación:
✅ “Correcto. La coma separa elementos en una lista.”
❌ “Revisa: las comas dividen los objetos mencionados.”
', NULL, NULL, NULL, 3, 'c72d8d15-b063-4277-9746-0d1f079d98c9', NULL, NULL, 70),
  ('c72d8d15-b063-4277-9746-0d1f079d98c9', 'lesson', 'lesson', 'Parte 2: Puntuación (Nivel intermedio)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Usar correctamente signos de puntuación (punto, coma, signos de interrogación y exclamación) en oraciones y párrafos breves."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:44:51.331441+00:00', '2025-10-28T03:45:50.846595+00:00', '{}'::jsonb, 'Parte 2: Puntuación (Nivel intermedio)
🎯 Objetivo: Usar correctamente signos de puntuación (punto, coma, signos de interrogación y exclamación) en oraciones y párrafos breves.
Explicación breve IA
🔊 “Los signos de puntuación te ayudan a leer con ritmo y a expresar emociones.
•	El punto (.) indica que una idea termina.
•	La coma (,) separa ideas o elementos.
•	Los signos de interrogación (¿?) se usan para hacer preguntas.
•	Los signos de exclamación (¡!) muestran sorpresa o emoción.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('15593726-8eac-4300-92d2-8a97aeaa56a7', 'exercise', 'multiple_choice', 'identificar verbo', NULL, '{"answers":[{"text":"perro","imageUrl":null,"isCorrect":false},{"text":"ladra ","imageUrl":null,"isCorrect":true},{"text":"jardín","imageUrl":null,"isCorrect":false}],"question":" El perro grande ladra fuerte en el jardín.\n“¿Cuál es el verbo en la oración?”\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:43:03.45309+00:00', '2025-10-28T03:43:03.45309+00:00', '{}'::jsonb, 'identificar verbo)
📖 El perro grande ladra fuerte en el jardín.
🔊 “¿Cuál es el verbo en la oración?”
Retroalimentación:
✅ “Correcto. Ladra indica acción.”
❌ “Recuerda: el verbo dice lo que hace el sujeto.”
', NULL, NULL, NULL, 3, '71813328-6ab2-48fb-8c50-db5287528666', NULL, NULL, 70),
  ('71813328-6ab2-48fb-8c50-db5287528666', 'lesson', 'lesson', 'Parte 1: Gramática (Nivel básico)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Identificar y usar correctamente sustantivos, verbos y adjetivos en oraciones simples."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:40:07.94374+00:00', '2025-10-28T03:40:37.63285+00:00', '{}'::jsonb, 'Parte 1: Gramática (Nivel básico)
🎯 Objetivo: Identificar y usar correctamente sustantivos, verbos y adjetivos en oraciones simples.
Explicación breve IA
🔊 “Cada oración tiene un orden y una función:
•	Sustantivo: nombra (niña, libro, escuela).
•	Verbo: indica acción (corre, salta, piensa).
•	Adjetivo: describe (alegre, grande, azul).
📖 Ejemplo: La niña alegre corre en el parque.
– Niña es sustantivo, alegre es adjetivo, corre es verbo.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('9a3f544f-8fac-4e1d-b2b2-91ab41674ff8', 'lesson', 'lesson', 'DOMINIO 7: USO CORRECTO DE GRAMÁTICA Y PUNTUACIÓN', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo:\nFortalecer el dominio del idioma mediante el uso correcto de sustantivos, adjetivos, verbos, conectores y signos de puntuación para escribir oraciones claras y coherentes.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:38:33.354044+00:00', '2025-10-28T03:39:01.340695+00:00', '{}'::jsonb, 'DOMINIO 7: USO CORRECTO DE GRAMÁTICA Y PUNTUACIÓN
🎯 Objetivo:
Fortalecer el dominio del idioma mediante el uso correcto de sustantivos, adjetivos, verbos, conectores y signos de puntuación para escribir oraciones claras y coherentes.
📏 Estándares DEPR:
•	4.L.1.1 – Aplica las normas gramaticales en la escritura.
•	4.L.2.1 – Usa correctamente la puntuación y las mayúsculas.
•	4.W.2.1 – Redacta oraciones y párrafos con estructura lógica y coherencia.
🎙️ INTRODUCCIÓN IA (voz narradora)
🔊 “¡Hola, escritor o escritora!
Hoy aprenderás cómo la gramática y la puntuación ayudan a que tus ideas se entiendan mejor.
📖 Las reglas del lenguaje son como señales de tránsito:
•	Los sustantivos nombran personas, lugares o cosas.
•	Los verbos indican acciones.
•	Los adjetivos describen.
•	Y los signos de puntuación organizan tus pensamientos.
🧩 Cuando usas las palabras y los signos correctamente, tus oraciones fluyen con claridad y estilo.
¡Prepárate para escribir con precisión!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('d7d86d66-6f4b-4a78-a8e4-f1064bc30aec', 'lesson', 'lesson', 'CIERRE DEL DOMINIO 6 ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🌟 Recuerda:\n•\tEl lenguaje figurado transforma las palabras comunes en imágenes poderosas.\n•\tLas metáforas y comparaciones hacen que las ideas se entiendan mejor.\n•\tLa personificación da emoción a los textos.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:36:19.395805+00:00', '2025-10-28T03:36:49.51236+00:00', '{}'::jsonb, 'CIERRE DEL DOMINIO 6 (voz IA)
🔊 “¡Excelente trabajo, lector creativo!
Hoy aprendiste a reconocer cómo los escritores usan el lenguaje figurado y los recursos literarios para expresar sentimientos y dar vida a sus palabras.
🌟 Recuerda:
•	El lenguaje figurado transforma las palabras comunes en imágenes poderosas.
•	Las metáforas y comparaciones hacen que las ideas se entiendan mejor.
•	La personificación da emoción a los textos.
📖 ¡Leer con imaginación te ayuda a comprender y disfrutar más cada historia!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('b5c8eb55-b5d9-421b-b296-e3bcc90ac32a', 'exercise', 'drag_drop', 'Drag and Roll (identificación de recursos)', NULL, '{"mode":"match","question":"Arrastra el tipo de recurso al ejemplo correspondiente.","dropZones":[{"id":"zone-1761621963151","label":"Sus lágrimas eran cristales. "},{"id":"zone-1761621963757","label":"El reloj susurró la hora"},{"id":"zone-1761621964350","label":"Rápido como el viento. "}],"draggableItems":[{"id":"item-1761622018429","content":"Comparación ","correctZone":"zone-1761621964350"},{"id":"item-1761622033494","content":"Personificación             ","correctZone":"zone-1761621963757"},{"id":"item-1761622056983","content":"Metáfora ","correctZone":"zone-1761621963151"}],"allowMultiplePerZone":false}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:35:14.362182+00:00', '2025-10-28T03:35:14.362182+00:00', '{}'::jsonb, 'Drag and Roll (identificación de recursos)
🔊 “Arrastra el tipo de recurso al ejemplo correspondiente.”
Comparación 			Personificación             Metáfora 
Retroalimentación:
✅ “Excelente. Has identificado correctamente los recursos literarios.”
❌ “Vuelve a observar: las comparaciones usan como, las metáforas no.”
', NULL, NULL, NULL, 3, '111ca577-d54a-4317-8b0a-50ab757fc390', NULL, 'match', 70),
  ('19a68df1-2a06-47ef-90af-6766b36fc804', 'exercise', 'true_false', 'Sí / No - Poema breve', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"El mar baila con el viento,\nlas olas juegan sin parar,\nel sol pinta con destellos\nun espejo de cristal.\n\n“¿El poema permite imaginar colores y sonidos?”\n\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:31:12.251824+00:00', '2025-10-28T03:31:12.251824+00:00', '{}'::jsonb, 'Poema breve
📖 El mar baila con el viento,
las olas juegan sin parar,
el sol pinta con destellos
un espejo de cristal.

“¿El poema permite imaginar colores y sonidos?”
Retroalimentación:
✅ “Exacto. Describe destellos, olas y viento: imágenes visuales y auditivas.”
❌ “Relee: menciona luz, mar y sonido.”
', NULL, NULL, NULL, 3, '111ca577-d54a-4317-8b0a-50ab757fc390', NULL, NULL, 70),
  ('111ca577-d54a-4317-8b0a-50ab757fc390', 'lesson', 'lesson', 'Parte 2: Recursos literarios (Nivel intermedio)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Analizar cómo los recursos literarios enriquecen el significado y la emoción en un texto."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:28:32.031094+00:00', '2025-10-28T03:28:48.404858+00:00', '{}'::jsonb, 'Parte 2: Recursos literarios (Nivel intermedio)
🎯 Objetivo: Analizar cómo los recursos literarios enriquecen el significado y la emoción en un texto.
Explicación breve IA
🔊 “Los recursos literarios son herramientas que los escritores usan para hacer su lenguaje más bello y expresivo.
Incluyen el ritmo, las repeticiones, las exclamaciones y las imágenes sensoriales que ayudan a imaginar sonidos, colores o sentimientos.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('ad08ce0b-2064-4c20-8ba2-8b0c896ba166', 'exercise', 'multiple_choice', 'comparación', NULL, '{"answers":[{"text":"El sol calienta la playa.","imageUrl":null,"isCorrect":false},{"text":"Tu sonrisa es como un rayo de luz. ","imageUrl":null,"isCorrect":true},{"text":"La luna duerme tranquila.","imageUrl":null,"isCorrect":false}],"question":"¿Cuál oración contiene una comparación?"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:27:26.550455+00:00', '2025-10-28T03:27:26.550455+00:00', '{}'::jsonb, '(comparación)
🔊 “¿Cuál oración contiene una comparación?”

Retroalimentación:
✅ “Excelente. La palabra como indica una comparación.”
❌ “Revisa: las comparaciones usan como o parece.”
', NULL, NULL, NULL, 3, '7295dce0-a35d-42e4-8d44-bf19c638582a', NULL, NULL, 70),
  ('7295dce0-a35d-42e4-8d44-bf19c638582a', 'lesson', 'lesson', 'Parte 1: Lenguaje figurado (Nivel básico)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Reconocer comparaciones, metáforas y personificaciones en oraciones y textos breves."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:25:29.783281+00:00', '2025-10-28T03:25:29.783281+00:00', '{}'::jsonb, 'Parte 1: Lenguaje figurado (Nivel básico)
🎯 Objetivo: Reconocer comparaciones, metáforas y personificaciones en oraciones y textos breves.
Explicación breve IA
🔊 “El lenguaje figurado usa palabras con un significado especial.
✳️ Comparación o símil: usa como o parece.
Ejemplo: Sus ojos brillan como estrellas.
✳️ Metáfora: compara sin usar como.
Ejemplo: Sus ojos son estrellas.
✳️ Personificación: da cualidades humanas a objetos o animales.
Ejemplo: El viento cantaba entre los árboles.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('47bbdf9f-5ff5-48b9-af78-e5dc74e3e0f1', 'lesson', 'lesson', 'DOMINIO 6: LENGUAJE FIGURADO Y RECURSOS LITERARIOS', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo:\nIdentificar y usar expresiones de lenguaje figurado (comparaciones, metáforas, personificaciones, hipérboles) y reconocer cómo los recursos literarios hacen que los textos sean más expresivos y visuales.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:23:01.466411+00:00', '2025-10-28T03:23:18.986401+00:00', '{}'::jsonb, 'DOMINIO 6: LENGUAJE FIGURADO Y RECURSOS LITERARIOS
🎯 Objetivo:
Identificar y usar expresiones de lenguaje figurado (comparaciones, metáforas, personificaciones, hipérboles) y reconocer cómo los recursos literarios hacen que los textos sean más expresivos y visuales.
📏 Estándares DEPR:
•	4.R.6.1 – Reconoce el uso del lenguaje figurado en textos literarios.
•	4.R.7.1 – Analiza cómo los recursos literarios enriquecen el significado del texto.
•	4.L.1.2 – Usa palabras y frases figuradas para expresar ideas con creatividad.
🎙️ INTRODUCCIÓN IA (voz narradora)
🔊 “¡Hola, lector creativo!
Hoy descubrirás cómo los escritores juegan con las palabras para hacer que los textos suenen más interesantes y llenos de imaginación.
A veces, las palabras no significan exactamente lo que dicen: comparan, exageran o hacen hablar a los objetos.
Eso se llama lenguaje figurado, y aprenderlo te ayudará a leer con más emoción y a escribir con más estilo.
📖 ¡Vamos a darle vida a las palabras!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('64428f9d-bfca-4d0e-adc6-e91816b6b07d', 'lesson', 'lesson', 'Cierre del Dominio 5 ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Recuerda:\n•\tEl inicio, desarrollo y cierre dan forma a la información.\n•\tLas transiciones conectan ideas.\n•\tEl propósito del autor te ayuda a entender por qué se escribió el texto.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:21:32.888673+00:00', '2025-10-28T03:21:54.547611+00:00', '{}'::jsonb, 'Cierre del Dominio 5 (voz IA)
🔊 “¡Excelente trabajo!
Hoy aprendiste a reconocer cómo se organizan los textos y a analizar su estructura.
🌟 Recuerda:
•	El inicio, desarrollo y cierre dan forma a la información.
•	Las transiciones conectan ideas.
•	El propósito del autor te ayuda a entender por qué se escribió el texto.
📖 ¡Cada texto tiene una estructura que te guía a comprender mejor su mensaje!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('57effb17-1d47-4be0-af17-38708410a65d', 'exercise', 'drag_drop', 'Drag and Roll', NULL, '{"mode":"match","question":"","dropZones":[{"id":"zone-1761621005429","label":"descriptivo"},{"id":"zone-1761621006499","label":"narrativo"},{"id":"zone-1761621007992","label":"informativo"}],"draggableItems":[{"id":"item-1761621075703","content":"Los planetas giran alrededor del Sol ","correctZone":"zone-1761621007992"},{"id":"item-1761621101443","content":"Daniel estaba nervioso antes de hablar ","correctZone":"zone-1761621006499"},{"id":"item-1761621124801","content":"El bosque parecía un mar verde ","correctZone":"zone-1761621005429"}],"allowMultiplePerZone":false}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:20:30.098256+00:00', '2025-10-28T03:20:30.098256+00:00', '{}'::jsonb, '“Arrastra cada frase al tipo de texto que representa.”
Descriptivo   ,             Narrativo   ,        Informativo 
Retroalimentación:
✅ “Excelente. Has identificado correctamente los tipos de texto.”
❌ “Observa si el texto informa, narra o describe.”

', NULL, NULL, NULL, 3, '20c6be0b-3ebb-4197-945a-9cac0e9d501a', NULL, 'match', 70),
  ('113d94b4-aee4-4967-a577-4c8c478c6fde', 'exercise', 'true_false', 'Sí / No - Texto expositivo (Estudios Sociales)', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"Los puertorriqueños celebran muchas tradiciones. En diciembre se cantan aguinaldos y se hacen parrandas. En enero, las familias se reúnen para el Día de Reyes. Estas celebraciones fortalecen la unión y la alegría del pueblo.\n“¿El texto menciona celebraciones en diferentes meses?”\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:16:12.826967+00:00', '2025-10-28T03:16:12.826967+00:00', '{}'::jsonb, 'Texto expositivo (Estudios Sociales)
📖 Los puertorriqueños celebran muchas tradiciones. En diciembre se cantan aguinaldos y se hacen parrandas. En enero, las familias se reúnen para el Día de Reyes. Estas celebraciones fortalecen la unión y la alegría del pueblo.
“¿El texto menciona celebraciones en diferentes meses?”

Retroalimentación:
✅ “Muy bien. Menciona diciembre y enero.”
❌ “Escucha otra vez: habla de aguinaldos y del Día de Reyes.”
', NULL, NULL, NULL, 3, '20c6be0b-3ebb-4197-945a-9cac0e9d501a', NULL, NULL, 70),
  ('20c6be0b-3ebb-4197-945a-9cac0e9d501a', 'lesson', 'lesson', 'Parte 2: Análisis del texto (Nivel intermedio)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Analizar la función de los párrafos, las transiciones y el propósito del autor."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:13:10.932825+00:00', '2025-10-28T03:13:10.932825+00:00', '{}'::jsonb, 'Parte 2: Análisis del texto (Nivel intermedio)
🎯 Objetivo: Analizar la función de los párrafos, las transiciones y el propósito del autor.
Explicación breve IA
🔊 “Analizar un texto significa mirar cómo está organizado:
•	Los párrafos agrupan ideas relacionadas.
•	Las transiciones (primero, después, por eso, finalmente) conectan las ideas.
•	El propósito del autor puede ser informar, entretener o convencer.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('b4ad278b-babc-42fa-a559-c4737d380d1b', 'exercise', 'multiple_choice', 'Selección Multiple - Texto narrativo (Socioemocional)', NULL, '{"answers":[{"text":"Daniel estaba nervioso.","imageUrl":null,"isCorrect":false},{"text":"Empezó su presentación.","imageUrl":null,"isCorrect":false},{"text":"Todos aplaudieron y él sonrió. ","imageUrl":null,"isCorrect":true}],"question":"Daniel estaba nervioso antes de hablar en público. Respiró profundo, miró a sus compañeros y empezó su presentación. Al final, todos aplaudieron y él sonrió orgulloso.\n“¿Qué parte del texto muestra el final de la historia?”\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:11:04.091387+00:00', '2025-10-28T03:11:43.974065+00:00', '{}'::jsonb, 'Texto narrativo (Socioemocional)
📖 Daniel estaba nervioso antes de hablar en público. Respiró profundo, miró a sus compañeros y empezó su presentación. Al final, todos aplaudieron y él sonrió orgulloso.
🔊 “¿Qué parte del texto muestra el final de la historia?”

Retroalimentación:
✅ “Muy bien. El cierre muestra cómo termina la acción.”
❌ “Relee: el final siempre indica cómo acaba la situación.”
', NULL, NULL, NULL, 3, 'c0452435-e258-4f49-9780-872e0f3a5851', NULL, NULL, 70),
  ('c0452435-e258-4f49-9780-872e0f3a5851', 'lesson', 'lesson', 'Parte 1: Estructura del texto (Nivel básico)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Identificar las partes principales de un texto narrativo o informativo."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:07:52.809265+00:00', '2025-10-28T03:11:26.997749+00:00', '{}'::jsonb, 'Parte 1: Estructura del texto (Nivel básico)
🎯 Objetivo: Identificar las partes principales de un texto narrativo o informativo.
Explicación breve IA
🔊 “Todo texto tiene tres partes principales:
🟢 Inicio o introducción: presenta el tema o a los personajes.
🟡 Desarrollo: explica o cuenta los hechos principales.
🔵 Cierre o conclusión: termina la historia o resume las ideas.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('bafbdd2e-0d0a-46dc-b82a-3f814fb80627', 'lesson', 'lesson', 'DOMINIO 5: ESTRUCTURA Y ANÁLISIS DEL TEXTO', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo:\nReconocer la estructura de diferentes tipos de textos (narrativo, informativo, descriptivo y expositivo) e identificar cómo los elementos del texto —título, párrafos, introducción, desarrollo y cierre— ayudan a organizar y comprender la información.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:02:15.084186+00:00', '2025-10-28T03:12:00.705447+00:00', '{}'::jsonb, 'DOMINIO 5: ESTRUCTURA Y ANÁLISIS DEL TEXTO
🎯 Objetivo:
Reconocer la estructura de diferentes tipos de textos (narrativo, informativo, descriptivo y expositivo) e identificar cómo los elementos del texto —título, párrafos, introducción, desarrollo y cierre— ayudan a organizar y comprender la información.
📏 Estándares DEPR:
•	4.R.5.1 – Reconoce la estructura del texto y su organización.
•	4.R.6.1 – Determina el propósito del autor.
•	4.R.7.1 – Analiza cómo los detalles y la organización contribuyen al significado general.
🎙️ INTRODUCCIÓN IA (voz narradora)
🔊 “¡Hola, lector o lectora!
Hoy aprenderás a mirar los textos como un arquitecto observa una construcción.
Cada texto tiene una estructura: partes que lo sostienen y lo hacen más fácil de entender.
📘 En este dominio descubrirás cómo los escritores organizan sus ideas y cómo tú puedes analizar lo que lees para comprenderlo mejor.
Presta atención al título, los párrafos y las palabras que conectan ideas.
¡Comencemos a construir el sentido de los textos!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('58c0af8c-e201-49af-8440-f00fd48d4ccd', 'lesson', 'lesson', 'Cierre del Dominio 4 ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Recuerda:\n•\tLa comprensión literal busca hechos claros.\n•\tLa comprensión inferencial descubre emociones y razones.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T03:00:52.900576+00:00', '2025-10-28T03:00:52.900576+00:00', '{}'::jsonb, 'Cierre del Dominio 4 (voz IA)
🔊 “¡Gran trabajo!
Hoy aprendiste a comprender lo que el texto dice y lo que quiere decir entre líneas.
🌟 Recuerda:
•	La comprensión literal busca hechos claros.
•	La comprensión inferencial descubre emociones y razones.
📖 ¡Cada texto es una aventura para tu imaginación y tu razonamiento!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('2913cf12-24d3-4f2c-b9a8-94c2e6b075fa', 'exercise', 'multiple_choice', 'Selección Multiple - Estudios sociales', NULL, '{"answers":[{"text":"Para decorar ","imageUrl":null,"isCorrect":false},{"text":"Porque hubo una tormenta ","imageUrl":null,"isCorrect":true},{"text":"Porque era su trabajo.","imageUrl":null,"isCorrect":false}],"question":"En el pueblo de San Germán, los vecinos plantaron árboles después de una tormenta. Querían que el lugar volviera a verse verde y bonito.\n“¿Por qué plantaron árboles los vecinos?”"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:52:43.236535+00:00', '2025-10-28T02:52:43.236535+00:00', '{}'::jsonb, 'Estudios sociales:
📖 En el pueblo de San Germán, los vecinos plantaron árboles después de una tormenta. Querían que el lugar volviera a verse verde y bonito.
“¿Por qué plantaron árboles los vecinos?”
Retroalimentación:
✅ “Exacto. Buscaban recuperar la belleza del pueblo.”
❌ “Relee: dice que plantaron árboles después de una tormenta.”
', NULL, NULL, NULL, 3, 'ca4ae31f-3205-4c5d-8b09-c0219cb3c0ab', NULL, NULL, 70),
  ('a582bf5e-ceda-44ee-835d-edbce67f38ac', 'exercise', 'multiple_choice', 'Seleccion multiple-Narrativa', NULL, '{"answers":[{"text":"Contento","imageUrl":null,"isCorrect":false},{"text":"Triste ","imageUrl":null,"isCorrect":true},{"text":"Enojado","imageUrl":null,"isCorrect":false}],"question":"Luis miró por la ventana y vio la lluvia caer. Su balón estaba afuera. Suspiró y cerró las cortinas.\n“¿Cómo se siente Luis?”"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:49:17.572084+00:00', '2025-10-28T02:49:51.078848+00:00', '{}'::jsonb, 'Narrativa:
📖 Luis miró por la ventana y vio la lluvia caer. Su balón estaba afuera. Suspiró y cerró las cortinas.
“¿Cómo se siente Luis?”
Retroalimentación:
✅ “Muy bien. Su suspiro muestra tristeza.”
❌ “Piensa: ¿por qué cerró las cortinas?”

', NULL, NULL, NULL, 3, 'ca4ae31f-3205-4c5d-8b09-c0219cb3c0ab', NULL, NULL, 70),
  ('ca4ae31f-3205-4c5d-8b09-c0219cb3c0ab', 'lesson', 'lesson', 'Parte 2: Comprensión inferencial (nivel intermedio)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Deducir causas, consecuencias y emociones no explícitas."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:47:00.158829+00:00', '2025-10-28T02:49:35.923229+00:00', '{}'::jsonb, 'Parte 2: Comprensión inferencial (nivel intermedio)
🎯 Objetivo: Deducir causas, consecuencias y emociones no explícitas.
🔊 “La comprensión inferencial significa leer más allá de las palabras.
No todo lo que el autor quiere decir está escrito directamente en el texto.
A veces debes deducir o inferir lo que ocurre, lo que un personaje siente o lo que el autor piensa.
Para hacerlo, combina lo que lees con lo que ya sabes.
📖 Ejemplo: Si el texto dice ‘María miró al suelo y sus ojos se llenaron de lágrimas’, el autor no dice que está triste, pero tú lo puedes inferir.
🧩 Leer con inferencia es como resolver un misterio: usas pistas del texto y tus conocimientos para descubrir lo que no se dice.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('1d9933b1-80e5-47ff-96a3-a6ee4819606c', 'exercise', 'true_false', 'Sí/No-Lectura 1 – Socioemocional:', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":false},{"text":"Falso","imageUrl":null,"isCorrect":true}],"question":"Sara ayudó a su compañero a recoger los libros que se cayeron. La maestra sonrió y le dio las gracias por su amabilidad.\n“¿La maestra se enojó con Sara?”\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:45:20.981611+00:00', '2025-10-28T02:53:34.707094+00:00', '{}'::jsonb, 'Lectura 1 – Socioemocional:
📖 Sara ayudó a su compañero a recoger los libros que se cayeron. La maestra sonrió y le dio las gracias por su amabilidad.

🔊 “¿La maestra se enojó con Sara?”

Retroalimentación:
✅ “Muy bien. La maestra se sintió contenta.”
❌ “El texto dice que la maestra sonrió.”
', NULL, NULL, NULL, 3, 'c611e483-d6e6-40bc-afb4-4342ce3b4609', NULL, NULL, 70),
  ('c611e483-d6e6-40bc-afb4-4342ce3b4609', 'lesson', 'lesson', 'Parte 1: Comprensión literal (nivel básico)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Localizar información explícita en textos breves."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:42:49.969641+00:00', '2025-10-28T02:53:11.935193+00:00', '{}'::jsonb, 'Parte 1: Comprensión literal (nivel básico)
🎯 Objetivo: Localizar información explícita en textos breves.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('c1db22aa-d268-4aec-b491-8abdb0a234b0', 'lesson', 'lesson', 'DOMINIO 4: Comprensión lectora literal e inferencial', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo:\nDesarrollar la capacidad para identificar información explícita (comprensión literal) y deducir ideas o sentimientos implícitos (comprensión inferencial) en textos narrativos, informativos y socioemocionales.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:39:14.217789+00:00', '2025-10-28T02:39:14.217789+00:00', '{}'::jsonb, 'DOMINIO 4: Comprensión lectora literal e inferencial
🎯 Objetivo:
Desarrollar la capacidad para identificar información explícita (comprensión literal) y deducir ideas o sentimientos implícitos (comprensión inferencial) en textos narrativos, informativos y socioemocionales.
📏 Estándares:
•	4.R.3.1 – Identifica ideas principales y detalles de apoyo en textos literarios e informativos.
•	4.R.4.1 – Hace inferencias y deduce significados basados en evidencias del texto.
•	4.R.5.1 – Usa evidencia textual para justificar respuestas y conclusiones.
🎙️ Introducción IA (voz narradora)
🔊 “¡Hola!
Hoy aprenderás a entender lo que el texto dice y lo que sugiere.
📖 La comprensión literal busca datos que están directamente en el texto: quién, dónde, cuándo, qué pasó.
🧠 La comprensión inferencial te invita a pensar más allá: ¿por qué pasó?, ¿cómo se siente el personaje?, ¿qué quiere enseñarnos el autor?
Escucha con atención, lee con calma y usa tus pistas para descubrir significados ocultos.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('144984bd-2e78-4320-9d53-ed628ec76113', 'lesson', 'lesson', 'Cierre del Dominio 3', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Recuerda \nPara descubrir el significado de una palabra nueva:\n1.\tMira sus partes (prefijo, raíz, sufijo).\n2.\tObserva las palabras que la rodean.\n3.\tUsa ambas pistas para entender su sentido.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:35:42.561718+00:00', '2025-10-28T02:39:31.50502+00:00', '{}'::jsonb, 'Cierre del Dominio 3
Reflexión IA:
🔊 “Hoy aprendiste que las palabras pueden crecer, cambiar y tener poder.
Cada prefijo y sufijo es como una semilla que transforma el significado.
Cuando lees o escribes, usa esas semillas para que tus palabras florezcan.”
Recuerda 
🔊 “Para descubrir el significado de una palabra nueva:
1.	Mira sus partes (prefijo, raíz, sufijo).
2.	Observa las palabras que la rodean.
3.	Usa ambas pistas para entender su sentido.
¡Así amplías tu vocabulario como un lector experto!”

', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('1846280c-c156-445f-aa4a-6f6860428db9', 'exercise', 'multiple_choice', 'LECTURA APLICADA: “La palabra mágica”', NULL, '{"answers":[{"text":"Hace que todo sea armonioso ","imageUrl":null,"isCorrect":true},{"text":"Hace que la gente se calle","imageUrl":null,"isCorrect":false},{"text":"No cambia nada","imageUrl":null,"isCorrect":false}],"question":"En la escuela, Sofía aprendió que las palabras pueden cambiar su forma y su fuerza.\nCuando dice gracias y por favor, su voz se llena de respeto y amabilidad.\nLa maestra explicó que esas palabras son poderosas, porque transforman el ambiente en uno armonioso.\nSofía comprendió que, al añadir amabilidad a sus palabras, su día se vuelve maravilloso.”\n¿Qué efecto tiene la amabilidad según el texto?"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:33:24.470724+00:00', '2025-10-28T02:33:24.470724+00:00', '{}'::jsonb, 'LECTURA APLICADA: “La palabra mágica”
Propósito: Aplicar el vocabulario aprendido en un texto con contenido académico y socioemocional.
Duración: 1-2 párrafos breves, con lectura guiada por IA.
Texto IA (Lectura guiada y con voz):
🔊 “En la escuela, Sofía aprendió que las palabras pueden cambiar su forma y su fuerza.
Cuando dice gracias y por favor, su voz se llena de respeto y amabilidad.
La maestra explicó que esas palabras son poderosas, porque transforman el ambiente en uno armonioso.
Sofía comprendió que, al añadir amabilidad a sus palabras, su día se vuelve maravilloso.”
¿Qué aprendió Sofía sobre las palabras?
¿Qué efecto tiene la amabilidad según el texto?
retroalimenta: 
Excelente. Entendiste la definición de amabilidad.
', NULL, NULL, NULL, 3, '2c566aa6-807a-40c1-b6e2-72a038c39844', NULL, NULL, 70),
  ('0cc78452-75da-49f2-a4d9-50087122e5f4', 'exercise', 'multiple_choice', 'Usa las pistas del contexto', NULL, '{"answers":[{"text":"Lo leyó una sola vez.","imageUrl":null,"isCorrect":false},{"text":"Lo leyó más de una vez. ","imageUrl":null,"isCorrect":true},{"text":"No lo leyó.","imageUrl":null,"isCorrect":false}],"question":"La niña releyó el cuento para entenderlo mejor."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:27:39.667104+00:00', '2025-10-28T02:27:39.667104+00:00', '{}'::jsonb, 'Usa las pistas del contexto
🔊 “Lee la oración y selecciona el significado correcto de la palabra subrayada.”
📖 “La niña releyó el cuento para entenderlo mejor.”

retroalimenta:
“Excelente. El prefijo re- significa hacer otra vez.
👉 Releer es leer más de una vez.”
', NULL, NULL, NULL, 3, '2c566aa6-807a-40c1-b6e2-72a038c39844', NULL, NULL, 70),
  ('bc02a18e-f98e-4845-a737-d032b342a071', 'exercise', 'multiple_choice', 'Reconoce el prefijo', NULL, '{"answers":[{"text":"Hacer otra vez","imageUrl":null,"isCorrect":false},{"text":"Quitar lo hecho ","imageUrl":null,"isCorrect":true},{"text":"Hacer bien","imageUrl":null,"isCorrect":false}],"question":"Deshacer"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:23:51.921698+00:00', '2025-10-28T02:23:51.921698+00:00', '{}'::jsonb, 'Reconoce el prefijo
🔊 “Escucha la palabra y elige su significado correcto.”
1️⃣ Deshacer
retroalimenta:
“Muy bien. El prefijo des- significa quitar o revertir una acción.”
', NULL, NULL, NULL, 3, '2c566aa6-807a-40c1-b6e2-72a038c39844', NULL, NULL, 70),
  ('2c566aa6-807a-40c1-b6e2-72a038c39844', 'lesson', 'lesson', 'DOMINIO 3: VOCABULARIO Y MORFOLOGÍA', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo general:\nAmpliar el vocabulario mediante el reconocimiento y uso de prefijos, sufijos y raíces, deduciendo el significado de nuevas palabras según su contexto.\nDesarrollar la capacidad de inferir significado, clasificar palabras por su estructura, y aplicarlas en lectura y escritura con sentido.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:18:51.021917+00:00', '2025-10-28T02:19:24.517255+00:00', '{}'::jsonb, '🧠 DOMINIO 3: VOCABULARIO Y MORFOLOGÍA
🎯 Objetivo general:
Ampliar el vocabulario mediante el reconocimiento y uso de prefijos, sufijos y raíces, deduciendo el significado de nuevas palabras según su contexto.
Desarrollar la capacidad de inferir significado, clasificar palabras por su estructura, y aplicarlas en lectura y escritura con sentido.
🌟 Introducción IA
🔊 “Las palabras cambian cuando les añadimos partes al principio o al final.
Esas partes se llaman prefijos y sufijos.
Los prefijos cambian el significado de la palabra.
Los sufijos cambian el tipo de palabra, como si convirtieras una palabra en otra nueva.
Aprenderlos te ayudará a entender más rápido lo que lees y a escribir mejor.”.

Ejemplo narrado IA:
🔊 “Mira la palabra feliz.
Si le añadimos el prefijo in-, cambia su significado:
👉 in + feliz = infeliz, que significa no feliz.
¡Así, una palabra cambia por completo solo con unas letras al principio!”

IA explica con ejemplos sonoros 
🔊 “Escucha cómo cambian las palabras:
• Releer → leer otra vez.
• Desordenar → quitar el orden.
• Felizmente → con felicidad.
• Cansado → cansancio (cuando cambias -ado por -ancio, pasas de adjetivo a sustantivo).
Las palabras son como piezas de un rompecabezas: cada parte le da un nuevo significado.”


INCLUIR EN MATERIAL ADICIONAL 
Ejemplos prefijos
Prefijo	Significado
pre-	antes
re-	otra vez 
in-	no/sin
sub-	bajo/ debajo
bi-, bis, biz	dos, doble, dos veces
	

Ejemplos sufijos 
Sufijo 	Significado
ito/ita	tamaño pequeño o cariño.
-ón / -ona	tamaño grande o intensidad
-ero / -era	persona que realiza una labor
-dor / -dora	persona que ejecuta la acción del verbo
-ista	persona que practica una actividad o profesión
-ción / -sión	acción o efecto del verbo
-oso / -osa	muestra una cualidad
-eza	cualidad o estado emocional
-ario / -aria	profesión, oficio, lugar, conjunto, o que algo es relativo o perteneciente a la base de la palabra.
-dad, -tad	sustantivos abstractos o de cualidad

🔊 “Cuando veas una palabra nueva, busca si tiene una parte que reconoces al principio o al final.
Si la tiene, puedes adivinar su significado sin usar el diccionario.
¡Esa es una estrategia de lector experto!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('b6bc0ae2-b372-4ad1-8587-7eefd3617d8e', 'lesson', 'lesson', 'CIERRE DEL DOMINIO 2 ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Recuerda:\n•\tLee despacio, pero con confianza.\n•\tUsa tu voz para expresar emociones.\n•\tVuelve a escuchar los textos para mejorar tu ritmo.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:17:32.711224+00:00', '2025-10-28T02:19:39.239047+00:00', '{}'::jsonb, '🌈 CIERRE DEL DOMINIO 2 (voz IA)
🔊 “¡Muy buen trabajo!
Hoy practicaste la fluidez lectora: leer con ritmo, precisión y comprensión.
🌟 Recuerda:
•	Lee despacio, pero con confianza.
•	Usa tu voz para expresar emociones.
•	Vuelve a escuchar los textos para mejorar tu ritmo.
📖 Cada lectura que haces te acerca a ser un lector o lectora más seguro y expresivo.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('db283513-e938-47ea-87a0-b43eb6405247', 'exercise', 'multiple_choice', 'comprensión inferencial', NULL, '{"answers":[{"text":"Egoísmo","imageUrl":null,"isCorrect":false},{"text":"Solidaridad ","imageUrl":null,"isCorrect":true},{"text":"Orgullo","imageUrl":null,"isCorrect":false}],"question":"Título: Un héroe del pueblo\nJosé Celso Barbosa trabajó por la justicia y la igualdad en Puerto Rico.\nCreía que todos merecían las mismas oportunidades y dedicó su vida al servicio de los demás.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:16:31.590668+00:00', '2025-10-28T02:16:31.590668+00:00', '{}'::jsonb, 'Lectura (Estudios Sociales)
📖 Título: Un héroe del pueblo
José Celso Barbosa trabajó por la justicia y la igualdad en Puerto Rico.
Creía que todos merecían las mismas oportunidades y dedicó su vida al servicio de los demás.
🔊 “¿Qué valor demuestra la vida de Barbosa?”

Retroalimentación:
✅ “Correcto. Barbosa mostró solidaridad y compromiso con su pueblo.”
❌ “Relee: trabajó por la justicia y la igualdad.”
', NULL, NULL, NULL, 3, 'ea15cc80-9732-4c31-a8dc-83cb3cf0330e', NULL, NULL, 70),
  ('56d197f6-e8ab-4da7-b0fc-1af8146e03a5', 'exercise', 'multiple_choice', 'comprensión literal', NULL, '{"answers":[{"text":"El frío","imageUrl":null,"isCorrect":false},{"text":"El viento ","imageUrl":null,"isCorrect":false},{"text":"El calor del sol ","imageUrl":null,"isCorrect":true}],"question":"Título: El viaje del agua 💧\nEl agua del mar se evapora por el calor del sol.\nLuego se convierte en nubes y, cuando se enfrían, caen gotas de lluvia.\nAsí comienza de nuevo el viaje del agua en la Tierra.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:13:51.626707+00:00', '2025-10-28T02:13:51.626707+00:00', '{}'::jsonb, 'Lectura (Ciencia)
📖 Título: El viaje del agua 💧
El agua del mar se evapora por el calor del sol.
Luego se convierte en nubes y, cuando se enfrían, caen gotas de lluvia.
Así comienza de nuevo el viaje del agua en la Tierra.
🔊 “¿Qué causa que el agua se evapore?”

Retroalimentación:
✅ “Correcto. El calor del sol produce la evaporación.”
❌ “Revisa la primera oración: menciona el calor del sol.”
', NULL, NULL, NULL, 3, 'ea15cc80-9732-4c31-a8dc-83cb3cf0330e', NULL, NULL, 70),
  ('ea15cc80-9732-4c31-a8dc-83cb3cf0330e', 'lesson', 'lesson', '🌻 Parte 2: Lectura autónoma (nivel intermedio)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Objetivo: Leer de manera independiente aplicando ritmo, entonación y comprensión."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:10:59.705428+00:00', '2025-10-28T02:11:22.630848+00:00', '{}'::jsonb, '🌻 Parte 2: Lectura autónoma (nivel intermedio)
🎯 Objetivo: Leer de manera independiente aplicando ritmo, entonación y comprensión.
Explicación breve IA
🔊 “Ahora leerás tú solo o sola.
Lee con voz clara y ritmo natural, como si contaras una historia a alguien.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('da0dedad-a670-466b-8d65-f5e566d404f3', 'exercise', 'multiple_choice', 'Entonación', NULL, '{"answers":[{"text":"Los árboles crecen lentamente.","imageUrl":null,"isCorrect":false},{"text":"¡Puedes lograr tus sueños! ","imageUrl":null,"isCorrect":true},{"text":"Los sueños toman tiempo.","imageUrl":null,"isCorrect":false}],"question":"¿Qué oración debe leerse con emoción?"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:04:34.817806+00:00', '2025-10-28T02:04:34.817806+00:00', '{}'::jsonb, '🔊 “Leer con emoción significa usar la voz, el ritmo y la entonación para dar vida a las palabras.
Cuando lees con emoción, muestras cómo se sienten los personajes, o la intención del autor.
No es leer rápido, sino leer con sentido y expresión:
Sube un poco la voz en los momentos importantes.
Haz pausas donde hay comas o puntos.
Cambia el tono si es una pregunta o una exclamación.
📖 Ejemplo:
¡Qué día tan hermoso! suena diferente a Qué día tan hermoso.
🎤 ¡Ahora te toca practicar! Lee con emoción y demuestra lo que el texto quiere transmitir.”
🔊 “¿Qué oración debe leerse con emoción?”
✅ “Muy bien. Las oraciones con signos de exclamación se leen con entusiasmo.”
❌ “Escucha otra vez: las exclamaciones expresan emoción.”
', NULL, NULL, NULL, 3, 'e4c21c69-7a01-4381-af90-916f023d5f95', NULL, NULL, 70),
  ('e4c21c69-7a01-4381-af90-916f023d5f95', 'lesson', 'lesson', '🌱 Parte 1: Lectura guiada (nivel básico)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Modelar la fluidez lectora con apoyo de la voz IA."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T02:00:11.860145+00:00', '2025-10-28T02:04:52.641074+00:00', '{}'::jsonb, '🌱 Parte 1: Lectura guiada (nivel básico)
🎯 Objetivo: Modelar la fluidez lectora con apoyo de la voz IA.
Explicación breve IA
🔊 “Escucha cómo lee la IA.
Fíjate en el ritmo, las pausas y la voz.
Luego repite tú, tratando de mantener el mismo tono y velocidad.”
Lectura breve (Socioemocional)
📖 Título: El valor de la paciencia
🔊 “A veces queremos que todo ocurra rápido, pero las cosas buenas toman tiempo.
Los árboles crecen lentamente, los sueños también.
Cuando esperas con paciencia, logras más de lo que imaginas.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('0fdcdefb-ffbe-40c6-9328-77f7acb7f226', 'lesson', 'lesson', 'DOMINIO 2: FLUIDEZ LECTORA GUIADA Y AUTÓNOMA', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"En este dominio aprenderás a leer con fluidez, es decir, con un ritmo natural, buena pronunciación y comprensión.\nLa fluidez tiene cuatro partes importantes:\n🕐 Ritmo: leer ni muy rápido ni muy lento.\n🎯 Precisión: decir las palabras correctamente.\n🎭 Entonación: usar la voz según el tipo de oración.\n🧠 Comprensión: entender lo que lees.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:56:51.894312+00:00', '2025-10-28T01:57:11.47434+00:00', '{}'::jsonb, '🎯 Objetivo general
Desarrollar la fluidez lectora combinando la lectura guiada (modelo IA) con la lectura autónoma del estudiante, fortaleciendo la precisión, la entonación, el ritmo y la comprensión global del texto.
🧾 Estándares DEPR relacionados:
•	4.RF.4.1 – Lee textos con precisión, ritmo y entonación apropiada para apoyar la comprensión.
•	4.R.3.2 – Aplica estrategias para comprender el significado de palabras y oraciones al leer.
•	4.SL.1.2 – Escucha y sigue instrucciones para mejorar la comprensión oral y lectora.







🎙️ INTRODUCCIÓN IA AL DOMINIO 2
🔊 “¡Hola, lector o lectora de cuarto grado!
En este dominio aprenderás a leer con fluidez, es decir, con un ritmo natural, buena pronunciación y comprensión.
La fluidez tiene cuatro partes importantes:
🕐 Ritmo: leer ni muy rápido ni muy lento.
🎯 Precisión: decir las palabras correctamente.
🎭 Entonación: usar la voz según el tipo de oración.
🧠 Comprensión: entender lo que lees.
Practicaremos juntos leyendo textos guiados, repitiendo con ritmo, y luego leerás por tu cuenta.
Usa 🔊 para escuchar, 📖 para leer y 🎤 para grabar tu lectura.
¡Vamos a leer con emoción y sentido!”
🎙️ Explicación IA (🔊 escuchar / 📖 leer / 🎤 grabar)
🎯 Objetivo y estándares DEPR
🧩 Ejercicios básicos e intermedios (multiple choice, sí/no, drag & roll)
💬 Retroalimentación inmediata programable
📚 Lecturas breves con contenido de ciencia, estudios sociales y socioemocional
🧠 Progresión “de no sé… a lo puedo hacer”

', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('8dbdb7b3-fda2-4238-8db9-684fc9f6de85', 'lesson', 'lesson', 'CIERRE DEL DOMINIO 1 ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Recuerda:\n•\tLas letras pueden sonar igual, pero tener significados distintos.\n•\tLa ortografía correcta muestra tu conocimiento y precisión.\n•\tLa práctica constante fortalece tu escritura y lectura.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:55:23.673522+00:00', '2025-10-28T01:57:26.394761+00:00', '{}'::jsonb, '🔊 “¡Excelente trabajo!
Hoy aprendiste que escribir bien comienza con escuchar y observar con atención.
🌟 Recuerda:
•	Las letras pueden sonar igual, pero tener significados distintos.
•	La ortografía correcta muestra tu conocimiento y precisión.
•	La práctica constante fortalece tu escritura y lectura.
📖 ¡Felicitaciones! Estás desarrollando una conciencia fonológica y ortográfica avanzada.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('a8a820c4-8aff-451a-b189-b2e1c9ad7bf5', 'exercise', 'true_false', 'Sí / No (ll/y)', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":false},{"text":"Falso","imageUrl":null,"isCorrect":true}],"question":"¿La palabra lluvia se escribe con y?"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:48:02.45718+00:00', '2025-10-28T01:48:02.45718+00:00', '{}'::jsonb, 'Sí / No (ll/y)
📖 ¿La palabra lluvia se escribe con y?
✅ No ❌ Sí
Retroalimentación:
✅ “Correcto. Lluvia se escribe con ll.”
❌ “Escucha el sonido: ll se usa en palabras como llave, lluvia, llegar.”
', NULL, NULL, NULL, 3, '2bc29d49-78a1-4aef-8ae9-3884d1668cea', NULL, NULL, 70),
  ('7b6bc996-fca8-4473-88bf-11b08d835cd7', 'exercise', 'multiple_choice', 'uso de “ll” / “y”', NULL, '{"answers":[{"text":"lluvia ","imageUrl":null,"isCorrect":true},{"text":"yuvia","imageUrl":null,"isCorrect":false},{"text":"lluviya","imageUrl":null,"isCorrect":false}],"question":"¿Cuál palabra está escrita correctamente?”"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:47:01.91553+00:00', '2025-10-28T01:47:01.91553+00:00', '{}'::jsonb, '“¿Cuál palabra está escrita correctamente?”
a) lluvia ✅ 
b) yuvia 
c) lluviya
Retroalimentación:
✅ “Excelente. Lluvia se escribe con ll al inicio.”
❌ “Recuerda: las palabras que comienzan con el sonido /ʝa/ o /ʝu/ suelen escribirse con ll.”
', NULL, NULL, NULL, 3, '2bc29d49-78a1-4aef-8ae9-3884d1668cea', NULL, NULL, 70),
  ('5d440b14-ccd7-4712-8dbb-4305224e86a1', 'exercise', 'multiple_choice', 'uso de g/j', NULL, '{"answers":[{"text":"jente","imageUrl":null,"isCorrect":false},{"text":"gente ","imageUrl":null,"isCorrect":true},{"text":"ginete","imageUrl":null,"isCorrect":false}],"question":"¿Cuál palabra se escribe correctamente?"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:44:23.267827+00:00', '2025-10-28T01:44:51.850786+00:00', '{}'::jsonb, '– Multiple Choice (uso de g/j)
🔊 “¿Cuál palabra se escribe correctamente?”

Retroalimentación:
✅ “Correcto. Gente lleva g antes de e.”
❌ “Recuerda: g se usa con e o i.”
', NULL, NULL, NULL, 3, '2bc29d49-78a1-4aef-8ae9-3884d1668cea', NULL, NULL, 70),
  ('2bc29d49-78a1-4aef-8ae9-3884d1668cea', 'lesson', 'lesson', '🌻 Parte 2: Ortografía avanzada (Nivel intermedio)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Aplicar reglas ortográficas en palabras y oraciones con dificultad."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:42:10.61228+00:00', '2025-10-28T01:42:30.230468+00:00', '{}'::jsonb, '🌻 Parte 2: Ortografía avanzada (Nivel intermedio)
🎯 Objetivo: Aplicar reglas ortográficas en palabras y oraciones con dificultad.
Explicación breve IA
🔊 “Las reglas ortográficas nos ayudan a escribir con precisión.
Practiquemos con ejemplos donde cambia el sentido según la letra.”
🔊 “Las letras g y j pueden sonar parecido, pero no siempre se usan igual.
🟢 La letra g se usa con las vocales a, o, u, como en gato, goma, gusano.
🔵 También se usa con e o i cuando va seguida de la letra u, como en guerra o guitarra.
🟣 La letra j se usa antes de a, o, u, como en jamón, joven, justo, y en muchas palabras terminadas en -aje y -eje, como viaje o coraje.
Escucha y observa los ejemplos para identificar la diferencia.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('cce54d2b-7000-4db8-a3d6-c4b390f350ea', 'exercise', 'multiple_choice', 'Errores ortográficos comunes', NULL, '{"answers":[{"text":"Hayer fui al parque.","imageUrl":null,"isCorrect":false},{"text":"Ayer fui al parque. ","imageUrl":null,"isCorrect":true},{"text":"Aier fui al parque.","imageUrl":null,"isCorrect":false}],"question":"Escoge la oración escrita correctamente:"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:41:06.372614+00:00', '2025-10-28T01:41:06.372614+00:00', '{}'::jsonb, 'Ejercicio 6 – Multiple Choice (errores ortográficos comunes)
📖 Escoge la oración escrita correctamente:

Retroalimentación:
✅ “¡Perfecto! Ayer no lleva h.”
❌ “Revisa: la h solo se usa en algunas palabras mudas como hoy o huevo.”
', NULL, NULL, NULL, 3, '81c5b4f8-62fc-4271-8d72-4231c0888db0', NULL, NULL, 70),
  ('0cf9dc02-720a-4f65-8c48-dbb87a679a59', 'exercise', 'multiple_choice', 'Selección multiple (uso de c/s/z)', NULL, '{"answers":[{"text":"rasón","imageUrl":null,"isCorrect":false},{"text":"razón ","imageUrl":null,"isCorrect":true},{"text":"racón","imageUrl":null,"isCorrect":false}],"question":"Escoge la palabra escrita correctamente:"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:37:18.339241+00:00', '2025-10-28T01:38:47.101179+00:00', '{}'::jsonb, '🔊 “Las letras c, s y z pueden sonar igual, pero se escriben de manera diferente según la palabra.
🟢 Usa c antes de e y i, como en cereal o cima.
🔵 Usa s en la mayoría de las palabras terminadas en -oso, -osa, -esa, -ista, -ísimo, como hermosa, pintor, artista.
🟣 Usa z en palabras terminadas en -azo, -eza, -ez, y en los sustantivos que vienen de adjetivos terminados en -z, como feliz → felicidad, cruz → cruces.
Escucha los ejemplos: cielo, sol, zapato. Ahora practica conmigo.”
✅ “Correcto. Razón lleva z porque termina en -zón.”
❌ “Revisa la regla: las palabras terminadas en -zón se escriben con z.”
', NULL, NULL, NULL, 3, '81c5b4f8-62fc-4271-8d72-4231c0888db0', NULL, NULL, 70),
  ('81c5b4f8-62fc-4271-8d72-4231c0888db0', 'lesson', 'lesson', '🌱 Parte 1: Reconocimiento auditivo y visual de sonidos (Nivel básico)', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Identificar sonidos parecidos y asociarlos con su grafía correcta."}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:33:22.708487+00:00', '2025-10-28T01:33:22.708487+00:00', '{}'::jsonb, '🌱 Parte 1: Reconocimiento auditivo y visual de sonidos (Nivel básico)
🎯 Objetivo: Identificar sonidos parecidos y asociarlos con su grafía correcta.
Explicación breve IA
🔊 “Algunas letras suenan igual, pero se escriben distinto.
Escucha con atención y elige la letra correcta.”
Ejemplo IA – “De no sé… a lo puedo hacer”
1️⃣ 🔊 Escucha: “boca” y “vaca”.
2️⃣ 📖 Observa las palabras escritas.
3️⃣ 🎤 Repite ambas pronunciaciones.
4️⃣ 🔊 IA: “Muy bien. Aunque suenan igual, vaca (animal) se escribe con v, y baca (de auto) con b.”
🔊 /b/ — los labios se juntan, como al decir ‘boca’.
🔊 /v/ — los dientes tocan el labio de abajo, como al decir ‘vida’.
Ahora repite conmigo:
🗣️ ‘boca’ — labios juntos.
🗣️ ‘vaca’ — dientes sobre el labio inferior.
🔊 Muy bien, ¡ya sabes cómo se pronuncian y escriben!”
🔊 Ahora practiquemos.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('c8482f78-3a99-4c4c-84b1-0851ad3b9d5e', 'exercise', 'true_false', 'Sí / No', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":false},{"text":"Falso","imageUrl":null,"isCorrect":true}],"question":"¿La palabra barco se escribe con v?"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:30:31.173812+00:00', '2025-10-28T01:38:02.747126+00:00', '{}'::jsonb, 'Retroalimentación:
✅ “Correcto. Barco se escribe con b.”
❌ “Escucha otra vez: el sonido /b/ de barco usa la letra b.”

no digas al estudiante la respuesta
', NULL, NULL, NULL, 3, '81c5b4f8-62fc-4271-8d72-4231c0888db0', NULL, NULL, 70),
  ('5944a83e-3c35-42ea-a28b-b4d3abda72e3', 'lesson', 'lesson', '🧩 DOMINIO 1: CONCIENCIA FONOLÓGICA Y ORTOGRÁFICA AVANZADA', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🎯 Objetivo general\nDesarrollar la conciencia fonológica y ortográfica avanzada mediante la identificación, segmentación y corrección de sonidos, sílabas y patrones ortográficos complejos (uso de b/v, g/j, ll/y, h, c/s/z).\n\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:27:50.481023+00:00', '2025-10-28T01:33:57.029332+00:00', '{}'::jsonb, '🎯 Objetivo general
Desarrollar la conciencia fonológica y ortográfica avanzada mediante la identificación, segmentación y corrección de sonidos, sílabas y patrones ortográficos complejos (uso de b/v, g/j, ll/y, h, c/s/z).
Estándares DEPR relacionados:
•	4.L.2.1 – Aplica las normas ortográficas y de acentuación.
•	4.RF.3.1 – Usa el conocimiento de la fonética y las convenciones ortográficas para leer y escribir con precisión.
•	4.L.1a – Escucha y analiza los sonidos del lenguaje para mejorar la pronunciación y escritura.
🎙️ INTRODUCCIÓN IA AL DOMINIO 1
🔊 “En este dominio vas a fortalecer tu oído y tu vista para identificar cómo suenan y cómo se escriben correctamente las palabras.
Escucharás sonidos parecidos, descubrirás letras que cambian el significado y practicarás con ejemplos hasta dominar las reglas.
¡Prepárate para convertirte en un detective de las letras!”

', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('a3599af7-168d-4e37-9fdf-3d5f8aff3f04', 'lesson', 'lesson', 'LENGUAJE Y LECTURA 4.º GRADO-ORIENTACIÓN GENERAL A LA PLATAFORMA', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Bienvenido a tu plataforma interactiva de lectura y lenguaje. Aquí aprenderás paso a paso con la ayuda de la inteligencia artificial, que te guiará, corregirá y animará mientras trabajas.\nEn este módulo trabajarás nueve dominios que te ayudarán a mejorar tu pronunciación, comprensión, vocabulario, escritura y expresión oral.\nEn cada actividad podrás:\n•\t🔊 Escuchar un ejemplo o explicación.\n•\t📖 Leer para practicar.\n•\t🎤 Grabar tus respuestas.\n•\t🧩 Interactuar con actividades como multiple choice, sí/no y drag & roll.\n"}'::jsonb, 4, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:20:19.227362+00:00', '2025-10-28T01:20:19.227362+00:00', '{}'::jsonb, '🎙️ Mensaje de bienvenida (voz IA)
🔊 “¡Hola, estudiante de cuarto grado!
Bienvenido a tu plataforma interactiva de lectura y lenguaje. Aquí aprenderás paso a paso con la ayuda de la inteligencia artificial, que te guiará, corregirá y animará mientras trabajas.
En este módulo trabajarás nueve dominios que te ayudarán a mejorar tu pronunciación, comprensión, vocabulario, escritura y expresión oral.
En cada actividad podrás:
•	🔊 Escuchar un ejemplo o explicación.
•	📖 Leer para practicar.
•	🎤 Grabar tus respuestas.
•	🧩 Interactuar con actividades como multiple choice, sí/no y drag & roll.
Recuerda: cada error es una oportunidad para aprender. ¡Vamos a comenzar juntos este viaje por las palabras!”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('7d020496-e4f8-4f95-94cd-29a5f7dc2f35', 'exercise', 'true_false', 'Read or listen and complete each activity. Lee o escucha y completa cada actividad. ', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"Which words rhyme?\n\nhall / ball "}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:11:49.233734+00:00', '2025-10-28T14:53:42.900366+00:00', '{}'::jsonb, 'All the instructions in english please ', NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('bbff4601-72ea-4122-b20a-9381da203268', 'exercise', 'multiple_choice', 'Read or listen and complete each activity. Lee y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"lamp","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761613185972-ChatGPT%20Image%20Oct%2027,%202025,%2008_59_33%20PM.png","isCorrect":true},{"text":"desk","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761613258626-ChatGPT%20Image%20Oct%2027,%202025,%2009_00_48%20PM.png","isCorrect":false},{"text":"chair","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761613335217-ChatGPT%20Image%20Oct%2027,%202025,%2009_02_08%20PM.png","isCorrect":false}],"question":"Which word begins with the same sound as lunchbox?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:09:04.877093+00:00', '2025-10-28T15:04:16.051425+00:00', '{}'::jsonb, 'Emphasized key words', NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('c1d9a0e9-7389-4ebb-933f-a5eda0f37ce5', 'exercise', 'multiple_choice', 'Read and complete each activity.', NULL, '{"answers":[{"text":"   Friends can help each other ","imageUrl":null,"isCorrect":true},{"text":"Always run in school","imageUrl":null,"isCorrect":false},{"text":"   Don’t eat lunch","imageUrl":null,"isCorrect":false}],"question":"What lesson does this story teach?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:03:48.03817+00:00', '2025-10-28T01:03:48.03817+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('7c1d3410-7021-4fd2-9394-a17893d32842', 'exercise', 'multiple_choice', 'Read and complete each activity. Lee y completa cada actividad.', NULL, '{"answers":[{"text":"Sad","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761612761762-ChatGPT%20Image%20Oct%2027,%202025,%2008_52_29%20PM.png","isCorrect":false},{"text":"Happy","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761612651050-ChatGPT%20Image%20Oct%2027,%202025,%2008_49_10%20PM.png","isCorrect":true},{"text":"Angry ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761612951731-ChatGPT%20Image%20Oct%2027,%202025,%2008_55_42%20PM.png","isCorrect":false}],"question":"How did Luis feel when he found his lunchbox?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T01:02:40.564361+00:00', '2025-10-28T14:53:08.361791+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('646c5640-4a9b-4861-a9b2-b0719dec90de', 'exercise', 'drag_drop', 'Read and complete each activity.', NULL, '{"mode":"match","question":"Put the events in order (Drag & Drop):","dropZones":[{"id":"zone-1761612081273","label":"1"},{"id":"zone-1761612208339","label":"2"},{"id":"zone-1761612216177","label":"3"},{"id":"zone-1761612218405","label":"4"}],"draggableItems":[{"id":"item-1761612240471","content":"Missing lunchbox ","correctZone":"zone-1761612081273"},{"id":"item-1761612253064","content":"Search","correctZone":"zone-1761612208339"},{"id":"item-1761612262612","content":"Cafeteria","correctZone":"zone-1761612216177"},{"id":"item-1761612273623","content":"Found","correctZone":"zone-1761612218405"}],"allowMultiplePerZone":false}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:51:33.458108+00:00', '2025-10-28T00:51:33.458108+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, 'match', 70),
  ('c4242b9c-4ff2-482e-9ef4-13a3727b5117', 'exercise', 'multiple_choice', 'Read and complete each activity. Lee y completa cada actividad.', NULL, '{"answers":[{"text":"red","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761662183702-ChatGPT%20Image%20Oct%2028,%202025,%2009_07_41%20AM.png","isCorrect":true},{"text":"green","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761662494496-ChatGPT%20Image%20Oct%2028,%202025,%2010_41_21%20AM.png","isCorrect":false},{"text":"yellow","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761662567803-ChatGPT%20Image%20Oct%2028,%202025,%2010_42_41%20AM.png","isCorrect":false}],"question":"The lunchbox was the color ________."}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:46:44.982997+00:00', '2025-10-28T14:52:02.421469+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('f736a867-7f1b-486e-a0d0-1d6c1f55ce91', 'exercise', 'fill_blank', 'Read and complete each activity.', NULL, '{"mode":"single_word","prompt":"Luis looked for his lunchbox in the ________.","target":"classroom","letters":["c","l","a","s","s","r","o","o","m","i","e","u"],"imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761611869854-ChatGPT%20Image%20Oct%2027,%202025,%2008_37_41%20PM.png","autoShuffle":true}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:45:19.548728+00:00', '2025-10-28T00:45:19.548728+00:00', '{}'::jsonb, 'read slowly and emphasize key word ', NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('c60789c3-8728-446a-bc0d-abd9c7bd1891', 'exercise', 'multiple_choice', 'Read and complete each activity. Lee y completa cada actividad.', NULL, '{"answers":[{"text":"   At home","imageUrl":null,"isCorrect":false},{"text":"   At school ","imageUrl":null,"isCorrect":true},{"text":"At the park","imageUrl":null,"isCorrect":false}],"question":"Where did the story happen?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761611688839-ChatGPT%20Image%20Oct%2027,%202025,%2008_34_38%20PM.png"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:41:38.451673+00:00', '2025-10-28T14:38:30.530311+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('5b1b2fe2-7552-4415-9486-f64d402a07c5', 'exercise', 'multiple_choice', 'Read and complete each activity. Lee y completa cada actividad.', NULL, '{"answers":[{"text":"Carla","imageUrl":null,"isCorrect":false},{"text":"  Luis ","imageUrl":null,"isCorrect":true},{"text":"Ms. Rosa","imageUrl":null,"isCorrect":false}],"question":"Who lost his lunchbox?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:38:10.771021+00:00', '2025-10-28T14:41:16.67568+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('3b9f1e80-c3b2-4343-8f23-fdfa91773971', 'exercise', 'multiple_choice', 'Listen carefully to the sentences and choose the correct answer. Escucha con atención las oraciones y selecciona la respuesta correcta.', NULL, '{"answers":[{"text":"book ","imageUrl":null,"isCorrect":true},{"text":"leg","imageUrl":null,"isCorrect":false},{"text":"hat","imageUrl":null,"isCorrect":false}],"question":"Which word rhymes with look?"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:37:10.638598+00:00', '2025-10-28T14:38:56.998856+00:00', '{}'::jsonb, 'Audio: “Listen to the word look.”', NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('1277e6da-9bec-403e-aaf3-21528d0722c1', 'exercise', 'multiple_choice', 'Listen carefully to the sentences and choose the correct answer.', NULL, '{"answers":[{"text":"His backpack ","imageUrl":null,"isCorrect":true},{"text":"His desk","imageUrl":null,"isCorrect":false},{"text":"His book","imageUrl":null,"isCorrect":false}],"question":"Question: What did Luis open?\n"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:34:26.359554+00:00', '2025-10-28T00:35:51.896481+00:00', '{}'::jsonb, '🔊 
Audio: 
Before read the questions, AI must says m“Luis opened his backpack and looked for his lunchbox.”', NULL, NULL, NULL, 3, '480adac3-434e-4076-bf22-cdfbb6b7edc1', NULL, NULL, 70),
  ('480adac3-434e-4076-bf22-cdfbb6b7edc1', 'lesson', 'lesson', '“The Missing Lunchbox” ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"This lesson is designed to provide structured language exposure that connects reading to students’ everyday experiences, bridging oral English understanding with written text interpretation. ","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761611055625-ChatGPT%20Image%20Oct%2027,%202025,%2008_24_04%20PM.png"}'::jsonb, 3, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:31:23.400895+00:00', '2025-10-28T00:31:23.400895+00:00', '{}'::jsonb, 'AI read the Story: The Missing Lunchbox
1. It was lunchtime at San Juan Elementary School. Luis opened his backpack, but his lunchbox was not there. “Oh no!” he said softly. His friend Carla looked at him with worry.

2. They searched the classroom. Carla looked under the tables. Luis checked the bookshelf. “Maybe you left it in the cafeteria,” said Carla. They walked together down the hall.

3. In the cafeteria, they asked the cook, Ms. Rosa. “Did you see a red lunchbox?” Luis asked. Ms. Rosa smiled and pointed to a shelf. “Is this yours?” she said kindly. Luis jumped with joy. “Yes! That’s mine!”

4. Luis thanked Ms. Rosa and opened the lunchbox. His sandwich and juice were still there. “You found it just in time!” said Carla, laughing. They sat together and shared cookies from the lunchbox.





', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('0519fcab-869b-48c5-a2cd-34e41e145f9e', 'exercise', 'drag_drop', 'Dictation Practice ', NULL, '{"mode":"letters","question":"Write the word. ","targetWord":"sea","autoShuffle":true,"availableLetters":["s","e","a","c"]}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:17:42.893387+00:00', '2025-10-28T00:18:10.131915+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '3ed3a797-e6b1-4144-a06a-f83e3400dc57', NULL, 'letters', 70),
  ('cae008c8-fc72-47f7-89d5-a4d310eeacdb', 'exercise', 'fill_blank', 'Dictation Practice ', NULL, '{"mode":"single_word","prompt":"Write the missing letter to complete each word. ","target":"sun","letters":["s","u","n","a"],"imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761610133583-ChatGPT%20Image%20Oct%2027,%202025,%2008_08_48%20PM.png","autoShuffle":true}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:15:44.964278+00:00', '2025-10-28T00:15:44.964278+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '3ed3a797-e6b1-4144-a06a-f83e3400dc57', NULL, NULL, 70),
  ('b79894b4-25b5-46ea-86ae-aa40540dc5b4', 'lesson', 'lesson', 'Listen and Repeat with Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Echo Reading Chant "}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:12:31.380976+00:00', '2025-10-28T00:13:24.532395+00:00', '{}'::jsonb, 'Speak with enthusiasm. Pause 2 seconds after each word. Celebrate each attempt.', 'coqui_escucha', 'SECTION 1: Hi! I''m Coquí. Today we''ll practice listening and repeating beautiful Puerto Rican words.
SECTION 2: Listen carefully. I''ll say a word and you repeat it after me.
SECTION 3: Perfect! Your voice sounds great. Let''s keep practicing.
SECTION 4: Great job! You''re doing awesome. You''re a Spanish champion.', '["beach","mango","palm","coqui","borinquen"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('3ed3a797-e6b1-4144-a06a-f83e3400dc57', 'lesson', 'lesson', 'REINFORCEMENT & FAMILY CONNECTION ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"REINFORCEMENT "}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:11:17.636068+00:00', '2025-10-28T00:11:17.636068+00:00', '{}'::jsonb, 'Instruction (EN): Let’s play and practice what we learned! 
Speak with enthusiasm. Pause 2 seconds after each word. Celebrate each attempt.
🔊 Listen and blend the sounds to make the word. 📘 Escucha y une los sonidos para formar la palabra.
/s/ + /ea/ + /sky/ → sea ✅ (Correct)
/c/ + /at/ → cat ✅ (Correct)
/bl/ + /ue/ → blue ✅ (Correct)
B. Echo Reading Chant – “Sun and Sea” (Fluency)
', 'coqui_escucha', 'SECTION 1: Hi! I''m Coquí. Today we''ll practice listening and repeating beautiful Puerto Rican words.
SECTION 2: Listen carefully. I''ll say a word and you repeat it after me.
SECTION 3: Perfect! Your voice sounds great. Let''s keep practicing.
SECTION 4: Great job! You''re doing awesome. You''re a Spanish champion.', NULL, 3, NULL, NULL, NULL, 70),
  ('f60ae89f-6400-4989-9f2c-ecaf1e314cbc', 'exercise', 'multiple_choice', 'CLOSURE & REFLECTION', NULL, '{"answers":[{"text":"To spend time with family ","imageUrl":null,"isCorrect":true},{"text":"To enjoy nature ","imageUrl":null,"isCorrect":true},{"text":"To learn new words ","imageUrl":null,"isCorrect":true}],"question":"What did you learn from Luna and Abuelo? ","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761609674832-ChatGPT%20Image%20Oct%2027,%202025,%2008_01_07%20PM.png"}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:08:15.739934+00:00', '2025-10-28T00:08:15.739934+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '6fcc761b-8032-48e8-a2bb-fb408a79d690', NULL, NULL, 70),
  ('36a8c266-9050-40b6-804e-4946b2c04992', 'exercise', 'multiple_choice', 'CLOSURE & REFLECTION', NULL, '{"answers":[{"text":"😊 Happy ","imageUrl":null,"isCorrect":true},{"text":"🤔 Curious ","imageUrl":null,"isCorrect":true},{"text":"😕 Confused","imageUrl":null,"isCorrect":false}],"question":"How did you feel about the story? "}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-28T00:01:26.826088+00:00', '2025-10-28T00:01:26.826088+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '6fcc761b-8032-48e8-a2bb-fb408a79d690', NULL, NULL, 70),
  ('6e1ebdf3-5365-4956-b4a7-38bcb5c450ea', 'exercise', 'write_answer', 'Type the word that matches the meaning or picture', NULL, '{"question":"What color was the sky? ","caseSensitive":false,"correctAnswer":"Blue"}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T23:30:58.004358+00:00', '2025-10-27T23:30:58.004358+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '6fcc761b-8032-48e8-a2bb-fb408a79d690', NULL, NULL, 70),
  ('524c0d23-b79d-4865-8635-83ca57421982', 'exercise', 'fill_blank', 'Type the word that matches the meaning or picture', NULL, '{"mode":"single_word","prompt":"What did they see? ","target":"Pigeons","letters":["p","i","g","e","o","n","s","t","m"],"imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761607334206-ChatGPT%20Image%20Oct%2027,%202025,%2007_22_05%20PM.png","autoShuffle":true}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T23:29:59.499334+00:00', '2025-10-27T23:29:59.499334+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '6fcc761b-8032-48e8-a2bb-fb408a79d690', NULL, NULL, 70),
  ('17ebe287-dcc8-41cb-9c1c-b26413de8388', 'exercise', 'multiple_choice', 'Choose the correct answer.', NULL, '{"answers":[{"text":"Parrots","imageUrl":null,"isCorrect":false},{"text":"Luna and Abuelo ","imageUrl":null,"isCorrect":true},{"text":"Pigeons","imageUrl":null,"isCorrect":false}],"question":"Who went to the plaza? "}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T23:24:34.030898+00:00', '2025-10-27T23:24:34.030898+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '6fcc761b-8032-48e8-a2bb-fb408a79d690', NULL, NULL, 70),
  ('6e7781e7-4dd5-4b3f-8a9b-aa6a10d08942', 'exercise', 'true_false', 'Read each sentence and choose True or False.', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"The sky was blue "}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T23:22:27.251556+00:00', '2025-10-27T23:22:27.251556+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '6fcc761b-8032-48e8-a2bb-fb408a79d690', NULL, NULL, 70),
  ('79a3a9d9-cf5c-45f2-a062-ae59f5d479a9', 'exercise', 'true_false', 'Read each sentence and choose True or False.', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"They saw a small coquí sing "}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T23:21:37.363797+00:00', '2025-10-27T23:21:37.363797+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '6fcc761b-8032-48e8-a2bb-fb408a79d690', NULL, NULL, 70),
  ('33446424-edfc-49da-9fab-4733139f6402', 'exercise', 'true_false', 'Read each sentence and choose True or False.', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"Luna and Abuelo walked in Old San Juan "}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T23:17:28.589909+00:00', '2025-10-27T23:18:41.179135+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '6fcc761b-8032-48e8-a2bb-fb408a79d690', NULL, NULL, 70),
  ('0d3e693b-a1d9-414c-967e-63d2d87069ec', 'exercise', 'true_false', 'Read each sentence and choose True or False.', NULL, '{"answers":[{"text":"True","imageUrl":null,"isCorrect":true},{"text":"False","imageUrl":null,"isCorrect":false}],"question":"Luna spread her arms because she wanted to fly.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761605748103-ChatGPT%20Image%20Oct%2027,%202025,%2006_55_40%20PM.png"}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T23:02:37.745171+00:00', '2025-10-27T23:20:16.762979+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '6fcc761b-8032-48e8-a2bb-fb408a79d690', NULL, NULL, 70),
  ('ba22f0ee-0e70-4ce9-9174-4fba821197cd', 'exercise', 'write_answer', 'Choose the correct answer. ', NULL, '{"question":"What did they see in the plaza? ","caseSensitive":false,"correctAnswer":"Pigeons"}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T22:57:02.657335+00:00', '2025-10-27T23:20:41.241973+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '6fcc761b-8032-48e8-a2bb-fb408a79d690', NULL, NULL, 70),
  ('0db667b6-d1df-4af3-9e93-27dcdc3fac73', 'exercise', 'write_answer', 'Choose the correct answer. ', NULL, '{"question":"Where did Luna and Abuelo walk? ","caseSensitive":false,"correctAnswer":"OldSanJuan","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761605229963-ChatGPT%20Image%20Oct%2027,%202025,%2006_47_03%20PM.png"}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T22:54:03.963041+00:00', '2025-10-27T23:19:04.419577+00:00', '{}'::jsonb, 'Old San Juan ', NULL, NULL, NULL, 3, '6fcc761b-8032-48e8-a2bb-fb408a79d690', NULL, NULL, 70),
  ('434fb2ee-4302-4e0e-8c34-c49f470852fe', 'lesson', 'lesson', 'VOCABULARY & COMPREHENSION', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Learn and use new words (coquí, plaza, castle)."}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T22:48:20.888027+00:00', '2025-10-27T23:19:42.429562+00:00', '{}'::jsonb, '🔊 Instruction (EN): Tap each word to hear it. Match it with its meaning or picture. 📘 Instrucción (ES): Toca cada palabra para escucharla. Une la palabra con su significado o imagen.
coquí → frog ✅ (Correct)
castle → a big stone building ✅ (Correct)
plaza → park ✅ (Correct)
sea → ocean ✅ (Correct)
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('ca0473f5-a116-4b00-8cdb-79c22c05af42', 'lesson', 'lesson', 'PHONEMIC AWARENESS & PHONICS PRACTICE', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Identify and blend initial and final sounds in key words (sun, sea, blue)."}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T22:45:19.432242+00:00', '2025-10-27T22:46:31.390048+00:00', '{}'::jsonb, '🔊 Instruction (EN): Listen and say the first sound you hear. 📘 Instrucción (ES): Escucha y di el primer sonido que escuchas.
sun → /s/ ✅ (Correct)
sea → /ē/ ✅ (Correct)
cat → Add /s/ to at = sat ✅ (Correct)
Blend and read: /c/ + /a/ + /t/ = cat ✅ (Correct) 🔊 (Read Aloud)
Blend and read: /s/ + /u/ + /n/ = sun ✅ (Correct) 🔊 (Read Aloud)
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('6fcc761b-8032-48e8-a2bb-fb408a79d690', 'lesson', 'lesson', '“A Day in Old San Juan” ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Students will develop early comprehension, vocabulary, and fluency while exploring a short story set in Old San Juan."}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T22:43:55.537101+00:00', '2025-10-27T22:43:55.537101+00:00', '{}'::jsonb, '“Hello! I’m your reading guide. Today you’ll learn something fun and new.”
“If you make a mistake, that’s okay. Try again — every attempt helps you learn!”
“Listen carefully, think, and choose the correct answer.”
“Drag the words or syllables into the correct place.”
“Click Yes or No based on what you think.”
“After reading, you’ll answer a few questions. You can do it!”
“Let’s read together. Repeat after me.”
“Great job! You reached a new reading level. Keep practicing!”
________________________________________
🎧 Integration of Images and Audio
To maintain engagement and reinforce comprehension, the platform should display:
Type	Example	Icon
Narration / Pronunciation	Tap to hear vocabulary or sentence	🔊
Visual Reinforcement	Picture of the character, object, or setting	🖼️
Choice Interaction	Tap or drag answer	🎮
Feedback Cue	Green checkmark (✅) for correct answer	✅
🔊 “Hello! Let’s read *A Day in Old San Juan.* Listen carefully and follow the words on the screen.”
📘 Instrucción (ES): “¡Hola! Vamos a leer *Un día en el Viejo San Juan.* Escucha con atención y sigue las palabras en la pantalla.”
Part 1: The sun was bright in Old San Juan. Luna and her grandfather walked by the colorful houses. They heard a small coquí sing. ✅ (Correct) 🔊 (Read Aloud)
Part 2: They went to the plaza to feed the pigeons. “Look at the blue sky!” said Luna. Abuelo smiled. “Yes, the sea is near.” ✅ (Correct) 🔊 (Read Aloud)
Part 3: They climbed the hill to see El Morro. Luna spread her arms like a bird. “I can fly!” she laughed. Abuelo laughed too. ✅ (Correct) 🔊 (Read Aloud)




', NULL, '🟦 AI-ADAPTIVE INTERACTIVE READING MODULE – GRADE 2
🌍 Module Format Overview
Each lesson will include:
🎙️ Narrated Story and Full Text Display
(AI voice + text on screen)
⏸️ Natural Pauses for Comprehension and Reading Flow
[PAUSE 2s], [PAUSE 3s]
❓ Basic Questions (2)
Multiple-choice (A – B – C)
💡 Intermediate Questions (2–3)
With inferential / academic vocabulary
🔁 Conditional Feedback
✅ Correct / ❌ Incorrect / 🔄 Retry
🌈 Motivational Closing with Socio-Emotional Connection
', NULL, 3, NULL, NULL, NULL, 70),
  ('47bb7457-394f-4b69-8d33-02af34462c51', 'exercise', 'multiple_choice', 'Socio-Emotional Connection', NULL, '{"answers":[{"text":"To help our friends.","imageUrl":null,"isCorrect":true},{"text":"To practice every day.","imageUrl":null,"isCorrect":true},{"text":"To never give up.","imageUrl":null,"isCorrect":false}],"question":"What can we learn from Sofia and Paco?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761603560451-ChatGPT%20Image%20Oct%2027,%202025,%2006_19_13%20PM.png"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T22:26:13.655716+00:00', '2025-10-27T22:26:13.655716+00:00', '{}'::jsonb, '“Yes! When we help each other, learning becomes fun. Great job today!”', NULL, '🎓 End of Module Feedback (AI-Generated)
🎮 AI congratulatory animation:
✨ “You finished The Clever Parrot!”
🎶 “Paco claps his wings for you!”
🌈 “Keep practicing — you’re a Clever Reader!”
________________________________________
', NULL, 3, 'ffb3b966-7498-4480-a0e1-f372c97ee5b1', NULL, NULL, 70),
  ('3de7aa75-885a-4772-8b4f-dab6955e884f', 'exercise', 'multiple_choice', 'Reflection  ', NULL, '{"answers":[{"text":"😊 Happy ","imageUrl":null,"isCorrect":true},{"text":"🤔 Curious ","imageUrl":null,"isCorrect":true},{"text":"😌 Calm ","imageUrl":null,"isCorrect":true},{"text":"😕 Confused","imageUrl":null,"isCorrect":false}],"question":"Choose how you felt while reading."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T22:12:16.818589+00:00', '2025-10-27T22:12:16.818589+00:00', '{}'::jsonb, '🔊 AI Response (conditional):
•	If student chooses 😊 or 🤔 → “That’s great! Reading helps you explore new ideas.”
•	If student chooses 😕 → “That’s okay! You can listen again and learn even more next time.”
', NULL, NULL, NULL, 3, 'ffb3b966-7498-4480-a0e1-f372c97ee5b1', NULL, NULL, 70),
  ('ffb3b966-7498-4480-a0e1-f372c97ee5b1', 'lesson', 'lesson', 'CLOSURE, REFLECTION & AI MOTIVATIONAL FEEDBACK', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Students reflect on the story’s theme and demonstrate comprehension through creative, oral, and visual expression."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T22:09:47.354074+00:00', '2025-10-27T22:09:47.354074+00:00', '{}'::jsonb, 'Closure Poem – “Paco, the Clever Parrot” 🦜
(AI-Interactive Read-Aloud with rhythm, sound, and visual cues)
🎙️ Narration (AI Voice):
🔊 “Let’s read and sing together!”
Paco the parrot loves to play,
He learns new words every day.
Sofia reads, and Paco too,
Clever friends can learn like you!
[PAUSE 3s]
🎮 AI Integration:
•	Students repeat each line aloud (call-and-response).
•	AI checks pronunciation accuracy of key words (parrot, words, clever).
•	✅ Green checkmark appears after successful pronunciation.
', NULL, NULL, '["•\tStudents repeat each line aloud (call-and-response).","•\tAI checks pronunciation accuracy of key words (parrot, words, clever)."]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('75a91c2e-4b08-4a7c-8a71-93ed3bc44a20', 'exercise', 'multiple_choice', 'Choose your opinion.', NULL, '{"answers":[{"text":"When Paco spelled “book” ","imageUrl":null,"isCorrect":true},{"text":"When Sofia forgot the words","imageUrl":null,"isCorrect":false},{"text":"When Ms. López left the classroom","imageUrl":null,"isCorrect":false}],"question":"What do you think was the best part of the story?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761602508184-ChatGPT%20Image%20Oct%2027,%202025,%2006_01_38%20PM.png"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T22:08:38.150932+00:00', '2025-10-27T22:08:38.150932+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '61dea80c-6ef7-478e-901e-e10af194366b', NULL, NULL, 70),
  ('61dea80c-6ef7-478e-901e-e10af194366b', 'lesson', 'lesson', 'Speaking and Listening ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":""}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T22:05:39.829054+00:00', '2025-10-27T22:05:39.829054+00:00', '{}'::jsonb, 'Instruction (EN): Listen and respond aloud.

🔊 AI Voice Prompts:
1️⃣ “Who helped Sofia study?”
 🎙️ Expected response: “Her parrot Paco.” ✅
2️⃣ “What word did Paco spell?”
 🎙️ Expected response: “Book.” ✅
3️⃣ “Why do you think the teacher called Paco clever?”
 🎙️ Expected response: “Because he helped Sofia spell the words.” ✅
🧠 AI Behavior:
•	The AI listens for key vocabulary words (parrot, book, clever).
•	If missing, the AI says:
“Try again! Say the words one more time slowly.”
•	✅ A green checkmark appears with the audio cue: “Well done!”
________________________________________
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('f7032fb0-a063-450b-90bb-e9f3c2098876', 'exercise', 'multiple_choice', 'Choose the words to complete each sentence.', NULL, '{"answers":[{"text":" happy ","imageUrl":null,"isCorrect":true},{"text":"sad","imageUrl":null,"isCorrect":false},{"text":"tired","imageUrl":null,"isCorrect":false}],"question":"Sofia felt ________ at the end."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T22:04:49.030009+00:00', '2025-10-27T22:04:49.030009+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '6854492f-e682-451a-a30d-183dbb60877e', NULL, NULL, 70),
  ('60f82ab8-564e-417c-9740-e2036ccbac6a', 'exercise', 'multiple_choice', 'Choose the words to complete each sentence.', NULL, '{"answers":[{"text":"flying away","imageUrl":null,"isCorrect":false},{"text":"spelling words ","imageUrl":null,"isCorrect":true},{"text":"singing songs","imageUrl":null,"isCorrect":false}],"question":"Paco helped Sofia by ________."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T22:01:03.089036+00:00', '2025-10-27T22:01:03.089036+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '6854492f-e682-451a-a30d-183dbb60877e', NULL, NULL, 70),
  ('716689ae-575f-4b3d-812b-70dab4a862ea', 'exercise', 'fill_blank', 'Choose the words to complete each sentence.', NULL, '{"mode":"single_word","prompt":"Sofia practiced her ________.","target":"spelling","letters":["s","p","e","l","l","i","n","g","u","t","a"],"autoShuffle":true}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T21:58:20.490558+00:00', '2025-10-27T21:58:20.490558+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '6854492f-e682-451a-a30d-183dbb60877e', NULL, NULL, 70),
  ('6854492f-e682-451a-a30d-183dbb60877e', 'lesson', 'lesson', 'WRITING & SPEAKING INTEGRATION ACTIVITIES', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Students will use simple structures to express ideas and opinions about the story through AI-assisted oral and visual activities."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T21:57:06.611554+00:00', '2025-10-27T21:57:06.611554+00:00', '{}'::jsonb, 'Instruction (EN): Choose the words to complete each sentence.
🎮 AI Function: Drag-and-drop sentence tiles to form complete ideas.', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('0292ff18-e553-48bb-bf03-de03d9dd96d6', 'exercise', 'multiple_choice', 'Comprehension: Inferential Understanding ', NULL, '{"answers":[{"text":"He whispered the answers ","imageUrl":null,"isCorrect":true},{"text":"He drew a picture","imageUrl":null,"isCorrect":false},{"text":"He flew away","imageUrl":null,"isCorrect":false}],"question":"Choose the best answer for each question.\nHow did Paco help Sofia?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T21:55:50.753831+00:00', '2025-10-27T21:55:50.753831+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '2bdbdfe7-5535-46ee-bffe-38d9d99e2917', NULL, NULL, 70),
  ('94561666-6f4b-4771-8330-417aa097bc98', 'exercise', 'multiple_choice', 'Comprehension: Inferential Understanding ', NULL, '{"answers":[{"text":"Paco spelled a word ","imageUrl":null,"isCorrect":true},{"text":"Paco danced ","imageUrl":null,"isCorrect":false},{"text":"Ms. López sang","imageUrl":null,"isCorrect":false}],"question":"Choose the best answer for each question.\nWhy did Sofia laugh?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T21:54:34.507635+00:00', '2025-10-27T21:54:34.507635+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '2bdbdfe7-5535-46ee-bffe-38d9d99e2917', NULL, NULL, 70),
  ('37a45c15-7eff-44ed-9c11-61fbfb88dd93', 'exercise', 'multiple_choice', 'VOCABULARY & INFERENTIAL COMPREHENSION ACTIVITIES', NULL, '{"answers":[{"text":"fish","imageUrl":null,"isCorrect":false},{"text":"bird that can talk ","imageUrl":null,"isCorrect":true},{"text":"dog","imageUrl":null,"isCorrect":false}],"question":"Choose the correct meaning or picture for the word “parrot.”","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761601408606-ChatGPT%20Image%20Oct%2027,%202025,%2005_43_19%20PM.png"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T21:50:30.954716+00:00', '2025-10-27T21:50:30.954716+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '2bdbdfe7-5535-46ee-bffe-38d9d99e2917', NULL, NULL, 70),
  ('479509da-8998-4281-8b59-e173fc41f1c4', 'exercise', 'multiple_choice', 'VOCABULARY & INFERENTIAL COMPREHENSION ACTIVITIES', NULL, '{"answers":[{"text":"move wings up and down ","imageUrl":null,"isCorrect":true},{"text":"walk","imageUrl":null,"isCorrect":false},{"text":" sing","imageUrl":null,"isCorrect":false}],"question":"Choose the correct meaning or picture for the word “flap.”"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T21:48:04.075486+00:00', '2025-10-27T21:48:04.075486+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '2bdbdfe7-5535-46ee-bffe-38d9d99e2917', NULL, NULL, 70),
  ('09ed8905-adb9-4c1f-aded-4d186ae5634a', 'exercise', 'multiple_choice', 'VOCABULARY & INFERENTIAL COMPREHENSION ACTIVITIES', NULL, '{"answers":[{"text":"leg","imageUrl":null,"isCorrect":false},{"text":"part used to fly ","imageUrl":null,"isCorrect":true},{"text":"foot","imageUrl":"","isCorrect":false}],"question":"Choose the correct meaning or picture for the word “wing.”","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761601512376-ChatGPT%20Image%20Oct%2027,%202025,%2005_37_47%20PM.png"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T21:44:48.173609+00:00', '2025-10-27T21:52:02.354857+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '2bdbdfe7-5535-46ee-bffe-38d9d99e2917', NULL, NULL, 70),
  ('fe1a7b02-5983-44bf-bf01-7c85da220a0e', 'exercise', 'multiple_choice', 'VOCABULARY & INFERENTIAL COMPREHENSION ACTIVITIES', NULL, '{"answers":[{"text":"to say letters in order ","imageUrl":null,"isCorrect":true},{"text":"to shout ","imageUrl":null,"isCorrect":false},{"text":"to jump","imageUrl":null,"isCorrect":false}],"question":"Choose the correct meaning or picture for the word “spell.”"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T21:41:19.419981+00:00', '2025-10-27T21:41:19.419981+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '2bdbdfe7-5535-46ee-bffe-38d9d99e2917', NULL, NULL, 70),
  ('efc06278-c5c1-4d7c-9e95-49846e469a6d', 'exercise', 'multiple_choice', 'VOCABULARY & INFERENTIAL COMPREHENSION ACTIVITIES', NULL, '{"answers":[{"text":"funny ","imageUrl":null,"isCorrect":false},{"text":"smart ","imageUrl":null,"isCorrect":true},{"text":"tired","imageUrl":null,"isCorrect":false}],"question":"Choose the correct meaning or picture for the word “clever.”"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T21:40:08.730139+00:00', '2025-10-27T21:40:08.730139+00:00', '{}'::jsonb, NULL, NULL, '🔊 “Great job! Paco loves when you match words correctly!”', NULL, 3, '2bdbdfe7-5535-46ee-bffe-38d9d99e2917', NULL, NULL, 70),
  ('ca4ff618-714b-45f7-a96d-cda8034082b6', 'exercise', 'multiple_choice', 'Literal Comprehension', NULL, '{"answers":[{"text":"He clapped","imageUrl":null,"isCorrect":false},{"text":"He shouted “B-O-O-K!” ","imageUrl":null,"isCorrect":true},{"text":"He went to sleep","imageUrl":null,"isCorrect":false}],"question":"Choose the correct answer.\nWhat did Paco do when Sofia spelled “book”?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T21:03:39.524882+00:00', '2025-10-27T21:03:39.524882+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '2bdbdfe7-5535-46ee-bffe-38d9d99e2917', NULL, NULL, 70),
  ('33807c86-efcb-44e4-ac10-6866b82d4622', 'exercise', 'multiple_choice', 'Literal Comprehension', NULL, '{"answers":[{"text":"Her teacher","imageUrl":null,"isCorrect":false},{"text":"Her friend ","imageUrl":null,"isCorrect":false},{"text":"Her parrot ","imageUrl":null,"isCorrect":true}],"question":"Choose the correct answer.\nWho helped Sofia with her spelling words?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T21:02:40.493967+00:00', '2025-10-27T21:02:40.493967+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '2bdbdfe7-5535-46ee-bffe-38d9d99e2917', NULL, NULL, 70),
  ('2bdbdfe7-5535-46ee-bffe-38d9d99e2917', 'lesson', 'lesson', 'The Clever Parrot', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"To develop comprehension, vocabulary, and fluency through an interactive reading about a parrot that helps a girl learn spelling words. Students will identify story elements, infer character traits, and apply new vocabulary in context through interactive AI tasks."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:59:20.512811+00:00', '2025-10-27T20:59:20.512811+00:00', '{}'::jsonb, '🔊 “Hello! Today we’ll read The Clever Parrot. Listen carefully and follow along.”
________________________________________
Part 1
Sofia had a parrot named Paco. Every morning, Paco sat near Sofia’s desk while she practiced her spelling words.
[PAUSE 3s]
Sofia said, “P-A-R-R-O-T.”
Paco copied her, “P-A-R-R-O-T!” His voice made Sofia laugh.
[PAUSE 2s]
One day, Sofia’s teacher, Ms. López, gave the class a new spelling list.
“Can you help me, Paco?” Sofia asked. Paco squawked and nodded.
[PAUSE 3s]
🖼️ Image placeholder: Sofia at her desk with her colorful parrot Paco.
________________________________________
Part 2
Each afternoon, Paco listened carefully as Sofia practiced.
[PAUSE 2s]
When she spelled “book,” Paco flapped his wings and shouted, “B-O-O-K!”
[PAUSE 3s]
The next morning, Ms. López called Sofia to the board.
“Spell ‘sun,’ please.”
Sofia took a deep breath. Paco whispered softly, “S-U-N.”
[PAUSE 2s]
Sofia smiled and wrote the word perfectly.
[PAUSE 2s]
🖼️ Image placeholder: Classroom scene — Sofia at the board, Paco watching.
________________________________________
Part 3
At the end of the week, the students had their spelling test.
[PAUSE 2s]
When Sofia finished, she looked at Paco and whispered, “Thank you!”
[PAUSE 2s]
Ms. López smiled and said, “That’s one clever parrot.”
Paco puffed his feathers proudly and said, “C-L-E-V-E-R!”
Everyone laughed and clapped for Paco.
[PAUSE 3s]
🖼️ Image placeholder: Paco spreading wings proudly, classmates clapping.
________________________________________
🌈 Motivational Closing (AI Voice):
🔊 “Great reading! You learned that teamwork and practice help us grow smarter every day.”
', NULL, NULL, '["Type\tExample\tIcon","Narration / Pronunciation\tTap to hear vocabulary or sentence\t🔊","Visual Reinforcement\tPicture of the character, object, or setting\t🖼️","Choice Interaction\tTap or drag answer\t🎮","Feedback Cue\tGreen checkmark (✅) for correct answer\t✅"]'::jsonb, 3, NULL, NULL, NULL, 70);

INSERT INTO public.manual_assessments ("id", "type", "subtype", "title", "description", "content", "grade_level", "language", "subject_area", "curriculum_standards", "enable_voice", "voice_speed", "auto_read_question", "difficulty_level", "estimated_duration_minutes", "status", "published_at", "view_count", "completion_count", "average_score", "created_by", "created_at", "updated_at", "metadata", "voice_guidance", "activity_template", "coqui_dialogue", "pronunciation_words", "max_attempts", "parent_lesson_id", "order_in_lesson", "drag_drop_mode", "passing_score") VALUES
  ('8afbbad9-bf80-4ec5-9794-cd79f1e0999b', 'exercise', 'drag_drop', 'Creative Closure ', NULL, '{"mode":"match","question":"Choose your ending picture.","dropZones":[{"id":"zone-1761597642706","label":"Mateo waving to his boat"},{"id":"zone-1761597672848","label":"The boat reaching a new dock"},{"id":"zone-1761597744883","label":"The boat sailing under a rainbow"}],"draggableItems":[{"id":"item-1761597707783","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761597705409-ChatGPT%20Image%20Oct%2027,%202025,%2004_41_26%20PM.png","type":"image"},"correctZone":"zone-1761597642706"},{"id":"item-1761597806033","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761597803760-ChatGPT%20Image%20Oct%2027,%202025,%2004_43_11%20PM.png","type":"image"},"correctZone":"zone-1761597672848"},{"id":"item-1761597986412","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761597983954-ChatGPT%20Image%20Oct%2027,%202025,%2004_46_12%20PM.png","type":"image"},"correctZone":"zone-1761597744883"}],"allowMultiplePerZone":false}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:54:32.821992+00:00', '2025-10-27T20:54:32.821992+00:00', '{}'::jsonb, NULL, NULL, 'Congratulations! You finished your reading mission. Every new word and sentence you learn makes your boat sail farther in English!', NULL, 3, '27618629-2e32-4a37-bd2a-7f57502b8427', NULL, 'match', 70),
  ('7c6311d2-0cd9-437e-9550-1d585738a575', 'exercise', 'multiple_choice', 'Listening & Speaking Reflection ', NULL, '{"answers":[{"text":"Making the boat ","imageUrl":null,"isCorrect":true},{"text":"The wind blowing","imageUrl":null,"isCorrect":false},{"text":"The dock","imageUrl":null,"isCorrect":false}],"question":"Listen to the question and choose your answer.\nWhat was your favorite part of the story?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:45:20.72322+00:00', '2025-10-27T20:45:20.72322+00:00', '{}'::jsonb, NULL, NULL, '
Beautiful answers! You listened carefully and shared your thoughts clearly.
', NULL, 3, '27618629-2e32-4a37-bd2a-7f57502b8427', NULL, NULL, 70),
  ('ee17b568-eb86-4707-9937-60de0bbb4c28', 'exercise', 'multiple_choice', 'Listening & Speaking Reflection ', NULL, '{"answers":[{"text":"To let go and learn ","imageUrl":null,"isCorrect":true},{"text":"To build a bigger boat","imageUrl":null,"isCorrect":false},{"text":"To stop playing","imageUrl":null,"isCorrect":false}],"question":"Listen to the question and choose your answer.\nWhat did Grandfather teach Mateo?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:44:21.221361+00:00', '2025-10-27T20:44:21.221361+00:00', '{}'::jsonb, NULL, NULL, 'Beautiful answers! You listened carefully and shared your thoughts clearly.', NULL, 3, '27618629-2e32-4a37-bd2a-7f57502b8427', NULL, NULL, 70),
  ('ed19f6ff-c24d-4ef9-b353-e02359fdc570', 'exercise', 'drag_drop', 'Vocabulary Match ', NULL, '{"mode":"match","question":"Drag each word to its meaning.","dropZones":[{"id":"zone-1761597055801","label":"soft wind"},{"id":"zone-1761597058818","label":"place for boats "},{"id":"zone-1761597066200","label":"move slowly"},{"id":"zone-1761597077329","label":" stay on top of water"},{"id":"zone-1761597087495","label":"to show you are happy"}],"draggableItems":[{"id":"item-1761597323794","content":"breeze","correctZone":"zone-1761597055801"},{"id":"item-1761597333206","content":"dock","correctZone":"zone-1761597058818"},{"id":"item-1761597344542","content":"drift","correctZone":"zone-1761597066200"},{"id":"item-1761597354519","content":"float ","correctZone":"zone-1761597077329"},{"id":"item-1761597363294","content":"smile","correctZone":"zone-1761597087495"}],"allowMultiplePerZone":false}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:39:50.737235+00:00', '2025-10-27T20:42:54.41042+00:00', '{}'::jsonb, NULL, NULL, 'You matched each word perfectly! Keep learning new vocabulary every day.', NULL, 3, '27618629-2e32-4a37-bd2a-7f57502b8427', NULL, 'match', 70),
  ('df343eed-943d-4343-b2aa-d872e9a720c8', 'exercise', 'multiple_choice', 'Literal Comprehension ', NULL, '{"answers":[{"text":"sad","imageUrl":null,"isCorrect":false},{"text":"happy","imageUrl":null,"isCorrect":true},{"text":"angry","imageUrl":null,"isCorrect":false}],"question":"Choose the best answer for each question.\nHow did Mateo feel at the end?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:35:54.472927+00:00', '2025-10-27T20:35:54.472927+00:00', '{}'::jsonb, '🎧 AI Feedback
Excellent! You remembered the main events from the story.
', NULL, NULL, NULL, 3, '27618629-2e32-4a37-bd2a-7f57502b8427', NULL, NULL, 70),
  ('985bdb53-0d0a-4ef2-a279-02a571b521e4', 'exercise', 'multiple_choice', 'Literal Comprehension ', NULL, '{"answers":[{"text":"It sank. ","imageUrl":null,"isCorrect":false},{"text":"It drifted away. ","imageUrl":null,"isCorrect":true},{"text":"It stayed on the dock.","imageUrl":null,"isCorrect":false}],"question":"Choose the best answer for each question.\nWhat happened to the boat?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:34:01.172975+00:00', '2025-10-27T20:34:39.447009+00:00', '{}'::jsonb, NULL, NULL, '🎧 AI Feedback
Excellent! You remembered the main events from the story.
', NULL, 3, '27618629-2e32-4a37-bd2a-7f57502b8427', NULL, NULL, 70),
  ('125b2044-ed79-4390-9502-930d1da9245c', 'exercise', 'multiple_choice', 'Literal Comprehension ', NULL, '{"answers":[{"text":"red ","imageUrl":null,"isCorrect":true},{"text":"blue ","imageUrl":null,"isCorrect":false},{"text":"yellow","imageUrl":null,"isCorrect":false}],"question":"Choose the best answer for each question.\nWhat color was the star on the boat?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:31:18.213861+00:00', '2025-10-27T20:31:36.760201+00:00', '{}'::jsonb, NULL, NULL, '🎧 AI Feedback
Excellent! You remembered the main events from the story.
', NULL, 3, '27618629-2e32-4a37-bd2a-7f57502b8427', NULL, NULL, 70),
  ('e4d005a3-940f-4607-9321-bfc9fe8f3832', 'exercise', 'multiple_choice', 'Literal Comprehension ', NULL, '{"answers":[{"text":"red","imageUrl":null,"isCorrect":true},{"text":"blue ","imageUrl":null,"isCorrect":false},{"text":"yellow","imageUrl":null,"isCorrect":false}],"question":"Choose the best answer for each question.\nWhat color was the star on the boat?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:19:44.147475+00:00', '2025-10-27T20:19:44.147475+00:00', '{}'::jsonb, '🎧 AI Feedback
Excellent! You remembered the main events from the story.
', NULL, NULL, NULL, 3, '27618629-2e32-4a37-bd2a-7f57502b8427', NULL, NULL, 70),
  ('96c63359-1b16-4a5c-8865-851a05ac859e', 'exercise', 'multiple_choice', 'Literal Comprehension ', NULL, '{"answers":[{"text":"a kite ","imageUrl":null,"isCorrect":false},{"text":"a paper boat ","imageUrl":null,"isCorrect":true},{"text":"a toy car","imageUrl":null,"isCorrect":false}],"question":"Choose the best answer for each question.\nWhat did they make together?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:15:15.739299+00:00', '2025-10-27T20:15:34.748755+00:00', '{}'::jsonb, '🎧 AI Feedback
Excellent! You remembered the main events from the story.
', NULL, NULL, NULL, 3, '27618629-2e32-4a37-bd2a-7f57502b8427', NULL, NULL, 70),
  ('e76212e3-f135-470b-a314-69a486f1b15b', 'exercise', 'multiple_choice', 'Literal Comprehension ', NULL, '{"answers":[{"text":"his teacher","imageUrl":null,"isCorrect":false},{"text":"his grandfather ","imageUrl":null,"isCorrect":true},{"text":"his friend","imageUrl":null,"isCorrect":false}],"question":"Choose the best answer for each question.\nWho was with Mateo at the dock?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:13:28.700529+00:00', '2025-10-27T20:13:28.700529+00:00', '{}'::jsonb, NULL, NULL, 'Excellent! You remembered the main events from the story.', NULL, 3, '27618629-2e32-4a37-bd2a-7f57502b8427', NULL, NULL, 70),
  ('27618629-2e32-4a37-bd2a-7f57502b8427', 'lesson', 'lesson', 'Module Closure – Motivation Segment', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Students demonstrate understanding of the story and vocabulary through interactive comprehension and reflection activities."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:07:53.462083+00:00', '2025-10-27T20:07:53.462083+00:00', '{}'::jsonb, 'You’ve completed your reading adventure for today! Remember, every word you learn helps you sail farther — just like Mateo’s little boat.
Let’s check what you remember! Listen, think, and choose the best answer.', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('73c0b903-7be3-4f9b-8184-ef5c2e06d431', 'exercise', 'multiple_choice', 'Speaking & Listening Reflection', NULL, '{"answers":[{"text":"The red star ","imageUrl":null,"isCorrect":true},{"text":"The wind","imageUrl":null,"isCorrect":false},{"text":"The dock","imageUrl":null,"isCorrect":false}],"question":"🎧 listen to the question and then, choose your answer.\nWhat did you like most?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:06:56.423248+00:00', '2025-10-27T20:06:56.423248+00:00', '{}'::jsonb, NULL, NULL, 'Wonderful job! You finished today’s story and activities with great focus. ', NULL, 3, 'a7547aa5-9a9f-4615-ad3e-939ea4b70001', NULL, NULL, 70),
  ('74ecbde4-6dfd-4e35-83f9-b5f8134271c6', 'exercise', 'multiple_choice', 'Speaking & Listening Reflection', NULL, '{"answers":[{"text":"To let go ","imageUrl":null,"isCorrect":true},{"text":"To run fast","imageUrl":null,"isCorrect":false},{"text":"To build another boat","imageUrl":null,"isCorrect":false}],"question":"Read the question and then, choose your answer. \nWhat did Mateo learn?"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T20:04:07.837198+00:00', '2025-10-27T20:04:07.837198+00:00', '{}'::jsonb, NULL, NULL, 'Wonderful job! You finished today’s story and activities with great focus', NULL, 3, 'a7547aa5-9a9f-4615-ad3e-939ea4b70001', NULL, NULL, 70),
  ('be40b2fe-8123-44a9-a41f-de0c3a6c9543', 'exercise', 'fill_blank', 'Choose and Build a Sentence ', NULL, '{"mode":"single_word","prompt":"Drag the letters to form the correct word and complete the sentence.\n_______ and Grandpa smile. \n","target":"Mateo","letters":["m","a","t","e","o","i","u"],"autoShuffle":true}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:54:17.747783+00:00', '2025-10-27T19:54:17.747783+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'a7547aa5-9a9f-4615-ad3e-939ea4b70001', NULL, NULL, 70),
  ('d98413f8-c716-43d9-994d-79618fcaf5cf', 'exercise', 'fill_blank', 'Choose and Build a Sentence ', NULL, '{"mode":"single_word","prompt":"Drag the letters to form the correct word and complete the sentence.\nThe boat has a _____ star. ","target":"red","letters":["r","e","d","s"],"autoShuffle":true}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:52:28.565024+00:00', '2025-10-27T19:52:28.565024+00:00', '{}'::jsonb, NULL, NULL, 'Say your sentence out loud! The AI will listen and repeat it with you. ', NULL, 3, 'a7547aa5-9a9f-4615-ad3e-939ea4b70001', NULL, NULL, 70),
  ('48aeadf4-dd36-421e-b25e-7680f6bd293b', 'exercise', 'fill_blank', 'Choose and Build a Sentence ', NULL, '{"mode":"single_word","prompt":"Drag the letters to form the correct word and complete the sentence.\nI see a boat in the __________.","target":"bay","letters":["b","a","y","t"],"autoShuffle":true}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:50:12.369266+00:00', '2025-10-27T19:50:12.369266+00:00', '{}'::jsonb, 'Say your sentence out loud! The AI will listen and repeat it with you. ', NULL, NULL, NULL, 3, 'a7547aa5-9a9f-4615-ad3e-939ea4b70001', NULL, NULL, 70),
  ('47864c5b-d3f4-4170-8927-560372337dca', 'exercise', 'multiple_choice', 'Sentence Completion ', NULL, '{"answers":[{"text":"friend","imageUrl":null,"isCorrect":true},{"text":" fish","imageUrl":null,"isCorrect":false},{"text":"game","imageUrl":null,"isCorrect":false}],"question":"Find the word that completes the sentence.\nGrandfather said it would find a new ________."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:41:31.185908+00:00', '2025-10-27T19:41:31.185908+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'a7547aa5-9a9f-4615-ad3e-939ea4b70001', NULL, NULL, 70),
  ('c1d13a5a-4b29-411e-8e8c-1fe68caa8781', 'exercise', 'multiple_choice', 'Sentence Completion ', NULL, '{"answers":[{"text":"jump (","imageUrl":null,"isCorrect":false},{"text":"hide","imageUrl":null,"isCorrect":false},{"text":"drift","imageUrl":null,"isCorrect":true}],"question":"Find the word that completes the sentence.\nThe wind made the boat ________."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:40:28.143393+00:00', '2025-10-27T19:40:28.143393+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('ade15115-40c5-4499-b928-cf1741ec224a', 'exercise', 'multiple_choice', 'Sentence Completion ', NULL, '{"answers":[{"text":"blue","imageUrl":null,"isCorrect":false},{"text":" red","imageUrl":null,"isCorrect":true},{"text":"green","imageUrl":null,"isCorrect":false}],"question":"Drag the word that completes the sentence.\nThe boat had a ________ star."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:39:16.7996+00:00', '2025-10-27T19:39:16.7996+00:00', '{}'::jsonb, NULL, NULL, 'Excellent! You finished the sentences just like a real storyteller.', NULL, 3, 'a7547aa5-9a9f-4615-ad3e-939ea4b70001', NULL, NULL, 70),
  ('3cc0b4ce-ff0a-4411-8488-46bf4464c94c', 'exercise', 'multiple_choice', 'Sentence Completion ', NULL, '{"answers":[{"text":"car","imageUrl":null,"isCorrect":false},{"text":"paper boat ","imageUrl":null,"isCorrect":true},{"text":"toy box","imageUrl":null,"isCorrect":false}],"question":"Find the word that completes the sentence.\nMateo made a ________."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:37:37.933415+00:00', '2025-10-27T19:37:37.933415+00:00', '{}'::jsonb, NULL, NULL, 'Excellent! You finished the sentences just like a real storyteller.', NULL, 3, 'a7547aa5-9a9f-4615-ad3e-939ea4b70001', NULL, NULL, 70),
  ('a7547aa5-9a9f-4615-ad3e-939ea4b70001', 'lesson', 'lesson', 'GUIDED WRITING & CREATIVE EXTENSION', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Students demonstrate comprehension and expression by completing guided sentence activities and drawing responses."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:26:54.779697+00:00', '2025-10-27T19:26:54.779697+00:00', '{}'::jsonb, 'Now it’s your turn to share ideas! Listen carefully and choose, drag, or tap to finish each sentence.', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('4ccc5d25-d1d8-43a0-be9e-515083e79ae9', 'exercise', 'drag_drop', 'Vocabulario y comprensión lectora ', NULL, '{"mode":"match","question":"Parea las sigientes imagenes con sus palabras\n\nA. Parte que está debajo de la tierra y toma el agua\nB. Sostiene la planta y lleva el agua a las hojas\nC. Parte verde que respira y hace el alimento.","dropZones":[{"id":"zone-1761592093004","label":"Tallo"},{"id":"zone-1761592098034","label":"Raíz"},{"id":"zone-1761592123342","label":"Hoja"}],"questionImage":"","draggableItems":[{"id":"item-1761592141327","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761592140871-image.png","type":"image"},"correctZone":"zone-1761592123342"},{"id":"item-1761592178614","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761592178096-image.png","type":"image"},"correctZone":"zone-1761592093004"},{"id":"item-1761592187595","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761592187110-image.png","type":"image"},"correctZone":"zone-1761592098034"}],"allowMultiplePerZone":false}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:19:27.256575+00:00', '2025-10-27T19:30:27.781478+00:00', '{}'::jsonb, '🔊¡Hola! Hoy aprenderás algo muy bonito: cómo viven las plantas.

🔊¡Las plantas están por todas partes —en el jardín, en el campo y en nuestra escuela. 

🔊¡En esta lectura descubrirás que las plantas nacen, crecen, cambian y necesitan cuidados, igual que tú.

🔊 Escucha con atención, observa las imágenes y aprende nuevas palabras.

Parea las sigientes imagenes con sus palabras

A. Parte que está debajo de la tierra y toma el agua
B. Sostiene la planta y lleva el agua a las hojas
C. Parte verde que respira y hace el alimento.

', NULL, NULL, NULL, 3, 'd18b2d0d-8536-4fb2-8325-515dc9abba5c', NULL, 'match', 70),
  ('08f8529b-8ee7-423a-83e7-aecad098d0bd', 'exercise', 'multiple_choice', 'Word Building ', NULL, '{"answers":[{"text":"play ","imageUrl":null,"isCorrect":false},{"text":"playing","imageUrl":null,"isCorrect":true}],"question":"Listen and choose the correct word ending."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:16:04.922976+00:00', '2025-10-27T19:16:04.922976+00:00', '{}'::jsonb, 'Nice work! These endings show action — what’s happening now or before.', NULL, NULL, NULL, 3, '2d34bb6d-21d1-4852-a75c-14967591128c', NULL, NULL, 70),
  ('00b78415-c087-4bb9-bcba-f5ccd2ce4d78', 'exercise', 'multiple_choice', 'FLUIDEZ LECTORA 	2', NULL, '{"answers":[{"text":"Guau","imageUrl":null,"isCorrect":false},{"text":"Miau ","imageUrl":null,"isCorrect":true},{"text":"Pato","imageUrl":null,"isCorrect":false}],"question":"poema “El gato”\n El gato duerme en un zapato,\nsueña con leche y con un pato.\n Se despierta y dice “¡miau!”,\ny juega contento con el perro guau.\n\n¿Qué palabra del poema hace un sonido como el que dice el gato?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761591581445-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:08:01.079786+00:00', '2025-10-27T19:08:01.079786+00:00', '{}'::jsonb, 'FLUIDEZ LECTORA 		
🔊 Leeremos Juntos
🔊¡Hola! Hoy conocerás a un gato muy simpático.
🔊 Este gato tiene un lugar curioso para dormir… ¡duerme dentro de un zapato! 
🔊 En este poema escucharás lo que sueña, cómo maúlla, y con quién juega cuando se despierta.
🔊 Escucha con atención, imagina al gato y sus aventuras,
y descubre por qué este poema es tan divertido.
🔊¡Prepárate para disfrutar el poema “El gato”!

🔊 El gato duerme en un zapato,
sueña con leche y con un pato.
🔊 Se despierta y dice “¡miau!”,
y juega contento con el perro guau.

¿Qué palabra del poema hace un sonido como el que dice el gato?
a. Guau
b. Miau ✅
c. Pato
no le digas la contestacion al estudiante', NULL, NULL, NULL, 3, 'd18b2d0d-8536-4fb2-8325-515dc9abba5c', NULL, NULL, 70),
  ('d55d38e9-9003-456c-9ab2-8962e42d143b', 'exercise', 'multiple_choice', ' FLUIDEZ LECTORA 1', NULL, '{"answers":[{"text":"Corre","imageUrl":null,"isCorrect":false},{"text":"Salta ","imageUrl":null,"isCorrect":true},{"text":"Nada","imageUrl":null,"isCorrect":false}],"question":"POEMA “El Sapo “\n El sapo salta. (pausa)\n El sapo canta. (pausa)\n El sapo está en el lago. (pausa)\n¡ El sapo es verde!”\n\n\n¿Qué hace el sapo?\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761591264886-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:04:08.844034+00:00', '2025-10-27T19:04:08.844034+00:00', '{}'::jsonb, 'Leeremos Juntos 
🔊¡Hola! 
🔊 ¡Hola! Hoy vamos a leer un poema muy divertido sobre un sapo.
🔊 Los poemas tienen palabras que suenan bonito y que, a veces, riman.
🔊 En este poema conocerás a un sapo verde que salta, canta y vive muy feliz en su lago.
🔊 Escucha con atención cada parte del poema y mira las imágenes.
🔊 Después, responderás algunas preguntas para mostrar lo que aprendiste.
🔊¡Prepárate para escuchar, pensar y disfrutar el poema del sapo!
🔊 “Escucha cómo suena el poema:
🔊 POEMA “El Sapo “
🔊 El sapo salta. (pausa)
🔊 El sapo canta. (pausa)
🔊 El sapo está en el lago. (pausa)
¡ 🔊 El sapo es verde!”

🔊¿Puedes repetirlo conmigo?
🔊¡Muy bien!
🔊¡Muy bien! Ya escuchaste y leíste el poema “El Sapo”.

🔊 Ahora vamos a pensar y recordar lo que aprendimos.

🔊 Escucha cada pregunta con atención y mira las imágenes antes de contestar.

🔊 No te preocupes si no sabes una respuesta, ¡puedes volver a escuchar el poema!

🔊 Usa tus oídos, tus ojos y tu memoria para responder.
¿Qué hace el sapo?
a. Corre
b. Salta ✅
c. Nada
no le digas la respuesta al estudiante', NULL, NULL, NULL, 3, 'd18b2d0d-8536-4fb2-8325-515dc9abba5c', NULL, NULL, 70),
  ('d02e2977-0f4c-45d7-9d18-bd72f6d270f5', 'exercise', 'multiple_choice', 'Word Building ', NULL, '{"answers":[{"text":"drifting","imageUrl":null,"isCorrect":true},{"text":"drift","imageUrl":null,"isCorrect":false}],"question":"Listen and choose the correct word ending."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:01:34.50713+00:00', '2025-10-27T19:01:57.678622+00:00', '{}'::jsonb, '“Nice work! These endings show action — what’s happening now or before.”', NULL, NULL, NULL, 3, '2d34bb6d-21d1-4852-a75c-14967591128c', NULL, NULL, 70),
  ('b2b88cbc-fcae-4a65-957b-bcb0caffa0f3', 'exercise', 'multiple_choice', 'Word Building ', NULL, '{"answers":[{"text":"smile","imageUrl":null,"isCorrect":false},{"text":"smiled","imageUrl":null,"isCorrect":true}],"question":"Listen and choose the correct word ending."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T19:00:31.060286+00:00', '2025-10-27T19:00:31.060286+00:00', '{}'::jsonb, '“Nice work! These endings show action — what’s happening now or before.”', NULL, 'Words help you tell your story, just like Mateo used his words to describe his boat. Keep listening and learning!', NULL, 3, '2d34bb6d-21d1-4852-a75c-14967591128c', NULL, NULL, 70),
  ('16320054-62e2-4a82-820a-e5058191169e', 'exercise', 'multiple_choice', 'Word Building ', NULL, '{"answers":[{"text":"float","imageUrl":null,"isCorrect":false},{"text":"floating","imageUrl":null,"isCorrect":true}],"question":"Listen and choose the correct word ending."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:58:02.755494+00:00', '2025-10-27T18:58:31.941798+00:00', '{}'::jsonb, '“Nice work! These endings show action — what’s happening now or before.”', NULL, NULL, NULL, 3, '2d34bb6d-21d1-4852-a75c-14967591128c', NULL, NULL, 70),
  ('d18b2d0d-8536-4fb2-8325-515dc9abba5c', 'lesson', 'lesson', 'Lectura corta guiada', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Leer y comprender oraciones cortas con apoyo visual y auditivo. Desarrollar fluidez, ritmo y comprensión literal \n\nEjemplo 1 – “El sol”\nEl sol es amarillo.\nEl sol brilla en el cielo.\nYo veo el sol.\n\n Ejemplo 2 – “La vaca”\nLa vaca\n La vaca come pasto.\n La vaca da leche.\n La vaca es blanca y negra.\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761590059004-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:41:33.317246+00:00', '2025-10-27T18:54:11.597837+00:00', '{}'::jsonb, 'Nombre de la actividad	Lectura corta guiada
Dominio	Fonética – Lectura inicial
Objetivo de aprendizaje	Leer y comprender oraciones cortas con apoyo visual y auditivo. Desarrollar fluidez, ritmo y comprensión literal.
Instrucción al estudiante	“Escucha y sigue la lectura. Cada palabra se iluminará cuando la escuches. Luego repite la oración.”
Tecnología / IA aplicada	<ul><li>Audio narrado: lectura pausada con entonación clara.</li><li>Resaltado palabra por palabra: sincronizado con el audio.</li><li>Reconocimiento de voz: analiza fluidez y pronunciación.</li><li>Panel de progreso: registra velocidad y comprensión básica (respuestas a preguntas sencillas).</li></ul>
Evidencia de aprendizaje	<ul><li>Velocidad de lectura (palabras por minuto).</li><li>Pronunciación correcta por palabra.</li><li>Comprensión literal: identificación de sujeto, objeto o acción.</li></ul>
Escucha y sigue la lectura. Las palabras se iluminarán mientras lees.”
“Ahora lee tú.”
IA analiza pronunciación palabra por palabra.
Objetivo: Leer y comprender oraciones cortas con apoyo visual y auditivo. Desarrollar fluidez, ritmo y comprensión literal Ejemplo 1 – “El sol”
☀️ El sol

Audio narrado:

“El sol es amarillo.”
“El sol brilla en el cielo.”
“Yo veo el sol.”

permite que el estudiante lea despues de ti
Estudiante lee

El sol es amarillo.
El sol brilla en el cielo.
Yo veo el sol.
Pregunta de comprensión 
🔊¿De qué color es el sol?
🟡 Amarillo
 ⚫ Negro

🔊¿Dónde está el sol?
        🟩 En el cielo 
        🟥 En la calle

Refuerzo positivo:
🔊¡Muy bien! Leíste con atención y dijiste todas las palabras correctamente.” 
Ejemplo 2 – “La vaca”

Audio narrado:
🔊 La vaca
🔊 La vaca come pasto.
🔊 La vaca da leche.
🔊 La vaca es blanca y negra.


Ahora te toca a ti












Preguntas de comprensión (modo IA):

🔊¿Qué come la vaca? 
🟩 Pasto
🟥 Pan

🔊¿De qué color es la vaca? 
🟩 Blanca y negra
🟥 Negra 

Refuerzo:
“¡Excelente! Entendiste la lectura. La vaca come pasto y da leche.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('a96d2558-b61d-457f-9170-152055e8bcb2', 'exercise', 'true_false', 'Sí/No NEW ', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":false},{"text":"Falso","imageUrl":null,"isCorrect":true}],"question":"¿La palabra puma tiene la sílaba pu?"}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:38:39.325169+00:00', '2025-10-27T18:38:39.325169+00:00', '{}'::jsonb, '
🔹 Actividad 3 – Sí/No
🔊 “¿La palabra puma tiene la sílaba pu?”
Botones: Sí     /          No✅

Feedback:
✅ “¡Correcto! Pu-ma tiene la sílaba pu.”
❌ “Escucha otra vez: pu-ma. Sí, empieza con pu.”
No decir respuesta. 
La respuesta es: no 
🔹 Cierre:
🔊 “¡Muy bien! Ya puedes leer palabras con pa, pe, pi, po, pu.
Repite en voz alta: papa, pepe, pipí, popa, pupo.”
', NULL, NULL, NULL, 3, '66515740-6011-47e0-8fcf-5c372ef82d60', NULL, NULL, 70),
  ('8734b45c-7799-4b78-b041-44f5e4f79f8a', 'exercise', 'multiple_choice', 'Repita 3', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761589694891-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761589707348-image.png","isCorrect":true}],"question":"1. La manzana es roja. \n2. Me gusta el chocolate. "}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:36:36.115427+00:00', '2025-10-27T18:36:36.115427+00:00', '{}'::jsonb, '1. La manzana es roja. 
enfatiza roja
2. Me gusta el chocolate. 
enfatiza chocolate
lee las oraciones y pide al estudiante que las repita.', NULL, NULL, '["roja","chocolate"]'::jsonb, 3, 'd633e0e2-da19-487d-bbf3-8eafe2bb54de', NULL, NULL, 70),
  ('391967c7-0525-4403-94c0-385027a31486', 'exercise', 'multiple_choice', 'Repite 2', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761589532281-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761589542554-image.png","isCorrect":true}],"question":"1. Mi perro es muy grande. \n2. Yo voy a la escuela. "}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T18:26:54.115+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:33:49.3099+00:00', '2025-10-27T18:33:49.3099+00:00', '{}'::jsonb, '1. Mi perro es muy grande. 
enfatiza grande
2. Yo voy a la escuela. 
enfatiza escuela
lee las oraciones y pide que el estudiante las repita', NULL, NULL, '["grande","escuela"]'::jsonb, 3, 'd633e0e2-da19-487d-bbf3-8eafe2bb54de', NULL, NULL, 70),
  ('8e2ede52-4fe9-4319-9153-4d41231e38e4', 'exercise', 'drag_drop', 'Drag and Drop Pictures', NULL, '{"mode":"match","question":"Drag each word to the picture that shows it.","dropZones":[{"id":"zone-1761589404150","label":"Dock with boats"},{"id":"zone-1761589412100","label":"Breeze moving water"},{"id":"zone-1761589419046","label":"Boat floating"},{"id":"zone-1761589427980","label":"Boat drifting away"},{"id":"zone-1761589436114","label":"Mateo smiling"}],"draggableItems":[{"id":"item-1761590021855","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761590019818-ChatGPT%20Image%20Oct%2027,%202025,%2002_33_26%20PM.png","type":"image"},"correctZone":"zone-1761589404150"},{"id":"item-1761590133262","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761590130858-ChatGPT%20Image%20Oct%2027,%202025,%2002_35_21%20PM.png","type":"image"},"correctZone":"zone-1761589412100"},{"id":"item-1761590244674","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761590242164-ChatGPT%20Image%20Oct%2027,%202025,%2002_37_12%20PM.png","type":"image"},"correctZone":"zone-1761589419046"},{"id":"item-1761590496915","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761590494544-ChatGPT%20Image%20Oct%2027,%202025,%2002_41_18%20PM.png","type":"image"},"correctZone":"zone-1761589427980"},{"id":"item-1761590622738","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761590620256-ChatGPT%20Image%20Oct%2027,%202025,%2002_43_29%20PM.png","type":"image"},"correctZone":"zone-1761589436114"}],"allowMultiplePerZone":false}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:33:11.14562+00:00', '2025-10-27T18:50:39.458454+00:00', '{}'::jsonb, NULL, NULL, 'Great job! You matched the pictures and words correctly.', NULL, 3, '2d34bb6d-21d1-4852-a75c-14967591128c', NULL, 'match', 70),
  ('7c381a56-75c3-42c6-9362-6507896cb584', 'exercise', 'multiple_choice', 'Repite 1', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761589122182-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761589257954-image.png","isCorrect":true}],"question":"1. Como muchas uvas.\n2. Escribo en mi mesa."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T18:23:36.098+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:30:31.446276+00:00', '2025-10-27T18:30:31.446276+00:00', '{}'::jsonb, '1. Como muchas uvas.
enfatiza muchas
2. Escribo en mi mesa.
enfatiza mesa
lee las oraciones individualmente y pide que el estudiante las repita.', NULL, NULL, '["muchas","mesa"]'::jsonb, 3, 'd633e0e2-da19-487d-bbf3-8eafe2bb54de', NULL, NULL, 70),
  ('2d34bb6d-21d1-4852-a75c-14967591128c', 'lesson', 'lesson', 'VOCABULARY & MORPHOLOGY', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Students identify and understand new words from the story through sound, image, and context clues."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:29:13.789048+00:00', '2025-10-27T18:29:13.789048+00:00', '{}'::jsonb, 'Let’s learn the new words from The Little Boat in the Bay! Tap the speaker to hear each word, then match it with its picture or meaning.', NULL, 'Tap the speaker 🔊 to hear the word. Choose its meaning.





“Good listening! Each word comes from our story. You heard these sounds when Mateo watched his boat float away.”
', '["Word\tChoices\t✅ Correct Answer","dock\t(a) place to tie boats (b) mountain (c) park\t✅ (a) place to tie boats","breeze\t(a) soft wind (b) big wave (c) song\t✅ (a) soft wind","float\t(a) stay on top of water (b) go under (c) fly away\t✅ (a) stay on top of water","drift\t(a) move slowly (b) jump (c) stop\t✅ (a) move slowly","smile\t(a) to show you are happy (b) to cry (c) to sleep\t✅ (a) to show you are happy"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('d9bd456b-16c8-49de-9799-774c445cb726', 'exercise', 'multiple_choice', 'LITERAL COMPREHENSION', NULL, '{"answers":[{"text":"Boats always come back. ","imageUrl":null,"isCorrect":false},{"text":"It’s okay to let go and learn. ","imageUrl":null,"isCorrect":true},{"text":"Paper boats sink.","imageUrl":null,"isCorrect":false}],"question":"What Lesson Did Mateo Learn?  Choose the best idea."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:27:04.611378+00:00', '2025-10-27T18:27:31.73699+00:00', '{}'::jsonb, NULL, NULL, 'Excellent thinking! Mateo learned that letting go can lead to new adventures.', NULL, 3, 'b4e045f1-038e-4790-a25b-4d9a94ae816e', NULL, NULL, 70),
  ('f691a800-f1d2-4165-aa19-8b1eb4ff60dc', 'exercise', 'multiple_choice', 'LITERAL COMPREHENSION', NULL, '{"answers":[{"text":"Worried","imageUrl":null,"isCorrect":true},{"text":"Happy","imageUrl":null,"isCorrect":false},{"text":"Sleepy","imageUrl":null,"isCorrect":false}],"question":"Choose how Mateo felt when the boat went away."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:25:26.833272+00:00', '2025-10-27T18:25:26.833272+00:00', '{}'::jsonb, NULL, NULL, 'That’s right! He was worried at first, but later he smiled.', NULL, 3, 'b4e045f1-038e-4790-a25b-4d9a94ae816e', NULL, NULL, 70),
  ('aa005251-2753-4aa7-a10c-ab1714b0d96f', 'exercise', 'drag_drop', 'Arrastra sílabas NEW', NULL, '{"mode":"letters","question":"Arrastra las sílabas correctas para formar pipa.","targetWord":"pipa","autoShuffle":true,"availableLetters":["p","i","p","a","e","o"]}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:24:38.847147+00:00', '2025-10-27T18:24:38.847147+00:00', '{}'::jsonb, '
🔹 Actividad 2 – Arrastra sílabas
Instrucción:
🔊 “Arrastra las sílabas correctas para formar pipa.”
Bloques: [pa] [pi] [po]
Feedback:
✅ “Pi + pa = pipa. ¡Excelente!”
❌ “Escucha bien: pi-pa. ¿Cuál falta?”


', NULL, NULL, NULL, 3, '66515740-6011-47e0-8fcf-5c372ef82d60', NULL, 'letters', 70),
  ('0b7ba4cd-a252-4bce-96e2-2e794addf918', 'exercise', 'drag_drop', 'LITERAL COMPREHENSION', NULL, '{"mode":"match","question":"What Happened First? Drag the pictures into the correct order.\n","dropZones":[{"id":"zone-1761588858404","label":"Mateo and Abuelo making the paper boat "},{"id":"zone-1761588866158","label":"Mateo putting the boat on the water "},{"id":"zone-1761588872773","label":"Wind blowing the boat away "}],"draggableItems":[{"id":"item-1761588896845","content":"1️⃣","correctZone":"zone-1761588858404"},{"id":"item-1761588902813","content":"2️⃣","correctZone":"zone-1761588866158"},{"id":"item-1761588911685","content":"3️⃣","correctZone":"zone-1761588872773"}],"allowMultiplePerZone":false}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:22:15.113915+00:00', '2025-10-27T18:23:43.471891+00:00', '{}'::jsonb, NULL, NULL, 'Great work! You remembered the order of the story.', NULL, 3, 'b4e045f1-038e-4790-a25b-4d9a94ae816e', NULL, 'match', 70),
  ('230ea1f1-acc4-457f-8194-61ed84ee28e3', 'exercise', 'drag_drop', 'Llenar el blanco NEW', NULL, '{"mode":"letters","question":"Completa la palabra: ___to ","targetWord":"pato","autoShuffle":true,"availableLetters":["p","a","t","o","s","b"]}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:14:14.655487+00:00', '2025-10-27T18:16:58.728718+00:00', '{}'::jsonb, 'Lección 2: Sílabas mixtas (pa, pe, pi, po, pu)
🎙️ Introducción IA:
🔊 “Ahora aprenderás a formar palabras con las sílabas pa, pe, pi, po, pu.
Escucha los sonidos y únelos para leer.”
🔹 Actividad 1 – Llenar el blanco
Instrucción:
🔊 “Completa la palabra: ___to 
(pa / po / pu)
Correcta: pa → pato
Feedback IA:
✅ “¡Muy bien! Pato comienza con pa.”
❌ “Intenta otra vez. ¿Qué sílaba suena al inicio de pato?”
', NULL, NULL, NULL, 3, '66515740-6011-47e0-8fcf-5c372ef82d60', NULL, 'letters', 70),
  ('c5081167-692d-44be-b236-55ea1d3dc889', 'exercise', 'multiple_choice', 'LITERAL COMPREHENSION', NULL, '{"answers":[{"text":" Classroom","imageUrl":null,"isCorrect":false},{"text":"Dock","imageUrl":null,"isCorrect":true},{"text":"Forest","imageUrl":null,"isCorrect":false}],"question":"Tap the picture that shows where they were."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:12:52.325785+00:00', '2025-10-27T18:12:52.325785+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'b4e045f1-038e-4790-a25b-4d9a94ae816e', NULL, NULL, 70),
  ('435e3bb8-4267-4023-a0cc-38fb8c9dd40b', 'exercise', 'multiple_choice', 'LITERAL COMPREHENSION', NULL, '{"answers":[{"text":"Mateo and his grandfather ","imageUrl":null,"isCorrect":true},{"text":"Luis and Ana","imageUrl":null,"isCorrect":false},{"text":"Pedro and Rosa","imageUrl":null,"isCorrect":false}],"question":"Choose who was in the story."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:11:44.707421+00:00', '2025-10-27T18:11:44.707421+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'b4e045f1-038e-4790-a25b-4d9a94ae816e', NULL, NULL, 70),
  ('ad7836b7-ce31-4d69-ab97-58b936845b82', 'lesson', 'lesson', 'LITERAL COMPREHENSION', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Students will demonstrate understanding of key story details through listening and visual support."}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T18:10:12.577848+00:00', '2025-10-27T18:10:12.577848+00:00', '{}'::jsonb, 'AI Voice Cue
Now, let’s see what you remember! Listen to the question and tap the answer you think is correct.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('ef20fdaa-5183-496e-8d13-8c2d92b2cf1f', 'exercise', 'true_false', 'Sí o No NEW', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"¿La palabra \"moto\" tiene la sílaba \"mo\"?"}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T17:57:58.435909+00:00', '2025-10-27T18:09:45.741107+00:00', '{}'::jsonb, 'Actividad 3 – Sí o No
Instrucción:
🔊 “¿La palabra moto tiene la sílaba mo?”
Botones: Sí ✅    /  No
Feedback IA:
✅ “¡Correcto! Mo-to empieza con mo.”
❌ “Vuelve a escuchar: mo-to. Sí, tiene mo.”
No digas la respuesta. 
La respuesta es; verdadero.', NULL, NULL, NULL, 3, '66515740-6011-47e0-8fcf-5c372ef82d60', NULL, NULL, 70),
  ('59b9ce9f-d58a-49f9-b57e-7a58db3a741a', 'exercise', 'drag_drop', 'Forma la palabra NEW', NULL, '{"mode":"letters","question":"Arrastra las sílabas para formar la palabra mamá.","targetWord":"mamá","autoShuffle":true,"availableLetters":["m","a","m","á","u","c"]}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T17:46:43.455015+00:00', '2025-10-27T17:49:35.294197+00:00', '{}'::jsonb, 'Actividad 2 – Forma la palabra (drag and drop)
Instrucción:
🔊 “Arrastra las sílabas para formar la palabra mamá.”
Bloques: [ma] [má] [mo] [mu]
Feedback IA:
✅ “¡Excelente! Ma + ma = mamá.”
❌ “Intenta otra vez. Fíjate en el sonido inicial y final.”
No deletrees la palabra "mamá"', NULL, NULL, NULL, 3, '66515740-6011-47e0-8fcf-5c372ef82d60', NULL, 'letters', 70),
  ('9c46fa79-09f1-4191-b52d-7566d0ae5cac', 'exercise', 'multiple_choice', 'Reconoce la sílaba inicial NEW', NULL, '{"answers":[{"text":"ma","imageUrl":null,"isCorrect":false},{"text":"me","imageUrl":null,"isCorrect":true},{"text":"mo","imageUrl":null,"isCorrect":false}],"question":"Escucha la palabra ¿Con qué sílaba empieza?"}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T17:36:16.132847+00:00', '2025-10-27T18:10:49.208728+00:00', '{}'::jsonb, 'Introducción IA:
🔊 “Hola, hoy aprenderás qué es una sílaba.
Una sílaba es un sonido o grupo de sonidos que se pronuncian en una sola emisión de voz.
Vamos a escuchar, repetir y formar palabras con las sílabas ma, me, mi, mo, mu.”
Nota para IA Poner como titulo 
Actividad 1 – Reconoce la sílaba inicial (selección múltiple)
Instrucción:
 🔊 “Escucha la palabra mesa. ¿Con qué sílaba empieza?”
a) ma
b) me✅
c) mo
Feedback IA:
✅ “¡Muy bien! Mesa empieza con me.”
❌ “Intenta otra vez. Escucha el primer sonido: me-sa.”
No digas la respuesta. 
La respuesta es: me', NULL, NULL, NULL, 3, '66515740-6011-47e0-8fcf-5c372ef82d60', NULL, NULL, 70),
  ('2e7760d8-e120-4a74-baf7-0b55c1ae714e', 'exercise', 'drag_drop', 'Drag-and-Drop Match', NULL, '{"mode":"match","question":"Each target word shows an icon to aid language acquisition and memory.  ","dropZones":[{"id":"zone-1761585228817","label":"boat"},{"id":"zone-1761585276767","label":"coat"},{"id":"zone-1761585299384","label":"day"},{"id":"zone-1761585341959","label":"frog"},{"id":"zone-1761585354943","label":"log"},{"id":"zone-1761585359747","label":"wind"},{"id":"zone-1761585364734","label":"kind"},{"id":"zone-1761585374837","label":"see"},{"id":"zone-1761585379067","label":"tree"},{"id":"zone-1761585501769","label":"coat"}],"draggableItems":[{"id":"item-1761585270245","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761585269281-image.png","type":"image"},"correctZone":"zone-1761585228817"},{"id":"item-1761585312223","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761585311459-image.png","type":"image"},"correctZone":"zone-1761585299384"},{"id":"item-1761585394144","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761585393389-image.png","type":"image"},"correctZone":"zone-1761585354943"},{"id":"item-1761585407151","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761585406720-image.png","type":"image"},"correctZone":"zone-1761585341959"},{"id":"item-1761585414841","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761585414441-image.png","type":"image"},"correctZone":"zone-1761585359747"},{"id":"item-1761585423331","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761585422834-image.png","type":"image"},"correctZone":"zone-1761585364734"},{"id":"item-1761585435313","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761585434576-image.png","type":"image"},"correctZone":"zone-1761585374837"},{"id":"item-1761585442883","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761585442401-image.png","type":"image"},"correctZone":"zone-1761585379067"},{"id":"item-1761585518969","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761585518221-image.png","type":"image"},"correctZone":"zone-1761585276767"}],"allowMultiplePerZone":false}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T17:24:23.914744+00:00', '2025-10-27T17:25:27.023899+00:00', '{}'::jsonb, 'When a correct match is made, the paired icons link with a colored rope animation ', NULL, NULL, NULL, 3, '8b2ba6b9-cb90-4cf9-97a1-3fc116ea72ec', NULL, 'match', 70),
  ('66515740-6011-47e0-8fcf-5c372ef82d60', 'lesson', 'lesson', 'DOMINIO 1: Fonética y Conciencia Fonológica NEW', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Segmentar y combinar sílabas para leer palabras correctamente.\nEjemplos de actividades:\nDrag & Drop\t“Arrastra las sílabas para formar la palabra correcta: CA, SA, TA → ¿Cuál forma casa?”\t“¡Muy bien! Ca + sa = casa. Cada parte tiene un sonido.”\nSelección múltiple auditiva\t“Escucha: chaqueta. ¿Qué sílaba escuchas al principio?” (cha / que / ta)\t“¡Correcto! La palabra comienza con cha.”\nSí/No\t“¿La palabra carro tiene una o dos sílabas?”\t“Correcto, carro tiene dos sílabas: ca-rro.”\nLlenar blanco\t“Completa la palabra: sa → ma_, ca__, ca__”\t“Excelente, completaste masa, casa, cama.”\n\n\n\n"}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T17:23:04.847525+00:00', '2025-10-27T17:48:29.039122+00:00', '{}'::jsonb, 'Hola, hoy aprenderás qué es una sílaba.
Una sílaba es un sonido o grupo de sonidos que se pronuncian en una sola emisión de voz.
Vamos a escuchar, repetir y formar palabras con las sílabas ma, me, mi, mo, mu.
 
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('8b2ba6b9-cb90-4cf9-97a1-3fc116ea72ec', 'lesson', 'lesson', 'Phonics & Sound Awareness ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Recognize and produce rhyming words; distinguish long and short vowel sounds.\n"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T17:19:03.387741+00:00', '2025-10-27T17:19:03.387741+00:00', '{}'::jsonb, '🔊 to hear the first word. Then choose or drag the word that rhymes with it.', NULL, '#	Target Word 🔊	🎮 Choices	✅ Correct Answer	🎧 AI Audio & Feedback
	boat	
a. coat 
b.  ball 
c. cup	✅ c. coat	AI prompt: “Boat–coat rhyme! They both end with /-oat/.”
	bay	
a.  day 
b. dog 
c. big
	✅ a. day	AI prompt: “Bay and day rhyme with the long a sound.”
8frog	a. log 
b.  fish 
c. fan	✅ a. log	AI prompt: “Good! Frog–log share the /-og/ sound.”
wind	
a. kind  
b. run 
c. tag
	✅ a. kind	AI prompt: “Wind and kind sound alike at the end: /-ind/.”
	see	
a. tree  
b. top 
c. can	✅ a. tree	AI prompt: “Yes! See and tree rhyme with the long e sound.”
', NULL, 3, NULL, NULL, NULL, 70),
  ('dd485019-9bb7-4e06-95e1-d68f9f730b40', 'exercise', 'drag_drop', 'Listen & Select', NULL, '{"mode":"match","question":"Drag the picture to match the word.","dropZones":[{"id":"zone-1761584460909","label":"mountain"},{"id":"zone-1761584495535","label":"wave"},{"id":"zone-1761584876844","label":"sun"}],"draggableItems":[{"id":"item-1761584491861","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761584491494-image.png","type":"image"},"correctZone":"zone-1761584460909"},{"id":"item-1761584507656","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761584507184-image.png","type":"image"},"correctZone":"zone-1761584495535"},{"id":"item-1761584521929","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761584521523-image.png","type":"image"},"correctZone":"zone-1761584876844"}],"allowMultiplePerZone":true}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T17:08:59.736442+00:00', '2025-10-27T17:16:10.114933+00:00', '{}'::jsonb, '“Great! The word sparkle means to shine brightly!”
“Yes! The coquí is Puerto Rico’s little singing frog.”
', NULL, NULL, NULL, 3, NULL, NULL, 'match', 70),
  ('d5d1a946-9f3c-49cc-a404-7d4a4b1eef21', 'exercise', 'multiple_choice', 'Tap 🔊 each word to hear it. Then choose its meaning.  ', NULL, '{"answers":[{"text":"bird","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761584169359-image.png","isCorrect":false},{"text":"fish","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761584192572-image.png","isCorrect":false},{"text":"a small frog that sings at night ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761584206280-image.png","isCorrect":true}],"question":"coquí 🔊 What does it mean?” "}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T17:03:48.167315+00:00', '2025-10-27T17:03:48.167315+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'b4e045f1-038e-4790-a25b-4d9a94ae816e', NULL, NULL, 70),
  ('db7d39f7-b939-4f1c-86b6-b02aa53ecdad', 'exercise', 'multiple_choice', 'Tap 🔊 each word to hear it. Then choose its meaning.  ', NULL, '{"answers":[{"text":"growing","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761584075835-image.png","isCorrect":false},{"text":"hiding","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761584104276-image.png","isCorrect":false},{"text":"to shine brightly     ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761584116280-image.png","isCorrect":true}],"question":"sparkle 🔊 What does it mean?” "}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T17:02:07.415151+00:00', '2025-10-27T17:02:07.415151+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'b4e045f1-038e-4790-a25b-4d9a94ae816e', NULL, NULL, 70),
  ('47d420b3-3fe8-4779-a1d4-a648345dbc72', 'exercise', 'multiple_choice', 'Tap 🔊 each word to hear it. Then choose its meaning.  ', NULL, '{"answers":[{"text":"to stay on top of water ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761583996952-image.png","isCorrect":true},{"text":"under the sea ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761584009457-image.png","isCorrect":false},{"text":"flying high ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761584021216-image.png","isCorrect":false}],"question":"float 🔊 What does it mean?”  "}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T17:00:32.829658+00:00', '2025-10-27T17:00:32.829658+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'b4e045f1-038e-4790-a25b-4d9a94ae816e', NULL, NULL, 70),
  ('7aea0893-326b-4291-888d-71c79d59c841', 'exercise', 'multiple_choice', 'Tap 🔊 each word to hear it. Then choose its meaning.  ', NULL, '{"answers":[{"text":"soft wind ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761583901163-image.png","isCorrect":true},{"text":"bird","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761583918808-image.png","isCorrect":false},{"text":"toy","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761583934240-image.png","isCorrect":false}],"question":"breeze  🔊 What does it mean?”  "}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T16:58:59.965841+00:00', '2025-10-27T16:58:59.965841+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'b4e045f1-038e-4790-a25b-4d9a94ae816e', NULL, NULL, 70),
  ('d633e0e2-da19-487d-bbf3-8eafe2bb54de', 'lesson', 'lesson', 'Lectura rápida', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Escucha la palabra. Luego repite con tu voz. Después, lee la oración en voz alta."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T14:37:39.068+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T14:37:41.715498+00:00', '2025-10-27T14:37:41.715498+00:00', '{}'::jsonb, 'Objetivo: Escuchar, leer y pronunciar correctamente palabras y oraciones cortas de uso diario.
Escucha la palabra. Luego repite con tu voz. Después, lee la oración en voz alta.
Paso 1 – Escucha
🔊 Audio modelo: “sol”
🔊 Narrador: Escucha: … sol.
Paso 2 – Repite
🔊 Instrucción: “Ahora tú. Di: sol.
IA analiza pronunciación.
🔊 Refuerzo: “¡Excelente! Dijiste sol correctamente.”
Paso 3 – Lee en contexto
Oración en pantalla:
🔊 “El sol brilla.” 
🔊 Ahora te toca a ti 
           “El sol brilla.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('f6a29d96-c843-41fd-b293-f83ff163fce8', 'exercise', 'multiple_choice', 'Tap 🔊 each word to hear it. Then choose its meaning. ', NULL, '{"answers":[{"text":"🔊 curved water near land ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761575043361-image.png","isCorrect":false},{"text":"🔊 mountain ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761575083469-image.png","isCorrect":false},{"text":"🔊 a place where the sea curves near land ","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761575241909-image.png","isCorrect":true}],"question":" 🔊 bay  🔊 What does it mean?” "}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T14:33:41.795932+00:00', '2025-10-27T14:34:07.615827+00:00', '{}'::jsonb, 'Interactive Word Set', NULL, NULL, NULL, 3, 'b4e045f1-038e-4790-a25b-4d9a94ae816e', NULL, NULL, 70),
  ('3df2976c-fd97-420f-b11c-6711bb947763', 'exercise', 'drag_drop', 'Forma la palabra 3', NULL, '{"mode":"letters","question":"Escucha los sonidos y forma la palabra.","targetWord":"brazo","autoShuffle":true,"questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761573930951-image.png","availableLetters":["b","r","a","z","o","l","n"]}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T14:30:24.174+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T14:09:03.199731+00:00', '2025-10-27T14:30:26.78961+00:00', '{}'::jsonb, 'Lee la palabra.
brazo 
Lee la palabra, no deletrees.
¡Excelente trabajo, detective de las palabras!
 Has unido los sonidos para formar palabras nuevas.
¡Cada letra te acerca más a leer tus primeros cuentos!
', NULL, NULL, NULL, 3, 'b3fd768e-2104-4b7c-bed0-a460e086cce8', NULL, 'letters', 70),
  ('d29690fc-9c19-40b9-8d50-3dd4771f8688', 'exercise', 'drag_drop', 'Forma la palabra 2', NULL, '{"mode":"letters","question":"Escucha los sonidos y forma la palabra.","targetWord":"dedo","autoShuffle":true,"questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761573534856-image.png","availableLetters":["d","e","d","o","b","p"]}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T14:31:20.664+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T14:00:17.006874+00:00', '2025-10-27T14:31:22.72213+00:00', '{}'::jsonb, 'Lee la palabra.
dedo
Lee la palabra, no deletrees.
¡Excelente trabajo, detective de las palabras!
 Has unido los sonidos para formar palabras nuevas.
¡Cada letra te acerca más a leer tus primeros cuentos!
', NULL, NULL, NULL, 3, 'b3fd768e-2104-4b7c-bed0-a460e086cce8', NULL, 'letters', 70),
  ('ce2bb239-b164-4bbe-96ec-0147b77ff7af', 'exercise', 'drag_drop', 'Forma la palabra 1', NULL, '{"mode":"letters","question":" Escucha los sonidos y forma la palabra.\n","targetWord":"té","autoShuffle":true,"questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761573282796-image.png","availableLetters":["t","é","s"]}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T14:32:32.775+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T13:55:32.729181+00:00', '2025-10-27T14:32:34.844012+00:00', '{}'::jsonb, 'Lee la palabra.
té
Lee la palabra, no deletrees.
¡Excelente trabajo, detective de las palabras!
 Has unido los sonidos para formar palabras nuevas.
¡Cada letra te acerca más a leer tus primeros cuentos!

', NULL, NULL, NULL, 3, 'b3fd768e-2104-4b7c-bed0-a460e086cce8', NULL, 'letters', 70),
  ('b4e045f1-038e-4790-a25b-4d9a94ae816e', 'lesson', 'lesson', 'The Little Boat in the Bay', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Read a short story about a boy and his paper boat in a Puerto Rican bay.\nIdentify characters, setting, and sequence; practice rhyming words; and answer questions about the text.\n\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761572887101-image.png"}'::jsonb, 2, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T13:55:18.727433+00:00', '2025-10-27T18:08:16.627469+00:00', '{}'::jsonb, '🔊 AI Narration Cue
Listen carefully to the story. I’ll read it for you. Watch the pictures and pay attention to what happens next.
📖 Narrated Story (Text + Audio Integration)
Paragraph 1 – Setting Introduction
The morning sun ☀️ rose over the blue bay. Mateo and his grandfather stood near the wooden dock. They had made a small paper boat with a bright red star on top. [PAUSE 2 s]
Paragraph 2 – Action Begins
“Let’s see if it floats!” said Mateo. He placed the little boat in the water and watched it move slowly away. The waves 🌊 were soft and made tiny splashes around the boat. [PAUSE 3 s]
Paragraph 3 – Problem and Emotion
Suddenly, a breeze 💨 blew hard, and the boat drifted farther from the dock. Mateo felt worried 😟. “Abuelo, the boat is going away!” he said. [PAUSE 2 s]
Paragraph 4 – Resolution and Lesson
Grandfather smiled 🙂. “It’s okay, Mateo. Look, the boat is sailing to new places. Maybe it will find another child who needs a friend.” They watched the boat until it disappeared behind the rocks ⛰️. Mateo smiled too and waved good-bye. 👋 [PAUSE 3 s]
', NULL, 'Standard: 2.L.4 a–c – Determine or clarify the meaning of new words using context, pictures, and audio cues.
Level: Below Grade | ESL | PRDE English Standards
Mode: 🎧 Listen 🧩 Tap 🎮 Drag & Drop

Students will demonstrate understanding of a short narrative by identifying key story elements, recognizing sound–symbol patterns, and responding to comprehension questions using AI-based interactive tasks.', NULL, 3, NULL, NULL, NULL, 70),
  ('b3fd768e-2104-4b7c-bed0-a460e086cce8', 'lesson', 'lesson', 'Forma la palabra', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Escucha los sonidos. Arrastra las letras para formar la palabra correcta."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T13:52:35.986+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T13:50:43.597049+00:00', '2025-10-27T13:52:38.488509+00:00', '{}'::jsonb, '“Forma la palabra”
Elemento	Descripción detallada
Nombre de la actividad	Forma la palabra
Dominio	Fonética y decodificación
Objetivo de aprendizaje	Reconocer los sonidos de las letras (fonemas) y combinarlos para formar palabras simples (CV, CVC).
Instrucción al estudiante	“Escucha los sonidos. Arrastra las letras para formar la palabra correcta.”
Tecnología / IA aplicada	<ul><li>Audio modelo: reproduce los sonidos individuales (/s/ + /o/ + /l/).</li><li>Reconocimiento de secuencia: IA detecta si las letras se colocan en orden correcto.</li><li>Retroalimentación adaptativa: si hay error, repite el sonido incorrecto y muestra una pista visual (resaltado o vibración).</li></ul>
Evidencia de aprendizaje	<ul><li>Nivel de aciertos en decodificación.</li><li>Tiempo promedio de formación.</li><li>Número de intentos por palabra.</li></ul>


Objetivo: Reconocer los sonidos de las letras (fonemas) y combinarlos para formar palabras simples (CV, CVC).


Introducción – Actividad “Forma la palabra”
🔊 Hoy vas a jugar con los sonidos y las letras.

🔊 Escucharás los sonidos de una palabra y tu misión será formarla con las letras correctas.
🔊 Primero escucha con atención.
🔊 Luego arrastra las letras en orden.
🔊 Y por último, lee la palabra en voz alta.

🔊 Cuando unes los sonidos, ¡las letras se transforman en palabras mágicas! 

🔊¿Listo para formar tus primeras palabras y leer como un detective de la lectura?

Modo de presentación en la plataforma
Pantalla 1 – Instrucción visual y auditiva:
🔊 Escucha los sonidos y forma la palabra.”
🔊 Audio: /m/ … /a/ … /r/

Pantalla 2 – Repetición auditiva:
 🔊 mar
 🔊 Ahora repite tú.
Recompensa visual (estrella o aplauso animado).
Sugerencias visuales
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('4a92b2de-65af-4907-8842-a4e959cc0213', 'exercise', 'multiple_choice', 'Identificación de pausas', NULL, '{"answers":[{"text":"Antes de “colmenas” ","imageUrl":null,"isCorrect":true},{"text":"Después de “miel” ","imageUrl":null,"isCorrect":false},{"text":"Antes de “Las”","imageUrl":null,"isCorrect":false}],"question":"En la oración: Las abejas son insectos, viven en colmenas y producen miel,\n¿Dónde hay que hacer una pausa?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T13:41:07.865+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T13:23:41.299596+00:00', '2025-10-27T13:41:09.849452+00:00', '{}'::jsonb, 'Ejercicio 7 – Identificación de pausas
🔊 “En la oración: Las abejas son insectos, viven en colmenas y producen miel,
¿Dónde hay que hacer una pausa?”
a) Antes de “colmenas” ✅ 
b) Después de “miel” 
c) Antes de “Las”
Retroalimentación:
✅ “Muy bien. La coma indica una pausa breve.”
❌ “Revisa el signo de puntuación: la coma marca la pausa.”
No digas la respuesta. 
La respuesta es: Antes de “colmenas”.
', NULL, NULL, NULL, 3, '437ce839-0b30-40c6-956c-c0d5b1cf0981', NULL, NULL, 70),
  ('bd3ad42a-831e-4063-8e48-a9b9c0e40eca', 'exercise', 'multiple_choice', 'Ritmo lector', NULL, '{"answers":[{"text":" 1","imageUrl":null,"isCorrect":false},{"text":" 2 ","imageUrl":null,"isCorrect":true},{"text":" 3","imageUrl":null,"isCorrect":false}],"question":" ¿Cuántas pausas escuchaste?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T13:30:59.58+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T13:18:25.852328+00:00', '2025-10-27T13:31:01.760587+00:00', '{}'::jsonb, 'Ejercicio 3 – Ritmo lector
🔊 “Escucha: El sol brillaba, los pájaros cantaban, y Tomás sonreía feliz.
¿Cuántas pausas escuchaste?”
a) 1
b) 2 ✅ 
c) 3
Retroalimentación:
✅ “Correcto. Hay dos comas, dos pausas suaves.”
❌ “Vuelve a escuchar. Cada coma indica una pausa corta.”
No digas la respuesta. 
La respuesta es: 2', NULL, NULL, NULL, 3, '437ce839-0b30-40c6-956c-c0d5b1cf0981', NULL, NULL, 70),
  ('ea84e2cd-5fe1-4fd4-a7a8-9b8e856f8a35', 'exercise', 'multiple_choice', 'Comprensión auditiva básica', NULL, '{"answers":[{"text":"Un árbol ","imageUrl":null,"isCorrect":false},{"text":"Un dibujo con flores y un corazón","imageUrl":null,"isCorrect":true},{"text":"Un juguete","imageUrl":null,"isCorrect":false}],"question":"¿Qué dibujó Tomás para su abuela?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T12:59:11.51+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T12:59:13.997059+00:00', '2025-10-27T12:59:13.997059+00:00', '{}'::jsonb, 'Ejercicio 1 – Comprensión auditiva básica
Pregunta:
“¿Qué dibujó Tomás para su abuela?”
a) Un árbol 
b) Un dibujo con flores y un corazón ✅ 
c) Un juguete
Retroalimentación:
✅ “¡Excelente! Escuchaste con atención los detalles.”
❌ “Repite la lectura y busca lo que Tomás hizo para su abuela.”
No digas la respuesta. 
Respuesta correcta es: Un dibujo con flores y un corazón ', NULL, NULL, NULL, 3, '437ce839-0b30-40c6-956c-c0d5b1cf0981', NULL, NULL, 70),
  ('437ce839-0b30-40c6-956c-c0d5b1cf0981', 'lesson', 'lesson', 'FLUIDEZ LECTORA GUIADA Y AUTÓNOMA', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"La fluidez lectora no es solo leer rápido, es leer con sentido, respetando los signos de puntuación, y mostrando cómo se sienten los personajes o las ideas.\nLas comas (,) nos indican una pausa corta, y los puntos (.) nos dicen que debemos detenernos por un momento antes de continuar."}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T12:56:30.317+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T12:56:32.422414+00:00', '2025-10-27T12:56:32.422414+00:00', '{}'::jsonb, '🎯 Destreza y objetivos alineados a los estándares DEPR
🎙️ Explicación con voz IA (👂 escuchar / 📖 leer)
🧩 Ejercicios básicos (5) e intermedios (5)
💬 Retroalimentación IA programada (correcta / incorrecta)
📚 Lecturas temáticas breves (ciencia, estudios sociales y socioemocional)
🎙️ INTRODUCCIÓN IA (voz narradora)
🔊 “Bienvenido a tu práctica de fluidez lectora.
Hoy aprenderás a leer con ritmo, precisión y emoción.
La fluidez lectora no es solo leer rápido, es leer con sentido, respetando los signos de puntuación, y mostrando cómo se sienten los personajes o las ideas.
Usa 🔊 para escuchar la lectura modelo y 📖 para leer tú.
¡Prepárate para leer como un verdadero narrador!”
🌱 Parte 1: FLUIDEZ BÁSICA – Lectura guiada con IA
🎯 Destreza:
🔊 Leer con precisión y ritmo adecuado, reconociendo signos de puntuación y pausas naturales.
Explicación breve IA
🔊 “Cuando leemos en voz alta, debemos hacerlo con ritmo, no muy rápido ni muy lento.
Las comas (,) nos indican una pausa corta, y los puntos (.) nos dicen que debemos detenernos por un momento antes de continuar.
🔊 Escucha el siguiente texto y fíjate en cómo cambia la voz en cada parte.”
🌻 Lectura 1 – Texto narrativo corto (socioemocional)
Título: El regalo de Tomás 
🔊 “Tomás quería sorprender a su abuela con un dibujo.
Dibujó flores, un sol brillante y un corazón enorme.
Cuando se lo entregó, la abuela sonrió y lo abrazó con cariño.”
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('c7d2a6cb-6b34-4030-94e9-0f7bb72465c0', 'exercise', 'drag_drop', 'Drag and Roll', NULL, '{"mode":"letters","question":"“Arrastra las sílabas para formar la palabra mariposa.”","targetWord":"mariposa","autoShuffle":true,"availableLetters":["m","a","r","i","p","o","s","a","t","c","l","d"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T12:50:54.862+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T12:50:28.983211+00:00', '2025-10-27T12:50:56.834592+00:00', '{}'::jsonb, 'Ejercicio 2 – Drag and Roll
🔊 “Arrastra las sílabas para formar la palabra mariposa.”
[ma] [ri] [po] [sa]
Retroalimentación:
“Excelente. Ma-ri-po-sa tiene cuatro sílabas.”
 “Intenta otra vez. Cada sílaba tiene una vocal.”
No digas la respuesta. 
', NULL, NULL, NULL, 3, 'e0ec5c6f-5373-4959-89d0-dedd1ffeff9f', NULL, 'letters', 70),
  ('3ee4a255-116c-477a-8a65-61dfae099219', 'exercise', 'multiple_choice', 'Identificar número de sílabas', NULL, '{"answers":[{"text":"Dos ","imageUrl":null,"isCorrect":false},{"text":"Tres","imageUrl":null,"isCorrect":true},{"text":"Cuatro","imageUrl":null,"isCorrect":false}],"question":"¿Cuántas sílabas tiene montaña?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T12:43:09.756+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T12:43:11.822716+00:00', '2025-10-27T12:43:11.822716+00:00', '{}'::jsonb, '“La palabra montaña tiene sonidos suaves. Escúchala.”
“mon-ta-ña”
Pregunta:
“¿Cuántas sílabas tiene montaña?”
a) Dos 
b) Tres  
c) Cuatro
Retroalimentación IA:
“¡Muy bien! Mon-ta-ña tiene tres sílabas.”
“Escucha otra vez. Divide en partes: mon... ta... ña.”
No digas la contestación. 
La contestación correcta es: Tres ', NULL, NULL, NULL, 3, 'e0ec5c6f-5373-4959-89d0-dedd1ffeff9f', NULL, NULL, 70),
  ('036cc8d6-5f15-4e04-9615-d6347cc38bed', 'exercise', 'multiple_choice', 'Escucha y elige el sonido inicial', NULL, '{"answers":[{"text":"/p/","imageUrl":null,"isCorrect":false},{"text":"/pl/","imageUrl":null,"isCorrect":true},{"text":"/t/","imageUrl":null,"isCorrect":false}],"question":"Escucha la palabra: planta ¿Con qué sonido comienza?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T12:33:08.943+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T12:32:03.750411+00:00', '2025-10-27T12:33:10.924499+00:00', '{}'::jsonb, 'Ejercicio 1: Escucha y elige el sonido inicial
Escucha la palabra: planta
¿Con qué sonido comienza?
No quiero que digas la respuesta. 
La respuesta es: /pl/', NULL, NULL, NULL, 3, 'e0ec5c6f-5373-4959-89d0-dedd1ffeff9f', NULL, NULL, 70),
  ('d57092c2-8b61-4362-a18c-73e6fb331be9', 'exercise', 'multiple_choice', 'Escucha y elige el sonido inicial', NULL, '{"answers":[{"text":"/p/","imageUrl":null,"isCorrect":false},{"text":"/pl/","imageUrl":null,"isCorrect":true},{"text":"/t/","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sonido comienza?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T12:26:00.772+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T12:26:03.146392+00:00', '2025-10-27T12:26:03.146392+00:00', '{}'::jsonb, 'Ejercicio 1: Escucha y elige el sonido inicial
Escucha la palabra: planta
No quiero que des la respuesta. 
La respuesta es: /pl/', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, NULL, 70),
  ('e0ec5c6f-5373-4959-89d0-dedd1ffeff9f', 'lesson', 'lesson', 'Conciencia fonológica y fonética avanzada', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo general Reforzar la comprensión de la relación entre letras y sonidos y la habilidad para reconocer, segmentar y manipular sílabas y fonemas en palabras más complejas, incluyendo el uso de prefijos y sufijos comunes, para fortalecer la lectura precisa y fluida."}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-27T12:22:37.236+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-27T12:22:39.424084+00:00', '2025-10-27T12:22:39.424084+00:00', '{}'::jsonb, 'Objetivo general Reforzar la comprensión de la relación entre letras y sonidos y la habilidad para reconocer, segmentar y manipular sílabas y fonemas en palabras más complejas, incluyendo el uso de prefijos y sufijos comunes, para fortalecer la lectura precisa y fluida.
¡Hola! Hoy vamos a usar nuestros oídos para escuchar con atención las palabras.
Las palabras están formadas por sonidos. Cada sonido nos ayuda a reconocer, leer y escribir mejor.
Cuando aprendemos a escuchar los sonidos con cuidado, podemos notar si dos palabras comienzan, terminan o suenan parecido.
Escuchar los sonidos es el primer paso para ser mejores lectores y escritores.
Cada palabra tiene sonidos que escuchamos al inicio, en el medio y al final.
El sonido inicial es el que escuchas primero.
El sonido del medio está entre otros sonidos.
El sonido final es el último que escuchas.
Por ejemplo:
Planta → comienza con /pl/
Brisa → tiene /r/ en el medio
Cristal → termina con /l/
Escuchar los sonidos te ayuda a leer mejor porque puedes reconocer cómo se escriben las palabras.
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('e7713b5d-a2ae-4de1-bfc9-7667fef17180', 'exercise', 'true_false', 'Verdadero o Falso: Inferencias', 'Verifica tu conocimiento sobre inferencias', '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":false},{"text":"Falso","imageUrl":null,"isCorrect":true}],"question":"Para hacer una inferencia, solo necesitas leer el texto, no necesitas usar lo que ya sabes","questionImage":null}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:36.468606+00:00', '2025-10-26T23:17:36.468606+00:00', '{}'::jsonb, 'Lee la afirmación sobre inferencias. Piensa en lo que aprendiste para decidir si es verdadera o falsa.', NULL, NULL, '[]'::jsonb, 3, '207d7cf7-be7b-493a-8065-119dac95658c', 6, NULL, 70),
  ('e954c073-07b4-4900-8c2f-dedd9214576d', 'exercise', 'drag_drop', 'Ordena el proceso de inferencia', 'Organiza los pasos para hacer una buena inferencia', '{"mode":"sequence","question":"Ordena los pasos para hacer una inferencia:","autoShuffle":true,"draggableItems":[{"id":"1","type":"text","content":"1. Lee el texto con atención"},{"id":"2","type":"text","content":"2. Busca pistas importantes"},{"id":"3","type":"text","content":"3. Usa lo que ya sabes"},{"id":"4","type":"text","content":"4. Haz tu inferencia"}],"targetSequence":["1. Lee el texto con atención","2. Busca pistas importantes","3. Usa lo que ya sabes","4. Haz tu inferencia"]}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:34.031718+00:00', '2025-10-26T23:17:34.031718+00:00', '{}'::jsonb, 'Arrastra los pasos en el orden correcto. Para hacer una buena inferencia, primero lees, luego buscas pistas, usas lo que sabes y finalmente haces tu inferencia.', NULL, NULL, '[]'::jsonb, 3, '207d7cf7-be7b-493a-8065-119dac95658c', 5, NULL, 70),
  ('9582b6fd-8b43-4f12-bd95-26ceda4cbfa3', 'exercise', 'fill_blank', 'Propósito del autor', 'Identifica por qué el autor escribió el texto', '{"mode":"single_word","prompt":"Lee: ''Los dinosaurios vivieron hace millones de años. Había muchos tipos diferentes.'' El propósito es _____","target":"informar","letters":["i","n","f","o","r","m","a","r"],"imageUrl":"https://images.pexels.com/photos/3839557/pexels-photo-3839557.jpeg?auto=compress&cs=tinysrgb&h=350","autoShuffle":true}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:31.568347+00:00', '2025-10-26T23:17:31.568347+00:00', '{}'::jsonb, 'Piensa: ¿Por qué escribió esto el autor? Puede ser para informar (enseñar), entretener (divertir) o persuadir (convencer).', NULL, NULL, '[]'::jsonb, 3, '207d7cf7-be7b-493a-8065-119dac95658c', 4, NULL, 70),
  ('138e9a8e-2bf8-4199-b907-4c8df5d459c6', 'exercise', 'multiple_choice', 'Predice qué sucederá', 'Usa pistas para hacer una predicción', '{"answers":[{"text":"Va a llover","imageUrl":null,"isCorrect":true},{"text":"Hará mucho calor","imageUrl":null,"isCorrect":false},{"text":"Saldrá el sol","imageUrl":null,"isCorrect":false},{"text":"Nevará","imageUrl":null,"isCorrect":false}],"question":"Lee: ''El cielo está lleno de nubes oscuras. Hace mucho viento y truena.'' ¿Qué sucederá probablemente?","questionImage":null}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:29.502254+00:00', '2025-10-26T23:17:29.502254+00:00', '{}'::jsonb, 'Lee el texto y las pistas. Usa lo que sabes para predecir qué sucederá después. Las predicciones son como adivinanzas inteligentes basadas en evidencia.', NULL, NULL, '["predicción","nubes","oscuras"]'::jsonb, 3, '207d7cf7-be7b-493a-8065-119dac95658c', 3, NULL, 70),
  ('ae385b07-c812-4877-8e71-ec11b35d9da4', 'exercise', 'drag_drop', 'Causa y Efecto', 'Conecta las causas con sus efectos', '{"mode":"match","question":"Une cada CAUSA con su EFECTO:","dropZones":[{"id":"efecto1","label":"Sacó buena nota"},{"id":"efecto2","label":"Tiene hambre"},{"id":"efecto3","label":"Se siente fuerte"}],"draggableItems":[{"id":"1","type":"text","content":"Estudió mucho","correctZone":"efecto1"},{"id":"2","type":"text","content":"No desayunó","correctZone":"efecto2"},{"id":"3","type":"text","content":"Hizo ejercicio","correctZone":"efecto3"}],"allowMultiplePerZone":false}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:27.369713+00:00', '2025-10-26T23:17:27.369713+00:00', '{}'::jsonb, 'Arrastra cada causa a su efecto correcto. La causa es lo que hace que algo suceda, y el efecto es lo que sucede como resultado.', NULL, NULL, '["causa","efecto"]'::jsonb, 3, '207d7cf7-be7b-493a-8065-119dac95658c', 2, NULL, 70),
  ('eac6193a-d777-44a4-8ad0-9e7190df569f', 'exercise', 'multiple_choice', 'Haz una inferencia', 'Usa pistas para descubrir información no escrita', '{"answers":[{"text":"Estaba lloviendo afuera","imageUrl":null,"isCorrect":true},{"text":"Ana iba a nadar","imageUrl":null,"isCorrect":false},{"text":"Hacía mucho calor","imageUrl":null,"isCorrect":false},{"text":"Ana estaba feliz","imageUrl":null,"isCorrect":false}],"question":"Lee: ''Ana entró empapada a la casa y cerró su paraguas.'' ¿Qué puedes inferir?","questionImage":null}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:23.529378+00:00', '2025-10-26T23:17:23.529378+00:00', '{}'::jsonb, 'Lee el texto y usa las pistas para inferir información que no está escrita directamente. Piensa en lo que ya sabes y combínalo con las pistas del texto.', NULL, NULL, '["inferir","pistas","empapada","paraguas"]'::jsonb, 3, '207d7cf7-be7b-493a-8065-119dac95658c', 1, NULL, 70),
  ('66f0207a-7dc5-49e5-92fd-9479be50740b', 'exercise', 'true_false', 'Verdadero o Falso: Comprensión', 'Verifica si entendiste el texto', '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":false},{"text":"Falso","imageUrl":null,"isCorrect":true}],"question":"Lee: ''El gato subió al árbol.'' ¿Verdadero o falso? ''El perro subió al árbol.''","questionImage":"https://images.pexels.com/photos/34450710/pexels-photo-34450710.jpeg?auto=compress&cs=tinysrgb&h=350"}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:21.373592+00:00', '2025-10-26T23:17:21.373592+00:00', '{}'::jsonb, 'Lee el texto y la afirmación. Decide si es verdadera o falsa basándote en lo que dice el texto.', NULL, NULL, '[]'::jsonb, 3, '8a7cb3ce-1773-4c44-92be-3433c343636f', 6, NULL, 70),
  ('81d37259-d8b0-4ed4-bd6b-4ceafe37c3f0', 'exercise', 'drag_drop', 'Empareja preguntas con respuestas', 'Une cada pregunta con su respuesta del texto', '{"mode":"match","question":"Empareja cada pregunta con su respuesta:","dropZones":[{"id":"quien","label":"¿Quién?"},{"id":"que","label":"¿Qué?"},{"id":"donde","label":"¿Dónde?"},{"id":"porque","label":"¿Por qué?"}],"draggableItems":[{"id":"1","type":"text","content":"Pedro","correctZone":"quien"},{"id":"2","type":"text","content":"Comió pizza","correctZone":"que"},{"id":"3","type":"text","content":"En el restaurante","correctZone":"donde"},{"id":"4","type":"text","content":"Porque tenía hambre","correctZone":"porque"}],"allowMultiplePerZone":false}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:18.629618+00:00', '2025-10-26T23:17:18.629618+00:00', '{}'::jsonb, 'Lee el texto: ''Pedro comió pizza ayer en el restaurante porque tenía hambre.'' Arrastra cada respuesta a su pregunta correcta.', NULL, NULL, '[]'::jsonb, 3, '8a7cb3ce-1773-4c44-92be-3433c343636f', 5, NULL, 70),
  ('8dd36ddc-70d0-417a-95b0-ea020c07209e', 'exercise', 'multiple_choice', 'Encuentra la idea principal', 'Identifica de qué trata el texto', '{"answers":[{"text":"Los perros son mascotas leales","imageUrl":null,"isCorrect":true},{"text":"A los perros les gusta correr","imageUrl":null,"isCorrect":false},{"text":"Los perros juegan mucho","imageUrl":null,"isCorrect":false},{"text":"Las personas tienen mascotas","imageUrl":null,"isCorrect":false}],"question":"Lee: ''Los perros son mascotas leales. Les gusta jugar y correr. Son buenos amigos de las personas.'' ¿Cuál es la idea principal?","questionImage":null}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:16.048437+00:00', '2025-10-26T23:17:16.048437+00:00', '{}'::jsonb, 'Lee el texto completo y piensa: ¿De qué trata principalmente? La idea principal es el tema más importante del texto.', NULL, NULL, '["perros","mascotas","leales"]'::jsonb, 3, '8a7cb3ce-1773-4c44-92be-3433c343636f', 4, NULL, 70),
  ('10b94497-f12a-4675-b92e-1dd61ee87a32', 'exercise', 'fill_blank', '¿Dónde sucede?', 'Identifica el lugar de los eventos', '{"mode":"single_word","prompt":"Lee: ''Los niños juegan en el parque.'' ¿Dónde juegan? En el _____","target":"parque","letters":["p","a","r","q","u","e"],"imageUrl":"https://images.pexels.com/photos/34431929/pexels-photo-34431929.jpeg?auto=compress&cs=tinysrgb&h=350","autoShuffle":true}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:13.670135+00:00', '2025-10-26T23:17:13.670135+00:00', '{}'::jsonb, 'Completa la respuesta a la pregunta ¿Dónde? Busca en el texto el lugar donde sucede la acción.', NULL, NULL, '[]'::jsonb, 3, '8a7cb3ce-1773-4c44-92be-3433c343636f', 3, NULL, 70),
  ('6b0f4a25-6f72-4f5f-8ff2-50a358ad1df9', 'exercise', 'drag_drop', 'Ordena los eventos', 'Pon los eventos en secuencia correcta', '{"mode":"sequence","question":"Lee: ''Ana se despertó. Luego desayunó. Después se vistió. Finalmente salió a la escuela.'' Ordena:","autoShuffle":true,"draggableItems":[{"id":"1","type":"text","content":"Se despertó"},{"id":"2","type":"text","content":"Desayunó"},{"id":"3","type":"text","content":"Se vistió"},{"id":"4","type":"text","content":"Salió a la escuela"}],"targetSequence":["Se despertó","Desayunó","Se vistió","Salió a la escuela"]}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:11.519984+00:00', '2025-10-26T23:17:11.519984+00:00', '{}'::jsonb, 'Arrastra los eventos en el orden en que sucedieron. Busca palabras como ''primero'', ''luego'', ''después'' y ''finalmente'' que te dan pistas.', NULL, NULL, '["primero","luego","después","finalmente"]'::jsonb, 3, '8a7cb3ce-1773-4c44-92be-3433c343636f', 2, NULL, 70),
  ('af4d20d0-2656-4587-90e2-809a998f56db', 'exercise', 'multiple_choice', '¿Quién es el personaje?', 'Identifica los personajes en una historia', '{"answers":[{"text":"María","imageUrl":null,"isCorrect":true},{"text":"El bibliotecario","imageUrl":null,"isCorrect":false},{"text":"Juan","imageUrl":null,"isCorrect":false},{"text":"La maestra","imageUrl":null,"isCorrect":false}],"question":"Lee: ''María fue a la biblioteca y pidió un libro.'' ¿Quién fue a la biblioteca?","questionImage":null}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:08.985609+00:00', '2025-10-26T23:17:08.985609+00:00', '{}'::jsonb, 'Lee el texto con atención y responde: ¿Quién? Esta pregunta busca identificar los personajes o personas en la historia.', NULL, NULL, '["María","biblioteca"]'::jsonb, 3, '8a7cb3ce-1773-4c44-92be-3433c343636f', 1, NULL, 70),
  ('8cfc42e9-263e-46f5-9e09-f3d404292174', 'exercise', 'true_false', 'Verdadero o Falso: Vocabulario', 'Verifica tu conocimiento de sinónimos', '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"Las palabras ''pequeño'' y ''diminuto'' son sinónimos","questionImage":"https://images.pexels.com/photos/301448/pexels-photo-301448.jpeg?auto=compress&cs=tinysrgb&h=350"}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:06.379785+00:00', '2025-10-26T23:17:06.379785+00:00', '{}'::jsonb, 'Lee la afirmación sobre sinónimos. Usa lo que aprendiste para decidir si es verdadera o falsa.', NULL, NULL, '[]'::jsonb, 3, '11b4f381-62e4-4872-b32d-bacc1369fc9f', 6, NULL, 70),
  ('72ec4e04-8b20-41ab-9cb9-72bc2cbfd1ef', 'exercise', 'drag_drop', 'Clasifica sinónimos y antónimos', 'Identifica si las palabras son similares u opuestas', '{"mode":"match","question":"Clasifica cada par de palabras:","dropZones":[{"id":"sinonimos","label":"Sinónimos (similares)"},{"id":"antonimos","label":"Antónimos (opuestos)"}],"draggableItems":[{"id":"1","type":"text","content":"feliz - contento","correctZone":"sinonimos"},{"id":"2","type":"text","content":"alto - bajo","correctZone":"antonimos"},{"id":"3","type":"text","content":"grande - enorme","correctZone":"sinonimos"},{"id":"4","type":"text","content":"caliente - frío","correctZone":"antonimos"}],"allowMultiplePerZone":true}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:04.305996+00:00', '2025-10-26T23:17:04.305996+00:00', '{}'::jsonb, 'Arrastra cada par de palabras a la categoría correcta. ¿Son sinónimos (similares) o antónimos (opuestos)?', NULL, NULL, '[]'::jsonb, 3, '11b4f381-62e4-4872-b32d-bacc1369fc9f', 5, NULL, 70),
  ('c3ad8cb4-53e9-4304-ad3a-4f6ad8887dcc', 'exercise', 'multiple_choice', 'Lenguaje figurado', 'Interpreta comparaciones y expresiones', '{"answers":[{"text":"Muy veloz","imageUrl":null,"isCorrect":true},{"text":"Muy lento","imageUrl":null,"isCorrect":false},{"text":"Invisible","imageUrl":null,"isCorrect":false},{"text":"Muy fuerte","imageUrl":null,"isCorrect":false}],"question":"¿Qué significa ''rápido como el viento''?","questionImage":null}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:17:01.711765+00:00', '2025-10-26T23:17:01.711765+00:00', '{}'::jsonb, 'Lee la expresión figurada y piensa qué significa realmente. No es literal, es una comparación para describir algo.', NULL, NULL, '["rápido","viento"]'::jsonb, 3, '11b4f381-62e4-4872-b32d-bacc1369fc9f', 4, NULL, 70),
  ('a30f88fc-380a-42fd-ac17-651e58320782', 'exercise', 'drag_drop', 'Empareja antónimos', 'Une palabras con significados opuestos', '{"mode":"match","question":"Une cada palabra con su antónimo (opuesto):","dropZones":[{"id":"noche","label":"noche"},{"id":"frio","label":"frío"},{"id":"vacio","label":"vacío"}],"draggableItems":[{"id":"1","type":"text","content":"día","correctZone":"noche"},{"id":"2","type":"text","content":"caliente","correctZone":"frio"},{"id":"3","type":"text","content":"lleno","correctZone":"vacio"}],"allowMultiplePerZone":false}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:16:56.891181+00:00', '2025-10-26T23:16:56.891181+00:00', '{}'::jsonb, 'Arrastra cada palabra a su antónimo, la palabra que significa lo contrario. Por ejemplo, ''día'' es lo opuesto de ''noche''.', NULL, NULL, '["día","noche","caliente","frío"]'::jsonb, 3, '11b4f381-62e4-4872-b32d-bacc1369fc9f', 2, NULL, 70),
  ('36f4d969-1d41-4ece-a8d1-5d249a7465b2', 'exercise', 'multiple_choice', 'Encuentra el sinónimo', 'Identifica palabras con significados parecidos', '{"answers":[{"text":"contento","imageUrl":null,"isCorrect":true},{"text":"triste","imageUrl":null,"isCorrect":false},{"text":"enojado","imageUrl":null,"isCorrect":false},{"text":"cansado","imageUrl":null,"isCorrect":false}],"question":"¿Cuál es un sinónimo de ''feliz''?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761571769794-ChatGPT%20Image%20Oct%2027,%202025,%2009_29_21%20AM.png"}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'draft', NULL, 0, 0, NULL, 'f35ddca3-7a21-4173-8c03-0f9b1c80517e', '2025-10-26T23:16:52.102932+00:00', '2025-10-27T13:36:25.68496+00:00', '{}'::jsonb, 'Lee la palabra y busca su sinónimo, una palabra que significa algo muy parecido. Piensa en palabras que podrías usar en su lugar.', NULL, NULL, '["feliz","contento","alegre"]'::jsonb, 3, '11b4f381-62e4-4872-b32d-bacc1369fc9f', 1, NULL, 70),
  ('bb8eea5d-de38-4cea-8a59-846a1e8fd6e3', 'exercise', 'true_false', 'Verdadero o Falso: Puntuación', 'Verifica tu conocimiento de signos', '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"El punto (.) indica una pausa larga al final de una oración","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761569374950-ChatGPT%20Image%20Oct%2027,%202025,%2008_48_59%20AM.png"}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'draft', NULL, 0, 0, NULL, 'f35ddca3-7a21-4173-8c03-0f9b1c80517e', '2025-10-26T23:16:46.331862+00:00', '2025-10-27T12:56:25.130535+00:00', '{}'::jsonb, 'Lee la afirmación y decide si es verdadera o falsa. Piensa en lo que aprendiste sobre los signos de puntuación.', NULL, NULL, NULL, 3, 'bfdf9237-32fb-49d5-9b58-0f2830f32fac', 6, NULL, 70),
  ('901cb4ed-78c1-4b03-8c68-f8aa5983c559', 'exercise', 'drag_drop', 'Pausa en las comas', 'Identifica dónde hacer pausas al leer', '{"mode":"match","question":"Marca dónde hay pausas: ''En la escuela, aprendo matemáticas, español, y ciencias.''","dropZones":[{"id":"pausa1","label":"Después de ''escuela''"},{"id":"pausa2","label":"Después de ''matemáticas''"},{"id":"pausa3","label":"Después de ''español''"}],"draggableItems":[{"id":"1","type":"text","content":"PAUSA","correctZone":"pausa1"},{"id":"2","type":"text","content":"PAUSA","correctZone":"pausa2"},{"id":"3","type":"text","content":"PAUSA","correctZone":"pausa3"}],"allowMultiplePerZone":false}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:16:43.846813+00:00', '2025-10-26T23:16:43.846813+00:00', '{}'::jsonb, 'Arrastra las palabras ''PAUSA'' donde veas una coma en la oración. Las comas te dicen dónde hacer una pausa corta al leer.', NULL, NULL, '[]'::jsonb, 3, 'bfdf9237-32fb-49d5-9b58-0f2830f32fac', 5, NULL, 70),
  ('0f3faae5-d4d6-447c-9042-0d973707d0f4', 'exercise', 'multiple_choice', 'Lección 1 – “El sol curioso” (Ciencia y observación)', 'Identifica la entonación correcta', '{"answers":[{"text":"A las estrellas ","imageUrl":null,"isCorrect":false},{"text":"A las flores ","imageUrl":null,"isCorrect":true},{"text":"A las nubes","imageUrl":null,"isCorrect":false}],"question":" “Hoy leerás una historia sobre el sol. Escucha primero y luego repite conmigo.”\nTexto:\n El sol salió muy temprano.\nMiró a las flores del jardín.\nEllas abrieron sus pétalos felices.\nEl sol dijo: “¡Buenos días, naturaleza!”\n “¿A quién saludó el sol?”\n","questionImage":null}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', '2025-10-27T13:19:17.807882+00:00', 0, 0, NULL, 'f35ddca3-7a21-4173-8c03-0f9b1c80517e', '2025-10-26T23:16:41.226586+00:00', '2025-10-27T13:19:17.807882+00:00', '{}'::jsonb, '🔹 Actividad 1 – Lectura guiada IA
🔊 “Lee conmigo cada línea. Marca pausa donde haya punto.”
[La IA resalta cada frase y analiza ritmo.]
', NULL, NULL, '["sol","estrellas","flores","nubes "]'::jsonb, 3, 'bfdf9237-32fb-49d5-9b58-0f2830f32fac', 4, NULL, 70),
  ('48d87ca4-caa9-4c5f-b7b8-1d133646c031', 'exercise', 'fill_blank', 'Completa con palabras frecuentes', 'Usa palabras de alta frecuencia', '{"mode":"single_word","prompt":"Completa: ___ sol brilla","target":"el","letters":["e","l","a","o"],"imageUrl":"https://images.pexels.com/photos/545313/pexels-photo-545313.jpeg?auto=compress&cs=tinysrgb&h=350","autoShuffle":true}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:16:38.725325+00:00', '2025-10-26T23:16:38.725325+00:00', '{}'::jsonb, 'Completa la oración usando las letras disponibles. Piensa en las palabras que usamos frecuentemente como ''el'', ''la'', ''un'', ''una''.', NULL, NULL, '[]'::jsonb, 3, 'bfdf9237-32fb-49d5-9b58-0f2830f32fac', 3, NULL, 70),
  ('7b476fc4-39cc-4962-8ce4-3beeddeb1c92', 'exercise', 'drag_drop', 'Ordena la lectura', 'Arrastra palabras para formar una oración fluida', '{"mode":"sequence","question":"Ordena las palabras para formar una oración:","autoShuffle":true,"draggableItems":[{"id":"1","type":"text","content":"Los"},{"id":"2","type":"text","content":"niños"},{"id":"3","type":"text","content":"juegan"},{"id":"4","type":"text","content":"en"},{"id":"5","type":"text","content":"el"},{"id":"6","type":"text","content":"parque"}],"targetSequence":["Los","niños","juegan","en","el","parque"]}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:16:36.223501+00:00', '2025-10-26T23:16:36.223501+00:00', '{}'::jsonb, 'Arrastra las palabras en el orden correcto para formar una oración que tenga sentido. Lee en voz alta para verificar que suene bien.', NULL, NULL, '["niños","juegan","parque"]'::jsonb, 3, 'bfdf9237-32fb-49d5-9b58-0f2830f32fac', 2, NULL, 70),
  ('5ccddad9-a21c-46a3-a8a4-e4194c907627', 'exercise', 'multiple_choice', 'Identifica el signo de puntuación', 'Reconoce el uso correcto de signos de puntuación', '{"answers":[{"text":"Punto (.)","imageUrl":null,"isCorrect":false},{"text":"Interrogación (¿?)","imageUrl":null,"isCorrect":true},{"text":"Exclamación (¡!)","imageUrl":null,"isCorrect":false},{"text":"Coma (,)","imageUrl":null,"isCorrect":false}],"question":"¿Qué signo va al final?: ''Cómo te llamas''","questionImage":null}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:16:33.750432+00:00', '2025-10-26T23:16:33.750432+00:00', '{}'::jsonb, 'Lee cada oración y piensa qué signo de puntuación debe ir al final. Si es una pregunta, necesita ¿?. Si expresa emoción, necesita ¡!. Si es una afirmación, necesita punto.', NULL, NULL, '["pregunta","exclamación","punto"]'::jsonb, 3, 'bfdf9237-32fb-49d5-9b58-0f2830f32fac', 1, NULL, 70),
  ('9c4aacae-f7f7-42f7-b67c-8e1f9306e8ed', 'exercise', 'true_false', 'Verdadero o Falso: Dígrafos', 'Verifica tu conocimiento de dígrafos', '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"La palabra ''llama'' tiene el dígrafo LL","questionImage":null}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'draft', NULL, 0, 0, NULL, 'f35ddca3-7a21-4173-8c03-0f9b1c80517e', '2025-10-26T23:16:30.108967+00:00', '2025-10-27T11:53:22.019022+00:00', '{}'::jsonb, 'Lee la oración con atención. Piensa en el sonido del dígrafo LL. ¿Es verdadera o falsa la afirmación? Usa lo que aprendiste sobre dígrafos.', NULL, NULL, '["lluvia"]'::jsonb, 3, 'b292d645-d57a-4a49-b44b-83554f6ee728', 6, NULL, 70),
  ('0d8cf0f6-eb91-4ec4-99c0-72cf6760b992', 'exercise', 'drag_drop', 'Clasifica palabras con RR', 'Arrastra palabras según tengan o no el dígrafo RR', '{"mode":"match","question":"Arrastra las palabras con dígrafo RR a su lugar","dropZones":[{"id":"con-rr","label":"Tiene RR"},{"id":"sin-rr","label":"No tiene RR"}],"draggableItems":[{"id":"1","type":"text","content":"perro","correctZone":"con-rr"},{"id":"2","type":"text","content":"carro","correctZone":"con-rr"},{"id":"3","type":"text","content":"casa","correctZone":"sin-rr"},{"id":"4","type":"text","content":"mesa","correctZone":"sin-rr"}],"allowMultiplePerZone":true}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:16:27.567906+00:00', '2025-10-26T23:16:27.567906+00:00', '{}'::jsonb, 'Arrastra cada palabra a su zona correcta. Escucha el sonido fuerte de RR en palabras como ''perro'' y ''carro''. Las otras palabras no tienen este sonido.', NULL, NULL, '["perro","carro","casa","mesa"]'::jsonb, 3, 'b292d645-d57a-4a49-b44b-83554f6ee728', 5, NULL, 70),
  ('ffdbe21c-8dc0-4977-b9f0-153bbb3bede5', 'exercise', 'multiple_choice', 'Cuenta las sílabas', 'Identifica el número de sílabas en palabras', '{"answers":[{"text":"2 sílabas","imageUrl":null,"isCorrect":false},{"text":"3 sílabas","imageUrl":null,"isCorrect":false},{"text":"4 sílabas","imageUrl":null,"isCorrect":true},{"text":"5 sílabas","imageUrl":null,"isCorrect":false}],"question":"¿Cuántas sílabas tiene ''mariposa''?","questionImage":null}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:16:22.24263+00:00', '2025-10-26T23:16:22.24263+00:00', '{}'::jsonb, 'Escucha la palabra y cuenta cuántas sílabas tiene. Recuerda que cada sílaba tiene al menos una vocal. Di la palabra en voz alta separando las partes.', NULL, NULL, '["mariposa"]'::jsonb, 3, 'b292d645-d57a-4a49-b44b-83554f6ee728', 4, NULL, 70),
  ('ff7a8b8d-1034-4a8b-8ab1-ba2bc20d3178', 'exercise', 'fill_blank', 'Completa la palabra', 'Completa palabras con el dígrafo RR', '{"mode":"single_word","prompt":"Completa la palabra: ca___o (vehículo)","target":"carro","letters":["c","a","r","r","o","m","u"],"imageUrl":null,"autoShuffle":false}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', '2025-10-26T23:19:23.331+00:00', 0, 0, NULL, 'f35ddca3-7a21-4173-8c03-0f9b1c80517e', '2025-10-26T23:16:20.015144+00:00', '2025-10-26T23:19:23.562795+00:00', '{}'::jsonb, 'Usa las letras para completar la palabra. Piensa en el sonido fuerte de RR en el medio de la palabra, como en ''carro'' o ''perro''.', NULL, NULL, NULL, 3, 'b292d645-d57a-4a49-b44b-83554f6ee728', 3, NULL, 70),
  ('2916523f-2112-4a5e-848a-394018742983', 'exercise', 'drag_drop', 'Forma la palabra ''lluvia''', 'Arrastra letras para formar palabras con LL', '{"mode":"letters","question":"Arrastra las letras para formar ''lluvia''","targetWord":"lluvia","autoShuffle":true,"questionImage":null,"availableLetters":["l","l","u","v","i","a","s","b","t"]}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', '2025-10-26T23:18:43.599+00:00', 0, 0, NULL, 'f35ddca3-7a21-4173-8c03-0f9b1c80517e', '2025-10-26T23:16:19.941044+00:00', '2025-10-26T23:18:43.828128+00:00', '{}'::jsonb, 'Arrastra las letras a su lugar correcto para formar la palabra ''lluvia''. Recuerda que LL es un dígrafo, dos letras que suenan como una. Tómate tu tiempo.', NULL, NULL, '["lluvia"]'::jsonb, 3, 'b292d645-d57a-4a49-b44b-83554f6ee728', 2, 'letters', 70),
  ('150b913f-f18e-489f-a7bf-3b2826e1dc2f', 'exercise', 'multiple_choice', 'Reconoce el dígrafo CH', 'Identifica palabras con el dígrafo CH', '{"answers":[{"text":"chocolate","imageUrl":"https://images.pexels.com/photos/6036360/pexels-photo-6036360.jpeg?auto=compress&cs=tinysrgb&h=350","isCorrect":true},{"text":"casa","imageUrl":"https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&h=350","isCorrect":false},{"text":"perro","imageUrl":"https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&h=350","isCorrect":false},{"text":"sol","imageUrl":"https://images.pexels.com/photos/301599/pexels-photo-301599.jpeg?auto=compress&cs=tinysrgb&h=350","isCorrect":false}],"question":"¿Cuál palabra contiene el dígrafo CH?","questionImage":null}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 3, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:16:19.861343+00:00', '2025-10-26T23:16:19.861343+00:00', '{}'::jsonb, 'Lee las opciones con cuidado. Busca la palabra que contiene el dígrafo CH, donde las letras C y H suenan juntas como un solo sonido. Piensa en el sonido ''ch'' como en ''chico''.', NULL, NULL, '["chocolate","casa","perro"]'::jsonb, 3, 'b292d645-d57a-4a49-b44b-83554f6ee728', 1, NULL, 70),
  ('207d7cf7-be7b-493a-8065-119dac95658c', 'lesson', 'lesson', 'AI G2 V2: Dominio 5 - Comprensión Inferencial', 'Usa pistas para descubrir información no escrita', '{"answers":[],"question":"Inferir es descubrir información usando pistas del texto y lo que ya sabes.\n\nEjemplo:\n\"Ana entró empapada a la casa y cerró su paraguas.\"\nPodemos inferir: Estaba lloviendo afuera\n\nHacer Predicciones:\nUsa pistas del texto para imaginar qué pasará después.\nEjemplo: \"El cielo está oscuro y hace viento\" → Probablemente va a llover\n\nCausa y Efecto:\nCausa: La razón por la que algo sucede\nEfecto: Lo que sucede como resultado\n\nEjemplos:\n• Causa: Estudió mucho → Efecto: Sacó buena nota\n• Causa: No desayunó → Efecto: Tiene hambre\n• Causa: Hizo ejercicio → Efecto: Se siente fuerte\n\nPropósito del Autor - ¿Por qué escribió este texto?\n• Informar - dar datos y enseñar algo nuevo\n• Entretener - contar historias divertidas o interesantes\n• Persuadir - convencer al lector de algo\n\nRecuerda: Siempre busca evidencia en el texto para apoyar tus inferencias.","questionImage":"https://images.pexels.com/photos/7494469/pexels-photo-7494469.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 10, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:16:15.228933+00:00', '2025-10-26T23:16:15.228933+00:00', '{}'::jsonb, '¡Serás un detective de las pistas! Inferir significa descubrir información que no está escrita directamente. Usarás pistas del texto más lo que ya sabes para hacer predicciones, encontrar causas y efectos, y entender el propósito del autor. ¡Vamos a investigar juntos!', NULL, NULL, '["inferir","pistas","predicción","causa","efecto","propósito"]'::jsonb, 3, NULL, NULL, NULL, 70);

INSERT INTO public.manual_assessments ("id", "type", "subtype", "title", "description", "content", "grade_level", "language", "subject_area", "curriculum_standards", "enable_voice", "voice_speed", "auto_read_question", "difficulty_level", "estimated_duration_minutes", "status", "published_at", "view_count", "completion_count", "average_score", "created_by", "created_at", "updated_at", "metadata", "voice_guidance", "activity_template", "coqui_dialogue", "pronunciation_words", "max_attempts", "parent_lesson_id", "order_in_lesson", "drag_drop_mode", "passing_score") VALUES
  ('8a7cb3ce-1773-4c44-92be-3433c343636f', 'lesson', 'lesson', 'AI G2 V2: Dominio 4 - Comprensión Literal', 'Responde preguntas sobre quién, qué, dónde, cuándo y por qué', '{"answers":[],"question":"Las Preguntas Clave para Comprender:\n\n¿QUIÉN? - Identifica los personajes o personas\nEjemplo: \"María fue a la biblioteca\" → ¿Quién fue? María\n\n¿QUÉ? - Identifica los eventos o acciones\nEjemplo: \"Juan comió una manzana\" → ¿Qué hizo? Comió una manzana\n\n¿DÓNDE? - Identifica el lugar\nEjemplo: \"Los niños juegan en el parque\" → ¿Dónde? En el parque\n\n¿CUÁNDO? - Identifica el tiempo\nEjemplo: \"Ayer llovió mucho\" → ¿Cuándo? Ayer\n\n¿POR QUÉ? - Identifica las razones\nEjemplo: \"Ana estudió porque tenía examen\" → ¿Por qué? Porque tenía examen\n\nPara encontrar la idea principal:\n1. Lee el título del texto\n2. Lee la primera oración de cada párrafo\n3. Busca palabras que se repiten\n4. Pregúntate: ¿De qué trata principalmente este texto?\n\nSecuencia de eventos:\nPrimero → Luego → Después → Finalmente","questionImage":"https://images.pexels.com/photos/8617945/pexels-photo-8617945.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 10, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:16:13.869789+00:00', '2025-10-26T23:16:13.869789+00:00', '{}'::jsonb, '¡Hola detective de la lectura! En esta lección aprenderás a encontrar información directa en los textos. Usarás preguntas especiales: ¿Quién?, ¿Qué?, ¿Dónde?, ¿Cuándo? y ¿Por qué? Estas preguntas te ayudan a entender mejor lo que lees. Lee con atención cada detalle.', NULL, NULL, '["quién","qué","dónde","cuándo","por qué","comprensión"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('11b4f381-62e4-4872-b32d-bacc1369fc9f', 'lesson', 'lesson', 'AI G2 V2: Dominio 3 - Desarrollo de Vocabulario', 'Explora sinónimos, antónimos y lenguaje figurado', '{"answers":[],"question":"Sinónimos - Palabras con significados parecidos:\n• feliz = contento = alegre\n• triste = apenado = melancólico\n• grande = enorme = gigante\n• pequeño = chico = diminuto\n\nAntónimos - Palabras opuestas:\n• día ↔ noche\n• caliente ↔ frío\n• lleno ↔ vacío\n• rápido ↔ lento\n• alto ↔ bajo\n\nLenguaje Figurado - Comparaciones y expresiones:\n• \"Tan alto como un edificio\" = muy alto\n• \"Rápido como el viento\" = muy veloz\n• \"Fuerte como un león\" = muy fuerte\n• \"Brillante como el sol\" = muy inteligente\n\nRecuerda: Conocer más palabras te ayuda a expresarte mejor y comprender lo que lees.","questionImage":"https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 10, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T23:16:12.446599+00:00', '2025-10-26T23:16:12.446599+00:00', '{}'::jsonb, '¡Vamos a ampliar tu vocabulario! Hoy descubrirás palabras con significados parecidos llamadas sinónimos, palabras opuestas llamadas antónimos, y aprenderás lenguaje figurado que hace la lectura más interesante. Escucha los ejemplos y piensa en otras palabras similares.', NULL, NULL, '["sinónimo","antónimo","significado","opuesto","vocabulario"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('bfdf9237-32fb-49d5-9b58-0f2830f32fac', 'lesson', 'lesson', 'AI G2 V2: Dominio 2 - Fluidez Lectora', 'Desarrolla lectura fluida con signos de puntuación', '{"answers":[],"question":"Los signos de puntuación son tus guías de lectura:\n\nEl Punto (.) - Pausa larga al final de una oración\nLa Coma (,) - Pausa corta dentro de una oración\n¿Interrogación? - Sube la voz para hacer una pregunta\n¡Exclamación! - Muestra emoción o sorpresa\n\nPalabras de alta frecuencia que debes reconocer rápido:\nel, la, los, las, un, una, y, o, pero, porque, con, sin\n\nPractica leyendo este párrafo:\n\"En la escuela, los niños aprenden muchas cosas. ¿Te gusta leer? ¡Es muy divertido! Cuando lees, puedes conocer nuevos lugares y personajes.\"\n\nMeta de segundo grado: Leer 80-120 palabras por minuto con precisión.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761568289508-image.png"}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 10, 'draft', NULL, 0, 0, NULL, 'f35ddca3-7a21-4173-8c03-0f9b1c80517e', '2025-10-26T23:16:11.042283+00:00', '2025-10-27T12:38:20.10223+00:00', '{}'::jsonb, '¡Bienvenido! Hoy aprenderás a leer con fluidez usando los signos de puntuación como guía. El punto te dice cuándo pausar, la coma te da una pausa corta, y los signos de interrogación y exclamación te muestran cómo expresar emociones. Vamos a leer juntos y practicar.', NULL, NULL, '["punto","coma","pregunta","exclamación","fluidez","pausa"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('b292d645-d57a-4a49-b44b-83554f6ee728', 'lesson', 'lesson', 'Lección 4: Dígrafos (ch, ll, rr)', 'Aprende dígrafos (CH, LL, RR) y grupos consonánticos', '{"answers":[],"question":"Los dígrafos son dos letras juntas que forman un solo sonido.\n\nEn español tenemos:\n• CH - como en \"chico\" y \"chocolate\"\n• LL - como en \"lluvia\" y \"calle\"\n• RR - como en \"carro\" y \"perro\"\n\nTambién aprenderemos grupos consonánticos:\n• BR - brazo, libro\n• PL - plato, pluma\n• GR - grande, tigre\n• FL - flor, flaco\n\nRecuerda: Las palabras largas se dividen en sílabas. Cada sílaba tiene al menos una vocal.\nEjemplo: ma-ri-po-sa (4 sílabas)\n\nPractica dividiendo estas palabras:\n• carro = ca-rro (2 sílabas)\n• lluvia = llu-via (2 sílabas)\n• chocolate = cho-co-la-te (4 sílabas)","questionImage":"https://images.pexels.com/photos/8613319/pexels-photo-8613319.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb, 2, 'es', 'reading', NULL, true, 1, true, NULL, 10, 'draft', NULL, 0, 0, NULL, 'f35ddca3-7a21-4173-8c03-0f9b1c80517e', '2025-10-26T23:16:09.662871+00:00', '2025-10-27T11:40:26.253892+00:00', '{}'::jsonb, '🔊 “Ahora aprenderás los dígrafos, combinaciones de dos letras que hacen un solo sonido: ch, ll y rr.”
', NULL, NULL, '["chico","lluvia","carro","sílaba","brazo","plato"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('9ff0f689-c956-4d7a-951e-f4c5b0fa48d1', 'exercise', 'true_false', 'TEST G1 Exercise – Life Cycle Facts (True/False)', 'Test duplicate for true/false scaffolding.', '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"[TEST] Responde si la oración es verdadera o falsa. Un ciclo ciclo es una serie de pasos o etapas que se repiten. ","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761335954542-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-26T12:52:52.482936+00:00', 0, 0, 0, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T12:52:52.482936+00:00', '2025-10-26T12:52:52.482936+00:00', '{"source_record":"0392086a-519f-4415-8e06-ed8b503489f4","is_test_fixture":true,"created_from_backup":"2025-10-26"}'::jsonb, '
🔊 Lee la afirmación completa sin revelar la respuesta. Pregunta "¿Verdadero o falso?" y espera mínimo 3 segundos. Si la respuesta no llega, ofrece una pista relacionada y vuelve a preguntar antes de confirmar.
', NULL, '
1. Introduce el tema: "Estamos estudiando el ciclo de vida".
2. Lee la oración lentamente usando gestos verbales como "Observa esta parte".
3. Pregunta por la respuesta y valida la idea que compartan.
4. Explica por qué es verdadero o falso usando vocabulario simple.
', '["ciclo","vida","etapas"]'::jsonb, 3, 'b8edf8f2-63ce-4479-832c-7801c6d9785f', 4, NULL, 70),
  ('b8edf8f2-63ce-4479-832c-7801c6d9785f', 'lesson', 'lesson', 'TEST G1 Lesson – Biliteracy Syllable Coach', 'Duplicated for deterministic voice testing (Grade 1 lesson).', '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"[TEST] Biliteracy Coach: Objetivo:  Desarrollar la capacidad de identificar, segmentar y contar sílabas en palabras orales y escritas, comprendiendo que cada sílaba se pronuncia con un solo golpe de voz.\n\n La sílaba está compuesta por uno o más sonidos que se pronuncian con un solo golpe de voz. En el lenguaje escrito las sílabas se dividen con un símbolo llamado guión (-).\nEjemplo:\nma-na-tí\n","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761316094660-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-26T12:52:52.482936+00:00', 0, 0, 0, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T12:52:52.482936+00:00', '2025-10-26T12:52:52.482936+00:00', '{"source_record":"5f048380-5df3-4c4c-9136-387b5d7ee93f","is_test_fixture":true,"created_from_backup":"2025-10-26"}'::jsonb, '
🔊 Lee el objetivo lentamente y modela cómo separar palabras en sílabas.
1. Resume el objetivo en 1 oración infantil.
2. Demuestra cómo aplaudir por cada sílaba.
3. Pide al estudiante repetir tus ejemplos usando las sílabas resaltadas.
4. Refuerza la regla con una palabra nueva y espera que la repitan antes de continuar.
', 'segmentacion', '
SECTION 1: Hola amiguito, hoy eres un detective de sílabas. ¿Listo para aplaudir conmigo?
SECTION 2: Mira esta palabra mágica. Primero yo digo "co-quí" y tú repites.
SECTION 3: Ahora viene 🔊 "ma-na-tí". Aplaude tres veces y repítela en voz alta.
SECTION 4: Inventemos una nueva palabra divertida. Divide "borinquen" y dime cuántas sílabas escuchaste.
SECTION 5: Despídete celebrando su esfuerzo y recuérdale que puede pedirme más palabras cuando quiera practicar.
', '["manatí","coquí","mariposa","palma","borinquen","plátano"]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('3acf5c5a-95fb-4b5a-a3f1-1c671c2c8d85', 'exercise', 'fill_blank', 'TEST G1 Exercise – Missing Vowel (Fill Blank)', 'Test duplicate for fill-in-the-blank guidance.', '{"mode":"single_word","prompt":" instruccionesinstruccionesinstruccionesinstruccionesins  truccionesinstrucciones","target":"coqui","letters":["c","o","q","u","i","r","l"],"question":"[TEST] Completa la palabra con la vocal correcta. Lee el texto en voz alta.","autoShuffle":true}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-26T12:52:52.482936+00:00', 0, 0, 0, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T12:52:52.482936+00:00', '2025-10-26T12:52:52.482936+00:00', '{"source_record":"0e830479-fc0e-4896-ae05-e2aaadbb0e70","is_test_fixture":true,"created_from_backup":"2025-10-26"}'::jsonb, '
Explica que falta una vocal. 🔊 Lee la oración completa antes de pedir la respuesta. Escucha lo que dice el estudiante; si responde con un sonido incorrecto, modela la vocal correcta y pídele que repita la palabra completa.
', NULL, '
PASO 1: "Mira esta palabra misteriosa. Falta una vocal."
PASO 2: Lee la palabra incompleta enfatizando el espacio vacío.
PASO 3: Pregunta "¿Qué vocal debemos poner?" y espera la respuesta.
PASO 4: Confirma repitiendo la palabra completa y celebrando su esfuerzo.
', '["sol","suma","sopa"]'::jsonb, 3, 'b8edf8f2-63ce-4479-832c-7801c6d9785f', 2, NULL, 70),
  ('daeedbd1-1e68-4efd-9b2d-7183762c5086', 'exercise', 'multiple_choice', 'TEST G1 Exercise – Sound Hunt (MCQ)', 'Test duplicate for multiple-choice pronunciation coverage.', '{"answers":[{"text":"Calle","imageUrl":null,"isCorrect":true},{"text":"Avenida","imageUrl":null,"isCorrect":false}],"question":"[TEST] Escucha el sonido /c/. ¿Cuál empieza con el sonido /c/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-26T12:52:52.482936+00:00', 0, 0, 0, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T12:52:52.482936+00:00', '2025-10-26T12:52:52.482936+00:00', '{"source_record":"025b161b-07e2-4801-be27-0473eb04a574","is_test_fixture":true,"created_from_backup":"2025-10-26"}'::jsonb, '
Di: 🔊 "Escucha el sonido /c/." Lee cada respuesta lentamente, espera la elección del estudiante y pídele que repita la palabra elegida. Si se confunde, modela la sílaba inicial y vuelve a preguntar sin revelar la respuesta correcta de inmediato.
', NULL, '
1. Presenta el reto: "Vamos a cazar palabras que empiezan con /c/."
2. Lee "calle" y "avenida" con energía. Pausa para que respondan.
3. Ofrece una pista si dudan: "La palabra correcta suena como coquí".
4. Asegúrate de que repitan la palabra correcta antes de continuar con otros ejemplos.
', '["calle","casa","coquí"]'::jsonb, 3, 'b8edf8f2-63ce-4479-832c-7801c6d9785f', 1, NULL, 70),
  ('9b83f8a7-a4b6-424d-8b30-8616a540d2cd', 'exercise', 'write_answer', 'TEST G1 Exercise – Predict the Word (Write Answer)', 'Test duplicate for constructed-response prompts.', '{"question":"[TEST] Escribe o di la palabra que sigue. what''s the next word going to","caseSensitive":false,"correctAnswer":"be","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761299402108-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-26T12:52:52.482936+00:00', 0, 0, 0, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T12:52:52.482936+00:00', '2025-10-26T12:52:52.482936+00:00', '{"source_record":"8133e265-0047-43bd-8d12-00afb2dd3946","is_test_fixture":true,"created_from_backup":"2025-10-26"}'::jsonb, '
🔊 Lee el enunciado de la oración incompleta y explica que deben adivinar la palabra que sigue. Permite que respondan oralmente primero; si la idea es correcta pero incompleta, pídeles que la deletreen o la escriban. Solo revela la respuesta después de dos intentos.
', NULL, '
A. Presenta el juego: "Voy a leer esta oración y tú me dices qué palabra sigue".
B. Lee la oración enfatizando la cadencia.
C. Pregunta "¿Cuál crees que es la palabra secreta?" y espera su intento.
D. Si fallan, ofrece una pista sobre la rima o sonido inicial antes de repetir la consigna.
', '["siguiente","palabra","rima"]'::jsonb, 3, 'b8edf8f2-63ce-4479-832c-7801c6d9785f', 5, NULL, 70),
  ('3a9a822a-46f5-42bd-ab7c-113be7084ff2', 'exercise', 'drag_drop', 'TEST G1 Exercise – Build the Word (Drag & Drop)', 'Test duplicate for drag-and-drop coaching.', '{"mode":"letters","question":"[TEST] Arrastra las letras para formar la palabra secreta. Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.","targetWord":"salón","autoShuffle":true,"availableLetters":["ó","l","s","a","n"]}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-26T12:52:52.482936+00:00', 0, 0, 0, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-26T12:52:52.482936+00:00', '2025-10-26T12:52:52.482936+00:00', '{"source_record":"b8234b01-b004-47d9-b1b2-aaac2b9a5db8","is_test_fixture":true,"created_from_backup":"2025-10-26"}'::jsonb, '
Describe el reto: 🔊 "Arrastra las letras para formar la palabra salón". Pronuncia la palabra completa, luego deletrea lentamente cada letra. Observa si colocan una pieza incorrecta y ofrece pistas sobre la posición correcta antes de revelar la respuesta.
', NULL, '
INTRO: "Vamos a construir la palabra salón como si fuera un rompecabezas".
PASO 1: Pronuncia "sa-lón" destacando cada sílaba.
PASO 2: Deja que el estudiante arrastre y espera 5 segundos antes de ayudar.
PASO 3: Si se equivoca, menciona "La letra con acento va al final".
CIERRE: Repite la palabra completa juntos y celebra con un ¡plin plin! imaginario.
', '["salón","sal","sol"]'::jsonb, 3, 'b8edf8f2-63ce-4479-832c-7801c6d9785f', 3, 'letters', 70),
  ('ceb8f38a-930c-42a4-bb66-fbf0ec35729e', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos","targetWord":"regla","autoShuffle":true,"availableLetters":["r","e","g","l","a"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T18:07:59.377916+00:00', '2025-10-25T18:07:59.377916+00:00', '{}'::jsonb, 'Sonido GL
/re/ + /gla/
', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('fa24a672-386f-470c-a981-671876accf95', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos","targetWord":"reflexión","autoShuffle":true,"availableLetters":["r","e","f","l","e","x","i","ó","n"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T18:06:24.26782+00:00', '2025-10-25T18:06:24.26782+00:00', '{}'::jsonb, 'Sonido FL /re/ + /fle/ + /xión?', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('d067aff1-7f40-44eb-981a-71c3032a770d', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos","targetWord":"fluir","autoShuffle":true,"availableLetters":["f","l","u","i","r"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T18:05:02.721188+00:00', '2025-10-25T18:05:02.721188+00:00', '{}'::jsonb, 'Sonido FL: /flu/ + /ir/', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('ea520386-e030-431b-8deb-ef184d4cea74', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos","targetWord":"florista","autoShuffle":true,"availableLetters":["f","l","o","r","i","s","t","a"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T18:02:48.294874+00:00', '2025-10-25T18:02:48.294874+00:00', '{}'::jsonb, 'Sonido FL  /flo/ +ris/ + /ta/ ', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('6089dc2c-7dfc-4201-81ba-663b1fb28949', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos\n","targetWord":"flan","autoShuffle":true,"availableLetters":["f","l","a","n"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T18:01:36.515532+00:00', '2025-10-25T18:01:36.515532+00:00', '{}'::jsonb, 'Sonido FL /flan/', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('ab0946fd-75dc-4487-ada9-caa418d64a53', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos","targetWord":"claro","autoShuffle":true,"availableLetters":["c","l","a","r","o"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T18:00:07.233481+00:00', '2025-10-25T18:00:07.233481+00:00', '{}'::jsonb, '/cla/ +/ro/', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('fc47a4fb-ef4a-4753-abb9-306cbe571e52', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos,","targetWord":"closet","autoShuffle":true,"availableLetters":["c","l","o","s","e","t"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:59:02.819049+00:00', '2025-10-25T17:59:02.819049+00:00', '{}'::jsonb, '/clo/ +/set/ ', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('392cd8b5-0ec5-4690-be3b-9597bc52b060', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos,","targetWord":"teclado","autoShuffle":true,"availableLetters":["t","e","c","l","a","d","o"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:54:55.794786+00:00', '2025-10-25T17:54:55.794786+00:00', '{}'::jsonb, '/te/ +/cla/ +/do/', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('c8ed5d9c-2fe8-4925-82f2-ec32da274255', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos,","targetWord":"club","autoShuffle":true,"availableLetters":["c","l","u","b"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:52:39.269966+00:00', '2025-10-25T17:52:39.269966+00:00', '{}'::jsonb, '/clu/ +/b/', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('64a38b84-92cc-4869-84e9-067fb2d6d5d9', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos,","targetWord":"clima","autoShuffle":true,"availableLetters":["c","l","i","m","a"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:49:56.425471+00:00', '2025-10-25T17:49:56.425471+00:00', '{}'::jsonb, '/cli/ + /ma/', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('0ac231e2-7ada-4ad7-b227-d83493b80e5a', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos","targetWord":"tabla","autoShuffle":true,"availableLetters":["t","a","b","l","a"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:47:53.481746+00:00', '2025-10-25T17:47:53.481746+00:00', '{}'::jsonb, '/ta/+ /bla/', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('c5b1f150-b39c-46b2-9fdb-bbf261b0da1a', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos","targetWord":"neblina","autoShuffle":true,"availableLetters":["n","e","b","l","i","n","a"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:43:33.730771+00:00', '2025-10-25T17:43:33.730771+00:00', '{}'::jsonb, '/ne/ + /bli/ + /na/', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('87ae46a7-d4ad-4e64-9db4-043238cf0e52', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos\n","targetWord":"mueble","autoShuffle":true,"availableLetters":["m","u","e","b","l","e"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:40:46.625848+00:00', '2025-10-25T17:40:46.625848+00:00', '{}'::jsonb, '/mue/ + /ble/', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('7a9e6ee1-bca9-49cd-b9e9-2c391648b1b7', 'exercise', 'drag_drop', '“Arrastrar y soltar”', NULL, '{"mode":"letters","question":"Empareja, clasifica o completa una palabra o imagen moviendo elementos","targetWord":"cable","autoShuffle":true,"availableLetters":["c","a","b","l","e"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:39:24.146263+00:00', '2025-10-25T17:39:24.146263+00:00', '{}'::jsonb, 'Sonido BL
/ca/ + /ble/
', NULL, NULL, NULL, 3, '673e3b16-6ab8-4814-bbe8-2b2734da05ea', NULL, 'letters', 70),
  ('673e3b16-6ab8-4814-bbe8-2b2734da05ea', 'lesson', 'lesson', 'Conciencia fonológica y fonética avanzada - Combinación fonémica y ortografía visual', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Unir sonidos o sílabas para formar palabras y reconocer palabras familiares mediante su estructura visual y ortográfica"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:34:36.505371+00:00', '2025-10-25T17:35:00.108222+00:00', '{}'::jsonb, '🔊 ¡Hola! Hoy aprenderás cómo unir sonidos para formar palabras y cómo reconocerlas con solo verlas.
🔊 Cuando escuchas los sonidos /c/ + /a/ + /sa/, tu cerebro los combina y lees la palabra “casa”.
🔊 A este proceso lo llamamos combinación fonémica o blending.
🔊 También aprenderás a reconocer palabras con solo verlas —esas que ya conoces y lees sin tener que pronunciarlas lentamente. 
🔊 Ambas destrezas nos ayudan a leer con fluidez, precisión y comprensión.
🔊 Cuanto más practiques, más rápido y seguro leerás nuevas palabras.
🔊¿Por qué es importante?
🔊 Cuando sabes unir sonidos y reconocer palabras, puedes:
🔊 Leer textos con más confianza.
🔊 Escribir correctamente las palabras que ya conoces.
🔊 Aprender nuevo vocabulario académico con facilidad.
🔊¿Cómo se hace?

🔊 Paso 1. Escucha atentamente los sonidos.

IA dirá los sonidos uno por uno.
🔊 Ejemplo: /c/ + /a/ + /sa/ = casa
           🔊 /e/ + /s/ + /cue/ + /la/ = escuela
           🔊 /a/ + /mi/ + /go/ = amigo




🔊 Paso 2. Une los sonidos en tu mente y dilo en voz alta.

🔊 Pronuncia despacio al principio, luego más rápido hasta decir la palabra completa.
/c/ + /a/ + /sa/ = casa
/e/ + /s/ + /cue/ + /la/ = escuela
/a/ + /mi/ + /go/ = amigo
🔊 Paso 3. Observa la palabra escrita y fíjate cómo se ve.
🔊 Mira las letras, su orden y forma.
🔊 Tu cerebro la guardará en su “memoria visual de palabras”.

🔊 Paso 4. Repite la palabra sin verla.
🔊 Imagina que los sonidos son piezas de un rompecabezas: cuando las unes, descubres la palabra completa.
🔊 Esto te ayudará a recordarla y escribirla correctamente más adelante
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('79de179a-8302-4acb-8d3f-880e54bc6e46', 'exercise', 'multiple_choice', '🔊 Lee cuidadosamente los siguientes preguntas. Escoge la alternativa que contesta cada pregunta correctamente.', NULL, '{"answers":[{"text":"rí-o ","imageUrl":null,"isCorrect":true},{"text":" rio","imageUrl":null,"isCorrect":false},{"text":" ri-o","imageUrl":null,"isCorrect":false}],"question":" ¿Cómo se divide correctamente la palabra río?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:32:52.95749+00:00', '2025-10-25T17:33:22.313059+00:00', '{}'::jsonb, '🔊 ¡Excelente trabajo!
🔊 Hoy descubriste cómo las vocales pueden sonar juntas o separadas en una palabra.
🔊 Cuando sabes dividir las palabras, lees con más fluidez y escribes con seguridad.
🔊¡Sigue practicando! Cada palabra tiene su propio ritmo… y tú ya sabes escucharlo. 
', NULL, NULL, NULL, 3, 'bb209f61-4448-46bd-aa7c-0d0d85821bdc', NULL, NULL, 70),
  ('057b7389-79f8-4ea3-a2b7-bb2baa50474f', 'exercise', 'multiple_choice', '🔊 Lee cuidadosamente los siguientes preguntas. Escoge la alternativa que contesta cada pregunta correctamente.', NULL, '{"answers":[{"text":"a.\tcie-lo ","imageUrl":null,"isCorrect":true},{"text":"b.\tci-e-lo","imageUrl":null,"isCorrect":false},{"text":"c.\tciel-o","imageUrl":null,"isCorrect":false}],"question":"Escucha la palabra cielo. ¿Cuál es la división correcta?\n\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:31:43.002246+00:00', '2025-10-25T17:31:43.002246+00:00', '{}'::jsonb, '“Perfecto. ‘Cielo’ tiene un diptongo (i + e) que suena en una sola sílaba: cie-lo.”', NULL, NULL, NULL, 3, 'bb209f61-4448-46bd-aa7c-0d0d85821bdc', NULL, NULL, 70),
  ('41848c28-89c2-45ec-a9f1-d0f43d91144a', 'exercise', 'multiple_choice', '🔊 Lee cuidadosamente los siguientes preguntas. Escoge la alternativa que contesta cada pregunta correctamente.', NULL, '{"answers":[{"text":"a-le-grí-a","imageUrl":null,"isCorrect":false},{"text":"a-le-grí-a ","imageUrl":null,"isCorrect":true},{"text":"a-le-gri-a","imageUrl":null,"isCorrect":false}],"question":"¿Cuál de las siguientes palabras está dividida correctamente?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:30:38.313152+00:00', '2025-10-25T17:30:38.313152+00:00', '{}'::jsonb, '“¡Muy bien! ‘Alegría’ tiene un hiato entre í y a. Por eso la vocal cerrada (í) lleva tilde.”', NULL, NULL, NULL, 3, 'bb209f61-4448-46bd-aa7c-0d0d85821bdc', NULL, NULL, 70),
  ('50eca450-ddf2-4c92-b167-8dd7b280446e', 'exercise', 'multiple_choice', '🔊 Lee cuidadosamente los siguientes preguntas. Escoge la alternativa que contesta cada pregunta correctamente.', NULL, '{"answers":[{"text":"san-día","imageUrl":null,"isCorrect":false},{"text":"ra-í-ces","imageUrl":null,"isCorrect":true},{"text":"tea-tro","imageUrl":null,"isCorrect":false}],"question":"¿Cuál de las siguientes palabras está dividida correctamente?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:28:24.054295+00:00', '2025-10-25T17:29:20.027432+00:00', '{}'::jsonb, 'Si el estudiante elige b. ra-í-ces, el sistema responde: “¡Muy bien! ‘Ra-í-ces’ tiene un hiato (dos vocales que se pronuncian en sílabas separadas), por eso lleva tilde en la í.”
Si elige a. san-día, la IA muestra: “Casi, pero recuerda que la palabra correcta es sandía y se divide como san-dí-a.”
Si elige c. tea-tro, la IA indica: “Revisa: la palabra teatro se divide te-a-tro porque las vocales forman un hiato
', NULL, NULL, NULL, 3, 'bb209f61-4448-46bd-aa7c-0d0d85821bdc', NULL, NULL, 70),
  ('349865f5-442f-4109-98a5-79fecb722fcf', 'exercise', 'multiple_choice', '🔊 Lee cuidadosamente los siguientes preguntas. Escoge la alternativa que contesta cada pregunta correctamente.', NULL, '{"answers":[{"text":"tri-un-fo","imageUrl":null,"isCorrect":true},{"text":"hi-e-lo","imageUrl":null,"isCorrect":false},{"text":"pais-a-je","imageUrl":null,"isCorrect":false}],"question":"¿Cuál de las siguientes palabras está dividida correctamente?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:27:32.277703+00:00', '2025-10-25T17:27:32.277703+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'bb209f61-4448-46bd-aa7c-0d0d85821bdc', NULL, NULL, 70),
  ('bb209f61-4448-46bd-aa7c-0d0d85821bdc', 'lesson', 'lesson', 'Conciencia fonológica y fonética avanzada- diptongos e hiatos', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"En esta lección los estudiantes desarrollan conciencia fonológica y fonética avanzada al aprender a distinguir entre diptongos e hiatos. Comprenden que un diptongo ocurre cuando dos vocales se pronuncian en una misma sílaba (como en tierra o cuidado), mientras que un hiato se forma cuando las vocales se separan en sílabas distintas (como en poeta o río). A través de ejemplos auditivos y visuales, practican la correcta pronunciación, separación silábica y reconocimiento de estos patrones dentro de las palabras para fortalecer su lectura y escritura."}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:26:27.528991+00:00', '2025-10-25T17:26:27.528991+00:00', '{}'::jsonb, '🔊 ¡Cuidado con los diptongos e hiatos al dividir las palabras en sílabas!
🔊 Cuando una palabra tiene dos vocales que pertenecen a la misma sílaba, se forma un diptongo. 
Pueden ser dos vocales cerradas (i, u) 

         tie-rra, ciu-dad

o una vocal cerrada y otra abierta (a, e, o).
           
         fue-go, ai-re, nie-ve	🔊 Cuando una palabra tiene dos vocales juntas que pertenecen a sílabas distintas se forma un hiato. 

Este se forma con dos vocales abiertas 
ca-er, te-a-tro, co-rre-o, 

o con una abierta y otra cerrada que tenga acento.

li-bre-rí-a, ma-íz, ba-úl, frí-o
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('aa6d7e57-9121-482f-b1f3-e046e943e05e', 'exercise', 'multiple_choice', 'Segmentación silábica', NULL, '{"answers":[{"text":"trisílaba","imageUrl":null,"isCorrect":false},{"text":"bisílaba","imageUrl":null,"isCorrect":false},{"text":"polisílaba","imageUrl":null,"isCorrect":true}],"question":"Divide según el tipo de palabra: elefante"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:23:15.67841+00:00', '2025-10-25T17:23:15.67841+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '9ce83e65-f514-4fbb-98ec-ebd58ad8431b', NULL, NULL, 70),
  ('0e7a07cd-e8de-4168-8fbc-7c19f658e831', 'exercise', 'multiple_choice', 'Segmentación silábica', NULL, '{"answers":[{"text":"bisílaba","imageUrl":null,"isCorrect":false},{"text":"trisílaba","imageUrl":null,"isCorrect":true},{"text":"polisílaba","imageUrl":null,"isCorrect":false}],"question":"Divide según el tipo de palabra: florero "}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:22:10.698357+00:00', '2025-10-25T17:22:10.698357+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '9ce83e65-f514-4fbb-98ec-ebd58ad8431b', NULL, NULL, 70),
  ('a67e43c2-7f42-4182-9501-24ee86951926', 'exercise', 'multiple_choice', 'Segmentación silábica', NULL, '{"answers":[{"text":"monosílaba","imageUrl":null,"isCorrect":false},{"text":"trisílaba","imageUrl":null,"isCorrect":false},{"text":"bisílaba","imageUrl":null,"isCorrect":true}],"question":"Divide según el tipo de palabra: libro "}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:20:35.942245+00:00', '2025-10-25T17:20:35.942245+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '9ce83e65-f514-4fbb-98ec-ebd58ad8431b', NULL, NULL, 70),
  ('080749e9-a181-4baa-b5a4-0a7c0138396d', 'exercise', 'drag_drop', 'Segmentación silábica', NULL, '{"mode":"letters","question":"Arrastra las sílabas correctas para formar la palabra: so – li – da – ri – dad.\n¿Qué palabra formaste?\n","targetWord":"solidaridad","autoShuffle":true,"availableLetters":["s","o","l","i","d","a","r","i","d","a","d"]}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:17:40.555483+00:00', '2025-10-25T17:17:40.555483+00:00', '{}'::jsonb, 'so – li – da – ri – dad.', NULL, NULL, '["soliridad","sodaridad"]'::jsonb, 3, '9ce83e65-f514-4fbb-98ec-ebd58ad8431b', NULL, 'letters', 70),
  ('d58bba89-e61e-4a12-930b-04b56369c176', 'exercise', 'multiple_choice', 'Segmentación silábica', NULL, '{"answers":[{"text":"Bisílaba ","imageUrl":null,"isCorrect":false},{"text":"Trisílaba","imageUrl":null,"isCorrect":true},{"text":"Polisílaba","imageUrl":null,"isCorrect":false}],"question":"5.\t¿Cómo se clasifica la palabra cangrejo según sus sílabas?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:15:02.037718+00:00', '2025-10-25T17:15:02.037718+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '9ce83e65-f514-4fbb-98ec-ebd58ad8431b', NULL, NULL, 70),
  ('9d01bbe5-8634-43a8-9ae0-a52e2227ce1d', 'exercise', 'multiple_choice', 'Segmentación silábica', NULL, '{"answers":[{"text":"ca-mio-ne-ta ","imageUrl":null,"isCorrect":true},{"text":"cami-o-neta ","imageUrl":null,"isCorrect":false},{"text":"cam-ion-eta","imageUrl":null,"isCorrect":false}],"question":"\tEscribe o selecciona la forma correcta de dividir la palabra camioneta."}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:13:52.603963+00:00', '2025-10-25T17:13:52.603963+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '9ce83e65-f514-4fbb-98ec-ebd58ad8431b', NULL, NULL, 70),
  ('0c3449ce-f09f-4e6e-ae39-761389e3e18d', 'exercise', 'multiple_choice', 'Segmentación silábica', NULL, '{"answers":[{"text":"2","imageUrl":null,"isCorrect":false},{"text":"3","imageUrl":null,"isCorrect":true},{"text":"4","imageUrl":null,"isCorrect":false}],"question":"3.\t¿Cuántas sílabas tiene la palabra mariposa?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:11:57.632352+00:00', '2025-10-25T17:12:38.434453+00:00', '{}'::jsonb, 'IA resalta cada sílaba con color al pronunciarla: ma–ri–po–sa.', NULL, NULL, NULL, 3, '9ce83e65-f514-4fbb-98ec-ebd58ad8431b', NULL, NULL, 70),
  ('53a71ff9-abac-46cc-a68b-d355f8b9db7c', 'exercise', 'multiple_choice', 'División silábica', NULL, '{"answers":[{"text":"cebolla","imageUrl":null,"isCorrect":true},{"text":"pepinillo","imageUrl":null,"isCorrect":false},{"text":"espinaca","imageUrl":null,"isCorrect":false}],"question":"2.\t¿La palabra se puede clasificar como trisilábica?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:11:16.500319+00:00', '2025-10-25T17:11:16.500319+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '9ce83e65-f514-4fbb-98ec-ebd58ad8431b', NULL, NULL, 70),
  ('20f5c07f-376e-4e18-a383-efced748b19a', 'exercise', 'multiple_choice', 'Segmentación silábica', NULL, '{"answers":[{"text":"camello","imageUrl":null,"isCorrect":false},{"text":"calabaza","imageUrl":null,"isCorrect":true},{"text":"caballo","imageUrl":null,"isCorrect":false}],"question":"🔊 Lee cuidadosamente los siguientes preguntas. \n🔊 Escoge la alternativa que contesta cada pregunta correctamente.\n\n1.\t¿Cuál de las siguientes palabras se clasifica como polisílaba?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:10:09.510874+00:00', '2025-10-25T17:10:09.510874+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '9ce83e65-f514-4fbb-98ec-ebd58ad8431b', NULL, NULL, 70),
  ('9ce83e65-f514-4fbb-98ec-ebd58ad8431b', 'lesson', 'lesson', 'Conciencia fonológica y fonética avanzada- Segmentación silábica', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Análisis de pronunciación: compara la respuesta del estudiante con el modelo de sonido.\nRetroalimentación adaptativa: simplifica o complejiza las palabras según el progreso.\nApoyo visual y auditivo: letras iluminadas, animaciones y repetición de audio.\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T17:08:26.142321+00:00', '2025-10-25T17:08:26.142321+00:00', '{}'::jsonb, '🔊 La sílaba es cada una de las unidades fonológicas en que podemos dividir una palabra. Se compone, como tal, por uno o más sonidos que se agrupan en torno al de mayor intensidad, que es siempre una vocal.
🔊 Las palabras se pueden clasificar según el número de sílabas que tienen.
🔊 Monosílabas Es la palabra simple. Consta de una sola sílaba y se pronuncia en una sola emisión de voz.
🔊 Bisílabas Está formada por dos sílabas que son las que componen la palabra.
🔊 Trisílabas Son las que tienen tres sílabas en su composición.
🔊 Polisílabas Son las que constan de cuatro, cinco, seis, siete, ocho sílabas en adelante en la estructura de la palabra.
🔊 Ejemplos de división silábica
			
		Clasificación	Ejemplos
una sílaba		monosílaba	sol
dos sílabas		bisílaba	go-ma
tres sílabas		trisílaba	ce-lu-lar
más de tres sílabas		polisílaba	so-li-da-ri-dad
', NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('813c2967-dead-4182-883f-249e95503ada', 'exercise', 'multiple_choice', 'Importancia lectura - Sonidos finales', NULL, '{"answers":[{"text":"r","imageUrl":null,"isCorrect":true},{"text":"l","imageUrl":null,"isCorrect":false},{"text":"a","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: \ncelular\t¿Qué sonido escuchas al final?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:59:36.40644+00:00', '2025-10-25T16:59:36.40644+00:00', '{}'::jsonb, 'refuerza mostrando la letra final en negrita.', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('dc720ba4-336a-4651-b92b-b9089199db58', 'exercise', 'multiple_choice', 'Importancia lectura - Sonidos finales', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"a","imageUrl":null,"isCorrect":true},{"text":"t","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: botella\t¿Qué sonido escuchas al final?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:58:31.128566+00:00', '2025-10-25T16:58:31.128566+00:00', '{}'::jsonb, 'refuerza mostrando la letra final en negrita.', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('66a8af56-e251-4fe5-9a65-b92560379d05', 'exercise', 'multiple_choice', 'Importancia lectura - Sonidos finales', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":true},{"text":"p","imageUrl":null,"isCorrect":false},{"text":"e","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: papel\t¿Con qué sonido termina?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:57:18.492714+00:00', '2025-10-25T16:57:18.492714+00:00', '{}'::jsonb, '“Muy bien, el sonido final es /l/, como en coral.”', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('d0ab7978-2ed5-46e0-a1d4-385d4b9d90d2', 'exercise', 'multiple_choice', 'Importancia lectura - Sonidos finales', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"b","imageUrl":null,"isCorrect":false},{"text":"e","imageUrl":null,"isCorrect":true}],"question":"🔊 Escucha la palabra: doble\t¿Qué sonido escuchas al final?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:55:04.013227+00:00', '2025-10-25T16:55:04.013227+00:00', '{}'::jsonb, '“Muy bien, el sonido final es /l/, como en coral.”', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('95dbf400-e71e-4c4b-8426-adc773d654be', 'exercise', 'multiple_choice', 'Importancia lectura - Sonidos finales', NULL, '{"answers":[{"text":"r","imageUrl":null,"isCorrect":false},{"text":"l","imageUrl":null,"isCorrect":true},{"text":"t","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: coral\t¿Con qué sonido termina?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:54:08.611487+00:00', '2025-10-25T16:54:08.611487+00:00', '{}'::jsonb, 'muestra la letra “l” brillando al final de la palabra.', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('37d679b1-f62c-4946-a1a1-6741f91a54fd', 'exercise', 'multiple_choice', 'Importancia lectura - Sonidos medios', NULL, '{"answers":[{"text":"a","imageUrl":null,"isCorrect":true},{"text":"r","imageUrl":null,"isCorrect":false},{"text":"l","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: claro\t¿Qué sonido escuchas en el medio?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:50:59.729201+00:00', '2025-10-25T16:50:59.729201+00:00', '{}'::jsonb, 'resalta la vocal media “a” al pronunciarla.', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('41d25023-ce8d-492b-99cf-cddc7e50a7dd', 'exercise', 'multiple_choice', 'Importancia lectura - Sonidos medios', NULL, '{"answers":[{"text":"b","imageUrl":null,"isCorrect":false},{"text":"r","imageUrl":null,"isCorrect":true},{"text":"z","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: brazo\t¿Qué sonido escuchas en el centro?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:50:03.863639+00:00', '2025-10-25T16:50:03.863639+00:00', '{}'::jsonb, 'refuerza con vibración sonora de la /r/.', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('ddcb3610-3be0-4536-85c6-3a4775784300', 'exercise', 'multiple_choice', 'Importancia lectura - Sonidos medios', NULL, '{"answers":[{"text":"r","imageUrl":null,"isCorrect":true},{"text":"n","imageUrl":null,"isCorrect":false},{"text":"a","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: arena\t¿Cuál es el sonido del medio?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:49:09.086816+00:00', '2025-10-25T16:49:09.086816+00:00', '{}'::jsonb, 'reforzar con audio pausado: /a/…/r/…/e/…/n/…/a/.', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('83b7d0f4-4ea2-49f7-a79d-3262b8b1f85d', 'exercise', 'multiple_choice', 'Importancia lectura - Sonidos medios', NULL, '{"answers":[{"text":"r","imageUrl":null,"isCorrect":false},{"text":"i","imageUrl":null,"isCorrect":true},{"text":"a","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: cristal\n¿Qué sonido escuchas en el medio?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:47:38.396338+00:00', '2025-10-25T16:47:38.396338+00:00', '{}'::jsonb, 'Ofrece retroalimentación visual: la vocal “i” se ilumina en el centro.', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('e2d6f008-5ef5-44a3-922d-8d7c6365b555', 'exercise', 'multiple_choice', 'Importancia lectura - Sonidos medios', NULL, '{"answers":[{"text":"r","imageUrl":null,"isCorrect":true},{"text":"b","imageUrl":null,"isCorrect":false},{"text":"s","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: brisa. ¿Qué sonido escuchas en el medio?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:46:18.369253+00:00', '2025-10-25T16:46:18.369253+00:00', '{}'::jsonb, '“La /r/ vibra en el centro de la palabra.”', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('987c8130-8c3d-4605-8976-ec78a9be14f8', 'exercise', 'multiple_choice', 'Importancia lectura', NULL, '{"answers":[{"text":"g","imageUrl":null,"isCorrect":false},{"text":"b","imageUrl":null,"isCorrect":false},{"text":"gl","imageUrl":null,"isCorrect":true}],"question":"🔊 Escucha la palabra: globo. ¿Con qué sonido co-mienza?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:44:18.57527+00:00', '2025-10-25T16:44:18.57527+00:00', '{}'::jsonb, 'Animación: el globo se eleva al acertar.', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('15c877e3-c2dd-4333-9861-bad613a160b1', 'exercise', 'multiple_choice', 'Importancia lectura', NULL, '{"answers":[{"text":"t","imageUrl":null,"isCorrect":false},{"text":"tr","imageUrl":null,"isCorrect":true},{"text":"r","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: trineo. ¿Qué sonido escuchas al inicio?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:42:57.851205+00:00', '2025-10-25T16:42:57.851205+00:00', '{}'::jsonb, 'Debes retroalimentar con el sonido en cámara lenta: /t/ + /r/.', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('df6681f5-4c00-4a08-8793-f6853aa09a87', 'exercise', 'multiple_choice', 'Importancia lectura', NULL, '{"answers":[{"text":"fl","imageUrl":null,"isCorrect":true},{"text":"f","imageUrl":null,"isCorrect":false},{"text":"l","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: flor. ¿Con qué sonido empieza?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:41:31.508861+00:00', '2025-10-25T16:41:31.508861+00:00', '{}'::jsonb, '“Recuerda que /fl/ son dos sonidos que van juntos.”', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('10ee7d28-ee72-44cf-8ba2-5d4137ce07b1', 'exercise', 'multiple_choice', 'Importancia lectura', NULL, '{"answers":[{"text":"bl","imageUrl":null,"isCorrect":true},{"text":"b","imageUrl":null,"isCorrect":false},{"text":"r","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: bloque\n¿Qué sonido escuchas al principio?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:40:16.543518+00:00', '2025-10-25T16:40:16.543518+00:00', '{}'::jsonb, 'Debes mostrar una animación del bloque resaltando las letras iniciales.', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('0ccb33a1-df28-4984-8595-51e5155700d5', 'exercise', 'multiple_choice', 'Importancia lectura', NULL, '{"answers":[{"text":"p","imageUrl":null,"isCorrect":false},{"text":"pl","imageUrl":null,"isCorrect":true},{"text":"t","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: planta ¿Con qué sonido co-mienza?"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:39:11.401457+00:00', '2025-10-25T16:39:11.401457+00:00', '{}'::jsonb, '“Muy bien, escuchaste /pl/, dos sonidos juntos al inicio.”', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('674d87bf-aa73-4daf-a596-26f053ecce4d', 'exercise', 'multiple_choice', 'Introducción Importancia lectura', NULL, '{"answers":[{"text":"cristal y flor ","imageUrl":null,"isCorrect":false},{"text":"canal y flor","imageUrl":null,"isCorrect":false},{"text":"cristal – canal  ","imageUrl":null,"isCorrect":true}],"question":"🔊 Escucha las tres palabras:\n🔊 cristal\n🔊 canal\n🔊 flor\n🔊¿Cuáles terminan con el mismo sonido?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:36:42.214239+00:00', '2025-10-25T16:36:42.214239+00:00', '{}'::jsonb, 'Muy bien cristal – canal (terminan en /l/)', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('bcc18848-9a26-4a41-97fd-2ca45bb02a5f', 'exercise', 'true_false', 'Introducción Importancia lectura', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":false},{"text":"Falso","imageUrl":null,"isCorrect":true}],"question":"🔊 Escucha: brisa – frisa\n ¿Tienen el mismo sonido al inicio?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:34:27.706743+00:00', '2025-10-25T16:34:27.706743+00:00', '{}'::jsonb, 'una empieza con /b/ y la otra con /f/., no tienen el mismo sonido inicial. ', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('9c4381a4-ec31-4004-b421-a37a6008d6a6', 'exercise', 'true_false', 'Introducción Importancia lectura', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha las dos palabras: planta – plato\n¿Comienzan con el mismo sonido?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:32:34.425228+00:00', '2025-10-25T16:32:34.425228+00:00', '{}'::jsonb, '“Las dos comienzan con /pl/.”', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('95760488-1576-4b1e-abc1-9fd7414bb2fc', 'exercise', 'multiple_choice', 'Introducción Importancia lectura', NULL, '{"answers":[{"text":"/r/ ","imageUrl":null,"isCorrect":false},{"text":"/l/ ","imageUrl":null,"isCorrect":true},{"text":"/t/","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: cristal\n¿Con qué sonido termina?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:30:38.875829+00:00', '2025-10-25T16:30:38.875829+00:00', '{}'::jsonb, 'la letra final se ilumina.', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('931bd631-4d4b-4048-92f7-36a841f95ae9', 'exercise', 'multiple_choice', 'Introducción Importancia lectura', NULL, '{"answers":[{"text":"/b/ ","imageUrl":null,"isCorrect":false},{"text":"/r/ ","imageUrl":null,"isCorrect":true},{"text":"/s/","imageUrl":null,"isCorrect":false}],"question":"Escucha la palabra: brisa\n¿Qué sonido escuchas en el centro?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:27:32.739717+00:00', '2025-10-25T16:27:32.739717+00:00', '{}'::jsonb, '“El sonido del medio es /r/, que suena fuerte y vibra.”', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('8b67d2c8-6108-46a3-bcd9-a25ca762b18a', 'exercise', 'multiple_choice', 'Introducción Importancia lectura', NULL, '{"answers":[{"text":"/p/ ","imageUrl":null,"isCorrect":false},{"text":"/pl/ ","imageUrl":null,"isCorrect":true},{"text":"/t/","imageUrl":null,"isCorrect":false}],"question":"🔊 Escucha la palabra: planta\n1. ¿Con qué sonido comienza?\n"}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:25:38.58525+00:00', '2025-10-25T16:28:19.271489+00:00', '{}'::jsonb, 'Muy bien, escuchaste /pl/, dos sonidos juntos.”', NULL, NULL, NULL, 3, 'bf5e16ee-adcd-477f-b763-b3cb7349a888', NULL, NULL, 70),
  ('bf5e16ee-adcd-477f-b763-b3cb7349a888', 'lesson', 'lesson', 'Conciencia fonológica y fonética avanzada', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Reforzar la comprensión de la relación entre letras y sonidos y la habilidad para reconocer, segmentar y manipular sílabas y fonemas en palabras más complejas, incluyendo el uso de prefijos y sufijos comunes, para fortalecer la lectura precisa y fluida."}'::jsonb, 3, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T16:22:10.164502+00:00', '2025-10-25T16:22:10.164502+00:00', '{}'::jsonb, '🔊¡Hola! Hoy vamos a usar nuestros oídos para escuchar con atención las palabras.
🔊 Las palabras están formadas por sonidos. Cada sonido nos ayuda a reconocer, leer y escribir mejor.
🔊 Cuando aprendemos a escuchar los sonidos con cuidado, podemos notar si dos palabras comienzan, terminan o suenan parecido.
🔊 Escuchar los sonidos es el primer paso para ser mejores lectores y escritores.
🔊 Cada palabra tiene sonidos que escuchamos al inicio, en el medio y al final.
🔊 El sonido inicial es el que escuchas primero.
🔊 El sonido del medio está entre otros sonidos.
🔊 El sonido final es el último que escuchas.
		🔊 Por ejemplo:
🔊 Planta → comienza con /pl/
🔊 Brisa → tiene /r/ en el medio
🔊 Cristal → termina con /l/
🔊 Escuchar los sonidos te ayuda a leer mejor porque puedes reconocer cómo se escriben las palabras.


🔊 Ejercicio 1: Escucha y elige el sonido inicial
🔊 Escucha la palabra: planta
1. ¿Con qué sonido comienza?
a. /p/ 
b. /pl/ ✅ 
c. /t/
IA analiza la respuesta y refuerza: “Muy bien, escuchaste /pl/, dos sonidos juntos.”
🔊 Escucha la palabra: brisa
2. ¿Qué sonido escuchas en el centro?
a. /b/ 
b. /r/ ✅ 
c. /s/
IA da retroalimentación auditiva: “El sonido del medio es /r/, que suena fuerte y vibra.”
🔊 Escucha la palabra: cristal
3. ¿Con qué sonido termina?
a. /r/ 
b. /l/ ✅ 
c. /t/
IA ofrece retroalimentación visual: la letra final se ilumina.
🔊 Escucha las dos palabras: planta – plato
4. ¿Comienzan con el mismo sonido?
a.	Sí ✅
b.	No  
IA refuerza: “Las dos comienzan con /pl/.”



🔊 Escucha: brisa – frisa
5. ¿Tienen el mismo sonido al inicio?
a.	Sí 
b.	No  ✅
', 'conciencia_s', NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('7f7f0aea-e908-4e5b-9e37-9ccbb8d97708', 'exercise', 'true_false', 'Versión interactiva para la plataforma', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"🔊 Vamos a buscar rimas. Escucha dos palabras. Si suenan igual al final, presiona el botón verde. Si suenan diferente, presiona el botón rojo."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T15:29:11.120855+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T15:02:15.18028+00:00', '2025-10-25T15:29:11.120855+00:00', '{}'::jsonb, 'Excelente! Encontraste una rima.', NULL, NULL, '["mesa\t","fresa"]'::jsonb, 3, 'fab0dfbb-392a-4414-9ca5-3fa5f7e96272', NULL, NULL, 70),
  ('db1d880b-d64b-4109-bf44-f63d3a6f2aa3', 'exercise', 'true_false', 'Versión interactiva para la plataforma', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":false},{"text":"Falso","imageUrl":null,"isCorrect":true}],"question":"🔊 Vamos a buscar rimas. Escucha dos palabras. Si suenan igual al final, presiona el botón verde. Si suenan diferente, presiona el botón rojo."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T15:01:16.544926+00:00', '2025-10-25T15:01:16.544926+00:00', '{}'::jsonb, 'Puedes identificar alguna otra palabra que rime con ', NULL, NULL, '["rana \t","ratón"]'::jsonb, 3, 'fab0dfbb-392a-4414-9ca5-3fa5f7e96272', NULL, NULL, 70),
  ('3a89cf35-7715-408a-8d0c-369346e3e00e', 'exercise', 'true_false', 'Versión interactiva para la plataforma', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"🔊 Vamos a buscar rimas. Escucha dos palabras. Si suenan igual al final, presiona el botón verde. Si suenan diferente, presiona el botón rojo.\n"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:58:21.097759+00:00', '2025-10-25T14:59:34.605879+00:00', '{}'::jsonb, 'rojo	ojo', NULL, NULL, NULL, 3, 'fab0dfbb-392a-4414-9ca5-3fa5f7e96272', NULL, NULL, 70),
  ('bf894cfb-2ef0-4b82-bea2-d2209fb79d27', 'exercise', 'true_false', 'Versión interactiva para la plataforma', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":false},{"text":"Falso","imageUrl":null,"isCorrect":true}],"question":"🔊 Vamos a buscar rimas. Escucha dos palabras. Si suenan igual al final, presiona el botón verde. Si suenan diferente, presiona el botón rojo."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:52:20.194506+00:00', '2025-10-25T14:52:20.194506+00:00', '{}'::jsonb, 'Puedes identificar alguna otra palabra que rime con globo ', NULL, NULL, '["globo \tpelota"]'::jsonb, 3, 'fab0dfbb-392a-4414-9ca5-3fa5f7e96272', NULL, NULL, 70),
  ('e7aa741e-f7b3-468d-a860-e0e82ee98429', 'exercise', 'true_false', 'Versión interactiva para la plataforma', NULL, '{"answers":[{"text":"Verdadero","imageUrl":null,"isCorrect":true},{"text":"Falso","imageUrl":null,"isCorrect":false}],"question":"queso y yeso"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-25T15:30:54.3+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:50:12.960722+00:00', '2025-10-25T15:37:36.050865+00:00', '{}'::jsonb, 'Vamos a buscar rimas. Escucha dos palabras. Si suenan igual al final, presiona el botón verde. Si suenan diferente, presiona el botón rojo.
queso y yeso
no digas la respuesta
la respuesta es cierto
¡Excelente! Encontraste una rima. ', NULL, NULL, '["queso"," yeso"]'::jsonb, 3, 'fab0dfbb-392a-4414-9ca5-3fa5f7e96272', NULL, NULL, 70),
  ('fab0dfbb-392a-4414-9ca5-3fa5f7e96272', 'lesson', 'lesson', 'Busco Rimas ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"El estudiante reconoce y produce palabras que riman, desarrollando la habilidad de escuchar los sonidos finales de las palabras y notar similitudes. Reconocimiento y producción de rimas (sol/caracol, gato/zapato, queso/yeso).\nIdentificación de palabras que suenan igual al final."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:41:45.622999+00:00', '2025-10-25T14:45:53.349162+00:00', '{}'::jsonb, '🔊¡Hola, aquí otra vez! 
🔊 Hoy vas a descubrir algo muy divertido: las rimas. 
🔊 Las rimas son palabras que suenan parecidas al final.
🔊 Por ejemplo, escucha:
🔊 gato – zapato
🔊 flor – tambor
🔊¿Escuchaste cómo suenan casi igual al final? Eso es una rima.
🔊 Las rimas hacen que las palabras suenen bonitas y fáciles de recordar.
🔊 Las usamos en canciones, poemas y juegos de palabras. 
🔊 Escucha, repite y encuentra las palabras que suenan igual.
🔊 Mientras más rimas descubras, mejor lector te volverás.
🔊 “Escucha con atención.
Sol… caracol.
🔊¿Riman o no?”

', 'rima_coqui', 'El estudiante selecciona Sí riman.
🔊 “¡Muy bien! Sol y caracol suenan igual al final.”
🔊 “Ahora di tú una palabra que rime con sol.”
🔊 (El estudiante dice: “girasol” o “farol.” o “frijol”)
Retroalimentación:
🔊 “¡Excelente! sol, caracol y farol riman. Eres un gran descubridor de rimas.” 

', NULL, 3, NULL, NULL, NULL, 70),
  ('f3bb578c-48bb-4fb3-a581-b17bcd0a44c7', 'exercise', 'fill_blank', 'Une los Sonidos - Nivel 4 – Desafío (Contrastes mínimos para discriminación auditiva)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos con atención y elige la palabra correcta. Algunas suenan parecidas.","target":"gato","letters":["g","a","t","o"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:38:22.328665+00:00', '2025-10-25T14:38:22.328665+00:00', '{}'::jsonb, 'Muy bien. /fo + /ca/ forman foca. Escucha cómo los sonidos se juntan.	

Escucha otra vez despacio… Intenta combinar de nuevo', NULL, NULL, NULL, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('ab655017-21f6-45cd-9b5d-012674f5dfce', 'exercise', 'fill_blank', 'Une los Sonidos - Nivel 4 – Desafío (Contrastes mínimos para discriminación auditiva)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos con atención y elige la palabra correcta. Algunas suenan parecidas.","target":"foca","letters":["f","o","c","a"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:36:52.984656+00:00', '2025-10-25T14:36:52.984656+00:00', '{}'::jsonb, 'Correcta: Muy bien. /fo + /ca/ forman foca. Escucha cómo los sonidos se juntan.	
Incorrecta: Escucha otra vez despacio… Intenta combinar de nuevo', NULL, NULL, NULL, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('6d4266eb-1cbb-4a41-b345-eaeaca5017d7', 'exercise', 'fill_blank', 'Une los Sonidos - Nivel 4 – Desafío (Contrastes mínimos para discriminación auditiva)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos con atención y elige la palabra correcta. Algunas suenan parecidas.","target":"taza","letters":["t","a","z","a"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:34:56.272503+00:00', '2025-10-25T14:34:56.272503+00:00', '{}'::jsonb, 'Muy bien. /t + /aza/ forman taza. Escucha cómo los sonidos se juntan.	

Escucha otra vez despacio… Intenta combinar de nuevo', NULL, NULL, NULL, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('c131d86b-5792-42de-865c-975063a55a1c', 'exercise', 'fill_blank', 'Ine los Sonidos - Nivel 4 – Desafío (Contrastes mínimos para discriminación auditiva)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos con atención y elige la palabra correcta. Algunas suenan parecidas.","target":"pala","letters":["p","a","l","a"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:32:23.055891+00:00', '2025-10-25T14:32:23.055891+00:00', '{}'::jsonb, 'Muy bien. /p/ + /ala/ forman pala. Escucha cómo los sonidos se juntan.	
Escucha otra vez despacio… Intenta combinar de nuevo', NULL, NULL, NULL, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('c9ea13e9-7734-468a-95b3-3c4e06a6fc36', 'exercise', 'fill_blank', 'Une los Sonidos - Nivel 3 bisílabas comunes (dos sílabas)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos de cada parte y únelos para formar la palabra completa.","target":"isla","letters":["i","s","l","a"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:30:12.827795+00:00', '2025-10-25T14:30:12.827795+00:00', '{}'::jsonb, 'Muy bien. /is/ + /la/ forman isla. Escucha cómo los sonidos se juntan.
Escucha otra vez despacio… Intenta combinar de nuevo
', NULL, NULL, NULL, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('41b5f7f0-c32e-4142-8857-489ef3d112e7', 'exercise', 'fill_blank', 'Une los Sonidos - Nivel 3 bisílabas comunes (dos sílabas)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos de cada parte y únelos para formar la palabra completa.","target":"guagua","letters":["g","u","a","g","u","a"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:26:26.754153+00:00', '2025-10-25T14:26:26.754153+00:00', '{}'::jsonb, 'Muy bien. /gua/ + /gua/ forman guagua. 
Escucha cómo los sonidos se juntan.	Escucha otra vez despacio… Intenta combinar de nuevo', NULL, NULL, NULL, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('994f07d8-4eb0-449e-84ad-95822c75bb10', 'exercise', 'fill_blank', 'Une los Sonidos - Nivel 3 bisílabas comunes (dos sílabas)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos de cada parte y únelos para formar la palabra completa.","target":"mesa","letters":["m","e","s","a"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:23:18.757361+00:00', '2025-10-25T14:23:18.757361+00:00', '{}'::jsonb, 'Muy bien. /me/ + /sai/ forman mesa. Escucha cómo los sonidos se juntan.	
Escucha otra vez despacio… Intenta combinar de nuevo', NULL, NULL, NULL, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('c147cc20-f8aa-4b62-894f-edc1078c7555', 'exercise', 'fill_blank', 'Une los Sonidos - Nivel 3 bisílabas comunes (dos sílabas)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos de cada parte y únelos para formar la palabra completa.","target":"coquí","letters":["c","o","q","u","í"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:11:18.381446+00:00', '2025-10-25T14:11:18.381446+00:00', '{}'::jsonb, 'Muy bien. /co/ + /qui/ forman coquí. Escucha cómo los sonidos se juntan.	
Escucha otra vez despacio… Intenta combinar de nuevo', NULL, NULL, NULL, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('721f429e-a1d5-42d5-a1ed-5ba2761f7261', 'exercise', 'fill_blank', 'Une los Sonidos - Nivel 3 bisílabas comunes (dos sílabas)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos de cada parte y únelos para formar la palabra completa.","target":"rana","letters":["r","a","n","a"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:09:49.314447+00:00', '2025-10-25T14:09:49.314447+00:00', '{}'::jsonb, 'Muy bien. /ra/ + /nai/ forman rana. Escucha cómo los sonidos se juntan.	
Escucha otra vez despacio… Intenta combinar de nuevo', NULL, NULL, NULL, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('d21faf3a-07a7-44e9-a19c-e96e92ebc3c3', 'exercise', 'fill_blank', 'Une los Sonidos - Nivel 2 (CCV: consonante, consonante vocal consonante)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos y une las letras para formar la palabra.","target":"brisa","letters":["b","r","i","s","a"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:08:21.317801+00:00', '2025-10-25T14:08:21.317801+00:00', '{}'::jsonb, 'Muy bien. /br/ + /isa/ forman brisa. Escucha cómo los sonidos se juntan. 
Escucha otra vez despacio… Intenta combinar de nuevo', NULL, NULL, '["Brisa","Risa"]'::jsonb, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('cf4400c0-e669-4b86-82ce-becf63594419', 'exercise', 'fill_blank', 'Une los Sonidos - Nivel 2 (CCV: consonante, consonante vocal consonante)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos y une las letras para formar la palabra.","target":"plato","letters":["p","l","a","t","o"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:06:34.098467+00:00', '2025-10-25T14:06:34.098467+00:00', '{}'::jsonb, NULL, NULL, 'Muy bien. /pl/ + /ato/ forman plato. Escucha cómo los sonidos se juntan.
Escucha otra vez despacio… Intenta combinar de nuevo', '["Plato","Pato "]'::jsonb, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('db5b2025-ebe6-4056-90e0-31759bd23d05', 'exercise', 'fill_blank', 'Une los Sonidos - Nivel 2 (CCV: consonante, consonante vocal consonante)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos y une las letras para formar la palabra.","target":"flor","letters":["f","l","o","r"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:04:40.1637+00:00', '2025-10-25T14:04:40.1637+00:00', '{}'::jsonb, NULL, NULL, 'Retroalimentacion si está bien  
Muy bien. /fl/ + /or/ forman flor. Escucha cómo los sonidos se juntan.
Retroalimentacion si está mal
Escucha otra vez despacio… Intenta combinar de nuevo

', NULL, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('c203102e-a714-4d1e-afeb-c8aef0a63b50', 'exercise', 'fill_blank', 'Une los Sonidos Nivel 1 – Básico (CVC: consonante-vocal-consonante)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos y une las letras para formar la palabra.","target":"luz","letters":["l","u","z"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:02:53.60975+00:00', '2025-10-25T14:02:53.60975+00:00', '{}'::jsonb, NULL, NULL, 'Muy bien. /ll/ + /uz/ forman luz. Escucha cómo los sonidos se juntan.
Escucha otra vez despacio… Intenta combinar de nuevo', NULL, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('8a260ec8-41f3-455f-9884-5d47a05888ab', 'exercise', 'fill_blank', 'Nivel 1 – Básico (CVC: consonante-vocal-consonante)', NULL, '{"mode":"single_word","prompt":"🔊 Escucha los sonidos y une las letras para formar la palabra.","target":"pan","letters":["p","a","n"],"autoShuffle":true}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T14:00:10.025973+00:00', '2025-10-25T14:00:10.025973+00:00', '{}'::jsonb, 'Muy bien. /pl/ + /an/ forman pan. Escucha cómo los sonidos se juntan.
Escucha otra vez despacio… Intenta combinar de nuevo', NULL, NULL, NULL, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, NULL, 70),
  ('aee19c61-80cb-47ee-b144-3ddc8e4185cd', 'exercise', 'drag_drop', 'Nivel 1 – Básico (CVC: consonante-vocal-consonante)', NULL, '{"mode":"letters","question":"🔊 Escucha los sonidos y une las letras o iconos para formar la palabra.","targetWord":"mar","autoShuffle":true,"availableLetters":["m","a","r"]}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:58:10.113407+00:00', '2025-10-25T13:58:10.113407+00:00', '{}'::jsonb, 'Retroalimentacion si está bien  Excelente 
 Retroalimentacion si está mal Intenta otra vez ', NULL, NULL, NULL, 3, '1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', NULL, 'letters', 70),
  ('1ea0bcb7-4e7b-4bec-bb2f-3fce2929467f', 'lesson', 'lesson', 'Une los Sonidos ', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"\tEl estudiante combina sonidos (fonemas/sílabas) para formar palabras orales y luego selecciona o construye la palabra correcta en la pantalla."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:53:17.899375+00:00', '2025-10-25T13:54:45.340887+00:00', '{}'::jsonb, '🔊¡Hola!
🔊 Hoy vamos a unir sonidos para formar palabras.
🔊 Escucha con atención:
🔊 /s/ … /ol/
🔊Arrastra las fichas de sonido a la barra de mezcla.
🔊 Cuando las unes, suena sol.
🔊 Muy bien, /s/ + /ol/ = sol.
🔊¡Así se forma una palabra nueva!

Escucha:
  🔊   /co/ … /quí/
    coquí 
¡Muy bien! /co/ + /quí/ = coquí, el animalito que canta en Puerto Rico. 🇵🇷
Refuerzo: Muy bien. /pl/ + /ato/ forman plato. Escucha cómo los sonidos se juntan.
', 'coqui_une', 'Elemento	Especificación
Dominio	Conciencia fonémica → blending (combinación de fonemas)
Objetivo	El estudiante combina sonidos (fonemas/sílabas) para formar palabras orales y luego selecciona o construye la palabra correcta en la pantalla.
Instrucción (voz y texto)	“Escucha: /s/ + /ol/. Arrastra las letras o iconos para formar la palabra. ¿Qué palabra es?”
Dinámica	1) El sistema reproduce los sonidos por separado → 2) El estudiante arrastra fichas de sonidos/letras hasta una barra de mezcla → 3) La app reproduce la palabra resultante y muestra imágenes; el estudiante confirma la opción correcta.
Retroalimentación positiva	“¡Excelente! /s/ + /ol/ = sol.” (sonido de campanita + animación)
Retroalimentación correctiva	“Escucha otra vez: /s/… /ol/. Intenta combinar de nuevo.” (repite audio lento → normal)
IA adaptativa	Aumenta la complejidad: CVC → CCVC/CCV → palabras bisílabas; introduce contrastes mínimos según errores (p/b, t/d, f/s…).
Evidencia	Tasa de éxito en combinaciones, tiempo promedio por ítem, número de repeticiones de audio, tipo de error (sonido inicial/medio/final).
Accesibilidad	Audio lento/normal, subtítulos, repetición ilimitada, opción de arrastrar o tocar (tap-to-place); voces en español PR.
Extensión	Modo voz: el estudiante dice la palabra formada; la app valida la pronunciación global y el fonema objetivo.
', NULL, 3, NULL, NULL, NULL, 70),
  ('2b26302c-6cba-40d0-8fc4-a3fd7f384311', 'lesson', 'lesson', 'English Reading Comprehension - Grade 1', 'Introduction to reading comprehension in English for first graders', '{"instructions":"Complete the reading exercises in this lesson."}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 15, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:46:17.686347+00:00', '2025-10-25T13:46:17.686347+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 70),
  ('896bfb60-6c3b-44c3-8295-54351f344f89', 'exercise', 'multiple_choice', 'Fonética: Escucho los sonidos', NULL, '{"answers":[{"text":"Si comienzan igual. ","imageUrl":null,"isCorrect":true},{"text":"No suenan igual.","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🔊¿Las dos palabras comienzan o terminan con el mismo sonido?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:37:09.614895+00:00', '2025-10-25T13:44:50.472712+00:00', '{}'::jsonb, '🔊 Escucha con atención.', NULL, NULL, '["🔊 chico / chocolate"]'::jsonb, 3, 'e2e2cab3-b0c4-44df-be7b-4e3ade25464d', NULL, NULL, 70),
  ('c244da9c-092d-48fe-8cde-cdb294704891', 'exercise', 'multiple_choice', 'Fonética: Escucho los sonidos', NULL, '{"answers":[{"text":"Si terminan igual. ","imageUrl":null,"isCorrect":true},{"text":"Si no suenan igual.","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🔊¿Las dos palabras comienzan o terminan con el mismo sonido?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:35:52.61204+00:00', '2025-10-25T13:43:50.410848+00:00', '{}'::jsonb, '🔊 Escucha con atención.', NULL, NULL, '["   🔊 sol / caracol"]'::jsonb, 3, 'e2e2cab3-b0c4-44df-be7b-4e3ade25464d', NULL, NULL, 70),
  ('30278bb3-1132-40be-8b24-a1716b8b9f83', 'exercise', 'multiple_choice', 'Fonética: Escucho los sonidos', NULL, '{"answers":[{"text":"Si,  comienzan igual. ","imageUrl":null,"isCorrect":true},{"text":"No suenan igual.","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🔊¿Las dos palabras comienzan o terminan con el mismo sonido?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:34:43.283798+00:00', '2025-10-25T13:43:03.755434+00:00', '{}'::jsonb, '🔊 Escucha con atención.
🔊 flor /  fuego
', NULL, 'Repite de ser necesario ', '["Flor ","fuego "]'::jsonb, 3, 'e2e2cab3-b0c4-44df-be7b-4e3ade25464d', NULL, NULL, 70),
  ('27bedde8-d772-4416-bbd6-f4ab8ff7ebd4', 'exercise', 'multiple_choice', 'Fonética: Escucho los sonidos', NULL, '{"answers":[{"text":"Si,  comienzan igual. ","imageUrl":null,"isCorrect":true},{"text":"No suenan igual.","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🔊¿Las dos palabras comienzan o terminan con el mismo sonido?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:33:25.649124+00:00', '2025-10-25T13:42:25.035005+00:00', '{}'::jsonb, '🔊 Escucha con atención.

', NULL, NULL, '["🔊 nube  /  nido"]'::jsonb, 3, 'e2e2cab3-b0c4-44df-be7b-4e3ade25464d', NULL, NULL, 70),
  ('9c76ddff-ab9f-445a-9fa1-e2ce748ed29e', 'exercise', 'multiple_choice', 'Fonética: Escucho los sonidos', NULL, '{"answers":[{"text":"No, suenan igual. ","imageUrl":null,"isCorrect":false},{"text":"Si, terminan igual.","imageUrl":null,"isCorrect":true},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🔊¿Las dos palabras comienzan o terminan con el mismo sonido?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:32:13.922559+00:00', '2025-10-25T13:41:19.822949+00:00', '{}'::jsonb, '🔊 Escucha con atención.

', NULL, NULL, '["🔊 zapato  /  gato"]'::jsonb, 3, 'e2e2cab3-b0c4-44df-be7b-4e3ade25464d', NULL, NULL, 70),
  ('bc185555-e314-4ae3-b27b-5481eafcb5e7', 'exercise', 'multiple_choice', 'Fonética: Escucho los sonidos', NULL, '{"answers":[{"text":"Si suenan igual. ","imageUrl":null,"isCorrect":false},{"text":"No suenan igual.","imageUrl":null,"isCorrect":true},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🔊¿Las dos palabras comienzan o terminan con el mismo sonido?\n\n"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:30:54.238176+00:00', '2025-10-25T13:40:04.430275+00:00', '{}'::jsonb, 'Escucha con atención ', NULL, NULL, '["🔊 flor  /  amor"]'::jsonb, 3, 'e2e2cab3-b0c4-44df-be7b-4e3ade25464d', NULL, NULL, 70),
  ('72c2685a-2606-488a-bedd-ffa4d4c54137', 'exercise', 'multiple_choice', 'Fonética: Escucho los sonidos', NULL, '{"answers":[{"text":"Si suenan igual. ","imageUrl":null,"isCorrect":true},{"text":"No terminan igual.","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"🔊¿Las dos palabras comienzan o terminan con el mismo sonido?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:28:59.204769+00:00', '2025-10-25T13:39:20.502643+00:00', '{}'::jsonb, '🔊 Escucha con atención.', NULL, NULL, '["🔊 mano / mesa"]'::jsonb, 3, 'e2e2cab3-b0c4-44df-be7b-4e3ade25464d', NULL, NULL, 70),
  ('e2e2cab3-b0c4-44df-be7b-4e3ade25464d', 'lesson', 'lesson', 'Fonética: Escucho los sonidos', NULL, '{"question":"🔊 Escucha con atención. ¡Usa tus oídos para descubrirlo! ","caseSensitive":false,"correctAnswer":""}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:23:30.978435+00:00', '2025-10-25T13:23:30.978435+00:00', '{}'::jsonb, '🔊 Escucha con atención. ¡Usa tus oídos para descubrirlo! 
              🔊 sol / sapo
🔊¿Las dos palabras comienzan o terminan con el mismo sonido?
', 'coqui_encuentra', '🔊¿Las dos palabras comienzan o terminan con el mismo sonido?
❌_____ Si suenan igual. 
✅____  No terminan igual.
', NULL, 3, NULL, NULL, NULL, 70),
  ('acc140cc-d36f-4050-8f51-e8bf7968c9d1', 'lesson', 'lesson', 'Encuentra el Sonido con Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"El estudiante identifica si dos palabras comienzan o terminan con el mismo sonido, fortaleciendo su capacidad auditiva y discriminación fonológica."}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:16:20.139144+00:00', '2025-10-25T13:16:20.139144+00:00', '{}'::jsonb, 'Fonética: Escucho los sonidos
Elemento	Descripción detallada
Nombre de la actividad	Detective de sonidos
Dominio de lectura	Conciencia fonémica
Objetivo de aprendizaje	El estudiante identifica si dos palabras comienzan o terminan con el mismo sonido, fortaleciendo su capacidad auditiva y discriminación fonológica.
Instrucción al estudiante (voz y texto)	“Escucha con atención. ¿Las dos palabras comienzan o terminan con el mismo sonido? Si suenan igual al principio o al final, ¡presiona el botón de ✔️!”
Descripción de la dinámica	<ul><li>El sistema reproduce dos palabras (por ejemplo: sol – sapo).</li><li>El estudiante escucha y analiza si las palabras comienzan o terminan con el mismo sonido.</li><li>Selecciona entre las opciones: Sí, suenan igual / No, suenan diferente.</li><li>El sistema proporciona retroalimentación inmediata y ajusta el nivel según el desempeño.</li></ul>
Retroalimentación positiva	“¡Excelente! Sol y sapo empiezan con el mismo sonido /s/.”
Retroalimentación correctiva	“Casi. Sol y luna no empiezan igual. Escucha otra vez el sonido /s/.”
Tecnología / IA aplicada	<ul><li>IA de detección de patrones de error: si el estudiante confunde sonidos iniciales o finales, el sistema refuerza ese tipo de pares en las siguientes rondas.</li><li>Reconocimiento de voz opcional: el estudiante puede repetir las palabras y el sistema verifica la pronunciación de los sonidos iniciales o finales.</li><li>Motor adaptativo que incrementa la dificultad (pares más parecidos o palabras más largas).</li></ul>
Evidencia de aprendizaje	<ul><li>Número de aciertos consecutivos en identificación de sonidos iguales.</li><li>Porcentaje total de respuestas correctas.</li><li>Tiempo de respuesta promedio.</li><li>Registro de fonemas dominados y fonemas en refuerzo.</li></ul>
Accesibilidad y lenguaje	<ul><li>Audio en español con acento puertorriqueño.</li><li>Opción de texto + audio para reforzar comprensión (DUA).</li><li>Modo bilingüe opcional (instrucción y ejemplos también disponibles en inglés).</li></ul>
Extensión opcional	<ul><li>Modo “Reto del detective”: el estudiante escucha tres palabras y debe identificar cuáles dos comparten el mismo sonido.</li><li>Modo “Final feliz”: el sistema cambia a sonidos finales (ej. sol – caracol).</li></ul>


', 'coqui_encuentra', '🔊¡Hola,! 
🔊 Hoy vamos a escuchar dos palabras y descubrir si suenan igual al principio o al final.
🔊 Escucha con atención:
      🔊      sol    /   sapo

🔊¿Escuchaste? Las dos empiezan con el sonido /s/.
🔊¡Muy bien! Sol y sapo comienzan igual.

🔊¡Sigue escuchando para resolver más misterios de sonidos!
🔊 Escucha estas palabras:
   🔊               sol  /   caracol
🔊¿Terminan con el mismo sonido?
✅___  Sí  las dos terminan con /l/
❌___ No  suenan diferente
Retroalimentación positiva:
🔊¡Muy bien! Sol y caracol terminan igual, con el sonido /l/.
Ejemplo tipo “Reto rápido”
     🔊 rana /  ratón
🔊¿Empiezan con el mismo sonido?
❌_____No, suenan diferente.
 ✅ ____¡Sí! Empiezan con /r/. 
¡Pista resuelta, detective!

', '["Ejemplo de instrucción para pantalla o narrador","🔊 Escucha con atención. ¡Usa tus oídos para descubrirlo! "]'::jsonb, 3, NULL, NULL, NULL, 70),
  ('e58e9cab-5b06-4c04-bae5-2cc5a0c10b58', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397570114-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397580634-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397589561-image.png","isCorrect":true}],"question":"Escucha el sonido /z/. ¿Cuál palabra empieza con /z/?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:10:50.794287+00:00', '2025-10-25T13:13:21.395541+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70),
  ('f7287df5-ba18-4fc9-a5fa-158ac9a98bbc', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397353872-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397359010-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397366377-image.png","isCorrect":false}],"question":"¿Qué palabra comienza con /d/?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:09:36.669303+00:00', '2025-10-25T13:09:36.669303+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70),
  ('d483eee4-b338-46e2-b4e1-39fa517f9537', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397284697-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397290375-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397296314-image.png","isCorrect":false}],"question":"Escucha el sonido /n/. ¿Cuál imagen comienza con /n/?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:08:34.233853+00:00', '2025-10-25T13:08:34.233853+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70),
  ('55fba947-5da8-4389-913e-5fafd8217f44', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397125370-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397140030-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397146970-image.png","isCorrect":false}],"question":"¿Cuál palabra empieza con /f/? "}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:06:09.543849+00:00', '2025-10-25T13:06:09.543849+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70),
  ('78142a59-7073-4664-b49f-e9073d3a8351', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397040252-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397045896-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761397050723-image.png","isCorrect":false}],"question":"Escucha el sonido /ch/. ¿Cuál palabra empieza con ese sonido?”"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:04:26.57568+00:00', '2025-10-25T13:04:26.57568+00:00', '{}'::jsonb, 'chocolate', NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70);

INSERT INTO public.manual_assessments ("id", "type", "subtype", "title", "description", "content", "grade_level", "language", "subject_area", "curriculum_standards", "enable_voice", "voice_speed", "auto_read_question", "difficulty_level", "estimated_duration_minutes", "status", "published_at", "view_count", "completion_count", "average_score", "created_by", "created_at", "updated_at", "metadata", "voice_guidance", "activity_template", "coqui_dialogue", "pronunciation_words", "max_attempts", "parent_lesson_id", "order_in_lesson", "drag_drop_mode", "passing_score") VALUES
  ('2e379a60-139d-4e55-9df7-d2a23649ed4b', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396922015-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396927602-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396932487-image.png","isCorrect":false}],"question":"¿Cuál imagen comienza con /r/?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:02:19.147837+00:00', '2025-10-25T13:02:19.147837+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70),
  ('0ecc7eaa-7bc4-42f3-bdc4-0da0a3710357', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396852314-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396859250-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396869490-image.png","isCorrect":false}],"question":"Escucha el sonido /v/. ¿Qué palabra empieza con ese sonido?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T13:01:24.149509+00:00', '2025-10-25T13:01:24.149509+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70),
  ('1bff526b-1714-483d-abd8-a51b67e70081', 'exercise', 'multiple_choice', 'Fonética- Sonidos Iniciales ', NULL, '{"answers":[{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396672505-image.png","isCorrect":true},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396694377-image.png","isCorrect":false},{"text":"","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761396766882-image.png","isCorrect":false}],"question":"¿Cuál palabra comienza con /g/?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-25T12:59:39.34749+00:00', '2025-10-25T12:59:39.34749+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'c408279c-0219-4af7-baee-55040879be35', NULL, NULL, 70),
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
cama', NULL, NULL, NULL, 3, '5f048380-5df3-4c4c-9136-387b5d7ee93f', NULL, NULL, 70);

INSERT INTO public.manual_assessments ("id", "type", "subtype", "title", "description", "content", "grade_level", "language", "subject_area", "curriculum_standards", "enable_voice", "voice_speed", "auto_read_question", "difficulty_level", "estimated_duration_minutes", "status", "published_at", "view_count", "completion_count", "average_score", "created_by", "created_at", "updated_at", "metadata", "voice_guidance", "activity_template", "coqui_dialogue", "pronunciation_words", "max_attempts", "parent_lesson_id", "order_in_lesson", "drag_drop_mode", "passing_score") VALUES
  ('377128aa-75d6-4aee-a7a2-77d1384954ac', 'exercise', 'multiple_choice', 'Sílabas 3', NULL, '{"answers":[{"text":"si","imageUrl":null,"isCorrect":false},{"text":"lla","imageUrl":null,"isCorrect":true}],"question":"¿Con qué sílaba termina la imagen?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761316659307-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T14:37:50.089+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T14:43:44.249858+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sílaba termina la imagen?
no digas la respuesta 
silla', NULL, NULL, NULL, 3, '5f048380-5df3-4c4c-9136-387b5d7ee93f', 2, NULL, 70),
  ('d4f06982-3811-4c49-8917-bf807cae2838', 'exercise', 'multiple_choice', 'Sílabas 2', NULL, '{"answers":[{"text":"sa","imageUrl":null,"isCorrect":false},{"text":"me","imageUrl":null,"isCorrect":true}],"question":"¿Con qué sílaba empieza la imagen?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761316525978-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T14:35:34.092+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T14:42:16.016868+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sílaba empieza la imagen?
no digas la contestacion
mesa', NULL, NULL, NULL, 3, '5f048380-5df3-4c4c-9136-387b5d7ee93f', 1, NULL, 70),
  ('4ada5515-257a-4c4c-815f-477eeb55c41b', 'exercise', 'multiple_choice', 'Sílabas 1', NULL, '{"answers":[{"text":"ca","imageUrl":null,"isCorrect":true},{"text":"sa","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sílaba empieza la imagen?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761316332946-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T14:32:55.3+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T14:39:37.511032+00:00', '2025-10-24T14:53:18.650907+00:00', '{}'::jsonb, '¿Con qué sílaba empieza la imagen?

no digas la contestacion 
casa', NULL, NULL, NULL, 3, '5f048380-5df3-4c4c-9136-387b5d7ee93f', 0, NULL, 70),
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
  ('a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', 'lesson', 'lesson', 'Conciencia fonémica', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"¡Escucha con mucha atención!\nCada palabra tiene un sonido que se escucha al principio.\nCuando el sistema diga una palabra, escucha y elige el primer sonido que oyes.\nPor ejemplo, si escuchas “plato”, el primer sonido es /p/.\n¡Vamos a jugar con los sonidos para descubrir cómo comienzan las palabras!\n\nPalabra Sonido inicial correcto Opciones Visual Referencia Cultural\nsol\ns\nl\no\ns\nClima tropical\nmar\nm\na\nm\nr\nMar Caribe\nflor\nf\nl\nr\nf\nFlor de Maga símbolo nacional\nIsla\ni\nl\ni\na\ncoquí\nc\no\nq\nc\nSímbolo de Puerto Rico\nbarco\nb\nc\nr\nb\nTransporte marítimo\nplátano\np\nL\np\nt\nComida típica\ncarro\na\nr\nc\na\nTransporte\nterrestre\nguagua\ng\nu\ng\na\nTransporte típico\n\nPantalla 1 – Instrucción auditiva y visual:\n“Escucha la palabra: coquí.\n¿Qué sonido escuchas primero?”\nOpciones:\n/c/ /r/ /a/\nRespuestas automáticas:\n\n“¡Excelente! Coquí empieza con /c/.”\n“Escucha otra vez: coquí. Repite conmigo: /c/.”\nVisual:\nAnimación del coquí cantando y la letra C brillando.","questionImage":"https://images.pexels.com/photos/278887/pexels-photo-278887.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-26T19:07:37.676+00:00', 0, 0, NULL, '9e53641e-fed6-4b8d-9551-191d64b02f06', '2025-10-22T14:21:34.80607+00:00', '2025-10-26T19:07:37.845541+00:00', '{}'::jsonb, 'Modo
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
  ('586c1835-bb64-40fa-98b8-a2180c338a18', 'exercise', 'multiple_choice', ' Read the informational text carefully. Then, choo', NULL, '{"answers":[{"text":"insects","imageUrl":null,"isCorrect":true},{"text":"dogs","imageUrl":null,"isCorrect":false},{"text":"sharks","imageUrl":null,"isCorrect":false}],"question":" Read the informational text carefully. Then, choose the correct \nanswer:\nWhat other animals can you find on this type of forest?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761063783103-image.png"}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-21T16:24:31.126631+00:00', '2025-10-25T13:46:54.249572+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '2b26302c-6cba-40d0-8fc4-a3fd7f384311', NULL, NULL, 70),
  ('8953b8be-a9d1-48d0-9854-3b6832c84a57', 'assessment', 'multiple_choice', 'English  Assessment  Grade | 1st grade  Subject | English', NULL, '{"answers":[{"text":"d","imageUrl":null,"isCorrect":true},{"text":"c","imageUrl":null,"isCorrect":false},{"text":"b","imageUrl":null,"isCorrect":false}],"question":"Look at the picture.  Choose the correct beginning and ending sound.\n__ og","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761063205153-image.png"}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-21T16:14:13.411524+00:00', '2025-10-25T13:46:54.249572+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, '2b26302c-6cba-40d0-8fc4-a3fd7f384311', NULL, NULL, 70),
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
-- Exported: 2025-10-29T11:42:33.351Z

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
-- Exported: 2025-10-29T11:42:33.351Z

-- Clear existing data (uncomment if needed)
-- TRUNCATE TABLE public.user_roles CASCADE;

INSERT INTO public.user_roles ("id", "user_id", "role", "created_at") VALUES
  ('a85bc4de-f53b-4df6-bdf7-39de2524896d', '49063ede-8e67-429e-87f6-2f291cba1203', 'depr_executive', '2025-10-21T14:09:42.358148+00:00');


-- ============================================
-- Table: voice_sessions
-- Records: 287
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
-- Total records: 287
-- Exported: 2025-10-29T11:42:33.351Z

-- Clear existing data (uncomment if needed)
-- TRUNCATE TABLE public.voice_sessions CASCADE;

INSERT INTO public.voice_sessions ("id", "session_id", "student_id", "assessment_id", "language", "grade_level", "metrics", "created_at", "ended_at", "model") VALUES
  ('e9b5ccdd-da78-48c7-9f29-7c6407887500', 'sess_CVSY7cEsxukwrcz47ThoI', '49063ede-8e67-429e-87f6-2f291cba1203', '4ccc5d25-d1d8-43a0-be9e-515083e79ae9', 'es-PR', 0, '{}'::jsonb, '2025-10-28T01:12:27.83+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a4adae72-c3cf-4aa9-a14c-5a5ba7e28cd2', 'sess_CVMnjRo7iYARsNy6C97QG', '49063ede-8e67-429e-87f6-2f291cba1203', 'd55d38e9-9003-456c-9ab2-8962e42d143b', 'es-PR', 0, '{}'::jsonb, '2025-10-27T19:04:12.05+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('56449f43-8d90-4804-bb21-bd4270309e68', 'sess_CVMc3YxTimjAyeqMpVntQ', '49063ede-8e67-429e-87f6-2f291cba1203', 'd18b2d0d-8536-4fb2-8325-515dc9abba5c', 'es-PR', 0, '{}'::jsonb, '2025-10-27T18:52:07.827+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('2d1b3c50-2bf1-4f49-9d93-e484b090df88', 'sess_CVMRwO50uKRVFzmNr6DW3', '49063ede-8e67-429e-87f6-2f291cba1203', 'd18b2d0d-8536-4fb2-8325-515dc9abba5c', 'es-PR', 0, '{}'::jsonb, '2025-10-27T18:41:41.09+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('46b6ddaa-aee1-43e4-87d0-315f0c60a653', 'sess_CVMNEMCQwYDWWuli62yQ6', '49063ede-8e67-429e-87f6-2f291cba1203', '8734b45c-7799-4b78-b041-44f5e4f79f8a', 'es-PR', 0, '{}'::jsonb, '2025-10-27T18:36:48.792+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('dbc6f785-3700-4b27-aba8-7d7b38d31372', 'sess_CVMKOlUDvep7Xm3QG6Ryt', '49063ede-8e67-429e-87f6-2f291cba1203', '391967c7-0525-4403-94c0-385027a31486', 'es-PR', 0, '{}'::jsonb, '2025-10-27T18:33:52.473+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('93e89ff2-7113-4543-8527-16fb028e8398', 'sess_CVMHHduEilESQJGENmpXI', '49063ede-8e67-429e-87f6-2f291cba1203', '7c381a56-75c3-42c6-9362-6507896cb584', 'es-PR', 0, '{}'::jsonb, '2025-10-27T18:30:39.798+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('efd42f83-ad66-410e-8e0e-0ff4e3999a10', 'sess_CUj1hjWx8RRZcEQ9aoyP2', '49063ede-8e67-429e-87f6-2f291cba1203', 'b8b34023-bb5f-4145-914a-9f64a53b2891', 'es-PR', 0, '{}'::jsonb, '2025-10-26T00:35:57.199+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('9b938c08-6d9e-4d71-a519-ad889809b71c', 'sess_CUbTyN4eSm87yarDJTYAJ', '49063ede-8e67-429e-87f6-2f291cba1203', '9c4381a4-ec31-4004-b421-a37a6008d6a6', 'es-PR', 0, '{}'::jsonb, '2025-10-25T16:32:38.883+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('b3f3dd0c-4cda-48ab-8942-83b0beb365c7', 'sess_CUav9cs9SbDZKlkJixarh', '49063ede-8e67-429e-87f6-2f291cba1203', 'bf894cfb-2ef0-4b82-bea2-d2209fb79d27', 'es-PR', 0, '{}'::jsonb, '2025-10-25T15:56:39.233+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('4e46efbd-2bae-4491-bb3a-c960ee7aa912', 'sess_CUacn8dbEYTnljf2p4D4Z', '49063ede-8e67-429e-87f6-2f291cba1203', 'e7aa741e-f7b3-468d-a860-e0e82ee98429', 'es-PR', 0, '{}'::jsonb, '2025-10-25T15:37:41.773+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('e53c665f-885d-4c06-8186-975bf1340f99', 'sess_CUaaRBhU2lC0WB5DcQyQz', '49063ede-8e67-429e-87f6-2f291cba1203', 'e7aa741e-f7b3-468d-a860-e0e82ee98429', 'es-PR', 0, '{}'::jsonb, '2025-10-25T15:35:15.799+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('3a64ce0b-4ca5-443f-bba3-dbc0bf416caa', 'sess_CUaUco2h1n9OAwhZAztD1', '49063ede-8e67-429e-87f6-2f291cba1203', '7f7f0aea-e908-4e5b-9e37-9ccbb8d97708', 'es-PR', 0, '{}'::jsonb, '2025-10-25T15:29:14.437+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('20d444c3-f114-4564-831f-c54d44f2ffd7', 'sess_CUaPH14IbIEjtKLiYRAns', '49063ede-8e67-429e-87f6-2f291cba1203', 'e7aa741e-f7b3-468d-a860-e0e82ee98429', 'es-PR', 0, '{}'::jsonb, '2025-10-25T15:23:43.639+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('a856d94c-deef-4927-8bdb-f19273e50c77', 'sess_CUZuyhVli0oaYj7telDWr', '49063ede-8e67-429e-87f6-2f291cba1203', 'bf894cfb-2ef0-4b82-bea2-d2209fb79d27', 'es-PR', 0, '{}'::jsonb, '2025-10-25T14:52:24.591+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('20573500-d067-4824-9447-49769b44ae4c', 'sess_CUZswoUFYg0EXWw58UC3x', '49063ede-8e67-429e-87f6-2f291cba1203', 'e7aa741e-f7b3-468d-a860-e0e82ee98429', 'es-PR', 0, '{}'::jsonb, '2025-10-25T14:50:18.433+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
  ('31ba43b4-e3d5-4d5c-b50f-fa70dd5a8409', 'sess_CUZX2K38AzrwWjDIwAM8j', '49063ede-8e67-429e-87f6-2f291cba1203', '41b5f7f0-c32e-4142-8857-489ef3d112e7', 'es-PR', 0, '{}'::jsonb, '2025-10-25T14:27:40.807+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
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
  ('b69691f3-7082-4e85-860e-1fe975d4543e', 'sess_CUEOk2fSL9SmvGc9D9XPq', '49063ede-8e67-429e-87f6-2f291cba1203', '2c26161f-b0ec-4255-a2b4-0b244b65ab8c', 'es-PR', 0, '{}'::jsonb, '2025-10-24T15:53:42.275+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17');

INSERT INTO public.voice_sessions ("id", "session_id", "student_id", "assessment_id", "language", "grade_level", "metrics", "created_at", "ended_at", "model") VALUES
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
  ('ed0f0108-b87e-48e1-9957-f8b9fa68c720', 'sess_CUDKPS5XZwaNG2BcGKLRz', '9e53641e-fed6-4b8d-9551-191d64b02f06', '586c1835-bb64-40fa-98b8-a2180c338a18', 'en', 0, '{}'::jsonb, '2025-10-24T14:45:10.085+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
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
  ('d525575b-b3a0-434f-a474-b54b7feabb17', 'sess_CTpFm83YAKUxNBge0wcsv', '49063ede-8e67-429e-87f6-2f291cba1203', '7a4c5c98-43a9-47bf-ba89-405aa64a8ced', 'es-PR', 0, '{}'::jsonb, '2025-10-23T13:02:46.308+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17');

INSERT INTO public.voice_sessions ("id", "session_id", "student_id", "assessment_id", "language", "grade_level", "metrics", "created_at", "ended_at", "model") VALUES
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
  ('01ba92e8-1adf-4737-8f96-61a070f4ae8c', 'sess_CTgCFqshFHkUDvWE9sZTW', '49063ede-8e67-429e-87f6-2f291cba1203', '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', 'es-PR', 0, '{}'::jsonb, '2025-10-23T03:22:31.663+00:00', NULL, 'gpt-4o-realtime-preview-2024-12-17'),
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
-- Total Records: 1071
-- Backup Date: 2025-10-29T11:42:33.356Z
-- ============================================
