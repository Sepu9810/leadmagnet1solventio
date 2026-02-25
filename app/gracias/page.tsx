import type { Metadata } from "next";
import Image from "next/image";

import { getPublicBookingUrl } from "@/lib/env";
import { SOLVENTIO_LOGO_URL } from "@/lib/video-knowledge";

export const metadata: Metadata = {
  title: "Registro completado | Solventio",
  robots: {
    index: false,
    follow: false
  }
};

export default function GraciasPage() {
  const bookingUrl = getPublicBookingUrl();

  return (
    <div className="brand-shell">
      <main className="centered-wrap">
        <section className="panel center-card">
          <Image
            src={SOLVENTIO_LOGO_URL}
            alt="Solventio"
            width={54}
            height={54}
            style={{ borderRadius: "50%" }}
          />
          <div className="badge">Registro confirmado</div>
          <h1>Revisa tu correo</h1>
          <p>
            Te acabamos de enviar el enlace para ver el video completo. Si no lo ves, revisa
            spam o la bandeja de promociones.
          </p>

          <div className="dual-actions" style={{ justifyContent: "center" }}>
            <a className="primary-btn" href="/video">
              Ir ahora al video
            </a>
            <a className="secondary-btn" href={bookingUrl}>
              Agenda una cita con Solventio
            </a>
          </div>

          <p style={{ marginTop: "1.2rem" }}>
            En la página del video también tendrás un chat IA para resolver dudas del contenido.
          </p>
        </section>
      </main>
    </div>
  );
}
