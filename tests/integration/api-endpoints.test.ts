/**
 * Integration Tests for API Endpoints
 * Tests Supabase Edge Functions and API routes
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('PDF API Endpoints', () => {
  let supabase: any;
  let authToken: string;

  beforeEach(async () => {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    );

    // Authenticate test user
    const { data } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'test-password'
    });

    authToken = data.session?.access_token!;
  });

  describe('POST /functions/v1/process-pdf', () => {
    it('should accept and process PDF upload', async () => {
      const formData = new FormData();
      formData.append('file', new File(['%PDF-1.4\nTest\n%%EOF'], 'test.pdf'));
      formData.append('gradeLevel', '3');
      formData.append('language', 'es');

      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/process-pdf`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: formData
        }
      );

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.fileId).toBeDefined();
      expect(data.status).toBe('processing');
    });

    it('should validate file type', async () => {
      const formData = new FormData();
      formData.append('file', new File(['Not a PDF'], 'test.txt', { type: 'text/plain' }));

      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/process-pdf`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: formData
        }
      );

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toContain('Invalid file type');
    });

    it('should enforce file size limits', async () => {
      const largeBuffer = new ArrayBuffer(51 * 1024 * 1024); // 51MB
      const formData = new FormData();
      formData.append('file', new File([largeBuffer], 'large.pdf'));

      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/process-pdf`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: formData
        }
      );

      expect(response.status).toBe(413);
    });

    it('should require authentication', async () => {
      const formData = new FormData();
      formData.append('file', new File(['%PDF-1.4'], 'test.pdf'));

      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/process-pdf`,
        {
          method: 'POST',
          body: formData
          // No auth header
        }
      );

      expect(response.status).toBe(401);
    });
  });

  describe('GET /functions/v1/pdf-status/:id', () => {
    it('should return processing status', async () => {
      // First upload a PDF
      const uploadResponse = await uploadTestPDF(authToken);
      const { fileId } = await uploadResponse.json();

      // Check status
      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/pdf-status/${fileId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.status).toMatch(/processing|completed|failed/);
      expect(data.progress).toBeDefined();
    });

    it('should return 404 for non-existent PDF', async () => {
      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/pdf-status/non-existent-id`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      expect(response.status).toBe(404);
    });
  });

  describe('GET /functions/v1/pdf-content/:id', () => {
    it('should return extracted content', async () => {
      const uploadResponse = await uploadTestPDF(authToken);
      const { fileId } = await uploadResponse.json();

      // Wait for processing
      await waitForProcessing(fileId, authToken);

      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/pdf-content/${fileId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.text).toBeDefined();
      expect(data.images).toBeDefined();
      expect(data.metadata).toBeDefined();
    });

    it('should respect user permissions', async () => {
      // Upload as one user
      const uploadResponse = await uploadTestPDF(authToken);
      const { fileId } = await uploadResponse.json();

      // Try to access as different user
      const { data: otherUser } = await supabase.auth.signInWithPassword({
        email: 'other@example.com',
        password: 'other-password'
      });

      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/pdf-content/${fileId}`,
        {
          headers: {
            'Authorization': `Bearer ${otherUser.session?.access_token}`
          }
        }
      );

      expect(response.status).toBe(403);
    });
  });

  describe('POST /functions/v1/search-pdfs', () => {
    it('should search PDF content', async () => {
      // Upload test PDFs with specific content
      await uploadTestPDF(authToken, 'Test content about photosynthesis');

      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/search-pdfs`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: 'photosynthesis',
            language: 'en'
          })
        }
      );

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.results).toBeDefined();
      expect(data.results.length).toBeGreaterThan(0);
      expect(data.results[0].text).toContain('photosynthesis');
    });

    it('should filter by grade level', async () => {
      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/search-pdfs`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: 'science',
            gradeLevel: '3'
          })
        }
      );

      const data = await response.json();
      expect(data.results.every((r: any) => r.gradeLevel === '3')).toBe(true);
    });

    it('should support bilingual search', async () => {
      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/search-pdfs`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: 'water',
            languages: ['en-US', 'es']
          })
        }
      );

      const data = await response.json();
      expect(data.results.some((r: any) => r.language === 'en-US')).toBe(true);
      expect(data.results.some((r: any) => r.language === 'es')).toBe(true);
    });
  });

  describe('DELETE /functions/v1/pdf/:id', () => {
    it('should delete PDF and associated data', async () => {
      const uploadResponse = await uploadTestPDF(authToken);
      const { fileId } = await uploadResponse.json();

      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/pdf/${fileId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      expect(response.ok).toBe(true);

      // Verify deletion
      const checkResponse = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/pdf-content/${fileId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      expect(checkResponse.status).toBe(404);
    });

    it('should prevent unauthorized deletion', async () => {
      const uploadResponse = await uploadTestPDF(authToken);
      const { fileId } = await uploadResponse.json();

      // Try to delete as different user
      const { data: otherUser } = await supabase.auth.signInWithPassword({
        email: 'other@example.com',
        password: 'other-password'
      });

      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/pdf/${fileId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${otherUser.session?.access_token}`
          }
        }
      );

      expect(response.status).toBe(403);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const requests = Array(100).fill(null).map(() =>
        uploadTestPDF(authToken)
      );

      const responses = await Promise.all(requests);
      const rateLimited = responses.filter(r => r.status === 429);

      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should return proper error messages', async () => {
      const formData = new FormData();
      // Missing required file

      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/process-pdf`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: formData
        }
      );

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBeDefined();
      expect(data.message).toContain('file');
    });

    it('should handle malformed requests', async () => {
      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/process-pdf`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: 'invalid json'
        }
      );

      expect(response.status).toBe(400);
    });
  });
});

// Helper functions
async function uploadTestPDF(token: string, content: string = 'Test content'): Promise<Response> {
  const formData = new FormData();
  formData.append('file', new File([`%PDF-1.4\n${content}\n%%EOF`], 'test.pdf'));
  formData.append('gradeLevel', '3');

  return fetch(
    `${process.env.VITE_SUPABASE_URL}/functions/v1/process-pdf`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }
  );
}

async function waitForProcessing(fileId: string, token: string, timeout: number = 10000): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const response = await fetch(
      `${process.env.VITE_SUPABASE_URL}/functions/v1/pdf-status/${fileId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (data.status === 'completed' || data.status === 'failed') {
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  throw new Error('Processing timeout');
}
