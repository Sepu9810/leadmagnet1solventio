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

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}

export function VideoChat({
  videoId,
  videoTitle,
  transcript
}: {
  videoId: string;
  videoTitle: string;
  transcript: string | null;
}) {
  const storageKey = `solventio_video_chat_${videoId}`;

  const initialAssistantMessage: ChatMessage = {
    id: "welcome",
    role: "assistant",
    content: `Hola, ¿quieres saber algo sobre este video? Te puedo ayudar.`
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [previousResponseId, setPreviousResponseId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return;

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
  }, [storageKey]);

  useEffect(() => {
    const payload: PersistedChat = { messages, previousResponseId };
    window.sessionStorage.setItem(storageKey, JSON.stringify(payload));
  }, [messages, previousResponseId, storageKey]);

  const canSend = useMemo(() => draft.trim().length > 1 && !isLoading, [draft, isLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();

    if (!message || isLoading) return;

    setError("");
    setIsLoading(true);

    const userMessage: ChatMessage = { id: uid(), role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setDraft("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          previousResponseId,
          videoId,
          videoTitle,
          transcript: transcript ?? ""
        })
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
          content: "No logré responder por un error temporal. Intenta de nuevo."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="panel chat-card chat-window" aria-label="Chat del video">


      <div className="chat-scroll">
        {messages.map((msg) => (
          <article key={msg.id} className={`chat-row ${msg.role}`}>
            <div className={`chat-icon ${msg.role === "assistant" ? "assistant-icon" : "user-icon"}`}>
              {msg.role === "assistant" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <div className={`chat-bubble ${msg.role === "assistant" ? "assistant-bubble" : "user-bubble"}`}>
              {msg.content}
            </div>
          </article>
        ))}

        {isLoading && (
          <article className="chat-row assistant">
            <div className="chat-icon assistant-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="chat-bubble assistant-bubble">
              <span className="typing-dots">Escribiendo...</span>
            </div>
          </article>
        )}
      </div>

      <form className="chat-form" onSubmit={handleSubmit} style={{ marginTop: "auto" }}>
        <textarea
          name="message"
          placeholder="Pregunta algo sobre este video..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSend) handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }
          }}
        />
        {error && <p className="error-text">{error}</p>}
        <button className="submit-btn" type="submit" disabled={!canSend}>
          {isLoading ? "Enviando..." : "Enviar pregunta"}
        </button>
      </form>
    </section>
  );
}
