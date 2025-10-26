# Complete Manual Assessments Database Analysis

**Generated:** October 26, 2025 at 09:17:56 UTC
**Database:** meertwtenhlmnlpwxhyz.supabase.co
**Analysis Type:** Comprehensive with Correct Parent-Child Relationships

---

## 📈 Overview

### Total Records: 308

### 📝 Correct Hierarchy (using `parent_lesson_id`)
- **Parent Lessons:** 65 records (parent_lesson_id = NULL)
- **Child Exercises:** 243 records (parent_lesson_id = UUID)
- **Average Exercises per Lesson:** 3.7

### 📊 Type Distribution (All Records)
| Type | Count | Percentage |
|------|-------|------------|
| exercise | 255 | 82.8% |
| lesson | 52 | 16.9% |
| assessment | 1 | 0.3% |

### 📊 Subtype Distribution (All Records)
| Subtype | Count | Percentage |
|---------|-------|------------|
| multiple_choice | 192 | 62.3% |
| lesson | 52 | 16.9% |
| drag_drop | 25 | 8.1% |
| fill_blank | 18 | 5.8% |
| true_false | 13 | 4.2% |
| write_answer | 8 | 2.6% |

---

## 📚 Parent Lessons Analysis

**Total Parent Lessons:** 65

### Types of Parent Lessons
| Type | Count | Percentage |
|------|-------|------------|
| lesson | 52 | 80.0% |
| exercise | 13 | 20.0% |

*Note: 13 exercises incorrectly stored as parents (data issue)*

### Subtypes of Parent Lessons
| Subtype | Count | Percentage |
|---------|-------|------------|
| lesson | 52 | 80.0% |
| multiple_choice | 8 | 12.3% |
| write_answer | 2 | 3.1% |
| true_false | 1 | 1.5% |
| drag_drop | 1 | 1.5% |
| fill_blank | 1 | 1.5% |

---

## 🎯 Child Exercises Analysis

**Total Child Exercises:** 243

### Types of Child Exercises
| Type | Count | Percentage |
|------|-------|------------|
| exercise | 242 | 99.6% |
| assessment | 1 | 0.4% |

### Subtypes of Child Exercises
| Subtype | Count | Percentage |
|---------|-------|------------|
| multiple_choice | 184 | 75.7% |
| drag_drop | 24 | 9.9% |
| fill_blank | 17 | 7.0% |
| true_false | 12 | 4.9% |
| write_answer | 6 | 2.5% |

---

## 🤖 AI vs Non-AI Content Analysis

### Overall Distribution
- **Total AI Content:** 35 (11.4%)
- **Total Non-AI Content:** 273 (88.6%)

### AI Content Breakdown
- **AI Parent Lessons:** 5
- **AI Child Exercises:** 30
- **Grade 1 AI:** 0
- **Grade 2 AI:** 35

All AI content is Grade 2 (G2) Spanish content generated recently.

---

## 📊 Top 10 Parent Lessons by Exercise Count

| # | Lesson Title | Type/Subtype | Exercises | Exercise Types |
|---|-------------|--------------|-----------|----------------|
| 1 | Conciencia fonológica y fonética avanzada | lesson/lesson | 21 | multiple_choice, true_false |
| 2 | Une los Sonidos | lesson/lesson | 15 | fill_blank, drag_drop |
| 3 | Conciencia fonológica y fonética avanzada - Combinación fonémica y ortografía visual | lesson/lesson | 14 | drag_drop |
| 4 | Actividad digital: "Escucha y habla" | lesson/lesson | 14 | multiple_choice |
| 5 | Conciencia fonológica y fonética avanzada- Segmentación silábica | lesson/lesson | 9 | multiple_choice, drag_drop |
| 6 | Comprensión - lectura -El regalo de las palabras amables | lesson/lesson | 9 | multiple_choice |
| 7 | Encuentra el sonido del medio | lesson/lesson | 9 | multiple_choice |
| 8 | Doble palabra | lesson/lesson | 9 | multiple_choice |
| 9 | Conciencia fonémica | lesson/lesson | 9 | multiple_choice |
| 10 | AI G2: Dominio 5 - Comprensión Inferencial | lesson/lesson | 8 | multiple_choice, drag_drop, write_answer, true_false |

---

## ⚠️ Lessons Without Exercises

**Total:** 26 lessons have no exercises (40% of all lessons)

### Sample Lessons Without Exercises
1. Encuentra el Sonido con Coquí (lesson/lesson)
2. Las vocales Ii (lesson/lesson)
3. Several "Juego interactivo: 'Encuentra la vocal'" entries (exercise/multiple_choice) - *incorrectly stored as parents*
4. Various vocal exercises incorrectly classified as parent lessons

*Note: Some of these are exercises incorrectly stored as parent lessons due to missing parent_lesson_id*

---

## 📅 Recent Activity (Last 7 Days)

**Total Created in Last 7 Days:** 308 (100% of all records!)

### Daily Breakdown
| Date | Assessments Created |
|------|-------------------|
| October 25, 2025 | 170 |
| October 24, 2025 | 73 |
| October 23, 2025 | 44 |
| October 22, 2025 | 18 |
| October 21, 2025 | 3 |

Peak activity on October 25 with 170 assessments created.

---

## ✅ Content Quality Metrics

| Metric | Count | Percentage |
|--------|-------|------------|
| With Images | 96 | 31.2% |
| With Questions | 283 | 91.9% |
| With Answers | 250 | 81.2% |
| With Voice Guidance | 266 | 86.4% |
| Complete (Q&A) | 249 | 80.8% |

### Key Observations
- **Strong voice guidance coverage** at 86.4%
- **Low image coverage** at only 31.2% (needs improvement)
- **Good completion rate** with 80.8% fully structured

---

## 📐 Exercise Ordering Analysis

- **Exercises with order_in_lesson:** 86 (35.4%)
- **Exercises without order:** 157 (64.6%)

*Most exercises lack proper ordering within their lessons*

---

## 🌐 Language Distribution

| Language | Count | Percentage |
|----------|-------|------------|
| Spanish (es) | 305 | 99.0% |
| English (en) | 3 | 1.0% |

*Almost entirely Spanish content for Puerto Rican students*

---

## ⚠️ Data Quality Issues

### Structural Issues
- **Orphaned Exercises:** 0 ✅ (Good - no exercises with non-existent parents)
- **Parent records with type='exercise':** 13 ❌ (Should be children)
- **Child records with type='lesson':** 0 ✅
- **Records using deprecated parent_assessment_id:** 0 ✅

### Areas Needing Attention
1. **13 exercises stored as parents** instead of being linked to lessons
2. **157 exercises (64.6%) lack order_in_lesson** values
3. **26 lessons (40%) have no exercises** attached
4. **Low image coverage** at 31.2%

---

## 📊 Final Summary

### Database Statistics
- **Total Assessments:** 308
- **Parent Lessons:** 65
- **Child Exercises:** 243
- **AI-Generated:** 35
- **Manual Content:** 273
- **Lessons with Exercises:** 39
- **Lessons without Exercises:** 26
- **Average Exercises per Lesson (with exercises):** 6.2

### Content Completeness
- **80.8%** fully structured (question + answers)
- **31.2%** with images
- **86.4%** with voice guidance

### Key Findings
1. **Proper hierarchy exists** using the `parent_lesson_id` field
2. **243 exercises properly linked** to parent lessons
3. **Average 6.2 exercises** per lesson (for lessons that have exercises)
4. **40% of lessons** still need exercises added
5. **AI content integration successful** with 35 Grade 2 Spanish items

---

## 🎯 Recommendations

### Immediate Actions
1. **Fix 13 exercises** stored as parents - assign proper parent_lesson_id
2. **Add order_in_lesson** values to 157 exercises for proper sequencing
3. **Create exercises** for 26 lessons that currently have none
4. **Increase image coverage** from 31.2% to target 80%+

### Content Generation
1. **Generate Grade 1 AI content** (currently none exists)
2. **Fix content generation scripts** to use parent_lesson_id field
3. **Ensure all new exercises** have order_in_lesson values

### Database Cleanup
1. **Remove or document** the unused parent_assessment_id field
2. **Standardize type/subtype** usage across all records
3. **Verify all parent-child relationships** are properly established

---

## 📝 Technical Notes

### Database Schema
- **Correct parent field:** `parent_lesson_id` (added Oct 22, 2025)
- **Deprecated field:** `parent_assessment_id` (not in use)
- **Ordering field:** `order_in_lesson` (INTEGER)

### Application Logic
The application correctly uses `parent_lesson_id` to:
- Link exercises to lessons
- Display lesson-exercise flows
- Track student progress through content

---

*Analysis completed: October 26, 2025 at 09:17:57 UTC*
*Script location: `/scripts/complete-database-analysis.mjs`*