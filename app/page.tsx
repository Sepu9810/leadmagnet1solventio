"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const SOLVENTIO_LOGO =
  "https://d537127951692c7fbd38ff662fb21b1c.cdn.bubble.io/f1769723313269x424679096768052900/solventio%20icon.png";

/* ═══════ SepuHack: Large rotating planet with space elements ═══════ */
function SepuHackPlanet() {
  return (
    <div className="sepuhack-scene">
      {/* Stars scattered in space */}
      <div className="star star-1" />
      <div className="star star-2" />
      <div className="star star-3" />
      <div className="star star-4" />
      <div className="star star-5" />
      <div className="star star-6" />
      <div className="star star-7" />
      <div className="star star-8" />

      {/* Moon */}
      <svg className="sepuhack-moon" viewBox="0 0 60 60" aria-hidden="true">
        <circle cx="30" cy="30" r="24" fill="rgba(250,204,21,0.15)" stroke="rgba(250,204,21,0.4)" strokeWidth="1.5" />
        <circle cx="22" cy="22" r="4" fill="rgba(250,204,21,0.08)" />
        <circle cx="35" cy="28" r="3" fill="rgba(250,204,21,0.06)" />
        <circle cx="28" cy="38" r="2.5" fill="rgba(250,204,21,0.07)" />
      </svg>

      {/* Rocket 1 - flying diagonally */}
      <svg className="sepuhack-rocket rocket-1" viewBox="0 0 40 60" aria-hidden="true">
        <path d="M20 2 L30 22 L26 22 L26 38 L14 38 L14 22 L10 22 Z" fill="rgba(96,165,250,0.5)" stroke="rgba(147,197,253,0.7)" strokeWidth="1" />
        <circle cx="20" cy="22" r="3" fill="rgba(191,219,254,0.8)" />
        <path d="M14 38 L20 52 L26 38" fill="rgba(251,191,36,0.5)" />
        <path d="M12 42 L20 58 L28 42" fill="rgba(251,146,60,0.3)" />
      </svg>

      {/* Rocket 2 - smaller, different angle */}
      <svg className="sepuhack-rocket rocket-2" viewBox="0 0 40 60" aria-hidden="true">
        <path d="M20 2 L30 22 L26 22 L26 38 L14 38 L14 22 L10 22 Z" fill="rgba(59,130,246,0.4)" stroke="rgba(96,165,250,0.6)" strokeWidth="1" />
        <circle cx="20" cy="22" r="3" fill="rgba(147,197,253,0.7)" />
        <path d="M14 38 L20 50 L26 38" fill="rgba(251,191,36,0.4)" />
      </svg>

      {/* Lightbulb 1 */}
      <svg className="sepuhack-bulb bulb-1" viewBox="0 0 40 50" aria-hidden="true">
        <circle cx="20" cy="16" r="12" fill="none" stroke="rgba(250,204,21,0.5)" strokeWidth="1.5" />
        <path d="M15 28 L15 34 L25 34 L25 28" fill="none" stroke="rgba(250,204,21,0.4)" strokeWidth="1.2" />
        <line x1="15" y1="31" x2="25" y2="31" stroke="rgba(250,204,21,0.3)" strokeWidth="1" />
        <line x1="15" y1="34" x2="25" y2="34" stroke="rgba(250,204,21,0.3)" strokeWidth="1" />
        {/* Glow rays */}
        <line x1="20" y1="0" x2="20" y2="2" stroke="rgba(250,204,21,0.4)" strokeWidth="1" />
        <line x1="6" y1="16" x2="4" y2="16" stroke="rgba(250,204,21,0.4)" strokeWidth="1" />
        <line x1="34" y1="16" x2="36" y2="16" stroke="rgba(250,204,21,0.4)" strokeWidth="1" />
        <line x1="10" y1="6" x2="8" y2="4" stroke="rgba(250,204,21,0.3)" strokeWidth="1" />
        <line x1="30" y1="6" x2="32" y2="4" stroke="rgba(250,204,21,0.3)" strokeWidth="1" />
      </svg>

      {/* Lightbulb 2 */}
      <svg className="sepuhack-bulb bulb-2" viewBox="0 0 40 50" aria-hidden="true">
        <circle cx="20" cy="16" r="12" fill="rgba(250,204,21,0.08)" stroke="rgba(250,204,21,0.35)" strokeWidth="1.5" />
        <path d="M15 28 L15 34 L25 34 L25 28" fill="none" stroke="rgba(250,204,21,0.3)" strokeWidth="1.2" />
      </svg>

      {/* Large Planet */}
      <svg className="sepuhack-planet" viewBox="0 0 600 600" aria-hidden="true">
        <defs>
          <radialGradient id="planetGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="rgba(96,165,250,0.2)" />
            <stop offset="50%" stopColor="rgba(59,130,246,0.12)" />
            <stop offset="100%" stopColor="rgba(30,58,138,0.05)" />
          </radialGradient>
          <radialGradient id="planetAtmo" cx="50%" cy="50%">
            <stop offset="85%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.15)" />
          </radialGradient>
        </defs>
        {/* Atmosphere glow */}
        <circle cx="300" cy="300" r="290" fill="url(#planetAtmo)" />
        {/* Planet body */}
        <circle cx="300" cy="300" r="270" fill="url(#planetGrad)" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" />
        {/* Surface lines - continents feel */}
        <ellipse cx="300" cy="300" rx="270" ry="80" fill="none" stroke="rgba(96,165,250,0.12)" strokeWidth="0.8" />
        <ellipse cx="300" cy="300" rx="270" ry="150" fill="none" stroke="rgba(96,165,250,0.08)" strokeWidth="0.8" />
        <ellipse cx="300" cy="300" rx="180" ry="270" fill="none" stroke="rgba(96,165,250,0.1)" strokeWidth="0.8" />
        <ellipse cx="300" cy="300" rx="90" ry="270" fill="none" stroke="rgba(96,165,250,0.08)" strokeWidth="0.8" />
        {/* Continent patches */}
        <path d="M200 200 Q250 180 280 210 Q310 240 290 280 Q260 260 220 250 Q190 230 200 200" fill="rgba(59,130,246,0.08)" stroke="rgba(96,165,250,0.15)" strokeWidth="0.5" />
        <path d="M340 160 Q380 170 400 200 Q410 240 380 260 Q350 240 330 200 Q320 180 340 160" fill="rgba(96,165,250,0.06)" stroke="rgba(147,197,253,0.12)" strokeWidth="0.5" />
        <path d="M250 340 Q290 320 330 340 Q360 370 340 400 Q300 390 260 380 Q230 360 250 340" fill="rgba(59,130,246,0.07)" stroke="rgba(96,165,250,0.13)" strokeWidth="0.5" />
        {/* Surface icons */}
        {/* Small gear on surface */}
        <g transform="translate(220,230) scale(0.6)" opacity="0.5">
          <circle cx="15" cy="15" r="8" fill="none" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" />
          <circle cx="15" cy="15" r="3" fill="rgba(147,197,253,0.4)" />
        </g>
        {/* Code brackets on surface */}
        <g transform="translate(350,200) scale(0.5)" opacity="0.4">
          <path d="M8 4 L2 12 L8 20" fill="none" stroke="rgba(191,219,254,0.5)" strokeWidth="2" />
          <path d="M18 4 L24 12 L18 20" fill="none" stroke="rgba(191,219,254,0.5)" strokeWidth="2" />
        </g>
        {/* Wifi signal on surface */}
        <g transform="translate(280,360) scale(0.5)" opacity="0.4">
          <path d="M10 20 Q15 10 20 20" fill="none" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" />
          <path d="M6 16 Q15 4 24 16" fill="none" stroke="rgba(147,197,253,0.4)" strokeWidth="1.5" />
          <circle cx="15" cy="22" r="2" fill="rgba(147,197,253,0.5)" />
        </g>
        {/* Orbiting dot */}
        <circle r="4" fill="rgba(96,165,250,0.6)">
          <animateMotion dur="12s" repeatCount="indefinite" path="M300,30 A270,270 0 1,1 299.9,30" />
        </circle>
        <circle r="2.5" fill="rgba(147,197,253,0.5)">
          <animateMotion dur="18s" repeatCount="indefinite" path="M300,30 A270,270 0 1,0 300.1,30" />
        </circle>
      </svg>
    </div>
  );
}

/* ═══════ Solventio: Scrolling cityscape ═══════ */
function SolventioCityscape() {
  /* One "tile" of the city that repeats */
  const CityTile = ({ offset }: { offset: number }) => (
    <svg
      className="city-tile"
      viewBox="0 0 800 200"
      style={{ left: `${offset}px` }}
      aria-hidden="true"
    >
      {/* Ground line */}
      <line x1="0" y1="170" x2="800" y2="170" stroke="rgba(139,92,246,0.25)" strokeWidth="1.5" />

      {/* Building 1 - tall */}
      <rect x="20" y="50" width="60" height="120" rx="3" fill="rgba(139,92,246,0.12)" stroke="rgba(167,139,250,0.35)" strokeWidth="1" />
      <rect x="30" y="60" width="12" height="8" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="50" y="60" width="12" height="8" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="30" y="78" width="12" height="8" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="50" y="78" width="12" height="8" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="30" y="96" width="12" height="8" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="50" y="96" width="12" height="8" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="30" y="114" width="12" height="8" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="50" y="114" width="12" height="8" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="38" y="140" width="24" height="30" rx="2" fill="rgba(139,92,246,0.08)" stroke="rgba(167,139,250,0.2)" strokeWidth="0.8" />
      {/* Antenna */}
      <line x1="50" y1="40" x2="50" y2="50" stroke="rgba(167,139,250,0.4)" strokeWidth="1" />
      <circle cx="50" cy="38" r="3" fill="rgba(196,181,253,0.4)">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Building 2 - medium */}
      <rect x="100" y="90" width="45" height="80" rx="3" fill="rgba(167,139,250,0.1)" stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
      <rect x="108" y="98" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="125" y="98" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="108" y="112" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="125" y="112" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="108" y="126" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="125" y="126" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />

      {/* Briefcase */}
      <g transform="translate(170,138)">
        <rect x="0" y="8" width="30" height="22" rx="3" fill="rgba(167,139,250,0.15)" stroke="rgba(139,92,246,0.4)" strokeWidth="1" />
        <path d="M8 8 L8 4 Q8 1 11 1 L19 1 Q22 1 22 4 L22 8" fill="none" stroke="rgba(139,92,246,0.35)" strokeWidth="1" />
        <line x1="0" y1="18" x2="30" y2="18" stroke="rgba(139,92,246,0.2)" strokeWidth="0.8" />
      </g>

      {/* Building 3 - skyscraper */}
      <rect x="230" y="30" width="55" height="140" rx="3" fill="rgba(139,92,246,0.1)" stroke="rgba(167,139,250,0.3)" strokeWidth="1" />
      <rect x="240" y="40" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="260" y="40" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="240" y="55" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="260" y="55" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="240" y="70" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="260" y="70" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="240" y="85" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="260" y="85" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="240" y="100" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="260" y="100" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="240" y="115" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="260" y="115" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      {/* Spire */}
      <line x1="257" y1="18" x2="257" y2="30" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5" />

      {/* Chart */}
      <g transform="translate(310,120)">
        <rect x="0" y="28" width="12" height="22" rx="2" fill="rgba(196,181,253,0.2)" />
        <rect x="18" y="16" width="12" height="34" rx="2" fill="rgba(167,139,250,0.25)" />
        <rect x="36" y="6" width="12" height="44" rx="2" fill="rgba(139,92,246,0.3)" />
        <polyline points="6,26 24,14 42,4" fill="none" stroke="rgba(250,204,21,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="42" cy="4" r="2.5" fill="rgba(250,204,21,0.6)" />
      </g>

      {/* Building 4 - small */}
      <rect x="380" y="110" width="40" height="60" rx="3" fill="rgba(167,139,250,0.08)" stroke="rgba(139,92,246,0.25)" strokeWidth="1" />
      <rect x="388" y="118" width="8" height="5" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="402" y="118" width="8" height="5" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="388" y="130" width="8" height="5" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="402" y="130" width="8" height="5" rx="1" fill="rgba(196,181,253,0.25)" />

      {/* Factory / Production */}
      <g transform="translate(440,100)">
        <rect x="0" y="20" width="50" height="50" rx="2" fill="rgba(139,92,246,0.1)" stroke="rgba(167,139,250,0.3)" strokeWidth="1" />
        {/* Chimney */}
        <rect x="10" y="5" width="8" height="15" fill="rgba(139,92,246,0.08)" stroke="rgba(167,139,250,0.25)" strokeWidth="0.8" />
        <rect x="30" y="10" width="8" height="10" fill="rgba(139,92,246,0.08)" stroke="rgba(167,139,250,0.25)" strokeWidth="0.8" />
        {/* Smoke */}
        <circle cx="14" cy="3" r="3" fill="rgba(167,139,250,0.1)">
          <animate attributeName="cy" values="3;-2;3" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.1;0.2;0.1" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Gear icon inside */}
        <circle cx="25" cy="45" r="8" fill="none" stroke="rgba(196,181,253,0.3)" strokeWidth="1" />
        <circle cx="25" cy="45" r="3" fill="rgba(196,181,253,0.2)" />
      </g>

      {/* Building 5 - wide corporate */}
      <rect x="520" y="80" width="70" height="90" rx="3" fill="rgba(139,92,246,0.1)" stroke="rgba(167,139,250,0.3)" strokeWidth="1" />
      <rect x="530" y="88" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="548" y="88" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="566" y="88" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="530" y="102" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="548" y="102" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="566" y="102" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="530" y="116" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="548" y="116" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="566" y="116" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      {/* Globe logo on building */}
      <circle cx="555" cy="145" r="8" fill="none" stroke="rgba(196,181,253,0.25)" strokeWidth="1" />
      <ellipse cx="555" cy="145" rx="8" ry="3" fill="none" stroke="rgba(196,181,253,0.2)" strokeWidth="0.5" />

      {/* Suitcase 2 */}
      <g transform="translate(620,142)">
        <rect x="0" y="6" width="24" height="18" rx="3" fill="rgba(167,139,250,0.12)" stroke="rgba(139,92,246,0.35)" strokeWidth="1" />
        <path d="M7 6 L7 3 Q7 1 9 1 L15 1 Q17 1 17 3 L17 6" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="0.8" />
      </g>

      {/* Building 6 */}
      <rect x="670" y="60" width="50" height="110" rx="3" fill="rgba(139,92,246,0.1)" stroke="rgba(167,139,250,0.3)" strokeWidth="1" />
      <rect x="678" y="70" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="698" y="70" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="678" y="85" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="698" y="85" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="678" y="100" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />
      <rect x="698" y="100" width="10" height="6" rx="1" fill="rgba(196,181,253,0.3)" />
      <rect x="678" y="115" width="10" height="6" rx="1" fill="rgba(196,181,253,0.25)" />
      <rect x="698" y="115" width="10" height="6" rx="1" fill="rgba(196,181,253,0.2)" />

      {/* Trees between buildings */}
      <circle cx="165" cy="158" r="8" fill="rgba(74,222,128,0.08)" />
      <line x1="165" y1="166" x2="165" y2="170" stroke="rgba(74,222,128,0.15)" strokeWidth="1.5" />
      <circle cx="515" cy="160" r="7" fill="rgba(74,222,128,0.07)" />
      <line x1="515" y1="167" x2="515" y2="170" stroke="rgba(74,222,128,0.12)" strokeWidth="1.5" />
      <circle cx="760" cy="158" r="8" fill="rgba(74,222,128,0.08)" />
      <line x1="760" y1="166" x2="760" y2="170" stroke="rgba(74,222,128,0.15)" strokeWidth="1.5" />
    </svg>
  );

  return (
    <div className="solventio-cityscape">
      <div className="cityscape-track">
        <CityTile offset={0} />
        <CityTile offset={800} />
        <CityTile offset={1600} />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);

  return (
    <div className="worlds-homepage">
      <div
        className={`worlds-split ${hoveredSide === "left"
          ? "hover-left"
          : hoveredSide === "right"
            ? "hover-right"
            : ""
          }`}
      >
        {/* ═══════════ LEFT: SEPUHACK ═══════════ */}
        <Link
          href="/sepuhack"
          className="world-panel sepuhack-panel"
          onMouseEnter={() => setHoveredSide("left")}
          onMouseLeave={() => setHoveredSide(null)}
        >
          {/* Animated background orbs */}
          <div className="world-bg-effects">
            <div className="world-orb orb-1" />
            <div className="world-orb orb-2" />
            <div className="world-orb orb-3" />
            <div className="world-grid-lines" />
          </div>

          {/* Hover vignette */}
          <div className="world-vignette sepuhack-vignette" />

          <div className="world-content">
            <div className="world-logo-area">
              <div className="world-logo-glow sepuhack-glow">
                <span className="world-logo-text">SH</span>
              </div>
              <span className="world-badge sepuhack-badge">Para Emprendedores</span>
            </div>

            <h1 className="world-title">
              Sepu<span className="world-accent sepuhack-accent">Hack</span>
            </h1>

            <p className="world-description">
              Aprende a construir, automatizar y escalar tu negocio con tecnología.
              Videos prácticos, sin rodeos, hechos para que ejecutes hoy.
            </p>

            <div className="world-features">
              <div className="world-feature-chip">
                <span className="feature-icon">🚀</span>
                <span>Tutoriales DIY</span>
              </div>
              <div className="world-feature-chip">
                <span className="feature-icon">🧠</span>
                <span>IA Práctica</span>
              </div>
              <div className="world-feature-chip">
                <span className="feature-icon">⚡</span>
                <span>Automatización</span>
              </div>
            </div>

            <span className="world-cta sepuhack-cta">
              Explorar SepuHack
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </div>

          {/* Floating cards scattered */}
          <div className="world-floating-cards">
            <div className="floating-card float-card-1">
              <div className="floating-card-icon sepuhack-card-icon">▶</div>
              <span>Cómo usar ChatGPT</span>
            </div>
            <div className="floating-card float-card-2">
              <div className="floating-card-icon sepuhack-card-icon">▶</div>
              <span>Automatiza tu negocio</span>
            </div>
          </div>

          {/* Large planet scene covering bottom */}
          <SepuHackPlanet />
        </Link>

        {/* ═══════════ DIVIDER ═══════════ */}
        <div className="worlds-divider">
          <div className="divider-line" />
          <div className="divider-badge">
            <span>ó</span>
          </div>
          <div className="divider-line" />
        </div>

        {/* ═══════════ RIGHT: SOLVENTIO ═══════════ */}
        <Link
          href="/solventio-world"
          className="world-panel solventio-panel"
          onMouseEnter={() => setHoveredSide("right")}
          onMouseLeave={() => setHoveredSide(null)}
        >
          {/* Animated background orbs */}
          <div className="world-bg-effects">
            <div className="world-orb orb-1" />
            <div className="world-orb orb-2" />
            <div className="world-orb orb-3" />
            <div className="world-grid-lines" />
          </div>

          {/* Hover vignette */}
          <div className="world-vignette solventio-vignette" />

          <div className="world-content">
            <div className="world-logo-area">
              <Image
                src={SOLVENTIO_LOGO}
                alt="Solventio"
                width={48}
                height={48}
                className="world-logo-img"
                style={{ width: "auto", height: "48px", objectFit: "contain" }}
              />
              <span className="world-badge solventio-badge">Para Empresas</span>
            </div>

            <h1 className="world-title">
              Solven<span className="world-accent solventio-accent">tio</span>
            </h1>

            <p className="world-description">
              Descubre cómo la IA transforma empresas. Showroom de soluciones,
              casos de estudio y demos por departamento.
            </p>

            <div className="world-features">
              <div className="world-feature-chip">
                <span className="feature-icon">🏢</span>
                <span>Por Departamento</span>
              </div>
              <div className="world-feature-chip">
                <span className="feature-icon">📊</span>
                <span>Casos de Estudio</span>
              </div>
              <div className="world-feature-chip">
                <span className="feature-icon">🤖</span>
                <span>Soluciones IA</span>
              </div>
            </div>

            <span className="world-cta solventio-cta">
              Explorar Solventio
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </div>

          {/* Floating cards scattered */}
          <div className="world-floating-cards">
            <div className="floating-card float-card-1">
              <div className="floating-card-icon solventio-card-icon">▶</div>
              <span>IA para tu empresa</span>
            </div>
            <div className="floating-card float-card-2">
              <div className="floating-card-icon solventio-card-icon">▶</div>
              <span>Caso: PQR Automation</span>
            </div>
          </div>

          {/* Scrolling cityscape covering bottom */}
          <SolventioCityscape />
        </Link>
      </div>
    </div>
  );
}
