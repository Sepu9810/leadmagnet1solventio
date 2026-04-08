const ATTRIBUTION_STORAGE_KEY = "solventio_attribution_v1";

const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "fbclid",
  "gclid",
  "campaign_id",
  "adset_id",
  "ad_id"
] as const;

export type AttributionData = Partial<
  Record<(typeof ATTRIBUTION_PARAMS)[number], string>
> & {
  landing_path?: string;
  landing_url?: string;
  referrer?: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function sanitizeValue(value: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 500) : undefined;
}

function normalizeAttribution(data: AttributionData) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => Boolean(value))
  ) as AttributionData;
}

function readStoredAttributionRaw(): AttributionData {
  if (!isBrowser()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    return normalizeAttribution(JSON.parse(raw) as AttributionData);
  } catch {
    return {};
  }
}

export function getStoredAttribution() {
  return readStoredAttributionRaw();
}

export function persistAttributionFromLocation(url: string, referrer?: string) {
  if (!isBrowser()) {
    return {};
  }

  const parsedUrl = new URL(url);
  const nextAttribution: AttributionData = {};

  for (const key of ATTRIBUTION_PARAMS) {
    const value = sanitizeValue(parsedUrl.searchParams.get(key));
    if (value) {
      nextAttribution[key] = value;
    }
  }

  const storedAttribution = readStoredAttributionRaw();
  const hasCampaignSignals = Object.keys(nextAttribution).length > 0;
  const mergedAttribution = normalizeAttribution({
    ...storedAttribution,
    ...nextAttribution,
    landing_path:
      storedAttribution.landing_path ??
      (hasCampaignSignals ? sanitizeValue(parsedUrl.pathname) : undefined),
    landing_url:
      storedAttribution.landing_url ??
      (hasCampaignSignals ? sanitizeValue(parsedUrl.toString()) : undefined),
    referrer:
      storedAttribution.referrer ??
      sanitizeValue(referrer ?? document.referrer)
  });

  window.localStorage.setItem(
    ATTRIBUTION_STORAGE_KEY,
    JSON.stringify(mergedAttribution)
  );

  return mergedAttribution;
}
