# Avatar Images

This directory contains profile pictures for different user roles in the LecturaPR application.

## Available Avatars

### Students
- `student-1.jpg` - Young professional male
- `student-2.jpg` - Young professional female
- `student-3.jpg` - Young professional male
- `student-4.jpg` - Young professional male

### Teachers
- `teacher-1.jpg` - Professional female educator
- `teacher-2.jpg` - Professional male educator
- `teacher-3.jpg` - Professional male educator

### Families
- `family-1.jpg` - Professional female parent/guardian
- `family-2.jpg` - Professional male parent/guardian
- `family-3.jpg` - Professional male parent/guardian

## Image Source

All images are sourced from [Unsplash](https://unsplash.com/), which provides free, high-quality images under the Unsplash License.

## Usage

These avatars are automatically assigned to demo users based on their role:
- When creating new demo users via `createDemoUsers()`
- When updating existing profiles via `assignDemoAvatars()`

To use these avatars in your components:

```tsx
import { defaultAvatars, getRandomAvatarForRole } from '@/utils/avatars';

// Get all avatars for a specific role
const studentAvatars = defaultAvatars.student;

// Get a random avatar for a role
const randomAvatar = getRandomAvatarForRole('teacher');
```

## Adding More Avatars

To add more avatars:
1. Download high-quality profile images (preferably 400x400px or larger)
2. Save them in this directory with the naming pattern: `{role}-{number}.jpg`
3. Update `src/utils/avatars.ts` to include the new avatar paths
4. Ensure images are appropriately licensed for use

## License

All images are used under the Unsplash License, which allows free use for both commercial and non-commercial purposes without requiring permission or attribution.
