/**
 * Base de Datos & Single Source of Truth de Progreso
 * Del chat al Agente: Go — Esp. Maria Esther Espinoza
 * Repositorio: https://github.com/meej76ster-beep/sociodigitalplus
 */

class DatabaseManager {
  constructor() {
    this.storageKeyPrefix = "del_chat_al_agente_db_";
    this.legacyPrefix = "socio_digital_db_";
  }

  getStorageKey(userId) {
    return `${this.storageKeyPrefix}${userId}`;
  }

  /**
   * Carga el progreso completo del usuario desde DB o LocalStorage fallback
   */
  async getProgress(userId) {
    if (!userId) return this.getDefaultProgress(userId);

    const key = this.getStorageKey(userId);
    let localData = localStorage.getItem(key);

    // Fallback para migración de datos legacy
    if (!localData) {
      localData = localStorage.getItem(`${this.legacyPrefix}${userId}`);
    }

    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        return this.validateAndEnforceUnlockRules(parsed);
      } catch (e) {
        console.error("Error al parsear progreso local:", e);
      }
    }

    // Progreso inicial si no existe
    const newProgress = this.getDefaultProgress(userId);
    await this.saveProgress(userId, newProgress);
    return newProgress;
  }

  getDefaultProgress(userId) {
    return {
      userId: userId || "guest",
      currentLevel: "level-1",
      totalProgress: 0,
      xp: 0,
      streak: 1,
      lastStreakDate: new Date().toISOString().split("T")[0],
      unlockedLevels: ["level-1"],
      lessonProgress: {}, // { 'l1-m1': { completed: true, completedAt: '...' } }
      assessmentAttempts: {}, // { 'level-1': [{ score: 85, passed: true, completedAt: '...' }] }
      premiumStatus: false,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Regla de Negocio Severa: Valida si los niveles desbloqueados cumplen con el criterio >= 80%
   */
  validateAndEnforceUnlockRules(progress) {
    if (!progress.unlockedLevels) progress.unlockedLevels = ["level-1"];

    // Verificar si Nivel 1 fue aprobado con >= 80%
    const l1Attempts = progress.assessmentAttempts?.["level-1"] || [];
    const passedL1 = l1Attempts.some((att) => att.score >= 80 && att.passed);

    if (passedL1) {
      if (!progress.unlockedLevels.includes("level-2")) {
        progress.unlockedLevels.push("level-2");
      }
    } else {
      // Si no aprobó nivel 1 con >= 80%, nivel 2 NO puede estar desbloqueado
      progress.unlockedLevels = progress.unlockedLevels.filter((lvl) => lvl === "level-1");
      if (progress.currentLevel === "level-2") {
        progress.currentLevel = "level-1";
      }
    }

    // Niveles 3 y 4 requieren acceso Premium explícito
    if (!progress.premiumStatus) {
      progress.unlockedLevels = progress.unlockedLevels.filter((lvl) => lvl === "level-1" || lvl === "level-2");
    }

    return progress;
  }

  /**
   * Guarda y sincroniza el progreso del usuario
   */
  async saveProgress(userId, progressData) {
    if (!userId) return;

    progressData.updatedAt = new Date().toISOString();
    const validatedProgress = this.validateAndEnforceUnlockRules(progressData);

    // Calcular % total de avance
    validatedProgress.totalProgress = this.calculateTotalCompletionPercentage(validatedProgress);

    const key = this.getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(validatedProgress));

    // Sincronizar en segundo plano con Google Sheets / Drive / Webhooks
    if (window.gdriveManager) {
      window.gdriveManager.syncUserProgress(userId, validatedProgress);
    }

    return validatedProgress;
  }

  calculateTotalCompletionPercentage(progress) {
    // Total microlecciones Nivel 1 (5) + Nivel 2 (6) = 11 microlecciones + 2 evaluaciones = 13 items
    const totalItems = 13;
    let completedItems = 0;

    // Contar lecciones completadas
    const lessons = progress.lessonProgress || {};
    Object.values(lessons).forEach((l) => {
      if (l.completed) completedItems++;
    });

    // Contar evaluaciones aprobadas (>= 80%)
    if (progress.assessmentAttempts?.["level-1"]?.some((a) => a.score >= 80)) completedItems++;
    if (progress.assessmentAttempts?.["level-2"]?.some((a) => a.score >= 80)) completedItems++;

    return Math.min(100, Math.round((completedItems / totalItems) * 100));
  }

  /**
   * Registra microlección completada
   */
  async markLessonCompleted(userId, lessonId, xpEarned = 20) {
    const progress = await this.getProgress(userId);
    if (!progress.lessonProgress[lessonId]) {
      progress.lessonProgress[lessonId] = {
        completed: true,
        completedAt: new Date().toISOString()
      };
      progress.xp = (progress.xp || 0) + xpEarned;
      await this.saveProgress(userId, progress);
    }
    return progress;
  }

  /**
   * Registra intento de evaluación final de nivel
   */
  async recordAssessmentAttempt(userId, levelId, score) {
    const progress = await this.getProgress(userId);
    const passed = score >= (window.APP_CONFIG?.PASSING_SCORE_PERCENT || 80);

    if (!progress.assessmentAttempts[levelId]) {
      progress.assessmentAttempts[levelId] = [];
    }

    const attemptRecord = {
      score,
      passed,
      completedAt: new Date().toISOString()
    };

    progress.assessmentAttempts[levelId].push(attemptRecord);

    if (passed) {
      progress.xp = (progress.xp || 0) + (window.APP_CONFIG?.XP_PER_ASSESSMENT_PASS || 100);
      
      // Si aprobó Nivel 1, desbloquear Nivel 2
      if (levelId === "level-1" && !progress.unlockedLevels.includes("level-2")) {
        progress.unlockedLevels.push("level-2");
        progress.currentLevel = "level-2";
      }
    }

    await this.saveProgress(userId, progress);
    return { progress, passed, attemptRecord };
  }

  /**
   * Registra la inscripción al Webinar y le suma XP de bonificación
   */
  async saveWebinarRegistration(userId, webinarData) {
    const progress = await this.getProgress(userId);
    if (!progress.webinarRegistrations) {
      progress.webinarRegistrations = [];
    }
    progress.webinarRegistrations.push(webinarData);
    progress.xp = (progress.xp || 0) + 50; // Bonificación de +50 XP por inscribirse al webinar
    await this.saveProgress(userId, progress);
    return progress;
  }

  /**
   * Exporta toda la base de datos local en formato JSON compatible con data/db.json
   */
  exportDatabaseDump() {
    const dump = {
      meta: {
        appName: window.APP_CONFIG?.APP_NAME || "Del chat al Agente: Go",
        specialist: window.APP_CONFIG?.BRAND_NAME || "Esp. Maria Esther Espinoza",
        repository: window.APP_CONFIG?.GITHUB_REPO || "https://github.com/meej76ster-beep/sociodigitalplus",
        exportedAt: new Date().toISOString()
      },
      records: {}
    };

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(this.storageKeyPrefix) || key.startsWith("sociodigital_") || key.startsWith("del_chat_"))) {
        try {
          dump.records[key] = JSON.parse(localStorage.getItem(key));
        } catch {
          dump.records[key] = localStorage.getItem(key);
        }
      }
    }

    return dump;
  }
}

window.dbManager = new DatabaseManager();
