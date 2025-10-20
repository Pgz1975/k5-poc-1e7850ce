/**
 * K5 Platform Search API Routes
 * Full-text search endpoints for educational content
 */

import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { searchRequestSchema } from '../validation/schemas';
import { ResponseFormatter, createPaginationMeta } from '../utils/response';
import type { SearchRequest, SearchResult } from '../types';

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// POST /api/v1/search
// Full-text search across PDF content
// ============================================================================

router.post('/', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    // Validate request
    const validatedData = searchRequestSchema.parse(req.body);

    const { query, filters, pagination, sort } = validatedData;
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const offset = (page - 1) * limit;

    // Build full-text search query using Supabase's text search
    let searchQuery = supabase
      .from('pdf_content')
      .select(`
        *,
        pdf_documents (
          id,
          filename,
          original_filename,
          content_type,
          grade_level,
          subject_area,
          primary_language,
          reading_level,
          curriculum_standards,
          uploaded_at
        )
      `, { count: 'exact' })
      .textSearch('text_content', query, {
        type: 'websearch',
        config: 'english',
      });

    // Apply filters
    if (filters?.contentType && filters.contentType.length > 0) {
      searchQuery = searchQuery.in(
        'pdf_documents.content_type',
        filters.contentType
      );
    }

    if (filters?.gradeLevel && filters.gradeLevel.length > 0) {
      searchQuery = searchQuery.overlaps(
        'pdf_documents.grade_level',
        filters.gradeLevel
      );
    }

    if (filters?.subjectArea && filters.subjectArea.length > 0) {
      searchQuery = searchQuery.overlaps(
        'pdf_documents.subject_area',
        filters.subjectArea
      );
    }

    if (filters?.primaryLanguage && filters.primaryLanguage.length > 0) {
      searchQuery = searchQuery.in(
        'pdf_documents.primary_language',
        filters.primaryLanguage
      );
    }

    // Apply sorting
    if (sort) {
      searchQuery = searchQuery.order(sort.field, {
        ascending: sort.order === 'asc',
      });
    } else {
      // Default sort by relevance (not directly supported, using page number as proxy)
      searchQuery = searchQuery.order('page_number', { ascending: true });
    }

    // Apply pagination
    searchQuery = searchQuery.range(offset, offset + limit - 1);

    const { data: searchResults, error, count } = await searchQuery;

    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }

    // Group results by document and calculate relevance
    const documentMap = new Map<string, SearchResult>();

    searchResults?.forEach((result: any) => {
      const doc = result.pdf_documents;
      const docId = doc.id;

      if (!documentMap.has(docId)) {
        documentMap.set(docId, {
          document: {
            id: doc.id,
            filename: doc.filename,
            originalFilename: doc.original_filename,
            contentType: doc.content_type,
            gradeLevel: doc.grade_level,
            subjectArea: doc.subject_area,
            primaryLanguage: doc.primary_language,
            readingLevel: doc.reading_level,
            curriculumStandards: doc.curriculum_standards,
            uploadedAt: doc.uploaded_at,
          } as any,
          relevance: calculateRelevance(result.text_content, query),
          highlights: extractHighlights(result.text_content, query),
          matchedContent: [],
        });
      }

      const searchResult = documentMap.get(docId)!;
      searchResult.matchedContent!.push({
        pageNumber: result.page_number,
        excerpt: createExcerpt(result.text_content, query, 200),
      });
    });

    // Convert map to array and sort by relevance
    const results = Array.from(documentMap.values()).sort(
      (a, b) => b.relevance - a.relevance
    );

    const meta = createPaginationMeta(page, limit, count || 0);

    const response = formatter.success(
      {
        results,
        total: count || 0,
        ...meta,
      },
      meta
    );

    return res.status(response.status).json(response.body);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(422).json(formatter.validationError(error.errors));
    }

    console.error('Search error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// GET /api/v1/search/suggestions
// Get search suggestions based on query
// ============================================================================

router.get('/suggestions', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const query = (req.query.q as string) || '';
    const limit = parseInt(req.query.limit as string) || 5;

    if (!query || query.length < 2) {
      return res.status(400).json(
        formatter.error(
          'INVALID_QUERY',
          'Query must be at least 2 characters'
        )
      );
    }

    // Get most common words/phrases from content
    const { data: suggestions, error } = await supabase
      .from('pdf_content')
      .select('text_content')
      .textSearch('text_content', query, { type: 'prefix' })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get suggestions: ${error.message}`);
    }

    // Extract unique words that match the query
    const uniqueSuggestions = new Set<string>();
    suggestions?.forEach((result: any) => {
      const words = result.text_content.split(/\s+/);
      words.forEach((word: string) => {
        const cleaned = word.toLowerCase().replace(/[^\w]/g, '');
        if (cleaned.startsWith(query.toLowerCase()) && cleaned.length > query.length) {
          uniqueSuggestions.add(word);
        }
      });
    });

    const response = formatter.success({
      query,
      suggestions: Array.from(uniqueSuggestions).slice(0, limit),
    });

    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Suggestions error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate search relevance score
 */
function calculateRelevance(text: string, query: string): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const textWords = text.toLowerCase().split(/\s+/);

  let score = 0;

  queryWords.forEach((queryWord) => {
    // Exact matches
    const exactMatches = textWords.filter((word) => word === queryWord).length;
    score += exactMatches * 10;

    // Partial matches
    const partialMatches = textWords.filter((word) =>
      word.includes(queryWord)
    ).length;
    score += partialMatches * 5;
  });

  // Normalize by text length
  return score / (textWords.length / 100);
}

/**
 * Extract highlighted snippets
 */
function extractHighlights(text: string, query: string, maxHighlights: number = 3): string[] {
  const queryWords = query.toLowerCase().split(/\s+/);
  const sentences = text.split(/[.!?]\s+/);
  const highlights: Array<{ sentence: string; score: number }> = [];

  sentences.forEach((sentence) => {
    const lowerSentence = sentence.toLowerCase();
    let score = 0;

    queryWords.forEach((word) => {
      if (lowerSentence.includes(word)) {
        score++;
      }
    });

    if (score > 0) {
      highlights.push({ sentence: sentence.trim(), score });
    }
  });

  return highlights
    .sort((a, b) => b.score - a.score)
    .slice(0, maxHighlights)
    .map((h) => h.sentence);
}

/**
 * Create excerpt around search terms
 */
function createExcerpt(text: string, query: string, maxLength: number = 200): string {
  const queryWords = query.toLowerCase().split(/\s+/);
  const lowerText = text.toLowerCase();

  // Find first occurrence of any query word
  let firstIndex = -1;
  for (const word of queryWords) {
    const index = lowerText.indexOf(word);
    if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
      firstIndex = index;
    }
  }

  if (firstIndex === -1) {
    return text.substring(0, maxLength) + '...';
  }

  // Calculate excerpt bounds
  const start = Math.max(0, firstIndex - Math.floor(maxLength / 2));
  const end = Math.min(text.length, start + maxLength);

  let excerpt = text.substring(start, end);

  // Add ellipsis
  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';

  return excerpt;
}

export default router;
