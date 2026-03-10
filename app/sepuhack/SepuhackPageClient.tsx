"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayIcon, CalendarIcon } from "@/components/icons";
import { BOOKING_URL_DEFAULT } from "@/lib/video-knowledge";

type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
};

type Video = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    youtube_video_id: string;
    thumbnail_url: string | null;
    category_id: string | null;
    categories: { name: string; slug: string } | null;
};

function getYouTubeThumbnail(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/* ── Reutilizamos el planeta + elementos del landing ── */
function SpaceBackground() {
    return (
        <div className="sh-space-bg" aria-hidden="true">
            {/* Stars */}
            <div className="sh-star sh-s1" />
            <div className="sh-star sh-s2" />
            <div className="sh-star sh-s3" />
            <div className="sh-star sh-s4" />
            <div className="sh-star sh-s5" />
            <div className="sh-star sh-s6" />
            <div className="sh-star sh-s7" />
            <div className="sh-star sh-s8" />
            <div className="sh-star sh-s9" />
            <div className="sh-star sh-s10" />
            <div className="sh-star sh-s11" />
            <div className="sh-star sh-s12" />

            {/* Moon */}
            <svg className="sh-moon" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="24" fill="rgba(250,204,21,0.15)" stroke="rgba(250,204,21,0.4)" strokeWidth="1.5" />
                <circle cx="22" cy="22" r="4" fill="rgba(250,204,21,0.08)" />
                <circle cx="35" cy="28" r="3" fill="rgba(250,204,21,0.06)" />
                <circle cx="28" cy="38" r="2.5" fill="rgba(250,204,21,0.07)" />
            </svg>

            {/* Rocket 1 */}
            <svg className="sh-rocket sh-rocket-1" viewBox="0 0 40 60">
                <path d="M20 2 L30 22 L26 22 L26 38 L14 38 L14 22 L10 22 Z" fill="rgba(96,165,250,0.55)" stroke="rgba(147,197,253,0.75)" strokeWidth="1" />
                <circle cx="20" cy="22" r="3" fill="rgba(191,219,254,0.9)" />
                <path d="M14 38 L20 52 L26 38" fill="rgba(251,191,36,0.55)" />
                <path d="M12 42 L20 58 L28 42" fill="rgba(251,146,60,0.35)" />
            </svg>

            {/* Rocket 2 */}
            <svg className="sh-rocket sh-rocket-2" viewBox="0 0 40 60">
                <path d="M20 2 L30 22 L26 22 L26 38 L14 38 L14 22 L10 22 Z" fill="rgba(59,130,246,0.45)" stroke="rgba(96,165,250,0.65)" strokeWidth="1" />
                <circle cx="20" cy="22" r="3" fill="rgba(147,197,253,0.75)" />
                <path d="M14 38 L20 50 L26 38" fill="rgba(251,191,36,0.45)" />
            </svg>

            {/* Lightbulb */}
            <svg className="sh-bulb sh-bulb-1" viewBox="0 0 40 50">
                <circle cx="20" cy="16" r="12" fill="none" stroke="rgba(250,204,21,0.55)" strokeWidth="1.5" />
                <path d="M15 28 L15 34 L25 34 L25 28" fill="none" stroke="rgba(250,204,21,0.45)" strokeWidth="1.2" />
                <line x1="15" y1="31" x2="25" y2="31" stroke="rgba(250,204,21,0.3)" strokeWidth="1" />
                <line x1="20" y1="0" x2="20" y2="2" stroke="rgba(250,204,21,0.5)" strokeWidth="1" />
                <line x1="6" y1="16" x2="4" y2="16" stroke="rgba(250,204,21,0.5)" strokeWidth="1" />
                <line x1="34" y1="16" x2="36" y2="16" stroke="rgba(250,204,21,0.5)" strokeWidth="1" />
            </svg>

            <svg className="sh-bulb sh-bulb-2" viewBox="0 0 40 50">
                <circle cx="20" cy="16" r="12" fill="rgba(250,204,21,0.08)" stroke="rgba(250,204,21,0.35)" strokeWidth="1.5" />
                <path d="M15 28 L15 34 L25 34 L25 28" fill="none" stroke="rgba(250,204,21,0.3)" strokeWidth="1.2" />
            </svg>

            {/* Planet */}
            <div className="sh-planet-wrapper">
                <svg className="sh-planet" viewBox="0 0 600 600">
                    <defs>
                        <radialGradient id="shPlanetGrad" cx="40%" cy="35%">
                            <stop offset="0%" stopColor="rgba(96,165,250,0.22)" />
                            <stop offset="50%" stopColor="rgba(59,130,246,0.14)" />
                            <stop offset="100%" stopColor="rgba(30,58,138,0.06)" />
                        </radialGradient>
                        <radialGradient id="shPlanetAtmo" cx="50%" cy="50%">
                            <stop offset="85%" stopColor="transparent" />
                            <stop offset="100%" stopColor="rgba(59,130,246,0.18)" />
                        </radialGradient>
                    </defs>
                    <circle cx="300" cy="300" r="290" fill="url(#shPlanetAtmo)" />
                    <circle cx="300" cy="300" r="270" fill="url(#shPlanetGrad)" stroke="rgba(59,130,246,0.35)" strokeWidth="1.5" />
                    <ellipse cx="300" cy="300" rx="270" ry="80" fill="none" stroke="rgba(96,165,250,0.13)" strokeWidth="0.8" />
                    <ellipse cx="300" cy="300" rx="270" ry="150" fill="none" stroke="rgba(96,165,250,0.09)" strokeWidth="0.8" />
                    <ellipse cx="300" cy="300" rx="180" ry="270" fill="none" stroke="rgba(96,165,250,0.11)" strokeWidth="0.8" />
                    <ellipse cx="300" cy="300" rx="90" ry="270" fill="none" stroke="rgba(96,165,250,0.09)" strokeWidth="0.8" />
                    <path d="M200 200 Q250 180 280 210 Q310 240 290 280 Q260 260 220 250 Q190 230 200 200" fill="rgba(59,130,246,0.09)" stroke="rgba(96,165,250,0.16)" strokeWidth="0.5" />
                    <path d="M340 160 Q380 170 400 200 Q410 240 380 260 Q350 240 330 200 Q320 180 340 160" fill="rgba(96,165,250,0.07)" stroke="rgba(147,197,253,0.13)" strokeWidth="0.5" />
                    <path d="M250 340 Q290 320 330 340 Q360 370 340 400 Q300 390 260 380 Q230 360 250 340" fill="rgba(59,130,246,0.08)" stroke="rgba(96,165,250,0.14)" strokeWidth="0.5" />
                    {/* Code brackets */}
                    <g transform="translate(350,200) scale(0.5)" opacity="0.45">
                        <path d="M8 4 L2 12 L8 20" fill="none" stroke="rgba(191,219,254,0.55)" strokeWidth="2" />
                        <path d="M18 4 L24 12 L18 20" fill="none" stroke="rgba(191,219,254,0.55)" strokeWidth="2" />
                    </g>
                    {/* Orbiting dots */}
                    <circle r="4" fill="rgba(96,165,250,0.65)">
                        <animateMotion dur="12s" repeatCount="indefinite" path="M300,30 A270,270 0 1,1 299.9,30" />
                    </circle>
                    <circle r="2.5" fill="rgba(147,197,253,0.55)">
                        <animateMotion dur="18s" repeatCount="indefinite" path="M300,30 A270,270 0 1,0 300.1,30" />
                    </circle>
                </svg>
            </div>
        </div>
    );
}

export function SepuhackPageClient({
    categories,
    videos
}: {
    categories: Category[];
    videos: Video[];
}) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const filteredVideos = activeCategory
        ? videos.filter((v) => v.category_id === activeCategory)
        : videos;

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('searchQuery')?.toString().trim();
        if (query) {
            window.dispatchEvent(new CustomEvent('open-hub-chat', { detail: { message: query } }));
            e.currentTarget.reset();
        }
    };

    return (
        <div className="sh-world-page">
            {/* Immersive space background */}
            <SpaceBackground />

            <div className="sh-world-inner">
                <Link href="/" className="world-back-nav">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Volver a mundos
                </Link>

                {/* ── Hero ── */}
                <header className="sh-hero">
                    <span className="sh-badge">🚀 Para Emprendedores</span>
                    <h1 className="sh-title">
                        Sepu<span className="sh-accent">Hacks</span>
                    </h1>
                    <p className="sh-subtitle">
                        Videos prácticos para construir, automatizar y escalar tu negocio.
                        Sin rodeos. Sin teoría innecesaria.
                    </p>
                    <form className="sh-search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            name="searchQuery"
                            placeholder="¿Qué quieres aprender?"
                            className="sh-search-input"
                            autoComplete="off"
                        />
                        <button type="submit" className="sh-search-button" aria-label="Buscar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </form>
                    <div className="sh-hero-chips">
                        <span className="sh-chip">🚀 Tutoriales DIY</span>
                        <span className="sh-chip">🧠 IA Práctica</span>
                        <span className="sh-chip">⚡ Automatización</span>
                        <span className="sh-chip">💡 Ideas de negocio</span>
                    </div>
                </header>

                {/* ── Categorías ── */}
                <section className="sh-section">
                    <div className="sh-section-label">
                        <span className="sh-section-dot" />
                        Explorar por categoría
                    </div>

                    {categories.length > 0 && (
                        <div className="world-cat-grid">
                            <div
                                className={`cat-card sh-cat-card${activeCategory === null ? " active" : ""}`}
                                onClick={() => setActiveCategory(null)}
                            >
                                <span className="cat-card-title">Todos los Recientes</span>
                                <span className="cat-card-desc">Explora el contenido más nuevo subido a SepuHacks.</span>
                            </div>
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className={`cat-card sh-cat-card${activeCategory === cat.id ? " active" : ""}`}
                                    onClick={() => setActiveCategory(cat.id)}
                                >
                                    <span className="cat-card-title">{cat.name}</span>
                                    {cat.description && <span className="cat-card-desc">{cat.description}</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── Videos (Filtrados o Recientes) ── */}
                <section className="sh-section">
                    <div className="sh-section-label">
                        <span className="sh-section-dot" />
                        {activeCategory ? "Videos en esta categoría" : "Archivos Recientes"}
                    </div>
                    {filteredVideos.length > 0 ? (
                        <div className="sh-video-grid">
                            {filteredVideos.map((video) => (
                                <Link
                                    key={video.id}
                                    href={`/sepuhack/${video.slug}`}
                                    className="sh-video-card"
                                >
                                    <div className="sh-video-thumb">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={video.thumbnail_url || getYouTubeThumbnail(video.youtube_video_id)}
                                            alt={video.title}
                                            loading="lazy"
                                        />
                                        <div className="sh-play-overlay">
                                            <div className="sh-play-btn">
                                                <PlayIcon className="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sh-video-body">
                                        {video.categories && (
                                            <span className="sh-video-cat">{video.categories.name}</span>
                                        )}
                                        <h3 className="sh-video-title">{video.title}</h3>
                                        {video.description && (
                                            <p className="sh-video-desc">{video.description}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="sh-empty">
                            <span>🚀</span>
                            <h3>Próximamente</h3>
                            <p>Estamos preparando contenido para esta categoría. ¡Vuelve pronto!</p>
                        </div>
                    )}
                </section>

                {/* ── CTA Banner ── */}
                <section className="world-cta-banner sepuhack-cta-banner">
                    <div className="world-cta-banner-content">
                        <h2>¿Quieres implementar IA en tu negocio?</h2>
                        <p>Nuestro equipo te ayuda a pasar de la teoría a la práctica. Agenda una cita y conversemos.</p>
                        <div className="world-cta-banner-actions">
                            <a
                                className="world-cta-btn-primary"
                                href={BOOKING_URL_DEFAULT}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <CalendarIcon className="btn-icon" />
                                Agendar Cita con Solventio
                            </a>
                            <a
                                className="world-cta-btn-secondary"
                                href="https://solventio.co"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Visitar solventio.co →
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
