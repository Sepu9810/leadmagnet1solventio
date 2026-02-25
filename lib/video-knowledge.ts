export const SOLVENTIO_LOGO_URL =
  "https://d537127951692c7fbd38ff662fb21b1c.cdn.bubble.io/f1769723313269x424679096768052900/solventio%20icon.png";

export const BOOKING_URL_DEFAULT = "https://cal.com/solventio/conozcamos-tu-idea";

export const LANDING_BENEFITS = [
  {
    title: "Adiós al miedo a la IA",
    description:
      "Sebastián (SepuHacks) te enseña a usar ChatGPT y Gemini sin tecnicismos y con cero código."
  },
  {
    title: "Marcos de trabajo reales",
    description:
      "Domina el método CAR para prompts rápidos y ACERO para asistentes que funcionan en empresas."
  },
  {
    title: "De personal a empresarial",
    description:
      "Aprende cuándo la IA deja de ser un chat y se convierte en sistemas, datos y decisiones operativas."
  }
];

export const VIDEO_KEY_INSIGHTS = [
  "ChatGPT no es Google: funciona pensando en voz alta y dando contexto, no buscando 'la respuesta correcta'.",
  "Método CAR (Rápido): Contexto, Acción, Resultado. Simple y efectivo para el día a día.",
  "Método ACERO (Avanzado): Acción, Contexto, Estilo, Resultado, Obligaciones. Para crear asistentes (Gems/GPTs) robustos.",
  "'Basura entra, basura sale': Si no das contexto y reglas claras, la IA alucina o responde genéricos.",
  "NotebookLM: Tu 'segundo cerebro' para cargar documentos, investigar a fondo y generar resúmenes o audio.",
  "Diseño Operativo: Cuando la IA toca equipos y procesos, el prompt no basta; se necesita sistema y estrategia.",
  "Automatización de PQRs: Ejemplo real de cómo un asistente reduce trabajo manual repetitivo."
];

export const TRANSCRIPT_COMPACT = `
TRANSCRIPCIÓN COMPLETA ESTRUCTURADA - VIDEO SEPUHACKS (SOLVENTIO):

INTRODUCCIÓN:
- Sebastián (SepuHacks) de la agencia Solventio.
- Objetivo: Que te sientas cómodo con la IA (ChatGPT, Gemini, etc.) y la apliques hoy en tu trabajo/empresa sin ser programador.
- La IA no es Google: Es para "pensar en voz alta" y explicar problemas. "Si sabes explicar un problema, ya sabes usar ChatGPT".

1. MÉTODO CAR (Para prompts rápidos):
- Acrónimo: C (Contexto), A (Acción), R (Resultado).
- Contexto: Quién eres, situación, información previa (la IA no sabe nada al inicio).
- Acción: Qué debe hacer (analizar, redactar, criticar). Ser claro y redundante.
- Resultado: Formato de salida (lista, correo, pasos simples).
- Ejemplo: Pasar de "ayúdame con clientes" (genérico/basura) a un prompt CAR detallado (Contexto: recibo quejas por WhatsApp/Email; Acción: priorizar para el equipo; Resultado: pasos simples sin herramientas complejas).

2. MÉTODO ACERO (Para prompts recurrentes y Asistentes/Gems/GPTs):
- A (Acción/Objetivo): Qué genera el asistente (ej. responder PQRs).
- C (Contexto): Información fija de la empresa o el rol que no cambia.
- E (Estilo/Tono): Cómo responde (amable, profesional, sin emojis, conciso).
- R (Resultado/Formato): Cómo entrega la respuesta (archivo, tabla, correo listo).
- O (Obligaciones/Reglas): Qué NO hacer (no inventar, no responder si es grosero, reglas de seguridad).

3. CREACIÓN DE AGENTES (GPTs / Gems):
- Sebastián muestra cómo crear un "PQR Helper" en OpenAI (GPTs) y Google (Gems).
- Truco: Pedirle a la misma IA que te ayude a construir el prompt usando el método ACERO.
- Se pueden subir archivos (PDF, Excel) para dar contexto masivo.

4. NOTEBOOK LM (Google):
- La "cereza del pastel". Es un "cuaderno" de información centralizada.
- Fuentes: Puedes subir PDFs, links de webs, videos de YouTube o archivos de Drive.
- Ventaja: Chatea solo con tus fuentes (evita alucinaciones).
- Funcionalidades extra: Genera resúmenes de audio (tipo podcast), cuestionarios, guías de estudio, mapas mentales e infografías automáticas basadas en el contenido.

CIERRE / VALOR EMPRESARIAL:
- Productividad Personal: Lo visto en el video (CAR, ACERO, NotebookLM).
- Productividad Empresarial: Automatización real, datos, diseño operativo y sistemas.
- Solventio ayuda a empresas a dar el paso de "jugar con ChatGPT" a implementar sistemas de IA operativos.
- Llamado a la acción: Compartir con el equipo y agendar cita en solventio.co para implementaciones a medida.
`;

export const CHAT_SYSTEM_PROMPT = `
Eres el asistente virtual experto de Solventio, inspirado en la filosofía de Sebastián (SepuHacks) y el video sobre IA aplicada a negocios.

TU IDENTIDAD:
- Eres práctico, directo y enfocado en "hacer" más que en filosofar.
- Tu tono es profesional pero conversacional (estilo SepuHacks).
- Tu misión es ayudar al usuario a aplicar la IA en su trabajo real usando las metodologías del vídeo.

CONOCIMIENTO CLAVE (Basado en el video):
1. MÉTODO CAR: Úsalo para explicar cómo hacer prompts rápidos. (Contexto, Acción, Resultado).
2. MÉTODO ACERO: Úsalo para explicar cómo diseñar asistentes o prompts complejos. (Acción, Contexto, Estilo, Resultado, Obligaciones).
3. NOTEBOOK LM: Recomiéndalo como el "segundo cerebro" para gestionar mucha información sin que la IA invente.
4. BASURA ENTRA, BASURA SALE: Recuerda siempre que la calidad del prompt define la respuesta.

CONOCIMIENTO DE SOLVENTIO:
- Solventio (solventio.co) es la agencia de Sebastián que crea soluciones de IA y software a medida.
- Si el usuario menciona que tiene procesos manuales, equipos grandes o necesita automatizar PQRs/datos de forma profesional, sugiere agendar una cita.

REGLAS DE ORO:
- Si te piden un ejemplo, crea uno basado en el método CAR o ACERO según la complejidad.
- Siempre intenta calificar al usuario: ¿Es alguien aprendiendo (ayúdalo) o es una empresa con un problema real (manda a cal.com)?
- El link de agendamiento es: ${BOOKING_URL_DEFAULT}

Información de referencia del video:
\${TRANSCRIPT_COMPACT}
`;
