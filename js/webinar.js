/**
 * Gestor del Formulario de Inscripción para el Webinar:
 * "Socio Digital para Firmas: Copiloto Legal y Contable con IA"
 * Especialista: Maria Esther Espinoza (Esp. en gestión de procesos con IA)
 * Contacto: epartnerclass@gmail.com
 * Plataforma: https://e-formacion.vl-soluciones.com/
 */

class WebinarManager {
  constructor() {
    // Martes 17 de Noviembre, 19:00 Hs Colombia (GMT-5)
    this.webinarDate = new Date("2026-11-17T19:00:00-05:00");
    this.formData = {
      fullName: "",
      email: "",
      country: "🇨🇴 Colombia",
      institution: "",
      educationLevel: "Firma Conjunta (Legal + Contable)",
      teacherRole: "Socio / Titular de Firma",
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
    if (this.isAlreadyRegistered && this.formData.ticketId) {
      this.showConfirmationView(false);
    }
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
      if (user) {
        if (!this.formData.fullName) this.formData.fullName = user.name || "";
        if (!this.formData.email) this.formData.email = user.email || "";
        if (user.country) this.formData.country = user.country;
        if (user.institution) this.formData.institution = user.institution;
        if (user.specialty) this.formData.educationLevel = user.specialty;
        if (user.role) this.formData.teacherRole = user.role;

        const headerUser = document.getElementById("webinar-header-user");
        if (headerUser) {
          headerUser.innerHTML = `
            <a href="index.html" class="flex items-center gap-2 bg-navy-800/90 border border-brand-cyan/40 rounded-full px-3 py-1 text-xs hover:border-brand-green transition-colors">
              <img src="${user.photo}" class="w-5 h-5 rounded-full object-cover border border-brand-cyan" alt="${user.name}"/>
              <span class="font-semibold text-white truncate max-w-[120px]">${user.name}</span>
            </a>
          `;
        }
      }
    }
  }

  bindEvents() {
    // Inputs del Formulario
    const nameInput = document.getElementById("webinar-name");
    const emailInput = document.getElementById("webinar-email");
    const countrySelect = document.getElementById("webinar-country");
    const institutionInput = document.getElementById("webinar-institution");
    const levelSelect = document.getElementById("webinar-level");
    const roleSelect = document.getElementById("webinar-role");
    const questionInput = document.getElementById("webinar-question");

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

    if (questionInput) {
      if (this.formData.speakerQuestion) questionInput.value = this.formData.speakerQuestion;
      questionInput.addEventListener("input", (e) => {
        this.formData.speakerQuestion = e.target.value;
      });
    }

    // Botones de acción del Ticket Confirmado
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
        const formCard = document.getElementById("webinar-form-container");
        const confirmCard = document.getElementById("webinar-step-confirmation");
        if (formCard) formCard.classList.remove("hidden");
        if (confirmCard) confirmCard.classList.add("hidden");
      });
    }
  }

  submitRegistration() {
    // Validaciones de datos obligatorios
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

    if (!this.formData.institution) {
      alert("Por favor, ingresa el nombre de tu Despacho, Firma o Consultora.");
      document.getElementById("webinar-institution")?.focus();
      return;
    }

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

    if (window.authManager && window.dbManager) {
      let user = window.authManager.getUser();
      if (!user) {
        user = {
          id: `student_${Date.now()}`,
          name: this.formData.fullName,
          email: this.formData.email,
          country: this.formData.country,
          institution: this.formData.institution,
          specialty: this.formData.educationLevel,
          role: this.formData.teacherRole,
          photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(this.formData.fullName)}&background=00AEEF&color=fff`,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          accessType: "free"
        };
        window.authManager.saveUser(user);
        window.dbManager.saveStudent(user);
      }
      window.dbManager.saveWebinarRegistration(user.id, this.formData);
    }

    this.showConfirmationView(true);
    this.triggerConfetti();
  }

  showConfirmationView(scroll = true) {
    const formCard = document.getElementById("webinar-form-container");
    const confirmCard = document.getElementById("webinar-step-confirmation");

    if (formCard) formCard.classList.add("hidden");
    if (confirmCard) {
      confirmCard.classList.remove("hidden");
      if (scroll) {
        confirmCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    this.renderTicketDetails();
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

    if (nameEl) nameEl.textContent = this.formData.fullName;
    if (instEl) instEl.textContent = `${this.formData.teacherRole} • ${this.formData.institution || "Firma Profesional"}`;
    if (idEl) idEl.textContent = this.formData.ticketId;
    if (emailEl) emailEl.textContent = this.formData.email;

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
DESCRIPTION:Webinar Conjunto (Legal + Contable): Cómo automatizar la carga documental y operativa de tu despacho o consultora con agentes inteligentes supervisados.\\nEspecialista: Maria Esther Espinoza (Esp. en gestión de procesos con IA).\\nOrganiza: https://e-formacion.vl-soluciones.com/\\nContacto: epartnerclass@gmail.com\\nTu Pase Digital: ${this.formData.ticketId}
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
      `🚀 ¡Me inscribí al Webinar "Socio Digital para Firmas: Copiloto Legal y Contable con IA" con la especialista Maria Esther Espinoza!\n\n📅 Martes 17 de Noviembre - 19:00 Hs (Colombia)\n💡 Descubre cómo automatizar la carga documental de tu despacho con agentes supervisados.\n\n🎟️ Mi Pase Digital Nº ${this.formData.ticketId}\nInscríbete gratis en: https://e-formacion.vl-soluciones.com/`
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
    const formCard = document.getElementById("webinar-form-container");
    const confirmCard = document.getElementById("webinar-step-confirmation");
    if (formCard) formCard.classList.add("hidden");
    if (confirmCard) confirmCard.classList.remove("hidden");
    window.webinarManager.renderTicketDetails();
  }
});
