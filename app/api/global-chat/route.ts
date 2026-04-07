import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import OpenAI from "openai";
import { getServerEnv } from "@/lib/env";
import {
    BOOKING_URL_DEFAULT,
    SPRINT_EFICIENCIA_URL
} from "@/lib/video-knowledge";
import { z } from "zod";
import { api } from "@/convex/_generated/api";

const globalChatSchema = z.object({
    message: z.string().min(1),
    previousResponseId: z.string().optional(),
    userContext: z.any().optional()
});

async function createResponseWithFallback({
    client,
    model,
    instructions,
    input,
    previousResponseId
}: {
    client: OpenAI;
    model: string;
    instructions: string;
    input: string;
    previousResponseId?: string;
}) {
    try {
        return await client.responses.create({
            model,
            instructions,
            input,
            store: true,
            previous_response_id: previousResponseId
        });
    } catch (error) {
        if (!previousResponseId) {
            throw error;
        }

        console.warn("Retrying /api/global-chat without previousResponseId");

        return client.responses.create({
            model,
            instructions,
            input,
            store: true
        });
    }
}

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

3. RUTEO COMERCIAL (CRÍTICO):
   - HIGH TICKET: desarrollo de apps, software a medida, agentes, automatizaciones complejas, integraciones, proyectos con equipo o presupuesto claro. Ese camino va a cita directa.
   - MID TICKET: empresas que quieren diagnosticar procesos, detectar oportunidades, ordenar operación, definir roadmap o priorizar IA/automatización sin pedir todavía un desarrollo completo. Ese camino va primero al Sprint de Eficiencia: [Sprint de Eficiencia](${SPRINT_EFICIENCIA_URL})
   - BAJA INTENCIÓN O EXPLORACIÓN: personas que todavía están aprendiendo, no tienen claro el problema o solo quieren entender mejor. Allí recomiendas videos; si ves dolor operativo real, primero sugiere Sprint y luego el video.

4. FLUJO DE AGENDA Y CONSULTORÍA:
   - Si el usuario pide explícitamente agendar una cita, tener una llamada, contratar a Solventio o dice que quiere desarrollar una app/proyecto:
     - VE AL GRANO. Sé breve y amigable.
     - Si no te ha contado nada de su idea aún, haz una sola pregunta corta para entender si es consultoría/Sprint o desarrollo a medida. Ejemplo: "Cuéntame en una línea si buscas optimizar procesos con IA o desarrollar algo a medida."
     - Si ya te contó la idea y encaja en HIGH TICKET, envía directamente: [Agendar Cita](${BOOKING_URL_DEFAULT})
     - Si ya te contó la idea y encaja mejor en MID TICKET, envía primero: [Sprint de Eficiencia](${SPRINT_EFICIENCIA_URL})
     - Si está muy temprano o todavía aprendiendo, recomienda primero Sprint si hay un dolor operativo claro y luego uno o dos videos del catálogo. Solo manda cita directa si insiste en hablar ya con el equipo.
   - No mandes la cita directa por defecto. Resérvala para casos de desarrollo a medida o cuando el usuario claramente quiere esa vía.
   - Nunca pidas datos extras ni hagas listas de preparación para la reunión.

5. Cuando el usuario esté viendo contenido, pida ayuda para "el siguiente paso" o no esté listo para agenda directa:
   - Prioriza el Sprint de Eficiencia como primera recomendación comercial si hay necesidad de consultoría.
   - Usa el video como segunda opción para seguir educándolo.

6. Sé conciso, amable y directo. No uses relleno.
7. Responde siempre en español.

REGLAS DE FORMATO (CRÍTICO):
- Para Sprint de Eficiencia, agenda o cualquier CTA, NO pegues la URL sola en texto plano. Siempre usa markdown así: [Sprint de Eficiencia](${SPRINT_EFICIENCIA_URL}) o [Agendar Cita](${BOOKING_URL_DEFAULT})
- RESPETA LOS SALTOS DE LÍNEA. Divide la información en varias líneas pequeñas en lugar de un gran bloque de texto. Usa doble salto de línea entre párrafos.
- Usa listas con viñetas si vas a sugerir varias cosas, PERO NO le pongas guiones/viñetas a los enlaces de videos.
- IMPORTANTE: Escribe los botones o ENLACE_A_USAR en una línea nueva por sí solos. NO pongas guiones/viñetas (-) ni texto pegado en esa misma línea.
`;

        const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
        const response = await createResponseWithFallback({
            client,
            model: env.OPENAI_MODEL,
            instructions: systemPrompt,
            input: parsed.data.message,
            previousResponseId: parsed.data.previousResponseId
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
