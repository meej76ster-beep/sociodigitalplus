/**
 * Contenido Pedagógico Curricular — SOCIO DIGITAL: PRIMEROS PASOS
 * Diseñado bajo metodología Microlearning Mobile First (Duolingo Style)
 * Epartner Class
 */

window.COURSE_CONTENT = {
  levels: [
    {
      id: "level-1",
      number: 1,
      title: "Nivel 1 — Introductorio",
      subtitle: "Descubre qué es un socio digital y su potencial de trabajo",
      description: "Comprende qué es un socio digital, en qué se diferencia de un chatbot tradicional y cómo la IA puede convertirse en tu aliado de productividad diario.",
      status: "available", // 'available' | 'locked' | 'completed' | 'premium'
      isPremium: false,
      badge: "🌱 Iniciado Digital",
      icon: "rocket",
      lessons: [
        {
          id: "l1-m1",
          number: 1,
          title: "¿Qué es un socio digital?",
          duration: "4 min",
          xp: 20,
          steps: {
            activation: {
              type: "scenario",
              question: "Si pudieras contar con un asistente experto disponible 24/7 que conozca tus procesos y te ayude a pensar, redactar y analizar... ¿cómo cambiaría tu jornada diaria?",
              options: [
                { id: "a", text: "Ahorraría horas en tareas repetitivas y tendría más tiempo estratégico", isTarget: true },
                { id: "b", text: "Sería exactamente lo mismo que usar un buscador en Google", isTarget: false },
                { id: "c", text: "Reemplazaría completamente mi capacidad de pensar", isTarget: false }
              ],
              feedback: "¡Exacto! Un socio digital amplifica tu potencial, liberándote de tareas mecánicas para enfocarte en lo estratégico."
            },
            learn: {
              heading: "Concepto Clave",
              text: "Un **Socio Digital** es un agente colaborativo basado en Inteligencia Artificial programado para comprender tu contexto, ejecutar roles específicos y colaborar activamente contigo en la resolución de problemas.",
              bullets: [
                "No es una simple herramienta de búsqueda.",
                "Mantiene memoria del contexto de trabajo.",
                "Actúa como un colega virtual altamente capacitado."
              ]
            },
            example: {
              title: "Ejemplo Real",
              scenario: "María es diseñadora instruccional. En lugar de redactar un objetivo formativo desde cero, le pide a su **Socio Digital especialista en pedagogía** que analice el perfil del estudiante y proponga 3 estructuras instruccionales alineadas a la taxonomía de Bloom.",
              result: "En 30 segundos, María tiene un borrador sólido listo para refinar y adaptar."
            },
            interact: {
              prompt: "Selecciona las 2 características principales que identifican a un verdadero Socio Digital:",
              items: [
                { id: "1", text: "Comprende contexto y rol especializado", correct: true },
                { id: "2", text: "Solo responde respuestas precargadas fijas", correct: false },
                { id: "3", text: "Colabora de manera interactiva e iterativa", correct: true },
                { id: "4", text: "Funciona únicamente sin conexión a datos", correct: false }
              ]
            },
            check: {
              question: "¿Un socio digital busca reemplazar el criterio humano?",
              options: [
                { text: "Sí, toma las decisiones finales de negocio", correct: false },
                { text: "No, colabora y potencia el criterio del profesional", correct: true }
              ],
              explanation: "El socio digital es un amplificador de capacidades (copiloto), la supervisión y decisión final siempre recaen en el humano."
            },
            apply: {
              challenge: "Piensa en 1 tarea repetitiva de tu semana actual. ¿Qué rol le asignarías a tu primer socio digital para resolverla?",
              placeholder: "Ejemplo: Mi socio digital de redacción de reportes semanales...",
              hint: "Guarda esta idea, la usarás en el Nivel 2 para diseñar sus instrucciones."
            }
          }
        },
        {
          id: "l1-m2",
          number: 2,
          title: "¿Socio digital vs. Chatbot?",
          duration: "5 min",
          xp: 20,
          steps: {
            activation: {
              question: "¿Alguna vez interactuaste con el soporte automático de un banco que sólo repetía opciones del menú sin entender tu problema real?",
              options: [
                { id: "a", text: "Sí, es un chatbot tradicional rígido basado en reglas", isTarget: true },
                { id: "b", text: "Sí, eso era un socio digital avanzado", isTarget: false }
              ],
              feedback: "Eso es un chatbot menú. Un socio digital razona con IA generativa, entiende lenguaje natural y se adapta al problema."
            },
            learn: {
              heading: "Diferencia Fundamental",
              table: [
                { feature: "Tecnología", chatbot: "Reglas rígidas (If/Else)", socio: "Modelos de Lenguaje Avanzados (LLM)" },
                { feature: "Flexibilidad", chatbot: "Limitado a menú predefinido", socio: "Adaptable a cualquier contexto" },
                { feature: "Propósito", chatbot: "Dar respuestas estáticas", socio: "Resolver problemas y crear soluciones" }
              ]
            },
            example: {
              title: "Comparativa en Acción",
              scenario: "Chatbot: 'Para ver horarios presione 1'.\nSocio Digital: 'Analicé los horarios de atención y tu calendario. Te sugiero agendar la reunión el jueves a las 10:00 AM porque tienes un espacio libre de 2 horas'."
            },
            interact: {
              prompt: "Relaciona cada herramienta con su categoría:",
              pairs: [
                { concept: "Menú de atención por WhatsApp de respuestas fijas", type: "Chatbot Tradicional" },
                { concept: "Asistente pedagógico que adapta contenidos a la experiencia del usuario", type: "Socio Digital con IA" }
              ]
            },
            check: {
              question: "¿Qué permite a un socio digital adaptar sus respuestas al contexto de tu proyecto?",
              options: [
                { text: "Su capacidad de procesamiento de lenguaje natural y memoria de instrucciones", correct: true },
                { text: "Un listado fijo de 50 preguntas impresas en un servidor", correct: false }
              ],
              explanation: "Los modelos de IA generativa permiten comprender intenciones, matices y contexto profundo."
            },
            apply: {
              challenge: "Identifica un chatbot rígido que hayas usado recientemente. Escribe qué le faltó para actuar como un socio digital.",
              placeholder: "Ej: Le faltó entender el contexto de mi solicitud..."
            }
          }
        },
        {
          id: "l1-m3",
          number: 3,
          title: "¿Qué puede hacer un socio digital?",
          duration: "4 min",
          xp: 20,
          steps: {
            activation: {
              question: "¿En cuál de las siguientes áreas crees que un socio digital aporta MAYOR valor inmediato?",
              options: [
                { id: "a", text: "Investigación, síntesis, redacción y estructuración de proyectos", isTarget: true },
                { id: "b", text: "Reemplazo físico de reuniones presenciales", isTarget: false },
                { id: "c", text: "Únicamente corregir ortografía", isTarget: false }
              ],
              feedback: "¡Así es! Su fuerte está en acelerar la ideación, síntesis, estructuración y creación de contenidos."
            },
            learn: {
              heading: "Los 4 Polos de Actuación",
              bullets: [
                "**1. Sintetizar:** Resumir documentos extensos, extraer puntos clave y métricas.",
                "**2. Crear:** Generar borradores de propuestas, código, e-mails o temarios.",
                "**3. Evaluar:** Revisar sesgos, incoherencias o faltas de claridad en un borrador.",
                "**4. Simular:** Actuar como cliente exigente o estudiante para practicar una conversación."
              ]
            },
            example: {
              title: "Simulación de Cliente",
              scenario: "Un ejecutivo de ventas entrena su presentación usando a su socio digital en el rol de 'Gerente Financiero escéptico'. El socio realiza preguntas difíciles para prepararlo antes de la reunión real."
            },
            interact: {
              prompt: "Arrastra/Selecciona las tareas que puedes delegar a tu Socio Digital:",
              items: [
                { text: "Sintetizar un informe de 40 páginas en 5 viñetas ejecutivas", correct: true },
                { text: "Estructurar una ruta formativa paso a paso", correct: true },
                { text: "Firmar acuerdos legales definitivos sin revisión", correct: false }
              ]
            },
            check: {
              question: "¿Puede un socio digital simular ser un usuario o cliente para realizar pruebas?",
              options: [
                { text: "Sí, asumiendo un rol y personalidad específica previa", correct: true },
                { text: "No, la IA solo sabe responder como enciclopedia", correct: false }
              ],
              explanation: "El 'Role-Playing' (juego de roles) es una de las funciones más potentes para entrenamiento y validación de ideas."
            },
            apply: {
              challenge: "Elige uno de los 4 polos (Sintetizar, Crear, Evaluar, Simular) que probarás primero.",
              placeholder: "Quiero probar el polo de..."
            }
          }
        },
        {
          id: "l1-m4",
          number: 4,
          title: "Características de un buen socio digital",
          duration: "5 min",
          xp: 20,
          steps: {
            activation: {
              question: "Si le pides a una persona 'Haz un informe', sin darle detalles de formato ni objetivo... ¿qué resultado obtendrás?",
              options: [
                { id: "a", text: "Un resultado ambiguo o aleatorio", isTarget: true },
                { id: "b", text: "Exactamente lo que tenías en mente sin necesidad de explicárselo", isTarget: false }
              ],
              feedback: "¡Exacto! Con la IA ocurre exactamente lo mismo: a mayor claridad de instrucciones (Prompt), mejor el resultado."
            },
            learn: {
              heading: "Anatomía de un Socio Digital Efectivo",
              bullets: [
                "**Propósito Claro:** Sabe exactamente cuál es su meta.",
                "**Rol Definido:** Actúa bajo una identidad o experticia específica.",
                "**Tono y Estilo:** Se comunica según las pautas de tu organización.",
                "**Contexto Rico:** Posee la información indispensable sobre el tema."
              ]
            },
            example: {
              title: "Diferencia de Especificación",
              scenario: "Vago: 'Escribe un e-mail'\nSólido: 'Actúa como Director de Experiencia del Cliente. Escribe un e-mail empático de 3 párrafos respondiendo a un usuario sobre una demora de entrega, ofreciendo un 10% de compensación'."
            },
            interact: {
              prompt: "Selecciona los pilares necesarios para configurar un socio digital de alto nivel:",
              items: [
                { text: "Rol explícito", correct: true },
                { text: "Contexto del problema", correct: true },
                { text: "Formato de salida deseado", correct: true },
                { text: "Instrucciones contradictorias", correct: false }
              ]
            },
            check: {
              question: "¿El tono de comunicación del socio digital se puede personalizar?",
              options: [
                { text: "Sí, puede ser formal, técnico, cercano, persuasivo o socrático", correct: true },
                { text: "No, la IA siempre habla de forma robótica e impersonal", correct: false }
              ],
              explanation: "Puedes definir aspectos tonales precisos como 'profesional pero cálido', 'pedagógico' o 'ejecutivo'."
            },
            apply: {
              challenge: "Escribe 3 palabras clave que definan el tono que debería tener tu socio digital ideal.",
              placeholder: "Ej: Claro, Riguroso, Alentador..."
            }
          }
        },
        {
          id: "l1-m5",
          number: 5,
          title: "Primer acercamiento a la IA como socio de trabajo",
          duration: "6 min",
          xp: 20,
          steps: {
            activation: {
              question: "¿Cuál es la mejor actitud mental al interactuar por primera vez con tu socio digital?",
              options: [
                { id: "a", text: "Conversación iterativa y colaborativa (dar feedback continuo)", isTarget: true },
                { id: "b", text: "Esperar perfección total al primer intento sin ajustar nada", isTarget: false }
              ],
              feedback: "¡Exacto! El trabajo con IA es un diálogo de refinamiento continuo."
            },
            learn: {
              heading: "El Ciclo de Colaboración Iterativo",
              bullets: [
                "**1. Prompt Inicial:** Das la instrucción de arranque.",
                "**2. Primera Salida:** La IA entrega una propuesta base.",
                "**3. Reorientación:** Pides ajustes ('Hazlo más breve', 'Añade un ejemplo').",
                "**4. Resultado Final:** Logras el estándar de calidad deseado."
              ]
            },
            example: {
              title: "Iteración en Práctica",
              scenario: "Paso 1: Le pides un temario.\nPaso 2: La IA da 5 temas.\nPaso 3: Le indicas 'El tema 3 es muy complejo para principiantes, divídelo en 2 partes más sencillas'.\nPaso 4: El temario queda ajustado al nivel real del estudiante."
            },
            interact: {
              prompt: "Ordena los pasos del ciclo de trabajo con tu socio digital:",
              items: [
                { text: "1. Asignar rol y contexto", correct: true },
                { text: "2. Evaluar el primer resultado", correct: true },
                { text: "3. Dar retroalimentación de ajuste", correct: true }
              ]
            },
            check: {
              question: "Si la primera respuesta de tu socio no cumple 100% tus expectativas, ¿qué debes hacer?",
              options: [
                { text: "Guiarlo mediante un prompt de ajuste especificando qué cambiar", correct: true },
                { text: "Rendirse y concluir que la Inteligencia Artificial no sirve", correct: false }
              ],
              explanation: "El feedback iterativo es el secreto de los profesionales que obtienen resultados extraordinarios con IA."
            },
            apply: {
              challenge: "¡Felicidades por llegar al final de las microlecciones del Nivel 1! Prepárate para el Desafío y Evaluación Final.",
              placeholder: "¡Estoy listo para el desafío del Nivel 1!"
            }
          }
        }
      ],
      assessment: {
        title: "Evaluación Final — Nivel 1: Introductorio",
        passingScore: 80,
        questions: [
          {
            id: "q1",
            type: "single",
            question: "¿Qué es esencialmente un Socio Digital basado en IA?",
            options: [
              { id: "a", text: "Un software con respuestas prefijadas por botones estáticos.", correct: false },
              { id: "b", text: "Un agente colaborativo que comprende contexto, asume roles y ayuda a resolver problemas de forma iterativa.", correct: true },
              { id: "c", text: "Un motor de búsqueda de Google con diseño moderno.", correct: false }
            ],
            feedback: "El socio digital destaca por su comprensión contextual, capacidad de asumir un rol y colaboración dinámica."
          },
          {
            id: "q2",
            type: "single",
            question: "¿En qué se diferencia un Socio Digital de un chatbot tradicional de menú?",
            options: [
              { id: "a", text: "El chatbot razona en lenguaje natural; el socio digital sólo responde preguntas estáticas.", correct: false },
              { id: "b", text: "No hay ninguna diferencia; son exactamente lo mismo.", correct: false },
              { id: "c", text: "El chatbot opera bajo reglas rígidas (menús), mientras que el socio digital utiliza modelos de IA adaptables al contexto.", correct: true }
            ],
            feedback: "Los chatbots tradicionales se limitan a esquemas fijos; el socio digital comprende intenciones y adapta sus salidas."
          },
          {
            id: "q3",
            type: "tf",
            question: "Verdadero o Falso: Un socio digital reemplaza la supervisión y decisión final del profesional humano.",
            options: [
              { id: "v", text: "Verdadero", correct: false },
              { id: "f", text: "Falso", correct: true }
            ],
            feedback: "Falso. El socio digital es un amplificador de capacidades; la decisión y criterio ético final siempre son del profesional humano."
          },
          {
            id: "q4",
            type: "single",
            question: "¿Qué estrategia se recomienda cuando la primera respuesta del socio digital no es perfecta?",
            options: [
              { id: "a", text: "Proporcionar retroalimentación específica y refinar la instrucción de forma iterativa.", correct: true },
              { id: "b", text: "Borrar todo e iniciar sesión de nuevo.", correct: false },
              { id: "c", text: "Aceptar la primera respuesta aunque tenga errores.", correct: false }
            ],
            feedback: "El trabajo con IA es un diálogo iterativo donde el feedback continuo refina la calidad del resultado."
          },
          {
            id: "q5",
            type: "single",
            question: "¿Cuáles son elementos fundamentales para configurar un prompt efectivo para tu socio digital?",
            options: [
              { id: "a", text: "Rol explícito, contexto claro, objetivo y formato de respuesta deseado.", correct: true },
              { id: "b", text: "Únicamente una palabra clave suelta.", correct: false },
              { id: "c", text: "Escribir en mayúsculas sin dar detalles del proyecto.", correct: false }
            ],
            feedback: "Especificar rol, contexto, meta y formato asegura respuestas precisas y de alto impacto pedagógico/laboral."
          }
        ]
      }
    },

    {
      id: "level-2",
      number: 2,
      title: "Nivel 2 — Básico",
      subtitle: "Aprende a diseñar la estructura e instrucciones de tu socio digital",
      description: "Pasa de la teoría a la práctica. Diseña el propósito, rol, personalidad, base de conocimientos e instrucciones maestro para poner a prueba tu primer socio digital.",
      status: "locked", // Se desbloquea sólo si Nivel 1 Assessment >= 80%
      isPremium: false,
      badge: "🏗️ Arquitecto de Socios",
      icon: "cpu",
      lessons: [
        {
          id: "l2-m1",
          number: 1,
          title: "Define el propósito de tu socio digital",
          duration: "4 min",
          xp: 20,
          steps: {
            activation: {
              question: "Si tu socio digital pudiera cumplir UNA sola meta principal con excelencia durante este mes, ¿cuál elegirías?",
              options: [
                { id: "a", text: "Optimizar y redactar propuestas comerciales en 10 minutos", isTarget: true },
                { id: "b", text: "Tratar de hacer absolutamente todas las tareas de la empresa a la vez", isTarget: false }
              ],
              feedback: "¡Excelente foco! Un propósito delimitado garantiza mayor calidad y precisión en las respuestas."
            },
            learn: {
              heading: "La Regla del Propósito Único (Foco)",
              bullets: [
                "Los mejores socios digitales no son 'todólogos', son **especialistas**.",
                "Un propósito bien definido responde a: ¿Qué problema concreto resuelve? y ¿Para quién?",
                "Evita definiciones ambiguas como 'ayudarme en el trabajo'."
              ]
            },
            example: {
              title: "Propósito Claro vs. Ambiguo",
              scenario: "Ambiguo: 'Ayudar con e-mails'.\nPreciso: 'Asistir al equipo de soporte en la redacción de respuestas empáticas para clientes insatisfechos, reduciendo el tiempo de atención'."
            },
            interact: {
              prompt: "Selecciona las definiciones de propósito bien estructuradas:",
              items: [
                { text: "Estructurar resúmenes ejecutivos de reuniones para el equipo directivo", correct: true },
                { text: "Saber de todo un poco", correct: false },
                { text: "Generar borradores de código en Python verificados", correct: true }
              ]
            },
            check: {
              question: "¿Por qué es mejor un socio digital especializado que uno generalista?",
              options: [
                { text: "Porque reduce alucinaciones y entrega respuestas mucho más profundas y útiles", correct: true },
                { text: "Porque la IA solo puede procesar una palabra a la vez", correct: false }
              ],
              explanation: "La especialización del contexto enfoca la atención del modelo en la tarea requerida."
            },
            apply: {
              challenge: "Redacta en una frase el propósito central de tu futuro socio digital.",
              placeholder: "El propósito de mi socio digital es..."
            }
          }
        },
        {
          id: "l2-m2",
          number: 2,
          title: "Define su rol",
          duration: "5 min",
          xp: 20,
          steps: {
            activation: {
              question: "Si fueras a contratar a una persona humana para este rol, ¿qué título profesional tendría en su tarjeta de presentación?",
              options: [
                { id: "a", text: "Consultor Senior en Innovación Educativa y Diagnóstico Digital", isTarget: true },
                { id: "b", text: "Empleado Genérico de Oficina", isTarget: false }
              ],
              feedback: "¡Exacto! Asignarle una profesión u oficio real activa los patrones del modelo de IA especializados en esa área."
            },
            learn: {
              heading: "El Poder del Role-Prompting",
              bullets: [
                "Al decirle a la IA **'Actúa como [Rol]'**, estás delimitando su vocabulario, enfoque técnico y perspectiva.",
                "Puedes combinar especialidades: Ej. 'Mentor de Redacción + Experto en Marketing B2B'.",
                "Define también sus años de experiencia hipotéticos (ej. 'con 10 años de experiencia')."
              ]
            },
            example: {
              title: "Rol en Acción",
              scenario: "'Actúas como un Tutor Tecno-Pedagógico experto en metodologías activas y gamificación para adultos'."
            },
            interact: {
              prompt: "Asocia la tarea con el Rol recomendado para el socio digital:",
              pairs: [
                { concept: "Revisar contratos y cláusulas", type: "Abogado Especialista en Derecho Corporativo" },
                { concept: "Crear secuencias didácticas y evaluaciones", type: "Diseñador Instruccional Senior" }
              ]
            },
            check: {
              question: "¿Asignar un rol específico afecta el nivel de detalle y vocabulario de la IA?",
              options: [
                { text: "Sí, adopta el marco conceptual, terminología y métodos propios de ese rol", correct: true },
                { text: "No, la IA responde exactamente igual sin importar el rol", correct: false }
              ],
              explanation: "El rol orienta al modelo hacia las fuentes de conocimiento más relevantes para esa disciplina."
            },
            apply: {
              challenge: "Escribe el Rol exacto que le asignarás a tu socio digital.",
              placeholder: "Ej: Eres un Consultor Senior en..."
            }
          }
        },
        {
          id: "l2-m3",
          number: 3,
          title: "Define su personalidad y estilo de comunicación",
          duration: "5 min",
          xp: 20,
          steps: {
            activation: {
              question: "¿Cómo te gustaría que responda tu socio digital al señalarte un error en tu borrador?",
              options: [
                { id: "a", text: "De forma empática, respetuosa y pedagógica proponiendo soluciones", isTarget: true },
                { id: "b", text: "De forma fría, crítica e intimidante", isTarget: false }
              ],
              feedback: "¡La voz y el tono construyen la experiencia de colaboración!"
            },
            learn: {
              heading: "Matices de Personalidad",
              bullets: [
                "**Tono:** Formal, cercano, entusiasmarte, analítico, socrático.",
                "**Longitud:** Directo y sintético vs. detallado y reflexivo.",
                "**Uso de Formato:** Uso de viñetas, negritas, emojis o tablas para facilitar lectura."
              ]
            },
            example: {
              title: "Estilos de Respuesta",
              scenario: "Estilo Socrático: '¡Buen intento! Antes de darte la respuesta, ¿qué crees que pasaría si cambiamos este parámetro?'\nEstilo Directo: 'El resultado es X porque Y. Siguiente paso: Z'."
            },
            interact: {
              prompt: "Selecciona las combinaciones de tono adecuadas según el contexto:",
              items: [
                { text: "Tutor de aprendizaje: Empático, motivador, claro y estructurado", correct: true },
                { text: "Auditor financiero: Riguroso, analítico, preciso y sin rodeos", correct: true },
                { text: "Socio de soporte técnico: Confuso y sarcástico", correct: false }
              ]
            },
            check: {
              question: "¿Puedes indicarle al socio que utilice marcas visuales como emojis y negritas en sus mensajes?",
              options: [
                { text: "Sí, forma parte de las reglas de formato de salida", correct: true },
                { text: "No, la IA no comprende elementos visuales", correct: false }
              ],
              explanation: "Definir reglas de formato visual mejora sustancialmente la experiencia de lectura e interacción."
            },
            apply: {
              challenge: "Describe la personalidad de tu socio digital en 3 adjetivos.",
              placeholder: "Ej: Claro, Riguroso, Empático"
            }
          }
        },
        {
          id: "l2-m4",
          number: 4,
          title: "Define qué información necesita (Contexto)",
          duration: "6 min",
          xp: 20,
          steps: {
            activation: {
              question: "Si le pides a alguien que diseñe un plan de capacitación sin darle datos de la empresa ni del público objetivo... ¿qué pasará?",
              options: [
                { id: "a", text: "Creará un plan genérico que probablemente no sirva para el contexto real", isTarget: true },
                { id: "b", text: "Adivinará mágicamente los datos internos de tu empresa", isTarget: false }
              ],
              feedback: "¡El contexto es el combustible de la precisión!"
            },
            learn: {
              heading: "Información Clave de Contexto",
              bullets: [
                "**Público Objetivo:** A quién va dirigida la solución.",
                "**Restricciones:** Tiempos, presupuestos o normativas a cumplir.",
                "**Documentación de Respaldar:** Guías, manuales o estándares corporativos."
              ]
            },
            example: {
              title: "Fuerza del Contexto",
              scenario: "Inclusión de Contexto: 'Ten en cuenta que nuestros usuarios son adultos mayores con poca alfabetización digital y usan smartphones sencillos'."
            },
            interact: {
              prompt: "Selecciona los datos que enriquecen el contexto de tu socio digital:",
              items: [
                { text: "Perfil del usuario final", correct: true },
                { text: "Objetivos de negocio de la organización", correct: true },
                { text: "Claves secretas o datos personales sensibles (EVITAR)", correct: false }
              ]
            },
            check: {
              question: "¿Se deben incluir datos privados sensibles o contraseñas en el contexto proporcionado a modelos de IA públicos?",
              options: [
                { text: "Jamás; se deben anonimizar los datos sensibles por seguridad", correct: true },
                { text: "Sí, la IA necesita saber tus passwords", correct: false }
              ],
              explanation: "Por normas de seguridad y buenas prácticas (GDPR/WCAG), la información confidencial debe anonimizarse."
            },
            apply: {
              challenge: "Escribe 2 datos contextuales clave que tu socio digital debe conocer siempre sobre tu proyecto.",
              placeholder: "1. Mis usuarios son...\n2. Nuestro objetivo es..."
            }
          }
        },
        {
          id: "l2-m5",
          number: 5,
          title: "Diseña las primeras instrucciones (System Prompt)",
          duration: "7 min",
          xp: 20,
          steps: {
            activation: {
              question: "¿Estás listo para ensamblar las piezas (Propósito, Rol, Personalidad, Contexto) en un Prompt Maestro?",
              options: [
                { id: "a", text: "¡Sí! Unificar todo en una estructura clara de instrucción maestro", isTarget: true },
                { id: "b", text: "Prefiero dejar todo desordenado", isTarget: false }
              ],
              feedback: "¡Es hora de construir la receta maestra de tu socio digital!"
            },
            learn: {
              heading: "Estructura del Prompt Maestro",
              bullets: [
                "**1. ROL:** Eres [Nombre/Puesto].",
                "**2. PROPÓSITO:** Tu objetivo principal es [Meta].",
                "**3. CONTEXTO:** Trabajas con [Público/Datos].",
                "**4. REGLAS & TONO:** Comunícate con tono [Estilo] y sigue estas reglas: [Regla 1, Regla 2].",
                "**5. FORMATO:** Presenta las respuestas usando [Estructura]."
              ]
            },
            example: {
              title: "Plantilla de Prompt Maestro",
              scenario: "ROLPEDAGÓGICO = 'Eres SocioEdu, tutor de IA para el curso Socio Digital. Tu rol es guiar a adultos en su primer proyecto de IA. Responde siempre con preguntas guía antes de dar la solución'."
            },
            interact: {
              prompt: "Identifica las 4 secciones indispensables de un Prompt Maestro:",
              items: [
                { text: "Rol & Perfil", correct: true },
                { text: "Propósito & Meta", correct: true },
                { text: "Reglas de Actuación", correct: true },
                { text: "Formato de Salida", correct: true }
              ]
            },
            check: {
              question: "¿Qué ocurre cuando estructuramos un Prompt Maestro por secciones claras?",
              options: [
                { text: "El modelo de IA interpreta con precisión cada instrucción sin ambigüedades", correct: true },
                { text: "La IA se bloquea", correct: false }
              ],
              explanation: "El orden y etiquetado claro facilita la atención secuencial del modelo de lenguaje."
            },
            apply: {
              challenge: "Completa la plantilla básica: 'Eres un socio digital experto en [Tu área]. Tu meta es...'",
              placeholder: "Eres un socio digital experto en..."
            }
          }
        },
        {
          id: "l2-m6",
          number: 6,
          title: "Pon a prueba tu socio digital",
          duration: "5 min",
          xp: 20,
          steps: {
            activation: {
              question: "Una vez creado el Prompt Maestro, ¿cuál es el paso final indispensable?",
              options: [
                { id: "a", text: "Someterlo a pruebas de estrés con escenarios reales y ajustar las reglas", isTarget: true },
                { id: "b", text: "Guardarlo y no usarlo jamás", isTarget: false }
              ],
              feedback: "¡Prueba de laboratorio! Someter a prueba a tu socio revela dónde ajustar sus instrucciones."
            },
            learn: {
              heading: "Metodología de Validación (Testing)",
              bullets: [
                "**Prueba Normal:** Hazle una solicitud cotidiana de su rol.",
                "**Prueba de Límite:** Intenta pedirle algo fuera de su propósito para verificar si respeta sus reglas.",
                "**Ajuste Fino:** Agrega 'Reglas Negativas' (ej. 'NUNCA uses jerga técnica sin explicarla')."
              ]
            },
            example: {
              title: "Prueba de Límite Exitosa",
              scenario: "Usuario: 'Escribe una receta de cocina' (a un socio pedagógico).\nSocio: 'Mi propósito está enfocado en diseño tecno-pedagógico. ¿Te gustaría que diseñemos una actividad didáctica sobre nutrición?'"
            },
            interact: {
              prompt: "Selecciona las acciones recomendadas durante la fase de prueba:",
              items: [
                { text: "Probar con casos reales de trabajo", correct: true },
                { text: "Evaluar si el tono se mantiene consistente", correct: true },
                { text: "Incorporar reglas de restricción si se desvía", correct: true }
              ]
            },
            check: {
              question: "¿Qué es una 'Regla Negativa' en un Prompt Maestro?",
              options: [
                { text: "Una instrucción explícita de lo que el socio NUNCA debe hacer", correct: true },
                { text: "Un insulto al sistema", correct: false }
              ],
              explanation: "Las reglas 'NUNCA hables de X' o 'NO des la respuesta directa' evitan comportamientos no deseados."
            },
            apply: {
              challenge: "¡Has completado las 6 microlecciones del Nivel Básico! Procede a la Evaluación Final.",
              placeholder: "¡Listo para la evaluación final del Nivel 2!"
            }
          }
        }
      ],
      assessment: {
        title: "Evaluación Final — Nivel 2: Básico",
        passingScore: 80,
        questions: [
          {
            id: "q21",
            type: "single",
            question: "¿Cuál es la principal ventaja de definir un propósito especializado para tu socio digital en lugar de uno generalista?",
            options: [
              { id: "a", text: "Aumenta la precisión de la IA y evita respuestas vagas o desalineadas del objetivo real.", correct: true },
              { id: "b", text: "Permite que la IA responda más rápido al consumir menos electricidad.", correct: false },
              { id: "c", text: "Ninguna; siempre es preferible un socio que intente responder todo.", correct: false }
            ],
            feedback: "El foco estratégico encauza al modelo en el dominio exacto del problema a resolver."
          },
          {
            id: "q22",
            type: "single",
            question: "¿Qué logra la técnica de Role-Prompting ('Actúa como X rol')?",
            options: [
              { id: "a", text: "Delimita el vocabulario, marco conceptual y perspectiva técnica del socio digital.", correct: true },
              { id: "b", text: "Cambia la interfaz visual del navegador a color verde.", correct: false },
              { id: "c", text: "Obliga a la IA a cobrar por cada respuesta.", correct: false }
            ],
            feedback: "Asignar un rol profesional activa el conocimiento de dominio específico del modelo."
          },
          {
            id: "q23",
            type: "single",
            question: "¿Cuáles son las 4 partes fundamentales que integran un Prompt Maestro sólido?",
            options: [
              { id: "a", text: "Rol, Propósito, Contexto y Reglas/Formato de salida.", correct: true },
              { id: "b", text: "Saludo, Despedida, Firma y Fecha.", correct: false },
              { id: "c", text: "Título, Nombre de usuario, Contraseña y Correo.", correct: false }
            ],
            feedback: "Rol + Propósito + Contexto + Reglas constituyen la arquitectura indispensable de instrucción."
          },
          {
            id: "q24",
            type: "tf",
            question: "Verdadero o Falso: Es una buena práctica agregar 'Reglas Negativas' (lo que la IA NUNCA debe hacer) para delimitar su comportamiento.",
            options: [
              { id: "v", text: "Verdadero", correct: true },
              { id: "f", text: "Falso", correct: false }
            ],
            feedback: "Verdadero. Las restricciones negativas previenen desvíos, alucinaciones y respuestas no deseadas."
          },
          {
            id: "q25",
            type: "single",
            question: "¿Por qué es crucial anonimizar datos confidenciales antes de compartirlos en un contexto con la IA?",
            options: [
              { id: "a", text: "Por normas de privacidad, ciberseguridad y buenas prácticas de protección de datos.", correct: true },
              { id: "b", text: "Porque la IA no puede leer números ni nombres propios.", correct: false },
              { id: "c", text: "Para evitar que la pantalla se vuelva lenta.", correct: false }
            ],
            feedback: "Proteger la privacidad y evitar exponer datos sensibles o claves es un estándar ético y de seguridad indispensable."
          }
        ]
      }
    },

    {
      id: "level-3",
      number: 3,
      title: "Nivel 3 — Intermedio",
      subtitle: "Automatizaciones, Integraciones y Bases de Conocimiento (RAG)",
      description: "Lleva tu socio digital al siguiente nivel conectándolo a documentos corporativos, bases de datos y flujos de trabajo automatizados.",
      status: "premium",
      isPremium: true,
      badge: "⚡ Máster Integrador",
      icon: "zap",
      premiumTeaser: "Aquí comienza el siguiente nivel de tu evolución digital. Desbloquea el nivel Intermedio para conectar tu socio digital con tus herramientas de trabajo diarias.",
      lessons: []
    },

    {
      id: "level-4",
      number: 4,
      title: "Nivel 4 — Avanzado",
      subtitle: "Agentes Autónomos Multi-Socio y Despliegue Corporativo",
      description: "Diseña ecosistemas completos de socios digitales colaborando entre sí para resolver procesos organizacionales complejos.",
      status: "premium",
      isPremium: true,
      badge: "👑 Arquitecto Élite IA",
      icon: "crown",
      premiumTeaser: "Domina la creación de socios digitales avanzados y ecosistemas multi-agente para transformar tu organización a escala.",
      lessons: []
    }
  ],

  badges: [
    { id: "b1", title: "Primer Paso", desc: "Completaste tu primera microlección", icon: "footprints", unlocked: false },
    { id: "b2", title: "Cerebro Digital", desc: "Aprobaste el Nivel 1 Introductorio", icon: "brain", unlocked: false },
    { id: "b3", title: "Arquitecto IA", desc: "Aprobaste el Nivel 2 Básico", icon: "cpu", unlocked: false },
    { id: "b4", title: "Racha de Fuego", desc: "Mantuviste 3 días seguidos aprendiendo", icon: "flame", unlocked: false },
    { id: "b5", title: "Aliado del Tutor", desc: "Consultaste al Tutor Virtual IA para resolver una duda", icon: "bot", unlocked: false }
  ]
};
