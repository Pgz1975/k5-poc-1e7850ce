# Edge Functions Specification

## 1. List PDF Content Function

### Endpoint
`GET /functions/v1/list-pdf-content?document_id={uuid}`

### Purpose
Simple fetch and display of all parsed content from a PDF

### Implementation
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const url = new URL(req.url)
  const documentId = url.searchParams.get('document_id')

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )

  // Get document info
  const { data: doc } = await supabase
    .from('pdf_documents')
    .select('*')
    .eq('id', documentId)
    .single()

  // Get text content
  const { data: texts } = await supabase
    .from('pdf_text_content')
    .select('*')
    .eq('document_id', documentId)
    .order('page_number', 'block_index')

  // Get images
  const { data: images } = await supabase
    .from('pdf_images')
    .select('*')
    .eq('document_id', documentId)
    .order('page_number', 'image_index')

  // Get questions
  const { data: questions } = await supabase
    .from('assessment_questions')
    .select('*')
    .eq('document_id', documentId)

  return new Response(
    JSON.stringify({
      document: doc,
      content: {
        texts,
        images,
        questions
      }
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

## 2. Generate Assessment Function

### Endpoint
`POST /functions/v1/generate-assessment`

### Request Body
```json
{
  "selected_items": {
    "texts": ["uuid1", "uuid2"],
    "images": ["uuid3", "uuid4"],
    "questions": ["uuid5", "uuid6"]
  },
  "assessment_type": "reading_exercise",
  "grade_level": 1,
  "language": "es"
}
```

### Implementation
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const PEXELS_API_KEY = Deno.env.get('PEXELS_API_KEY')

// Simple template functions
function generateReadingTemplate(content, pexelsImages) {
  return {
    type: 'reading_exercise',
    pages: content.texts.map((text, idx) => ({
      text: text.text_content,
      images: [
        ...content.images.slice(idx, idx + 2).map(img => img.storage_path),
        ...pexelsImages.slice(idx * 2, idx * 2 + 2)
      ],
      coqui_state: idx === 0 ? 'happy' : 'excited',
      font_size: 'text-3xl',
      progress: idx + 1
    }))
  }
}

function generateQuizTemplate(content) {
  return {
    type: 'quiz',
    questions: content.questions.map(q => ({
      question: q.question_text,
      options: q.options,
      correct: q.correct_answer,
      images: q.source_image_ids,
      reward: '⭐'
    }))
  }
}

async function fetchPexelsImages(topic, count = 4) {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${topic}&per_page=${count}`,
    {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    }
  )
  const data = await response.json()
  return data.photos.map(p => p.src.large)
}

serve(async (req) => {
  const body = await req.json()
  const { selected_items, assessment_type, grade_level } = body

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )

  // Fetch selected content
  const content = {
    texts: [],
    images: [],
    questions: []
  }

  if (selected_items.texts?.length) {
    const { data } = await supabase
      .from('pdf_text_content')
      .select('*')
      .in('id', selected_items.texts)
    content.texts = data
  }

  if (selected_items.images?.length) {
    const { data } = await supabase
      .from('pdf_images')
      .select('*')
      .in('id', selected_items.images)
    content.images = data
  }

  if (selected_items.questions?.length) {
    const { data } = await supabase
      .from('assessment_questions')
      .select('*')
      .in('id', selected_items.questions)
    content.questions = data
  }

  // Get decoration images from Pexels
  const topic = grade_level === 1 ? 'colorful animals kids' : 'school children learning'
  const pexelsImages = await fetchPexelsImages(topic)

  // Generate assessment based on type
  let generated
  switch (assessment_type) {
    case 'reading_exercise':
      generated = generateReadingTemplate(content, pexelsImages)
      break
    case 'quiz':
      generated = generateQuizTemplate(content)
      break
    default:
      generated = generateReadingTemplate(content, pexelsImages)
  }

  // Save to database
  const { data: assessment } = await supabase
    .from('generated_assessments')
    .insert({
      selected_items: selected_items,
      type: assessment_type,
      grade_level: grade_level,
      content: generated
    })
    .select()
    .single()

  return new Response(
    JSON.stringify({
      success: true,
      assessment_id: assessment.id,
      url: `/generated/${assessment.id}`
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

## 3. Get Generated Assessment

### Endpoint
`GET /functions/v1/get-assessment?id={uuid}`

### Purpose
Retrieve a generated assessment for display

### Implementation
```typescript
serve(async (req) => {
  const url = new URL(req.url)
  const assessmentId = url.searchParams.get('id')

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )

  const { data, error } = await supabase
    .from('generated_assessments')
    .select('*')
    .eq('id', assessmentId)
    .single()

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Assessment not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify(data),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

## 4. Update Assessment (Editor)

### Endpoint
`POST /functions/v1/update-assessment`

### Purpose
Save changes from the visual editor

### Request Body
```json
{
  "id": "uuid",
  "content": {
    "type": "reading_exercise",
    "pages": [...]
  },
  "metadata": {
    "last_edited": "timestamp",
    "editor_version": "1.0"
  }
}
```

### Implementation
```typescript
serve(async (req) => {
  const { id, content, metadata } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )

  const { data, error } = await supabase
    .from('generated_assessments')
    .update({
      content,
      metadata,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true, data }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

## 5. Get PDF Images

### Endpoint
`GET /functions/v1/get-pdf-images?document_id={uuid}`

### Purpose
Fetch all images from a PDF for use in editor

### Implementation
```typescript
serve(async (req) => {
  const url = new URL(req.url)
  const documentId = url.searchParams.get('document_id')

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )

  const { data: images } = await supabase
    .from('pdf_images')
    .select('id, storage_path, alt_text, page_number')
    .eq('document_id', documentId)
    .order('page_number', 'image_index')

  // Generate signed URLs for images
  const imagesWithUrls = await Promise.all(
    images.map(async (img) => {
      const { data: { publicUrl } } = supabase.storage
        .from('educational-pdfs')
        .getPublicUrl(img.storage_path)

      return {
        ...img,
        url: publicUrl
      }
    })
  )

  return new Response(
    JSON.stringify(imagesWithUrls),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

## 6. Search Pexels Images

### Endpoint
`GET /functions/v1/search-pexels?q={query}&per_page={number}`

### Purpose
Search Pexels for kid-friendly images

### Implementation
```typescript
serve(async (req) => {
  const url = new URL(req.url)
  const query = url.searchParams.get('q')
  const perPage = url.searchParams.get('per_page') || '12'

  const PEXELS_API_KEY = Deno.env.get('PEXELS_API_KEY')

  // Add kid-safe filters to query
  const safeQuery = `${query} children education colorful`

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(safeQuery)}&per_page=${perPage}`,
    {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    }
  )

  const data = await response.json()

  // Return simplified image data
  const images = data.photos.map(photo => ({
    id: photo.id,
    url: photo.src.large,
    thumbnail: photo.src.medium,
    alt: photo.alt || query,
    photographer: photo.photographer
  }))

  return new Response(
    JSON.stringify(images),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

## 7. Upload Image

### Endpoint
`POST /functions/v1/upload-image`

### Purpose
Upload custom images for assessments

### Request
Multipart form data with image file

### Implementation
```typescript
serve(async (req) => {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const assessmentId = formData.get('assessment_id') as string

  if (!file) {
    return new Response(
      JSON.stringify({ error: 'No file provided' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${assessmentId}/${crypto.randomUUID()}.${fileExt}`

  // Upload to storage
  const { data, error } = await supabase.storage
    .from('assessment-uploads')
    .upload(fileName, file, {
      contentType: file.type,
      cacheControl: '3600'
    })

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('assessment-uploads')
    .getPublicUrl(fileName)

  return new Response(
    JSON.stringify({
      success: true,
      url: publicUrl,
      path: fileName
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

## 8. Duplicate Assessment

### Endpoint
`POST /functions/v1/duplicate-assessment`

### Purpose
Create a copy of an existing assessment for editing

### Request Body
```json
{
  "assessment_id": "uuid",
  "new_name": "Copy of Original Assessment"
}
```

### Implementation
```typescript
serve(async (req) => {
  const { assessment_id, new_name } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )

  // Get original assessment
  const { data: original } = await supabase
    .from('generated_assessments')
    .select('*')
    .eq('id', assessment_id)
    .single()

  if (!original) {
    return new Response(
      JSON.stringify({ error: 'Assessment not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Create duplicate
  const { data: duplicate } = await supabase
    .from('generated_assessments')
    .insert({
      ...original,
      id: undefined, // Let DB generate new ID
      content: {
        ...original.content,
        name: new_name || `Copy of ${original.content.name}`
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  return new Response(
    JSON.stringify({
      success: true,
      assessment_id: duplicate.id,
      url: `/editor/${duplicate.id}`
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```