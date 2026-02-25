create extension if not exists "pgcrypto";

create table if not exists public.leads_video_magnet (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  email text not null,
  celular text not null,
  rol_trabajo text not null,
  uso_tecnologia_objetivo text not null,
  consentimiento_datos boolean not null,
  fuente text not null default 'leadmagnet-video-solventio',
  status text not null default 'new'
);

create index if not exists leads_video_magnet_created_at_idx
  on public.leads_video_magnet (created_at desc);

create index if not exists leads_video_magnet_email_idx
  on public.leads_video_magnet (email);
