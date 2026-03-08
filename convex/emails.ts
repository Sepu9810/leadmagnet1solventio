import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { api } from "./_generated/api";

export const sendWelcomeEmail = internalAction({
    args: {
        email: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        // Fetch config
        const config = await ctx.runQuery(api.config.getConfig);

        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.error("No RESEND_API_KEY found.");
            return;
        }

        const resend = new Resend(resendApiKey);

        const body = config.welcomeEmailBody.replace("{{name}}", args.name || "Usuario");

        try {
            await resend.emails.send({
                from: "Solventio <hola@solventio.co>",
                to: args.email,
                subject: config.welcomeEmailSubject,
                text: body,
            });
            console.log("Welcome email sent to", args.email);
        } catch (error) {
            console.error("Failed to send welcome email", error);
        }
    }
});
