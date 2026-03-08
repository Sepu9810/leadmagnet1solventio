"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { CalendarIcon } from "@/components/icons";
import { BOOKING_URL_DEFAULT } from "@/lib/video-knowledge";

const SOLVENTIO_LOGO =
    "https://d537127951692c7fbd38ff662fb21b1c.cdn.bubble.io/f1769723313269x424679096768052900/solventio%20icon.png";

export function Navbar() {
    const pathname = usePathname();
    const { user, loading, signOut } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isSepuhack = pathname.startsWith("/sepuhack");
    const isSolventio = pathname.startsWith("/solventio-world");

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getUserInitial = () => {
        if (!user) return "?";
        const displayName = user.name || user.email || "";
        return displayName.charAt(0).toUpperCase() || "U";
    };

    return (
        <nav className="hub-navbar">
            <a href="https://solventio.co" target="_blank" rel="noopener noreferrer" className="hub-navbar-logo">
                <Image
                    src={SOLVENTIO_LOGO}
                    alt="Solventio"
                    width={32}
                    height={32}
                    style={{ width: "auto", height: "32px", objectFit: "contain" }}
                />
                <span>LearnHub</span>
            </a>

            <div className="hub-navbar-links">
                <Link
                    href="/"
                    className={`hub-navbar-link ${!isSepuhack && !isSolventio ? "active-home" : ""}`}
                >
                    Inicio
                </Link>
                <Link
                    href="/sepuhack"
                    className={`hub-navbar-link ${isSepuhack ? "active-sepuhack" : ""}`}
                >
                    SepuHack
                </Link>
                <Link
                    href="/solventio-world"
                    className={`hub-navbar-link ${isSolventio ? "active-solventio" : ""}`}
                >
                    Solventio
                </Link>
                <a
                    href="https://solventio.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hub-navbar-link hub-navbar-agency-link"
                >
                    Agencia ↗
                </a>
            </div>

            <div className="hub-navbar-actions">
                <a
                    className="hub-navbar-cta"
                    href={BOOKING_URL_DEFAULT}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <CalendarIcon className="hub-navbar-cta-icon" />
                    Agendar Cita
                </a>
                {loading ? null : user ? (
                    <div style={{ position: "relative" }} ref={dropdownRef}>
                        <button
                            className="hub-navbar-avatar"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            aria-label="Menú de usuario"
                        >
                            {getUserInitial()}
                        </button>
                        {dropdownOpen && (
                            <div className="hub-navbar-dropdown">
                                <button
                                    onClick={async () => {
                                        await signOut();
                                        setDropdownOpen(false);
                                    }}
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button className="hub-navbar-login-btn" data-open-auth-modal>
                        Registrarse
                    </button>
                )}
            </div>
        </nav>
    );
}
