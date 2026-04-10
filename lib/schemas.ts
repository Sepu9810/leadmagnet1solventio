import { z } from "zod";

const optionalTrackingValue = z.string().trim().max(500).optional();
const optionalTrackingNumber = z.number().finite().nonnegative().optional();

export const leadPayloadSchema = z.object({
  nombre: z.string().trim().min(2, "Nombre requerido"),
  email: z.string().trim().email("Correo inválido"),
  celular: z.string().trim().min(7, "Celular inválido").max(25, "Celular inválido"),
  rolTrabajo: z.string().trim().min(2, "Cuéntanos en qué trabajas"),
  usoTecnologia: z
    .string()
    .trim()
    .min(8, "Cuéntanos cómo te gustaría usar tecnología"),
  consentimiento: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar el consentimiento" })
  }),
  utm_source: optionalTrackingValue,
  utm_medium: optionalTrackingValue,
  utm_campaign: optionalTrackingValue,
  utm_content: optionalTrackingValue,
  utm_term: optionalTrackingValue,
  utm_id: optionalTrackingValue,
  fbclid: optionalTrackingValue,
  gclid: optionalTrackingValue,
  campaign_id: optionalTrackingValue,
  adset_id: optionalTrackingValue,
  ad_id: optionalTrackingValue,
  landing_path: optionalTrackingValue,
  landing_url: optionalTrackingValue,
  referrer: optionalTrackingValue,
  video_session_id: optionalTrackingValue,
  video_last_position_seconds: optionalTrackingNumber,
  video_max_position_seconds: optionalTrackingNumber,
  video_completed: z.boolean().optional()
});

export const chatPayloadSchema = z.object({
  message: z.string().trim().min(2, "Escribe un mensaje"),
  previousResponseId: z.string().trim().optional()
});

export type LeadPayload = z.infer<typeof leadPayloadSchema>;
export type ChatPayload = z.infer<typeof chatPayloadSchema>;
