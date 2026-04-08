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
    },
    handler: async (ctx, args) => {
        const leadId = await ctx.db.insert("leads", args);
        return leadId;
    },
});
