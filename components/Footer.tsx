"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarIcon } from "@/components/icons";
import { BOOKING_URL_DEFAULT, SOLVENTIO_LOGO_URL } from "@/lib/video-knowledge";

export function Footer() {
    return (
        <footer className="hub-footer">
            {/* CTA Banner */}
            <div className="hub-footer-cta">
                <div className="hub-footer-cta-content">
                    <h3>¿Listo para transformar tu negocio con IA?</h3>
                    <p>Agenda una cita con nuestro equipo y descubre cómo la IA puede impulsar tu empresa.</p>
                </div>
                <div className="hub-footer-cta-actions">
                    <a
                        className="hub-footer-cta-btn"
                        href={BOOKING_URL_DEFAULT}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <CalendarIcon className="btn-icon" />
                        Agendar una Cita con Solventio
                    </a>
                    <a
                        className="hub-footer-secondary-btn"
                        href="https://solventio.co"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visitar solventio.co →
                    </a>
                </div>
            </div>

            {/* Footer Links */}
            <div className="hub-footer-bottom">
                <div className="hub-footer-brand">
                    <Image
                        src={SOLVENTIO_LOGO_URL}
                        alt="Solventio"
                        width={24}
                        height={24}
                        style={{ width: "auto", height: "24px", objectFit: "contain" }}
                    />
                    <span className="hub-footer-brand-name">LearnHub</span>
                    <span className="hub-footer-by">by Solventio</span>
                </div>
                <div className="hub-footer-links">
                    <Link href="/">Inicio</Link>
                    <Link href="/sepuhack">SepuHacks</Link>
                    <Link href="/solventio-world">Solventio</Link>
                    <Link href="/politica-de-privacidad">Política de Privacidad</Link>
                    <a href="https://solventio.co" target="_blank" rel="noopener noreferrer">Agencia</a>
                    <a href={BOOKING_URL_DEFAULT} target="_blank" rel="noopener noreferrer">Agendar Cita</a>
                </div>
                <p className="hub-footer-copy">© {new Date().getFullYear()} Solventio. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}
