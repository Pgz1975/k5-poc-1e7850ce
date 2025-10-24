-- ============================================
-- Supabase Database Backup
-- ============================================
-- Generated: 2025-10-24T13:34:17.800Z
-- Project: meertwtenhlmnlpwxhyz
-- URL: https://meertwtenhlmnlpwxhyz.supabase.co
--
-- Tables Included:
--   ✓ manual_assessments
--   ✓ profiles
--   ✓ user_roles
--
-- Tables Excluded:
--   ✗ voice_sessions
--   ✗ pdf_text_content
-- ============================================

-- Disable foreign key checks during import
SET session_replication_role = 'replica';

BEGIN;


-- ============================================
-- Table: manual_assessments
-- ============================================

-- Table: public.manual_assessments
CREATE TABLE IF NOT EXISTS public.manual_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    student_name TEXT,
    assessment_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: manual_assessments
-- Total records: 75
-- Exported: 2025-10-24T13:34:17.801Z

-- Clear existing data (optional)
-- DELETE FROM public.manual_assessments;

INSERT INTO public.manual_assessments (id, type, subtype, title, description, content, grade_level, language, subject_area, curriculum_standards, enable_voice, voice_speed, auto_read_question, difficulty_level, estimated_duration_minutes, status, published_at, view_count, completion_count, average_score, created_by, created_at, updated_at, metadata, voice_guidance, activity_template, coqui_dialogue, pronunciation_words, max_attempts, parent_lesson_id, order_in_lesson, drag_drop_mode) VALUES
  ('b8234b01-b004-47d9-b1b2-aaac2b9a5db8', 'exercise', 'drag_drop', 'Formar palabras 5', NULL, '{"mode":"letters","question":"Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.","targetWord":"salón","autoShuffle":true,"availableLetters":["ó","l","s","a","n"]}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T13:20:01.316+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T13:26:43.467311+00:00', '2025-10-24T13:26:43.467311+00:00', '{}'::jsonb, '🔊 Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras.
🔊 Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.
🔊 Después, lee la palabra o escríbela según lo que escuches.
🔊¡Cada sonido te ayuda a descubrir la palabra!
', NULL, '🔊 Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras.
🔊 Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.
🔊 Después, lee la palabra o escríbela según lo que escuches.
🔊¡Cada sonido te ayuda a descubrir la palabra!
', NULL, 3, '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', NULL, 'letters'),
  ('7728050d-4bf5-4c84-93fe-f2d678994b80', 'exercise', 'drag_drop', 'Formar palabras 4', NULL, '{"mode":"letters","question":"Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.","targetWord":"pluma","autoShuffle":true,"availableLetters":["o","l","p","m","a","u"]}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T13:18:06.383+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T13:24:48.367641+00:00', '2025-10-24T13:24:48.367641+00:00', '{}'::jsonb, 'Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras.
🔊 Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.
🔊 Después, lee la palabra o escríbela según lo que escuches.
🔊¡Cada sonido te ayuda a descubrir la palabra!
', NULL, NULL, NULL, 3, '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', NULL, 'letters'),
  ('0497a424-66cd-4092-9e59-b919c1c95295', 'exercise', 'drag_drop', 'Formar palabras 3', NULL, '{"mode":"letters","question":"Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.","targetWord":"lápiz","autoShuffle":true,"availableLetters":["á","e","l","p","z","i"]}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T12:11:44.186+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T12:18:26.159618+00:00', '2025-10-24T12:18:26.159618+00:00', '{}'::jsonb, 'Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras.
🔊 Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.
🔊 Después, lee la palabra o escríbela según lo que escuches.
🔊¡Cada sonido te ayuda a descubrir la palabra!
', NULL, NULL, NULL, 3, '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', NULL, 'letters'),
  ('b93f79c6-0e61-45c4-b0ed-5d068c4e10aa', 'exercise', 'drag_drop', 'Formar palabras 2', NULL, '{"mode":"letters","question":"Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.","targetWord":"libro","autoShuffle":true,"availableLetters":["l","b","i","r","a","o"]}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T12:08:17.762+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T12:14:59.939711+00:00', '2025-10-24T12:14:59.939711+00:00', '{}'::jsonb, '🔊 Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras.
🔊 Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.
🔊 Después, lee la palabra o escríbela según lo que escuches.
🔊¡Cada sonido te ayuda a descubrir la palabra!
', NULL, NULL, NULL, 3, '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', NULL, 'letters'),
  ('2c26161f-b0ec-4255-a2b4-0b244b65ab8c', 'exercise', 'fill_blank', 'Formar palabras 1', NULL, '{"mode":"single_word","prompt":"Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras. Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.\n","target":"mesa","letters":["o","m","e","s","a","l"],"autoShuffle":true}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T11:55:33.045+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T11:56:33.753682+00:00', '2025-10-24T12:02:15.228821+00:00', '{}'::jsonb, 'Las letras tienen sonidos, y cuando juntamos esos sonidos, formamos palabras.
🔊 Escucha con atención, mira las letras y arrástralas para formar la palabra correcta.
🔊 Después, lee la palabra o escríbela según lo que escuches.
🔊¡Cada sonido te ayuda a descubrir la palabra!
', NULL, NULL, NULL, 3, '5c290712-b7e8-4464-a2b4-a4b3e1ae5ea5', NULL, NULL),
  ('4104168b-b2ab-467c-b95b-0b796a88fe2a', 'lesson', 'lesson', 'Nex lesson with image', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"est es un tet","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761304920375-Generated%20Image%20October%2017,%202025%20-%2011_36AM.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T11:22:09.344936+00:00', '2025-10-24T11:24:41.572153+00:00', '{}'::jsonb, 'habla super rapido para ver', NULL, NULL, NULL, 3, NULL, NULL, NULL),
  ('b7d5189f-2d9b-42b7-9cab-871c670591d5', 'exercise', 'true_false', 'true or flse test', NULL, '{"answers":[{"text":"True","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761303782055-Neutral%20_%20Waiting.png","isCorrect":true},{"text":"False","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761303788631-reading%20book.png","isCorrect":false}],"question":"choose the rightt answer "}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T11:03:11.939248+00:00', '2025-10-24T11:24:45.991869+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL),
  ('850ffa0d-c9e1-469b-8d07-6cfc63c3f62e', 'exercise', 'drag_drop', 'drag and drop image to zone test', NULL, '{"mode":"match","question":"match Coqui to his attitudes","dropZones":[{"id":"zone-1761301536014","label":"happy"},{"id":"zone-1761301567879","label":"thinking"},{"id":"zone-1761301574086","label":"reading"}],"draggableItems":[{"id":"item-1761301585395","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761301584791-reading%20book.png","type":"image"},"correctZone":"zone-1761301574086"},{"id":"item-1761301596854","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761301596441-excited.png","type":"image"},"correctZone":"zone-1761301536014"},{"id":"item-1761301608126","content":{"url":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761301607860-thinking.png","type":"image"},"correctZone":"zone-1761301567879"}],"allowMultiplePerZone":false}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T10:28:21.288825+00:00', '2025-10-24T11:24:50.265462+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, 'match'),
  ('8133e265-0047-43bd-8d12-00afb2dd3946', 'exercise', 'write_answer', 'write answer test', NULL, '{"question":"what''s the next word going to","caseSensitive":false,"correctAnswer":"be","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761299402108-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T09:51:51.125796+00:00', '2025-10-24T11:24:53.98119+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL),
  ('0e830479-fc0e-4896-ae05-e2aaadbb0e70', 'exercise', 'fill_blank', 'fill the blank test  instruccionesinstruccionesinstruccionesinstruccionesins  truccionesinstrucciones', NULL, '{"mode":"single_word","prompt":" instruccionesinstruccionesinstruccionesinstruccionesins  truccionesinstrucciones","target":"coqui","letters":["c","o","q","u","i","r","l"],"autoShuffle":true}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-24T09:46:20.447752+00:00', '2025-10-24T11:24:56.327392+00:00', '{}'::jsonb, 'habla despacio. guia elestudiante habla despacio. guia elestudiante', NULL, 'habla despacio. guia elestudiantehabla despacio. guia elestudiante', '["habla despacio. guia elestudiantehabla despacio. guia elestudiantevhabla despacio. guia elestudiante"]'::jsonb, 3, NULL, NULL, NULL),
  ('2489a943-75a2-4603-a022-f7391f77e321', 'exercise', 'multiple_choice', 'LAS VOCALES 3', NULL, '{"answers":[{"text":"a","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761243992994-image.png","isCorrect":true},{"text":"b","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761244007620-image.png","isCorrect":false},{"text":"c","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761244025170-image.png","isCorrect":false}],"question":"¿Cuál de estos dibujos comienza con la vocal Ee?"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T18:32:49.977+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T18:34:24.347505+00:00', '2025-10-23T18:39:32.658603+00:00', '{}'::jsonb, '¿Cuál de estos dibujos comienza con la vocal Ee?', NULL, NULL, NULL, 3, '333764ec-545a-4672-881c-f21583827bdb', NULL, NULL),
  ('333764ec-545a-4672-881c-f21583827bdb', 'lesson', 'lesson', 'LAS VOCALES Ee', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Esta es la vocal Ee. Observa que hay dos letras que la representan. La letra de color rojo es la mayúscula es la más grande y se utiliza al principio de los nombres propios y de las oraciones. La de color azul es la minúscula es la más pequeña y las usamos con más frecuencia que las mayúsculas.\n🔊 E e             \n \n🔊 Observa la posición de la boca en la imagen para poder emitir el sonido de esta vocal. Escucha atentamente su sonido.\n🔊 Esta es la vocal Ee. Observa las imágenes que comienzan con el sonido Ee. Escucha y repite cada uno de sus nombres.\n               \n            🔊 Escuela                             🔊 Escritorio                       🔊 Escalera \n"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T11:18:45.129+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T18:09:23.977714+00:00', '2025-10-24T11:25:27.014909+00:00', '{}'::jsonb, 'Esta es la vocal Ee. Observa que hay dos letras que la representan. La letra de color rojo es la mayúscula es la más grande y se utiliza al principio de los nombres propios y de las oraciones. La de color azul es la minúscula es la más pequeña y las usamos con más frecuencia que las mayúsculas.
🔊 E e             
 
🔊 Observa la posición de la boca en la imagen para poder emitir el sonido de esta vocal. Escucha atentamente su sonido.
🔊 Esta es la vocal Ee. Observa las imágenes que comienzan con el sonido Ee. Escucha y repite cada uno de sus nombres.
               
            🔊 Escuela                             🔊 Escritorio                       🔊 Escalera 
', NULL, NULL, NULL, 3, NULL, NULL, NULL),
  ('8127471e-d6dc-4383-a26c-e03eeef59ed8', 'exercise', 'multiple_choice', 'LAS VOCALES 2', NULL, '{"answers":[{"text":"1","imageUrl":null,"isCorrect":false},{"text":"2","imageUrl":null,"isCorrect":false},{"text":"3","imageUrl":null,"isCorrect":true}],"question":"¿Con qué letra comienza el dibujo?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761242250146-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T17:58:17.933+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T18:05:00.971808+00:00', '2025-10-23T18:05:00.971808+00:00', '{}'::jsonb, '¿Con qué letra comienza el dibujo?', NULL, NULL, NULL, 3, 'ffd27da9-cfd0-4d76-bcda-8ae295b06064', NULL, NULL),
  ('bf0c238d-5d8d-4dd9-9de2-dd84b4149f71', 'exercise', 'multiple_choice', 'LAS VOCALES 1', NULL, '{"answers":[{"text":"a","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761241973514-image.png","isCorrect":true},{"text":"b","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761241985878-image.png","isCorrect":false},{"text":"c","imageUrl":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761241999007-image.png","isCorrect":false}],"question":"¿Cuál de estos dibujos comienza con la vocal Aa?\t"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T17:55:12.175+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T18:01:55.689284+00:00', '2025-10-23T18:01:55.689284+00:00', '{}'::jsonb, '¿Cuál de estos dibujos comienza con la vocal Aa?	', NULL, NULL, NULL, 3, 'ffd27da9-cfd0-4d76-bcda-8ae295b06064', NULL, NULL),
  ('ffd27da9-cfd0-4d76-bcda-8ae295b06064', 'lesson', 'lesson', 'LAS VOCALES Aa', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"\nLas vocales son 5 letras del abecedario. Estas representan un sonido vocálico. Estos sonidos los puedes pronunciar con tu boca abierta sin la obstrucción de la lengua, los labios o los dientes. Las vocales son:  Aa, Ee, Ii, Oo, Uu. \n\n🔊 A\n🔊 Esta es la vocal Aa. Observa que hay dos letras que la representan. La letra de color rojo es la mayúscula es la más grande y se utiliza al principio de los nombres propios y de las oraciones. La de color azul es la minúscula es la más pequeña y las usamos con más frecuencia que las mayúsculas.\nA a\n🔊   \n🔊 Observa la posición de la boca en la imagen para poder emitir el sonido de esta vocal. Escucha atentamente su sonido.\n🔊 Esta es la vocal Aa. Observa las imágenes que comienzan con el sonido Aa. Escucha y repite cada uno de sus nombres.\nA a\n \n           🔊 Avión\t\t                                🔊 Alfombra\t"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T18:01:12.667+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T17:45:15.838736+00:00', '2025-10-23T18:07:55.258714+00:00', '{}'::jsonb, '🔊¡Hola,! 
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
', NULL, NULL, NULL, 3, NULL, NULL, NULL),
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
', NULL, NULL, NULL, 3, NULL, NULL, NULL),
  ('55dfdda5-9fce-4e70-b8c2-a6e8a0c4d6be', 'lesson', 'lesson', 'Rimas Divertidas con Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"La rima es un conjunto de sonidos que se repiten al final de dos palabras. En ese sonido se incluyen las vocales y consonantes de la última sílaba. Por ejemplo, \"casa\" y \"taza\", \"gato\" y \"pato\" o \"foco\" y \"coco\" riman porque sus sonidos finales son idénticos.\n🔊 Ejemplo: sombrilla/bombilla\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T13:24:03.701+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T13:58:37.509198+00:00', '2025-10-24T13:30:45.624524+00:00', '{}'::jsonb, 'La rima es un conjunto de sonidos que se repiten al final de dos palabras. En ese sonido se incluyen las vocales y consonantes de la última sílaba. Por ejemplo, "casa" y "taza", "gato" y "pato" o "foco" y "coco" riman porque sus sonidos finales son idénticos.
🔊 Ejemplo: sombrilla/bombilla
', 'rima_coqui', NULL, NULL, 3, NULL, NULL, NULL),
  ('960797e1-1d11-46ee-9b57-db58a77dd46b', 'exercise', 'multiple_choice', 'Escoge la sílaba 4', NULL, '{"answers":[{"text":"gui","imageUrl":null,"isCorrect":true},{"text":"gi","imageUrl":null,"isCorrect":false},{"text":"qui","imageUrl":null,"isCorrect":false}],"question":"Mañana voy a tocar mi  ____tarra."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T14:07:46.765+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T13:56:17.279019+00:00', '2025-10-23T14:07:46.96601+00:00', '{}'::jsonb, '🔊 Instrucciones para el estudiante
🔊 Escucha y lee con atención cada oración.
🔊 Luego, escoge la sílaba correcta para completar la palabra incompleta.
🔊¡Piensa en cómo suena la palabra completa y elige la respuesta correcta!
 no digas la palabra, la palabra es guitarra

Mañana voy a tocar mi  ____tarra.
a.	gui
b.	gi
c.	qui
', NULL, NULL, NULL, 3, '8b2ab422-87ed-4d1a-abe0-3a774fedb521', NULL, NULL),
  ('ce7296f9-3a95-4ee6-aa80-99844fccc79a', 'exercise', 'multiple_choice', 'Escoge la sílaba 3', NULL, '{"answers":[{"text":"chu","imageUrl":null,"isCorrect":false},{"text":"yu","imageUrl":null,"isCorrect":false},{"text":"llu","imageUrl":null,"isCorrect":true}],"question":"Voy a jugar en la _____via."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T13:46:54.767+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T13:53:36.921839+00:00', '2025-10-23T13:53:36.921839+00:00', '{}'::jsonb, NULL, NULL, 'Instrucciones para el estudiante
🔊 Escucha y lee con atención cada oración.
🔊 Luego, escoge la sílaba correcta para completar la palabra incompleta.
🔊¡Piensa en cómo suena la palabra completa y elige la respuesta correcta!

no digas la contestacion la palabra es lluvia

Voy a jugar en la _____via.
a.	chu
b.	Yu
c.	llu 

', NULL, 3, '8b2ab422-87ed-4d1a-abe0-3a774fedb521', NULL, NULL),
  ('5059569e-5e56-4b1a-929f-f7f8e4960f0b', 'exercise', 'multiple_choice', 'Escoge la sílaba 2', NULL, '{"answers":[{"text":"li","imageUrl":null,"isCorrect":false},{"text":"chi","imageUrl":null,"isCorrect":true},{"text":"ni","imageUrl":null,"isCorrect":false}],"question":"La ____na está muy rica. "}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T13:44:12.752+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T13:47:31.382683+00:00', '2025-10-23T13:50:55.57896+00:00', '{}'::jsonb, '🔊 Instrucciones para el estudiante
🔊 Escucha y lee con atención cada oración.
🔊 Luego, escoge la sílaba correcta para completar la palabra incompleta.
🔊¡Piensa en cómo suena la palabra completa y elige la respuesta correcta!

la palabra es china pero no lo puedes decir

🔊 La ____na está muy rica. 
a.	li
b.	chi
c.	ni

', NULL, NULL, NULL, 3, '8b2ab422-87ed-4d1a-abe0-3a774fedb521', NULL, NULL),
  ('72e31595-8d66-4e19-b295-bca77788b801', 'exercise', 'multiple_choice', 'Escoge la sílaba 1', NULL, '{"answers":[{"text":"ba","imageUrl":null,"isCorrect":false},{"text":"da","imageUrl":null,"isCorrect":false},{"text":"pa","imageUrl":null,"isCorrect":true}],"question":"El ______jarito está en la rama. "}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T13:38:40.641+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T13:29:53.190256+00:00', '2025-10-23T13:45:22.841093+00:00', '{}'::jsonb, 'escoge la sílaba correcta para completar la palabra incompleta.
no digas la contestacion 
solo indica que debe buscar la silaba', NULL, NULL, NULL, 3, '8b2ab422-87ed-4d1a-abe0-3a774fedb521', NULL, NULL),
  ('8b2ab422-87ed-4d1a-abe0-3a774fedb521', 'lesson', 'lesson', 'Escoge la sílaba que completa cada palabra incompleta', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Reconocer la sílaba que falta para completar una palabra, fortaleciendo la correspondencia grafema–fonema, la lectura silábica y la comprensión del significado de la palabra."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T13:19:36.521+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T13:26:19.328763+00:00', '2025-10-23T13:26:19.328763+00:00', '{}'::jsonb, 'Instrucciones para el estudiante
🔊 Escucha y lee con atención cada oración.
🔊 Luego, escoge la sílaba correcta para completar la palabra incompleta.
🔊¡Piensa en cómo suena la palabra completa y elige la respuesta correcta!
', 'conciencia_s', NULL, NULL, 3, NULL, NULL, NULL),
  ('7a4c5c98-43a9-47bf-ba89-405aa64a8ced', 'lesson', 'lesson', 'subtipe test', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"SECTION 1: Hi! Let''s play with tropical forest rhymes.\nSECTION 2: Listen: snail rhymes with pail. Do you hear how they end the same?\nSECTION 3: Now you: What rhymes with tree? Yes, bee!"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T11:45:20.756005+00:00', '2025-10-24T13:16:44.125596+00:00', '{}'::jsonb, 'Emphasize the rhyming endings. Celebrate each correct rhyme.', 'rimas_tropicales', 'SECTION 1: Hi! Let''s play with tropical forest rhymes.
SECTION 2: Listen: snail rhymes with pail. Do you hear how they end the same?
SECTION 3: Now you: What rhymes with tree? Yes, bee!', '["snail","pail","tree","bee","butterfly","sky"]'::jsonb, 3, NULL, NULL, NULL),
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
¡Cada sonido te ayuda a descubrir una palabra nueva!', 'conciencia_s', NULL, NULL, 3, NULL, NULL, NULL),
  ('90874df8-6288-4123-8c82-fa4211e10c8d', 'exercise', 'multiple_choice', 'Sonido final 8', NULL, '{"answers":[{"text":"n","imageUrl":null,"isCorrect":true},{"text":"ó","imageUrl":null,"isCorrect":false},{"text":"m","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:18:49.640446+00:00', '2025-10-23T03:19:32.913497+00:00', '{}'::jsonb, '¿Con qué sonido termina?

camión', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', NULL, NULL),
  ('ad89a19b-d78b-40b7-af35-89f8b2455fd8', 'exercise', 'multiple_choice', 'Sonido final 7', NULL, '{"answers":[{"text":"a","imageUrl":null,"isCorrect":false},{"text":"s","imageUrl":null,"isCorrect":true},{"text":"m","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:16:18.293248+00:00', '2025-10-23T03:16:18.293248+00:00', '{}'::jsonb, '¿Con qué sonido termina?
palmas', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', NULL, NULL),
  ('439e21f3-10e4-4f72-ab65-bd59edbf0369', 'exercise', 'multiple_choice', 'Sonido final 6', NULL, '{"answers":[{"text":"p","imageUrl":null,"isCorrect":false},{"text":"m","imageUrl":null,"isCorrect":false},{"text":"o","imageUrl":null,"isCorrect":true}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:15:01.00131+00:00', '2025-10-23T03:15:01.00131+00:00', '{}'::jsonb, '¿Con qué sonido termina?
campo', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', NULL, NULL),
  ('7063cf8a-5653-4421-9003-d43750c7cb91', 'exercise', 'multiple_choice', 'Sonido final 5', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"z","imageUrl":null,"isCorrect":true},{"text":"u","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:13:48.449918+00:00', '2025-10-23T03:13:48.449918+00:00', '{}'::jsonb, '¿Con qué sonido termina?
luz', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', NULL, NULL),
  ('6c6d2c8b-9405-43f0-9ca2-92b26d99ce63', 'exercise', 'multiple_choice', 'Sonido final 4', NULL, '{"answers":[{"text":"j","imageUrl":null,"isCorrect":false},{"text":"a","imageUrl":null,"isCorrect":false},{"text":"e","imageUrl":null,"isCorrect":true}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:12:34.278057+00:00', '2025-10-23T03:12:34.278057+00:00', '{}'::jsonb, '¿Con qué sonido termina?
oleaje', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', NULL, NULL),
  ('e8351a27-ed8d-4b14-a42a-fcb9f42cd578', 'exercise', 'multiple_choice', 'Sonido final 3', NULL, '{"answers":[{"text":"e","imageUrl":null,"isCorrect":false},{"text":"n","imageUrl":null,"isCorrect":false},{"text":"a","imageUrl":null,"isCorrect":true}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:10:52.973546+00:00', '2025-10-23T03:10:52.973546+00:00', '{}'::jsonb, '¿Con qué sonido termina?
arena', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', NULL, NULL),
  ('a25bca99-610e-4a7b-a9a0-3f0051763bd8', 'exercise', 'multiple_choice', 'Sonido final 2', NULL, '{"answers":[{"text":"o","imageUrl":null,"isCorrect":false},{"text":"l","imageUrl":null,"isCorrect":true},{"text":"s","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:09:41.307399+00:00', '2025-10-23T03:09:41.307399+00:00', '{}'::jsonb, '¿Con qué sonido termina?
sol', NULL, NULL, NULL, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', NULL, NULL),
  ('2043dcd3-7372-4ba9-a275-717af556a473', 'exercise', 'multiple_choice', 'Sonido final 1', NULL, '{"answers":[{"text":"r","imageUrl":null,"isCorrect":true},{"text":"l","imageUrl":null,"isCorrect":false},{"text":"f","imageUrl":null,"isCorrect":false}],"question":"¿Con qué sonido termina?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:04:41.463794+00:00', '2025-10-23T03:08:23.460387+00:00', '{}'::jsonb, '¿Con qué sonido termina?
flor', NULL, NULL, '["flor"]'::jsonb, 3, 'c7d30040-c801-4eb9-870f-a9936cf3e940', NULL, NULL),
  ('c7d30040-c801-4eb9-870f-a9936cf3e940', 'lesson', 'lesson', 'Detección de sonido final', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Identificar y reconocer el sonido final (fonema final) en palabras familiares del entorno cotidiano, fortaleciendo la conciencia fonémica y la comprensión de la estructura sonora del lenguaje."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:01:38.647786+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Escucha con mucha atención.
Todas las palabras tienen un sonido que se escucha al final.
Tu trabajo será descubrir con qué sonido termina cada palabra.
Por ejemplo:
Escucha la palabra bote.
¿Con qué sonido termina?
/t/ o /e/?
¡Correcto! Brote termina con /e/.
¡Prepárate para escuchar el sonido que cierra cada palabra!', 'conciencia_s', NULL, NULL, 3, NULL, NULL, NULL),
  ('2a436d0a-621a-4104-bd55-6d9c3fd46f0e', 'exercise', 'multiple_choice', 'Sonido del medio 9', NULL, '{"answers":[{"text":"o","imageUrl":null,"isCorrect":true},{"text":"c","imageUrl":null,"isCorrect":false},{"text":"b","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T03:00:06.668997+00:00', '2025-10-23T03:00:06.668997+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
boca', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', NULL, NULL),
  ('54312047-b763-4f89-8d07-143d0a9168fe', 'exercise', 'multiple_choice', 'sonido del medio 8', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"a","imageUrl":null,"isCorrect":true},{"text":"n","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:59:11.492726+00:00', '2025-10-23T02:59:11.492726+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
flan', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', NULL, NULL),
  ('5e981d1d-e863-4d6e-9b02-2284219c7e49', 'exercise', 'multiple_choice', 'Sonido del medio 7', NULL, '{"answers":[{"text":"p","imageUrl":null,"isCorrect":false},{"text":"i","imageUrl":null,"isCorrect":true},{"text":"ñ","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:58:12.260814+00:00', '2025-10-23T02:58:12.260814+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
piña', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', NULL, NULL),
  ('2e0b62b3-0ec3-460a-8406-cc1cf7ac8bfd', 'exercise', 'multiple_choice', 'Sonido del medio 6', NULL, '{"answers":[{"text":"f","imageUrl":null,"isCorrect":false},{"text":"r","imageUrl":null,"isCorrect":false},{"text":"e","imageUrl":null,"isCorrect":true}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:57:01.266242+00:00', '2025-10-23T02:57:01.266242+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
fresa', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', NULL, NULL),
  ('00b54134-f94b-4385-8b84-b8d954cc6f92', 'exercise', 'multiple_choice', 'Sonido del medio 5', NULL, '{"answers":[{"text":"u","imageUrl":null,"isCorrect":true},{"text":"j","imageUrl":null,"isCorrect":false},{"text":"g","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:55:23.581334+00:00', '2025-10-23T02:55:23.581334+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
jugo', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', NULL, NULL),
  ('cd65bcb4-b2dd-4d04-9013-d62f5b4c35e4', 'exercise', 'multiple_choice', 'Sonido del medio 4', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"ch","imageUrl":null,"isCorrect":false},{"text":"e","imageUrl":null,"isCorrect":true}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:53:52.464482+00:00', '2025-10-23T02:53:52.464482+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
leche', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', NULL, NULL),
  ('1bea38eb-2008-4917-8eea-95bcf2e5a2ca', 'exercise', 'multiple_choice', 'Sonido del medio 3', NULL, '{"answers":[{"text":"c","imageUrl":null,"isCorrect":false},{"text":"a","imageUrl":null,"isCorrect":true},{"text":"f","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:46:40.155052+00:00', '2025-10-23T02:46:40.155052+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
cafe', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', NULL, NULL),
  ('27fa5f08-e402-4d11-b51a-f61523bab8bf', 'exercise', 'multiple_choice', 'Sonido del medio 2', NULL, '{"answers":[{"text":"a","imageUrl":null,"isCorrect":false},{"text":"p","imageUrl":null,"isCorrect":true},{"text":"n","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:45:29.82896+00:00', '2025-10-23T02:45:29.82896+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
pan', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', NULL, NULL),
  ('4db6c6be-cff3-48e0-b5da-1825b8122be7', 'exercise', 'multiple_choice', 'Sonido del medio 1', NULL, '{"answers":[{"text":"m","imageUrl":null,"isCorrect":false},{"text":"o","imageUrl":null,"isCorrect":true},{"text":"g","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas en el centro?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:44:11.418851+00:00', '2025-10-23T02:44:11.418851+00:00', '{}'::jsonb, '¿Qué sonido escuchas en el centro?
gomas', NULL, NULL, NULL, 3, '10060923-9bb8-4a94-8ddd-0ffbf80bd975', NULL, NULL),
  ('10060923-9bb8-4a94-8ddd-0ffbf80bd975', 'lesson', 'lesson', 'Encuentra el sonido del medio', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Reconocer y aislar el sonido del medio (fonema central) en palabras de uso común, ampliando la conciencia fonémica más allá del sonido inicial y final."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:38:24.478016+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Habla despacio y claramente. Enfatiza el sonido /s/. Celebra con "¡Wepa!" cuando lo hagan bien.', 'conciencia_s', 'Escucha muy bien la palabra que diré.
Toda palabra tiene un sonido en el centro.
Tu tarea es descubrir cuál sonido escuchas en el medio.
Por ejemplo:
Escucha la palabra plano.
¿Qué sonido escuchas en el centro?
/p/, /l/ a /n/o/?
¡Correcto! En grano, el sonido del medio es /a/.
¡Vamos a escuchar, pensar y encontrar el sonido escondido!', NULL, 3, NULL, NULL, NULL),
  ('43ca30f3-d9cf-4ad0-9d9f-e73d2758d74f', 'exercise', 'multiple_choice', 'Doble palabra 9', NULL, '{"answers":[{"text":"silla","imageUrl":null,"isCorrect":true},{"text":"mesa","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /s/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:33:53.643452+00:00', '2025-10-23T02:33:53.643452+00:00', '{}'::jsonb, '¿Cuál empieza con /s/?
silla
mesa', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', NULL, NULL),
  ('ddab36ad-0334-4f92-88b5-50a0f80a15c7', 'exercise', 'multiple_choice', 'Doble palabra 8', NULL, '{"answers":[{"text":"gato","imageUrl":null,"isCorrect":true},{"text":"perro","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /g/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:32:07.642388+00:00', '2025-10-23T02:32:07.642388+00:00', '{}'::jsonb, '¿Cuál empieza con /g/?
gato
perro', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', NULL, NULL),
  ('e66d5c15-8c2e-4e4f-8eea-29dad271a499', 'exercise', 'multiple_choice', 'Doble palabra 7', NULL, '{"answers":[{"text":"plátano","imageUrl":null,"isCorrect":true},{"text":"guineo","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /p/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:30:03.262718+00:00', '2025-10-23T02:30:43.654727+00:00', '{}'::jsonb, '¿Cuál empieza con /p/?
platano
guineo', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', NULL, NULL),
  ('6fa1d1d5-95bf-44a6-ad8d-f5e61828ba61', 'exercise', 'multiple_choice', 'Doble palabra 6', NULL, '{"answers":[{"text":"luna","imageUrl":null,"isCorrect":true},{"text":"sol","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /l/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:28:04.38801+00:00', '2025-10-23T02:28:04.38801+00:00', '{}'::jsonb, '¿Cuál empieza con /l/?
luna
sol', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', NULL, NULL),
  ('907e0b94-3120-4943-83bd-9fe001efbce5', 'exercise', 'multiple_choice', 'Doble palabra 5', NULL, '{"answers":[{"text":"tarde","imageUrl":null,"isCorrect":true},{"text":"noche","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /t/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:16:11.352189+00:00', '2025-10-23T02:16:11.352189+00:00', '{}'::jsonb, '¿Cuál empieza con /t/?
tarde
noche', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', NULL, NULL),
  ('20a1a6d2-4c2e-4213-b58f-567e0089d38f', 'exercise', 'multiple_choice', 'Doble palabra 4', NULL, '{"answers":[{"text":"mucho","imageUrl":null,"isCorrect":true},{"text":"poco","imageUrl":null,"isCorrect":true}],"question":"¿Cuál empieza con /m/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T02:13:50.074537+00:00', '2025-10-23T02:13:50.074537+00:00', '{}'::jsonb, '¿Cuál empieza con /m/?
mucho
poco', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', NULL, NULL),
  ('45d1ead8-b4b0-40d2-a0ff-7b3a9db979f4', 'exercise', 'multiple_choice', 'Doble palabra 3', NULL, '{"answers":[{"text":"bonito","imageUrl":null,"isCorrect":true},{"text":"feo","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /b/?\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T01:55:19.768991+00:00', '2025-10-23T01:55:49.284092+00:00', '{}'::jsonb, '¿Cuál empieza con /b/?
bonito
feo', NULL, NULL, NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', NULL, NULL),
  ('8a9944f7-6192-4418-bd67-1d6d4822bc6e', 'exercise', 'multiple_choice', 'Doble palabra 2', NULL, '{"answers":[{"text":"frio","imageUrl":null,"isCorrect":true},{"text":"calor","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con /f/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T01:52:40.482845+00:00', '2025-10-23T01:52:40.482845+00:00', '{}'::jsonb, '¿Cuál empieza con /f/?
frio
calor', NULL, '¿Cuál empieza con /f/?
frio
calor', NULL, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', NULL, NULL),
  ('025b161b-07e2-4801-be27-0473eb04a574', 'exercise', 'multiple_choice', 'Doble palabra 1', NULL, '{"answers":[{"text":"Calle","imageUrl":null,"isCorrect":true},{"text":"Avenida","imageUrl":null,"isCorrect":false}],"question":"¿Cuál empieza con el sonido /c/?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T01:48:49.426655+00:00', '2025-10-23T01:50:05.258342+00:00', '{}'::jsonb, '¿Cuál empieza con el sonido /c/?
calle
avenida', NULL, '¿Cuál empieza con el sonido /c/?
calle
avenida', '["calle","avenida"]'::jsonb, 3, '219e4bea-3bdb-4551-a7b6-2c4f5378177a', NULL, NULL),
  ('219e4bea-3bdb-4551-a7b6-2c4f5378177a', 'lesson', 'lesson', 'Doble palabra', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Escucha las dos palabras con atención.\nTe diré un sonido y tú tendrás que escoger cuál palabra empieza con ese sonido.\nPor ejemplo:\nEscucha “bonito” y “feo.”\n¿Cuál empieza con /b/?\n¡Muy bien! Bonito empieza con /b/.\nEscucha, piensa y selecciona.\n¡Vamos a jugar con los sonidos de las palabras!"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T01:40:52.18592+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Habla despacio y claramente. Enfatiza el sonido. lee el contenido de la enseñanza y Celebra con "¡Wepa!" cuando lo hagan bien.', 'conciencia_s', NULL, NULL, 3, NULL, NULL, NULL),
  ('fd1af9ac-475a-4188-af0c-d783b27c2492', 'exercise', 'multiple_choice', 'Sonido inicial 9', NULL, '{"answers":[{"text":"u","imageUrl":null,"isCorrect":false},{"text":"g","imageUrl":null,"isCorrect":true},{"text":"a","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas primero?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-23T01:27:48.452638+00:00', '2025-10-23T01:35:42.20054+00:00', '{}'::jsonb, 'lee la palabra "guagua"', NULL, NULL, '["guagua"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', NULL, NULL),
  ('f5d32445-faf3-4e28-bdbb-25239b62d20a', 'exercise', 'multiple_choice', 'ejercicio de test', NULL, '{"answers":[{"text":"1","imageUrl":null,"isCorrect":true},{"text":"2","imageUrl":null,"isCorrect":false}],"question":"I''ll update the query to fetch the parent lesson title and display it next to the \"Linked\" badge.\n\nI''ll update the query to fetch the parent lesson title and display it next to the \"Linked\" badge.\n\nEdited\nAdminDashboard.tsx\nThe \"Linked\" badge now shows the parent lesson title when an exercise is linked to a lesson."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:41:27.302773+00:00', '2025-10-22T16:41:27.302773+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, 'efc8a8eb-3a49-4271-a88c-e074f395e668', NULL, NULL),
  ('efc8a8eb-3a49-4271-a88c-e074f395e668', 'lesson', 'lesson', 'Lesson test Escucha y Repite con Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":" for an exercise to be saveable, ALL of these conditions must be met:\n\nTitle must be longer than 3 characters ✓\nQuestion must be longer than 10 characters ✓\nAt least 2 answers must be present ✓\nAt least ONE answer must be marked as correct AND have text "}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:38:25.523298+00:00', '2025-10-24T13:16:55.383148+00:00', '{}'::jsonb, 'Habla con entusiasmo. Pausa 2 segundos después de cada palabra. Celebra cada intento.', 'coqui_escucha', 'SECTION 1: ¡Hola! Soy Coquí. Hoy vamos a practicar escuchando y repitiendo palabras bonitas de Puerto Rico.
SECTION 2: Escucha con atención. Voy a decir una palabra y tú la repites después de mí.
SECTION 3: ¡Perfecto! Tu voz suena muy bien. Sigamos practicando.
SECTION 4: ¡Wepa! Lo estás haciendo chévere. Eres un campeón del español.', '["playa","mangó","palma","coquí","borinquen"]'::jsonb, 3, NULL, NULL, NULL),
  ('b42cf539-9448-48f4-8418-c5e4176a13af', 'exercise', 'multiple_choice', 'ejercicio vinculado a leccion test again', NULL, '{"answers":[{"text":"1","imageUrl":null,"isCorrect":true},{"text":"2","imageUrl":null,"isCorrect":false}],"question":"ejjercicio mljkjmkljmlkjlkkjmljkmlkj","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761150692674-2024-10-08%2015_50_16-React%20App.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:33:20.967126+00:00', '2025-10-22T16:33:20.967126+00:00', '{}'::jsonb, 'habla muy despacio', NULL, 'test', '["uno"]'::jsonb, 3, 'af18f65c-0aae-4bdb-800b-119972f3d40d', NULL, NULL),
  ('8dc0bba6-6cfb-43bc-8ec7-b573df1480fc', 'exercise', 'multiple_choice', 'Sonido inicial 8', NULL, '{"answers":[{"text":"r","imageUrl":null,"isCorrect":false},{"text":"c","imageUrl":null,"isCorrect":true},{"text":"a","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas primero?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761150324813-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:32:12.629056+00:00', '2025-10-22T16:32:12.629056+00:00', '{}'::jsonb, 'lee la palabra "carro"', NULL, '¿Qué sonido escuchas primero?', '["carro"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', NULL, NULL),
  ('14dae0e8-4d9e-4c4c-b8a2-3f4ea69a63bc', 'exercise', 'multiple_choice', 'Sonido inicial 7', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"p","imageUrl":null,"isCorrect":true},{"text":"t","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas primero?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:30:11.117463+00:00', '2025-10-22T16:30:11.117463+00:00', '{}'::jsonb, 'lee lento y claro la palabra "plátano"', NULL, '¿Qué sonido escuchas primero?', '["Plátano"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', NULL, NULL),
  ('af18f65c-0aae-4bdb-800b-119972f3d40d', 'lesson', 'lesson', 'test again', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"esto es el contenido principal"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:28:59.704947+00:00', '2025-10-24T13:16:29.136069+00:00', '{}'::jsonb, 'gabla lento', NULL, NULL, NULL, 3, NULL, NULL, NULL),
  ('c18168a0-5cef-4b3c-9207-9a10d9790ff2', 'exercise', 'multiple_choice', 'Sonido inicial 6', NULL, '{"answers":[{"text":"c","imageUrl":null,"isCorrect":false},{"text":"r","imageUrl":null,"isCorrect":false},{"text":"b","imageUrl":null,"isCorrect":true}],"question":"¿Qué sonido escuchas primero?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761150014663-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:27:11.849721+00:00', '2025-10-22T16:27:11.849721+00:00', '{}'::jsonb, 'lee lento y claro la palabra "barco"', NULL, '¿Qué sonido escuchas primero?', '["barco"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', NULL, NULL),
  ('ddcbe0fb-5b78-4243-8ade-bc072b09c76a', 'exercise', 'multiple_choice', 'Sonido inicial 5', NULL, '{"answers":[{"text":"o","imageUrl":null,"isCorrect":false},{"text":"q","imageUrl":null,"isCorrect":false},{"text":"c","imageUrl":null,"isCorrect":true}],"question":"¿Qué sonido escuchas primero?"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:19:46.30831+00:00', '2025-10-22T16:19:46.30831+00:00', '{}'::jsonb, 'lee lento y claro la palabra "coquí"', NULL, '¿Qué sonido escuchas primero?', '["coquí"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', NULL, NULL),
  ('2f535019-0025-42d7-a276-0880b23db219', 'exercise', 'multiple_choice', 'Sonido inicial 4', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"i","imageUrl":null,"isCorrect":true},{"text":"a","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas primero?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761148987858-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:09:57.573631+00:00', '2025-10-22T16:09:57.573631+00:00', '{}'::jsonb, 'lee lento y claro la palabra "isla"', NULL, '¿Qué sonido escuchas primero?', '["isla"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', NULL, NULL),
  ('eaef3308-6ea1-4377-bfc4-cdd818ed7a66', 'exercise', 'multiple_choice', 'Sonido inicial 3', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"r","imageUrl":null,"isCorrect":false},{"text":"f","imageUrl":null,"isCorrect":true}],"question":"¿Qué sonido escuchas primero?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761148750815-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T16:06:01.61586+00:00', '2025-10-22T16:06:01.61586+00:00', '{}'::jsonb, 'lee lento y claro la palabra "flor"', NULL, '¿Qué sonido escuchas primero?', '["flor"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', NULL, NULL),
  ('f78bb86d-15f4-4318-a784-cac094b65703', 'exercise', 'multiple_choice', 'Sonido inicial 2', NULL, '{"answers":[{"text":"a","imageUrl":null,"isCorrect":false},{"text":"m","imageUrl":null,"isCorrect":true},{"text":"r","imageUrl":null,"isCorrect":false}],"question":"¿Qué sonido escuchas primero?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761148340888-image.png"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-24T11:24:18.662333+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T15:59:09.446568+00:00', '2025-10-24T11:24:18.662333+00:00', '{}'::jsonb, 'leer lento y claro la palabra "mar"', NULL, '¿Qué sonido escuchas primero?', '["Mar"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', NULL, NULL),
  ('e751c9b6-cd65-474a-8a3d-f6a25074f376', 'exercise', 'multiple_choice', 'Sonido inicial', NULL, '{"answers":[{"text":"l","imageUrl":null,"isCorrect":false},{"text":"o","imageUrl":null,"isCorrect":false},{"text":"s","imageUrl":null,"isCorrect":true}],"question":"¿Qué sonido escuchas primero?\n\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T15:31:46.918391+00:00', '2025-10-22T15:31:46.918391+00:00', '{}'::jsonb, 'Lee lento y claro la palabra "sol"', NULL, '¿Qué sonido escuchas primero?', '["sol"]'::jsonb, 3, 'a86ddb21-aaf5-4f46-8e91-05b1aa5e8354', NULL, NULL),
  ('2f3bdc99-b40c-45fe-a895-428ac8bbf128', 'lesson', 'lesson', 'Identificando el Sonido /s/ con Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"¡Escucha con mucha atención!\nCada palabra tiene un sonido que se escucha al principio.\nCuando el sistema diga una palabra, escucha y elige el primer sonido que oyes.\nPor ejemplo, si escuchas “plato”, el primer sonido es /p/.\n¡Vamos a jugar con los sonidos para descubrir cómo comienzan las palabras!"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T15:20:12.100388+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Habla despacio y claramente. Enfatiza el sonido /s/. Celebra con "¡Wepa!" cuando lo hagan bien.', 'conciencia_s', 'SECTION 1: ¡Hola! Soy Coquí del bosque de El Yunque. Hoy vamos a descubrir palabras que comienzan con el sonido /s/.
SECTION 2: Escucha estas palabras de Puerto Rico: sol, sapo, serpiente. ¿Escuchas el sonido /s/ al principio?
SECTION 3: Ahora repite después de mí: sss-sol, sss-sapo, sss-serpiente.
SECTION 4: ¡Excelente! El sonido /s/ suena como una serpiente: ssssss.', '["sol","sapo","serpiente","silla","sopa"]'::jsonb, 3, NULL, NULL, NULL),
  ('41b2d6c7-8b4a-4e55-8d7c-38b6e1c9fa01', 'lesson', 'lesson', 'Lectura Fluida de Puerto Rico con Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Actividad: Escoge la sílaba que completa cada palabra incompleta\nObjetivo: Reconocer la sílaba que falta para completar una palabra, fortaleciendo la correspondencia grafema–fonema, la lectura silábica y la comprensión del significado de la palabra.\n"}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T14:34:23.570222+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Lee con expresión natural. Pausa en las comas. Celebra la fluidez.', 'fluidez_pr', 'SECTION 1: ¡Hola! Soy Coquí. Hoy vamos a leer frases sobre nuestra bella isla.
SECTION 2: Escucha primero: "El coquí canta en El Yunque." Ahora tú.
SECTION 3: ¡Muy bien! Lee con ritmo, como si estuvieras contando un cuento.
SECTION 4: ¡Wepa! Lees con tanta fluidez. Estoy orgulloso de ti.', '["El Yunque","San Juan","luquillo","fajardo","ponce"]'::jsonb, 3, NULL, NULL, NULL),
  ('5044bc15-a303-4007-9fb8-1cf3db677cb4', 'lesson', 'lesson', 'Dividing Words into Syllables with Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Desarrollar la capacidad de identificar, segmentar y contar sílabas en palabras orales y escritas, comprendiendo que cada sílaba se pronuncia con un solo golpe de voz.\nLa sílaba está compuesta por uno o más sonidos que se pronuncian con un solo golpe de voz. En el lenguaje escrito las sílabas se dividen con un símbolo llamado guión (-)."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T14:24:00.100454+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Pause clearly between syllables. Clap to the rhythm of each syllable.', 'segmentacion', 'SECTION 1: Hi! I''m Coquí. Words are like trains with cars. Each car is a syllable.
SECTION 2: Listen: co-qui. My name has two syllables. Clap with me: co-qui.
SECTION 3: Now you. Divide this word into syllables: but-ter-fly.
SECTION 4: Perfect! You separated all the syllables like an expert.', '["coqui","butterfly","mango","island","rainforest"]'::jsonb, 3, NULL, NULL, NULL),
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
Comparación fonémica entre palabras.', NULL, NULL, NULL, 3, NULL, NULL, NULL),
  ('9f750023-c594-4c14-85c8-d94f61f67108', 'lesson', 'lesson', 'Dividing Words into Syllables with Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Desarrollar la capacidad de identificar, segmentar y contar sílabas en palabras orales y escritas, comprendiendo que cada sílaba se pronuncia con un solo golpe de voz.\nLa sílaba está compuesta por uno o más sonidos que se pronuncian con un solo golpe de voz. En el lenguaje escrito las sílabas se dividen con un símbolo llamado guión (-)."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', '2025-10-23T11:07:37.635544+00:00', 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T13:57:31.364722+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, 'Pause clearly between syllables. Clap to the rhythm of each syllable.', 'segmentacion', 'SECTION 1: Hi! I''m Coquí. Words are like trains with cars. Each car is a syllable.
SECTION 2: Listen: co-qui. My name has two syllables. Clap with me: co-qui.
SECTION 3: Now you. Divide this word into syllables: but-ter-fly.
SECTION 4: Perfect! You separated all the syllables like an expert.', '["coqui","butterfly","mango","island","rainforest"]'::jsonb, 3, NULL, NULL, NULL),
  ('4abaa9ab-6c58-43cc-8c26-8b234de74985', 'lesson', 'lesson', 'Dividing Words into Syllables with Coquí', NULL, '{"answers":[{"text":"","imageUrl":null,"isCorrect":false},{"text":"","imageUrl":null,"isCorrect":false}],"question":"Objetivo: Desarrollar la capacidad de identificar, segmentar y contar sílabas en palabras orales y escritas, comprendiendo que cada sílaba se pronuncia con un solo golpe de voz.\n\nLa sílaba está compuesta por uno o más sonidos que se pronuncian con un solo golpe de voz. En el lenguaje escrito las sílabas se dividen con un símbolo llamado guión (-)."}'::jsonb, 1, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'draft', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-22T13:55:35.199473+00:00', '2025-10-24T13:16:05.222646+00:00', '{}'::jsonb, 'Pause clearly between syllables. Clap to the rhythm of each syllable.', 'segmentacion', 'SECTION 1: Hi! I''m Coquí. Words are like trains with cars. Each car is a syllable.
SECTION 2: Listen: co-qui. My name has two syllables. Clap with me: co-qui.
SECTION 3: Now you. Divide this word into syllables: but-ter-fly.
SECTION 4: Perfect! You separated all the syllables like an expert.', '["coqui","butterfly","mango","island","rainforest"]'::jsonb, 3, NULL, NULL, NULL),
  ('586c1835-bb64-40fa-98b8-a2180c338a18', 'exercise', 'multiple_choice', ' Read the informational text carefully. Then, choo', NULL, '{"answers":[{"text":"insects","imageUrl":null,"isCorrect":true},{"text":"dogs","imageUrl":null,"isCorrect":false},{"text":"sharks","imageUrl":null,"isCorrect":false}],"question":" Read the informational text carefully. Then, choose the correct \nanswer:\nWhat other animals can you find on this type of forest?","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761063783103-image.png"}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-21T16:24:31.126631+00:00', '2025-10-21T16:24:31.126631+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL),
  ('8953b8be-a9d1-48d0-9854-3b6832c84a57', 'assessment', 'multiple_choice', 'English  Assessment  Grade | 1st grade  Subject | English', NULL, '{"answers":[{"text":"d","imageUrl":null,"isCorrect":true},{"text":"c","imageUrl":null,"isCorrect":false},{"text":"b","imageUrl":null,"isCorrect":false}],"question":"Look at the picture.  Choose the correct beginning and ending sound.\n__ og","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761063205153-image.png"}'::jsonb, 1, 'en', 'reading', NULL, true, 1, true, NULL, 5, 'published', NULL, 0, 0, NULL, '49063ede-8e67-429e-87f6-2f291cba1203', '2025-10-21T16:14:13.411524+00:00', '2025-10-23T11:38:24.429017+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL),
  ('d4925bad-9535-418e-b2f3-cc89edc9235a', 'lesson', 'lesson', 'Lección 3: Tamaño y Posición', NULL, '{"answers":[{"text":"cierto","imageUrl":null,"isCorrect":true},{"text":"falso","imageUrl":null,"isCorrect":false}],"question":"Los niños están adentro del salón.","questionImage":"https://meertwtenhlmnlpwxhyz.supabase.co/storage/v1/object/public/manual-assessment-images/1761050478338-image.png"}'::jsonb, 0, 'es', 'reading', NULL, true, 1, true, NULL, 5, 'published', NULL, 0, 0, NULL, '25390fc0-096f-4940-bfb3-4535f8e45ac0', '2025-10-21T12:42:00.009516+00:00', '2025-10-23T11:53:06.644585+00:00', '{}'::jsonb, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL);


-- ============================================
-- Table: profiles
-- ============================================

-- Table: public.profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    name TEXT,
    email TEXT,
    role TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: profiles
-- Total records: 1
-- Exported: 2025-10-24T13:34:17.801Z

-- Clear existing data (optional)
-- DELETE FROM public.profiles;

INSERT INTO public.profiles (id, full_name, avatar_url, created_at, updated_at, grade_level, assigned_region, school_id, language_specialization, learning_languages) VALUES
  ('49063ede-8e67-429e-87f6-2f291cba1203', 'Administrator', '/avatars/admin-1.jpg', '2025-10-21T13:52:57.998335+00:00', '2025-10-21T14:14:01.732188+00:00', NULL, NULL, NULL, NULL, '["es","en"]'::jsonb);


-- ============================================
-- Table: user_roles
-- ============================================

-- Table: public.user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    role TEXT,
    permissions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: user_roles
-- Total records: 1
-- Exported: 2025-10-24T13:34:17.801Z

-- Clear existing data (optional)
-- DELETE FROM public.user_roles;

INSERT INTO public.user_roles (id, user_id, role, created_at) VALUES
  ('a85bc4de-f53b-4df6-bdf7-39de2524896d', '49063ede-8e67-429e-87f6-2f291cba1203', 'depr_executive', '2025-10-21T14:09:42.358148+00:00');


COMMIT;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- ============================================
-- End of backup
-- ============================================
