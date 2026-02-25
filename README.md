# Lead Magnet Video - Solventio

Funnel de 3 pantallas en Next.js con:

- Landing con preview muted del video + modal de registro.
- Pantalla de confirmación (`/gracias`).
- Pantalla de reproducción + chat IA (`/video`).
- API de leads (`/api/leads`) con Supabase + Resend.
- API de chat (`/api/chat`) con OpenAI Responses.

## 1) Requisitos

- Node.js 20+
- Proyecto Supabase
- Cuenta Resend
- API key de OpenAI

## 2) Configuración

1. Instala dependencias:

```bash
npm install
```

2. Crea `.env.local` desde `.env.example`:

```bash
cp .env.example .env.local
```

3. Completa variables de entorno.

4. Crea la tabla en Supabase con `supabase/schema.sql`.

## 3) Desarrollo

```bash
npm run dev
```

Abre `http://localhost:3000`.

## 4) Variables importantes

- `NEXT_PUBLIC_YOUTUBE_VIDEO_ID`: ID del video no listado de YouTube.
- `NEXT_PUBLIC_YOUTUBE_START_SECONDS`: segundo inicial para abrir el video (ej. `8901`).
- `NEXT_PUBLIC_BOOKING_URL`: `https://cal.com/solventio/conozcamos-tu-idea`
- `INTERNAL_LEAD_EMAIL`: correo interno para notificación de leads.

## 5) Flujo funcional

1. Usuario se registra en modal de la landing.
2. Se guarda en `leads_video_magnet`.
3. Se envía correo al lead con enlace de video + CTA de cita.
4. Se envía notificación interna al equipo.
5. En `/video` puede usar chat IA basado en transcripción y contexto Solventio.

## 6) SEO

- Landing indexable.
- `/gracias` y `/video` con `noindex`.

## 7) Deploy

Deploy recomendado: Vercel.

Asegura cargar todas las variables de entorno antes de publicar.
