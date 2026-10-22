/**
 * Analytics helper — wraps gtag with custom events useful for a
 * researcher/PhD-applicant personal site.
 *
 * Key ideas:
 *  1. Every event carries a parsed referrer domain + classified referrer type
 *     so reports can answer "which institutions / platforms sent visitors".
 *  2. UTM parameters from the landing URL are captured once per session and
 *     re-attached to later events — useful for campaign-style outreach
 *     (e.g. ?utm_campaign=prof_smith_cmu in cold emails).
 *  3. Helpers for common interactions: outbound links, PDF / CV downloads,
 *     mailto clicks, publication views, scroll depth, section engagement.
 *  4. The visitor's network (the organisation that owns their IP, e.g.
 *     "Seoul National University") is looked up once per session and attached
 *     to every later event. GA4 itself no longer exposes this. Only the
 *     organisation name and the registrable domain are sent — never the IP.
 *
 * Custom dimensions to register in GA4 Admin → Custom definitions (event scope):
 *   referrer_domain, referrer_type,
 *   utm_source, utm_medium, utm_campaign,
 *   network_org, network_domain, network_type,
 *   paper_id, link_url, link_label, section_id, depth
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Known academic / scholarly / social host patterns. */
const ACADEMIC_HOST_PATTERNS = [
  /\.edu$/i,
  /\.ac\.[a-z]{2,3}$/i, // .ac.uk, .ac.kr, .ac.jp ...
  /\.edu\.[a-z]{2,3}$/i, // .edu.au, .edu.sg ...
  /(^|\.)ethz\.ch$/i,
  /(^|\.)epfl\.ch$/i,
  /(^|\.)mpg\.de$/i,
  /(^|\.)mpi-[a-z-]+\.(de|mpg\.de)$/i,
  /(^|\.)inria\.fr$/i,
  /(^|\.)cnrs\.fr$/i,
  /(^|\.)riken\.jp$/i,
  /(^|\.)kaist\.ac\.kr$/i,
  /(^|\.)snu\.ac\.kr$/i,
];

const SCHOLARLY_HOST_PATTERNS = [
  /scholar\.google\./i,
  /(^|\.)arxiv\.org$/i,
  /(^|\.)semanticscholar\.org$/i,
  /(^|\.)researchgate\.net$/i,
  /(^|\.)openreview\.net$/i,
  /(^|\.)dblp\.org$/i,
  /(^|\.)acm\.org$/i,
  /(^|\.)ieee\.org$/i,
];

const SOCIAL_HOST_PATTERNS = [
  /(^|\.)t\.co$/i,
  /(^|\.)x\.com$/i,
  /(^|\.)twitter\.com$/i,
  /(^|\.)linkedin\.com$/i,
  /(^|\.)bsky\.app$/i,
  /(^|\.)mastodon\./i,
  /(^|\.)facebook\.com$/i,
  /(^|\.)reddit\.com$/i,
];

const SEARCH_HOST_PATTERNS = [
  /(^|\.)google\.[a-z.]+$/i,
  /(^|\.)bing\.com$/i,
  /(^|\.)duckduckgo\.com$/i,
  /(^|\.)naver\.com$/i,
  /(^|\.)baidu\.com$/i,
  /(^|\.)yahoo\.com$/i,
];

export type ReferrerType =
  | "direct"
  | "academic"
  | "scholarly"
  | "search"
  | "social"
  | "code" // github / gitlab
  | "other";

export interface ParsedReferrer {
  domain: string; // "(direct)" when empty
  type: ReferrerType;
}

export function parseReferrer(rawReferrer: string | null | undefined): ParsedReferrer {
  if (!rawReferrer) return { domain: "(direct)", type: "direct" };
  let host = "";
  try {
    host = new URL(rawReferrer).hostname.replace(/^www\./i, "");
  } catch {
    return { domain: "(direct)", type: "direct" };
  }
  if (!host) return { domain: "(direct)", type: "direct" };

  // Self-referral from the site itself shouldn't be counted as a source.
  if (typeof window !== "undefined" && host === window.location.hostname.replace(/^www\./i, "")) {
    return { domain: "(self)", type: "direct" };
  }

  const matches = (patterns: RegExp[]) => patterns.some((re) => re.test(host));

  if (matches(ACADEMIC_HOST_PATTERNS)) return { domain: host, type: "academic" };
  if (matches(SCHOLARLY_HOST_PATTERNS)) return { domain: host, type: "scholarly" };
  if (matches(SEARCH_HOST_PATTERNS)) return { domain: host, type: "search" };
  if (matches(SOCIAL_HOST_PATTERNS)) return { domain: host, type: "social" };
  if (/(^|\.)(github|gitlab)\.com$/i.test(host)) return { domain: host, type: "code" };
  return { domain: host, type: "other" };
}

/* --------------------------- UTM session capture --------------------------- */

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
type UtmKey = (typeof UTM_KEYS)[number];
type UtmRecord = Partial<Record<UtmKey, string>>;

const UTM_STORAGE_KEY = "__kk_utm_v1";

function readUtmFromUrl(): UtmRecord {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  // HashRouter puts real query string after `#/path?...`
  const hashIndex = window.location.hash.indexOf("?");
  const hashParams =
    hashIndex >= 0 ? new URLSearchParams(window.location.hash.slice(hashIndex + 1)) : null;
  const out: UtmRecord = {};
  for (const key of UTM_KEYS) {
    const v = params.get(key) || hashParams?.get(key);
    if (v) out[key] = v;
  }
  return out;
}

function loadStoredUtm(): UtmRecord {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmRecord) : {};
  } catch {
    return {};
  }
}

function saveUtm(utm: UtmRecord) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  } catch {
    /* ignore */
  }
}

let cachedUtm: UtmRecord | null = null;

export function getSessionUtm(): UtmRecord {
  if (cachedUtm) return cachedUtm;
  const fromUrl = readUtmFromUrl();
  if (Object.keys(fromUrl).length > 0) {
    saveUtm(fromUrl);
    cachedUtm = fromUrl;
  } else {
    cachedUtm = loadStoredUtm();
  }
  return cachedUtm;
}

/* ---------------------------- Visitor network ----------------------------- */

const NETWORK_STORAGE_KEY = "__kk_net_v1";
const NETWORK_LOOKUP_URL = "https://ipinfo.io/json";

export interface NetworkInfo {
  network_org: string; // "Seoul National University", "Korea Telecom", ...
  network_domain: string; // "snu.ac.kr" — from reverse DNS, "(unknown)" if none
  network_type: "academic" | "other";
}

const ACADEMIC_ORG_PATTERN =
  /universit|college|institute of technology|school of|academy of|research (center|centre)|대학|学院|大学/i;

/** Second-level labels that sit under a ccTLD, e.g. ac.kr, co.uk, edu.au. */
const SECOND_LEVEL_LABELS = new Set(["ac", "co", "or", "go", "ne", "re", "edu", "gov", "com", "net", "org", "mil"]);

/** Reduce a reverse-DNS hostname to its registrable domain so no IP fragment leaks. */
function registrableDomain(hostname: string): string {
  const labels = hostname.toLowerCase().replace(/\.$/, "").split(".");
  if (labels.length < 2) return "(unknown)";
  const tld = labels[labels.length - 1];
  const sld = labels[labels.length - 2];
  const take = tld.length === 2 && SECOND_LEVEL_LABELS.has(sld) && labels.length >= 3 ? 3 : 2;
  return labels.slice(-take).join(".");
}

let cachedNetwork: NetworkInfo | null = null;

function loadStoredNetwork(): NetworkInfo | null {
  try {
    const raw = sessionStorage.getItem(NETWORK_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as NetworkInfo) : null;
  } catch {
    return null;
  }
}

/**
 * Look up the visitor's network once per session, then send a
 * `visitor_network` event and attach the result to every later event.
 */
export async function initVisitorNetwork() {
  if (typeof window === "undefined" || cachedNetwork) return;
  const stored = loadStoredNetwork();
  if (stored) {
    cachedNetwork = stored;
    return;
  }
  try {
    const res = await fetch(NETWORK_LOOKUP_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) return;
    const data = (await res.json()) as { org?: string; hostname?: string };
    // ipinfo returns org as "AS9488 Seoul National University".
    const org = (data.org || "").replace(/^AS\d+\s+/, "").trim() || "(unknown)";
    const domain = data.hostname ? registrableDomain(data.hostname) : "(unknown)";
    const academic =
      ACADEMIC_ORG_PATTERN.test(org) || ACADEMIC_HOST_PATTERNS.some((re) => re.test(domain));
    cachedNetwork = { network_org: org, network_domain: domain, network_type: academic ? "academic" : "other" };
    try {
      sessionStorage.setItem(NETWORK_STORAGE_KEY, JSON.stringify(cachedNetwork));
    } catch {
      /* ignore */
    }
    trackEvent("visitor_network", {});
  } catch {
    /* blocked by an ad blocker or offline — skip silently */
  }
}

/* ----------------------------- Core tracking ------------------------------ */

let cachedReferrer: ParsedReferrer | null = null;

function getReferrer(): ParsedReferrer {
  if (cachedReferrer) return cachedReferrer;
  cachedReferrer =
    typeof document !== "undefined"
      ? parseReferrer(document.referrer)
      : { domain: "(direct)", type: "direct" };
  return cachedReferrer;
}

export type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const referrer = getReferrer();
  const utm = getSessionUtm();
  const payload: EventParams = {
    referrer_domain: referrer.domain,
    referrer_type: referrer.type,
    ...utm,
    ...cachedNetwork,
    ...params,
  };
  // Drop undefined values so they don't clutter GA4 reports.
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
  window.gtag("event", name, payload);
}

/**
 * HashRouter keeps the route in the URL fragment, which GA4 drops from its
 * "Page path" dimension — every page would report as "/". Rewrite the route
 * into page_location so each page shows up separately. The original query
 * string is kept so UTM tags on the landing URL still attribute the session.
 */
export function trackPageView(pagePath: string) {
  if (typeof window === "undefined") return;
  const path = pagePath.split("?")[0].split("#")[0] || "/";
  trackEvent("page_view", {
    page_location: window.location.origin + path + window.location.search,
    page_path: path,
    page_title: document.title,
  });
}

/* ------------------------ Convenience helpers ----------------------------- */

export function trackOutbound(url: string, label?: string) {
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    /* ignore */
  }
  trackEvent("external_link_click", {
    link_url: url,
    link_domain: host,
    link_label: label,
  });
}

export function trackPdfDownload(url: string, paperId?: string) {
  trackEvent("pdf_download", { link_url: url, paper_id: paperId });
}

export function trackCvDownload(url: string) {
  trackEvent("cv_download", { link_url: url });
}

export function trackEmailClick(address: string) {
  trackEvent("email_click", { link_url: `mailto:${address}` });
}

export function trackPublicationView(paperId: string, title?: string) {
  trackEvent("publication_view", { paper_id: paperId, link_label: title });
}

export function trackScrollDepth(depth: 25 | 50 | 75 | 100, pagePath: string) {
  trackEvent("scroll_depth", { depth, page_path: pagePath });
}

export function trackSectionView(sectionId: string) {
  trackEvent("section_engagement", { section_id: sectionId });
}
