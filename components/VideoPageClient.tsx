"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, PlayIcon } from "@/components/icons";
import { useAuth } from "@/components/AuthProvider";
import { VideoChat } from "@/components/VideoChat";
import { LeadCapture } from "@/components/LeadCapture";
import {
    BOOKING_URL_DEFAULT,
    SOLVENTIO_LOGO_URL
} from "@/lib/video-knowledge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type VideoData = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    short_summary: string | null;
    long_summary: string | null;
    youtube_video_id: string;
    youtube_start_seconds: number;
    thumbnail_url: string | null;
    transcript: string | null;
    key_insights: string[];
    mundo: string;
    categories: { name: string; slug: string } | null;
};

type VideoPageClientProps = {
    video: VideoData;
    mundo: "sepuhack" | "solventio";
    backUrl: string;
    backLabel: string;
};

const LOADING_TEXTS = [
    "Optimizando procesos...",
    "Empujando tu negocio con tecnología...",
    "Haciéndote más eficiente...",
    "Analizando datos clave...",
    "Escalando operaciones con IA..."
];

export function VideoPageClient({
    video,
    mundo,
    backUrl,
    backLabel
}: VideoPageClientProps) {
    const { user, loading } = useAuth();
    const [showTranscript, setShowTranscript] = useState(false);
    const [loadingIndex, setLoadingIndex] = useState(0);

    const isSolventio = mundo === "solventio";
    const themeClass = isSolventio ? "vp-theme-solventio" : "vp-theme-sepuhack";

    const relatedVideos = useQuery(api.videos.getRelatedVideos, {
        videoId: video.id as Id<"videos">,
        mundo: mundo,
        categorySlug: video.categories?.slug,
    });

    // 3D Tilt Logic for Hero
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    // Cycling Text Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 8;
        const rotateX = ((centerY - y) / centerY) * 8;
        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    // Mark video as watched
    useEffect(() => {
        if (!user) return;
        fetch("/api/watch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoId: video.id })
        }).catch(() => { });
    }, [user, video.id]);

    if (loading) {
        return (
            <div className={`brand-shell ${themeClass}`} style={{ minHeight: "100vh", paddingTop: 100, textAlign: "center" }}>
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className={`brand-shell landing-v3 ${themeClass}`}>
            <main className="landing-v3-main">
                <LeadCapture hideDefaultTrigger />

                {/* 1. HERO SECTION (adapted from HeroOmnix) */}
                <section className="omnix-hero-container" style={{ marginTop: "2rem", paddingBottom: user ? "0.5rem" : undefined }}>

                    {/* LEFT COLUMN: Content */}
                    <article className="omnix-content" style={user ? { gridColumn: "1 / -1", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" } : {}}>
                        <div className="logo-row" style={{ marginBottom: "1.5rem" }}>
                            {isSolventio ? (
                                <a
                                    href="https://solventio.co"
                                    className="vp-solventio-link"
                                >
                                    <Image
                                        src={SOLVENTIO_LOGO_URL}
                                        alt="Solventio"
                                        width={42}
                                        height={42}
                                        style={{ width: "auto", height: "auto", maxHeight: "42px" }}
                                    />
                                    <strong>Solventio</strong>
                                </a>
                            ) : (
                                <>
                                    <div className="vp-logo-glow vp-glow-blue" style={{ width: 42, height: 42 }}>
                                        <span className="vp-logo-text" style={{ fontSize: "1.2rem" }}>SH</span>
                                    </div>
                                    <strong>SepuHacks</strong>
                                </>
                            )}
                        </div>

                        <div className="omnix-tag">
                            <span
                                style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: isSolventio ? "#a78bfa" : "#38d4b1",
                                    display: "block"
                                }}
                            />
                            Video completo + asistencia IA
                        </div>

                        <h1 className="omnix-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                            {video.title}
                        </h1>

                        <p className="omnix-desc" style={user ? { marginBottom: 0 } : {}}>
                            {video.description || "Descubre cómo aplicar estos conceptos directamente en tu empresa."}
                        </p>

                        {!user && (
                            <div className="omnix-buttons" style={{ marginTop: "2rem" }}>
                                <button className="omnix-btn-glow" data-open-auth-modal data-auth-mode="register">
                                    <span style={{ marginLeft: "0.4rem" }}>Regístrate gratis para ver</span>
                                </button>
                                <Link href={backUrl} className="omnix-btn-secondary">
                                    <span>Volver al catálogo</span>
                                </Link>
                            </div>
                        )}
                    </article>

                    {/* RIGHT COLUMN: 3D Visual Embed */}
                    {!user && (
                        <article className="omnix-visual-stage">
                            {/* Floating Badge (Top Left) - OUTSIDE card for no tilt effect */}
                            <button className="omnix-badge-float" data-open-auth-modal data-auth-mode="register">
                                <div className="omnix-badge-avatar">
                                    <PlayIcon className="omnix-badge-play-icon" />
                                </div>
                                <div className="omnix-badge-text">
                                    <span className="omnix-badge-label">Ver Video</span>
                                    <div className="omnix-badge-sub">Click para ver</div>
                                </div>
                            </button>

                            {/* Floating Loader (Bottom Right) - OUTSIDE card */}
                            <div className="omnix-loader-float">
                                <div key={loadingIndex} className="omnix-loader-text" style={{ animation: "cycling-fade 2.5s forwards" }}>
                                    {LOADING_TEXTS[loadingIndex]}
                                </div>
                                <div className="omnix-loader-bar">
                                    <div className="omnix-loader-progress" />
                                </div>
                            </div>

                            <div
                                ref={cardRef}
                                className="omnix-3d-card"
                                style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                {/* Scan Line */}
                                <div className="omnix-scan-line" />

                                <div className="omnix-card-content">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${video.youtube_video_id}?autoplay=1&mute=1&controls=0`}
                                        style={{ width: "100%", height: "100%", border: "none", pointerEvents: "none" }}
                                        title="Preview"
                                    />
                                    <div className="omnix-video-overlay" style={{ background: "rgba(11, 21, 56, 0.4)" }} />
                                    <button
                                        className="omnix-center-play"
                                        data-open-auth-modal
                                        data-auth-mode="register"
                                        aria-label="Regístrate para ver"
                                    >
                                        <PlayIcon className="omnix-center-play-icon" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    )}
                </section>

                {/* VIDEO + CHAT: layout tipo YouTube cuando está logueado */}
                {user && (
                    <section style={{ marginTop: "0.5rem", width: "100%" }}>
                        <div className="video-chat-layout">
                            {/* LEFT: Video player */}
                            <div className="video-chat-video">
                                <div style={{ width: "100%", borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", aspectRatio: "16/9", background: "#000", boxShadow: "0 16px 48px rgba(0,0,0,0.45)" }}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${video.youtube_video_id}?autoplay=1`}
                                        style={{ width: "100%", height: "100%", border: "none" }}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={video.title}
                                    />
                                </div>
                            </div>

                            {/* RIGHT: Chat */}
                            <div className="video-chat-sidebar">
                                <div className="video-chat-sidebar-header">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    Chatea sobre el contenido de este video
                                </div>
                                <div className="video-chat-sidebar-body">
                                    <VideoChat
                                        videoId={video.id}
                                        videoTitle={video.title}
                                        transcript={video.transcript}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Long summary below video */}
                {user && video.long_summary && (
                    <section className="section-block-v3" style={{ marginTop: "1.25rem", paddingTop: 0 }}>
                        <div className="panel vp-summary-panel">
                            <h3>Resumen del contenido</h3>
                            <p style={{ color: "var(--text-muted)", margin: 0, lineHeight: 1.8 }}>
                                {video.long_summary}
                            </p>
                        </div>
                    </section>
                )}

                {/* CHAT bloqueado — solo para usuarios NO logueados */}
                {!user && (
                    <section className="section-block-v3" style={{ marginTop: "2rem", paddingTop: 0 }}>
                        <div
                            style={{
                                height: "300px",
                                borderRadius: "16px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                background: "rgba(255,255,255,0.02)",
                                gap: "1rem"
                            }}
                        >
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <h3 style={{ color: "var(--text)", margin: 0 }}>Chat IA Bloqueado</h3>
                            <p style={{ color: "var(--text-muted)", margin: 0 }}>Inicia sesión para interactuar con la IA de este video.</p>
                            <button className="omnix-btn-glow" style={{ marginTop: "1rem" }} data-open-auth-modal data-auth-mode="login">
                                Iniciar Sesión
                            </button>
                        </div>
                    </section>
                )}

                {/* 3. KEY INSIGHTS SECTION REMOVED */}


                {/* Transcript Section (only if logged in and has transcript) */}
                {user && video.transcript && (
                    <section className="section-block-v3" style={{ marginTop: "2rem", paddingTop: 0 }}>
                        <div className="panel vp-transcript-panel" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <button
                                className="vp-transcript-toggle"
                                onClick={() => setShowTranscript(!showTranscript)}
                                style={{
                                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                                    background: "none", border: "none", color: "inherit", cursor: "pointer", padding: "1rem 1.5rem"
                                }}
                            >
                                <h3 style={{ margin: 0, fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                        <polyline points="10 9 9 9 8 9" />
                                    </svg>
                                    Transcripción del Video
                                </h3>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                        transition: "transform 0.3s",
                                        transform: showTranscript ? "rotate(180deg)" : "rotate(0deg)"
                                    }}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                            {showTranscript && (
                                <div className="vp-transcript-content" style={{ padding: "0 1.5rem 1.5rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                                    {video.transcript}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Related Videos Section */}
                {relatedVideos && relatedVideos.length > 0 && (
                    <section className="section-block-v3" style={{ marginTop: "4rem", paddingTop: 0 }}>
                        <header className="section-title-v3">
                            <h2>Sigue aprendiendo</h2>
                            <p style={{ color: "var(--text-muted)" }}>Videos recomendados para ti</p>
                        </header>
                        <div className="benefits-grid-v3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                            {relatedVideos.map((rv) => {
                                const videoPath = mundo === "solventio" ? `/solventio-world/${rv.slug}` : `/sepuhack/${rv.slug}`;
                                return (
                                    <Link href={videoPath} key={rv._id} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                        <article className="panel benefit-card-v3" style={{ padding: "0", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                                            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "var(--surface-sunken)" }}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={rv.thumbnail_url || `https://img.youtube.com/vi/${rv.youtube_video_id}/hqdefault.jpg`}
                                                    alt={rv.title}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    loading="lazy"
                                                />
                                                <div className="sv-play-overlay">
                                                    <div className="sv-play-btn">
                                                        <PlayIcon style={{ width: 20, height: 20 }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                                                {rv.categories && (
                                                    <span style={{ fontSize: "0.75rem", color: isSolventio ? "#a78bfa" : "#38d4b1", fontWeight: 600, textTransform: "uppercase", marginBottom: "0.5rem", display: "block" }}>
                                                        {rv.categories.name}
                                                    </span>
                                                )}
                                                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", lineHeight: 1.4 }}>{rv.title}</h3>
                                                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {rv.short_summary || rv.description}
                                                </p>
                                            </div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* 4. BOTTOM CTAs — visible for ALL users */}
                <section className="panel strip-cta-v3" style={{ marginTop: "4rem", marginBottom: "2rem" }}>
                    <div>
                        <h3>¿Listo para aplicar esto en tu empresa?</h3>
                        <p>
                            Agenda una cita y te mostramos cómo pasar de prompts a soluciones de negocio.
                        </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
                        <a className="primary-btn" href={BOOKING_URL_DEFAULT} target="_blank" rel="noopener noreferrer">
                            <CalendarIcon className="btn-icon" />
                            Agenda una cita con Solventio
                        </a>
                        <a
                            href="https://solventio.co"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}
                        >
                            Visitar solventio.co →
                        </a>
                    </div>
                </section>

                <div style={{ textAlign: "center", paddingBottom: "4rem" }}>
                    <Link href={backUrl} style={{ color: "var(--text-muted)", textDecoration: "none", fontWeight: 500 }}>
                        {backLabel}
                    </Link>
                </div>

            </main>
        </div>
    );
}
