"use client";

import { useState, useRef, useEffect } from "react";

type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

function uid() {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
}

export function GlobalChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            role: "assistant",
            content:
                "¡Hola! Soy el asistente de Solventio Hub. Puedo ayudarte a encontrar videos sobre cualquier tema. Pregúntame y te enviaré directamente al contenido. 🎯"
        }
    ]);
    const [draft, setDraft] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [previousResponseId, setPreviousResponseId] = useState<string | undefined>();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const message = draft.trim();
        if (!message || isLoading) return;

        setDraft("");
        setIsLoading(true);

        const userMsg: ChatMessage = { id: uid(), role: "user", content: message };
        setMessages((prev) => [...prev, userMsg]);

        try {
            const response = await fetch("/api/global-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, previousResponseId })
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(data.message ?? "Error al responder");
            }

            const assistantMsg: ChatMessage = {
                id: uid(),
                role: "assistant",
                content: data.reply
            };

            setMessages((prev) => [...prev, assistantMsg]);

            if (data.responseId) setPreviousResponseId(data.responseId);

            // Open video links in new tabs
            if (data.videoLinks && Array.isArray(data.videoLinks)) {
                for (const link of data.videoLinks) {
                    window.open(link, "_blank", "noopener");
                }
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                { id: uid(), role: "assistant", content: "Disculpa, no pude responder. Intenta de nuevo." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                className="global-chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="global-chatbot-panel">
                    <div className="global-chatbot-header">
                        <div className="global-chatbot-header-left">
                            <div className="global-chatbot-header-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4>Asistente Hub</h4>
                                <p>Busca videos y aprende</p>
                            </div>
                        </div>
                        <button className="global-chatbot-close" onClick={() => setIsOpen(false)}>
                            ×
                        </button>
                    </div>

                    <div className="global-chatbot-messages" ref={scrollRef}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`chat-row ${msg.role}`}>
                                <div className={`chat-icon ${msg.role === "assistant" ? "assistant-icon" : "user-icon"}`}>
                                    {msg.role === "assistant" ? "🤖" : "👤"}
                                </div>
                                <div
                                    className={`chat-bubble ${msg.role === "assistant" ? "assistant-bubble" : "user-bubble"}`}
                                    dangerouslySetInnerHTML={{
                                        __html: msg.content.replace(
                                            /\[([^\]]+)\]\(([^)]+)\)/g,
                                            '<a href="$2" target="_blank" rel="noopener" class="chatbot-video-link">$1</a>'
                                        )
                                    }}
                                />
                            </div>
                        ))}

                        {isLoading && (
                            <div className="chat-row assistant">
                                <div className="chat-icon assistant-icon">🤖</div>
                                <div className="chat-bubble assistant-bubble">
                                    <span className="typing-dots">Buscando...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <form className="global-chatbot-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="¿Qué quieres aprender?"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={!draft.trim() || isLoading}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m22 2-7 20-4-9-9-4z" /><path d="m22 2-11 11" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
