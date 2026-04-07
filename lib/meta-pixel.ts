declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

type MetaPixelParams = Record<
  string,
  string | number | boolean | null | undefined
>;

function cleanParams(params?: MetaPixelParams) {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );
}

export function trackMetaStandardEvent(
  eventName: string,
  params?: MetaPixelParams
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }

  const clean = cleanParams(params);
  if (clean) {
    window.fbq("track", eventName, clean);
    return;
  }

  window.fbq("track", eventName);
}

export function trackMetaCustomEvent(
  eventName: string,
  params?: MetaPixelParams
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }

  const clean = cleanParams(params);
  if (clean) {
    window.fbq("trackCustom", eventName, clean);
    return;
  }

  window.fbq("trackCustom", eventName);
}
