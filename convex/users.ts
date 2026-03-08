import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        return await ctx.db.get(userId);
    },
});

export const updateProfile = mutation({
    args: {
        company: v.string(),
        role: v.string(),
        goal: v.string(),
        phone: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("No autenticado");

        const user = await ctx.db.get(userId);
        if (!user) throw new Error("Usuario no encontrado");

        const isFirstTimeCompletingProfile = !user.profileCompleted;

        await ctx.db.patch(userId, {
            company: args.company,
            role: args.role,
            goal: args.goal,
            phone: args.phone,
            profileCompleted: true,
        });

        if (isFirstTimeCompletingProfile && user.email) {
            await ctx.scheduler.runAfter(0, internal.emails.sendWelcomeEmail, {
                email: user.email,
                name: user.name || "Usuario",
            });
        }
    },
});
