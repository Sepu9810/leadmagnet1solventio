"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { VideoPageClient } from "@/components/VideoPageClient";

type Props = {
    slug: string;
    mundo: "sepuhack" | "solventio";
    backUrl: string;
    backLabel: string;
};

export function VideoPageWrapper({ slug, mundo, backUrl, backLabel }: Props) {
    const video = useQuery(api.videos.getBySlugAndMundo, { slug, mundo });

    if (video === undefined) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <p style={{ color: "var(--text-secondary, #94a3b8)" }}>Cargando...</p>
            </div>
        );
    }

    if (video === null) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <p style={{ color: "var(--text-secondary, #94a3b8)" }}>Video no encontrado</p>
            </div>
        );
    }

    const typedVideo = {
        id: video._id,
        title: video.title,
        slug: video.slug,
        description: video.description ?? null,
        short_summary: video.short_summary ?? null,
        long_summary: video.long_summary ?? null,
        youtube_video_id: video.youtube_video_id,
        youtube_start_seconds: video.youtube_start_seconds ?? 0,
        thumbnail_url: video.thumbnail_url ?? null,
        transcript: video.transcript ?? null,
        key_insights: video.key_insights ?? [],
        mundo: video.mundo,
        categories: video.categories,
    };

    return (
        <VideoPageClient
            video={typedVideo}
            mundo={mundo}
            backUrl={backUrl}
            backLabel={backLabel}
        />
    );
}
