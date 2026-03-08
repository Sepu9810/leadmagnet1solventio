import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { Resend } from "resend";

import { getServerEnv, resolveBaseUrl } from "@/lib/env";
import { leadPayloadSchema } from "@/lib/schemas";
import { api } from "@/convex/_generated/api";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_IP_MAX = 8;
const RATE_LIMIT_EMAIL_MAX = 3;

const globalRateLimit = globalThis as typeof globalThis & {
  __leadRateLimitByIp?: Map<string, RateLimitBucket>;
  __leadRateLimitByEmail?: Map<string, RateLimitBucket>;
};

const rateLimitByIp = globalRateLimit.__leadRateLimitByIp ?? new Map<string, RateLimitBucket>();
const rateLimitByEmail = globalRateLimit.__leadRateLimitByEmail ?? new Map<string, RateLimitBucket>();

if (!globalRateLimit.__leadRateLimitByIp) {
  globalRateLimit.__leadRateLimitByIp = rateLimitByIp;
}

if (!globalRateLimit.__leadRateLimitByEmail) {
  globalRateLimit.__leadRateLimitByEmail = rateLimitByEmail;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [first] = forwardedFor.split(",");
    return first.trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  return "unknown";
}

function enforceRateLimit(
  store: Map<string, RateLimitBucket>,
  key: string,
  limit: number,
  windowMs: number
) {
  const now = Date.now();

  // Opportunistic cleanup to avoid unbounded memory growth.
  for (const [entryKey, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(entryKey);
    }
  }

  const bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function renderLeadEmail(nombre: string, watchUrl: string, bookingUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">Hola ${nombre}, tu video ya está listo</h2>
      <p style="margin: 0 0 12px;">Gracias por registrarte al contenido de Solventio.</p>
      <p style="margin: 0 0 16px;">Haz clic aquí para ver el video completo:</p>
      <p style="margin: 0 0 22px;">
        <a href="${watchUrl}" style="background:#1f8a70;color:#ffffff;padding:10px 16px;border-radius:999px;text-decoration:none;display:inline-block;">
          Ver video completo
        </a>
      </p>
      <p style="margin: 0 0 10px;">Si quieres aterrizar estas ideas a tu negocio, agenda una cita:</p>
      <p style="margin: 0 0 18px;">
        <a href="${bookingUrl}" style="background:#0f172a;color:#ffffff;padding:10px 16px;border-radius:999px;text-decoration:none;display:inline-block;">
          Agenda una cita con Solventio
        </a>
      </p>
      <p style="margin: 0; color: #475569;">Equipo Solventio</p>
    </div>
  `;
}

function renderInternalEmail(lead: {
  nombre: string;
  email: string;
  celular: string;
  rolTrabajo: string;
  usoTecnologia: string;
  bookingUrl: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">Nuevo lead - Video IA Solventio</h2>
      <p style="margin: 0 0 14px;">Se registró un lead y recibió acceso al video.</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 620px;">
        <tr><td style="padding: 6px 0; font-weight: 700;">Nombre:</td><td>${lead.nombre}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Correo:</td><td>${lead.email}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Celular:</td><td>${lead.celular}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Trabajo/Rol:</td><td>${lead.rolTrabajo}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Uso de tecnología:</td><td>${lead.usoTecnologia}</td></tr>
      </table>
      <p style="margin: 14px 0 0;">CTA sugerido para seguimiento:</p>
      <p style="margin: 8px 0 0;">
        <a href="${lead.bookingUrl}" style="background:#0f172a;color:#ffffff;padding:10px 16px;border-radius:999px;text-decoration:none;display:inline-block;">
          Agenda una cita con Solventio
        </a>
      </p>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const ipLimit = enforceRateLimit(rateLimitByIp, ip, RATE_LIMIT_IP_MAX, RATE_LIMIT_WINDOW_MS);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          message: "Demasiadas solicitudes. Intenta de nuevo en unos minutos."
        },
        {
          status: 429,
          headers: { "Retry-After": String(ipLimit.retryAfterSeconds) }
        }
      );
    }

    const body = await request.json();
    const parsed = leadPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Datos inválidos",
          issues: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const env = getServerEnv();
    const payload = parsed.data;
    const emailKey = payload.email.trim().toLowerCase();
    const emailLimit = enforceRateLimit(rateLimitByEmail, emailKey, RATE_LIMIT_EMAIL_MAX, RATE_LIMIT_WINDOW_MS);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya recibimos varios intentos con este correo. Intenta más tarde."
        },
        {
          status: 429,
          headers: { "Retry-After": String(emailLimit.retryAfterSeconds) }
        }
      );
    }

    const bookingUrl = env.NEXT_PUBLIC_BOOKING_URL;
    const origin = new URL(request.url).origin;
    const baseUrl = resolveBaseUrl(origin);
    const watchUrl = `${baseUrl}/video`;

    // Insert lead into Convex
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const leadId = await convex.mutation(api.leads.create, {
      name: payload.nombre,
      email: payload.email,
      phone: payload.celular,
      job_role: payload.rolTrabajo,
      tech_usage: payload.usoTecnologia,
      consent: payload.consentimiento,
      origin: "leadmagnet-video-solventio",
      status: "new"
    });

    const resend = new Resend(env.RESEND_API_KEY);

    const [leadEmailResult, internalEmailResult] = await Promise.all([
      resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: payload.email,
        subject: "Tu acceso al video de IA de Solventio",
        html: renderLeadEmail(payload.nombre, watchUrl, bookingUrl)
      }),
      resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: env.INTERNAL_LEAD_EMAIL,
        subject: `Nuevo lead: ${payload.nombre}`,
        html: renderInternalEmail({ ...payload, bookingUrl })
      })
    ]);

    if (leadEmailResult.error || internalEmailResult.error) {
      console.error("Error sending emails via Resend:", {
        leadEmailError: leadEmailResult.error,
        internalEmailError: internalEmailResult.error
      });

      return NextResponse.json(
        {
          ok: false,
          message: "Guardamos tus datos, pero hubo un problema enviando el correo."
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      leadId,
      message: "Registro exitoso"
    });
  } catch (error) {
    console.error("Error inesperado en /api/leads:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Ocurrió un error procesando tu solicitud."
      },
      { status: 500 }
    );
  }
}
