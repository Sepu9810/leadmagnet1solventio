import { NextResponse } from "next/server";
import OpenAI from "openai";

import { getServerEnv } from "@/lib/env";
import { extractResponseText } from "@/lib/openai";
import { chatPayloadSchema } from "@/lib/schemas";
import { CHAT_SYSTEM_PROMPT } from "@/lib/video-knowledge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Mensaje inválido",
          issues: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const env = getServerEnv();

    const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: env.OPENAI_MODEL,
      instructions: CHAT_SYSTEM_PROMPT,
      input: parsed.data.message,
      store: true,
      previous_response_id: parsed.data.previousResponseId
    });

    const reply = extractResponseText(response);

    return NextResponse.json({
      ok: true,
      reply,
      responseId: response.id
    });
  } catch (error) {
    console.error("Error en /api/chat", error);
    return NextResponse.json(
      {
        ok: false,
        message: "No pude responder en este momento. Inténtalo de nuevo."
      },
      { status: 500 }
    );
  }
}
