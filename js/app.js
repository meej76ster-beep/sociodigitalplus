/**
 * Controlador Principal de la Aplicación (App Router & Gamification Engine)
 * Esp. Maria Esther Espinoza — Del chat al Agente: Go
 */

class AppController {
  constructor() {
    this.currentView = "dashboard"; // 'auth' | 'dashboard' | 'path' | 'lesson' | 'assessment' | 'profile' | 'achievements'
    this.activeLesson = null;
    this.activeStepIndex = 0;
    this.activeAssessment = null;
    this.userProgress = null;
    this.init();
  }

  async init() {
    // Escuchar cambios de autenticación
    window.authManager.onAuthChange(async (user) => {
      if (user) {
        this.userProgress = await window.dbManager.getProgress(user.id);
        this.renderHeaderUser();
        this.navigate("dashboard");
      } else {
        this.userProgress = null;
        this.navigate("auth");
      }
    });

    // Cargar sesión inicial
    const user = window.authManager.getUser();
    if (user) {
      this.userProgress = await window.dbManager.getProgress(user.id);
      this.renderHeaderUser();
      this.navigate("dashboard");
    } else {
      this.navigate("auth");
    }

    this.bindEvents();
    this.initGoogleOAuthSDK();
  }

  initGoogleOAuthSDK() {
    setTimeout(() => {
      if (window.authManager) window.authManager.initGoogleAuth();
    }, 500);
  }

  bindEvents() {
    // Navegación Inferior Móvil
    document.querySelectorAll("[data-nav-target]").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const target = item.getAttribute("data-nav-target");
        this.navigate(target);
      });
    });

    // Botón flotante Tutor IA
    const tutorToggleBtn = document.getElementById("tutor-toggle-btn");
    if (tutorToggleBtn) {
      tutorToggleBtn.addEventListener("click", () => {
        window.aiTutorManager.toggleWidget();
      });
    }

    const tutorCloseBtn = document.getElementById("tutor-close-btn");
    if (tutorCloseBtn) {
      tutorCloseBtn.addEventListener("click", () => {
        window.aiTutorManager.toggleWidget();
      });
    }

    const tutorSendBtn = document.getElementById("tutor-send-btn");
    const tutorInput = document.getElementById("tutor-input");
    if (tutorSendBtn && tutorInput) {
      const sendHandler = () => {
        const text = tutorInput.value;
        if (text) {
          window.aiTutorManager.sendMessage(text);
          tutorInput.value = "";
        }
      };
      tutorSendBtn.addEventListener("click", sendHandler);
      tutorInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendHandler();
      });
    }

    // Modal Premium Close
    const closePremiumBtn = document.getElementById("close-premium-modal");
    if (closePremiumBtn) {
      closePremiumBtn.addEventListener("click", () => {
        this.togglePremiumModal(false);
      });
    }

    // Pestañas de Autenticación / Registro de Estudiantes
    const tabRegister = document.getElementById("auth-tab-register");
    const tabLogin = document.getElementById("auth-tab-login");
    const formRegister = document.getElementById("student-register-form");
    const containerLogin = document.getElementById("student-login-container");

    if (tabRegister && tabLogin && formRegister && containerLogin) {
      tabRegister.addEventListener("click", () => {
        tabRegister.className = "flex-1 py-2 rounded-lg bg-brand-cyan text-slate-950 font-black transition-all";
        tabLogin.className = "flex-1 py-2 rounded-lg text-slate-400 hover:text-white transition-all";
        formRegister.classList.remove("hidden");
        containerLogin.classList.add("hidden");
      });

      tabLogin.addEventListener("click", () => {
        tabLogin.className = "flex-1 py-2 rounded-lg bg-brand-cyan text-slate-950 font-black transition-all";
        tabRegister.className = "flex-1 py-2 rounded-lg text-slate-400 hover:text-white transition-all";
        formRegister.classList.add("hidden");
        containerLogin.classList.remove("hidden");
        this.renderRegisteredStudentsList();
      });
    }

    // Acceso Rápido de Prueba
    const quickDemoBtn = document.getElementById("quick-demo-btn");
    if (quickDemoBtn) {
      quickDemoBtn.addEventListener("click", () => {
        window.authManager.loginAsDemoUser();
      });
    }

    // Botones del Modal de Pase Digital
    const modalDownloadIcs = document.getElementById("modal-btn-download-ics");
    if (modalDownloadIcs) {
      modalDownloadIcs.addEventListener("click", () => this.downloadModalIcs());
    }

    const modalShareWa = document.getElementById("modal-btn-share-whatsapp");
    if (modalShareWa) {
      modalShareWa.addEventListener("click", () => this.shareModalWhatsApp());
    }
  }

  navigate(viewName, params = {}) {
    this.currentView = viewName;

    // Ocultar todas las pantallas
    document.querySelectorAll(".view-screen").forEach((screen) => {
      screen.classList.add("hidden");
    });

    // Actualizar estado activo en la barra de navegación inferior
    document.querySelectorAll(".nav-item").forEach((item) => {
      if (item.getAttribute("data-nav-target") === viewName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Mostrar pantalla destino
    const targetScreen = document.getElementById(`view-${viewName}`);
    if (targetScreen) {
      targetScreen.classList.remove("hidden");
      targetScreen.classList.add("animate-fade-in");
    }

    // Ocultar o mostrar barra de navegación según la pantalla
    const bottomNav = document.getElementById("mobile-bottom-nav");
    if (bottomNav) {
      if (viewName === "auth" || viewName === "lesson" || viewName === "assessment") {
        bottomNav.classList.add("hidden");
      } else {
        bottomNav.classList.remove("hidden");
      }
    }

    // Renderizar la vista correspondiente
    switch (viewName) {
      case "dashboard":
        this.renderDashboard();
        break;
      case "path":
        this.renderLearningPath();
        break;
      case "lesson":
        this.renderLessonView(params.lessonId);
        break;
      case "assessment":
        this.renderAssessmentView(params.levelId);
        break;
      case "profile":
        this.renderProfile();
        break;
      case "achievements":
        this.renderAchievements();
        break;
    }

    window.scrollTo(0, 0);
  }

  renderHeaderUser() {
    const user = window.authManager.getUser();
    const headerUserEl = document.getElementById("header-user-info");
    if (headerUserEl && user) {
      headerUserEl.innerHTML = `
        <div class="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-full px-3 py-1 text-xs cursor-pointer hover:border-brand-green/60 transition-colors" onclick="appController.navigate('profile')">
          <img src="${user.photo}" class="w-6 h-6 rounded-full object-cover border border-brand-green" alt="${user.name}"/>
          <span class="font-semibold text-slate-200 truncate max-w-[120px]">${user.name}</span>
          <span class="bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1">
            ⚡ <span id="header-xp-val">${this.userProgress?.xp || 0}</span>
          </span>
        </div>
      `;
    }
  }

  /* --------------------------------------------------------------------------
     1. PANTALLA DE INICIO (DASHBOARD) — SECCIÓN 7 PROMPT
     -------------------------------------------------------------------------- */
  renderDashboard() {
    const user = window.authManager.getUser();
    if (!user || !this.userProgress) return;

    // Actualizar nombre y metadatos del estudiante registrado
    const welcomeEl = document.getElementById("dash-welcome-text");
    if (welcomeEl) {
      welcomeEl.innerHTML = `¡Hola, <strong>${user.name}</strong>! Continuemos construyendo tus agentes inteligentes.`;
    }

    const instBadge = document.getElementById("dash-student-institution-badge");
    if (instBadge) {
      instBadge.textContent = user.institution || "Firma Profesional";
    }

    const studentMeta = document.getElementById("dash-student-meta");
    if (studentMeta) {
      studentMeta.innerHTML = `<strong class="text-white">${user.role || "Socio"}</strong> • <span class="text-brand-cyan">${user.specialty || "Firma Conjunta"}</span> • <span class="text-slate-400">${user.country || "🇨🇴 Colombia"}</span>`;
    }

    // Renderizar la tarjeta del webinar unificada con el perfil del estudiante
    this.renderDashboardWebinarCard(user);

    // Calcular estadísticas
    const pct = this.userProgress.totalProgress || 0;
    const currentLevelId = this.userProgress.currentLevel || "level-1";
    const currentLevelObj = window.COURSE_CONTENT.levels.find((l) => l.id === currentLevelId) || window.COURSE_CONTENT.levels[0];

    // Lecciones completadas
    const completedLessonsCount = Object.keys(this.userProgress.lessonProgress || {}).length;
    
    // Evaluaciones aprobadas
    const l1Passed = this.userProgress.assessmentAttempts?.["level-1"]?.some((a) => a.score >= 80) || false;
    const l2Passed = this.userProgress.assessmentAttempts?.["level-2"]?.some((a) => a.score >= 80) || false;
    const passedAssessmentsCount = (l1Passed ? 1 : 0) + (l2Passed ? 1 : 0);

    // Próximo desafío
    let nextActionTitle = "Iniciar Nivel 1 — Introductorio";
    let nextActionTarget = () => this.navigate("path");

    if (completedLessonsCount < 5) {
      const nextLesson = currentLevelObj.lessons.find((l) => !this.userProgress.lessonProgress[l.id]);
      if (nextLesson) {
        nextActionTitle = `Continuar: ${nextLesson.title}`;
        nextActionTarget = () => this.navigate("lesson", { lessonId: nextLesson.id });
      }
    } else if (!l1Passed) {
      nextActionTitle = "Presentar Evaluación Nivel 1";
      nextActionTarget = () => this.navigate("assessment", { levelId: "level-1" });
    } else if (completedLessonsCount < 11) {
      const level2 = window.COURSE_CONTENT.levels.find((l) => l.id === "level-2");
      const nextLesson = level2.lessons.find((l) => !this.userProgress.lessonProgress[l.id]);
      if (nextLesson) {
        nextActionTitle = `Continuar Nivel 2: ${nextLesson.title}`;
        nextActionTarget = () => this.navigate("lesson", { lessonId: nextLesson.id });
      }
    } else if (!l2Passed) {
      nextActionTitle = "Presentar Evaluación Nivel 2";
      nextActionTarget = () => this.navigate("assessment", { levelId: "level-2" });
    } else {
      nextActionTitle = "¡Niveles Gratuitos Completados! Explora Premium";
      nextActionTarget = () => this.togglePremiumModal(true);
    }

    // Actualizar elementos DOM del Dashboard
    const progressPctEl = document.getElementById("dash-progress-pct");
    if (progressPctEl) progressPctEl.textContent = `${pct}%`;

    const progressBarFill = document.getElementById("dash-progress-fill");
    if (progressBarFill) progressBarFill.style.width = `${pct}%`;

    const curLevelEl = document.getElementById("dash-current-level");
    if (curLevelEl) curLevelEl.textContent = currentLevelObj.title;

    const lessonsCompEl = document.getElementById("dash-lessons-completed");
    if (lessonsCompEl) lessonsCompEl.textContent = `${completedLessonsCount} / 11`;

    const assessPassedEl = document.getElementById("dash-assessments-passed");
    if (assessPassedEl) assessPassedEl.textContent = `${passedAssessmentsCount} / 2`;

    const mainCtaBtn = document.getElementById("dash-continue-btn");
    if (mainCtaBtn) {
      mainCtaBtn.textContent = "CONTINUAR APRENDIENDO";
      mainCtaBtn.onclick = nextActionTarget;
    }
  }

  /* --------------------------------------------------------------------------
     2. MAPA / RUTA DE APRENDIZAJE — SECCIÓN 8 PROMPT
     -------------------------------------------------------------------------- */
  renderLearningPath() {
    const container = document.getElementById("path-levels-container");
    if (!container) return;

    const unlockedLevels = this.userProgress.unlockedLevels || ["level-1"];

    const html = window.COURSE_CONTENT.levels
      .map((level) => {
        const isUnlocked = unlockedLevels.includes(level.id);
        const isPremium = level.isPremium;

        // Determinar estado visual
        let statusBadge = "";
        let statusClass = "";

        if (isPremium) {
          statusBadge = `<span class="bg-brand-magenta/20 text-brand-magenta border border-brand-magenta/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">🔒 PREMIUM</span>`;
          statusClass = "border-brand-magenta/40 bg-slate-900/60 opacity-90";
        } else if (isUnlocked) {
          const lAttempts = this.userProgress.assessmentAttempts?.[level.id] || [];
          const isCompleted = lAttempts.some((a) => a.score >= 80);
          if (isCompleted) {
            statusBadge = `<span class="bg-brand-green/20 text-brand-green border border-brand-green/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">✓ COMPLETADO</span>`;
            statusClass = "border-brand-green/40 bg-slate-800/80";
          } else {
            statusBadge = `<span class="bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">🔓 DISPONIBLE</span>`;
            statusClass = "border-brand-cyan/40 bg-slate-800/90 shadow-lg shadow-brand-cyan/10";
          }
        } else {
          statusBadge = `<span class="bg-slate-700/50 text-slate-400 border border-slate-600/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">🔒 BLOQUEADO</span>`;
          statusClass = "border-slate-700 bg-slate-900/40 opacity-60";
        }

        // Renderizar lista de lecciones del nivel si está desbloqueado
        let lessonsHtml = "";
        if (isUnlocked && !isPremium && level.lessons.length > 0) {
          lessonsHtml = `
          <div class="mt-4 space-y-2 border-t border-slate-700/60 pt-3">
            ${level.lessons
              .map((les) => {
                const isLesDone = this.userProgress.lessonProgress?.[les.id]?.completed;
                return `
                <div onclick="appController.navigate('lesson', { lessonId: '${les.id}' })" 
                     class="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:border-brand-green/60 hover:bg-slate-700/70 cursor-pointer transition-all">
                  <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-full ${isLesDone ? "bg-brand-green text-white" : "bg-slate-700 text-slate-300"} flex items-center justify-center text-xs font-bold shrink-0">
                      ${isLesDone ? "✓" : les.number}
                    </div>
                    <div>
                      <div class="text-xs font-bold text-slate-200">${les.title}</div>
                      <div class="text-[10px] text-slate-400">⏱ ${les.duration} • +${les.xp} XP</div>
                    </div>
                  </div>
                  <span class="text-xs text-brand-green font-semibold">Iniciar →</span>
                </div>
              `;
              })
              .join("")}

            <!-- Botón Evaluación de Nivel -->
            <div onclick="appController.navigate('assessment', { levelId: '${level.id}' })" 
                 class="mt-3 p-3 rounded-xl bg-gradient-to-r from-brand-green/20 to-brand-cyan/20 border border-brand-green/50 hover:border-brand-green cursor-pointer flex items-center justify-between shadow-md">
              <div class="flex items-center gap-2.5">
                <span class="text-lg">🎯</span>
                <div>
                  <div class="text-xs font-extrabold text-white">EVALUACIÓN FINAL — ${level.title.toUpperCase()}</div>
                  <div class="text-[10px] text-slate-300">Puntuación requerida: ≥ 80% para aprobar</div>
                </div>
              </div>
              <span class="btn-primary text-xs !py-1.5 !px-3 !min-h-0">Presentar Examen</span>
            </div>
          </div>
        `;
        }

        return `
        <div class="glass-card ${statusClass} p-5 relative overflow-hidden mb-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xl">${level.number === 1 ? "🚀" : level.number === 2 ? "🏗️" : level.number === 3 ? "⚡" : "👑"}</span>
                <h3 class="text-base sm:text-lg font-bold text-white">${level.title}</h3>
              </div>
              <p class="text-xs text-slate-300 mb-2.5">${level.subtitle}</p>
              ${statusBadge}
            </div>
            
            ${
              isPremium
                ? `<button onclick="appController.togglePremiumModal(true)" class="btn-magenta text-xs !py-2 !px-4 !min-h-0 shrink-0">DESBLOQUEAR</button>`
                : ""
            }
          </div>

          ${lessonsHtml}
        </div>
      `;
      })
      .join("");

    container.innerHTML = html;
  }

  /* --------------------------------------------------------------------------
     3. ARQUITECTURA DE MICROLECCIÓN (7 PASOS) — SECCIÓN 13 PROMPT
     -------------------------------------------------------------------------- */
  renderLessonView(lessonId) {
    let lessonObj = null;
    let levelObj = null;

    for (const lvl of window.COURSE_CONTENT.levels) {
      const found = lvl.lessons.find((l) => l.id === lessonId);
      if (found) {
        lessonObj = found;
        levelObj = lvl;
        break;
      }
    }

    if (!lessonObj) {
      this.navigate("path");
      return;
    }

    this.activeLesson = lessonObj;
    this.activeStepIndex = 0;
    this.renderCurrentLessonStep();
    this.trackEvent("lesson_started", { lessonId });
  }

  renderCurrentLessonStep() {
    const container = document.getElementById("lesson-content-area");
    if (!container || !this.activeLesson) return;

    const stepsKeys = ["activation", "learn", "example", "interact", "check", "apply", "complete"];
    const currentStepKey = stepsKeys[this.activeStepIndex];
    const totalSteps = stepsKeys.length;

    // Actualizar barra de progreso superior de la lección
    const lessonProgressFill = document.getElementById("lesson-step-fill");
    if (lessonProgressFill) {
      const pct = Math.round(((this.activeStepIndex + 1) / totalSteps) * 100);
      lessonProgressFill.style.width = `${pct}%`;
    }

    const stepData = this.activeLesson.steps[currentStepKey];
    let stepContentHtml = "";

    switch (currentStepKey) {
      case "activation":
        stepContentHtml = `
          <div class="animate-fade-in space-y-4">
            <div class="inline-flex items-center gap-1.5 bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 px-3 py-1 rounded-full text-xs font-bold">
              1. ACTIVACIÓN DE SABERES
            </div>
            <h2 class="text-lg sm:text-xl font-bold text-white">${stepData.question || "Situación Inicial"}</h2>
            <div class="space-y-3 mt-4">
              ${stepData.options
                .map(
                  (opt) => `
                <div onclick="appController.handleActivationChoice(this, ${opt.isTarget}, '${encodeURIComponent(stepData.feedback)}')" 
                     class="option-card">
                  <div class="w-5 h-5 rounded-full border-2 border-slate-500 flex items-center justify-center shrink-0"></div>
                  <span class="text-xs sm:text-sm font-medium text-slate-200">${opt.text}</span>
                </div>
              `
                )
                .join("")}
            </div>
            <div id="step-feedback-box" class="hidden p-4 rounded-xl text-xs leading-relaxed font-medium"></div>
          </div>
        `;
        break;

      case "learn":
        stepContentHtml = `
          <div class="animate-fade-in space-y-4">
            <div class="inline-flex items-center gap-1.5 bg-brand-green/20 text-brand-green border border-brand-green/40 px-3 py-1 rounded-full text-xs font-bold">
              2. APRENDE EL CONCEPTO
            </div>
            <h2 class="text-lg sm:text-xl font-bold text-white">${stepData.heading}</h2>
            <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">${this.formatMarkdown(stepData.text || "")}</p>
            ${
              stepData.bullets
                ? `<ul class="space-y-2 mt-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 text-xs sm:text-sm text-slate-300">
                ${stepData.bullets.map((b) => `<li class="flex items-start gap-2"><span>🔹</span><span>${this.formatMarkdown(b)}</span></li>`).join("")}
              </ul>`
                : ""
            }
          </div>
        `;
        break;

      case "example":
        stepContentHtml = `
          <div class="animate-fade-in space-y-4">
            <div class="inline-flex items-center gap-1.5 bg-brand-magenta/20 text-brand-magenta border border-brand-magenta/40 px-3 py-1 rounded-full text-xs font-bold">
              3. EJEMPLO PRÁCTICO
            </div>
            <h2 class="text-lg sm:text-xl font-bold text-white">${stepData.title}</h2>
            <div class="p-4 rounded-xl bg-slate-800/90 border border-brand-magenta/30 text-xs sm:text-sm text-slate-200 space-y-2">
              <p class="leading-relaxed">${this.formatMarkdown(stepData.scenario || "")}</p>
              ${stepData.result ? `<div class="p-2.5 bg-brand-magenta/10 rounded-lg text-brand-magenta font-semibold mt-2">${stepData.result}</div>` : ""}
            </div>
          </div>
        `;
        break;

      case "interact":
        stepContentHtml = `
          <div class="animate-fade-in space-y-4">
            <div class="inline-flex items-center gap-1.5 bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-3 py-1 rounded-full text-xs font-bold">
              4. INTERACTÚA Y SELECCIONA
            </div>
            <h2 class="text-sm sm:text-base font-bold text-white">${stepData.prompt}</h2>
            <div class="space-y-2.5 mt-3">
              ${stepData.items
                .map(
                  (item, idx) => `
                <div onclick="appController.handleInteractSelect(this, ${item.correct})" 
                     class="option-card">
                  <div class="w-5 h-5 rounded border-2 border-slate-500 flex items-center justify-center text-xs shrink-0"></div>
                  <span class="text-xs sm:text-sm text-slate-200 font-medium">${item.text}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `;
        break;

      case "check":
        stepContentHtml = `
          <div class="animate-fade-in space-y-4">
            <div class="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold">
              5. COMPRUEBA TU COMPRENSIÓN
            </div>
            <h2 class="text-base sm:text-lg font-bold text-white">${stepData.question}</h2>
            <div class="space-y-3 mt-3">
              ${stepData.options
                .map(
                  (opt) => `
                <div onclick="appController.handleCheckAnswer(this, ${opt.correct}, '${encodeURIComponent(stepData.explanation || "")}')" 
                     class="option-card">
                  <span class="text-xs sm:text-sm text-slate-200 font-medium">${opt.text}</span>
                </div>
              `
                )
                .join("")}
            </div>
            <div id="check-feedback-box" class="hidden p-4 rounded-xl text-xs leading-relaxed font-medium"></div>
          </div>
        `;
        break;

      case "apply":
        stepContentHtml = `
          <div class="animate-fade-in space-y-4">
            <div class="inline-flex items-center gap-1.5 bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 px-3 py-1 rounded-full text-xs font-bold">
              6. APLICA A TU CASO
            </div>
            <h2 class="text-base sm:text-lg font-bold text-white">${stepData.challenge}</h2>
            <textarea id="apply-input-field" rows="3" placeholder="${stepData.placeholder || "Escribe aquí tu respuesta..."}" 
                      class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-100 focus:border-brand-green focus:outline-none"></textarea>
            ${stepData.hint ? `<p class="text-[11px] text-brand-gold flex items-center gap-1">💡 <span>${stepData.hint}</span></p>` : ""}
          </div>
        `;
        break;

      case "complete":
        stepContentHtml = `
          <div class="animate-bounce-pop text-center space-y-4 py-6">
            <div class="w-20 h-20 mx-auto rounded-full bg-brand-green/20 border-4 border-brand-green flex items-center justify-center text-4xl shadow-lg shadow-brand-green/30">
              🎉
            </div>
            <h2 class="text-2xl font-extrabold text-white">¡Microlección Completada!</h2>
            <div class="inline-flex items-center gap-2 bg-brand-gold/20 border border-brand-gold/50 text-brand-gold px-4 py-2 rounded-full font-extrabold text-lg">
              +${this.activeLesson.xp} XP
            </div>
            <p class="text-xs text-slate-300 max-w-xs mx-auto">Has avanzado exitosamente en tu ruta: Del chat al Agente: Go.</p>
          </div>
        `;
        // Marcar lección como completada en la Base de Datos
        if (this.userProgress && window.authManager.getUser()) {
          window.dbManager.markLessonCompleted(window.authManager.getUser().id, this.activeLesson.id, this.activeLesson.xp).then((updated) => {
            this.userProgress = updated;
            this.renderHeaderUser();
            this.trackEvent("lesson_completed", { lessonId: this.activeLesson.id });
          });
        }
        break;
    }

    // Renderizar botones de navegación de la lección
    const navButtonsHtml = `
      <div class="flex items-center justify-between border-t border-slate-700/80 pt-4 mt-6">
        ${
          this.activeStepIndex > 0
            ? `<button onclick="appController.prevLessonStep()" class="btn-secondary text-xs">← Anterior</button>`
            : `<div></div>`
        }
        ${
          this.activeStepIndex < totalSteps - 1
            ? `<button onclick="appController.nextLessonStep()" class="btn-primary text-xs">Siguiente →</button>`
            : `<button onclick="appController.navigate('path')" class="btn-primary text-xs">Volver a la Ruta 🚀</button>`
        }
      </div>
    `;

    container.innerHTML = stepContentHtml + navButtonsHtml;
  }

  handleActivationChoice(cardEl, isTarget, encodedFeedback) {
    const feedback = decodeURIComponent(encodedFeedback);
    const box = document.getElementById("step-feedback-box");
    if (!box) return;

    document.querySelectorAll(".option-card").forEach((c) => c.classList.remove("selected", "correct"));
    cardEl.classList.add("selected", "correct");

    box.className = "p-4 rounded-xl text-xs leading-relaxed font-medium bg-brand-green/20 border border-brand-green text-slate-100 mt-3 animate-fade-in";
    box.innerHTML = `✓ ${feedback}`;
    box.classList.remove("hidden");
  }

  handleInteractSelect(cardEl, isCorrect) {
    if (isCorrect) {
      cardEl.classList.add("correct");
    } else {
      cardEl.classList.add("incorrect");
    }
  }

  handleCheckAnswer(cardEl, isCorrect, encodedExp) {
    const exp = decodeURIComponent(encodedExp);
    const box = document.getElementById("check-feedback-box");
    if (!box) return;

    document.querySelectorAll(".option-card").forEach((c) => c.classList.remove("correct", "incorrect"));

    if (isCorrect) {
      cardEl.classList.add("correct");
      box.className = "p-4 rounded-xl text-xs leading-relaxed font-medium bg-brand-green/20 border border-brand-green text-brand-green mt-3 animate-fade-in";
      box.innerHTML = `<strong>✓ ¡Correcto!</strong><br/>${exp}`;
    } else {
      cardEl.classList.add("incorrect");
      box.className = "p-4 rounded-xl text-xs leading-relaxed font-medium bg-red-500/20 border border-red-500 text-red-200 mt-3 animate-fade-in";
      box.innerHTML = `<strong>Revisa este concepto.</strong><br/>${exp}`;
    }
    box.classList.remove("hidden");
  }

  nextLessonStep() {
    this.activeStepIndex++;
    this.renderCurrentLessonStep();
    window.scrollTo(0, 0);
  }

  prevLessonStep() {
    this.activeStepIndex--;
    this.renderCurrentLessonStep();
    window.scrollTo(0, 0);
  }

  /* --------------------------------------------------------------------------
     4. EVALUACIONES Y REGLA DE APROBACIÓN ≥ 80% — SECCIÓN 9 & 15 PROMPT
     -------------------------------------------------------------------------- */
  renderAssessmentView(levelId) {
    const levelObj = window.COURSE_CONTENT.levels.find((l) => l.id === levelId);
    if (!levelObj || !levelObj.assessment) {
      this.navigate("path");
      return;
    }

    this.activeAssessment = {
      levelId,
      title: levelObj.assessment.title,
      questions: levelObj.assessment.questions,
      userAnswers: {}
    };

    const container = document.getElementById("assessment-content-area");
    if (!container) return;

    const html = `
      <div class="animate-fade-in space-y-6">
        <div class="border-b border-slate-700/80 pb-4">
          <span class="bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
            EVALUACIÓN DE NIVEL
          </span>
          <h1 class="text-xl sm:text-2xl font-bold text-white mt-2">${levelObj.assessment.title}</h1>
          <p class="text-xs text-slate-300 mt-1">Mínimo para aprobar y desbloquear el siguiente nivel: <strong>80%</strong></p>
        </div>

        <div class="space-y-6">
          ${levelObj.assessment.questions
            .map(
              (q, qIdx) => `
            <div class="glass-card p-4 sm:p-5 space-y-3">
              <div class="text-xs font-bold text-brand-green">PREGUNTA ${qIdx + 1} DE ${levelObj.assessment.questions.length}</div>
              <h3 class="text-sm sm:text-base font-bold text-white">${q.question}</h3>
              
              <div class="space-y-2 mt-2">
                ${q.options
                  .map(
                    (opt) => `
                  <div onclick="appController.selectAssessmentOption('${q.id}', '${opt.id}', this)" 
                       class="option-card q-opt-${q.id}">
                    <div class="w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center text-[10px] shrink-0"></div>
                    <span class="text-xs sm:text-sm text-slate-200 font-medium">${opt.text}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="pt-4 flex items-center justify-between border-t border-slate-700/80">
          <button onclick="appController.navigate('path')" class="btn-secondary text-xs">Cancelar</button>
          <button onclick="appController.submitAssessment()" class="btn-primary text-xs">ENVIAR EVALUACIÓN 🎯</button>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.trackEvent("assessment_started", { levelId });
  }

  selectAssessmentOption(qId, optId, cardEl) {
    this.activeAssessment.userAnswers[qId] = optId;
    document.querySelectorAll(`.q-opt-${qId}`).forEach((c) => c.classList.remove("selected"));
    cardEl.classList.add("selected");
  }

  async submitAssessment() {
    if (!this.activeAssessment) return;

    const totalQ = this.activeAssessment.questions.length;
    const answeredCount = Object.keys(this.activeAssessment.userAnswers).length;

    if (answeredCount < totalQ) {
      alert(`Por favor responde todas las ${totalQ} preguntas antes de enviar la evaluación.`);
      return;
    }

    let correctCount = 0;
    this.activeAssessment.questions.forEach((q) => {
      const selectedId = this.activeAssessment.userAnswers[q.id];
      const correctOpt = q.options.find((o) => o.correct);
      if (correctOpt && selectedId === correctOpt.id) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / totalQ) * 100);
    const userId = window.authManager.getUser()?.id;

    // Registrar en DB con regla de validación backend
    const result = await window.dbManager.recordAssessmentAttempt(userId, this.activeAssessment.levelId, scorePercent);
    this.userProgress = result.progress;
    this.renderHeaderUser();

    this.renderAssessmentResultModal(scorePercent, result.passed);
    this.trackEvent("assessment_completed", { levelId: this.activeAssessment.levelId, score: scorePercent, passed: result.passed });
  }

  renderAssessmentResultModal(score, passed) {
    const modal = document.getElementById("result-modal");
    if (!modal) return;

    const iconEl = document.getElementById("result-modal-icon");
    const titleEl = document.getElementById("result-modal-title");
    const scoreEl = document.getElementById("result-modal-score");
    const descEl = document.getElementById("result-modal-desc");
    const actionBtn = document.getElementById("result-modal-btn");

    if (passed) {
      if (iconEl) iconEl.textContent = "🏆";
      if (titleEl) titleEl.textContent = "¡Nivel Aprobado!";
      if (scoreEl) scoreEl.textContent = `${score}%`;
      if (descEl) descEl.textContent = "¡Felicitaciones! Has obtenido 80% o más. El siguiente nivel se ha desbloqueado correctamente.";
      if (actionBtn) {
        actionBtn.textContent = "IR A LA RUTA Y CONTINUAR 🚀";
        actionBtn.onclick = () => {
          modal.classList.add("hidden");
          this.navigate("path");
        };
      }
    } else {
      if (iconEl) iconEl.textContent = "📚";
      if (titleEl) titleEl.textContent = "Nivel No Aprobado";
      if (scoreEl) scoreEl.textContent = `${score}%`;
      if (descEl) descEl.textContent = "No alcanzaste la puntuación mínima requerida de 80%. El siguiente nivel permanecerá bloqueado. Te sugerimos revisar las microlecciones y volver a intentarlo.";
      if (actionBtn) {
        actionBtn.textContent = "REVISAR CONTENIDOS Y REINTENTAR 🔁";
        actionBtn.onclick = () => {
          modal.classList.add("hidden");
          this.navigate("path");
        };
      }
    }

    modal.classList.remove("hidden");
  }

  /* --------------------------------------------------------------------------
     5. PANTALLA DE PERFIL ("Mi Progreso") — SECCIÓN 24 PROMPT
     -------------------------------------------------------------------------- */
  async renderProfile() {
    const user = window.authManager.getUser();
    if (!user || !this.userProgress) return;

    const container = document.getElementById("profile-content-area");
    if (!container) return;

    const l1Attempts = this.userProgress.assessmentAttempts?.["level-1"] || [];
    const l2Attempts = this.userProgress.assessmentAttempts?.["level-2"] || [];
    const webinarReg = await window.dbManager.getWebinarRegistration(user.id);

    const html = `
      <div class="animate-fade-in space-y-5">
        
        <!-- Ficha de Estudiante Registrado -->
        <div class="glass-card p-5 text-center flex flex-col items-center border-t-4 border-brand-cyan">
          <img src="${user.photo}" class="w-20 h-20 rounded-full border-4 border-brand-cyan shadow-lg shadow-brand-cyan/30 object-cover mb-2.5" alt="${user.name}"/>
          <span class="text-[10px] bg-brand-cyan/20 text-brand-cyan font-bold px-2.5 py-0.5 rounded-full border border-brand-cyan/30 uppercase tracking-wider mb-1">
            Estudiante Oficial Registrado
          </span>
          <h2 class="text-xl font-black text-white">${user.name}</h2>
          <p class="text-xs text-slate-300 font-semibold">${user.role || "Socio"} • ${user.institution || "Firma Profesional"}</p>
          <p class="text-[11px] text-slate-400 mb-3">${user.email} • ${user.country || "🇨🇴 Colombia"}</p>
          
          <div class="flex items-center gap-2 mb-3">
            <span class="bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-3 py-1 rounded-full text-xs font-extrabold">
              ⚡ ${this.userProgress.xp || 0} XP
            </span>
            <span class="bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 px-3 py-1 rounded-full text-xs font-extrabold">
              🔥 Racha: ${this.userProgress.streak || 1} días
            </span>
          </div>

          <button type="button" onclick="appController.openEditProfileModal()" class="btn-secondary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5">
            <span>✏️ Modificar Mis Datos de Registro</span>
          </button>
        </div>

        <!-- Tarjeta de Estado del Webinar -->
        <div class="glass-card p-5 border-l-4 ${webinarReg ? "border-brand-green" : "border-brand-gold"} space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>⚖️</span> Inscripción al Webinar para Firmas
            </h3>
            <span class="text-[10px] font-black px-2 py-0.5 rounded-full ${webinarReg ? "bg-brand-green/20 text-brand-green border border-brand-green/30" : "bg-brand-gold/20 text-brand-gold border border-brand-gold/30"}">
              ${webinarReg ? "✓ CONFIRMADO" : "PENDIENTE"}
            </span>
          </div>

          ${
            webinarReg
              ? `
            <div class="space-y-2 text-xs">
              <p class="text-slate-300">Tienes tu cupo oficial reservado para el <strong>Martes 17 de Noviembre (19:00 Hs)</strong>.</p>
              <div class="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <span class="text-slate-400">Pase Digital:</span>
                <strong class="text-brand-gold font-mono">${webinarReg.ticketId}</strong>
              </div>
              <div class="flex gap-2 pt-1">
                <button type="button" onclick="appController.openWebinarTicketModal()" class="flex-1 btn-cyan !py-2 text-xs font-bold">
                  Ver Pase y QR Oficial
                </button>
                <a href="webinar.html" class="flex-1 btn-primary !py-2 text-xs font-bold text-center">
                  Ir al Webinar →
                </a>
              </div>
            </div>
          `
              : `
            <div class="space-y-2 text-xs">
              <p class="text-slate-300">Aún no estás inscrito al Webinar con la Esp. Maria Esther Espinoza.</p>
              <button type="button" onclick="appController.registerToWebinarFromDashboard()" class="w-full btn-primary !py-2.5 text-xs font-bold">
                🎟️ Inscribirme Gratis con Mis Datos de Estudiante (+50 XP)
              </button>
            </div>
          `
          }
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="glass-card p-4 text-center">
            <div class="text-xs text-slate-400">Progreso Total</div>
            <div class="text-2xl font-extrabold text-brand-green mt-1">${this.userProgress.totalProgress || 0}%</div>
          </div>
          <div class="glass-card p-4 text-center">
            <div class="text-xs text-slate-400">Nivel Actual</div>
            <div class="text-sm font-extrabold text-brand-cyan mt-1 truncate">${this.userProgress.currentLevel === "level-1" ? "1 — Introductorio" : "2 — Básico"}</div>
          </div>
        </div>

        <!-- Historial de Evaluaciones -->
        <div class="glass-card p-5">
          <h3 class="text-sm font-bold text-white mb-3">Historial de Evaluaciones</h3>
          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <span class="font-semibold text-slate-300">Nivel 1 — Introductorio:</span>
              <span class="font-extrabold ${l1Attempts.some((a) => a.passed) ? "text-brand-green" : "text-slate-400"}">
                ${l1Attempts.length > 0 ? `${Math.max(...l1Attempts.map((a) => a.score))}% (${l1Attempts.some((a) => a.passed) ? "Aprobado" : "No Aprobado"})` : "Pendiente"}
              </span>
            </div>
            <div class="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <span class="font-semibold text-slate-300">Nivel 2 — Básico:</span>
              <span class="font-extrabold ${l2Attempts.some((a) => a.passed) ? "text-brand-green" : "text-slate-400"}">
                ${l2Attempts.length > 0 ? `${Math.max(...l2Attempts.map((a) => a.score))}% (${l2Attempts.some((a) => a.passed) ? "Aprobado" : "No Aprobado"})` : "Pendiente/Bloqueado"}
              </span>
            </div>
          </div>
        </div>

        <button onclick="authManager.logout()" class="w-full btn-secondary text-xs text-red-400 border-red-900/40 hover:bg-red-950/30">
          Cerrar Sesión / Cambiar Estudiante
        </button>
      </div>
    `;

    container.innerHTML = html;
  }

  /* --------------------------------------------------------------------------
     GESTIÓN DE REGISTRO DE ESTUDIANTES & UNIFICACIÓN WEBINAR
     -------------------------------------------------------------------------- */
  async handleStudentRegistration() {
    const name = document.getElementById("reg-student-name")?.value.trim();
    const email = document.getElementById("reg-student-email")?.value.trim();
    const country = document.getElementById("reg-student-country")?.value;
    const institution = document.getElementById("reg-student-institution")?.value.trim();
    const role = document.getElementById("reg-student-role")?.value;
    const specialty = document.getElementById("reg-student-specialty")?.value;
    const syncWebinar = document.getElementById("reg-student-sync-webinar")?.checked;

    if (!name || !email) {
      alert("Por favor completa al menos tu Nombre y Correo Electrónico.");
      return;
    }

    try {
      const student = await window.authManager.registerStudent({
        name,
        email,
        country,
        institution,
        role,
        specialty,
        registerWebinar: syncWebinar
      });

      this.triggerConfetti();
      if (syncWebinar) {
        alert(`¡Bienvenido ${student.name}! Tu registro como estudiante ha sido guardado en la base de datos y tus datos fueron unificados exitosamente con tu Pase Digital al Webinar (+50 XP).`);
      }
    } catch (err) {
      console.error("Error al registrar estudiante:", err);
      alert("Hubo un error al registrar el estudiante: " + err.message);
    }
  }

  renderRegisteredStudentsList() {
    const container = document.getElementById("registered-students-list");
    if (!container || !window.dbManager) return;

    const list = window.dbManager.getStudentsList();
    if (!list || list.length === 0) {
      container.innerHTML = `<p class="text-xs text-slate-500 py-2">No hay estudiantes guardados aún en este navegador.</p>`;
      return;
    }

    container.innerHTML = list
      .map(
        (s) => `
      <div class="flex items-center justify-between p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-brand-cyan/50 transition-all">
        <div class="flex items-center gap-2.5 min-w-0">
          <img src="${s.photo}" class="w-8 h-8 rounded-full border border-brand-cyan/60 object-cover shrink-0" alt="${s.name}"/>
          <div class="min-w-0">
            <h4 class="text-xs font-bold text-white truncate">${s.name}</h4>
            <p class="text-[10px] text-slate-400 truncate">${s.institution || "Firma"} • ${s.role || "Socio"}</p>
          </div>
        </div>
        <button type="button" onclick="appController.selectStudent('${s.id}')" class="btn-cyan !py-1 !px-3 text-[11px] font-bold shrink-0">
          Ingresar →
        </button>
      </div>
    `
      )
      .join("");
  }

  selectStudent(studentId) {
    if (window.authManager.loginAsStudent(studentId)) {
      this.navigate("dashboard");
    }
  }

  /* --------------------------------------------------------------------------
     TARJETA UNIFICADA DEL WEBINAR EN EL DASHBOARD
     -------------------------------------------------------------------------- */
  async renderDashboardWebinarCard(user) {
    const cardEl = document.getElementById("dash-webinar-card");
    if (!cardEl) return;

    const webinarReg = await window.dbManager.getWebinarRegistration(user.id);

    if (webinarReg && webinarReg.ticketId) {
      // ESTADO 1: YA INSCRITO AL WEBINAR
      cardEl.className = "glass-card p-5 border-2 border-brand-green/70 relative overflow-hidden space-y-4 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-emerald-950/30";
      cardEl.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-brand-green/20 border border-brand-green/50 flex items-center justify-center text-2xl shadow-lg shrink-0 text-brand-green">
              🎟️
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <span class="text-[10px] bg-brand-green text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ✓ INSCRIPCIÓN CONFIRMADA
                </span>
                <span class="text-[10px] text-brand-gold font-bold">Martes 17 de Noviembre • 19:00 Hs</span>
              </div>
              <h4 class="text-sm sm:text-base font-extrabold text-white leading-tight">
                Socio Digital para Firmas: Copiloto Legal y Contable con IA
              </h4>
            </div>
          </div>
        </div>

        <div class="p-3 bg-slate-900/90 rounded-xl border border-brand-green/40 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div>
            <span class="text-[10px] text-slate-400 block uppercase">Pase Digital Oficial Asignado:</span>
            <strong class="text-brand-gold font-mono text-xs sm:text-sm">${webinarReg.ticketId}</strong>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-400 block uppercase">Titular:</span>
            <strong class="text-white text-xs">${webinarReg.fullName || user.name}</strong>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button type="button" onclick="appController.openWebinarTicketModal()" class="btn-cyan !py-2.5 text-xs text-center flex items-center justify-center gap-1.5 font-bold">
            <span>🎟️ Ver Credencial Oficial y QR</span>
          </button>
          <a href="webinar.html" class="btn-primary !py-2.5 text-xs text-center flex items-center justify-center gap-1.5 font-bold">
            <span>🚀 Ir a la Sala del Webinar</span>
            <span>→</span>
          </a>
        </div>
      `;
    } else {
      // ESTADO 2: NO INSCRITO AÚN (CON DATOS LISTOS PARA 1-CLIC)
      cardEl.className = "glass-card p-5 border border-brand-cyan/50 relative overflow-hidden space-y-4";
      cardEl.innerHTML = `
        <div class="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-brand-cyan/20 blur-2xl"></div>
        
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-cyan via-brand-green to-brand-gold flex items-center justify-center text-2xl shadow-lg shrink-0">
              ⚖️
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <span class="live-badge">EN VIVO</span>
                <span class="text-[10px] text-brand-gold font-bold">Martes 17 de Noviembre • 19:00 Hs (Colombia)</span>
              </div>
              <h4 class="text-sm sm:text-base font-extrabold text-white leading-tight">
                Socio Digital para Firmas: Copiloto Legal y Contable con IA
              </h4>
            </div>
          </div>
        </div>

        <p class="text-xs text-slate-300 leading-relaxed">
          Cómo automatizar la carga documental y operativa de tu despacho o consultora con agentes inteligentes supervisados. Con la <strong>Esp. Maria Esther Espinoza</strong>.
        </p>

        <div class="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between flex-wrap gap-2">
          <span>Tus datos de estudiante ya están listos: <strong class="text-white">${user.name}</strong> (${user.institution || "Firma"})</span>
          <span class="text-brand-gold font-bold">+50 XP al inscribirte</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button type="button" onclick="document.getElementById('webinar-info-modal').classList.remove('hidden')" class="btn-secondary !py-2.5 text-xs text-center flex items-center justify-center gap-1.5">
            <span>ℹ️ Ver Información</span>
          </button>
          <button type="button" onclick="appController.registerToWebinarFromDashboard()" class="btn-primary !py-2.5 text-xs text-center flex items-center justify-center gap-1.5 font-bold shadow-lg shadow-brand-green/20">
            <span>🎟️ Inscribirme en 1 Clic (+50 XP)</span>
            <span>→</span>
          </button>
        </div>
      `;
    }
  }

  async registerToWebinarFromDashboard() {
    const user = window.authManager.getUser();
    if (!user) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const webinarData = {
      ticketId: `SD-FIRMAS-2026-${randomNum}`,
      fullName: user.name,
      email: user.email,
      country: user.country || "🇨🇴 Colombia",
      institution: user.institution || "Firma Profesional",
      specialty: user.specialty || "Firma Conjunta (Legal + Contable)",
      teacherRole: user.role || "Socio / Titular de Firma",
      registeredAt: new Date().toISOString()
    };

    await window.dbManager.saveWebinarRegistration(user.id, webinarData);
    this.userProgress = await window.dbManager.getProgress(user.id);
    this.renderHeaderUser();
    this.renderDashboardWebinarCard(user);
    this.triggerConfetti();
    this.openWebinarTicketModal(webinarData);
  }

  /* --------------------------------------------------------------------------
     MODALES: EDICIÓN DE PERFIL Y PASE DIGITAL
     -------------------------------------------------------------------------- */
  openEditProfileModal() {
    const user = window.authManager.getUser();
    if (!user) return;

    const nameInput = document.getElementById("edit-student-name");
    const emailInput = document.getElementById("edit-student-email");
    const countrySelect = document.getElementById("edit-student-country");
    const instInput = document.getElementById("edit-student-institution");
    const roleSelect = document.getElementById("edit-student-role");
    const specSelect = document.getElementById("edit-student-specialty");

    if (nameInput) nameInput.value = user.name || "";
    if (emailInput) emailInput.value = user.email || "";
    if (countrySelect && user.country) countrySelect.value = user.country;
    if (instInput) instInput.value = user.institution || "";
    if (roleSelect && user.role) roleSelect.value = user.role;
    if (specSelect && user.specialty) specSelect.value = user.specialty;

    document.getElementById("edit-profile-modal")?.classList.remove("hidden");
  }

  saveProfileEdit() {
    const name = document.getElementById("edit-student-name")?.value.trim();
    const email = document.getElementById("edit-student-email")?.value.trim();
    const country = document.getElementById("edit-student-country")?.value;
    const institution = document.getElementById("edit-student-institution")?.value.trim();
    const role = document.getElementById("edit-student-role")?.value;
    const specialty = document.getElementById("edit-student-specialty")?.value;

    if (!name || !email) {
      alert("El nombre y el correo son obligatorios.");
      return;
    }

    const updated = window.authManager.updateProfile({
      name,
      email,
      country,
      institution,
      role,
      specialty
    });

    document.getElementById("edit-profile-modal")?.classList.add("hidden");
    this.renderHeaderUser();
    this.renderDashboard();
    if (this.currentView === "profile") {
      this.renderProfile();
    }
  }

  async openWebinarTicketModal(providedTicket = null) {
    const user = window.authManager.getUser();
    const ticket = providedTicket || (user ? await window.dbManager.getWebinarRegistration(user.id) : null);
    if (!ticket) {
      alert("No se encontró información de pase digital aún.");
      return;
    }

    this.activeModalTicket = ticket;

    const idEl = document.getElementById("modal-ticket-id");
    const nameEl = document.getElementById("modal-ticket-name");
    const metaEl = document.getElementById("modal-ticket-meta");
    const emailEl = document.getElementById("modal-ticket-email");

    if (idEl) idEl.textContent = ticket.ticketId || "#SD-FIRMAS-2026";
    if (nameEl) nameEl.textContent = ticket.fullName || user?.name || "Estudiante";
    if (metaEl) metaEl.textContent = `${ticket.teacherRole || user?.role || "Socio"} • ${ticket.institution || user?.institution || "Firma"}`;
    if (emailEl) emailEl.textContent = ticket.email || user?.email || "";

    this.generateModalQR("modal-ticket-qr", (ticket.ticketId || "") + (ticket.fullName || ""));
    document.getElementById("webinar-ticket-modal")?.classList.remove("hidden");
  }

  generateModalQR(canvasId, seedText) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#0f172a";

    const grid = 15;
    const cellSize = size / grid;
    let seed = 0;
    for (let i = 0; i < seedText.length; i++) seed += seedText.charCodeAt(i);

    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        if ((r < 4 && c < 4) || (r < 4 && c >= grid - 4) || (r >= grid - 4 && c < 4)) {
          if ((r === 0 || r === 3 || c === 0 || c === 3) && !(r < 0 || c < 0 || r >= grid || c >= grid)) {
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          } else if (r >= 1 && r <= 2 && c >= 1 && c <= 2) {
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
        } else {
          const pseudo = Math.sin(seed + r * 17 + c * 31) * 10000;
          if (pseudo - Math.floor(pseudo) > 0.45) {
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  }

  downloadModalIcs() {
    const ticket = this.activeModalTicket || {};
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//VL Soluciones//Socio Digital para Firmas//ES
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
SUMMARY:Webinar: Socio Digital para Firmas - Copiloto Legal y Contable con IA
DESCRIPTION:Webinar Conjunto (Legal + Contable): Cómo automatizar la carga documental y operativa de tu despacho o consultora con agentes inteligentes supervisados.\\nEspecialista: Maria Esther Espinoza (Esp. en gestión de procesos con IA).\\nOrganiza: https://e-formacion.vl-soluciones.com/\\nContacto: epartnerclass@gmail.com\\nTu Pase Digital: ${ticket.ticketId || "SD-FIRMAS-2026"}
LOCATION:Online en Vivo - https://e-formacion.vl-soluciones.com/
DTSTART:20261118T000000Z
DTEND:20261118T013000Z
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT30M
ACTION:DISPLAY
DESCRIPTION:El Webinar "Socio Digital para Firmas: Copiloto Legal y Contable con IA" comienza en 30 minutos.
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `Webinar_Pase_${ticket.ticketId || "Oficial"}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  shareModalWhatsApp() {
    const ticket = this.activeModalTicket || {};
    const text = encodeURIComponent(
      `🚀 ¡Me inscribí al Webinar "Socio Digital para Firmas: Copiloto Legal y Contable con IA" con Maria Esther Espinoza!\n\n📅 Martes 17 de Noviembre - 19:00 Hs (Colombia)\n🎟️ Pase Digital Nº ${ticket.ticketId || ""}\nInscríbete gratis en: https://e-formacion.vl-soluciones.com/`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  }

  triggerConfetti() {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.inset = "0";
    container.style.pointerEvents = "none";
    container.style.zIndex = "999";
    document.body.appendChild(container);

    const colors = ["#76BC21", "#00AEEF", "#E6007E", "#FFB81C"];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("div");
      p.style.position = "absolute";
      p.style.left = Math.random() * 100 + "vw";
      p.style.top = "-10px";
      p.style.width = Math.random() * 8 + 6 + "px";
      p.style.height = Math.random() * 8 + 6 + "px";
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      p.style.opacity = Math.random().toString();
      p.style.transform = `rotate(${Math.random() * 360}deg)`;

      const duration = Math.random() * 2 + 1.5;
      p.style.transition = `all ${duration}s ease-out`;
      container.appendChild(p);

      setTimeout(() => {
        p.style.top = Math.random() * 80 + 20 + "vh";
        p.style.opacity = "0";
        p.style.transform = `translate(${Math.random() * 100 - 50}px, 100px) rotate(720deg)`;
      }, 50);
    }

    setTimeout(() => {
      if (document.body.contains(container)) document.body.removeChild(container);
    }, 4000);
  }

  /* --------------------------------------------------------------------------
     6. INSIGNIAS Y LOGROS
     -------------------------------------------------------------------------- */
  renderAchievements() {
    const container = document.getElementById("achievements-content-area");
    if (!container) return;

    const html = `
      <div class="animate-fade-in space-y-4">
        <h2 class="text-xl font-bold text-white mb-2">🏆 Mis Logros e Insignias</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${window.COURSE_CONTENT.badges
            .map(
              (b) => `
            <div class="glass-card p-4 flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-2xl shrink-0">
                ⭐
              </div>
              <div>
                <h4 class="text-sm font-bold text-white">${b.title}</h4>
                <p class="text-xs text-slate-400">${b.desc}</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  togglePremiumModal(show) {
    const modal = document.getElementById("premium-modal");
    if (modal) {
      if (show) {
        modal.classList.remove("hidden");
        this.trackEvent("premium_clicked");
      } else {
        modal.classList.add("hidden");
      }
    }
  }

  formatMarkdown(text) {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  }

  trackEvent(eventName, payload = {}) {
    console.log(`📊 [Analytics Event]: ${eventName}`, payload);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.appController = new AppController();
});
