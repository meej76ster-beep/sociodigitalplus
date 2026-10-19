/**
 * Configuración Global — DEL CHAT AL AGENTE: GO
 * Esp. Maria Esther Espinoza
 * Repositorio: https://github.com/meej76ster-beep/sociodigitalplus
 */

window.APP_CONFIG = {
  APP_NAME: "DEL CHAT AL AGENTE: GO",
  APP_SUBTITLE: "De Prompts Aislados a Agentes Inteligentes — Esp. Maria Esther Espinoza",
  BRAND_NAME: "Esp. Maria Esther Espinoza",
  GITHUB_REPO: "https://github.com/meej76ster-beep/sociodigitalplus",
  PLATFORM_URL: "https://e-formacion.vl-soluciones.com/",
  
  // Variables de Entorno (Reemplazar en producción)
  GOOGLE_CLIENT_ID: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  GOOGLE_DRIVE_FOLDER_ID: "YOUR_GOOGLE_DRIVE_FOLDER_ID",
  GOOGLE_SHEETS_ID: "YOUR_GOOGLE_SHEETS_TRACKING_ID",
  GOOGLE_SHEETS_WEBHOOK: "https://script.google.com/macros/s/YOUR_EXEC_ID/exec", // URL del Apps Script o Webhook backend
  
  // Proveedor de IA para el Tutor Virtual (Gemini / OpenAI / OpenRouter API)
  AI_API_PROVIDER: "demo", // 'gemini' | 'openai' | 'openrouter' | 'demo'
  AI_API_KEY: "", // Configurar clave privada en variables de entorno de servidor
  AI_MODEL_NAME: "gemini-1.5-flash",
  
  // Base de Datos Single Source of Truth (Supabase / Firebase / REST / Local Schema)
  SUPABASE_URL: "https://YOUR_SUPABASE_PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
  
  // Configuración de Gamificación
  XP_PER_LESSON: 20,
  XP_PER_ASSESSMENT_PASS: 100,
  PASSING_SCORE_PERCENT: 80, // Mínimo 80% para aprobar nivel y desbloquear el siguiente
};
