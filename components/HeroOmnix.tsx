"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CalendarIcon, PlayIcon } from "@/components/icons";

// Icons for Floating Badge
const AgentIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-full h-full"
        style={{ color: "#0f172a", padding: "4px" }}
    >
        <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clipRule="evenodd"
        />
    </svg>
);

const LOADING_TEXTS = [
    "Cargando Método CAR...",
    "Iniciando ACERO...",
    "Conectando NotebookLM...",
    "Analizando Prompts...",
    "Escalando Operaciones..."
];

export function HeroOmnix({
    previewUrl,
    bookingUrl
}: {
    previewUrl: string | null;
    bookingUrl: string;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [loadingIndex, setLoadingIndex] = useState(0);

    // Cycling Text Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // 3D Tilt Logic
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; // Mouse x relative to card
        const y = e.clientY - rect.top; // Mouse y relative to card

        // Calculate rotation: center is (0,0)
        // Range: -10deg to 10deg
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 8; // Rotate Y based on X-axis movement
        const rotateX = ((centerY - y) / centerY) * 8; // Rotate X based on Y-axis movement

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <section className="omnix-hero-container">
            {/* LEFT COLUMN: Content */}
            <article className="omnix-content">
                <div className="logo-row" style={{ marginBottom: "1.5rem" }}>
                    <Image
                        src="https://d537127951692c7fbd38ff662fb21b1c.cdn.bubble.io/f1769723313269x424679096768052900/solventio%20icon.png"
                        alt="Solventio"
                        width={42}
                        height={42}
                        className="solventio-logo"
                        style={{ width: "auto", height: "auto", maxHeight: "42px" }}
                    />
                    <strong>Solventio</strong>
                </div>

                <div className="omnix-tag">
                    <span
                        style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#38d4b1",
                            display: "block"
                        }}
                    />
                    Agencia de Automatización IA
                </div>

                <h1 className="omnix-title">
                    Convierte la IA en <span className="omnix-highlight">resultados reales</span>
                </h1>

                <p className="omnix-subtitle">
                    "Conocimiento que puedes aplicar hoy mismo" – Sebastián (SepuHacks)
                </p>

                <p className="omnix-desc">
                    Descubre cómo pasar del "chat" a sistemas operativos reales usando los métodos CAR,
                    ACERO y NotebookLM. Una guía práctica para dueños de negocio.
                </p>

                <div className="omnix-buttons">
                    <button className="omnix-btn-glow" data-open-lead-modal>
                        <PlayIcon className="w-5 h-5" /> {/* Reusing PlayIcon specific handling if needed */}
                        <span style={{ marginLeft: "0.4rem" }}>Ver Clase Gratuita Ahora</span>
                    </button>

                    <a href={bookingUrl} className="omnix-btn-secondary">
                        <CalendarIcon className="w-5 h-5" />
                        <span style={{ marginLeft: "0.4rem" }}>Agenda una cita</span>
                    </a>
                </div>
            </article>

            {/* RIGHT COLUMN: 3D Visual */}
            <article className="omnix-visual-stage">
                {/* Floating Badge (Top Left) - OUTSIDE card for no tilt effect */}
                <button className="omnix-badge-float" data-open-lead-modal>
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

                {/* 3D Card Container */}
                <div
                    ref={cardRef}
                    className="omnix-3d-card"
                    style={{
                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    data-open-lead-modal
                >
                    {/* Scan Line */}
                    <div className="omnix-scan-line" />

                    {/* Video Preview Content */}
                    <div className="omnix-card-content">
                        {previewUrl ? (
                            <iframe
                                src={previewUrl}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                    pointerEvents: "none"
                                }}
                                title="Preview"
                            />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    background: "#0b1538",
                                    display: "grid",
                                    placeItems: "center",
                                    color: "white"
                                }}
                            >
                                Preview no disponible
                            </div>
                        )}
                        {/* Dark overlay for contrast */}
                        <div className="omnix-video-overlay" />
                    </div>

                    {/* Center Play Button Overlay */}
                    <button className="omnix-center-play" data-open-lead-modal aria-label="Ver video">
                        <PlayIcon className="omnix-center-play-icon" />
                    </button>
                </div>
            </article>
        </section>
    );
}
