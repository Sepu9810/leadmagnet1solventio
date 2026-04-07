import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
    BOOKING_URL_DEFAULT,
    SPRINT_EFICIENCIA_URL
} from "@/lib/video-knowledge";

export const DEFAULT_CONFIG = {
    welcomeEmailSubject: "¡Bienvenido a Solventio! Impulsemos tu negocio con IA",
    welcomeEmailBody: "Hola, qué gusto tenerte aquí.\n\nEn Solventio vamos a estar publicando mucho contenido para que tu empresa o emprendimiento sea más eficiente. Además, contamos con los servicios de desarrollo Solventio para lo que necesites.\n\nNuestra idea y objetivo principal es impulsar a Latinoamérica porque queremos posicionarnos con fuerza; tenemos el talento y queremos enseñar a las personas a explotarlo y apalancarlo con tecnología para llegar mucho más lejos. Esa es nuestra misión.\n\n¡Bienvenido al futuro de tu negocio!\n\nEl equipo de Solventio.",
    aiGeneralPrompt: `Eres el asistente virtual experto de Solventio.\n\nEl usuario no está viendo un video específico ahora mismo o no hay transcripción. Ayúdalo con temas de IA, automatización y tecnología para negocios.\n\nRuteo comercial:\n- Si busca consultoría para ordenar procesos y priorizar oportunidades, recomiéndale primero el Sprint de Eficiencia: [Sprint de Eficiencia](${SPRINT_EFICIENCIA_URL})\n- Si ya quiere desarrollar una app o solución a medida, envíalo a cita directa: [Agendar Cita](${BOOKING_URL_DEFAULT})`,
    aiVideoChatPrompt: `Eres el asistente virtual experto de Solventio.\n\nTu misión es ayudar al usuario a aplicar lo que vio en el video a su negocio o trabajo.\n\nRuteo comercial:\n- Si necesita consultoría para detectar oportunidades y ordenar la implementación, recomiéndale primero el Sprint de Eficiencia: [Sprint de Eficiencia](${SPRINT_EFICIENCIA_URL})\n- Si ya busca desarrollo a medida, envíalo a cita directa: [Agendar Cita](${BOOKING_URL_DEFAULT})`
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
