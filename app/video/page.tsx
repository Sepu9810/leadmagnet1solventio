import type { Metadata } from "next";
import Image from "next/image";

import { VideoChat } from "@/components/VideoChat";
import {
  getPublicBookingUrl,
  getPublicYoutubeStartSeconds,
  getPublicYoutubeVideoId
} from "@/lib/env";
import { SOLVENTIO_LOGO_URL, VIDEO_KEY_INSIGHTS } from "@/lib/video-knowledge";
import { buildWatchEmbedUrl } from "@/lib/video";

export const metadata: Metadata = {
  title: "Video completo + Chat IA | Solventio",
  robots: {
    index: false,
    follow: false
  }
};

export default function VideoPage() {
  const bookingUrl = getPublicBookingUrl();
  const youtubeVideoId = getPublicYoutubeVideoId();
  const startSeconds = getPublicYoutubeStartSeconds();
  const watchUrl = buildWatchEmbedUrl(youtubeVideoId, startSeconds);

  return (
    <div className="brand-shell">
      <main className="watch-layout">
        <section className="panel copy-panel">
          <div className="logo-row">
            <Image
              src={SOLVENTIO_LOGO_URL}
              alt="Solventio"
              width={42}
              height={42}
              className="solventio-logo"
            />
            <strong>Solventio</strong>
          </div>

          <span className="tag">Video completo + asistencia IA</span>
          <h1>Cómo aplicar IA de forma práctica en tu negocio</h1>
          <p>
            Mira el video completo y luego usa el chat abajo para aterrizar estas ideas a tu
            negocio.
          </p>

          <div className="video-shell" style={{ marginTop: "1rem" }}>
            {watchUrl ? (
              <iframe
                src={watchUrl}
                title="Video completo Solventio"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : ( // Fallback
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  background: "#0b1538"
                }}
              >
                <p style={{ margin: 0 }}>
                  Configura `NEXT_PUBLIC_YOUTUBE_VIDEO_ID` para mostrar el video.
                </p>
              </div>
            )}
          </div>

          {/* Top CTA */}
          <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>
            <a className="primary-btn" href={bookingUrl} style={{ width: "100%" }}>
              Agendar una cita con Solventio
            </a>
          </div>
        </section>

        {/* Chatbot Section */}
        <VideoChat
          videoId="legacy"
          videoTitle="IA para tu negocio — Solventio"
          transcript={null}
        />

        {/* Summary / Key Insights Section */}
        <section className="panel summary-panel" style={{ marginTop: "2rem" }}>
          <h3>Puntos clave del video</h3>
          <div className="benefit-grid">
            {VIDEO_KEY_INSIGHTS.map((item) => (
              <article key={item} className="benefit-item">
                <strong>Punto clave</strong>
                <span>{item}</span>
              </article>
            ))}
          </div>

          <div className="dual-actions" style={{ marginTop: "2rem" }}>
            <a className="primary-btn" href={bookingUrl}>
              Agenda una cita con Solventio
            </a>
            <a className="secondary-btn" href="/">
              Volver a la landing
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
