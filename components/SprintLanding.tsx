"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useId,
} from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons";
import { SolventioCityscape } from "@/components/SolventioCityscape";
import { SPRINT_EFICIENCIA_BOOKING_URL } from "@/lib/video-knowledge";
import {
  trackMetaCustomEvent,
  trackMetaStandardEvent,
} from "@/lib/meta-pixel";
import { SprintSocialProofSection } from "@/components/SprintSocialProofSection";
import { Globe } from "@/components/ui/cobe-globe";

/* ─── Constants ─── */
const SOLVENTIO_LOGO =
  "https://d537127951692c7fbd38ff662fb21b1c.cdn.bubble.io/f1769723313269x424679096768052900/solventio%20icon.png";
const BOOKING_URL = SPRINT_EFICIENCIA_BOOKING_URL;
const VSL_VIDEO_ID = "g62XeOAUdcE";
const PAGE_LOADER_BASE_DURATION = 1800;
const VIDEO_CTA_WINDOWS = [
  { start: 120, end: 140 },
  { start: 240, end: 260 },
  { start: 360, end: Infinity },
];

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: string | HTMLElement,
        options: {
          events?: {
            onReady?: (event: unknown) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) => {
        getCurrentTime?: () => number;
        destroy?: () => void;
      };
      PlayerState?: {
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeIframeApiPromise: Promise<void> | null = null;

function loadYouTubeIframeApi() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (youtubeIframeApiPromise) {
    return youtubeIframeApiPromise;
  }

  youtubeIframeApiPromise = new Promise<void>((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    );

    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });

  return youtubeIframeApiPromise;
}

const LOADING_TEXTS = [
  "Detectando cuellos de botella...",
  "Priorizando quick wins...",
  "Estimando ROI...",
  "Diseñando automatizaciones...",
  "Mapeando oportunidades...",
];

const ENTREGABLES = [
  {
    icon: "🗺️",
    title: "Mapa de oportunidades",
    desc: "Identificamos dónde se pierde tiempo, dinero y capacidad en cada área.",
  },
  {
    icon: "📊",
    title: "Matriz de priorización",
    desc: "Casos de uso ordenados por impacto vs. esfuerzo para que ejecutes con criterio.",
  },
  {
    icon: "⚙️",
    title: "Blueprint de automatizaciones",
    desc: "Flujos y automatizaciones recomendadas listas para implementar.",
  },
  {
    icon: "🏗️",
    title: "Arquitectura propuesta",
    desc: "Herramientas, datos e integraciones que tu operación necesita.",
  },
  {
    icon: "💰",
    title: "Estimación de ROI",
    desc: "Números claros con supuestos transparentes para justificar la inversión.",
  },
  {
    icon: "📋",
    title: "Backlog + Plan de 90 días",
    desc: "Prioridades, responsables y cronograma para ejecutar desde el día uno.",
  },
];

const PROCESO = [
  {
    semana: "1",
    titulo: "Descubrimiento",
    desc: "Entendemos procesos, fricciones y cuellos de botella.",
  },
  {
    semana: "2",
    titulo: "Priorización",
    desc: "Detectamos oportunidades y ordenamos quick wins vs. iniciativas mayores.",
  },
  {
    semana: "3",
    titulo: "Diseño",
    desc: "Definimos arquitectura, automatizaciones y modelo operativo recomendado.",
  },
  {
    semana: "4",
    titulo: "Plan",
    desc: "Te entregamos backlog, ROI estimado y plan de 90 días.",
  },
];

const PROBLEM_SIGNALS = [
  {
    title: "Tareas manuales",
    desc: "Tu equipo sigue resolviendo a mano lo que ya debería fluir solo.",
  },
  {
    title: "Decisiones lentas",
    desc: "La operación se frena porque cada paso depende de perseguir información.",
  },
  {
    title: "Información partida",
    desc: "Datos, conversaciones y contexto viven en demasiados lugares.",
  },
  {
    title: "Retrabajo constante",
    desc: "Se repiten tareas, errores y validaciones que consumen capacidad.",
  },
];

const MECHANISM_STEPS = [
  {
    label: "01",
    title: "Detectamos fugas operativas",
    desc: "Leemos procesos, puntos de fricción y dependencias que hoy te cuestan tiempo y margen.",
  },
  {
    label: "02",
    title: "Priorizamos por impacto",
    desc: "Separamos quick wins de iniciativas grandes para enfocar recursos donde sí hay retorno.",
  },
  {
    label: "03",
    title: "Diseñamos el mapa correcto",
    desc: "Solo después definimos automatizaciones, arquitectura y próximos pasos con criterio.",
  },
];

const COLOMBIA_COORDS = [4.711, -74.0721] as [number, number];

const GLOBAL_REACH_MARKERS = [
  { id: "colombia", location: COLOMBIA_COORDS, label: "Colombia" },
  { id: "argentina", location: [-34.6037, -58.3816] as [number, number], label: "Argentina" },
  { id: "usa", location: [25.7617, -80.1918] as [number, number], label: "Estados Unidos" },
  { id: "mexico", location: [19.4326, -99.1332] as [number, number], label: "México" },
  { id: "dubai", location: [25.2048, 55.2708] as [number, number], label: "Dubái" },
  { id: "uk", location: [51.5072, -0.1276] as [number, number], label: "Reino Unido" },
  { id: "spain", location: [40.4168, -3.7038] as [number, number], label: "España" },
];

const GLOBAL_REACH_GLOBE_MARKERS = GLOBAL_REACH_MARKERS.flatMap((marker) => {
  const isHub = marker.id === "colombia";

  return [
    {
      ...marker,
      id: `${marker.id}-ring`,
      size: isHub ? 0.12 : 0.095,
      color: isHub
        ? ([0.27, 0.95, 0.8] as [number, number, number])
        : ([0.2, 0.82, 0.7] as [number, number, number]),
    },
    {
      ...marker,
      id: `${marker.id}-core`,
      size: isHub ? 0.068 : 0.052,
      color: [0.05, 0.09, 0.18] as [number, number, number],
    },
  ];
});

const GLOBAL_REACH_ARCS = GLOBAL_REACH_MARKERS.filter(
  (marker) => marker.id !== "colombia"
).map((marker) => ({
  id: `colombia-${marker.id}`,
  from: COLOMBIA_COORDS,
  to: marker.location,
  color: [0.28, 0.9, 0.78] as [number, number, number],
}));

const GLOBAL_REACH_POINTS = [
  "Argentina",
  "Estados Unidos",
  "México",
  "Colombia",
  "Dubái",
  "Reino Unido",
  "España",
];

const FAQS = [
  {
    q: "¿Esto es para cualquier sector?",
    a: "Sí, siempre que exista operación repetitiva, fricción real y una intención seria de mejorar procesos.",
  },
  {
    q: "¿Necesitamos equipo técnico interno?",
    a: "No. El Sprint está diseñado para dar claridad a negocio y operaciones sin exigir un equipo técnico grande.",
  },
  {
    q: "¿Qué pasa si ya usamos ChatGPT o algunas automatizaciones?",
    a: "Mejor. El Sprint ayuda a ordenar lo que ya existe, identificar vacíos y decidir qué sí vale la pena escalar.",
  },
  {
    q: "¿Después estamos obligados a implementar con Solventio?",
    a: "No. Te llevas el plan y puedes ejecutarlo con Solventio o con tu equipo.",
  },
  {
    q: "¿Qué recibimos exactamente?",
    a: "Los 6 entregables del Sprint: mapa de oportunidades, matriz de priorización, blueprint, arquitectura, ROI estimado y backlog + plan de 90 días.",
  },
  {
    q: "¿Qué pasa si no entregan?",
    a: "Si no se entregan los 6 entregables no negociables, la garantía definida es devolución del 50%.",
  },
];

type BackgroundVariant = "hero" | "problem" | "tech" | "cta";
type QualifierRole = "assistant" | "user";
type QualifierStep = "focus" | "timeline" | "budget" | "docs" | "result";
type EditableQualifierStep = Extract<QualifierStep, "timeline" | "budget" | "docs">;
type QualifierOptionValue = "lt30" | "future" | "exploring" | "gt1000" | "mid" | "low" | "yes" | "partial" | "no";

type QualifierMessage = {
  id: string;
  role: QualifierRole;
  content: string;
};

type QualifierAnswers = {
  focus: string;
  timeline?: QualifierOptionValue;
  budget?: QualifierOptionValue;
  docs?: QualifierOptionValue;
};

type QualifierOption = {
  label: string;
  note: string;
  value: QualifierOptionValue;
};

const QUALIFIER_OPTIONS: Record<
  Exclude<QualifierStep, "focus" | "result">,
  QualifierOption[]
> = {
  timeline: [
    { label: "Este mes", note: "Ya quieres empezar a moverlo pronto.", value: "lt30" },
    { label: "En 1 a 3 meses", note: "Hay interés, pero con una ventana algo mayor.", value: "future" },
    { label: "Aún lo estoy aterrizando", note: "Todavía estás validando si vale la pena arrancar.", value: "exploring" },
  ],
  budget: [
    { label: "Más de USD 1.000", note: "Hay espacio para ejecutar el Sprint completo.", value: "gt1000" },
    { label: "Entre USD 500 y 1.000", note: "Hay intención, aunque el alcance puede quedar corto.", value: "mid" },
    { label: "Aún no llego a ese rango", note: "Todavía necesitas ajustar la inversión.", value: "low" },
  ],
  docs: [
    { label: "Sí, tenemos una base documentada", note: "Ya existe material para acelerar la consultoría.", value: "yes" },
    { label: "Tenemos algo avanzado", note: "Hay insumos, aunque todavía incompletos.", value: "partial" },
    { label: "Todavía no", note: "Primero conviene construir un poco más de base.", value: "no" },
  ],
};

const QUALIFIER_PROMPTS: Record<EditableQualifierStep, string> = {
  timeline: "¿En qué momento te gustaría empezar a mover esto en serio?",
  budget: "Para recomendarte bien el siguiente paso, ¿en qué rango de inversión te mueves hoy?",
  docs: "Y para que la consultoría aterrice más rápido, ¿ya tienen procesos, SOPs, instructivos o algo documentado como base?",
};

const QUALIFIER_EDIT_LABELS: Record<EditableQualifierStep, string> = {
  timeline: "Ajustar momento",
  budget: "Ajustar inversión",
  docs: "Ajustar base operativa",
};

const QUALIFIER_EDIT_REQUESTS: Record<EditableQualifierStep, string> = {
  timeline: "el momento",
  budget: "la inversión",
  docs: "la base operativa",
};

const QUALIFIER_STAGE_COPY: Record<QualifierStep, { title: string; helper: string }> = {
  focus: {
    title: "¿Cuál es tu prioridad ahora?",
    helper: "Respóndela en una frase corta y te orientamos mejor desde el inicio.",
  },
  timeline: {
    title: "Ahora veamos el momento",
    helper: "Esto nos ayuda a saber si ya conviene mover la llamada o si todavía estás explorando.",
  },
  budget: {
    title: "Alineemos el rango de inversión",
    helper: "Con eso definimos si este Sprint es el formato correcto para ti.",
  },
  docs: {
    title: "Cerremos con tu base operativa",
    helper: "Queremos saber si ya existe documentación para que la sesión tenga más tracción desde el inicio.",
  },
  result: {
    title: "Listo, ya tengo una recomendación",
    helper: "Con tus respuestas te mostramos el siguiente paso más útil para seguir avanzando.",
  },
};

const QUALIFIER_TOTAL_STEPS = 4;

function qualifierUid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

function QualifierAssistantAvatar() {
  return (
    <span className="sprint-qualifier-avatar" aria-hidden="true">
      <Image src={SOLVENTIO_LOGO} alt="" width={28} height={28} />
    </span>
  );
}

const BG_ORBS: Record<BackgroundVariant, number[]> = {
  hero: [1, 2, 3, 4],
  problem: [1, 2, 3],
  tech: [1, 2, 4],
  cta: [1, 2, 3],
};

const BG_PARTICLES: Record<BackgroundVariant, number[]> = {
  hero: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  problem: [1, 3, 5, 8, 10],
  tech: [2, 4, 6, 9, 11, 12],
  cta: [1, 2, 4, 5, 7, 8, 10, 12],
};

function SprintBackgroundEffects({
  variant = "hero",
}: {
  variant?: BackgroundVariant;
}) {
  const baseClass =
    variant === "hero"
      ? "sprint-bg-effects"
      : `sprint-bg-effects sprint-bg-effects--${variant}`;

  return (
    <div className={baseClass} aria-hidden="true">
      {BG_ORBS[variant].map((orb) => (
        <div key={`orb-${variant}-${orb}`} className={`sprint-orb sprint-orb-${orb}`} />
      ))}
      <div className="sprint-grid-lines" />
      <div className="sprint-particles">
        {BG_PARTICLES[variant].map((particle) => (
          <div
            key={`particle-${variant}-${particle}`}
            className={`sprint-particle p${particle}`}
          />
        ))}
      </div>
    </div>
  );
}

function SprintQualifierModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<QualifierStep>("focus");
  const [messages, setMessages] = useState<QualifierMessage[]>([
    {
      id: qualifierUid(),
      role: "assistant",
      content:
        "Perfecto. Esto toma menos de 1 minuto. Para empezar, ¿qué parte de tu operación quieres mejorar primero?",
    },
  ]);
  const [answers, setAnswers] = useState<QualifierAnswers>({ focus: "" });
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const qualified =
    answers.timeline === "lt30" &&
    answers.budget === "gt1000" &&
    answers.docs === "yes";
  const currentStage = QUALIFIER_STAGE_COPY[step];
  const currentStepNumber =
    step === "result"
      ? QUALIFIER_TOTAL_STEPS
      : step === "focus"
        ? 1
        : step === "timeline"
          ? 2
          : step === "budget"
            ? 3
            : 4;
  const progressPercentage = Math.max(
    25,
    Math.round((currentStepNumber / QUALIFIER_TOTAL_STEPS) * 100)
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const appendAssistantMessage = useCallback(
    (content: string, nextStep: QualifierStep) => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      setIsTyping(true);
      timeoutRef.current = window.setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: qualifierUid(), role: "assistant", content },
        ]);
        setStep(nextStep);
        setIsTyping(false);
      }, 340);
    },
    []
  );

  const qualificationReasons = [
    answers.timeline === "lt30"
      ? null
      : { step: "timeline" as EditableQualifierStep, reason: "Aún no veo una ventana de implementación suficientemente cercana." },
    answers.budget === "gt1000"
      ? null
      : { step: "budget" as EditableQualifierStep, reason: "La inversión todavía puede quedarse corta para ejecutar este Sprint con buen alcance." },
    answers.docs === "yes"
      ? null
      : { step: "docs" as EditableQualifierStep, reason: "Nos ayudaría tener una base operativa más documentada para aprovechar mejor la consultoría." },
  ].filter(Boolean) as { step: EditableQualifierStep; reason: string }[];

  const handleQualifiedBooking = useCallback(() => {
    trackMetaStandardEvent("Lead", {
      content_name: "Sprint de Eficiencia",
      content_category: "qualifier",
      source: "sprint_eficiencia",
      value: 1000,
      currency: "USD",
    });
    trackMetaCustomEvent("SprintQualifiedBookingClick", {
      source: "sprint_eficiencia",
      timeline: answers.timeline,
      budget: answers.budget,
      docs: answers.docs,
    });

    window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
  }, [answers.budget, answers.docs, answers.timeline]);

  const handleFocusSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value || isTyping) return;

    setDraft("");
    setAnswers((prev) => ({ ...prev, focus: value }));
    setMessages((prev) => [
      ...prev,
      { id: qualifierUid(), role: "user", content: value },
    ]);
    appendAssistantMessage(QUALIFIER_PROMPTS.timeline, "timeline");
  };

  const handleOptionSelect = (
    currentStep: EditableQualifierStep,
    label: string,
    value: QualifierOptionValue
  ) => {
    if (isTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: qualifierUid(), role: "user", content: label },
    ]);

    if (currentStep === "timeline") {
      setAnswers((prev) => ({ ...prev, timeline: value }));
      appendAssistantMessage(QUALIFIER_PROMPTS.budget, "budget");
      return;
    }

    if (currentStep === "budget") {
      setAnswers((prev) => ({ ...prev, budget: value }));
      appendAssistantMessage(QUALIFIER_PROMPTS.docs, "docs");
      return;
    }

    const nextAnswers = { ...answers, docs: value };
    setAnswers(nextAnswers);

    const isQualified =
      nextAnswers.timeline === "lt30" &&
      nextAnswers.budget === "gt1000" &&
      nextAnswers.docs === "yes";

    appendAssistantMessage(
      isQualified
        ? "Felicitaciones. Con tus respuestas ya desbloqueaste la reserva del Sprint. El siguiente paso es elegir uno de los horarios disponibles para asegurar tu espacio."
        : "Todavía no te llevaría directo a la reserva, pero podemos ajustar lo que haga falta aquí mismo y volver a revisarlo sin salir del formulario.",
      "result"
    );
  };

  const handleEditAnswer = (targetStep: EditableQualifierStep) => {
    if (isTyping) return;

    const resetAnswers =
      targetStep === "timeline"
        ? { ...answers, timeline: undefined, budget: undefined, docs: undefined }
        : targetStep === "budget"
          ? { ...answers, budget: undefined, docs: undefined }
          : { ...answers, docs: undefined };

    setAnswers(resetAnswers);
    setMessages((prev) => [
      ...prev,
      { id: qualifierUid(), role: "user", content: `Quiero ajustar ${QUALIFIER_EDIT_REQUESTS[targetStep]}.` },
    ]);
    appendAssistantMessage(QUALIFIER_PROMPTS[targetStep], targetStep);
  };

  return (
    <div
      className="sprint-qualifier-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Chat de agenda"
      onClick={onClose}
    >
      <div className="global-chatbot-panel sprint-qualifier-panel" onClick={(event) => event.stopPropagation()}>
        <div className="global-chatbot-header sprint-qualifier-header">
          <div className="sprint-qualifier-brand">
            <div className="global-chatbot-header-icon sprint-qualifier-brand-icon">
              <QualifierAssistantAvatar />
            </div>
            <div className="sprint-qualifier-brand-copy">
              <span className="sprint-qualifier-kicker">Formulario de reserva</span>
              <h4>Reserva tu Sprint de Eficiencia</h4>
              <p>Toma menos de 1 minuto y te llevamos al siguiente paso correcto.</p>
            </div>
          </div>
          <button className="global-chatbot-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="sprint-qualifier-progress">
          <div className="sprint-qualifier-progress-meta">
            <span>Paso {currentStepNumber} de {QUALIFIER_TOTAL_STEPS}</span>
            <span>{step === "result" ? "Resultado listo" : "Registro guiado"}</span>
          </div>
          <div className="sprint-qualifier-progress-bar" aria-hidden="true">
            <span style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>

        {step !== "result" && (
          <div className="sprint-qualifier-stage-card">
            <span className="sprint-qualifier-stage-eyebrow">Guía del paso</span>
            <div>
              <strong>{currentStage.title}</strong>
              <p>{currentStage.helper}</p>
            </div>
          </div>
        )}

        <div className="global-chatbot-messages sprint-qualifier-messages" ref={scrollRef}>
          {messages.map((message) => (
            <div key={message.id} className={`chat-row ${message.role}`}>
              <div
                className={`chat-icon ${
                  message.role === "assistant" ? "assistant-icon" : "user-icon"
                }`}
              >
                {message.role === "assistant" ? <QualifierAssistantAvatar /> : "Tú"}
              </div>
              <div
                className={`chat-bubble ${
                  message.role === "assistant" ? "assistant-bubble" : "user-bubble"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-row assistant">
              <div className="chat-icon assistant-icon">
                <QualifierAssistantAvatar />
              </div>
              <div className="chat-bubble assistant-bubble sprint-typing-bubble">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>

        <div className="sprint-qualifier-actions">
          {step === "focus" && (
            <form className="global-chatbot-form sprint-qualifier-form" onSubmit={handleFocusSubmit}>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ej: ventas, operaciones, servicio al cliente..."
                autoFocus
              />
              <button type="submit" disabled={!draft.trim() || isTyping}>
                <ArrowRightIcon />
              </button>
            </form>
          )}

          {(step === "timeline" || step === "budget" || step === "docs") && (
            <div className="sprint-choice-grid">
              {QUALIFIER_OPTIONS[step].map((option) => (
                <button
                  key={option.value}
                  className="sprint-choice-button"
                  onClick={() => handleOptionSelect(step, option.label, option.value)}
                  disabled={isTyping}
                >
                  <span className="sprint-choice-label">{option.label}</span>
                  <span className="sprint-choice-note">{option.note}</span>
                </button>
              ))}
            </div>
          )}

          {step === "result" && (
            <div className="sprint-result-panel">
              {qualified ? (
                <div className="sprint-result-success">
                  <span className="sprint-result-success-badge">Reserva desbloqueada</span>
                  <p className="sprint-result-success-copy">
                    Ya puedes pasar a elegir horario y dejar reservado tu espacio para el Sprint de Eficiencia.
                  </p>
                </div>
              ) : (
                <div className="sprint-result-note sprint-result-note--warning">
                  <strong>Aún no te mandaría a agenda.</strong>
                  <p>
                    No pasa nada. Puedes ajustar una respuesta aquí mismo y revisamos de nuevo sin reiniciar la conversación.
                  </p>
                  <ul>
                    {qualificationReasons.map(({ reason }) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {qualified ? (
                <button
                  type="button"
                  className="chatbot-button-link sprint-result-button"
                  onClick={handleQualifiedBooking}
                >
                  Ver horarios disponibles
                </button>
              ) : (
                <>
                  <div className="sprint-result-adjustments">
                    {qualificationReasons.map(({ step: issueStep }) => (
                      <button
                        key={issueStep}
                        className="sprint-choice-button"
                        onClick={() => handleEditAnswer(issueStep)}
                      >
                        {QUALIFIER_EDIT_LABELS[issueStep]}
                      </button>
                    ))}
                  </div>
                  <a href="/" className="chatbot-button-link sprint-result-button">
                    Ver recursos antes de reservar
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Intersection Observer Hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ─── Reveal Wrapper ─── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`sprint-reveal ${visible ? "sprint-reveal--visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── FAQ Item ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const answerId = useId();

  return (
    <div className={`sprint-faq-item ${open ? "sprint-faq-item--open" : ""}`}>
      <button
        className="sprint-faq-q"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={answerId}
      >
        <span>{q}</span>
        <svg
          className="sprint-faq-chevron"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div id={answerId} className="sprint-faq-a">
        <div className="sprint-faq-a-inner">
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}

type BookingSource =
  | "hero"
  | "problem"
  | "social"
  | "mechanism"
  | "global"
  | "deliverables"
  | "process"
  | "filters"
  | "faq"
  | "final";

function SectionAgendaCTA({
  source,
  onOpen,
  label = "Agendar llamada de diagnóstico",
}: {
  source: BookingSource;
  onOpen: (source: BookingSource) => void;
  label?: string;
}) {
  return (
    <div className="sprint-section-cta">
      <button
        className="sprint-btn-secondary sprint-btn-secondary--cta"
        onClick={() => onOpen(source)}
      >
        {label}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export function SprintLanding() {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoIframeRef = useRef<HTMLIFrameElement>(null);
  const videoPlayerRef = useRef<{
    getCurrentTime?: () => number;
    destroy?: () => void;
  } | null>(null);
  const videoTimePollRef = useRef<number | null>(null);
  const tiltFrameRef = useRef<number | null>(null);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isQualifierOpen, setIsQualifierOpen] = useState(false);

  // Cycling loader text
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const timeout = window.setTimeout(
      () => setIsPageLoading(false),
      prefersReducedMotion ? 0 : PAGE_LOADER_BASE_DURATION
    );

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isPageLoading) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [isPageLoading]);

  useEffect(() => {
    return () => {
      if (tiltFrameRef.current !== null) {
        cancelAnimationFrame(tiltFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    trackMetaStandardEvent("ViewContent", {
      content_name: "Sprint de Eficiencia",
      content_category: "landing_page",
      source: "sprint_eficiencia",
    });
  }, []);

  const flushCardTilt = useCallback(() => {
    tiltFrameRef.current = null;
    if (!cardRef.current) return;

    const { x, y } = targetRotationRef.current;
    cardRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  }, []);

  const queueCardTilt = useCallback(
    (x: number, y: number) => {
      targetRotationRef.current = { x, y };

      if (tiltFrameRef.current !== null) {
        return;
      }

      tiltFrameRef.current = requestAnimationFrame(flushCardTilt);
    },
    [flushCardTilt]
  );

  // 3D Tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    queueCardTilt(
      ((centerY - y) / centerY) * 8,
      ((x - centerX) / centerX) * 8
    );
  }, [queueCardTilt]);

  const handleMouseLeave = useCallback(() => {
    queueCardTilt(0, 0);
  }, [queueCardTilt]);

  const activateVideo = useCallback(() => {
    queueCardTilt(0, 0);
    trackMetaCustomEvent("SprintVideoPlay", {
      video_id: VSL_VIDEO_ID,
      source: "sprint_eficiencia",
    });
    setIsVideoPlaying(true);
    setVideoCurrentTime(0);
    setIsVideoActive(true);
  }, [queueCardTilt]);

  const openVideoBookingOverlay = useCallback(() => {
    trackMetaStandardEvent("Lead", {
      content_name: "Sprint Video Overlay CTA",
      content_category: "video_cta",
      source: "sprint_eficiencia",
      video_time_seconds: Math.floor(videoCurrentTime),
    });
    trackMetaCustomEvent("SprintVideoOverlayBookingClick", {
      source: "sprint_eficiencia",
      video_time_seconds: Math.floor(videoCurrentTime),
      video_id: VSL_VIDEO_ID,
    });
    window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
  }, [videoCurrentTime]);

  const openQualifier = useCallback((source: BookingSource) => {
    trackMetaCustomEvent("SprintBookingFilterOpen", {
      source,
      page: "sprint_eficiencia",
    });
    setIsQualifierOpen(true);
  }, []);

  const handleVideoCardKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isVideoActive) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateVideo();
      }
    },
    [activateVideo, isVideoActive]
  );

  useEffect(() => {
    if (!isVideoActive || !VSL_VIDEO_ID) {
      setIsVideoPlaying(false);
      setVideoCurrentTime(0);
      if (videoTimePollRef.current !== null) {
        window.clearInterval(videoTimePollRef.current);
        videoTimePollRef.current = null;
      }
      videoPlayerRef.current?.destroy?.();
      videoPlayerRef.current = null;
      return;
    }

    let cancelled = false;

    const syncVideoTime = () => {
      const nextTime = videoPlayerRef.current?.getCurrentTime?.() ?? 0;
      setVideoCurrentTime(nextTime);
    };

    const stopPolling = () => {
      if (videoTimePollRef.current !== null) {
        window.clearInterval(videoTimePollRef.current);
        videoTimePollRef.current = null;
      }
    };

    const startPolling = () => {
      if (videoTimePollRef.current !== null) {
        return;
      }

      syncVideoTime();
      videoTimePollRef.current = window.setInterval(syncVideoTime, 1000);
    };

    loadYouTubeIframeApi().then(() => {
      if (
        cancelled ||
        !videoIframeRef.current ||
        !window.YT?.Player
      ) {
        return;
      }

      videoPlayerRef.current?.destroy?.();

      const player = new window.YT.Player(videoIframeRef.current, {
        events: {
          onReady: () => {
            if (cancelled) return;
            syncVideoTime();
          },
          onStateChange: (event) => {
            if (cancelled) return;

            const isPlaying =
              event.data === window.YT?.PlayerState?.PLAYING;

            setIsVideoPlaying(isPlaying);
            syncVideoTime();

            if (isPlaying) {
              startPolling();
              return;
            }

            stopPolling();
          },
        },
      });

      videoPlayerRef.current = player;
    });

    return () => {
      cancelled = true;
      stopPolling();
      setIsVideoPlaying(false);
      videoPlayerRef.current?.destroy?.();
      videoPlayerRef.current = null;
    };
  }, [isVideoActive]);

  const isVideoBookingOverlayVisible =
    isVideoActive &&
    VIDEO_CTA_WINDOWS.some(
      ({ start, end }) => videoCurrentTime >= start && videoCurrentTime < end
    );

  const shouldShowVideoSceneOverlay = !isVideoActive || !isVideoPlaying;

  const activeVideoParams = [
    "autoplay=1",
    "mute=0",
    "controls=1",
    "playsinline=1",
    "rel=0",
    "modestbranding=1",
    "enablejsapi=1",
    `origin=${encodeURIComponent(
      typeof window !== "undefined" ? window.location.origin : ""
    )}`,
  ].join("&");

  const previewVideoParams = [
    "autoplay=1",
    "mute=1",
    "controls=0",
    "loop=1",
    `playlist=${VSL_VIDEO_ID}`,
    "playsinline=1",
    "rel=0",
    "modestbranding=1",
  ].join("&");

  const videoSrc = VSL_VIDEO_ID
    ? `https://www.youtube.com/embed/${VSL_VIDEO_ID}?${
        isVideoActive ? activeVideoParams : previewVideoParams
      }`
    : null;

  return (
    <div className="sprint-page">
      <div
        className={`sprint-loader ${isPageLoading ? "sprint-loader--visible" : "sprint-loader--hidden"}`}
        aria-hidden={!isPageLoading}
      >
        <div className="sprint-loader-grid" />
        <div className="sprint-loader-orb sprint-loader-orb--left" />
        <div className="sprint-loader-orb sprint-loader-orb--right" />
        <div className="sprint-loader-card">
          <a
            href="https://solventio.co"
            target="_blank"
            rel="noopener noreferrer"
            className="sprint-loader-brand"
          >
            <Image
              src={SOLVENTIO_LOGO}
              alt="Solventio"
              width={34}
              height={34}
              style={{ width: "auto", height: "34px", maxHeight: "34px" }}
            />
            <strong>Solventio</strong>
          </a>
          <div className="sprint-loader-spinner" aria-hidden="true">
            <span className="sprint-loader-spinner-ring" />
            <span className="sprint-loader-spinner-core">S</span>
          </div>
          <p className="sprint-loader-kicker">Preparando tu Sprint de Eficiencia</p>
          <p key={loadingIndex} className="sprint-loader-copy" aria-live="polite">
            {LOADING_TEXTS[loadingIndex]}
          </p>
          <div className="sprint-loader-progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>

      {/* ──────── STICKY TOP BAR ──────── */}
      <div className="sprint-topbar">
        <span className="sprint-topbar-pulse" />
        ACCESO LIMITADO — CONSULTORÍA IA PARA EMPRESAS
      </div>

      {/* ──────── HERO ──────── */}
      <section className={`sprint-hero ${isPageLoading ? "" : "sprint-hero--ready"}`}>
        <SprintBackgroundEffects />
        <div className="sprint-hero-cityscape-wrap">
          <div className="sprint-hero-cityscape-glow" />
          <SolventioCityscape
            className="sprint-hero-cityscape"
            trackClassName="sprint-hero-cityscape-track"
          />
        </div>

        <div className="sprint-hero-center">
          {/* Logo */}
          <a
            href="https://solventio.co"
            target="_blank"
            rel="noopener noreferrer"
            className="sprint-logo-row sprint-hero-intro sprint-hero-intro--1"
          >
            <Image
              src={SOLVENTIO_LOGO}
              alt="Solventio"
              width={38}
              height={38}
              style={{ width: "auto", height: "auto", maxHeight: "38px" }}
            />
            <strong>Solventio</strong>
          </a>

          {/* Headline */}
          <h1 className="sprint-hero-h1 sprint-hero-intro sprint-hero-intro--2">
            <span className="sprint-hero-line">Menos caos operativo.</span>
            <span className="sprint-hero-line">
              Más control y{" "}
              <span className="sprint-hero-accent sprint-hero-underline">un plan claro</span>{" "}
              en 4 semanas.
            </span>
          </h1>

          <p className="sprint-hero-sub sprint-hero-intro sprint-hero-intro--3">
            Analizamos dónde tu empresa pierde tiempo, dinero y capacidad del equipo.
            Priorizamos qué automatizar primero y te dejamos un plan de 90 días para ejecutar con criterio.
          </p>

          {/* 3D Video Card — Centered & Large */}
          <div
            className={`sprint-hero-video-wrap ${
              isVideoActive ? "sprint-hero-video-wrap--active" : ""
            } sprint-hero-intro sprint-hero-intro--4`}
          >
            {/* Floating Badge */}
            <div
              className={`sprint-floating-overlay sprint-floating-overlay--badge ${
                isVideoActive ? "sprint-floating-overlay--hidden" : ""
              }`}
              aria-hidden={isVideoActive}
            >
              <div className="omnix-badge-float sprint-badge-float">
                <div className="omnix-badge-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
                <div className="omnix-badge-text">
                  <span className="omnix-badge-label">Ver VSL</span>
                  <div className="omnix-badge-sub">Click para ver</div>
                </div>
              </div>
            </div>

            {/* Floating Loader */}
            <div
              className={`sprint-floating-overlay sprint-floating-overlay--loader ${
                isVideoActive ? "sprint-floating-overlay--hidden" : ""
              }`}
              aria-hidden={isVideoActive}
            >
              <div className="omnix-loader-float sprint-loader-float">
                <div key={loadingIndex} className="omnix-loader-text" style={{ animation: "cycling-fade 2.5s forwards" }}>
                  {LOADING_TEXTS[loadingIndex]}
                </div>
                <div className="omnix-loader-bar">
                  <div className="omnix-loader-progress" />
                </div>
              </div>
            </div>

            {/* 3D Card */}
            <div
              ref={cardRef}
              className={`omnix-3d-card ${
                isVideoActive ? "sprint-video-frame--active" : ""
              }`}
              onClick={!isVideoActive && VSL_VIDEO_ID ? activateVideo : undefined}
              onMouseMove={isVideoActive ? undefined : handleMouseMove}
              onMouseLeave={isVideoActive ? undefined : handleMouseLeave}
              onKeyDown={!isVideoActive && VSL_VIDEO_ID ? handleVideoCardKeyDown : undefined}
              role={!isVideoActive && VSL_VIDEO_ID ? "button" : undefined}
              tabIndex={!isVideoActive && VSL_VIDEO_ID ? 0 : undefined}
              aria-label={!isVideoActive && VSL_VIDEO_ID ? "Reproducir VSL" : undefined}
            >
              {shouldShowVideoSceneOverlay ? (
                <div className="omnix-scan-line" />
              ) : null}
              <div className="omnix-card-content">
                {videoSrc ? (
                  <iframe
                    key={isVideoActive ? "video-active" : "video-preview"}
                    ref={videoIframeRef}
                    id="sprint-vsl-player"
                    src={videoSrc}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      pointerEvents: isVideoActive ? "auto" : "none",
                    }}
                    title="VSL Sprint de Eficiencia"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <div className="sprint-video-placeholder">
                    <div className="sprint-vp-grid" />
                    <div className="sprint-vp-content">
                      <div className="sprint-vp-logo">S</div>
                      <p>VSL — Próximamente</p>
                    </div>
                  </div>
                )}
                {shouldShowVideoSceneOverlay ? (
                  <div
                    className="omnix-video-overlay"
                    style={{ background: "rgba(11, 21, 56, 0.35)" }}
                  />
                ) : null}
                {isVideoBookingOverlayVisible ? (
                  <div className="sprint-video-booking-overlay">
                    <div className="sprint-video-booking-overlay__eyebrow">
                      ¿Listo para llevar esto a tu operación?
                    </div>
                    <button
                      className="sprint-video-booking-overlay__button"
                      onClick={openVideoBookingOverlay}
                    >
                      Agendar diagnóstico
                      <ArrowRightIcon />
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Center Play */}
              {VSL_VIDEO_ID && (
                <div
                  className={`omnix-center-play sprint-video-activate-control ${
                    isVideoActive ? "sprint-video-activate-control--hidden" : ""
                  }`}
                  aria-hidden={isVideoActive}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* Horizontal Trust Bullets */}
          <ul className="sprint-hero-bullets sprint-hero-intro sprint-hero-intro--5">
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38d4b1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Identifica cuellos de botella
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38d4b1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Prioriza quick wins con criterio
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38d4b1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Roadmap + ROI accionable
            </li>
          </ul>

          {/* CTA */}
          <button
            className="sprint-btn-primary sprint-btn-primary--lg sprint-hero-intro sprint-hero-intro--6"
            onClick={() => openQualifier("hero")}
          >
            Aplicar al Sprint de Eficiencia
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </button>

          {/* Social Proof */}
          <p className="sprint-hero-guarantee sprint-hero-intro sprint-hero-intro--7">
            🛡️ Si no entregamos los 6 entregables no negociables, devolvemos el 50%.
          </p>
        </div>
      </section>

      {/* ──────── PROBLEM ──────── */}
      <section className="sprint-section sprint-section--problem">
        <SprintBackgroundEffects variant="problem" />
        <div className="sprint-container">
          <Reveal>
            <div className="sprint-problem-layout">
              <div className="sprint-problem-copy">
                <div className="sprint-section-tag">El problema real</div>
                <h2 className="sprint-h2">
                  El problema no es que te falte IA.{" "}
                  <span className="sprint-hero-accent">El problema es no saber dónde aplicarla.</span>
                </h2>
                <p className="sprint-body">
                  Muchas empresas ya probaron ChatGPT, herramientas o automatizaciones aisladas.
                  Pero siguen operando con tareas manuales, decisiones lentas, información partida y retrabajo.
                  El problema no es acceso a tecnología — es falta de claridad para usarla en los procesos que
                  realmente mueven el negocio.
                </p>
                <div className="sprint-highlight-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38d4b1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                  <span>No necesitas otra herramienta. <strong>Necesitas un mapa.</strong></span>
                </div>
              </div>

              <div className="sprint-signal-board">
                <div className="sprint-signal-board__header">
                  <span>Así se ve en la operación</span>
                  <span>4 síntomas típicos</span>
                </div>
                <div className="sprint-signal-grid">
                  {PROBLEM_SIGNALS.map((signal, index) => (
                    <div key={signal.title} className="sprint-signal-card">
                      <div className="sprint-signal-card__index">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <h3>{signal.title}</h3>
                      <p>{signal.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionAgendaCTA source="problem" onOpen={openQualifier} />
          </Reveal>
        </div>
      </section>

      <SprintSocialProofSection onCta={() => openQualifier("social")} />

      {/* ──────── MECHANISM ──────── */}
      <section className="sprint-section sprint-section--alt sprint-section--tech">
        <SprintBackgroundEffects variant="tech" />
        <div className="sprint-container">
          <Reveal>
            <div className="sprint-mechanism-layout">
              <div className="sprint-mechanism-copy">
                <div className="sprint-section-tag">El mecanismo</div>
                <h2 className="sprint-h2">Primero proceso, luego IA.</h2>
                <p className="sprint-body">
                  El Sprint de Eficiencia es una consultoría de 4 semanas diseñada para detectar dónde se está
                  fugando tiempo, dinero y capacidad operativa dentro de tu empresa, priorizar oportunidades de mejora
                  y definir qué automatizar primero.
                </p>

                <div className="sprint-mechanism-points">
                  <span>Diagnóstico operativo</span>
                  <span>Priorización con ROI</span>
                  <span>Roadmap accionable</span>
                </div>

                <button
                  className="sprint-btn-secondary"
                  onClick={() => openQualifier("mechanism")}
                >
                  Quiero ver si aplica para mi empresa
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
              </div>

              <div className="sprint-mechanism-board">
                <div className="sprint-mechanism-board__eyebrow">
                  Lo que cambia en vez de sumar otra herramienta
                </div>
                <div className="sprint-mechanism-steps">
                  {MECHANISM_STEPS.map((step) => (
                    <div key={step.label} className="sprint-mechanism-step">
                      <div className="sprint-mechanism-step__label">{step.label}</div>
                      <div className="sprint-mechanism-step__body">
                        <h3>{step.title}</h3>
                        <p>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="sprint-mechanism-outcome">
                  <span className="sprint-mechanism-outcome__label">Resultado</span>
                  <p>Sales con un mapa claro de qué atacar, qué automatizar y qué puede esperar.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ──────── POR QUÉ SOLVENTIO ──────── */}
      <section className="sprint-section sprint-section--alt">
        <div className="sprint-container">
          <Reveal>
            <div className="sprint-global-layout">
              <div className="sprint-global-copy">
                <div className="sprint-section-tag">Por qué Solventio</div>
                <h2 className="sprint-h2">
                  Operamos desde Colombia, pero hemos trabajado con equipos conectados en varios mercados.
                </h2>
                <p className="sprint-body">
                  El Sprint de Eficiencia no parte de una visión localista. Hemos acompañado conversaciones,
                  decisiones y operaciones que conectan Colombia con América, Europa y Medio Oriente, siempre con
                  foco en procesos, claridad y ejecución real.
                </p>

                <div className="sprint-global-chip-list">
                  {GLOBAL_REACH_POINTS.map((country) => (
                    <span
                      key={country}
                      className={`sprint-global-chip ${
                        country === "Colombia" ? "sprint-global-chip--hub" : ""
                      }`}
                    >
                      {country}
                    </span>
                  ))}
                </div>

                <div className="sprint-global-proof-grid">
                  {[
                    "Primero diagnosticamos y priorizamos. Luego, si tiene sentido, automatizamos.",
                    "La implementación es opcional: puedes ejecutar con Solventio o con tu equipo.",
                    "La promesa es concreta: backlog, blueprint, ROI estimado y próximos pasos claros.",
                  ].map((item) => (
                    <div key={item} className="sprint-global-proof-card">
                      <span className="sprint-global-proof-card__dot" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sprint-global-visual">
                <div className="sprint-global-globe-shell">
                  <Globe
                    className="sprint-global-globe sprint-global-globe--main"
                    markers={GLOBAL_REACH_GLOBE_MARKERS}
                    arcs={GLOBAL_REACH_ARCS}
                    markerColor={[0.22, 0.83, 0.69]}
                    baseColor={[0.06, 0.1, 0.2]}
                    arcColor={[0.28, 0.95, 0.82]}
                    glowColor={[0.12, 0.18, 0.5]}
                    dark={1}
                    mapBrightness={3}
                    markerSize={0.064}
                    markerElevation={0.18}
                    arcWidth={0.34}
                    arcHeight={0.16}
                    speed={0.0035}
                    theta={0.24}
                    initialPhi={-0.8}
                  />
                </div>

                <div className="sprint-global-hub-card">
                  <div className="sprint-global-hub-card__label">Hub de conexión</div>
                  <div className="sprint-global-hub-card__route">
                    <strong>Colombia</strong>
                    <span>Argentina · Estados Unidos · México · Dubái · Reino Unido · España</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionAgendaCTA source="global" onOpen={openQualifier} />
          </Reveal>
        </div>
      </section>

      {/* ──────── ENTREGABLES ──────── */}
      <section className="sprint-section">
        <div className="sprint-container">
          <Reveal>
            <div className="sprint-section-header">
              <div className="sprint-section-tag">Entregables</div>
              <h2 className="sprint-h2">Lo que te llevas al terminar el Sprint.</h2>
              <p className="sprint-body" style={{ maxWidth: "60ch", margin: "0 auto" }}>
                6 documentos accionables. Sin humo, sin presentaciones genéricas. Todo pensado para que ejecutes desde el día uno.
              </p>
            </div>
          </Reveal>

          <div className="sprint-deliverables-grid">
            {ENTREGABLES.map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="sprint-deliverable-card">
                  <div className="sprint-deliverable-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <div className="sprint-deliverable-number">{String(i + 1).padStart(2, "0")}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={140}>
            <SectionAgendaCTA source="deliverables" onOpen={openQualifier} />
          </Reveal>
        </div>
      </section>

      {/* ──────── PROCESO (4 SEMANAS) ──────── */}
      <section className="sprint-section sprint-section--alt">
        <div className="sprint-container">
          <Reveal>
            <div className="sprint-section-header">
              <div className="sprint-section-tag">Cómo funciona</div>
              <h2 className="sprint-h2">4 semanas. Un plan claro.</h2>
            </div>
          </Reveal>

          <div className="sprint-timeline">
            {PROCESO.map((step, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="sprint-timeline-step">
                  <div className="sprint-timeline-marker">
                    <div className="sprint-timeline-week">Semana {step.semana}</div>
                    <div className="sprint-timeline-dot" />
                    {i < PROCESO.length - 1 && <div className="sprint-timeline-line" />}
                  </div>
                  <div className="sprint-timeline-content">
                    <h3>{step.titulo}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={140}>
            <SectionAgendaCTA source="process" onOpen={openQualifier} />
          </Reveal>
        </div>
      </section>

      {/* ──────── PARA QUIÉN / PARA QUIÉN NO ──────── */}
      <section className="sprint-section">
        <div className="sprint-container">
          <div className="sprint-filter-grid">
            <Reveal>
              <div className="sprint-filter-card sprint-filter-card--yes">
                <h3>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38d4b1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Esto es para ti si...
                </h3>
                <ul>
                  <li>Tu equipo carga demasiadas tareas manuales</li>
                  <li>Hay procesos repetitivos, lentos o poco trazables</li>
                  <li>Quieres mejorar eficiencia sin improvisar tecnología</li>
                  <li>Ya sabes que seguir igual te sale caro</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="sprint-filter-card sprint-filter-card--no">
                <h3>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff6b7a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  Esto no es para ti si...
                </h3>
                <ul>
                  <li>Solo quieres &quot;probar IA&quot; por moda</li>
                  <li>No tienes procesos mínimos ni intención real de ejecutar cambios</li>
                  <li>Buscas una herramienta milagrosa sin diagnóstico</li>
                </ul>
              </div>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <SectionAgendaCTA source="filters" onOpen={openQualifier} />
          </Reveal>
        </div>
      </section>

      {/* ──────── FAQ ──────── */}
      <section className="sprint-section">
        <div className="sprint-container sprint-container--narrow">
          <Reveal>
            <div className="sprint-section-header">
              <div className="sprint-section-tag">Preguntas frecuentes</div>
              <h2 className="sprint-h2">¿Tienes dudas? Las resolvemos.</h2>
            </div>
          </Reveal>

          <div className="sprint-faq-list">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 60}>
                <FaqItem q={faq.q} a={faq.a} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <SectionAgendaCTA source="faq" onOpen={openQualifier} />
          </Reveal>
        </div>
      </section>

      {/* ──────── FINAL CTA ──────── */}
      <section
        className="sprint-section sprint-cta-final sprint-section--cta"
        id="sprint-cta-final"
      >
        <SprintBackgroundEffects variant="cta" />
        <div className="sprint-container">
          <Reveal>
            <div className="sprint-final-block">
              <div className="sprint-final-glow" />
              <div className="sprint-section-tag">Siguiente paso</div>
              <h2 className="sprint-h2" style={{ maxWidth: "32ch", margin: "0 auto 1rem" }}>
                En 4 semanas sabrás exactamente dónde estás perdiendo eficiencia y{" "}
                <span className="sprint-hero-accent">qué atacar primero.</span>
              </h2>
              <p className="sprint-body" style={{ maxWidth: "58ch", margin: "0 auto" }}>
                Si tu empresa ya siente el peso de lo manual, el desorden operativo o la presión por hacer más
                con el mismo equipo, este es el siguiente paso correcto.
              </p>
              <button
                className="sprint-btn-primary sprint-btn-primary--lg"
                onClick={() => openQualifier("final")}
              >
                Aplicar al Sprint de Eficiencia
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </button>
              <p className="sprint-microcopy">
                Revisamos encaje primero. No es para todo el mundo.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ──────── FOOTER MINI ──────── */}
      <footer className="sprint-footer">
        <a href="https://solventio.co" target="_blank" rel="noopener noreferrer" className="sprint-footer-logo">
          <Image
            src={SOLVENTIO_LOGO}
            alt="Solventio"
            width={28}
            height={28}
            style={{ width: "auto", height: "28px" }}
          />
          <span>Solventio</span>
        </a>
        <p>© {new Date().getFullYear()} Solventio. Todos los derechos reservados.</p>
      </footer>

      {isQualifierOpen ? (
        <SprintQualifierModal onClose={() => setIsQualifierOpen(false)} />
      ) : null}
    </div>
  );
}
