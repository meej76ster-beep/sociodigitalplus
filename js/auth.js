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
      const user = {
        id: `google_${payload.sub}`,
        googleId: payload.sub,
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        photo: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name)}&background=76BC21&color=fff`,
        createdAt: this.currentUser?.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        accessType: "free" // 'free' | 'premium'
      };
      this.saveUser(user);
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
   * Inicio de sesión rápido para demostración / testing si Google OAuth no tiene credenciales aún
   */
  loginAsDemoUser(name = "Estudiante Digital", email = "estudiante@mariaestherespinoza.com") {
    const demoUser = {
      id: `demo_${Date.now()}`,
      name: name,
      email: email,
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=76BC21&color=fff`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      accessType: "free"
    };
    this.saveUser(demoUser);
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
