"use client";

import React, { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useQuery } from "convex/react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";
import { StarButton } from "@/components/ui/star-button";
import { SAMPLE_SOCIAL_PROOF_ENTRIES } from "@/lib/social-proof-samples";

type SocialProofCard = CardStackItem & {
  companyName?: string;
  companyLogoUrl?: string;
  galleryImageUrls?: string[];
  country: string;
};

const SOCIAL_PROOF_FALLBACK: SocialProofCard[] = SAMPLE_SOCIAL_PROOF_ENTRIES.map((entry) => ({
  id: `fallback-${entry.sortOrder}`,
  title: entry.title,
  description: entry.description,
  imageSrc: entry.heroImageUrl,
  companyLogoUrl: entry.companyLogoUrl,
  companyName: entry.companyName,
  galleryImageUrls: entry.galleryImageUrls,
  country: entry.country,
  tag: "Conferencia",
}));

class SocialProofErrorBoundary extends React.Component<
  {
    fallback: React.ReactNode;
    children: React.ReactNode;
  },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Sprint social proof failed, using fallback cards.", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function SocialProofConferenceCard({
  item,
  active,
}: {
  item: SocialProofCard;
  active: boolean;
}) {
  const images = useMemo(() => {
    const candidates = [item.imageSrc, ...(item.galleryImageUrls ?? [])].filter(Boolean) as string[];
    return Array.from(new Set(candidates));
  }, [item.galleryImageUrls, item.imageSrc]);

  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [item.id]);

  const hasGallery = images.length > 1;
  const currentImage = images[imageIndex] ?? item.imageSrc;

  const goPrevImage = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setImageIndex((current) => (current - 1 + images.length) % images.length);
  };

  const goNextImage = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setImageIndex((current) => (current + 1) % images.length);
  };

  return (
    <div className={`sprint-social-card ${active ? "sprint-social-card--active" : ""}`}>
      {/* Remote media is CMS-driven, so a plain img keeps the component flexible. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentImage}
        alt={item.title}
        className="sprint-social-card__image"
        draggable={false}
        loading="eager"
      />
      <div className="sprint-social-card__scrim" />
      <div className="sprint-social-card__focus-layer" />

      <div className="sprint-social-card__top">
        <span className="sprint-social-card__tag">{item.tag ?? "Prueba social"}</span>
        <div className="sprint-social-card__top-meta">
          {hasGallery ? (
            <span className="sprint-social-card__gallery-pill">
              <Images size={14} />
              {images.length} fotos
            </span>
          ) : null}
          <span className="sprint-social-card__country">{item.country}</span>
        </div>
      </div>

      {hasGallery ? (
        <>
          <div className="sprint-social-card__carousel-nav">
            <button
              type="button"
              className="sprint-social-card__carousel-button"
              onClick={goPrevImage}
              aria-label="Ver foto anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="sprint-social-card__carousel-button"
              onClick={goNextImage}
              aria-label="Ver foto siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="sprint-social-card__carousel-dots">
            {images.map((image, index) => (
              <button
                key={`${item.id}-${image}-${index}`}
                type="button"
                className={`sprint-social-card__carousel-dot ${
                  index === imageIndex ? "sprint-social-card__carousel-dot--active" : ""
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  setImageIndex(index);
                }}
                aria-label={`Ver foto ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="sprint-social-card__content">
        <div className="sprint-social-card__brand">
          {item.companyLogoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.companyLogoUrl}
              alt={item.companyName ? `Logo ${item.companyName}` : "Logo empresa"}
              className="sprint-social-card__logo"
              loading="eager"
            />
          ) : (
            <span className="sprint-social-card__logo-fallback">
              {(item.companyName ?? item.title).slice(0, 2).toUpperCase()}
            </span>
          )}
          <div>
            <p className="sprint-social-card__company">
              {item.companyName ?? "Empresa invitada"}
            </p>
            <h3 className="sprint-social-card__title">{item.title}</h3>
          </div>
        </div>
        <p className="sprint-social-card__description">{item.description}</p>
      </div>
    </div>
  );
}

function SprintSocialProofSectionLayout({
  items,
  onCta,
}: {
  items: SocialProofCard[];
  onCta?: () => void;
}) {
  return (
    <section className="sprint-section sprint-section--social-proof">
      <div className="sprint-container">
        <div className="sprint-social-proof-grid">
          <div className="sprint-social-proof-copy sprint-social-proof-copy--top sprint-reveal sprint-reveal--visible">
            <div className="sprint-section-tag">Prueba social</div>
            <h2 className="sprint-h2">
              No solo hablamos de IA.{" "}
              <span className="sprint-hero-accent">La explicamos frente a equipos reales.</span>
            </h2>
            <p className="sprint-body">
              Aquí puedes mostrar conferencias, workshops, sesiones privadas y charlas con
              clientes o aliados. La idea es que la página no solo diga que sabes del tema,
              sino que se vea que ya has estado enfrente de empresas hablando de esto con
              contexto de negocio.
            </p>
            {onCta ? (
              <div className="sprint-section-cta sprint-section-cta--left">
                <StarButton className="sprint-section-cta__button" onClick={onCta}>
                  Agenda una cita
                </StarButton>
              </div>
            ) : null}
          </div>

          <div className="sprint-social-proof-stack sprint-reveal sprint-reveal--visible">
            <CardStack
              items={items}
              initialIndex={0}
              maxVisible={5}
              cardWidth={980}
              cardHeight={470}
              overlap={0.72}
              spreadDeg={32}
              depthPx={118}
              activeLiftPx={18}
              autoAdvance
              intervalMs={3000}
              pauseOnHover
              springStiffness={190}
              springDamping={26}
              showDots
              className="sprint-social-proof-stack__inner"
              renderCard={(item, state) => (
                <SocialProofConferenceCard
                  item={item as SocialProofCard}
                  active={state.active}
                />
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SprintSocialProofSectionContent({ onCta }: { onCta?: () => void }) {
  const socialProof = useQuery(api.socialProof.listPublished, {});

  const items = useMemo<SocialProofCard[]>(() => {
    if (!socialProof || socialProof.length === 0) return SOCIAL_PROOF_FALLBACK;

    return socialProof.map((entry) => ({
      id: entry._id,
      title: entry.title,
      description: entry.description,
      imageSrc: entry.heroImageUrl,
      companyLogoUrl: entry.companyLogoUrl,
      companyName: entry.companyName,
      galleryImageUrls: entry.galleryImageUrls,
      country: entry.country,
      tag: "Conferencia",
    }));
  }, [socialProof]);

  return <SprintSocialProofSectionLayout items={items} onCta={onCta} />;
}

function SprintSocialProofSectionFallback({ onCta }: { onCta?: () => void }) {
  return <SprintSocialProofSectionLayout items={SOCIAL_PROOF_FALLBACK} onCta={onCta} />;
}

export function SprintSocialProofSection({ onCta }: { onCta?: () => void }) {
  return (
    <SocialProofErrorBoundary fallback={<SprintSocialProofSectionFallback onCta={onCta} />}>
      <SprintSocialProofSectionContent onCta={onCta} />
    </SocialProofErrorBoundary>
  );
}
