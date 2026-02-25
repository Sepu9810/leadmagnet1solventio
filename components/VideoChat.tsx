"use client";

import { useEffect, useMemo, useState } from "react";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type PersistedChat = {
  messages: ChatMessage[];
  previousResponseId?: string;
};

const storageKey = "solventio_video_chat_session";

const initialAssistantMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hola, soy el asistente del video. Puedo ayudarte a aterrizar lo que viste a tu negocio y sugerirte próximos pasos prácticos."
};

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

export function VideoChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [previousResponseId, setPreviousResponseId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as PersistedChat;
      if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
        setMessages(parsed.messages);
      }

      if (typeof parsed.previousResponseId === "string") {
        setPreviousResponseId(parsed.previousResponseId);
      }
    } catch {
      window.sessionStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    const payload: PersistedChat = { messages, previousResponseId };
    window.sessionStorage.setItem(storageKey, JSON.stringify(payload));
  }, [messages, previousResponseId]);

  const canSend = useMemo(() => draft.trim().length > 1 && !isLoading, [draft, isLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();

    if (!message || isLoading) {
      return;
    }

    setError("");
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: uid(),
      role: "user",
      content: message
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, previousResponseId })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? "No pude responder en este momento");
      }

      const assistantMessage: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: data.reply
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (typeof data.responseId === "string") {
        setPreviousResponseId(data.responseId);
      }
    } catch (submitError) {
      const messageError =
        submitError instanceof Error
          ? submitError.message
          : "No pude responder en este momento";

      setError(messageError);

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content:
            "No logré responder por un error temporal. Intenta de nuevo en unos segundos."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="panel chat-card chat-window" aria-label="Chat del video">
      <div className="chat-header">
        <div className="chat-icon assistant-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
            <path d="m8 6 4-4 4 4" />
            <path d="M12 14a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <path d="M22 14a4 4 0 0 1-4-4h-2a4 4 0 0 1-4 4" />
            <rect x="2" y="16" width="20" height="6" rx="2" />
          </svg>
        </div>
        <div>
          <h3>Asistente Solventio (IA)</h3>
          <p>Experto en el video y en automatización</p>
        </div>
      </div>

      <div className="chat-scroll">
        {messages.map((message) => (
          <article key={message.id} className={`chat-row ${message.role}`}>
            <div
              className={`chat-icon ${message.role === "assistant" ? "assistant-icon" : "user-icon"
                }`}
            >
              {message.role === "assistant" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <div
              className={`chat-bubble ${message.role === "assistant" ? "assistant-bubble" : "user-bubble"
                }`}
            >
              {message.content}
            </div>
          </article>
        ))}

        {isLoading ? (
          <article className="chat-row assistant">
            <div className="chat-icon assistant-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="chat-bubble assistant-bubble">
              <span className="typing-dots">Escribiendo...</span>
            </div>
          </article>
        ) : null}
      </div>

      <form className="chat-form" onSubmit={handleSubmit} style={{ marginTop: "auto" }}>
        <textarea
          name="message"
          placeholder="Ej: ¿Cómo aplico CAR en mi proceso comercial?"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSend) handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }
          }}
        />
        {error ? <p className="error-text">{error}</p> : null}
        <button className="submit-btn" type="submit" disabled={!canSend}>
          {isLoading ? "Enviando..." : "Enviar pregunta"}
        </button>
      </form>

      <p className="disclaimer" style={{ marginTop: "0.8rem", textAlign: "center" }}>
        Este asistente conoce el video y cómo Solventio puede ayudarte.
      </p>
    </section>
  );
}
