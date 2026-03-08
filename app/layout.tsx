import type { Metadata, Viewport } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Navbar } from "@/components/Navbar";
import { AuthModal } from "@/components/AuthModal";
import { GlobalChatbot } from "@/components/GlobalChatbot";
import { Footer } from "@/components/Footer";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "700"]
});

const bodyFont = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"]
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://learnhub.solventio.co"),
  title: {
    default: "LearnHub by Solventio | Aprende y Transforma con IA",
    template: "%s | LearnHub Solventio",
  },
  description:
    "Plataforma de aprendizaje de Solventio. Explora SepuHack para emprendedores y Solventio para empresas. Videos prácticos, tutoriales y casos de estudio sobre IA y automatización de procesos.",
  keywords: [
    "inteligencia artificial para empresas",
    "ChatGPT para negocios",
    "automatización con IA",
    "IA para emprendedores Colombia",
    "Solventio",
    "SepuHack",
    "aprender IA online",
    "casos de éxito inteligencia artificial",
    "herramientas IA 2025",
    "automatización de procesos empresariales",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "LearnHub by Solventio | Aprende y Transforma con IA",
    description:
      "Explora dos mundos: SepuHack para emprendedores y Solventio para empresas. Videos, tutoriales y casos de estudio sobre IA.",
    type: "website",
    locale: "es_CO",
    url: "https://learnhub.solventio.co",
    siteName: "LearnHub by Solventio",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnHub by Solventio | Aprende y Transforma con IA",
    description: "Explora dos mundos de aprendizaje: SepuHack y Solventio.",
  },
  icons: {
    icon: "https://d537127951692c7fbd38ff662fb21b1c.cdn.bubble.io/f1769723313269x424679096768052900/solventio%20icon.png",
    shortcut: "https://d537127951692c7fbd38ff662fb21b1c.cdn.bubble.io/f1769723313269x424679096768052900/solventio%20icon.png",
  },
  alternates: {
    canonical: "https://learnhub.solventio.co",
  },
};

import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider apiRoute="/api/login">
      <html lang="es">
        <body className={`${headingFont.variable} ${bodyFont.variable}`}>
          <ConvexClientProvider>
            <Navbar />
            <AuthModal />
            {children}
            <Footer />
            <GlobalChatbot />
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
