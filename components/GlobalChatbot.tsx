"use client";

import { useState, useRef, useEffect } from "react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

type PersistedChat = {
    messages: ChatMessage[];
    previousResponseId?: string;
};

function uid() {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
}

export function GlobalChatbot() {
    const user = useQuery(api.users.currentUser);
    const storageKey = "solventio_global_chat_session";

    const initialAssistantMessage: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content:
            "¡Hola! Soy el asistente de Solventio Hub. Puedo ayudarte a encontrar videos sobre cualquier tema o guiarte en tu proyecto IA. Pregúntame lo que necesites. 🎯"
    };

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
    const [draft, setDraft] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [previousResponseId, setPreviousResponseId] = useState<string | undefined>();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial load from sessionStorage
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

    // Save to sessionStorage
    useEffect(() => {
        const payload: PersistedChat = { messages, previousResponseId };
        window.sessionStorage.setItem(storageKey, JSON.stringify(payload));
    }, [messages, previousResponseId, storageKey]);

    // Listen for custom search event from Worlds
    useEffect(() => {
        const handleOpenChat = (e: Event) => {
            const customEvent = e as CustomEvent;
            setIsOpen(true);
            const msg = customEvent.detail?.message;
            if (msg) {
                setDraft(msg);
                // We don't auto-submit since submit needs the React event context,
                // or we can extract the submit logic into a function.
                setTimeout(() => {
                    handleSendMessage(msg);
                }, 100);
            }
        };

        window.addEventListener("open-hub-chat", handleOpenChat);
        return () => window.removeEventListener("open-hub-chat", handleOpenChat);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!scrollRef.current || !isOpen || messages.length === 0) return;
        
        const lastMsg = messages[messages.length - 1];
        
        // If the user just typed, scroll to the absolute bottom
        if (lastMsg.role === "user") {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        } 
        // If the assistant replied, scroll to the top of its message so the user can read downwards
        else if (lastMsg.role === "assistant" && lastMsg.id !== "welcome") {
            const el = document.getElementById(`msg-${lastMsg.id}`);
            if (el) {
                const container = scrollRef.current;
                container.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
            } else {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        } else {
            // Fallback for welcome message or others
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText || isLoading) return;

        setDraft("");
        setIsLoading(true);

        const userMsg: ChatMessage = { id: uid(), role: "user", content: messageText };
        setMessages((prev) => [...prev, userMsg]);

        try {
            // Build user context
            const userContext = user ? {
                name: user.name,
                company: user.company,
                role: user.role,
                goal: user.goal,
                email: user.email
            } : null;

            const response = await fetch("/api/global-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: messageText, previousResponseId, userContext })
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(draft.trim());
    };

    const handleResetChat = () => {
        setMessages([initialAssistantMessage]);
        setPreviousResponseId(undefined);
        window.sessionStorage.removeItem(storageKey);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                className={`global-chatbot-toggle ${!isOpen ? "pulse-active" : ""}`}
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
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button className="global-chatbot-reset" onClick={handleResetChat} title="Reiniciar conversación">
                                Reiniciar
                            </button>
                            <button className="global-chatbot-close" onClick={() => setIsOpen(false)}>
                                ×
                            </button>
                        </div>
                    </div>

                    <div className="global-chatbot-messages" ref={scrollRef}>
                        {messages.map((msg) => (
                            <div key={msg.id} id={`msg-${msg.id}`} className={`chat-row ${msg.role}`}>
                                <div className={`chat-icon ${msg.role === "assistant" ? "assistant-icon" : "user-icon"}`}>
                                    {msg.role === "assistant" ? "🤖" : "👤"}
                                </div>
                                <div
                                    className={`chat-bubble ${msg.role === "assistant" ? "assistant-bubble" : "user-bubble"}`}
                                    dangerouslySetInnerHTML={{
                                        __html: msg.content
                                            // Handle Markdown Links
                                            .replace(
                                                /(?:-\s*)?\[([^|\]]+)(?:\|([^\]]+))?\]\(([^)]+)\)/g,
                                                (match, title, thumb, url) => {
                                                    // Determine if it's a video link (has thumbnail OR points to our worlds)
                                                    const isVideoLink = thumb !== undefined || url.includes("/sepuhack/") || url.includes("/solventio-world/");

                                                    if (isVideoLink) {
                                                        const thumbHtml = thumb && thumb.startsWith("http")
                                                            ? `<img src="${thumb}" alt="${title}" class="chatbot-video-card-thumb" />`
                                                            : `<span class="chatbot-video-card-icon">▶</span>`;
                                                        
                                                        return `__VC__<a href="${url}" target="_blank" rel="noopener" class="chatbot-video-card">${thumbHtml}<div class="chatbot-video-card-info"><span class="chatbot-video-card-title">${title}</span><span class="chatbot-video-card-action">Ver video ▶</span></div></a>__VX__`;
                                                    } else {
                                                        // Render as a standard button link (e.g. for cal.com)
                                                        return `__BC__<a href="${url}" target="_blank" rel="noopener" class="chatbot-button-link">${title}</a>__BX__`;
                                                    }
                                                }
                                            )
                                            // Clean up excess newlines caused by prompt formatting using the precise markers
                                            .replace(/[\s\n]*__VC__/g, '\n')
                                            .replace(/__VX__[\s\n]*/g, '\n')
                                            .replace(/[\s\n]*__BC__/g, '\n')
                                            .replace(/__BX__[\s\n]*/g, '\n')
                                            .replace(/\n{3,}/g, '\n\n')
                                            .replace(/\n/g, '<br />')
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
