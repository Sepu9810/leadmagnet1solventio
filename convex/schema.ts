import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
    ...authTables,

    // Override the default users table to add custom fields
    users: defineTable({
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        email: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),

        // Custom fields for Step 2
        company: v.optional(v.string()),
        role: v.optional(v.string()),
        goal: v.optional(v.string()),
        profileCompleted: v.optional(v.boolean()),
    }).index("email", ["email"]),

    categories: defineTable({
        name: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        mundo: v.string(), // "sepuhack" | "solventio"
        sort_order: v.number(),
    })
        .index("by_mundo", ["mundo", "sort_order"])
        .index("by_slug", ["slug"]),

    videos: defineTable({
        title: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        short_summary: v.optional(v.string()),   // ~160 chars — meta description & OG
        long_summary: v.optional(v.string()),    // Texto largo — contenido enriquecido
        youtube_video_id: v.string(),
        youtube_start_seconds: v.optional(v.number()),
        thumbnail_url: v.optional(v.string()),
        transcript: v.optional(v.string()),
        key_insights: v.optional(v.array(v.string())),
        mundo: v.string(), // "sepuhack" | "solventio"
        is_published: v.boolean(),
        sort_order: v.number(),
        categoryId: v.optional(v.id("categories")),
    })
        .index("by_mundo_published", ["mundo", "is_published", "sort_order"])
        .index("by_slug_mundo", ["slug", "mundo"])
        .index("by_published", ["is_published", "sort_order"]),

    socialProof: defineTable({
        title: v.string(),
        companyName: v.optional(v.string()),
        country: v.string(),
        description: v.string(),
        heroImageUrl: v.string(),
        galleryImageUrls: v.optional(v.array(v.string())),
        companyLogoUrl: v.string(),
        isPublished: v.boolean(),
        sortOrder: v.number(),
    }).index("by_published", ["isPublished", "sortOrder"]),

    leads: defineTable({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
        job_role: v.string(),
        tech_usage: v.string(),
        consent: v.boolean(),
        origin: v.string(),
        status: v.string(),
        utm_source: v.optional(v.string()),
        utm_medium: v.optional(v.string()),
        utm_campaign: v.optional(v.string()),
        utm_content: v.optional(v.string()),
        utm_term: v.optional(v.string()),
        utm_id: v.optional(v.string()),
        fbclid: v.optional(v.string()),
        gclid: v.optional(v.string()),
        campaign_id: v.optional(v.string()),
        adset_id: v.optional(v.string()),
        ad_id: v.optional(v.string()),
        landing_path: v.optional(v.string()),
        landing_url: v.optional(v.string()),
        referrer: v.optional(v.string()),
        video_session_id: v.optional(v.string()),
        video_last_position_seconds: v.optional(v.number()),
        video_max_position_seconds: v.optional(v.number()),
        video_completed: v.optional(v.boolean()),
    }).index("by_email", ["email"]),

    video_watches: defineTable({
        userId: v.id("users"),
        videoId: v.id("videos"),
    }).index("by_user_video", ["userId", "videoId"]),

    sprint_video_sessions: defineTable({
        session_id: v.string(),
        video_id: v.string(),
        started_at: v.number(),
        first_play_at: v.optional(v.number()),
        last_event_at: v.number(),
        last_position_seconds: v.number(),
        max_position_seconds: v.number(),
        total_watch_seconds: v.number(),
        play_count: v.number(),
        pause_count: v.number(),
        seek_count: v.number(),
        pause_points_seconds: v.array(v.number()),
        seek_points_seconds: v.array(v.number()),
        completed: v.boolean(),
        completed_at: v.optional(v.number()),
        milestones_hit: v.array(v.number()),
        landing_path: v.optional(v.string()),
        landing_url: v.optional(v.string()),
        referrer: v.optional(v.string()),
        utm_source: v.optional(v.string()),
        utm_medium: v.optional(v.string()),
        utm_campaign: v.optional(v.string()),
        utm_content: v.optional(v.string()),
        utm_term: v.optional(v.string()),
        utm_id: v.optional(v.string()),
        fbclid: v.optional(v.string()),
        gclid: v.optional(v.string()),
        campaign_id: v.optional(v.string()),
        adset_id: v.optional(v.string()),
        ad_id: v.optional(v.string()),
    })
        .index("by_session_id", ["session_id"])
        .index("by_video_id", ["video_id"]),

    businessConfig: defineTable({
        welcomeEmailSubject: v.string(),
        welcomeEmailBody: v.string(),
        aiGeneralPrompt: v.string(),
        aiVideoChatPrompt: v.string(),
    }),
});

export default schema;
