import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

import { getServerEnv, resolveBaseUrl } from "@/lib/env";
import { leadPayloadSchema } from "@/lib/schemas";

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
    const bookingUrl = env.NEXT_PUBLIC_BOOKING_URL;
    const origin = new URL(request.url).origin;
    // Usa expresamente la variable NEXT_PUBLIC_BASE_URL si existe, de lo contrario cae al origen de la petición.
    const baseUrl = resolveBaseUrl(origin);
    const watchUrl = `${baseUrl}/video`;

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    const { data: leadRecord, error: insertError } = await supabase
      .from("leads")
      .insert({
        name: payload.nombre,
        email: payload.email,
        phone: payload.celular,
        job_role: payload.rolTrabajo,
        tech_usage: payload.usoTecnologia,
        consent: payload.consentimiento,
        origin: "leadmagnet-video-solventio",
        status: "new"
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Error inserting lead into Supabase:", insertError);
      console.error("Payload attempted:", payload);

      return NextResponse.json(
        {
          ok: false,
          message: "No pudimos guardar tu registro en la base de datos.",
          debugError: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        },
        { status: 500 }
      );
    }

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
          message: "Guardamos tus datos, pero hubo un problema enviando el correo.",
          debugError: leadEmailResult.error?.message || internalEmailResult.error?.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      leadId: leadRecord.id,
      message: "Registro exitoso"
    });
  } catch (error) {
    console.error("Error inesperado en /api/leads:", error);

    // Debug helper: returning the exact error message
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        ok: false,
        message: "Ocurrió un error procesando tu solicitud.",
        debugError: errorMessage
      },
      { status: 500 }
    );
  }
}
