declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export type DataLayerEvent = Record<string, string | number | boolean | null | undefined>;

function cleanEventPayload(payload?: DataLayerEvent) {
  if (!payload) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
}

export function pushDataLayerEvent(event: string, payload?: DataLayerEvent) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event,
    ...cleanEventPayload(payload)
  });
}
