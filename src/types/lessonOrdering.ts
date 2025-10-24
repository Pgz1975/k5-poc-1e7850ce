export interface LessonOrder {
  id: string;
  grade_level: number;
  assessment_id: string;
  display_order: number;
  parent_lesson_id: string | null;
  domain_name: string | null;
  domain_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface LessonWithOrder {
  id: string;
  title: string;
  description: string | null;
  type: string;
  grade_level: number;
  language: string;
  status: string;
  parent_lesson_id: string | null;
  order_in_lesson: number | null;
  display_order?: number;
  domain_name?: string | null;
  domain_order?: number | null;
}

export interface DomainGroup {
  domain_name: string;
  domain_order: number;
  lessons: LessonWithOrder[];
}
