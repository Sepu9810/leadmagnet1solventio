"use client";

import { useEffect, useState } from "react";

export function LandingIntro() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, 1400);

    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="intro-loader" aria-hidden="true">
      <div className="intro-loader-grid" />
      <div className="intro-loader-content">
        <div className="intro-loader-logo">S</div>
        <p>Solventio · IA aplicada a negocio</p>
      </div>
    </div>
  );
}
