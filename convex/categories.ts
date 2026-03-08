import { query } from "./_generated/server";
import { v } from "convex/values";

export const listByMundo = query({
    args: { mundo: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("categories")
            .withIndex("by_mundo", (q) => q.eq("mundo", args.mundo))
            .collect();
    },
});
