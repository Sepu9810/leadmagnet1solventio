import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerEnv } from "@/lib/env";
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

function buildSystemPrompt(config: ChatConfig, videoTitle?: string, transcript?: string) {
  const base = config.aiGeneralPrompt || `
Eres el asistente virtual experto de Solventio, especializado en el contenido de video.

TU IDENTIDAD:
- Eres práctico, directo y enfocado en "hacer" más que en filosofar.
- Tu tono es profesional pero conversacional.
- Tu misión es ayudar al usuario a aplicar lo que vio en el video a su negocio o trabajo.

REGLAS:
- Responde siempre en español.
- Si el usuario pregunta algo fuera del alcance del video, sugiere amablemente agendar una cita en cal.com/solventio.
- Sé conciso y útil.`;

  const videoPrompt = config.aiVideoChatPrompt || base;

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

    return NextResponse.json({ ok: true, reply, responseId: response.id });
  } catch (error) {
    console.error("Error en /api/chat", error);
    return NextResponse.json(
      { ok: false, message: "No pude responder en este momento. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
