/**
 * Módulo de Integración con Google Drive / Google Sheets
 * Registra y actualiza el seguimiento consolidado de participantes
 * Epartner Class — Socio Digital
 */

class GDriveManager {
  constructor() {
    this.sheetDocName = "Registro de avances — Socio Digital Primeros Pasos";
    this.webhookUrl = window.APP_CONFIG.GOOGLE_SHEETS_WEBHOOK;
    this.syncQueueKey = "socio_digital_gdrive_queue";
  }

  /**
   * Prepara el payload completo exigido en la especificación
   */
  buildUserProgressPayload(user, progress) {
    const l1Attempts = progress?.assessmentAttempts?.["level-1"] || [];
    const bestL1 = l1Attempts.reduce((max, a) => Math.max(max, a.score), 0);
    const l1Passed = l1Attempts.some((a) => a.passed && a.score >= 80);

    const l2Attempts = progress?.assessmentAttempts?.["level-2"] || [];
    const bestL2 = l2Attempts.reduce((max, a) => Math.max(max, a.score), 0);
    const l2Passed = l2Attempts.some((a) => a.passed && a.score >= 80);

    return {
      documentName: this.sheetDocName,
      folderId: window.APP_CONFIG.GOOGLE_DRIVE_FOLDER_ID,
      timestamp: new Date().toISOString(),
      record: {
        userId: user?.id || "unknown",
        nombre: user?.name || "Estudiante",
        email: user?.email || "desconocido@email.com",
        fechaRegistro: user?.createdAt || new Date().toISOString(),
        ultimoAcceso: new Date().toISOString(),
        nivelActual: progress?.currentLevel === "level-1" ? "1 — Introductorio" : progress?.currentLevel === "level-2" ? "2 — Básico" : "3 — Intermedio",
        progresoPercent: `${progress?.totalProgress || 0}%`,
        xp: progress?.xp || 0,
        nivel1Status: l1Passed ? "Aprobado" : l1Attempts.length > 0 ? "No Aprobado" : "En Curso",
        notaNivel1: l1Attempts.length > 0 ? `${bestL1}%` : "N/A",
        nivel2Status: l2Passed ? "Aprobado" : l2Attempts.length > 0 ? "No Aprobado" : progress?.unlockedLevels?.includes("level-2") ? "Disponible" : "Bloqueado",
        notaNivel2: l2Attempts.length > 0 ? `${bestL2}%` : "N/A",
        nivel3Status: "Bloqueado/Premium",
        nivel4Status: "Bloqueado/Premium",
        estado: progress?.totalProgress >= 100 ? "Completado" : "Activo"
      }
    };
  }

  /**
   * Envía la sincronización al backend / Google Webhook
   */
  async syncUserProgress(userId, progress) {
    const user = window.authManager?.getUser();
    if (!user) return;

    const payload = this.buildUserProgressPayload(user, progress);

    console.log("📤 [Google Drive Sync Payload]:", payload);

    if (this.webhookUrl && this.webhookUrl !== "https://script.google.com/macros/s/YOUR_EXEC_ID/exec") {
      try {
        await fetch(this.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "no-cors", // Requerido para Google Apps Script webhooks
          body: JSON.stringify(payload)
        });
        console.log("✅ Sincronización exitosa con Google Drive/Sheets");
      } catch (err) {
        console.warn("⚠️ Error en envío a Google Sheets. Encolando para reintento:", err);
        this.enqueueSync(payload);
      }
    } else {
      // Guardar registro local simulado de Drive para auditoría
      localStorage.setItem("socio_digital_gdrive_last_record", JSON.stringify(payload));
    }
  }

  enqueueSync(payload) {
    const queue = JSON.parse(localStorage.getItem(this.syncQueueKey) || "[]");
    queue.push(payload);
    localStorage.setItem(this.syncQueueKey, JSON.stringify(queue));
  }
}

window.gdriveManager = new GDriveManager();
