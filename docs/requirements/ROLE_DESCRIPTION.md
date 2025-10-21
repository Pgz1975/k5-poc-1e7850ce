# Reading Platform Role Description

---

## Role Access Overview

The following roles have differentiated access to platform information based on their responsibilities within the Puerto Rico Department of Education (DEPR) system:

---

## Detailed Role Descriptions

### Students by Grade Level
#### (Estudiantes por Nivel de Grado)

**Access to the Information:**

Students have grade-level restricted access to educational content appropriate for their current education level:

- **Kindergarten Students** (`student_kindergarten@demo.com`)
  - Access to Kindergarten content only
  - Age-appropriate exercises, lessons, and assessments
  - Simplified interface with larger visuals

- **1st Grade Students** (`student_1@demo.com`)
  - Access to 1st Grade content only
  - Reading exercises aligned with Grade 1 curriculum
  - Basic vocabulary and comprehension activities

- **2nd Grade Students** (`student_2@demo.com`)
  - Access to 2nd Grade content only
  - Intermediate reading materials
  - Enhanced vocabulary and writing exercises

- **3rd Grade Students** (`student_3@demo.com`)
  - Access to 3rd Grade content only
  - Advanced reading comprehension
  - Critical thinking exercises

- **4th Grade Students** (`student_4@demo.com`)
  - Access to 4th Grade content only
  - Complex reading materials
  - Literary analysis and writing

- **5th Grade Students** (`student_5@demo.com`)
  - Access to 5th Grade content only
  - Advanced literacy skills
  - Comprehensive reading and writing activities

**Scope:**
Students can only access content designated for their specific grade level, ensuring age-appropriate learning materials and preventing access to content that may be too advanced or too basic for their educational stage. This grade-level restriction applies to all lessons, exercises, assessments, and reading materials.

**Content Filtering:**
- All content is tagged with grade level during creation
- Database queries filter content by student's assigned grade level
- UI only displays grade-appropriate materials
- Cross-grade content access is prevented at the database level

---

### Parents (Padres)

**Access to the Information:**

- Data of his/her children (both Spanish and English)

**Scope:**
Parents have access to view their own children's reading progress in both languages, including performance metrics, activity completion, and personalized recommendations.

---

### English Teacher K-5th Grade
#### (Maestro de Inglés de K-5to Grado)

**Access to the Information:**

- Data of the students in his/her classroom (only English reading component)
- Group reports provided by classroom and by individual student

**Scope:**
English teachers can view detailed data about their students' English reading progress, including classroom-level group reports and individual student performance metrics specific to English reading skills.

---

### Spanish Teacher K-5th Grade
#### (Maestro de Español de K-5to Grado)

**Access to the Information:**

- Data of the students in his/her classroom (only Spanish reading component)
- Group reports provided by classroom # and by individual student

**Scope:**
Spanish teachers can view detailed data about their students' Spanish reading progress, including classroom-level group reports and individual student performance metrics specific to Spanish reading skills.

---

### School Director
#### (Director Escolar)

**Access to the Information:**

- Data of the students in his/her school
- Group reports by subject matter (Spanish or English)
- Classroom reports (# and/or teacher's name) or by individual student

**Scope:**
School directors have a broader view than individual teachers, able to see all student data across their school, organized by subject matter, classroom, or individual student performance in both languages.

---

### Regional Director
#### (Director Oficina Regional Educativa - ORE)

**Regions:**
There are seven (7) regions: San Juan, Bayamón, Arecibo, Mayagüez, Ponce, Caguas, and Humacao.

**Access to the Information:**

- Data of the students from the schools in his/her region
- Group report of total students in the region by subject matter (Spanish or English), and by school
- Group reports by total classrooms (if there is more than one classroom teaching the subject matter) or by individual classroom (# and/or teacher's name) or by individual student

**Scope:**
Regional directors oversee data across multiple schools within their assigned region, with the ability to view regional aggregates, school-level comparisons, and drill down to individual classroom or student levels.

---

### Spanish Program - Department of Education
#### (Programa Académico de Español - Departamento de Educación)

**Access to the Information:**

- Group and individual data related to Spanish of the students from all the schools in Puerto Rico
- Group data for all the regions (combined) plus group reports for each Region, individually

**Scope:**
The Spanish Academic Program has island-wide visibility into Spanish reading performance across all schools and regions, with the ability to view consolidated regional data and individual regional breakdowns.

---

### English Program - Department of Education
#### (Programa Académico de Inglés - Departamento de Educación)

**Access to the Information:**

- Group and individual data related to English of the students from all the schools in Puerto Rico
- Group data for all the regions (combined) plus group reports for each Region, individually

**Scope:**
The English Academic Program has island-wide visibility into English reading performance across all schools and regions, with the ability to view consolidated regional data and individual regional breakdowns.

---

### Administrative Role / DEPR Executive Personnel
#### (Administración / Personal clave DEPR)

**Access to the Information:**

- Group and individual data related to both Spanish and English of the students from all the schools in Puerto Rico

**Personnel Eligible for This Role:**

*For Learn Aid and key DEPR personnel only:*
- Secretary of Education
- Assistant Secretary of Education
- Assistant Secretary for Academic Affairs
- Etc.

**Scope:**
DEPR Executive Personnel and designated Learn Aid administrators have comprehensive access to all student data across both Spanish and English reading components island-wide, enabling strategic planning and policy decisions at the highest levels.

---

## Access Hierarchy Summary

| Access Level | Geographic Scope | Language Scope | Detail Level | Content Access |
|---|---|---|---|---|
| Students (K-5) | Individual | Both | Own activities | Grade-level restricted |
| Parents | Individual child | Both | Student progress | Child's grade level |
| Teachers | Classroom | One language | Class & individual | Multiple grade levels |
| School Director | School | Both | School-wide | All grade levels |
| Regional Director | Region (7 regions) | Both | Region & school-level | All grade levels |
| Spanish Program | Island-wide | Spanish only | Regional & island aggregates | All grade levels |
| English Program | Island-wide | English only | Regional & island aggregates | All grade levels |
| DEPR Executive | Island-wide | Both | Full comprehensive view | All grade levels |

---
