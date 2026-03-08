"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SolventioPageClient } from "./SolventioPageClient";

export default function SolventioPage() {
    const categories = useQuery(api.categories.listByMundo, { mundo: "solventio" });
    const videos = useQuery(api.videos.listByMundo, { mundo: "solventio" });

    if (categories === undefined || videos === undefined) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <p style={{ color: "var(--text-secondary, #94a3b8)" }}>Cargando...</p>
            </div>
        );
    }

    // Map to expected format
    const mappedCategories = categories.map((c) => ({
        id: c._id,
        name: c.name,
        slug: c.slug,
        description: c.description ?? null,
    }));

    const mappedVideos = videos.map((v) => ({
        id: v._id,
        title: v.title,
        slug: v.slug,
        description: v.description ?? null,
        youtube_video_id: v.youtube_video_id,
        thumbnail_url: v.thumbnail_url ?? null,
        category_id: v.categoryId ?? null,
        categories: v.categories,
    }));

    return <SolventioPageClient categories={mappedCategories} videos={mappedVideos} />;
}
