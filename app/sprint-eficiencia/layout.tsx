import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sprint de Eficiencia | Consultoría IA para Empresas — Solventio",
  description:
    "Consultoría de 4 semanas para detectar dónde tu empresa pierde tiempo, priorizar oportunidades de mejora y definir qué automatizar primero. Sal con un plan de 90 días, ROI estimado y backlog accionable.",
  keywords: [
    "consultoría inteligencia artificial",
    "automatización de procesos con IA",
    "eficiencia operativa empresas",
    "IA para empresas Colombia",
    "consultoría IA empresas",
    "Sprint de Eficiencia Solventio",
    "automatización procesos empresariales",
    "diagnóstico operativo con IA",
  ],
  openGraph: {
    title: "Sprint de Eficiencia | Solventio",
    description:
      "En 4 semanas sabrás exactamente dónde estás perdiendo eficiencia y qué atacar primero. Consultoría de IA con criterio.",
    type: "website",
    locale: "es_CO",
    url: "https://learnhub.solventio.co/sprint-eficiencia",
    siteName: "Solventio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sprint de Eficiencia | Solventio",
    description:
      "Consultoría de 4 semanas para empresas que quieren dejar de improvisar con IA.",
  },
  robots: { index: true, follow: true },
};

export default function SprintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
