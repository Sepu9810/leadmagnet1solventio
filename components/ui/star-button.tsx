"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type StarButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "md" | "lg" | "xl";
  fullWidth?: boolean;
};

export const StarButton = React.forwardRef<HTMLButtonElement, StarButtonProps>(
  function StarButton(
    {
      children,
      className,
      size = "md",
      fullWidth = false,
      type = "button",
      ...props
    },
    ref
  ) {
    const innerRef = React.useRef<HTMLButtonElement | null>(null);

    React.useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement, []);

    React.useEffect(() => {
      const element = innerRef.current;
      if (!element) return;

      const syncPath = () => {
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        element.style.setProperty(
          "--star-button-path",
          `path('M 0 0 H ${width} V ${height} H 0 V 0')`
        );
      };

      syncPath();

      const observer = new ResizeObserver(syncPath);
      observer.observe(element);

      return () => observer.disconnect();
    }, []);

    return (
      <button
        ref={innerRef}
        type={type}
        className={cn(
          "star-button",
          `star-button--${size}`,
          fullWidth && "star-button--full",
          className
        )}
        {...props}
      >
        <span className="star-button__border" aria-hidden="true">
          <span className="star-button__beam" />
        </span>
        <span className="star-button__surface" aria-hidden="true" />
        <span className="star-button__label">{children}</span>
      </button>
    );
  }
);
