"use client";

import { useCallback, useEffect, useRef } from "react";
import createGlobe from "cobe";

export interface GlobeMarker {
  id: string;
  location: [number, number];
  label: string;
  color?: [number, number, number];
  size?: number;
}

export interface GlobeArc {
  id: string;
  from: [number, number];
  to: [number, number];
  color?: [number, number, number];
}

interface GlobeProps {
  markers?: GlobeMarker[];
  arcs?: GlobeArc[];
  className?: string;
  markerColor?: [number, number, number];
  baseColor?: [number, number, number];
  arcColor?: [number, number, number];
  glowColor?: [number, number, number];
  dark?: number;
  mapBrightness?: number;
  markerSize?: number;
  markerElevation?: number;
  arcWidth?: number;
  arcHeight?: number;
  speed?: number;
  theta?: number;
  initialPhi?: number;
  diffuse?: number;
  mapSamples?: number;
  interactive?: boolean;
}

export function Globe({
  markers = [],
  arcs = [],
  className = "",
  markerColor = [0.22, 0.83, 0.69],
  baseColor = [0.07, 0.11, 0.22],
  arcColor = [0.22, 0.83, 0.69],
  glowColor = [0.25, 0.35, 0.95],
  dark = 1,
  mapBrightness = 3,
  markerSize = 0.09,
  markerElevation = 0.16,
  arcWidth = 1.2,
  arcHeight = 0.18,
  speed = 0.0038,
  theta = 0.22,
  initialPhi = -0.65,
  diffuse = 1.4,
  mapSamples = 12000,
  interactive = true,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const lastPointer = useRef<{ x: number; y: number; t: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const velocity = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = { x: event.clientX, y: event.clientY };
    if (canvasRef.current) {
      canvasRef.current.style.cursor = interactive ? "grabbing" : "default";
    }
    isPausedRef.current = true;
  }, [interactive]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!pointerInteracting.current) return;

    const deltaX = event.clientX - pointerInteracting.current.x;
    const deltaY = event.clientY - pointerInteracting.current.y;
    dragOffset.current = { phi: deltaX / 260, theta: deltaY / 900 };

    const now = Date.now();
    if (lastPointer.current) {
      const dt = Math.max(now - lastPointer.current.t, 1);
      const maxVelocity = 0.14;
      velocity.current = {
        phi: Math.max(
          -maxVelocity,
          Math.min(maxVelocity, ((event.clientX - lastPointer.current.x) / dt) * 0.28)
        ),
        theta: Math.max(
          -maxVelocity,
          Math.min(maxVelocity, ((event.clientY - lastPointer.current.y) / dt) * 0.07)
        ),
      };
    }

    lastPointer.current = { x: event.clientX, y: event.clientY, t: now };
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
      lastPointer.current = null;
    }

    pointerInteracting.current = null;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = interactive ? "grab" : "default";
    }
    isPausedRef.current = false;
  }, [interactive]);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let animationFrame = 0;
    let currentWidth = 0;
    let phi = initialPhi;

    const createInstance = () => {
      const width = canvas.offsetWidth;
      if (!width || width === currentWidth) return;
      currentWidth = width;

      if (globe) {
        globe.destroy();
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width,
        height: width,
        phi,
        theta,
        dark,
        diffuse,
        mapSamples,
        mapBrightness,
        baseColor,
        markerColor,
        glowColor,
        markerElevation,
        markers: markers.map((marker) => ({
          location: marker.location,
          size: marker.size ?? markerSize,
          color: marker.color,
        })),
        arcs: arcs.map((arc) => ({
          from: arc.from,
          to: arc.to,
          color: arc.color,
        })),
        arcColor,
        arcWidth,
        arcHeight,
        opacity: 0.92,
      });

      canvas.style.opacity = "1";

      const animate = () => {
        if (!globe) return;

        if (!isPausedRef.current) {
          phi += speed;
          if (
            Math.abs(velocity.current.phi) > 0.0001 ||
            Math.abs(velocity.current.theta) > 0.0001
          ) {
            phiOffsetRef.current += velocity.current.phi;
            thetaOffsetRef.current += velocity.current.theta;
            velocity.current.phi *= 0.95;
            velocity.current.theta *= 0.95;
          }
        }

        const thetaMin = -0.38;
        const thetaMax = 0.38;
        thetaOffsetRef.current = Math.max(
          thetaMin,
          Math.min(thetaMax, thetaOffsetRef.current)
        );

        globe.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: theta + thetaOffsetRef.current + dragOffset.current.theta,
          dark,
          mapBrightness,
          markerColor,
          baseColor,
          arcColor,
          markerElevation,
          markers: markers.map((marker) => ({
            location: marker.location,
            size: marker.size ?? markerSize,
            color: marker.color,
          })),
          arcs: arcs.map((arc) => ({
            from: arc.from,
            to: arc.to,
            color: arc.color,
          })),
        });

        animationFrame = requestAnimationFrame(animate);
      };

      animate();
    };

    createInstance();

    resizeObserver = new ResizeObserver(() => {
      createInstance();
    });
    resizeObserver.observe(canvas);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (globe) {
        globe.destroy();
      }
    };
  }, [
    arcColor,
    arcHeight,
    arcWidth,
    arcs,
    baseColor,
    dark,
    diffuse,
    glowColor,
    initialPhi,
    mapBrightness,
    mapSamples,
    markerColor,
    markerElevation,
    markerSize,
    markers,
    speed,
    theta,
  ]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        userSelect: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: interactive ? "grab" : "default",
          opacity: 0,
          transition: "opacity 0.9s ease",
          display: "block",
          touchAction: interactive ? "none" : "auto",
        }}
      />
    </div>
  );
}
