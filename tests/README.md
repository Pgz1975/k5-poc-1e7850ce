# K5 PDF Parsing System - Test Suite

Comprehensive testing suite for the K5 PDF parsing and content management system.

## 📋 Test Coverage

### Unit Tests (`/tests/unit/`)
- **pdf-parser.test.ts** - PDF text extraction, metadata, and language detection
- **image-extractor.test.ts** - Image detection, optimization, and classification
- **language-detection.test.ts** - Language detection accuracy (95%+ target)
- **image-correlation.test.ts** - Text-image correlation (90%+ target)
- **security-compliance.test.ts** - FERPA, COPPA, and security validation

### Integration Tests (`/tests/integration/`)
- **edge-function-upload.test.ts** - Complete upload and processing workflow
- End-to-end Edge Function integration
- Database operations
- Storage management

### E2E Tests (`/tests/e2e/`)
- **complete-pipeline.test.ts** - Full PDF processing pipeline
- Upload → Process → Retrieve workflow
- Bilingual content handling
- Assessment extraction
- Search and retrieval

### Performance Tests (`/tests/performance/`)
- **benchmarks.test.ts** - Processing speed benchmarks
  - 1-page PDF: <3 seconds ✓
  - 100-page PDF: <45 seconds ✓
  - Concurrent processing
  - Memory usage
  - Cost analysis
- **load-testing.test.ts** - Concurrent upload capacity
  - 10, 100, 1000 concurrent uploads
  - Queue management
  - Database throughput
  - Resource usage

### Mock Data (`/tests/mocks/`)
- **pdf-generator.ts** - Generate test PDFs with various characteristics
- **supabase-client.ts** - Mock Supabase client for testing

## 🚀 Running Tests

### All Tests
```bash
# Using Vitest (recommended)
npm run test

# Using Jest
npm run test:jest

# Watch mode
npm run test:watch
```

### Specific Test Suites
```bash
# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance
```

### Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
npm run test:coverage:open
```

## 🎯 Performance Targets

| Metric | Target | Test |
|--------|--------|------|
| 1-page PDF processing | <3s | `benchmarks.test.ts` |
| 100-page PDF processing | <45s | `benchmarks.test.ts` |
| Text extraction accuracy | >98% | `pdf-parser.test.ts` |
| Language detection accuracy | >95% | `language-detection.test.ts` |
| Image correlation accuracy | >90% | `image-correlation.test.ts` |
| Concurrent uploads | 1000+ | `load-testing.test.ts` |
| Storage reduction | >60% | `benchmarks.test.ts` |
| Processing cost | <$0.05/PDF | `benchmarks.test.ts` |
| Test coverage | >90% | All tests |

## 📊 Test Organization

```
tests/
├── unit/                    # Unit tests for individual modules
│   ├── pdf-parser.test.ts
│   ├── image-extractor.test.ts
│   ├── language-detection.test.ts
│   ├── image-correlation.test.ts
│   └── security-compliance.test.ts
├── integration/             # Integration tests
│   └── edge-function-upload.test.ts
├── e2e/                     # End-to-end tests
│   └── complete-pipeline.test.ts
├── performance/             # Performance and load tests
│   ├── benchmarks.test.ts
│   └── load-testing.test.ts
├── mocks/                   # Mock data and clients
│   ├── pdf-generator.ts
│   └── supabase-client.ts
├── fixtures/                # Test fixtures and sample files
├── utils/                   # Test utilities
├── setup.ts                 # Global test setup
├── vitest.config.ts         # Vitest configuration
├── jest.config.ts           # Jest configuration
└── .env.test                # Test environment variables
```

## 🔧 Configuration

### Environment Variables
Create a `.env.test` file with:

```env
# Supabase Test Configuration
TEST_SUPABASE_URL=http://localhost:54321
TEST_SUPABASE_ANON_KEY=your-test-anon-key
TEST_SUPABASE_SERVICE_ROLE_KEY=your-test-service-key

# Performance Targets
TEST_SINGLE_PAGE_TARGET_MS=3000
TEST_HUNDRED_PAGE_TARGET_MS=45000
TEST_TEXT_EXTRACTION_TARGET=0.98
TEST_LANGUAGE_DETECTION_TARGET=0.95
TEST_IMAGE_CORRELATION_TARGET=0.90
```

### Coverage Thresholds
- Statements: 90%
- Branches: 85%
- Functions: 90%
- Lines: 90%

## 📝 Writing New Tests

### Unit Test Template
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should perform expected behavior', () => {
    // Arrange
    const input = setupTestData();

    // Act
    const result = performAction(input);

    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

### Integration Test Template
```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { createMockSupabaseClient } from '../mocks/supabase-client';

describe('Integration - Feature Name', () => {
  let supabase: any;

  beforeAll(() => {
    supabase = createMockSupabaseClient();
  });

  it('should complete workflow', async () => {
    const result = await completeWorkflow(supabase);
    expect(result.success).toBe(true);
  });
});
```

## 🧪 Test Data Generation

Use the `MockPDFGenerator` to create test PDFs:

```typescript
import { MockPDFGenerator } from './mocks/pdf-generator';

// Single page Spanish PDF
const pdf = await MockPDFGenerator.generatePDF({
  pageCount: 1,
  language: 'spanish',
  gradeLevel: '3'
});

// Bilingual PDF
const bilingualPdf = await MockPDFGenerator.generateBilingualPDF();

// Assessment PDF
const assessmentPdf = await MockPDFGenerator.generateAssessmentPDF(10, 'spanish');

// PDF with images
const pdfWithImages = await MockPDFGenerator.generatePDF({
  pageCount: 5,
  includeImages: true,
  imageCount: 3
});
```

## 🔍 Debugging Tests

### Run Single Test File
```bash
npm run test tests/unit/pdf-parser.test.ts
```

### Run Specific Test
```bash
npm run test -- -t "should extract text from single-page PDF"
```

### Debug Mode
```bash
# Vitest debug mode
npm run test -- --inspect-brk

# Jest debug mode
node --inspect-brk node_modules/.bin/jest
```

### Verbose Output
```bash
npm run test -- --verbose
```

## 📈 Continuous Integration

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## 🐛 Common Issues

### Test Timeout
If tests timeout, increase the timeout in test files:
```typescript
it('slow test', async () => {
  // test code
}, 60000); // 60 second timeout
```

### Memory Issues
Run tests with increased memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run test
```

### Mock Data Issues
Reset mock data between tests:
```typescript
beforeEach(() => {
  supabase.reset();
});
```

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [PDF Parsing Implementation Plan](../docs/plan/PDF-PARSING-IMPLEMENTATION-PLAN.md)

## 🤝 Contributing

When adding new tests:
1. Follow the existing test structure
2. Include descriptive test names
3. Test both success and error cases
4. Add edge case coverage
5. Update this README if adding new test categories
6. Ensure coverage thresholds are met

## 📞 Support

For issues or questions about tests:
- Check existing test examples
- Review mock implementations
- Consult the implementation plan
- Ask in team discussions
