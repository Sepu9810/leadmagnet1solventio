import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import OpenAI from "openai";
import { getServerEnv } from "@/lib/env";
import { z } from "zod";
import { api } from "@/convex/_generated/api";

const globalChatSchema = z.object({
    message: z.string().min(1),
    previousResponseId: z.string().optional()
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
        const videoCatalog = (videos ?? [])
            .map((v) => {
                const cat = v.categories;
                const path = v.mundo === "sepuhack" ? "sepuhack" : "solventio-world";
                return `- "${v.title}" (${v.mundo}, Categoría: ${cat?.name ?? "General"}) → ${baseUrl}/${path}/${v.slug}`;
            })
            .join("\n");

        const systemPrompt = `
Eres el asistente global del Solventio Hub, una plataforma de aprendizaje con dos secciones:
- SepuHacks: Videos para emprendedores (tutoriales DIY, IA práctica, automatización)
- Solventio: Videos corporativos (showroom de soluciones IA, casos de estudio por departamento)

CATÁLOGO DE VIDEOS DISPONIBLES:
${videoCatalog || "No hay videos publicados todavía."}

TU MISIÓN:
1. Ayudar al usuario a encontrar el video ideal según sus necesidades
2. Cuando recomiendas un video, SIEMPRE incluye el link en formato markdown: [título del video](url)
3. Si no hay videos relevantes, sugiere que vuelva pronto o que agende una cita en cal.com/solventio
4. Sé conciso, amable y directo
5. Responde siempre en español

REGLAS IMPORTANTES:
- SIEMPRE usa links en formato markdown [texto](url) para que el usuario pueda hacer click
- Si el usuario dice algo vago como "quiero aprender IA", recomienda 2-3 videos relevantes con sus links
- Si no encuentras nada exacto, sugiere los más cercanos
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
