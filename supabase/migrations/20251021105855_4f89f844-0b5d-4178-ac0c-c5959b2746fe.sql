-- Add CASCADE to foreign key relationships for clean deletion
ALTER TABLE pdf_text_content DROP CONSTRAINT IF EXISTS pdf_text_content_document_id_fkey;
ALTER TABLE pdf_text_content ADD CONSTRAINT pdf_text_content_document_id_fkey 
  FOREIGN KEY (document_id) REFERENCES pdf_documents(id) ON DELETE CASCADE;

ALTER TABLE pdf_images DROP CONSTRAINT IF EXISTS pdf_images_document_id_fkey;
ALTER TABLE pdf_images ADD CONSTRAINT pdf_images_document_id_fkey 
  FOREIGN KEY (document_id) REFERENCES pdf_documents(id) ON DELETE CASCADE;

ALTER TABLE assessment_questions DROP CONSTRAINT IF EXISTS assessment_questions_document_id_fkey;
ALTER TABLE assessment_questions ADD CONSTRAINT assessment_questions_document_id_fkey 
  FOREIGN KEY (document_id) REFERENCES pdf_documents(id) ON DELETE CASCADE;

ALTER TABLE text_image_correlations DROP CONSTRAINT IF EXISTS text_image_correlations_text_content_id_fkey;
ALTER TABLE text_image_correlations ADD CONSTRAINT text_image_correlations_text_content_id_fkey 
  FOREIGN KEY (text_content_id) REFERENCES pdf_text_content(id) ON DELETE CASCADE;

ALTER TABLE text_image_correlations DROP CONSTRAINT IF EXISTS text_image_correlations_image_id_fkey;
ALTER TABLE text_image_correlations ADD CONSTRAINT text_image_correlations_image_id_fkey 
  FOREIGN KEY (image_id) REFERENCES pdf_images(id) ON DELETE CASCADE;

ALTER TABLE user_annotations DROP CONSTRAINT IF EXISTS user_annotations_document_id_fkey;
ALTER TABLE user_annotations ADD CONSTRAINT user_annotations_document_id_fkey 
  FOREIGN KEY (document_id) REFERENCES pdf_documents(id) ON DELETE CASCADE;

ALTER TABLE user_annotations DROP CONSTRAINT IF EXISTS user_annotations_text_content_id_fkey;
ALTER TABLE user_annotations ADD CONSTRAINT user_annotations_text_content_id_fkey 
  FOREIGN KEY (text_content_id) REFERENCES pdf_text_content(id) ON DELETE CASCADE;

ALTER TABLE reading_progress DROP CONSTRAINT IF EXISTS reading_progress_document_id_fkey;
ALTER TABLE reading_progress ADD CONSTRAINT reading_progress_document_id_fkey 
  FOREIGN KEY (document_id) REFERENCES pdf_documents(id) ON DELETE CASCADE;

ALTER TABLE vocabulary_terms DROP CONSTRAINT IF EXISTS vocabulary_terms_document_id_fkey;
ALTER TABLE vocabulary_terms ADD CONSTRAINT vocabulary_terms_document_id_fkey 
  FOREIGN KEY (document_id) REFERENCES pdf_documents(id) ON DELETE CASCADE;

-- Now delete all PDF documents (CASCADE will clean up related data)
DELETE FROM pdf_documents;

-- Clean up storage buckets
DELETE FROM storage.objects WHERE bucket_id = 'educational-pdfs';
DELETE FROM storage.objects WHERE bucket_id = 'pdf-images';
DELETE FROM storage.objects WHERE bucket_id = 'pdf-thumbnails';