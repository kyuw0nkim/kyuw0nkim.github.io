import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { trackOutbound } from "@/lib/analytics";

/**
 * /insights — a private-facing "Reviewer Radar" control panel.
 *
 * It does NOT pull live GA4 data (that would require a service-account
 * backend, which this static site doesn't have). Instead it provides:
 *
 *   1. A UTM campaign link builder — the most important tool for a PhD
 *      applicant. Every cold email / application link you share should
 *      carry a unique tag so you can see "which outreach channel brought
 *      whom" regardless of whether referrer data is available.
 *
 *   2. A copy-pastable "GA4 setup" checklist: which custom dimensions to
 *      register, which Explorations to build, which Looker Studio panels
 *      to pin. These are the pieces that need one-time clicks in the
 *      Google UI — the code side is already done.
 *
 *   3. A list of the custom events the site emits so you know what's
 *      available as a metric in GA4 / Looker Studio.
 */

const SITE_URL = "https://kyuw0nkim.github.io/";

const CUSTOM_DIMENSIONS = [
  { name: "referrer_domain", scope: "Event", description: "Parsed host of document.referrer" },
  {
    name: "referrer_type",
    scope: "Event",
    description: "direct | academic | scholarly | search | social | code | other",
  },
  { name: "utm_source", scope: "Event", description: "Outreach channel (email, portal, tweet...)" },
  {
    name: "utm_medium",
    scope: "Event",
    description: "Delivery medium (outreach, app, social...)",
  },
  {
    name: "utm_campaign",
    scope: "Event",
    description: "Per-target campaign tag (e.g. prof_smith_cmu)",
  },
  { name: "paper_id", scope: "Event", description: "Which publication was viewed / downloaded" },
  { name: "link_url", scope: "Event", description: "Outbound URL that was clicked" },
  { name: "link_label", scope: "Event", description: "Friendly label on the link" },
  { name: "depth", scope: "Event", description: "Scroll depth % (25 / 50 / 75 / 100)" },
];

const CUSTOM_EVENTS = [
  { name: "page_view", description: "Every route change in the SPA" },
  { name: "pdf_download", description: "Publication PDF link clicked" },
  { name: "cv_download", description: "CV page download button clicked" },
  { name: "external_link_click", description: "Any outbound link (arXiv, DOI, social, ...)" },
  { name: "email_click", description: "mailto: link clicked (contact intent signal)" },
  { name: "publication_view", description: "A publication card's link was engaged" },
  { name: "scroll_depth", description: "Reader reached 25/50/75/100 % of the page" },
  { name: "section_engagement", description: "Reserved: a tracked section came into view" },
];

const GA4_CHECKLIST = [
  "Admin → Custom definitions → register each custom dimension listed below (Event scope).",
  "Admin → Data Streams → Enhanced measurement: confirm 'Outbound clicks' and 'File downloads' are ON.",
  "Admin → Data filters: add an 'Internal traffic' filter for your own IP so dev visits don't skew numbers.",
  "Reports → Realtime: verify pdf_download / cv_download events show up after a test click.",
  "Explore → create a free-form exploration: Rows = Country + City + Network, Values = Active users. Save as 'Geo × Institution'.",
  "Explore → create: Rows = utm_campaign, Values = Sessions + cv_download + pdf_download. Save as 'Reviewer Radar'.",
  "Looker Studio → New report → GA4 connector → build a country choropleth + campaign table + academic-referrer filter. Embed via iframe if you want it on this page.",
];

function buildUtmUrl(base: string, fields: Record<string, string>) {
  try {
    const url = new URL(base);
    // HashRouter: append UTM to the root, not after the hash, so they survive
    // into the initial document URL that gtag captures.
    Object.entries(fields).forEach(([k, v]) => {
      const trimmed = v.trim();
      if (trimmed) url.searchParams.set(k, trimmed);
    });
    return url.toString();
  } catch {
    return base;
  }
}

function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast({ title: "Copied", description: text }))
      .catch(() => toast({ title: "Copy failed", description: "Copy manually." }));
  }
}

const PRESETS: Array<{ label: string; source: string; medium: string; campaign: string }> = [
  {
    label: "Cold email to a professor",
    source: "email",
    medium: "outreach",
    campaign: "prof_<lastname>_<school>",
  },
  {
    label: "PhD application portal",
    source: "application",
    medium: "portal",
    campaign: "phd_<school>_<year>",
  },
  {
    label: "X / Twitter post",
    source: "twitter",
    medium: "social",
    campaign: "thread_<topic>",
  },
  {
    label: "Conference rebuttal / talk handout",
    source: "talk",
    medium: "handout",
    campaign: "<venue>_<year>",
  },
];

const LOOKER_STUDIO_URL = "https://lookerstudio.google.com/";
const GA4_ADMIN_URL = "https://analytics.google.com/analytics/web/#/a/admin";

const Insights = () => {
  const [base, setBase] = useState(SITE_URL);
  const [source, setSource] = useState("email");
  const [medium, setMedium] = useState("outreach");
  const [campaign, setCampaign] = useState("prof_smith_cmu");
  const [content, setContent] = useState("");

  const builtUrl = useMemo(
    () =>
      buildUtmUrl(base, {
        utm_source: source,
        utm_medium: medium,
        utm_campaign: campaign,
        utm_content: content,
      }),
    [base, source, medium, campaign, content]
  );

  return (
    <MainLayout>
      <h1 className="text-3xl font-heading font-bold text-center mb-2">Insights</h1>
      <p className="text-center text-muted-foreground mb-10">
        A private control panel for tracking who actually reads this site.
      </p>

      {/* UTM Builder */}
      <section className="bg-card border border-border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-heading font-semibold mb-1">Campaign link builder</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Every outreach link you share should carry a unique UTM tag. GA4 will then group
          visitors by campaign even when the referrer is "(direct)" — which is the case for
          most email clients and application portals.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <LabeledInput label="Base URL" value={base} onChange={setBase} />
          <LabeledInput
            label="utm_source  (where)"
            value={source}
            onChange={setSource}
            placeholder="email, twitter, application..."
          />
          <LabeledInput
            label="utm_medium  (how)"
            value={medium}
            onChange={setMedium}
            placeholder="outreach, social, portal..."
          />
          <LabeledInput
            label="utm_campaign  (who / which)"
            value={campaign}
            onChange={setCampaign}
            placeholder="prof_smith_cmu"
          />
          <LabeledInput
            label="utm_content  (variant, optional)"
            value={content}
            onChange={setContent}
            placeholder="signature, v2, ..."
          />
        </div>

        <div className="mt-5 flex items-start gap-2">
          <code className="flex-1 text-xs bg-muted rounded-md p-3 break-all font-mono">
            {builtUrl}
          </code>
          <button
            type="button"
            onClick={() => copyToClipboard(builtUrl)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-foreground mb-2">Presets</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setSource(p.source);
                  setMedium(p.medium);
                  setCampaign(p.campaign);
                }}
                className="px-3 py-1.5 text-xs rounded-full border border-border hover:bg-accent transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Custom events emitted */}
      <section className="bg-card border border-border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-heading font-semibold mb-1">Events this site emits</h2>
        <p className="text-sm text-muted-foreground mb-5">
          These are available as metrics in GA4 Reports → Engagement → Events, and as
          dimensions in Explorations. Every event also carries <code>referrer_domain</code>,{" "}
          <code>referrer_type</code>, and captured UTM values.
        </p>
        <div className="divide-y divide-border">
          {CUSTOM_EVENTS.map((e) => (
            <div key={e.name} className="py-2.5 flex items-start gap-4">
              <code className="text-sm font-mono text-foreground shrink-0 w-44">{e.name}</code>
              <span className="text-sm text-muted-foreground">{e.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Custom dimensions */}
      <section className="bg-card border border-border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-heading font-semibold mb-1">Custom dimensions to register</h2>
        <p className="text-sm text-muted-foreground mb-5">
          One-time setup in GA4 Admin → Custom definitions. Until these are registered, the
          parameters are captured but won't appear as selectable fields in reports.
        </p>
        <div className="divide-y divide-border">
          {CUSTOM_DIMENSIONS.map((d) => (
            <div key={d.name} className="py-2.5 flex items-start gap-4">
              <code className="text-sm font-mono text-foreground shrink-0 w-44">{d.name}</code>
              <span className="text-xs text-muted-foreground shrink-0 w-16">{d.scope}</span>
              <span className="text-sm text-muted-foreground">{d.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* GA4 checklist */}
      <section className="bg-card border border-border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-heading font-semibold mb-3">One-time GA4 / Looker setup</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-foreground">
          {GA4_CHECKLIST.map((step) => (
            <li key={step} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap gap-3 mt-5">
          <a
            href={GA4_ADMIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutbound(GA4_ADMIN_URL, "ga4_admin")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-sub text-sub-foreground hover:bg-sub/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Open GA4 Admin
          </a>
          <a
            href={LOOKER_STUDIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutbound(LOOKER_STUDIO_URL, "looker_studio")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-sub text-sub-foreground hover:bg-sub/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Open Looker Studio
          </a>
        </div>
      </section>

      {/* Reading guide */}
      <section className="bg-card border border-border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-heading font-semibold mb-3">How to read the data</h2>
        <ul className="space-y-3 text-sm text-foreground leading-relaxed">
          <li>
            <strong>Country + City + Network</strong> in one table is your institution lens:
            campus-wired visitors often surface the university name in the Network column.
            Mobile / home ISPs won't — don't expect 100 %.
          </li>
          <li>
            <strong>referrer_type = academic or scholarly</strong> is a high-signal filter.
            Even a handful of such sessions per month is meaningful.
          </li>
          <li>
            <strong>utm_campaign</strong> is your ground truth: it ignores whatever the
            referrer header says and tells you exactly which outreach a visit came from.
          </li>
          <li>
            <strong>cv_download + pdf_download</strong> are intent signals. Rank campaigns
            and countries by these, not by raw sessions.
          </li>
          <li>
            <strong>scroll_depth = 75 or 100</strong> separates skimmers from real readers —
            useful when cross-tabbed with country to see who actually engages.
          </li>
        </ul>
      </section>
    </MainLayout>
  );
};

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-muted-foreground mb-1">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

export default Insights;
