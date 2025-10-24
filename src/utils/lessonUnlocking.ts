/**
 * Utility functions for determining lesson/exercise unlocking logic
 * Based on sequential completion and ordering
 */

interface LessonWithOrdering {
  id: string;
  display_order: number;
  assessment_id: string;
}

interface CompletedActivity {
  activity_id: string;
  score: number | null;
  completed_at: string;
}

/**
 * Determines if a lesson is locked based on sequential unlocking logic
 * A lesson is locked if the previous lesson in the sequence has not been completed
 */
export const isLessonLocked = (
  lessonIndex: number,
  orderedLessons: LessonWithOrdering[],
  completedActivities: CompletedActivity[]
): boolean => {
  // First lesson is always unlocked
  if (lessonIndex === 0) return false;

  const completedIds = new Set(completedActivities.map(c => c.activity_id));
  const previousLesson = orderedLessons[lessonIndex - 1];

  // Lesson is locked if previous lesson is not completed
  return !completedIds.has(previousLesson.assessment_id);
};

/**
 * Gets the locked status for all lessons in a sequence
 */
export const getLessonLockingStatus = (
  orderedLessons: LessonWithOrdering[],
  completedActivities: CompletedActivity[]
): Map<string, boolean> => {
  const lockingMap = new Map<string, boolean>();

  orderedLessons.forEach((lesson, index) => {
    const locked = isLessonLocked(index, orderedLessons, completedActivities);
    lockingMap.set(lesson.assessment_id, locked);
  });

  return lockingMap;
};

/**
 * Checks if a specific lesson ID is locked
 */
export const checkLessonLocked = (
  lessonId: string,
  orderedLessons: LessonWithOrdering[],
  completedActivities: CompletedActivity[]
): boolean => {
  const lessonIndex = orderedLessons.findIndex(l => l.assessment_id === lessonId);
  
  if (lessonIndex === -1) {
    // If lesson is not in ordering, it's unlocked by default
    return false;
  }

  return isLessonLocked(lessonIndex, orderedLessons, completedActivities);
};

/**
 * Gets the next unlocked lesson ID
 */
export const getNextUnlockedLesson = (
  orderedLessons: LessonWithOrdering[],
  completedActivities: CompletedActivity[]
): string | null => {
  const completedIds = new Set(completedActivities.map(c => c.activity_id));

  for (const lesson of orderedLessons) {
    if (!completedIds.has(lesson.assessment_id)) {
      return lesson.assessment_id;
    }
  }

  return null;
};
