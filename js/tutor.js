/**
 * Módulo de Tutor Virtual IA — AgenteEdu
 * Incorpora reglas pedagógicas y protección anti-trampas de evaluaciones
 * Esp. Maria Esther Espinoza — Del chat al Agente: Go
 */

class AITutorManager {
  constructor() {
    this.isOpen = false;
    this.messages = [
      {
        sender: "tutor",
        text: "¡Hola! Soy **AgenteEdu**, tu tutor virtual de Inteligencia Artificial guiado por la **Esp. Maria Esther Espinoza** en el programa **Del chat al Agente: Go**. 🤖✨\n\nEstoy aquí para responder tus dudas sobre cómo estructurar tus agentes inteligentes, darte ejemplos o refinar tus prompts. ¿En qué puedo apoyarte hoy?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ];
    this.initUI();
  }

  initUI() {
    // Escuchar atajos o eventos si aplica
  }

  toggleWidget() {
    this.isOpen = !this.isOpen;
    const drawer = document.getElementById("tutor-drawer");
    const backdrop = document.getElementById("tutor-backdrop");

    if (drawer) {
      if (this.isOpen) {
        drawer.classList.remove("translate-y-full", "pointer-events-none", "opacity-0");
        drawer.classList.add("translate-y-0", "pointer-events-auto", "opacity-100");
        if (backdrop) backdrop.classList.remove("hidden");
        this.scrollToBottom();
        this.trackAnalytics("tutor_opened");
      } else {
        drawer.classList.add("translate-y-full", "pointer-events-none", "opacity-0");
        drawer.classList.remove("translate-y-0", "pointer-events-auto", "opacity-100");
        if (backdrop) backdrop.classList.add("hidden");
      }
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = document.getElementById("tutor-messages-container");
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  }

  async sendMessage(userText) {
    if (!userText || !userText.trim()) return;

    const trimmed = userText.trim();
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Agregar mensaje del usuario a la lista
    this.messages.push({
      sender: "user",
      text: trimmed,
      time: now
    });

    this.renderMessages();
    this.trackAnalytics("tutor_message", { length: trimmed.length });

    // Mostrar indicador de escritura del tutor
    this.showTypingIndicator(true);

    // Procesar respuesta con guardia pedagógica
    setTimeout(async () => {
      const replyText = await this.generateTutorResponse(trimmed);
      this.showTypingIndicator(false);
      this.messages.push({
        sender: "tutor",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });
      this.renderMessages();
      this.scrollToBottom();
    }, 900);
  }

  /**
   * Generador de respuestas con filtro anti-trampas de evaluaciones
   */
  async generateTutorResponse(query) {
    const qLower = query.toLowerCase();

    // 1. REGLA CRÍTICA DE PROTECCIÓN DE EVALUACIONES (Sección 18)
    const isQuizQuery =
      qLower.includes("respuesta correcta") ||
      qLower.includes("cuál es la respuesta") ||
      qLower.includes("dame la respuesta") ||
      qLower.includes("es la a o la b") ||
      qLower.includes("cuál marco en la evaluación") ||
      qLower.includes("pásame las respuestas") ||
      qLower.includes("respuesta de la pregunta");

    if (isQuizQuery) {
      return (
        "No puedo darte directamente la respuesta de la evaluación, pero puedo ayudarte a analizar el concepto para que puedas resolverla por ti mismo. 🧠💡\n\n" +
        "Recuerda los pilares clave:\n" +
        "• Un **Socio Digital** no es un bot rígido; es un copiloto con contexto, rol y adaptabilidad.\n" +
        "• La **supervisión final** siempre es humana.\n" +
        "• El **Prompt Maestro** requiere: Rol, Propósito, Contexto y Reglas de Formato.\n\n" +
        "¿Sobre cuál de estos conceptos específicos tienes alguna duda?"
      );
    }

    // 2. Si hay clave API configurada en APP_CONFIG, llamar al proveedor de IA
    if (window.APP_CONFIG.AI_API_KEY && window.APP_CONFIG.AI_API_PROVIDER !== "demo") {
      try {
        return await this.callAIProvider(query);
      } catch (err) {
        console.warn("Fallo API IA, usando motor contextual local:", err);
      }
    }

    // 3. Motor Contextual Pedagógico Local (Base de Conocimiento)
    return this.getLocalContextualReply(qLower);
  }

  getLocalContextualReply(q) {
    if (q.includes("socio digital") || q.includes("qué es")) {
      return "Un **Socio Digital** es un agente de Inteligencia Artificial configurado con un rol, propósito y contexto específico para colaborar contigo como un copiloto de trabajo. A diferencia de buscar en Google, tu socio entiende tus objetivos y trabaja de forma iterativa.";
    }
    if (q.includes("chatbot") || q.includes("diferencia")) {
      return "La diferencia central radica en que los **chatbots tradicionales** operan con reglas fijas (menús rígidos If/Else), mientras que un **Socio Digital** utiliza Inteligencia Artificial Generativa para razonar en lenguaje natural y adaptarse a situaciones complejas.";
    }
    if (q.includes("prompt") || q.includes("instruccion") || q.includes("instrucción")) {
      return "El **Prompt Maestro** es la 'receta' que define la personalidad y capacidades de tu socio. Se compone de 4 partes clave:\n1. **Rol:** Quién es.\n2. **Propósito:** Qué problema resuelve.\n3. **Contexto:** Qué información del proyecto necesita.\n4. **Reglas & Formato:** Cómo debe responder.";
    }
    if (q.includes("desbloquear") || q.includes("nivel") || q.includes("aprobar")) {
      return "Para desbloquear el **Nivel 2 (Básico)**, debes completar todas las microlecciones del Nivel 1 y obtener **al menos 80%** en la Evaluación Final. ¡Puedes repetir la evaluación las veces que necesites!";
    }
    if (q.includes("premium") || q.includes("nivel 3") || q.includes("nivel 4")) {
      return "Los **Niveles 3 (Intermedio)** y **4 (Avanzado)** están preparados para usuarios Premium. En ellos aprenderás a conectar tus socios digitales con bases de datos, Google Drive, automatizaciones y agentes autónomos multi-socio.";
    }
    if (q.includes("gracias") || q.includes("hola") || q.includes("buenas")) {
      return "¡Con mucho gusto! Recuerda que estoy aquí para acompañarte en tu ruta de aprendizaje. ¿Hay algún tema específico de la lección actual que quieras profundizar?";
    }

    return (
      "¡Excelente inquietud! En el contexto de **Del chat al Agente: Go**, lo más importante es aplicar la experimentación iterativa: definir bien el Rol del agente, dar un Contexto claro, definir herramientas y refinar las respuestas mediante supervisión activa.\n\n" +
      "¿Te gustaría que veamos un ejemplo práctico de cómo aplicar esto a tu trabajo diario?"
    );
  }

  async callAIProvider(query) {
    const userRole = window.authManager?.getUser()?.name || "Estudiante";
    const systemPrompt = `Eres AgenteEdu, un tutor virtual altamente profesional, empático y pedagógico guiado por la metodología de la Esp. Maria Esther Espinoza. 
Tu rol es orientar a ${userRole} en el programa "DEL CHAT AL AGENTE: GO".
REGLA INQUEBRANTABLE: NUNCA des las respuestas directas a las evaluaciones del curso. Si el usuario te pide la respuesta a una pregunta de examen o quiz, niega educadamente la respuesta directa y ofrece una explicación conceptual para que el usuario pueda razonarla.
Respuestas concisas, claras, utilizando markdown (negritas, viñetas) y emojis apropiados.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.APP_CONFIG.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        temperature: 0.7,
        max_tokens: 250
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  showTypingIndicator(show) {
    const container = document.getElementById("tutor-messages-container");
    const indicator = document.getElementById("tutor-typing-indicator");
    if (indicator) {
      if (show) indicator.classList.remove("hidden");
      else indicator.classList.add("hidden");
    }
    if (show && container) container.scrollTop = container.scrollHeight;
  }

  renderMessages() {
    const container = document.getElementById("tutor-messages-container");
    if (!container) return;

    const html = this.messages
      .map((m) => {
        const isTutor = m.sender === "tutor";
        return `
        <div class="flex gap-2.5 ${isTutor ? "items-start" : "items-end justify-end"} mb-3 animate-fade-in">
          ${
            isTutor
              ? `<div class="w-8 h-8 rounded-full bg-brand-green/20 border border-brand-green flex items-center justify-center shrink-0 text-sm shadow-sm">🤖</div>`
              : ""
          }
          <div class="max-w-[82%] ${
            isTutor
              ? "bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-xs sm:text-sm shadow-md"
              : "bg-gradient-to-r from-brand-green to-emerald-600 text-white rounded-2xl rounded-tr-xs px-3.5 py-2.5 text-xs sm:text-sm shadow-md font-medium"
          }">
            <div class="prose prose-invert prose-sm leading-relaxed">${this.formatMarkdown(m.text)}</div>
            <div class="text-[10px] opacity-60 text-right mt-1">${m.time}</div>
          </div>
        </div>
      `;
      })
      .join("");

    container.innerHTML = html;
  }

  formatMarkdown(text) {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n/g, "<br/>");
  }

  trackAnalytics(eventName, payload = {}) {
    if (window.appController) {
      window.appController.trackEvent(eventName, payload);
    }
  }
}

window.aiTutorManager = new AITutorManager();
