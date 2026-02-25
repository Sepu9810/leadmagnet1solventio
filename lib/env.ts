import { BOOKING_URL_DEFAULT } from "@/lib/video-knowledge";

type ServerEnv = {
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  INTERNAL_LEAD_EMAIL: string;
  NEXT_PUBLIC_BASE_URL?: string;
  NEXT_PUBLIC_BOOKING_URL: string;
};

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta variable de entorno: ${name}`);
  }

  return value;
}

export function getServerEnv(): ServerEnv {
  return {
    OPENAI_API_KEY: required("OPENAI_API_KEY"),
    OPENAI_MODEL: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    SUPABASE_URL: required("SUPABASE_URL"),
    SUPABASE_SERVICE_ROLE_KEY: required("SUPABASE_SERVICE_ROLE_KEY"),
    RESEND_API_KEY: required("RESEND_API_KEY"),
    RESEND_FROM_EMAIL: required("RESEND_FROM_EMAIL"),
    INTERNAL_LEAD_EMAIL: required("INTERNAL_LEAD_EMAIL"),
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_BOOKING_URL: normalizeBookingUrl(process.env.NEXT_PUBLIC_BOOKING_URL)
  };
}

export function getPublicBookingUrl() {
  return normalizeBookingUrl(process.env.NEXT_PUBLIC_BOOKING_URL);
}

export function getPublicYoutubeVideoId() {
  return process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID ?? "tchUh_Py-h4";
}

export function getPublicYoutubeStartSeconds() {
  const raw = process.env.NEXT_PUBLIC_YOUTUBE_START_SECONDS;

  if (!raw) {
    return 0;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.floor(parsed);
}

export function normalizeBookingUrl(input?: string): string {
  const raw = input?.trim() || BOOKING_URL_DEFAULT;
  return raw.replace(/\?$/, "");
}

export function resolveBaseUrl(originFallback: string): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim();

  if (!raw) {
    return originFallback;
  }

  return raw.replace(/\/$/, "");
}
