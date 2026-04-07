"use client";

import * as React from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { SquareArrowOutUpRight } from "lucide-react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];
  initialIndex?: number;
  maxVisible?: number;
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  spreadDeg?: number;
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;
  springStiffness?: number;
  springDamping?: number;
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  activateOnHover?: boolean;
  showDots?: boolean;
  className?: string;
  onChangeIndex?: (index: number, item: T) => void;
  renderCard?: (item: T, state: { active: boolean; hovered: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;

  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 5,
  cardWidth = 540,
  cardHeight = 340,
  overlap = 0.5,
  spreadDeg = 44,
  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,
  activeLiftPx = 20,
  activeScale = 1.03,
  inactiveScale = 0.93,
  springStiffness = 280,
  springDamping = 28,
  loop = true,
  autoAdvance = false,
  intervalMs = 3000,
  pauseOnHover = true,
  activateOnHover = false,
  showDots = true,
  className,
  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start 96%", "center 62%"],
  });

  const [activeStep, setActiveStep] = React.useState(initialIndex);
  const [hovering, setHovering] = React.useState(false);
  const [hoveredSlot, setHoveredSlot] = React.useState<number | null>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [introProgress, setIntroProgress] = React.useState(reduceMotion ? 1 : 0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIntroProgress(reduceMotion ? 1 : latest);
  });

  React.useEffect(() => {
    if (reduceMotion) {
      setIntroProgress(1);
    }
  }, [reduceMotion]);

  React.useEffect(() => {
    setActiveStep((current) => {
      if (loop) return current;
      return Math.max(0, Math.min(current, Math.max(len - 1, 0)));
    });
  }, [len, loop]);

  React.useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const syncWidth = () => {
      setContainerWidth(element.clientWidth);
    };

    syncWidth();

    const observer = new ResizeObserver(() => syncWidth());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!len) return;
    const activeIndex = wrapIndex(activeStep, len);
    onChangeIndex?.(activeIndex, items[activeIndex]!);
  }, [activeStep, items, len, onChangeIndex]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const visibleRadius = maxOffset;
  const slots = React.useMemo(
    () =>
      Array.from({ length: visibleRadius * 2 + 1 }, (_value, position) => position - visibleRadius),
    [visibleRadius]
  );
  const responsiveCardWidth =
    containerWidth > 0 ? Math.min(cardWidth, Math.max(260, containerWidth - 24)) : cardWidth;
  const responsiveCardHeight = Math.round((cardHeight / cardWidth) * responsiveCardWidth);
  const cardSpacing = Math.max(10, Math.round(responsiveCardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;
  const activeIndex = wrapIndex(activeStep, len);
  const canGoPrev = loop || activeIndex > 0;
  const canGoNext = loop || activeIndex < len - 1;

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return;
    setActiveStep((current) => (loop ? current - 1 : Math.max(0, current - 1)));
  }, [canGoPrev, len, loop]);

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return;
    setActiveStep((current) => (loop ? current + 1 : Math.min(len - 1, current + 1)));
  }, [canGoNext, len, loop]);

  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len) return;
    if (pauseOnHover && hovering) return;

    const intervalId = window.setInterval(() => {
      if (loop || activeIndex < len - 1) next();
    }, Math.max(1200, intervalMs));

    return () => window.clearInterval(intervalId);
  }, [activeIndex, autoAdvance, hovering, intervalMs, len, loop, next, pauseOnHover, reduceMotion]);

  if (!len) return null;

  const activeItem = items[activeIndex]!;

  return (
    <div
      ref={rootRef}
      className={cn("card-stack", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className="card-stack__stage"
        style={{ height: Math.max(560, responsiveCardHeight + 210) }}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") prev();
          if (event.key === "ArrowRight") next();
        }}
      >
        <div className="card-stack__glow card-stack__glow--top" aria-hidden="true" />
        <div className="card-stack__glow card-stack__glow--bottom" aria-hidden="true" />

        <div
          className="card-stack__viewport"
          style={{ perspective: `${perspectivePx}px` }}
        >
          <AnimatePresence initial={false}>
            {slots.map((slot) => {
              const abs = Math.abs(slot);
              const virtualIndex = activeStep + slot;
              const itemIndex = wrapIndex(virtualIndex, len);
              const item = items[itemIndex]!;
              const introOffset = 1 - introProgress;
              const rotateZ = slot * stepDeg;
              const x = slot * cardSpacing;
              const y = abs * 4;
              const z = -abs * depthPx;
              const isActive = slot === 0;
              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;
              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - abs;
              const entryX = x + Math.sign(slot) * introOffset * (78 + abs * 28);
              const entryY = y + lift - introOffset * (145 + abs * 48);
              const entryRotateZ = rotateZ + slot * introOffset * 7;
              const entryRotateX = rotateX + introOffset * 8;
              const entryScale = scale - introOffset * 0.08;

              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
                      if (reduceMotion) return;
                      const threshold = Math.min(160, responsiveCardWidth * 0.22);
                      if (info.offset.x > threshold || info.velocity.x > 650) prev();
                      else if (info.offset.x < -threshold || info.velocity.x < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={`${item.id}-${virtualIndex}`}
                  className={cn(
                    "card-stack__card-shell",
                    hoveredSlot === slot && "card-stack__card-shell--hovered",
                    isActive && "card-stack__card-shell--active"
                  )}
                  style={{
                    width: responsiveCardWidth,
                    height: responsiveCardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                    transformOrigin: "center bottom",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: entryY + 28,
                          x: entryX,
                          rotateZ: entryRotateZ,
                          rotateX: entryRotateX,
                          scale: entryScale,
                        }
                  }
                  animate={{
                    opacity: 0.48 + introProgress * 0.52,
                    x: entryX,
                    y: entryY,
                    rotateZ: entryRotateZ,
                    rotateX: entryRotateX,
                    scale: entryScale,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  onClick={() => setActiveStep((current) => current + slot)}
                  onMouseEnter={() => {
                    setHoveredSlot(slot);
                    if (activateOnHover) {
                      setActiveStep((current) => current + slot);
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredSlot((current) => (current === slot ? null : current));
                  }}
                  {...dragProps}
                >
                  <div
                    className="card-stack__card-depth"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, {
                        active: isActive,
                        hovered: hoveredSlot === slot,
                      })
                    ) : (
                      <DefaultFanCard
                        item={item}
                        active={isActive}
                        hovered={hoveredSlot === slot}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {showDots ? (
        <div className="card-stack__footer">
          <div className="card-stack__dots">
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveStep((current) => current + signedOffset(index, activeIndex, len, loop))}
                  className={cn(
                    "card-stack__dot",
                    isActive && "card-stack__dot--active"
                  )}
                  aria-label={`Ir a ${item.title}`}
                />
              );
            })}
          </div>
          {activeItem.href ? (
            <Link
              href={activeItem.href}
              target="_blank"
              rel="noreferrer"
              className="card-stack__link"
              aria-label={`Abrir ${activeItem.title}`}
            >
              <SquareArrowOutUpRight size={16} />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DefaultFanCard({
  item,
  active,
  hovered,
}: {
  item: CardStackItem;
  active: boolean;
  hovered: boolean;
}) {
  return (
    <div
      className={cn(
        "card-stack__default-card",
        active && "card-stack__default-card--active",
        hovered && "card-stack__default-card--hovered"
      )}
    >
      <div className="card-stack__default-media">
        {item.imageSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.imageSrc}
            alt={item.title}
            className="card-stack__default-image"
            draggable={false}
            loading="eager"
          />
        ) : (
          <div className="card-stack__default-empty">No image</div>
        )}
      </div>

      <div className="card-stack__default-gradient" />

      <div className="card-stack__default-content">
        {item.tag ? <span className="card-stack__default-tag">{item.tag}</span> : null}
        <div className="card-stack__default-title">{item.title}</div>
        {item.description ? (
          <div className="card-stack__default-description">{item.description}</div>
        ) : null}
        {item.href ? (
          <Link
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="card-stack__default-cta"
          >
            {item.ctaLabel ?? "Ver más"}
            <SquareArrowOutUpRight size={15} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
