import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const DEFAULT_CONFIG = {
    welcomeEmailSubject: "¡Bienvenido a Solventio! Impulsemos tu negocio con IA",
    welcomeEmailBody: "Hola, qué gusto tenerte aquí.\n\nEn Solventio vamos a estar publicando mucho contenido para que tu empresa o emprendimiento sea más eficiente. Además, contamos con los servicios de desarrollo Solventio para lo que necesites.\n\nNuestra idea y objetivo principal es impulsar a Latinoamérica porque queremos posicionarnos con fuerza; tenemos el talento y queremos enseñar a las personas a explotarlo y apalancarlo con tecnología para llegar mucho más lejos. Esa es nuestra misión.\n\n¡Bienvenido al futuro de tu negocio!\n\nEl equipo de Solventio.",
    aiGeneralPrompt: "Eres el asistente virtual experto de Solventio...\n\nEl usuario no está viendo un video específico ahora mismo o no hay transcripción. Ayúdalo de forma general con temas de IA, automatización y tecnología para negocios. Fomenta el uso de los servicios de desarrollo de Solventio.",
    aiVideoChatPrompt: "Eres el asistente virtual experto de Solventio...\n\nTu misión es ayudar al usuario a aplicar lo que vio en el video a su negocio o trabajo. Si la pregunta está fuera de alcance, sugiérele agendar cita en cal.com/solventio."
};

export const getConfig = query({
    args: {},
    handler: async (ctx) => {
        const config = await ctx.db.query("businessConfig").first();
        return config || DEFAULT_CONFIG;
    },
});

export const seedConfig = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("businessConfig").first();
        if (!existing) {
            await ctx.db.insert("businessConfig", DEFAULT_CONFIG);
        }
    },
});

export const updateConfig = mutation({
    args: {
        welcomeEmailSubject: v.optional(v.string()),
        welcomeEmailBody: v.optional(v.string()),
        aiGeneralPrompt: v.optional(v.string()),
        aiVideoChatPrompt: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("businessConfig").first();
        if (existing) {
            await ctx.db.patch(existing._id, args);
        } else {
            await ctx.db.insert("businessConfig", {
                welcomeEmailSubject: args.welcomeEmailSubject ?? DEFAULT_CONFIG.welcomeEmailSubject,
                welcomeEmailBody: args.welcomeEmailBody ?? DEFAULT_CONFIG.welcomeEmailBody,
                aiGeneralPrompt: args.aiGeneralPrompt ?? DEFAULT_CONFIG.aiGeneralPrompt,
                aiVideoChatPrompt: args.aiVideoChatPrompt ?? DEFAULT_CONFIG.aiVideoChatPrompt,
            });
        }
    },
});
