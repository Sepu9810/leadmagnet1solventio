import { CalendarIcon } from "@/components/icons";
import { LandingIntro } from "@/components/LandingIntro";
import { LeadCapture } from "@/components/LeadCapture";
import {
  getPublicBookingUrl,
  getPublicYoutubeStartSeconds,
  getPublicYoutubeVideoId
} from "@/lib/env";
import { buildPreviewEmbedUrl } from "@/lib/video";
import { HeroOmnix } from "@/components/HeroOmnix";

const benefits = [
  {
    title: "Método CAR (Rápido)",
    description:
      "Aprende a estructurar prompts diarios (Contexto, Acción, Resultado) para que ChatGPT deje de alucinar."
  },
  {
    title: "Método ACERO (Avanzado)",
    description:
      "Crea asistentes robustos para tu equipo definiendo Estilo, Reglas y Obligaciones claras."
  },
  {
    title: "Herramientas Reales",
    description:
      "Descubre cómo usar NotebookLM como tu segundo cerebro para investigaciones profundas."
  }
];

export default function LandingPage() {
  const bookingUrl = getPublicBookingUrl();
  const youtubeVideoId = getPublicYoutubeVideoId();
  const startSeconds = getPublicYoutubeStartSeconds();
  const previewUrl = buildPreviewEmbedUrl(youtubeVideoId, startSeconds);

  return (
    <div className="brand-shell landing-v3">
      <LandingIntro />

      <main className="landing-v3-main">
        {/* Hidden Logical Trigger for Modal */}
        <LeadCapture hideDefaultTrigger />

        {/* New Omnix-Style Hero */}
        <HeroOmnix previewUrl={previewUrl} bookingUrl={bookingUrl} />

        <section className="section-block-v3" id="contenido">
          <header className="section-title-v3">
            <span className="tag">Por qué este contenido funciona</span>
            <h2>No es teoría: es una guía operativa para ejecutar</h2>
          </header>

          <div className="benefits-grid-v3">
            {benefits.map((item) => (
              <article key={item.title} className="panel benefit-card-v3">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel strip-cta-v3">
          <div>
            <h3>¿Listo para aplicar esto en tu empresa?</h3>
            <p>
              Agenda una cita y te mostramos cómo pasar de prompts a soluciones de negocio.
            </p>
          </div>
          <a className="primary-btn" href={bookingUrl}>
            <CalendarIcon className="btn-icon" />
            Agenda una cita con Solventio
          </a>
        </section>
      </main>
    </div>
  );
}
