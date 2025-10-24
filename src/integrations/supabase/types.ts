export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assessment_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          difficulty_level: number | null
          document_id: string
          explanation: string | null
          grade_level: number | null
          id: string
          language: Database["public"]["Enums"]["language_code"]
          options: Json | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          skill_assessed: string
          source_image_ids: string[] | null
          source_page: number | null
          source_text_ids: string[] | null
          updated_at: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          difficulty_level?: number | null
          document_id: string
          explanation?: string | null
          grade_level?: number | null
          id?: string
          language: Database["public"]["Enums"]["language_code"]
          options?: Json | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          skill_assessed: string
          source_image_ids?: string[] | null
          source_page?: number | null
          source_text_ids?: string[] | null
          updated_at?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          difficulty_level?: number | null
          document_id?: string
          explanation?: string | null
          grade_level?: number | null
          id?: string
          language?: Database["public"]["Enums"]["language_code"]
          options?: Json | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          skill_assessed?: string
          source_image_ids?: string[] | null
          source_page?: number | null
          source_text_ids?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "pdf_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      completed_activity: {
        Row: {
          activity_id: string
          activity_type: string
          completed_at: string
          duration_seconds: number | null
          id: string
          metadata: Json | null
          score: number | null
          student_id: string
        }
        Insert: {
          activity_id: string
          activity_type: string
          completed_at?: string
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          score?: number | null
          student_id: string
        }
        Update: {
          activity_id?: string
          activity_type?: string
          completed_at?: string
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          score?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completed_activity_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "manual_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_assessments: {
        Row: {
          assessment_type: string
          content: Json
          created_at: string | null
          created_by: string | null
          grade_level: number | null
          id: string
          language: Database["public"]["Enums"]["language_code"]
          metadata: Json | null
          selected_items: Json
          source_pdf_id: string | null
          updated_at: string | null
        }
        Insert: {
          assessment_type: string
          content?: Json
          created_at?: string | null
          created_by?: string | null
          grade_level?: number | null
          id?: string
          language?: Database["public"]["Enums"]["language_code"]
          metadata?: Json | null
          selected_items?: Json
          source_pdf_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assessment_type?: string
          content?: Json
          created_at?: string | null
          created_by?: string | null
          grade_level?: number | null
          id?: string
          language?: Database["public"]["Enums"]["language_code"]
          metadata?: Json | null
          selected_items?: Json
          source_pdf_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_assessments_source_pdf_id_fkey"
            columns: ["source_pdf_id"]
            isOneToOne: false
            referencedRelation: "pdf_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_ordering: {
        Row: {
          assessment_id: string
          created_at: string | null
          display_order: number
          domain_name: string | null
          domain_order: number | null
          grade_level: number
          id: string
          parent_lesson_id: string | null
          updated_at: string | null
        }
        Insert: {
          assessment_id: string
          created_at?: string | null
          display_order: number
          domain_name?: string | null
          domain_order?: number | null
          grade_level: number
          id?: string
          parent_lesson_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assessment_id?: string
          created_at?: string | null
          display_order?: number
          domain_name?: string | null
          domain_order?: number | null
          grade_level?: number
          id?: string
          parent_lesson_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_ordering_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "manual_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_ordering_parent_lesson_id_fkey"
            columns: ["parent_lesson_id"]
            isOneToOne: false
            referencedRelation: "manual_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_assessments: {
        Row: {
          activity_template: string | null
          auto_read_question: boolean | null
          average_score: number | null
          completion_count: number | null
          content: Json
          coqui_dialogue: string | null
          created_at: string | null
          created_by: string
          curriculum_standards: string[] | null
          description: string | null
          difficulty_level: number | null
          drag_drop_mode: string | null
          enable_voice: boolean | null
          estimated_duration_minutes: number | null
          grade_level: number
          id: string
          language: Database["public"]["Enums"]["language_code"]
          max_attempts: number | null
          metadata: Json | null
          order_in_lesson: number | null
          parent_lesson_id: string | null
          passing_score: number | null
          pronunciation_words: string[] | null
          published_at: string | null
          status: string | null
          subject_area: string
          subtype: string
          title: string
          type: string
          updated_at: string | null
          view_count: number | null
          voice_guidance: string | null
          voice_speed: number | null
        }
        Insert: {
          activity_template?: string | null
          auto_read_question?: boolean | null
          average_score?: number | null
          completion_count?: number | null
          content: Json
          coqui_dialogue?: string | null
          created_at?: string | null
          created_by: string
          curriculum_standards?: string[] | null
          description?: string | null
          difficulty_level?: number | null
          drag_drop_mode?: string | null
          enable_voice?: boolean | null
          estimated_duration_minutes?: number | null
          grade_level: number
          id?: string
          language?: Database["public"]["Enums"]["language_code"]
          max_attempts?: number | null
          metadata?: Json | null
          order_in_lesson?: number | null
          parent_lesson_id?: string | null
          passing_score?: number | null
          pronunciation_words?: string[] | null
          published_at?: string | null
          status?: string | null
          subject_area?: string
          subtype: string
          title: string
          type: string
          updated_at?: string | null
          view_count?: number | null
          voice_guidance?: string | null
          voice_speed?: number | null
        }
        Update: {
          activity_template?: string | null
          auto_read_question?: boolean | null
          average_score?: number | null
          completion_count?: number | null
          content?: Json
          coqui_dialogue?: string | null
          created_at?: string | null
          created_by?: string
          curriculum_standards?: string[] | null
          description?: string | null
          difficulty_level?: number | null
          drag_drop_mode?: string | null
          enable_voice?: boolean | null
          estimated_duration_minutes?: number | null
          grade_level?: number
          id?: string
          language?: Database["public"]["Enums"]["language_code"]
          max_attempts?: number | null
          metadata?: Json | null
          order_in_lesson?: number | null
          parent_lesson_id?: string | null
          passing_score?: number | null
          pronunciation_words?: string[] | null
          published_at?: string | null
          status?: string | null
          subject_area?: string
          subtype?: string
          title?: string
          type?: string
          updated_at?: string | null
          view_count?: number | null
          voice_guidance?: string | null
          voice_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "manual_assessments_parent_lesson_id_fkey"
            columns: ["parent_lesson_id"]
            isOneToOne: false
            referencedRelation: "manual_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      model_switch_events: {
        Row: {
          from_model: string | null
          id: string
          metadata: Json | null
          session_id: string
          student_id: string | null
          switch_reason: string | null
          switched_at: string | null
          to_model: string
          transcript_preserved: boolean | null
        }
        Insert: {
          from_model?: string | null
          id?: string
          metadata?: Json | null
          session_id: string
          student_id?: string | null
          switch_reason?: string | null
          switched_at?: string | null
          to_model: string
          transcript_preserved?: boolean | null
        }
        Update: {
          from_model?: string | null
          id?: string
          metadata?: Json | null
          session_id?: string
          student_id?: string | null
          switch_reason?: string | null
          switched_at?: string | null
          to_model?: string
          transcript_preserved?: boolean | null
        }
        Relationships: []
      }
      model_usage_costs: {
        Row: {
          actual_cost: number | null
          created_at: string | null
          duration_seconds: number | null
          ended_at: string | null
          estimated_cost: number | null
          id: string
          input_tokens: number | null
          metadata: Json | null
          model_type: string
          output_tokens: number | null
          session_id: string
          started_at: string | null
          student_id: string | null
        }
        Insert: {
          actual_cost?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          estimated_cost?: number | null
          id?: string
          input_tokens?: number | null
          metadata?: Json | null
          model_type: string
          output_tokens?: number | null
          session_id: string
          started_at?: string | null
          student_id?: string | null
        }
        Update: {
          actual_cost?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          estimated_cost?: number | null
          id?: string
          input_tokens?: number | null
          metadata?: Json | null
          model_type?: string
          output_tokens?: number | null
          session_id?: string
          started_at?: string | null
          student_id?: string | null
        }
        Relationships: []
      }
      pdf_documents: {
        Row: {
          content_type: Database["public"]["Enums"]["content_type"] | null
          created_at: string | null
          curriculum_standards: Json | null
          file_hash: string
          file_size: number
          filename: string
          grade_level: number[] | null
          has_text_layer: boolean | null
          id: string
          metadata: Json | null
          ocr_confidence: number | null
          original_filename: string
          page_count: number | null
          primary_language: Database["public"]["Enums"]["language_code"] | null
          processing_completed_at: string | null
          processing_error: string | null
          processing_progress: number | null
          processing_started_at: string | null
          processing_status:
            | Database["public"]["Enums"]["processing_status"]
            | null
          quality_score: number | null
          reading_level: number | null
          storage_bucket: string
          storage_path: string
          subject_area: string[] | null
          total_images: number | null
          total_words: number | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          content_type?: Database["public"]["Enums"]["content_type"] | null
          created_at?: string | null
          curriculum_standards?: Json | null
          file_hash: string
          file_size: number
          filename: string
          grade_level?: number[] | null
          has_text_layer?: boolean | null
          id?: string
          metadata?: Json | null
          ocr_confidence?: number | null
          original_filename: string
          page_count?: number | null
          primary_language?: Database["public"]["Enums"]["language_code"] | null
          processing_completed_at?: string | null
          processing_error?: string | null
          processing_progress?: number | null
          processing_started_at?: string | null
          processing_status?:
            | Database["public"]["Enums"]["processing_status"]
            | null
          quality_score?: number | null
          reading_level?: number | null
          storage_bucket?: string
          storage_path: string
          subject_area?: string[] | null
          total_images?: number | null
          total_words?: number | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          content_type?: Database["public"]["Enums"]["content_type"] | null
          created_at?: string | null
          curriculum_standards?: Json | null
          file_hash?: string
          file_size?: number
          filename?: string
          grade_level?: number[] | null
          has_text_layer?: boolean | null
          id?: string
          metadata?: Json | null
          ocr_confidence?: number | null
          original_filename?: string
          page_count?: number | null
          primary_language?: Database["public"]["Enums"]["language_code"] | null
          processing_completed_at?: string | null
          processing_error?: string | null
          processing_progress?: number | null
          processing_started_at?: string | null
          processing_status?:
            | Database["public"]["Enums"]["processing_status"]
            | null
          quality_score?: number | null
          reading_level?: number | null
          storage_bucket?: string
          storage_path?: string
          subject_area?: string[] | null
          total_images?: number | null
          total_words?: number | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      pdf_images: {
        Row: {
          alt_text: string | null
          bbox: Json | null
          caption: string | null
          contains_text: boolean | null
          created_at: string | null
          cultural_context: string | null
          detected_objects: Json | null
          document_id: string
          educational_relevance: string | null
          file_size: number
          format: string
          height: number
          id: string
          image_index: number
          is_decorative: boolean | null
          page_number: number
          quality_score: number | null
          storage_bucket: string
          storage_path: string
          thumbnail_path: string | null
          updated_at: string | null
          width: number
        }
        Insert: {
          alt_text?: string | null
          bbox?: Json | null
          caption?: string | null
          contains_text?: boolean | null
          created_at?: string | null
          cultural_context?: string | null
          detected_objects?: Json | null
          document_id: string
          educational_relevance?: string | null
          file_size: number
          format: string
          height: number
          id?: string
          image_index: number
          is_decorative?: boolean | null
          page_number: number
          quality_score?: number | null
          storage_bucket?: string
          storage_path: string
          thumbnail_path?: string | null
          updated_at?: string | null
          width: number
        }
        Update: {
          alt_text?: string | null
          bbox?: Json | null
          caption?: string | null
          contains_text?: boolean | null
          created_at?: string | null
          cultural_context?: string | null
          detected_objects?: Json | null
          document_id?: string
          educational_relevance?: string | null
          file_size?: number
          format?: string
          height?: number
          id?: string
          image_index?: number
          is_decorative?: boolean | null
          page_number?: number
          quality_score?: number | null
          storage_bucket?: string
          storage_path?: string
          thumbnail_path?: string | null
          updated_at?: string | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "pdf_images_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "pdf_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_text_content: {
        Row: {
          bbox: Json | null
          block_index: number
          created_at: string | null
          detected_language: Database["public"]["Enums"]["language_code"]
          document_id: string
          font_family: string | null
          font_size: number | null
          id: string
          is_bold: boolean | null
          is_italic: boolean | null
          is_puerto_rican_dialect: boolean | null
          language_confidence: number | null
          page_number: number
          reading_complexity: number | null
          search_vector_en: unknown
          search_vector_es: unknown
          text_color: string | null
          text_content: string
          text_length: number
          updated_at: string | null
          word_count: number | null
        }
        Insert: {
          bbox?: Json | null
          block_index: number
          created_at?: string | null
          detected_language: Database["public"]["Enums"]["language_code"]
          document_id: string
          font_family?: string | null
          font_size?: number | null
          id?: string
          is_bold?: boolean | null
          is_italic?: boolean | null
          is_puerto_rican_dialect?: boolean | null
          language_confidence?: number | null
          page_number: number
          reading_complexity?: number | null
          search_vector_en?: unknown
          search_vector_es?: unknown
          text_color?: string | null
          text_content: string
          text_length: number
          updated_at?: string | null
          word_count?: number | null
        }
        Update: {
          bbox?: Json | null
          block_index?: number
          created_at?: string | null
          detected_language?: Database["public"]["Enums"]["language_code"]
          document_id?: string
          font_family?: string | null
          font_size?: number | null
          id?: string
          is_bold?: boolean | null
          is_italic?: boolean | null
          is_puerto_rican_dialect?: boolean | null
          language_confidence?: number | null
          page_number?: number
          reading_complexity?: number | null
          search_vector_en?: unknown
          search_vector_es?: unknown
          text_color?: string | null
          text_content?: string
          text_length?: number
          updated_at?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pdf_text_content_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "pdf_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          assigned_region: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          grade_level: number | null
          id: string
          language_specialization:
            | Database["public"]["Enums"]["language_code"]
            | null
          learning_languages: string[] | null
          school_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_region?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          grade_level?: number | null
          id: string
          language_specialization?:
            | Database["public"]["Enums"]["language_code"]
            | null
          learning_languages?: string[] | null
          school_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_region?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          grade_level?: number | null
          id?: string
          language_specialization?:
            | Database["public"]["Enums"]["language_code"]
            | null
          learning_languages?: string[] | null
          school_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          annotations_count: number | null
          completed_at: string | null
          completion_percentage: number | null
          current_page: number
          document_id: string
          id: string
          last_accessed_at: string | null
          pages_completed: number[] | null
          started_at: string | null
          student_id: string
          total_time_seconds: number | null
          updated_at: string | null
          vocabulary_lookups_count: number | null
        }
        Insert: {
          annotations_count?: number | null
          completed_at?: string | null
          completion_percentage?: number | null
          current_page?: number
          document_id: string
          id?: string
          last_accessed_at?: string | null
          pages_completed?: number[] | null
          started_at?: string | null
          student_id: string
          total_time_seconds?: number | null
          updated_at?: string | null
          vocabulary_lookups_count?: number | null
        }
        Update: {
          annotations_count?: number | null
          completed_at?: string | null
          completion_percentage?: number | null
          current_page?: number
          document_id?: string
          id?: string
          last_accessed_at?: string | null
          pages_completed?: number[] | null
          started_at?: string | null
          student_id?: string
          total_time_seconds?: number | null
          updated_at?: string | null
          vocabulary_lookups_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "pdf_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      text_image_correlations: {
        Row: {
          confidence_score: number
          correlation_type: Database["public"]["Enums"]["correlation_type"]
          created_at: string | null
          distance_pixels: number | null
          id: string
          image_id: string
          relative_position: string | null
          semantic_similarity: number | null
          shared_concepts: string[] | null
          text_content_id: string
        }
        Insert: {
          confidence_score: number
          correlation_type: Database["public"]["Enums"]["correlation_type"]
          created_at?: string | null
          distance_pixels?: number | null
          id?: string
          image_id: string
          relative_position?: string | null
          semantic_similarity?: number | null
          shared_concepts?: string[] | null
          text_content_id: string
        }
        Update: {
          confidence_score?: number
          correlation_type?: Database["public"]["Enums"]["correlation_type"]
          created_at?: string | null
          distance_pixels?: number | null
          id?: string
          image_id?: string
          relative_position?: string | null
          semantic_similarity?: number | null
          shared_concepts?: string[] | null
          text_content_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "text_image_correlations_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "pdf_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "text_image_correlations_text_content_id_fkey"
            columns: ["text_content_id"]
            isOneToOne: false
            referencedRelation: "pdf_text_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_annotations: {
        Row: {
          annotation_type: string
          color: string | null
          content: string | null
          created_at: string | null
          document_id: string
          id: string
          page_number: number
          position: Json | null
          selection_text: string | null
          student_id: string
          text_content_id: string | null
          updated_at: string | null
        }
        Insert: {
          annotation_type: string
          color?: string | null
          content?: string | null
          created_at?: string | null
          document_id: string
          id?: string
          page_number: number
          position?: Json | null
          selection_text?: string | null
          student_id: string
          text_content_id?: string | null
          updated_at?: string | null
        }
        Update: {
          annotation_type?: string
          color?: string | null
          content?: string | null
          created_at?: string | null
          document_id?: string
          id?: string
          page_number?: number
          position?: Json | null
          selection_text?: string | null
          student_id?: string
          text_content_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_annotations_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "pdf_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_annotations_text_content_id_fkey"
            columns: ["text_content_id"]
            isOneToOne: false
            referencedRelation: "pdf_text_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vocabulary_terms: {
        Row: {
          created_at: string | null
          definition: string | null
          document_id: string | null
          english_translation: string | null
          example_usage: string | null
          frequency_in_document: number | null
          grade_level: number | null
          id: string
          is_academic_vocabulary: boolean | null
          language: Database["public"]["Enums"]["language_code"]
          lookup_count: number | null
          phonetic_spelling: string | null
          pronunciation_guide: string | null
          puerto_rican_variant: string | null
          spanish_translation: string | null
          subject_area: string | null
          term: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          definition?: string | null
          document_id?: string | null
          english_translation?: string | null
          example_usage?: string | null
          frequency_in_document?: number | null
          grade_level?: number | null
          id?: string
          is_academic_vocabulary?: boolean | null
          language: Database["public"]["Enums"]["language_code"]
          lookup_count?: number | null
          phonetic_spelling?: string | null
          pronunciation_guide?: string | null
          puerto_rican_variant?: string | null
          spanish_translation?: string | null
          subject_area?: string | null
          term: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          definition?: string | null
          document_id?: string | null
          english_translation?: string | null
          example_usage?: string | null
          frequency_in_document?: number | null
          grade_level?: number | null
          id?: string
          is_academic_vocabulary?: boolean | null
          language?: Database["public"]["Enums"]["language_code"]
          lookup_count?: number | null
          phonetic_spelling?: string | null
          pronunciation_guide?: string | null
          puerto_rican_variant?: string | null
          spanish_translation?: string | null
          subject_area?: string | null
          term?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_terms_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "pdf_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_assessment_results: {
        Row: {
          assessment_id: string | null
          attempts: number | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          pronunciation_score: number | null
          student_id: string | null
          word_practiced: string | null
        }
        Insert: {
          assessment_id?: string | null
          attempts?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          pronunciation_score?: number | null
          student_id?: string | null
          word_practiced?: string | null
        }
        Update: {
          assessment_id?: string | null
          attempts?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          pronunciation_score?: number | null
          student_id?: string | null
          word_practiced?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_assessment_results_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "manual_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_cost_summary: {
        Row: {
          average_cost_per_session: number | null
          created_at: string | null
          id: string
          last_session_at: string | null
          last_session_cost: number | null
          model: Database["public"]["Enums"]["voice_model_type"]
          student_id: string | null
          total_cost: number | null
          total_input_tokens: number | null
          total_output_tokens: number | null
          total_sessions: number | null
          updated_at: string | null
        }
        Insert: {
          average_cost_per_session?: number | null
          created_at?: string | null
          id?: string
          last_session_at?: string | null
          last_session_cost?: number | null
          model: Database["public"]["Enums"]["voice_model_type"]
          student_id?: string | null
          total_cost?: number | null
          total_input_tokens?: number | null
          total_output_tokens?: number | null
          total_sessions?: number | null
          updated_at?: string | null
        }
        Update: {
          average_cost_per_session?: number | null
          created_at?: string | null
          id?: string
          last_session_at?: string | null
          last_session_cost?: number | null
          model?: Database["public"]["Enums"]["voice_model_type"]
          student_id?: string | null
          total_cost?: number | null
          total_input_tokens?: number | null
          total_output_tokens?: number | null
          total_sessions?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      voice_guidance_library: {
        Row: {
          activity_type: string | null
          content: string
          created_at: string | null
          created_by: string | null
          grade_level: number | null
          id: string
          language: Database["public"]["Enums"]["language_code"]
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          activity_type?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          grade_level?: number | null
          id?: string
          language?: Database["public"]["Enums"]["language_code"]
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_type?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          grade_level?: number | null
          id?: string
          language?: Database["public"]["Enums"]["language_code"]
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      voice_interactions: {
        Row: {
          assessment_id: string | null
          cost_estimate: number | null
          id: string
          is_user: boolean
          language: string | null
          model: Database["public"]["Enums"]["voice_model_type"] | null
          model_type: string | null
          session_id: string
          student_id: string | null
          text: string
          timestamp: string | null
        }
        Insert: {
          assessment_id?: string | null
          cost_estimate?: number | null
          id?: string
          is_user: boolean
          language?: string | null
          model?: Database["public"]["Enums"]["voice_model_type"] | null
          model_type?: string | null
          session_id: string
          student_id?: string | null
          text: string
          timestamp?: string | null
        }
        Update: {
          assessment_id?: string | null
          cost_estimate?: number | null
          id?: string
          is_user?: boolean
          language?: string | null
          model?: Database["public"]["Enums"]["voice_model_type"] | null
          model_type?: string | null
          session_id?: string
          student_id?: string | null
          text?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_interactions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "manual_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_model_usage: {
        Row: {
          created_at: string | null
          id: string
          input_tokens: number | null
          model: Database["public"]["Enums"]["voice_model_type"]
          output_tokens: number | null
          session_cost: number | null
          session_duration_seconds: number | null
          session_id: string | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          model: Database["public"]["Enums"]["voice_model_type"]
          output_tokens?: number | null
          session_cost?: number | null
          session_duration_seconds?: number | null
          session_id?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          model?: Database["public"]["Enums"]["voice_model_type"]
          output_tokens?: number | null
          session_cost?: number | null
          session_duration_seconds?: number | null
          session_id?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      voice_sessions: {
        Row: {
          assessment_id: string | null
          created_at: string | null
          ended_at: string | null
          grade_level: number | null
          id: string
          language: string | null
          metrics: Json | null
          model: Database["public"]["Enums"]["voice_model_type"] | null
          session_id: string
          student_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string | null
          ended_at?: string | null
          grade_level?: number | null
          id?: string
          language?: string | null
          metrics?: Json | null
          model?: Database["public"]["Enums"]["voice_model_type"] | null
          session_id: string
          student_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          created_at?: string | null
          ended_at?: string | null
          grade_level?: number | null
          id?: string
          language?: string | null
          metrics?: Json | null
          model?: Database["public"]["Enums"]["voice_model_type"] | null
          session_id?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_sessions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "manual_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_grade_content: {
        Args: { content_grade_level: number; user_id: string }
        Returns: boolean
      }
      can_access_language_content: {
        Args: {
          content_language: Database["public"]["Enums"]["language_code"]
          user_id: string
        }
        Returns: boolean
      }
      can_access_parent_lesson: {
        Args: { _exercise_id: string; _user_id: string }
        Returns: boolean
      }
      get_user_grade_level: { Args: { user_id: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "student"
        | "student_kindergarten"
        | "student_1"
        | "student_2"
        | "student_3"
        | "student_4"
        | "student_5"
        | "family"
        | "teacher_english"
        | "teacher_spanish"
        | "school_director"
        | "regional_director"
        | "spanish_program_admin"
        | "english_program_admin"
        | "depr_executive"
      content_type:
        | "textbook"
        | "worksheet"
        | "assessment"
        | "reading_material"
        | "other"
      correlation_type: "spatial" | "semantic" | "caption" | "reference"
      language_code: "es" | "en" | "es-PR"
      processing_status: "pending" | "processing" | "completed" | "failed"
      question_type:
        | "multiple_choice"
        | "true_false"
        | "short_answer"
        | "fill_blank"
        | "matching"
      voice_model_type:
        | "web-speech-api"
        | "gpt-4o-realtime-preview-2024-12-17"
        | "gpt-4o-realtime-preview-2024-10-01"
        | "gpt-4o-mini-realtime-preview-2024-12-17"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "student",
        "student_kindergarten",
        "student_1",
        "student_2",
        "student_3",
        "student_4",
        "student_5",
        "family",
        "teacher_english",
        "teacher_spanish",
        "school_director",
        "regional_director",
        "spanish_program_admin",
        "english_program_admin",
        "depr_executive",
      ],
      content_type: [
        "textbook",
        "worksheet",
        "assessment",
        "reading_material",
        "other",
      ],
      correlation_type: ["spatial", "semantic", "caption", "reference"],
      language_code: ["es", "en", "es-PR"],
      processing_status: ["pending", "processing", "completed", "failed"],
      question_type: [
        "multiple_choice",
        "true_false",
        "short_answer",
        "fill_blank",
        "matching",
      ],
      voice_model_type: [
        "web-speech-api",
        "gpt-4o-realtime-preview-2024-12-17",
        "gpt-4o-realtime-preview-2024-10-01",
        "gpt-4o-mini-realtime-preview-2024-12-17",
      ],
    },
  },
} as const
