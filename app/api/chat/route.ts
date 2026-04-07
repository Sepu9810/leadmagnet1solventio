import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerEnv } from "@/lib/env";
import {
  BOOKING_URL_DEFAULT,
  SPRINT_EFICIENCIA_URL
} from "@/lib/video-knowledge";
import { z } from "zod";

const chatPayloadSchema = z.object({
  message: z.string().min(1),
  previousResponseId: z.string().optional(),
  videoId: z.string().optional(),
  videoTitle: z.string().optional(),
  transcript: z.string().optional()
});

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

type ChatConfig = {
  aiGeneralPrompt?: string;
  aiVideoChatPrompt?: string;
};

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

    console.warn("Retrying /api/chat without previousResponseId");

    return client.responses.create({
      model,
      instructions,
      input,
      store: true
    });
  }
}

function buildSystemPrompt(config: ChatConfig, videoTitle?: string, transcript?: string) {
  const routingPrompt = `
RUTEO COMERCIAL:
- High ticket: desarrollo de apps, software a medida, agentes, integraciones o proyectos con presupuesto/equipo claro. En esos casos manda a: [Agendar Cita](${BOOKING_URL_DEFAULT})
- Mid ticket: empresas que necesitan consultoría para detectar oportunidades, ordenar procesos, priorizar automatizaciones o definir roadmap. En esos casos manda primero a: [Sprint de Eficiencia](${SPRINT_EFICIENCIA_URL})
- Si la persona todavía está aprendiendo o no está lista para una cita high ticket, prioriza Sprint como siguiente paso comercial y deja el video/contenido como apoyo.

REGLAS:
- Responde siempre en español.
- Sé conciso y útil.
- RESPETA LOS SALTOS DE LÍNEA. No respondas con un gran bloque de texto gigante. Usa párrafos cortos con doble salto de línea y listas con viñetas cuando sea útil.
- No mandes cita directa por defecto. Resérvala para desarrollo a medida o cuando el usuario claramente quiera esa vía.
- Si el usuario pregunta por el siguiente paso después del contenido, recomienda primero Sprint si ves necesidad de consultoría y deja el video como segunda opción.`;

  const base = `${config.aiGeneralPrompt || `
Eres el asistente virtual experto de Solventio, especializado en el contenido de video.

TU IDENTIDAD:
- Eres práctico, directo y enfocado en "hacer" más que en filosofar.
- Tu tono es profesional pero conversacional.
- Tu misión es ayudar al usuario a aplicar lo que vio en el video a su negocio o trabajo.

REGLAS:
- Si el usuario pregunta algo fuera del alcance del video, oriéntalo al mejor siguiente paso comercial según su caso.`}

${routingPrompt}`;

  const videoPrompt = `${config.aiVideoChatPrompt || base}

${routingPrompt}`;

  if (videoTitle && transcript) {
    return `${videoPrompt}

VIDEO ACTUAL: "${videoTitle}"

TRANSCRIPCIÓN/CONTEXTO DEL VIDEO:
${transcript.substring(0, 8000)}`;
  }

  return `${base}

El usuario está viendo un video pero no hay transcripción disponible. Ayúdalo de forma general con temas de IA, automatización y tecnología para negocios.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Mensaje inválido", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const env = getServerEnv();

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const config = await convex.query(api.config.getConfig);

    const systemPrompt = buildSystemPrompt(config, parsed.data.videoTitle, parsed.data.transcript);

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

    return NextResponse.json({ ok: true, reply, responseId: response.id });
  } catch (error) {
    console.error("Error en /api/chat", error);
    return NextResponse.json(
      { ok: false, message: "No pude responder en este momento. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
