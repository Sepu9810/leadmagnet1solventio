"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { persistAttributionFromLocation } from "@/lib/attribution";

export function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    persistAttributionFromLocation(window.location.href, document.referrer);
  }, [pathname, search]);

  return null;
}
