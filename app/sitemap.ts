import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const BASE_URL = "https://learnhub.solventio.co";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${BASE_URL}/sepuhack`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/solventio-world`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/politica-de-privacidad`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];

    // Dynamic video pages — SepuHack
    let sepuhackVideos: MetadataRoute.Sitemap = [];
    try {
        const videos = await fetchQuery(api.videos.listByMundo, { mundo: "sepuhack" });
        sepuhackVideos = videos.map((v) => ({
            url: `${BASE_URL}/sepuhack/${v.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));
    } catch {
        // Silently ignore if Convex is unavailable during build
    }

    // Dynamic video pages — Solventio
    let solventioVideos: MetadataRoute.Sitemap = [];
    try {
        const videos = await fetchQuery(api.videos.listByMundo, { mundo: "solventio" });
        solventioVideos = videos.map((v) => ({
            url: `${BASE_URL}/solventio-world/${v.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));
    } catch {
        // Silently ignore if Convex is unavailable during build
    }

    return [...staticPages, ...sepuhackVideos, ...solventioVideos];
}
