import { query } from "./_generated/server";
import { v } from "convex/values";

export const listByMundo = query({
    args: { mundo: v.string() },
    handler: async (ctx, args) => {
        const videos = await ctx.db
            .query("videos")
            .withIndex("by_mundo_published", (q) =>
                q.eq("mundo", args.mundo).eq("is_published", true)
            )
            .collect();

        // Attach category info
        const videosWithCategory = await Promise.all(
            videos.map(async (video) => {
                let category = null;
                if (video.categoryId) {
                    const cat = await ctx.db.get(video.categoryId);
                    if (cat) {
                        category = { name: cat.name, slug: cat.slug };
                    }
                }
                return { ...video, categories: category };
            })
        );

        return videosWithCategory;
    },
});

export const getBySlugAndMundo = query({
    args: { slug: v.string(), mundo: v.string() },
    handler: async (ctx, args) => {
        const video = await ctx.db
            .query("videos")
            .withIndex("by_slug_mundo", (q) =>
                q.eq("slug", args.slug).eq("mundo", args.mundo)
            )
            .first();

        if (!video || !video.is_published) return null;

        let category = null;
        if (video.categoryId) {
            const cat = await ctx.db.get(video.categoryId);
            if (cat) {
                category = { name: cat.name, slug: cat.slug };
            }
        }

        return { ...video, categories: category };
    },
});

export const listPublished = query({
    args: {},
    handler: async (ctx) => {
        const videos = await ctx.db
            .query("videos")
            .withIndex("by_published", (q) => q.eq("is_published", true))
            .take(50);

        const videosWithCategory = await Promise.all(
            videos.map(async (video) => {
                let category = null;
                if (video.categoryId) {
                    const cat = await ctx.db.get(video.categoryId);
                    if (cat) {
                        category = { name: cat.name, slug: cat.slug };
                    }
                }
                return { ...video, categories: category };
            })
        );

        return videosWithCategory;
    },
});

export const getRelatedVideos = query({
    args: { videoId: v.id("videos"), mundo: v.string(), categorySlug: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const videos = await ctx.db
            .query("videos")
            .withIndex("by_mundo_published", (q) =>
                q.eq("mundo", args.mundo).eq("is_published", true)
            )
            .collect();

        // Attach category info
        const videosWithCategory = await Promise.all(
            videos.map(async (v) => {
                let category = null;
                if (v.categoryId) {
                    const cat = await ctx.db.get(v.categoryId);
                    if (cat) {
                        category = { name: cat.name, slug: cat.slug };
                    }
                }
                return { ...v, categories: category };
            })
        );

        // Filter out current video
        const others = videosWithCategory.filter((v) => v._id !== args.videoId);

        // Sort: same category first
        others.sort((a, b) => {
            const aSameCat = a.categories?.slug === args.categorySlug;
            const bSameCat = b.categories?.slug === args.categorySlug;
            if (aSameCat && !bSameCat) return -1;
            if (!aSameCat && bSameCat) return 1;
            return 0;
        });

        // Return up to 3
        return others.slice(0, 3);
    },
});
