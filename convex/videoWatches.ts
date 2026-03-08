import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const upsert = mutation({
    args: { videoId: v.id("videos") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // Check if already exists
        const existing = await ctx.db
            .query("video_watches")
            .withIndex("by_user_video", (q) =>
                q.eq("userId", userId).eq("videoId", args.videoId)
            )
            .first();

        if (!existing) {
            await ctx.db.insert("video_watches", {
                userId,
                videoId: args.videoId,
            });
        }
    },
});
