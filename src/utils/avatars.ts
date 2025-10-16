// Default avatar images organized by role
export const defaultAvatars = {
  student: [
    '/avatars/student-1.jpg',
    '/avatars/student-2.jpg',
    '/avatars/student-3.jpg',
    '/avatars/student-4.jpg',
  ],
  teacher: [
    '/avatars/teacher-1.jpg',
    '/avatars/teacher-2.jpg',
    '/avatars/teacher-3.jpg',
  ],
  family: [
    '/avatars/family-1.jpg',
    '/avatars/family-2.jpg',
    '/avatars/family-3.jpg',
  ],
};

export type UserRole = keyof typeof defaultAvatars;

/**
 * Get a random avatar for a specific role
 */
export const getRandomAvatarForRole = (role: UserRole): string => {
  const avatars = defaultAvatars[role];
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
};

/**
 * Get all avatars for a specific role
 */
export const getAvatarsForRole = (role: UserRole): string[] => {
  return defaultAvatars[role];
};
