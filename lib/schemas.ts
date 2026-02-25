import { z } from "zod";

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
  })
});

export const chatPayloadSchema = z.object({
  message: z.string().trim().min(2, "Escribe un mensaje"),
  previousResponseId: z.string().trim().optional()
});

export type LeadPayload = z.infer<typeof leadPayloadSchema>;
export type ChatPayload = z.infer<typeof chatPayloadSchema>;
