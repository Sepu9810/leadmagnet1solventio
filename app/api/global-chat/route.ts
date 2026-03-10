import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import OpenAI from "openai";
import { getServerEnv } from "@/lib/env";
import { z } from "zod";
import { api } from "@/convex/_generated/api";

const globalChatSchema = z.object({
    message: z.string().min(1),
    previousResponseId: z.string().optional(),
    userContext: z.any().optional()
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = globalChatSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { ok: false, message: "Mensaje inválido" },
                { status: 400 }
            );
        }

        const env = getServerEnv();

        // Fetch video catalog from Convex
        const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
        const videos = await convex.query(api.videos.listPublished);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://learnhub.solventio.co";

        // Build video catalog string for system prompt
        // Using only minimal fields (ID, Title, Summary, URL) to avoid context bloat
        const videoCatalog = (videos ?? [])
            .map((v) => {
                const path = v.mundo === "sepuhack" ? "sepuhack" : "solventio-world";
                const url = `${baseUrl}/${path}/${v.slug}`;
                const summary = v.short_summary || v.description || "Sin descripción";
                const thumbnail = v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_video_id}/mqdefault.jpg`;
                return `- ID: ${v._id} | Título: "${v.title}" | Resumen: ${summary} | ENLACE_A_USAR: [${v.title}|${thumbnail}](${url})`;
            })
            .join("\n");

        const userCtxStr = parsed.data.userContext
            ? `\nCONTEXTO DEL USUARIO ACTUAL:
Nombre: ${parsed.data.userContext.name || "Usuario"}
Email: ${parsed.data.userContext.email || "No especificado"}
Empresa: ${parsed.data.userContext.company || "No especificada"}
Rol: ${parsed.data.userContext.role || "No especificado"}
Objetivo: ${parsed.data.userContext.goal || "No especificado"}
Usa este contexto para saludarlo y personalizar tus sugerencias si aplica.` : "";

        const systemPrompt = `
Eres el asistente global del Solventio Hub, una plataforma de aprendizaje con dos secciones:
- SepuHacks: Videos para emprendedores (tutoriales DIY, IA práctica, automatización)
- Solventio: Videos corporativos (showroom de soluciones IA, casos de estudio por departamento)
${userCtxStr}

CATÁLOGO DE VIDEOS DISPONIBLES:
${videoCatalog || "No hay videos publicados todavía."}

TU MISIÓN:
1. Ayudar al usuario a encontrar el video ideal según sus necesidades
2. Cuando recomiendas un video, SIEMPRE usa EXACTAMENTE el formato de ENLACE_A_USAR que te doy en el catálogo. ¡No lo modifiques! Debe ser así: [Título|URL_del_Thumbnail](URL_del_video)

3. FLUJO DE AGENDA (CRÍTICO): Si el usuario pide explícitamente agendar una cita, tener una llamada, o dice tener un proyecto/app:
   - VE AL GRANO. Sé extremadamente breve y amigable. No ofrezcas preparar descripciones ni pidas datos de contacto (nombre, cargo, huso horario), todo eso lo llenan en el enlace.
   - Si no te ha contado nada de su idea aún, dile algo muy corto como: "¡Claro que sí! Cuéntame brevemente de qué trata tu idea o proyecto para saber cómo podemos ayudarte mejor antes de pasarte el enlace." (NO mandes el enlace todavía).
   - Si ya te contó la idea y ves que es una EMPRESA/STARTUP O TIENE PRESUPUESTO: Envíale directamente el enlace de esta forma exacta: [Agendar Cita](https://cal.com/solventio/conozcamos-tu-idea). No preguntes nada más.
   - Si ya te contó la idea y ves que es una IDEA MUY TEMPRANA (sin monetizar, sin presupuesto): Recomienda primero un video sobre "cómo empezar" o "MVP", y añade directo: "Si igual prefieres que conversemos para avanzar más rápido, puedes agendar aquí: [Agendar Cita](https://cal.com/solventio/conozcamos-tu-idea)". No preguntes nada más.
   - IMPORTANTE: Nunca pidas datos extras ni hagas listas de "lo que debes llevar a la reunión". Solo diles el enlace para que agenden.

4. Sé conciso, amable y directo. No uses relleno.
5. Responde siempre en español.

REGLAS DE FORMATO (CRÍTICO):
- RESPETA LOS SALTOS DE LÍNEA. Divide la información en varias líneas pequeñas en lugar de un gran bloque de texto. Usa doble salto de línea entre párrafos.
- Usa listas con viñetas si vas a sugerir varias cosas, PERO NO le pongas guiones/viñetas a los enlaces de videos.
- IMPORTANTE: Escribe los botones o ENLACE_A_USAR en una línea nueva por sí solos. NO pongas guiones/viñetas (-) ni texto pegado en esa misma línea.
`;

        const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
        const response = await client.responses.create({
            model: env.OPENAI_MODEL,
            instructions: systemPrompt,
            input: parsed.data.message,
            store: true,
            previous_response_id: parsed.data.previousResponseId
        });

        let reply = "";
        for (const item of response.output) {
            if (item.type === "message") {
                for (const content of item.content) {
                    if (content.type === "output_text") {
                        reply += content.text;
                    }
                }
            }
        }

        // Extract video links from the response for auto-open
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const videoLinks: string[] = [];
        let match;
        while ((match = linkRegex.exec(reply)) !== null) {
            if (match[2].includes("/sepuhack/") || match[2].includes("/solventio-world/")) {
                videoLinks.push(match[2]);
            }
        }

        return NextResponse.json({
            ok: true,
            reply,
            responseId: response.id,
            videoLinks: videoLinks.length > 0 ? videoLinks : undefined
        });
    } catch (error) {
        console.error("Error en /api/global-chat", error);
        return NextResponse.json(
            { ok: false, message: "No pude responder. Inténtalo de nuevo." },
            { status: 500 }
        );
    }
}
