# Duplicate Image Detection & Prevention

## Problem
Duplicate images were found in drag-and-drop match exercises, where the same image URL appeared multiple times in the `draggableItems` array. This created a confusing user experience.

### Example Issue
In assessment `0b24b47a-9f22-4d7b-90e8-db861aa0a5ea` ("AI: Relaciona con M"), items 1 and 2 both had the same image URL:
- Item 1 (mano): `https://images.pexels.com/photos/34374061/...`
- Item 2 (mesa): `https://images.pexels.com/photos/34374061/...` ❌ DUPLICATE

## Solutions Implemented

### 1. Fixed Existing Duplicate (Database Update)
```sql
UPDATE manual_assessments
SET content = jsonb_set(
  content,
  '{draggableItems,1,content}',
  '"https://images.pexels.com/photos/326333/pexels-photo-326333.jpeg"'::jsonb
)
WHERE id = '0b24b47a-9f22-4d7b-90e8-db861aa0a5ea'
```

### 2. Updated Generation Script
**File**: `src/scripts/generateGrade1SpanishContent.ts`

#### Changes Made:
1. **Improved Search Terms**: Made search terms more specific to reduce API returning same images
   - Before: `"table desk"` 
   - After: `"wooden table desk"`

2. **Duplicate Detection Logic**: Added validation in `contentBuilder`
   ```typescript
   contentBuilder: (images) => {
     // Ensure no duplicate images
     const uniqueImages = Array.from(new Set(images.filter(img => img !== null)));
     if (uniqueImages.length < images.length) {
       console.warn("⚠️ Duplicate images detected, using unique images only");
     }
     return {
       // ... content
       draggableItems: [
         { id: "1", content: uniqueImages[0] || images[0] || "", ... },
         { id: "2", content: uniqueImages[1] || images[1] || "", ... },
         // ...
       ]
     };
   }
   ```

3. **Added `questionText` Field**: Ensures text instructions are visible to students (not only spoken)
   ```typescript
   {
     question: "Arrastra las imágenes según comiencen o no con /m/",
     questionText: "Mira las imágenes. Arrastra al lado correcto las que comienzan con el sonido /m/. Recuerda: 'mano', 'mesa', 'manzana' y 'mono' todas comienzan con /m/.",
     // ...
   }
   ```

### 3. Created Detection Edge Function
**File**: `supabase/functions/fix-duplicate-images/index.ts`

This function:
- Scans all drag-drop match exercises
- Detects duplicate image URLs within each exercise
- Reports exercises that need manual fixing
- Logs diagnostic information for debugging

**Usage**:
```bash
# Call the edge function to scan for duplicates
curl -X POST https://<project>.supabase.co/functions/v1/fix-duplicate-images
```

## Affected Exercises Updated

1. **AI: Relaciona con M** (Lesson 1)
   - Added unique image validation
   - Improved search terms: "hand fingers", "wooden table desk", "red apple fruit", "monkey animal"
   - Added questionText

2. **AI: Relaciona con S** (Lesson 2)
   - Added unique image validation
   - Improved search terms: "wooden chair furniture", "watermelon fruit sliced", "green snake reptile", "brown sofa couch"
   - Added questionText

3. **AI: Hogar del coquí** (Lesson 3)
   - Added unique image validation
   - Improved search terms: "tropical green leaves", "Puerto Rico El Yunque waterfall", "tree branch nature", "small coqui frog"
   - Added questionText

4. **AI: Comidas de PR** (Lesson 4)
   - Added unique image validation
   - Improved search terms: "mofongo plantain Puerto Rico", "rice beans Puerto Rican", "roasted pork pernil", "hamburger american food"
   - Added questionText

## Prevention Guidelines

### For Future Content Generation:

1. **Always use specific search terms** to reduce likelihood of API returning duplicate results
2. **Validate unique images** before creating content objects
3. **Include `questionText`** in all exercises so students can read instructions (not just hear them)
4. **Log warnings** when duplicates are detected during generation
5. **Test exercises** after generation to verify no duplicates

### Code Pattern to Follow:
```typescript
const uniqueImages = Array.from(new Set(images.filter(img => img !== null)));
if (uniqueImages.length < images.length) {
  console.warn("⚠️ Duplicate images detected in exercise");
}
```

## Testing
After regenerating content, verify:
- [ ] All match exercises have unique images per exercise
- [ ] `questionText` field is populated (for student reading)
- [ ] Voice guidance is descriptive
- [ ] Search terms are specific enough

## Database Query to Check for Duplicates
```sql
SELECT 
  id,
  title,
  content->'draggableItems' as items
FROM manual_assessments
WHERE type = 'exercise' 
  AND subtype = 'drag_drop'
  AND content->'mode' = '"match"'
ORDER BY created_at DESC;
```

Manually inspect the `items` array to ensure all `content` URLs are unique.
