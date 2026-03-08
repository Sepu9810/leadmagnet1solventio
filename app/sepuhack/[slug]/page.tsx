import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { VideoPageWrapper } from "@/components/VideoPageWrapper";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const video = await fetchQuery(api.videos.getBySlugAndMundo, {
        slug,
        mundo: "sepuhack",
    }).catch(() => null);

    if (!video) {
        return {
            title: "Video no encontrado | SepuHacks",
            robots: { index: false, follow: false },
        };
    }

    const description =
        video.short_summary ||
        video.description ||
        `Aprende sobre ${video.title} en SepuHacks — la comunidad de emprendedores que usan IA.`;

    const canonical = `https://learnhub.solventio.co/sepuhack/${slug}`;
    const image = video.thumbnail_url || "https://learnhub.solventio.co/og-sepuhack.png";

    return {
        title: `${video.title} | SepuHacks`,
        description,
        alternates: { canonical },
        openGraph: {
            title: `${video.title} | SepuHacks`,
            description,
            url: canonical,
            siteName: "SepuHacks by Solventio",
            locale: "es_CO",
            type: "video.other",
            images: [{ url: image, width: 1280, height: 720, alt: video.title }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${video.title} | SepuHacks`,
            description,
            images: [image],
        },
        robots: { index: true, follow: true },
        keywords: [
            video.title,
            "SepuHacks",
            "emprendimiento con IA",
            "ChatGPT para negocios",
            "automatización",
            "Solventio",
            video.categories?.name ?? "",
        ].filter(Boolean),
    };
}

export default async function SepuhackVideoPage({ params }: Props) {
    const { slug } = await params;
    const video = await fetchQuery(api.videos.getBySlugAndMundo, {
        slug,
        mundo: "sepuhack",
    }).catch(() => null);

    // JSON-LD structured data
    const jsonLd = video
        ? {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: video.title,
            description:
                video.short_summary || video.description || video.title,
            thumbnailUrl: video.thumbnail_url
                ? [video.thumbnail_url]
                : undefined,
            embedUrl: `https://www.youtube.com/embed/${video.youtube_video_id}`,
            uploadDate: "2025-01-01T00:00:00Z",
            publisher: {
                "@type": "Organization",
                name: "Solventio",
                url: "https://learnhub.solventio.co",
            },
        }
        : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <VideoPageWrapper
                slug={slug}
                mundo="sepuhack"
                backUrl="/sepuhack"
                backLabel="← Volver a SepuHacks"
            />
        </>
    );
}
