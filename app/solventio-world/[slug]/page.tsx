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
        mundo: "solventio",
    }).catch(() => null);

    if (!video) {
        return {
            title: "Video no encontrado | Solventio",
            robots: { index: false, follow: false },
        };
    }

    const description =
        video.short_summary ||
        video.description ||
        `Aprende sobre ${video.title} en Solventio — IA y automatización para empresas.`;

    const canonical = `https://learnhub.solventio.co/solventio-world/${slug}`;
    const image = video.thumbnail_url || "https://learnhub.solventio.co/og-solventio.png";

    return {
        title: `${video.title} | Solventio`,
        description,
        alternates: { canonical },
        openGraph: {
            title: `${video.title} | Solventio`,
            description,
            url: canonical,
            siteName: "Solventio",
            locale: "es_CO",
            type: "video.other",
            images: [{ url: image, width: 1280, height: 720, alt: video.title }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${video.title} | Solventio`,
            description,
            images: [image],
        },
        robots: { index: true, follow: true },
        keywords: [
            video.title,
            "Solventio",
            "IA para empresas",
            "automatización empresarial",
            "inteligencia artificial",
            "casos de éxito IA",
            video.categories?.name ?? "",
        ].filter(Boolean),
    };
}

export default async function SolventioVideoPage({ params }: Props) {
    const { slug } = await params;
    const video = await fetchQuery(api.videos.getBySlugAndMundo, {
        slug,
        mundo: "solventio",
    }).catch(() => null);

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
                mundo="solventio"
                backUrl="/solventio-world"
                backLabel="← Volver a Solventio"
            />
        </>
    );
}
