/**
 * Módulo de Autenticación Segura (Google OAuth 2.0 & Session Manager)
 * Esp. Maria Esther Espinoza — Del chat al Agente: Go
 */

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.onAuthChangeCallbacks = [];
    this.initSession();
  }

  initSession() {
    const savedUser = localStorage.getItem("socio_digital_user");
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.currentUser.lastLogin = new Date().toISOString();
        this.saveUser(this.currentUser);
      } catch (e) {
        console.error("Error al restaurar sesión:", e);
        this.currentUser = null;
      }
    }
  }

  onAuthChange(callback) {
    if (typeof callback === "function") {
      this.onAuthChangeCallbacks.push(callback);
    }
  }

  notifyAuthChange() {
    this.onAuthChangeCallbacks.forEach((cb) => cb(this.currentUser));
  }

  saveUser(user) {
    this.currentUser = user;
    localStorage.setItem("socio_digital_user", JSON.stringify(user));
    this.notifyAuthChange();
  }

  /**
   * Inicializa el SDK de Google Sign-In si está configurado
   */
  initGoogleAuth() {
    if (window.google && window.google.accounts && window.APP_CONFIG.GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com") {
      try {
        window.google.accounts.id.initialize({
          client_id: window.APP_CONFIG.GOOGLE_CLIENT_ID,
          callback: (response) => this.handleGoogleCredentialResponse(response),
          auto_select: false
        });

        const btnElement = document.getElementById("google-signin-btn-container");
        if (btnElement) {
          window.google.accounts.id.renderButton(btnElement, {
            theme: "filled_blue",
            size: "large",
            shape: "pill",
            text: "continue_with",
            locale: "es"
          });
        }
      } catch (err) {
        console.warn("Google Sign-In no configurado o bloqueado:", err);
      }
    }
  }

  handleGoogleCredentialResponse(response) {
    try {
      // Decodificar el token JWT de Google
      const payload = this.parseJwt(response.credential);
      const studentData = {
        id: `google_${payload.sub}`,
        googleId: payload.sub,
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        photo: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || "Estudiante")}&background=00AEEF&color=fff`,
        institution: "Firma / Despacho Profesional",
        specialty: "Firma Conjunta (Legal + Contable)",
        role: "Socio / Titular de Firma",
        createdAt: this.currentUser?.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        accessType: "free"
      };

      this.registerStudent(studentData);
    } catch (e) {
      console.error("Error al procesar credencial de Google:", e);
      alert("Error al iniciar sesión con Google. Por favor intenta de nuevo.");
    }
  }

  parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  /**
   * Registra formalmente a un nuevo estudiante en la base de datos
   * y guarda su sesión como usuario activo
   */
  async registerStudent(studentData) {
    if (!studentData || !studentData.name) {
      throw new Error("El nombre del estudiante es obligatorio");
    }

    const fullName = studentData.name.trim();
    const email = (studentData.email || "").trim().toLowerCase();
    const id = studentData.id || `student_${Date.now()}`;

    const student = {
      id: id,
      name: fullName,
      email: email,
      country: studentData.country || "🇨🇴 Colombia",
      institution: studentData.institution?.trim() || "Firma Profesional",
      specialty: studentData.specialty || "Firma Conjunta (Legal + Contable)",
      role: studentData.role || "Socio / Titular de Firma",
      photo: studentData.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=00AEEF&color=fff`,
      createdAt: studentData.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      accessType: "free"
    };

    // 1. Guardar en registro permanente de BD
    if (window.dbManager) {
      window.dbManager.saveStudent(student);
    }

    // 2. Si se solicitó unificación con el Webinar, registrar al webinar automáticamente
    if (studentData.registerWebinar) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const webinarRecord = {
        ticketId: `SD-FIRMAS-2026-${randomNum}`,
        fullName: student.name,
        email: student.email,
        country: student.country,
        institution: student.institution,
        specialty: student.specialty,
        teacherRole: student.role,
        registeredAt: new Date().toISOString()
      };

      if (window.dbManager) {
        await window.dbManager.saveWebinarRegistration(student.id, webinarRecord);
      }
      student.webinarRegistered = true;
      student.webinarTicketId = webinarRecord.ticketId;
    }

    // 3. Activar sesión
    this.saveUser(student);
    return student;
  }

  /**
   * Inicia sesión con un estudiante existente en la base de datos
   */
  loginAsStudent(idOrEmail) {
    if (!window.dbManager) return false;
    const student = window.dbManager.getStudent(idOrEmail);
    if (student) {
      student.lastLogin = new Date().toISOString();
      this.saveUser(student);
      return true;
    }
    return false;
  }

  /**
   * Actualiza el perfil del estudiante en BD y sesión actual
   */
  updateProfile(updatedFields) {
    if (!this.currentUser) return;
    const updatedUser = { ...this.currentUser, ...updatedFields };
    if (updatedFields.name) {
      updatedUser.photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedFields.name.trim())}&background=00AEEF&color=fff`;
    }

    if (window.dbManager) {
      window.dbManager.updateStudentProfile(this.currentUser.id, updatedFields);
    }

    this.saveUser(updatedUser);
    return updatedUser;
  }

  /**
   * Inicio de sesión rápido para demostración / pruebas
   */
  loginAsDemoUser(name = "Dr. Alejandro Silva", email = "alejandro@silva-abogados.com") {
    // Buscar si ya existe este estudiante en la BD
    const existing = window.dbManager?.getStudent(email);
    if (existing) {
      this.loginAsStudent(existing.id);
      return;
    }

    this.registerStudent({
      id: "student_demo_101",
      name: name,
      email: email,
      country: "🇨🇴 Colombia",
      institution: "Silva & Asociados Abogados",
      specialty: "Firma Conjunta (Legal + Contable)",
      role: "Socio / Titular de Firma",
      registerWebinar: false
    });
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("socio_digital_user");
    this.notifyAuthChange();
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getUser() {
    return this.currentUser;
  }
}

window.authManager = new AuthManager();
