/**
 * Gestor del Formulario de Inscripción Interactivo para el Webinar:
 * "Socio Digital para Firmas: Copiloto Legal y Contable con IA"
 * Especialista: Maria Esther Espinoza (Esp. en gestión de procesos con IA)
 * e-formacion.vl-soluciones.com
 */

class WebinarManager {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3; // Step 1: Perfil Firma, Step 2: Diagnóstico IA, Step 3: Pase Digital
    // Martes 17 de Noviembre, 19:00 Hs Colombia (GMT-5)
    this.webinarDate = new Date("2026-11-17T19:00:00-05:00");
    this.formData = {
      fullName: "",
      email: "",
      country: "🇨🇴 Colombia",
      institution: "",
      educationLevel: "Legal / Jurídico",
      teacherRole: "Socio / Titular de Firma",
      aiExperience: "🥈 Uso Ocasional",
      aiTools: ["Análisis de Contratos", "Automatización Contable", "OCR Masivo", "Confidencialidad"],
      topicsOfInterest: ["Automatización Documental", "Confidencialidad", "Agentes Supervisados"],
      speakerQuestion: "",
      ticketId: "",
      registeredAt: null
    };

    this.init();
  }

  init() {
    this.checkExistingRegistration();
    this.bindEvents();
    this.startCountdownTimer();
    this.updateLivePreview();
  }

  checkExistingRegistration() {
    const saved = localStorage.getItem("sociodigital_firmas_webinar_registration") || localStorage.getItem("sociodigital_webinar_registration");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.formData = { ...this.formData, ...parsed };
        this.isAlreadyRegistered = true;
      } catch (e) {
        console.error("Error cargando inscripción previa:", e);
      }
    }

    if (window.authManager) {
      const user = window.authManager.getUser();
      if (user && !this.formData.fullName) {
        this.formData.fullName = user.name || "";
        this.formData.email = user.email || "";
      }
    }
  }

  bindEvents() {
    // Inputs del Formulario Paso 1
    const nameInput = document.getElementById("webinar-name");
    const emailInput = document.getElementById("webinar-email");
    const countrySelect = document.getElementById("webinar-country");
    const institutionInput = document.getElementById("webinar-institution");
    const levelSelect = document.getElementById("webinar-level");
    const roleSelect = document.getElementById("webinar-role");

    if (nameInput) {
      if (this.formData.fullName) nameInput.value = this.formData.fullName;
      nameInput.addEventListener("input", (e) => {
        this.formData.fullName = e.target.value.trim();
        this.updateLivePreview();
      });
    }

    if (emailInput) {
      if (this.formData.email) emailInput.value = this.formData.email;
      emailInput.addEventListener("input", (e) => {
        this.formData.email = e.target.value.trim();
      });
    }

    if (countrySelect) {
      if (this.formData.country) countrySelect.value = this.formData.country;
      countrySelect.addEventListener("change", (e) => {
        this.formData.country = e.target.value;
      });
    }

    if (institutionInput) {
      if (this.formData.institution) institutionInput.value = this.formData.institution;
      institutionInput.addEventListener("input", (e) => {
        this.formData.institution = e.target.value.trim();
        this.updateLivePreview();
      });
    }

    if (levelSelect) {
      if (this.formData.educationLevel) levelSelect.value = this.formData.educationLevel;
      levelSelect.addEventListener("change", (e) => {
        this.formData.educationLevel = e.target.value;
      });
    }

    if (roleSelect) {
      if (this.formData.teacherRole) roleSelect.value = this.formData.teacherRole;
      roleSelect.addEventListener("change", (e) => {
        this.formData.teacherRole = e.target.value;
        this.updateLivePreview();
      });
    }

    // Chips de Herramientas IA (Paso 2)
    document.querySelectorAll(".ai-tool-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const tool = chip.getAttribute("data-tool");
        chip.classList.toggle("active");

        if (chip.classList.contains("active")) {
          if (!this.formData.aiTools.includes(tool)) {
            this.formData.aiTools.push(tool);
          }
        } else {
          this.formData.aiTools = this.formData.aiTools.filter((t) => t !== tool);
        }
      });
    });

    // Rating / Nivel de Experiencia IA
    document.querySelectorAll(".ai-exp-option").forEach((option) => {
      option.addEventListener("click", () => {
        document.querySelectorAll(".ai-exp-option").forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");
        this.formData.aiExperience = option.getAttribute("data-exp");
      });
    });

    // Pregunta a la especialista
    const questionInput = document.getElementById("webinar-question");
    if (questionInput) {
      if (this.formData.speakerQuestion) questionInput.value = this.formData.speakerQuestion;
      questionInput.addEventListener("input", (e) => {
        this.formData.speakerQuestion = e.target.value;
      });
    }

    // Botones de Navegación del Stepper
    const nextBtn1 = document.getElementById("webinar-next-1");
    if (nextBtn1) {
      nextBtn1.addEventListener("click", () => this.goToStep(2));
    }

    const prevBtn2 = document.getElementById("webinar-prev-2");
    if (prevBtn2) {
      prevBtn2.addEventListener("click", () => this.goToStep(1));
    }

    const submitBtn = document.getElementById("webinar-submit-btn");
    if (submitBtn) {
      submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.submitRegistration();
      });
    }

    // Acciones del Ticket Final (Paso 3 / Confirmación)
    const downloadCalBtn = document.getElementById("btn-download-ics");
    if (downloadCalBtn) {
      downloadCalBtn.addEventListener("click", () => this.downloadCalendarEvent());
    }

    const shareBtn = document.getElementById("btn-share-whatsapp");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => this.shareOnWhatsApp());
    }

    const resetRegBtn = document.getElementById("btn-edit-registration");
    if (resetRegBtn) {
      resetRegBtn.addEventListener("click", () => {
        this.isAlreadyRegistered = false;
        this.goToStep(1);
      });
    }
  }

  goToStep(step) {
    if (step === 2) {
      if (!this.formData.fullName) {
        alert("Por favor, ingresa tu Nombre y Apellido.");
        document.getElementById("webinar-name")?.focus();
        return;
      }
      if (!this.formData.email || !this.formData.email.includes("@")) {
        alert("Por favor, ingresa un correo electrónico corporativo válido.");
        document.getElementById("webinar-email")?.focus();
        return;
      }
    }

    this.currentStep = step;
    this.renderStepView();
  }

  renderStepView() {
    for (let i = 1; i <= 3; i++) {
      const stepEl = document.getElementById(`webinar-step-${i}`);
      const indicatorEl = document.getElementById(`stepper-indicator-${i}`);

      if (stepEl) {
        if (i === this.currentStep) {
          stepEl.classList.remove("hidden");
        } else {
          stepEl.classList.add("hidden");
        }
      }

      if (indicatorEl) {
        if (i < this.currentStep) {
          indicatorEl.className = "stepper-item completed";
        } else if (i === this.currentStep) {
          indicatorEl.className = "stepper-item active";
        } else {
          indicatorEl.className = "stepper-item";
        }
      }
    }

    const ticketView = document.getElementById("webinar-step-confirmation");
    if (ticketView) {
      if (this.currentStep === 4) {
        ticketView.classList.remove("hidden");
        document.getElementById("webinar-stepper-bar")?.classList.add("hidden");
      } else {
        ticketView.classList.add("hidden");
        document.getElementById("webinar-stepper-bar")?.classList.remove("hidden");
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  submitRegistration() {
    const consentInput = document.getElementById("webinar-consent");
    if (consentInput && !consentInput.checked) {
      alert("Debes aceptar la Política de Privacidad y Tratamiento de Datos para confirmar tu inscripción.");
      consentInput.focus();
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.formData.ticketId = `SD-FIRMAS-2026-${randomNum}`;
    this.formData.registeredAt = new Date().toISOString();

    localStorage.setItem("sociodigital_firmas_webinar_registration", JSON.stringify(this.formData));

    if (window.dbManager && window.authManager) {
      const user = window.authManager.getUser();
      if (user) {
        window.dbManager.saveWebinarRegistration(user.id, this.formData);
      }
    }

    this.currentStep = 4;
    this.renderStepView();
    this.renderTicketDetails();
    this.triggerConfetti();
  }

  updateLivePreview() {
    const namePreview = document.getElementById("ticket-preview-name");
    const instPreview = document.getElementById("ticket-preview-inst");
    const rolePreview = document.getElementById("ticket-preview-role");

    const nameVal = this.formData.fullName || "Tu Nombre Aquí";
    const instVal = this.formData.institution || "Nombre de tu Despacho o Firma";
    const roleVal = this.formData.teacherRole || "Socio / Abogado / Contador";

    if (namePreview) namePreview.textContent = nameVal;
    if (instPreview) instPreview.textContent = instVal;
    if (rolePreview) rolePreview.textContent = roleVal;
  }

  renderTicketDetails() {
    const nameEl = document.getElementById("final-ticket-name");
    const instEl = document.getElementById("final-ticket-institution");
    const idEl = document.getElementById("final-ticket-id");
    const emailEl = document.getElementById("final-ticket-email");
    const expEl = document.getElementById("final-ticket-exp");

    if (nameEl) nameEl.textContent = this.formData.fullName;
    if (instEl) instEl.textContent = `${this.formData.teacherRole} • ${this.formData.institution || "Firma Profesional"}`;
    if (idEl) idEl.textContent = this.formData.ticketId;
    if (emailEl) emailEl.textContent = this.formData.email;
    if (expEl) expEl.textContent = this.formData.aiExperience;

    this.generateQRCodeCanvas();
  }

  generateQRCodeCanvas() {
    const canvas = document.getElementById("ticket-qr-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "#0f172a";
    const grid = 15;
    const cellSize = size / grid;

    const seedStr = this.formData.ticketId + this.formData.fullName;
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) seed += seedStr.charCodeAt(i);

    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        if (
          (r < 4 && c < 4) ||
          (r < 4 && c >= grid - 4) ||
          (r >= grid - 4 && c < 4)
        ) {
          if (
            (r === 0 || r === 3 || c === 0 || c === 3) &&
            !(r < 0 || c < 0 || r >= grid || c >= grid)
          ) {
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          } else if (r >= 1 && r <= 2 && c >= 1 && c <= 2) {
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
        } else {
          const pseudoRandom = Math.sin(seed + r * 17 + c * 31) * 10000;
          if (pseudoRandom - Math.floor(pseudoRandom) > 0.45) {
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  }

  startCountdownTimer() {
    const update = () => {
      const now = new Date();
      const diff = this.webinarDate - now;

      const daysEl = document.getElementById("cd-days");
      const hoursEl = document.getElementById("cd-hours");
      const minsEl = document.getElementById("cd-mins");
      const secsEl = document.getElementById("cd-secs");

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = "00";
        if (hoursEl) hoursEl.textContent = "00";
        if (minsEl) minsEl.textContent = "00";
        if (secsEl) secsEl.textContent = "00";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
      if (minsEl) minsEl.textContent = String(mins).padStart(2, "0");
      if (secsEl) secsEl.textContent = String(secs).padStart(2, "0");
    };

    update();
    setInterval(update, 1000);
  }

  downloadCalendarEvent() {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//VL Soluciones//Socio Digital para Firmas//ES
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
SUMMARY:Webinar: Socio Digital para Firmas - Copiloto Legal y Contable con IA
DESCRIPTION:Webinar Conjunto (Legal + Contable): Cómo automatizar la carga documental y operativa de tu despacho o consultora con agentes inteligentes supervisados.\\nEspecialista: Maria Esther Espinoza (Esp. en gestión de procesos con IA).\\nOrganiza: https://e-formacion.vl-soluciones.com/\\nTu Pase Digital: ${this.formData.ticketId}
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
    link.setAttribute("download", `Webinar_Socio_Digital_Firmas_${this.formData.ticketId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  shareOnWhatsApp() {
    const text = encodeURIComponent(
      `🚀 ¡Me acabo de inscribir al Webinar "Socio Digital para Firmas: Copiloto Legal y Contable con IA" con Maria Esther Espinoza!\n\n📅 Martes 17 de Noviembre - 19:00 Hs (Colombia)\n💡 Aprende a automatizar la carga documental y operativa de tu despacho con agentes supervisados.\n\n🎟️ Mi Pase Digital Nº ${this.formData.ticketId}\nInscríbete gratis aquí: https://e-formacion.vl-soluciones.com/`
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
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.left = Math.random() * 100 + "vw";
      particle.style.top = "-10px";
      particle.style.width = Math.random() * 8 + 6 + "px";
      particle.style.height = Math.random() * 8 + 6 + "px";
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      particle.style.opacity = Math.random().toString();
      particle.style.transform = `rotate(${Math.random() * 360}deg)`;

      const duration = Math.random() * 2 + 1.5;
      particle.style.transition = `all ${duration}s ease-out`;

      container.appendChild(particle);

      setTimeout(() => {
        particle.style.top = Math.random() * 80 + 20 + "vh";
        particle.style.opacity = "0";
        particle.style.transform = `translate(${Math.random() * 100 - 50}px, 100px) rotate(720deg)`;
      }, 50);
    }

    setTimeout(() => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }, 4000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.webinarManager = new WebinarManager();
  if (window.webinarManager.isAlreadyRegistered) {
    window.webinarManager.submitRegistration();
  }
});
