import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://lead.solventio.co"),
  title: "Aplica IA en tu Empresa: Clase Gratuita | Solventio",
  description:
    "Aprende métodos probados (CAR y ACERO) para integrar Inteligencia Artificial en tu negocio. Deja de alucinar con ChatGPT y empieza a optimizar procesos.",
  keywords: ["Inteligencia artificial empresas", "ChatGPT para negocios", "Automatización IA", "Solventio"],
  openGraph: {
    title: "Aplica IA en tu Empresa: Clase Gratuita | Solventio",
    description:
      "Descubre cómo pasar del chat a sistemas operativos reales usando IA. Accede al video demostrativo y agenda una consultoría estratégica.",
    type: "website",
    locale: "es_CO",
    url: "https://lead.solventio.co",
    siteName: "Solventio IA"
  },
  twitter: {
    card: "summary_large_image",
    title: "Aplica IA en tu Empresa: Clase Gratuita | Solventio",
    description: "Aprende métodos probados para integrar IA en tu negocio y optimizar tus procesos operativos."
  },
  icons: {
    icon: "https://d537127951692c7fbd38ff662fb21b1c.cdn.bubble.io/f1769723313269x424679096768052900/solventio%20icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
