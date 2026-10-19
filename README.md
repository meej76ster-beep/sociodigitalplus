# DEL CHAT AL AGENTE: GO

> **Aprende a transformar simples conversaciones de chat en agentes inteligentes supervisados con IA.**  
> Aplicación web interactiva de microlearning, completamente responsiva (Mobile First), gamificada estilo Duolingo y preparada para producción.  
> **Directora & Especialista:** Esp. Maria Esther Espinoza  
> **Repositorio Oficial:** [https://github.com/meej76ster-beep/sociodigitalplus](https://github.com/meej76ster-beep/sociodigitalplus)  
> **Plataforma Web:** [https://e-formacion.vl-soluciones.com/](https://e-formacion.vl-soluciones.com/)

---

## 🎨 Identidad Visual y Sistema de Diseño

La interfaz utiliza una paleta de diseño moderna sobre una arquitectura *Dark Glassmorphic*:

- **Lime Green (Verde Principal):** `#76BC21` — Botones primarios, checks de avance, progreso completado.
- **Tech Cyan (Azul Tecnológico):** `#00AEEF` — Indicadores de nivel activo, resaltados e interacciones.
- **Electric Magenta (Magenta Acento):** `#E6007E` — Distintivos Premium, nivel bloqueado e hitos.
- **Warm Gold (Dorado Gamificación):** `#FFB81C` — Puntos XP, rachas (streaks) e insignias.
- **Dark Slate (Fondo Dark Mode):** `#0F172A` / `#1E293B` — Tarjetas traslúcidas con alto contraste WCAG.

---

## 🚀 Características Principales

1. **Mobile First & Ultra Responsiva:** Diseñada para una experiencia fluida en smartphones (320px - 430px), tablets (768px) y escritorios (1440px+).
2. **Autenticación Segura con Google OAuth 2.0:** Inicio de sesión con Google/Gmail y modo demo para testing inmediato.
3. **Ruta de Aprendizaje Gamificada:**
   - **Nivel 1 — Introductorio:** 🔓 Disponible (5 Microlecciones + Desafío + Evaluación Final).
   - **Nivel 2 — Básico:** 🔒 Desbloqueo estricto al aprobar Nivel 1 con **≥ 80%** (6 Microlecciones + Desafío + Evaluación Final).
   - **Nivel 3 — Intermedio:** 🔒 PREMIUM (Automatizaciones, RAG y Bases de Datos).
   - **Nivel 4 — Avanzado:** 🔒 PREMIUM (Ecosistemas Multi-Agente Autónomos).
4. **Arquitectura Pedagógica de 7 Pasos por Microlección:**
   `1. Activación` → `2. Aprende` → `3. Ejemplo` → `4. Interactúa` → `5. Comprueba` → `6. Aplica` → `7. Completa (+20 XP)`.
5. **Evaluaciones & Regla de Negocio ≥ 80%:**
   - Calificación automática de quizzes de nivel.
   - Si la nota es `< 80%`, el siguiente nivel permanece bloqueado y permite reintentos.
   - Validación y persistencia en Base de Datos (Single Source of Truth).
6. **Tutor Virtual IA (`🤖 AgenteEdu`):**
   - Botón flotante permanente en la esquina inferior derecha.
   - Respuestas contextuales y explicaciones paso a paso orientadas por la metodología de la Esp. Maria Esther Espinoza.
   - **Protección Anti-Trampas:** Si el alumno pregunta por respuestas directas del examen, el tutor se niega educadamente y ofrece una guía conceptual para razonarla.
7. **Base de Datos & Esquema Relacional:**
   - Esquema SQL normalizado en [`data/schema.sql`](file:///e:/mary/disco%20C/Epartnerclass/Socio%20digital%20plus/data/schema.sql) compatible con PostgreSQL / Supabase / SQLite3.
   - Semilla JSON estructurada en [`data/db.json`](file:///e:/mary/disco%20C/Epartnerclass/Socio%20digital%20plus/data/db.json).
   - Gestor de base de datos en [`js/db.js`](file:///e:/mary/disco%20C/Epartnerclass/Socio%20digital%20plus/js/db.js) con exportador de respaldo JSON.
8. **Landing & Registro para Webinar:**
   - Página [`webinar.html`](file:///e:/mary/disco%20C/Epartnerclass/Socio%20digital%20plus/webinar.html) con registro interactivo multi-paso, cuenta regresiva, preview en vivo de Pase Digital con QR y exportación a calendario `.ics`.

---

## 📁 Estructura del Proyecto

```
DEL CHAT AL AGENTE: GO/
├── index.html              # Aplicación Single Page (Auth, Dashboard, Path, Lesson, Quiz, Profile)
├── webinar.html            # Landing de Webinar Conjunto (Legal + Contable) con Maria Esther Espinoza
├── data/
│   ├── schema.sql          # Esquema relacional SQL completo (Users, Progress, Assessments, Webinar, Logs)
│   └── db.json             # Documento JSON de datos iniciales y metadatos del repositorio
├── css/
│   └── styles.css          # Sistema de diseño responsive con variables de color y glassmorphism
├── js/
│   ├── config.js           # Variables de entorno y configuración de Del chat al Agente: Go
│   ├── content.js          # Plan curricular (Lecciones, Quizzes, Textos, Insignias)
│   ├── auth.js             # Módulo de Autenticación Google OAuth 2.0 y sesión demo
│   ├── db.js               # Persistencia de datos (Single Source of Truth, XP, desboqueo ≥80%, dump JSON)
│   ├── gdrive.js           # Integración y sincronización con Google Drive / Sheets
│   ├── tutor.js            # Tutor IA flotante (AgenteEdu) con guardia pedagógica anti-trampas
│   ├── webinar.js          # Lógica interactiva del webinar, QR y generación de pase digital
│   └── app.js              # Controlador principal, enrutador y motor de gamificación
├── assets/
│   └── webinar_banner.jpg  # Banner generado para el webinar legal y contable
└── README.md               # Manual de instalación, configuración y arquitectura
```

---

## 💾 Configuración de la Base de Datos

El proyecto cuenta con un esquema de base de datos relacional y persistencia local:
- **Archivo SQL:** [`data/schema.sql`](file:///e:/mary/disco%20C/Epartnerclass/Socio%20digital%20plus/data/schema.sql)
- **Archivo de datos semilla:** [`data/db.json`](file:///e:/mary/disco%20C/Epartnerclass/Socio%20digital%20plus/data/db.json)
- Para exportar el estado actual de la base de datos desde la consola del navegador:
  ```javascript
  const backup = window.dbManager.exportDatabaseDump();
  console.log(JSON.stringify(backup, null, 2));
  ```
