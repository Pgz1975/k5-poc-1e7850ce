// Avatar utility functions using open-source DiceBear avatars

export const defaultAvatars = [
  '/avatars/student-1.svg',
  '/avatars/student-2.svg',
  '/avatars/student-3.svg',
  '/avatars/student-4.svg',
  '/avatars/teacher-1.svg',
  '/avatars/teacher-2.svg',
  '/avatars/family-1.svg',
  '/avatars/family-2.svg',
  '/avatars/default-1.svg',
  '/avatars/default-2.svg',
];

export const avatarStyles = [
  'avataaars',
  'big-smile',
  'fun-emoji',
  'personas',
  'lorelei',
  'notionists',
  'pixel-art',
] as const;

export type AvatarStyle = typeof avatarStyles[number];

/**
 * Generate a unique avatar URL using DiceBear API
 * @param seed - Unique identifier (e.g., user ID, email)
 * @param style - Avatar style (default: 'avataaars')
 * @returns URL to the generated avatar
 */
export function generateAvatarUrl(seed: string, style: AvatarStyle = 'avataaars'): string {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * Get a random default avatar from the pre-downloaded collection
 */
export function getRandomDefaultAvatar(): string {
  return defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
}

/**
 * Get avatar URL - returns user's custom avatar or generates a default one
 * @param userId - User ID to generate seed
 * @param customAvatarUrl - Custom avatar URL if user has uploaded one
 * @param style - Preferred avatar style
 */
export function getAvatarUrl(
  userId?: string,
  customAvatarUrl?: string | null,
  style: AvatarStyle = 'avataaars'
): string {
  if (customAvatarUrl) {
    return customAvatarUrl;
  }
  
  if (userId) {
    return generateAvatarUrl(userId, style);
  }
  
  return getRandomDefaultAvatar();
}
