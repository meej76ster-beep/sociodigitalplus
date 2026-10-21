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
   * Clave del registro de estudiantes en Base de Datos Local
   */
  getStudentsRegistryKey() {
    return "del_chat_students_list";
  }

  /**
   * Obtiene la lista completa de estudiantes registrados en la BD
   */
  getStudentsList() {
    const raw = localStorage.getItem(this.getStudentsRegistryKey());
    let list = [];
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch (e) {
        console.error("Error al parsear lista de estudiantes:", e);
      }
    }

    // Si está vacío, sembrar registro inicial de prueba profesional
    if (!list || list.length === 0) {
      const defaultStudent = {
        id: "student_demo_101",
        name: "Dr. Alejandro Silva",
        email: "alejandro@silva-abogados.com",
        country: "🇨🇴 Colombia",
        institution: "Silva & Asociados Abogados",
        specialty: "Firma Conjunta (Legal + Contable)",
        role: "Socio / Titular de Firma",
        photo: "https://ui-avatars.com/api/?name=Alejandro+Silva&background=00AEEF&color=fff",
        isPremium: false,
        webinarRegistered: false,
        webinarTicketId: null,
        createdAt: "2026-10-19T18:00:00Z",
        updatedAt: new Date().toISOString()
      };
      list = [defaultStudent];
      localStorage.setItem(this.getStudentsRegistryKey(), JSON.stringify(list));
    }

    return list;
  }

  /**
   * Registra o actualiza un estudiante en la base de datos
   */
  saveStudent(studentData) {
    if (!studentData || !studentData.name) return null;

    const list = this.getStudentsList();
    const id = studentData.id || `student_${Date.now()}`;
    const email = (studentData.email || "").trim().toLowerCase();

    const existingIndex = list.findIndex(
      (s) => s.id === id || (email && s.email.toLowerCase() === email)
    );

    const studentRecord = {
      id: id,
      name: studentData.name.trim(),
      email: email || "estudiante@mariaestherespinoza.com",
      country: studentData.country || "🇨🇴 Colombia",
      institution: studentData.institution?.trim() || "Firma Profesional",
      specialty: studentData.specialty || "Firma Conjunta (Legal + Contable)",
      role: studentData.role || "Socio / Titular de Firma",
      photo: studentData.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name.trim())}&background=00AEEF&color=fff`,
      isPremium: studentData.isPremium || false,
      webinarRegistered: studentData.webinarRegistered || false,
      webinarTicketId: studentData.webinarTicketId || null,
      createdAt: studentData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...studentRecord };
    } else {
      list.unshift(studentRecord);
    }

    localStorage.setItem(this.getStudentsRegistryKey(), JSON.stringify(list));

    // Asegurar que exista su registro de progreso en BD
    this.getProgress(studentRecord.id);

    return studentRecord;
  }

  /**
   * Busca un estudiante por ID o Email
   */
  getStudent(idOrEmail) {
    if (!idOrEmail) return null;
    const list = this.getStudentsList();
    const query = idOrEmail.toLowerCase();
    return list.find((s) => s.id === idOrEmail || s.email.toLowerCase() === query) || null;
  }

  /**
   * Actualiza los datos de perfil de un estudiante
   */
  updateStudentProfile(userId, updatedFields) {
    const list = this.getStudentsList();
    const idx = list.findIndex((s) => s.id === userId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updatedFields, updatedAt: new Date().toISOString() };
      if (updatedFields.name) {
        list[idx].photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedFields.name.trim())}&background=00AEEF&color=fff`;
      }
      localStorage.setItem(this.getStudentsRegistryKey(), JSON.stringify(list));
      return list[idx];
    }
    return null;
  }

  /**
   * Registra la inscripción al Webinar y le suma XP de bonificación,
   * unificando los datos con la base de datos de estudiantes y webinar
   */
  async saveWebinarRegistration(userId, webinarData) {
    const progress = await this.getProgress(userId);
    if (!progress.webinarRegistrations) {
      progress.webinarRegistrations = [];
    }

    const alreadyRegistered = progress.webinarRegistrations.some(
      (r) => r.ticketId === webinarData.ticketId || r.email === webinarData.email
    );

    if (!alreadyRegistered) {
      progress.webinarRegistrations.push(webinarData);
      progress.xp = (progress.xp || 0) + 50; // Bonificación de +50 XP
    }

    progress.isWebinarRegistered = true;
    progress.webinarTicketId = webinarData.ticketId;
    await this.saveProgress(userId, progress);

    // Guardar también en la clave global que lee webinar.html
    localStorage.setItem("sociodigital_firmas_webinar_registration", JSON.stringify(webinarData));

    // Actualizar registro en lista de estudiantes
    if (userId) {
      this.updateStudentProfile(userId, {
        webinarRegistered: true,
        webinarTicketId: webinarData.ticketId
      });
    }

    return progress;
  }

  /**
   * Obtiene la inscripción al webinar del usuario si existe
   */
  async getWebinarRegistration(userId) {
    if (userId) {
      const progress = await this.getProgress(userId);
      if (progress.webinarRegistrations && progress.webinarRegistrations.length > 0) {
        return progress.webinarRegistrations[progress.webinarRegistrations.length - 1];
      }
    }

    const globalSaved = localStorage.getItem("sociodigital_firmas_webinar_registration");
    if (globalSaved) {
      try {
        return JSON.parse(globalSaved);
      } catch (e) {
        console.error("Error parseando registro global de webinar:", e);
      }
    }

    return null;
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
      students: this.getStudentsList(),
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
