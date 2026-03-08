import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.string(),
        job_role: v.string(),
        tech_usage: v.string(),
        consent: v.boolean(),
        origin: v.string(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const leadId = await ctx.db.insert("leads", args);
        return leadId;
    },
});
