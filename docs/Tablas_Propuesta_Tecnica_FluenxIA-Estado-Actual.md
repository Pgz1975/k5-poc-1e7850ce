**Propuesta y Documentación Técnica – Plataforma FluenxIA**

Su plataforma en la nube, basada en Supabase Enterprise Cloud, asegura rendimiento, escalabilidad y disponibilidad continua (99.98 %).

---

**3. COMPONENTES DEL SISTEMA**

**3.1 Interfaz Web (Aplicación Front End)**

Aplicación bilingüe (español/inglés), responsiva y accesible desde computadoras, tabletas o celulares (Windows, iOS, Android).

**Tecnologías base:** React 18.3.1, TypeScript 5.8.3, Vite 5.4.19, Tailwind CSS 3.4.17.
Brinda una navegación intuitiva adaptada a cada rol, sin instalación local.

**3.2 Infraestructura Back End y Base de Datos**

Plataforma cloud Supabase Enterprise Cloud (PostgreSQL 15.x).

Capacidad para más de 165,000 usuarios concurrentes con balanceo automático, respaldo diario y replicación multi-región (US-East-1 Virginia / US-West-2 Oregon).

**3.3 Motor de Reconocimiento de Voz**

Basado en **OpenAI Realtime API (GPT-4O y GPT-4O Mini)** + Web Speech API. Opera en español (acento puertorriqueño) e inglés (americano estándar).

Detecta pronunciación, ritmo y entonación (precisión > 92 %) y genera informes automáticos individuales.

Los audios se procesan de forma anónima y temporal, cumpliendo FERPA y COPPA.

**3.6 Autenticación y SSO (Single Sign-On)**

Motor **Supabase Auth v2.75.0**, compatible con OAuth 2.0 y SAML 2.0.

Acceso con cuentas institucionales del DEPR y autenticación mediante Google Sign-In integrado a PowerSchool.

**3.7 Panel Administrativo y de Reportes (Dashboard System)**

Sistema de reportes con 17 métricas clave (frecuencia de uso, fluidez, comprensión y progreso por escuela, región y nivel isla).

Permite descargar informes en PDF, Excel y JSON y visualizar tendencias en tiempo real.

**3.9 Motor de Análisis de IA**

Basado en **OpenAI GPT-4O y Whisper.**

**3.10 Accesibilidad y Cumplimiento**

Soporta lectores NVDA y VoiceOver, contraste ajustable y navegación por teclado.
Interfaz totalmente bilingüe e inclusiva para todos los perfiles de usuario.

---

**4. ESPECIFICACIONES TÉCNICAS DETALLADAS**

La plataforma FluenxIA opera bajo una arquitectura **Full-Stack Cloud** **escalable.**

A continuación, se detallan las especificaciones por componente:

**4.1 Aplicación Front End (Interfaz Web)**

| Parámetro | Descripción Técnica |
| ----- | :---: |
| **Framework base** | React v18.3.1 |
| **Lenguaje** | TypeScript v5.8.3 |
| **Compilador / Build Tool** | Vite v5.4.19 |
| **UI / CSS Framework** | Tailwind CSS v3.4.17 + shadcn-ui (175+ componentes) |
| **Animaciones** | Framer Motion v12.23.24 + tailwindcss-animate v1.0.7 |
| **Gestión de Estado** | React Context API + TanStack React Query v5.83.0 |
| **Internacionalización**  | Sistema bilingüe nativo (Español PR/Inglés US) |
| **Accesibilidad**  | WCAG 2.1 AA / Section 508 / Ley 51 |
| **Compatibilidad de Navegadores** | Chrome (v90+), Edge (v90+), Firefox (v90+), Safari  |
| **Diseño responsivo** | Adaptado a pantallas de 8" a 27" (celular, tableta, laptop y desktop) optimizado para iOS y Android |

**4.2 Back End y Base de Datos**

| Parámetro | Descripción Técnica |
| ----- | :---: |
| **Infraestructura Cloud** | Supabase Enterprise Cloud |
| **Motor de Base de Datos** | PostgreSQL 15.x |
| **Lenguaje de servidor** | Deno Runtime (Edge Functions) |
| **Seguridad de datos** | Row Level Security (RLS) + JWT Tokens |
| **Cifrado de Conexión** | SSL/TLS 1.3 – HTTPS puerto 443 |
| **Copia de seguridad** | Respaldos automáticos diarios y replicación geográfica |
| **Monitoreo** | 24/7 – alertas automáticas en caso de falla |
| **Latencia promedio** | <50 ms desde Puerto Rico (Región US-East-1) |
| **Auditoría de Actividad** | Logs cifrados AES-256 con trazabilidad total de usuarios |
| **Cumplimiento Normativo** | PRITS v2023, OSI-DEPR, FERPA, SOC 2 Type II |

**4.3 Motor de Reconocimiento de Voz**

| Parámetro | Descripción Técnica |
| ----- | :---: |
| **Tecnología base** | OpenAI Realtime API + Web Speech API + Whisper |
| **Idiomas soportados** | Español (acento puertorriqueño) / Inglés (norteamericano) |
| **Precisión promedio** | ≥ 92 % (en validación interna K-5) |
| **Tiempo de procesamiento** | ≤ 1.8 s por fragmento de audio |
| **Análisis**  | Pronunciación, ritmo, entonación, fluidez |
| **Privacidad** | Procesamiento en tiempo real, sin almacenamiento de audio |
| **Reportes**  | Retroalimentación automática y plan de refuerzo personalizado |

**4.4 Motor de Evaluación y Analítica**

| Parámetro | Descripción Técnica |
| ----- | :---: |
| **Motor propietario** | FluenxIA Assessment Engine v2.0 |
| **Métricas Analizadas** | WCPM, pronunciación, fluidez, comprensión literal/inferencial |
| **Inteligencia Artificial** | OpenAI GPT-4O + Claude 3.5 Sonnet |
| **Tipos de Evaluaciones** | Diagnósticas, formativas, sumativas |
| **Integración con PowerSchool** | API + SSO (OAuth 2.0 / SAML 2.0) |
| **Exportación de Resultados** | PDF, Excel, CSV, JSON |
| **Análisis predictivo** | Detección de riesgo y aprendizaje adaptativo |

**4.5 Seguridad, Cumplimiento y Privacidad**

| Política / Norma | Implementación en FluenxIA  |
| ----- | :---: |
| **FERPA** | Protección de datos estudiantiles y acceso por rol |
| **COPPA** | Consentimiento paterno verificado y sin recopilación sensible |
| **PRITS 2023** | Controles mínimos de ciberseguridad cumplidos |
| **OSI-DEPR** | Interoperabilidad validada con sistemas institucionales |
| **WCAG 2.1 AA** | Accesibilidad universal verificada (NVDA/VoiceOver) |
| **Ley 51 (PR)** | Inclusión tecnológica para estudiantes con diversidad funcional |
| **SOC 2 Type II** | Infraestructura auditada anualmente |
| **ISO 27001:2022** | Marco de gestión de seguridad adoptado |
| **Ética en IA** | Cumple "White House AI Bill of Rights" (sin sesgos algorítmicos) |

**4.6 Desempeño y Escalabilidad**

| Parámetro | Descripción Técnica |
| ----- | :---: |
| **Capacidad total** | 165,000 usuarios concurrentes |
| **Usuarios Proyectados** | Hasta 200,000 (autoescalable) |
| **Disponibilidad** | 99.98 % |
| **Recuperación ante fallas** | < 60 minutos |
| **Ancho de banda** | 1 TB/mes – escalable ilimitado |
| **CDN**  | Cloudflare Edge Network (global) |
| **Rendimiento Promedio** | Carga < 2 s / 60 FPS en dispositivos móviles |

**4.7 Interoperabilidad y Accesibilidad**

1. **Integración nativa con PowerSchool** (SSO + API REST).
2. **Compatibilidad con Google Workspace (Docs, Meet, Drive)**.
3. **Validación de accesibilidad** mediante lectores NVDA y VoiceOver.
4. **Cumplimiento de la Ley 51** y estándares de educación inclusiva del DEPR.

**5. LICENCIAS DE SOFTWARE**

**5.1 Tipo de Licencia**

La plataforma **FluenxIA** opera bajo un modelo de **licenciamiento institucional tipo SaaS (Software as a Service)**, conforme a la **Ley 73-2019 de Gobierno Electrónico de Puerto Rico** y a las normas de contratación del **Departamento de Educación de Puerto Rico (DEPR)**.

**7.4 Escalabilidad Técnica**

| Indicador | Capacidad actual | Capacidad proyectada / máxima |
| ----- | ----- | :---: |
| **Usuarios registrados** | 200,000 | 300,000 concurrentes |
| **Sesiones simultáneas** | 90,000 | 300,000 (autoescalable) |
| **Almacenamiento base** | 2 TB | Escalable hasta 10 TB |
| **Procesamiento por minuto** | 25,000 solicitudes concurrentes | Escalable 5× mediante balanceador automático |
| **Ancho de banda mensual** | 1 TB | Ilimitado mediante CDN global (Cloudflare Edge) |

El sistema utiliza infraestructura **Supabase Enterprise Cloud** con replicación multirregión (US-East-1 y US-West-2), **back-up node automático** para contingencias.

---

**8. VALIDACIÓN VS. REQUISITOS DEL DEPR**

| # | Requisito del RFP | Cumplimiento FluenxIA | Evidencia en la Propuesta | Evidencia en Demo / Operación |
| :---: | :---: | :---: | ----- | ----- |
| 1 | Plataforma educativa **funcional** (muestra activa) | Cumple | **3. Componentes del Sistema**; **9. Contacto y Soporte** | URL demo + credenciales multirol; flujo de login y uso real |
| 2 | Acceso **multirrol** (estudiante, maestro, director, ORE/Nivel Central, padres) | Cumple | **3.6 Autenticación y SSO**; **3.7 Paneles**; **3.8 Portal familiar** | Perfiles diferenciados, menús por rol, permisos y vistas |
| 3 | Interfaz **bilingüe** (Español/Inglés) | Cumple | **3.1 Interfaz Web**; **4.1 Front End** | Selector de idioma, UI completa en ambos idiomas |
| 4 | **Lectura asistida por voz** (reconocimiento y retroalimentación) | Cumple | **3.3 Motor de Voz**; **4.3 Voz** | Captura de audio, análisis y feedback inmediato |
| 5 | **Evaluaciones** diagnósticas, formativas y sumativas | Cumple | **3.4 Motor de Evaluación**; **4.4 Evaluación y Analítica** | Banco de pruebas, aplicación y resultados por estudiante |
| 6 | Métricas lectoras: **WCPM, precisión, comprensión** | Cumple | **3.4**; **3.7 Paneles** | Paneles con WCPM, aciertos/errores y comprensión |
| 7 | **Reportes** individuales, grupales, escolares y regionales | Cumple | **3.7 Paneles**; **4.4 Exportaciones** | Exportación a PDF/Excel/CSV/JSON; filtros por Región |
| 8 | **Accesibilidad** WCAG 2.1 AA / Ley 51 / §508 | Cumple | **3.10 Accesibilidad**; **4.1/4.5** | Lectores de pantalla, alto contraste, teclado |
| 9 | **Privacidad** y seguridad: FERPA/COPPA/PRITS/OSI | Cumple | **6. Certificaciones y Cumplimiento**; **4.5 Seguridad** | Cifrado, control por roles, políticas y bitácoras |
| 10 | **Interoperabilidad** con sistemas DEPR (PowerSchool/SSO) | Cumple | **3.6 Autenticación y SSO**; **4.4 Integración** | Login con credenciales institucionales; API/SSO |
| 11 | **Alta disponibilidad** (≥99.9%) y continuidad | 99.98% | **7. SLA** | Monitoreo 24/7; replicación multi-región |
| 12 | **Rendimiento** (<2 s promedio por pantalla) | Cumple | **7.1 SLA**; **4.6 Desempeño** | Medición en tiempo real y reportes mensuales |
| 13 | **Escalabilidad** (crecimiento de usuarios y datos) | Cumple | **7.4 Escalabilidad**; **4.6** | Auto-escalado; capacidad hasta 200k usuarios |
| 14 | **Soporte técnico** con tiempos de respuesta/ resolución | Cumple | **7.2 Soporte** | Niveles N1–N4, SLA y cierre con ticket |
| 15 | **Mantenimiento** preventivo y correctivo | Cumple | **7.3 Mantenimiento** | Calendario mensual + bitácora electrónica |
| 16 | **Penalidades / créditos** por incumplimiento de SLA | Cumple | **7.6 Penalidades** | Créditos automáticos + IAC sin costo al DEPR |
| 17 | **Licenciamiento** claro (SaaS, duración, renovación) | Cumple | **5. Licencias** | Términos de uso, continuidad educativa |
| 18 | **No vendor lock-in** y exportación de datos | Cumple | **5.3 Derechos y PI** | Exportación CSV/JSON/Excel cuando el DEPR lo requiera |
| 19 | **Certificaciones** (RUL, SAM, Ética, Hacienda) | Cumple | **6.1 Certificaciones** | Anexos 6-A a 6-F firmados |
| 20 | **Manual / Guía del Usuario** y capacitación | Cumple | Portada + **Guía del Usuario – Plataforma FluenxIA** | Acceso a manuales y adiestramientos (virtual/presencial) |

La plataforma **FluenxIA** **cumple el 100%** de los requisitos; además, **exceden** los mínimos en disponibilidad (99.98%), analítica (IA predictiva) y accesibilidad (validación con NVDA/VoiceOver).

**11.3 Acceso a la Demostración Funcional**

**Acceso demo:**

1. **URL:** [https://www.fluenxialearn.com/](https://www.fluenxialearn.com/)

2. **Duración:** 20 días naturales a partir de la fecha de entrega de la propuesta

3. **Credenciales:**

   **Cuentas de Estudiantes / Student Accounts**
   * *Usuario Kindergarten:* kindergarten@demo.com / demo123
   * *Usuario estudiante grado 1:* student1@demo.com / demo123
   * *Usuario estudiante grado 2:* student2@demo.com / demo123
   * *Usuario estudiante grado 3:* student3@demo.com / demo123
   * *Usuario estudiante grado 4:* student4@demo.com / demo123
   * *Usuario estudiante grado 5:* student5@demo.com / demo123

   **Cuentas de Maestros / Teacher Accounts**
   * *Usuario maestro:* teacher@demo.com / demo123

   **Cuenta Familiar / Family Account**
   * *Usuario familia:* family@demo.com / demo123

   **Cuentas Administrativas / Administrative Accounts**
   * *Director de escuela:* school-director@demo.com / demo123
   * *Director regional:* regional-director@demo.com / demo123
   * *Ejecutivo DEPR:* depr-executive@demo.com / demo123

Durante el periodo de evaluación, **FluenxIA** mantendrá un canal directo de **asistencia técnica** (support@fluenxia.edu) para atender cualquier consulta o incidencia relacionada con la demostración.