export type SampleSocialProofEntry = {
  title: string;
  companyName: string;
  country: string;
  description: string;
  heroImageUrl: string;
  galleryImageUrls: string[];
  companyLogoUrl: string;
  sortOrder: number;
};

export const SAMPLE_SOCIAL_PROOF_ENTRIES: SampleSocialProofEntry[] = [
  {
    title: "Conferencia sobre IA aplicada a eficiencia operativa",
    description:
      "Sesion privada con lideres de operaciones para aterrizar quick wins, automatizacion y criterios de priorizacion en equipos reales.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80",
    companyLogoUrl: "https://logo.clearbit.com/hubspot.com",
    companyName: "HubSpot",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=80",
    ],
    country: "Colombia",
    sortOrder: 1,
  },
  {
    title: "Charla ejecutiva sobre agentes IA y automatizacion",
    description:
      "Workshop con equipo directivo para traducir tendencias de IA en decisiones concretas de negocio, procesos y adopcion interna.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80",
    companyLogoUrl: "https://logo.clearbit.com/notion.so",
    companyName: "Notion",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
    ],
    country: "Mexico",
    sortOrder: 2,
  },
  {
    title: "Formacion practica para equipos comerciales y operativos",
    description:
      "Espacio formativo para mostrar casos reales, diseno de prompts y oportunidades concretas de IA dentro del dia a dia del negocio.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=80",
    companyLogoUrl: "https://logo.clearbit.com/slack.com",
    companyName: "Slack",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=80",
    ],
    country: "Chile",
    sortOrder: 3,
  },
];
