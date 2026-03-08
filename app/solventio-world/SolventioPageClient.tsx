"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlayIcon, CalendarIcon } from "@/components/icons";
import { BOOKING_URL_DEFAULT } from "@/lib/video-knowledge";

const SOLVENTIO_LOGO =
    "https://d537127951692c7fbd38ff662fb21b1c.cdn.bubble.io/f1769723313269x424679096768052900/solventio%20icon.png";

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

/* ── Cityscape reutilizado del landing ── */
function CityBackground() {
    const CityTile = ({ offset }: { offset: number }) => (
        <svg
            className="sv-city-tile"
            viewBox="0 0 800 200"
            style={{ left: `${offset}px` }}
            aria-hidden="true"
        >
            {/* Ground */}
            <line x1="0" y1="170" x2="800" y2="170" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" />

            {/* Building 1 - tall */}
            <rect x="20" y="50" width="60" height="120" rx="3" fill="rgba(139,92,246,0.14)" stroke="rgba(167,139,250,0.4)" strokeWidth="1" />
            <rect x="30" y="60" width="12" height="8" rx="1" fill="rgba(196,181,253,0.35)" />
            <rect x="50" y="60" width="12" height="8" rx="1" fill="rgba(196,181,253,0.25)" />
            <rect x="30" y="78" width="12" height="8" rx="1" fill="rgba(196,181,253,0.2)" />
            <rect x="50" y="78" width="12" height="8" rx="1" fill="rgba(196,181,253,0.3)" />
            <rect x="30" y="96" width="12" height="8" rx="1" fill="rgba(196,181,253,0.25)" />
            <rect x="50" y="96" width="12" height="8" rx="1" fill="rgba(196,181,253,0.2)" />
            <rect x="30" y="114" width="12" height="8" rx="1" fill="rgba(196,181,253,0.3)" />
            <rect x="38" y="140" width="24" height="30" rx="2" fill="rgba(139,92,246,0.08)" stroke="rgba(167,139,250,0.2)" strokeWidth="0.8" />
            <line x1="50" y1="40" x2="50" y2="50" stroke="rgba(167,139,250,0.45)" strokeWidth="1" />
            <circle cx="50" cy="38" r="3" fill="rgba(196,181,253,0.45)">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Building 2 */}
            <rect x="100" y="90" width="45" height="80" rx="3" fill="rgba(167,139,250,0.1)" stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
            <rect x="108" y="98" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
            <rect x="125" y="98" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
            <rect x="108" y="112" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
            <rect x="125" y="112" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />

            {/* Briefcase */}
            <g transform="translate(170,138)">
                <rect x="0" y="8" width="30" height="22" rx="3" fill="rgba(167,139,250,0.18)" stroke="rgba(139,92,246,0.45)" strokeWidth="1" />
                <path d="M8 8 L8 4 Q8 1 11 1 L19 1 Q22 1 22 4 L22 8" fill="none" stroke="rgba(139,92,246,0.38)" strokeWidth="1" />
                <line x1="0" y1="18" x2="30" y2="18" stroke="rgba(139,92,246,0.22)" strokeWidth="0.8" />
            </g>

            {/* Building 3 - skyscraper */}
            <rect x="230" y="30" width="55" height="140" rx="3" fill="rgba(139,92,246,0.12)" stroke="rgba(167,139,250,0.32)" strokeWidth="1" />
            <rect x="240" y="40" width="10" height="6" rx="1" fill="rgba(196,181,253,0.28)" />
            <rect x="260" y="40" width="10" height="6" rx="1" fill="rgba(196,181,253,0.22)" />
            <rect x="240" y="55" width="10" height="6" rx="1" fill="rgba(196,181,253,0.32)" />
            <rect x="260" y="55" width="10" height="6" rx="1" fill="rgba(196,181,253,0.26)" />
            <rect x="240" y="70" width="10" height="6" rx="1" fill="rgba(196,181,253,0.22)" />
            <rect x="260" y="70" width="10" height="6" rx="1" fill="rgba(196,181,253,0.32)" />
            <rect x="240" y="85" width="10" height="6" rx="1" fill="rgba(196,181,253,0.28)" />
            <rect x="240" y="100" width="10" height="6" rx="1" fill="rgba(196,181,253,0.32)" />
            <line x1="257" y1="18" x2="257" y2="30" stroke="rgba(167,139,250,0.45)" strokeWidth="1.5" />

            {/* Chart */}
            <g transform="translate(310,120)">
                <rect x="0" y="28" width="12" height="22" rx="2" fill="rgba(196,181,253,0.22)" />
                <rect x="18" y="16" width="12" height="34" rx="2" fill="rgba(167,139,250,0.28)" />
                <rect x="36" y="6" width="12" height="44" rx="2" fill="rgba(139,92,246,0.35)" />
                <polyline points="6,26 24,14 42,4" fill="none" stroke="rgba(250,204,21,0.55)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="42" cy="4" r="2.5" fill="rgba(250,204,21,0.65)" />
            </g>

            {/* Building 4 */}
            <rect x="380" y="110" width="40" height="60" rx="3" fill="rgba(167,139,250,0.09)" stroke="rgba(139,92,246,0.27)" strokeWidth="1" />
            <rect x="388" y="118" width="8" height="5" rx="1" fill="rgba(196,181,253,0.27)" />
            <rect x="402" y="118" width="8" height="5" rx="1" fill="rgba(196,181,253,0.22)" />

            {/* Factory */}
            <g transform="translate(440,100)">
                <rect x="0" y="20" width="50" height="50" rx="2" fill="rgba(139,92,246,0.12)" stroke="rgba(167,139,250,0.32)" strokeWidth="1" />
                <rect x="10" y="5" width="8" height="15" fill="rgba(139,92,246,0.09)" stroke="rgba(167,139,250,0.27)" strokeWidth="0.8" />
                <rect x="30" y="10" width="8" height="10" fill="rgba(139,92,246,0.09)" stroke="rgba(167,139,250,0.27)" strokeWidth="0.8" />
                <circle cx="14" cy="3" r="3" fill="rgba(167,139,250,0.12)">
                    <animate attributeName="cy" values="3;-4;3" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.12;0.25;0.12" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="25" cy="45" r="8" fill="none" stroke="rgba(196,181,253,0.32)" strokeWidth="1" />
                <circle cx="25" cy="45" r="3" fill="rgba(196,181,253,0.22)" />
            </g>

            {/* Building 5 - corporate */}
            <rect x="520" y="80" width="70" height="90" rx="3" fill="rgba(139,92,246,0.11)" stroke="rgba(167,139,250,0.32)" strokeWidth="1" />
            <rect x="530" y="88" width="10" height="6" rx="1" fill="rgba(196,181,253,0.27)" />
            <rect x="548" y="88" width="10" height="6" rx="1" fill="rgba(196,181,253,0.22)" />
            <rect x="566" y="88" width="10" height="6" rx="1" fill="rgba(196,181,253,0.27)" />
            <rect x="530" y="102" width="10" height="6" rx="1" fill="rgba(196,181,253,0.22)" />
            <rect x="548" y="102" width="10" height="6" rx="1" fill="rgba(196,181,253,0.32)" />
            <rect x="566" y="102" width="10" height="6" rx="1" fill="rgba(196,181,253,0.22)" />
            <circle cx="555" cy="145" r="8" fill="none" stroke="rgba(196,181,253,0.27)" strokeWidth="1" />
            <ellipse cx="555" cy="145" rx="8" ry="3" fill="none" stroke="rgba(196,181,253,0.22)" strokeWidth="0.5" />

            {/* Building 6 */}
            <rect x="670" y="60" width="50" height="110" rx="3" fill="rgba(139,92,246,0.11)" stroke="rgba(167,139,250,0.32)" strokeWidth="1" />
            <rect x="678" y="70" width="10" height="6" rx="1" fill="rgba(196,181,253,0.27)" />
            <rect x="698" y="70" width="10" height="6" rx="1" fill="rgba(196,181,253,0.22)" />
            <rect x="678" y="85" width="10" height="6" rx="1" fill="rgba(196,181,253,0.32)" />
            <rect x="698" y="85" width="10" height="6" rx="1" fill="rgba(196,181,253,0.27)" />
            <rect x="678" y="100" width="10" height="6" rx="1" fill="rgba(196,181,253,0.22)" />
            <rect x="698" y="100" width="10" height="6" rx="1" fill="rgba(196,181,253,0.32)" />

            {/* Trees */}
            <circle cx="165" cy="158" r="8" fill="rgba(74,222,128,0.09)" />
            <line x1="165" y1="166" x2="165" y2="170" stroke="rgba(74,222,128,0.18)" strokeWidth="1.5" />
            <circle cx="515" cy="160" r="7" fill="rgba(74,222,128,0.08)" />
            <line x1="515" y1="167" x2="515" y2="170" stroke="rgba(74,222,128,0.14)" strokeWidth="1.5" />
            <circle cx="760" cy="158" r="8" fill="rgba(74,222,128,0.09)" />
            <line x1="760" y1="166" x2="760" y2="170" stroke="rgba(74,222,128,0.18)" strokeWidth="1.5" />
        </svg>
    );

    return (
        <div className="sv-city-bg" aria-hidden="true">
            {/* Ambient orbs */}
            <div className="sv-orb sv-orb-1" />
            <div className="sv-orb sv-orb-2" />
            <div className="sv-orb sv-orb-3" />

            {/* Scrolling cityscape at bottom */}
            <div className="sv-city-scene">
                {/* Ground glow */}
                <div className="sv-ground-glow" />
                <div className="sv-city-track">
                    <CityTile offset={0} />
                    <CityTile offset={800} />
                    <CityTile offset={1600} />
                    <CityTile offset={2400} />
                </div>
            </div>
        </div>
    );
}

export function SolventioPageClient({
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

    const recentVideos = videos.slice(0, 6);

    return (
        <div className="sv-world-page">
            {/* Immersive city background */}
            <CityBackground />

            <div className="sv-world-inner">
                {/* ── Hero ── */}
                <header className="sv-hero">
                    <div className="sv-hero-brand">
                        <Image
                            src={SOLVENTIO_LOGO}
                            alt="Solventio"
                            width={52}
                            height={52}
                            className="sv-logo"
                            style={{ width: "auto", height: "52px", objectFit: "contain" }}
                        />
                        <span className="sv-badge">🏢 Para Empresas</span>
                    </div>
                    <h1 className="sv-title">
                        Solven<span className="sv-accent">tio</span>
                    </h1>
                    <p className="sv-subtitle">
                        Showroom de soluciones IA para empresas. Casos de estudio,
                        demos por departamento y tecnología que transforma procesos.
                    </p>
                    <div className="sv-hero-chips">
                        <span className="sv-chip">🏢 Por Departamento</span>
                        <span className="sv-chip">📊 Casos de Estudio</span>
                        <span className="sv-chip">🤖 Soluciones IA</span>
                        <span className="sv-chip">⚙️ Automatización</span>
                    </div>
                </header>

                {/* ── Videos Recientes ── */}
                {recentVideos.length > 0 && (
                    <section className="sv-section">
                        <div className="sv-section-label">
                            <span className="sv-section-dot" />
                            Recientes
                        </div>
                        <div className="sv-video-grid">
                            {recentVideos.map((video) => (
                                <Link
                                    key={video.id}
                                    href={`/solventio-world/${video.slug}`}
                                    className="sv-video-card"
                                >
                                    <div className="sv-video-thumb">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={video.thumbnail_url || getYouTubeThumbnail(video.youtube_video_id)}
                                            alt={video.title}
                                            loading="lazy"
                                        />
                                        <div className="sv-play-overlay">
                                            <div className="sv-play-btn">
                                                <PlayIcon className="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sv-video-body">
                                        {video.categories && (
                                            <span className="sv-video-cat">{video.categories.name}</span>
                                        )}
                                        <h3 className="sv-video-title">{video.title}</h3>
                                        {video.description && (
                                            <p className="sv-video-desc">{video.description}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Categorías + Todos los Videos ── */}
                <section className="sv-section">
                    <div className="sv-section-label">
                        <span className="sv-section-dot" />
                        Explorar por área
                    </div>

                    {categories.length > 0 && (
                        <div className="sv-cat-tabs">
                            <button
                                className={`sv-cat-tab${activeCategory === null ? " active" : ""}`}
                                onClick={() => setActiveCategory(null)}
                            >
                                Todos
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={`sv-cat-tab${activeCategory === cat.id ? " active" : ""}`}
                                    onClick={() => setActiveCategory(cat.id)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {filteredVideos.length > 0 ? (
                        <div className="sv-video-grid">
                            {filteredVideos.map((video) => (
                                <Link
                                    key={video.id}
                                    href={`/solventio-world/${video.slug}`}
                                    className="sv-video-card"
                                >
                                    <div className="sv-video-thumb">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={video.thumbnail_url || getYouTubeThumbnail(video.youtube_video_id)}
                                            alt={video.title}
                                            loading="lazy"
                                        />
                                        <div className="sv-play-overlay">
                                            <div className="sv-play-btn">
                                                <PlayIcon className="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sv-video-body">
                                        {video.categories && (
                                            <span className="sv-video-cat">{video.categories.name}</span>
                                        )}
                                        <h3 className="sv-video-title">{video.title}</h3>
                                        {video.description && (
                                            <p className="sv-video-desc">{video.description}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="sv-empty">
                            <span>🏢</span>
                            <h3>Próximamente</h3>
                            <p>Estamos preparando contenido corporativo. ¡Vuelve pronto!</p>
                        </div>
                    )}
                </section>

                {/* ── CTA Banner ── */}
                <section className="world-cta-banner solventio-cta-banner">
                    <div className="world-cta-banner-content">
                        <h2>¿Listo para llevar IA a tu empresa?</h2>
                        <p>Descubre cómo nuestras soluciones pueden transformar tus procesos. Agenda una cita con nuestro equipo.</p>
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
