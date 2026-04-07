import { mutation, query } from "./_generated/server";
import { SAMPLE_SOCIAL_PROOF_ENTRIES } from "../lib/social-proof-samples";

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("socialProof")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .collect();
  },
});

export const ensureSampleEntries = mutation({
  args: {},
  handler: async (ctx) => {
    const existingEntries = await ctx.db.query("socialProof").collect();
    const existingTitles = new Set(existingEntries.map((entry) => entry.title));
    let inserted = 0;

    for (const entry of SAMPLE_SOCIAL_PROOF_ENTRIES) {
      if (existingTitles.has(entry.title)) continue;

      await ctx.db.insert("socialProof", {
        ...entry,
        isPublished: true,
      });
      inserted += 1;
    }

    return {
      inserted,
      totalPublished: await ctx.db
        .query("socialProof")
        .withIndex("by_published", (q) => q.eq("isPublished", true))
        .collect()
        .then((entries) => entries.length),
    };
  },
});
