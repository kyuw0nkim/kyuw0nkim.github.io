import { useState } from "react";
import { trackEmailClick, trackOutbound } from "@/lib/analytics";
import { site } from "../data/site";

export function ContactPanel() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <div className="contact">
      <p className="eyebrow">
        <span>Contact</span>
        <span className="eyebrow__rule" aria-hidden="true" />
        <span>{site.location}</span>
      </p>

      <h1 className="contact__title">
        Say <span className="kh__together">hello.</span>
      </h1>
      <p className="intro__text">{site.contactLine}</p>

      <div className="contact__email">
        <a href={`mailto:${site.email}`} className="contact__address" onClick={() => trackEmailClick(site.email)}>
          {site.email}
        </a>
        <button type="button" className="pill-button" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
        <span className="sr-only" role="status">
          {copied ? "Email address copied to clipboard" : ""}
        </span>
      </div>

      <ul className="link-list">
        {site.socials.map((s) => {
          const external = s.href.startsWith("http");
          return (
            <li key={s.label}>
              <a
                href={s.href}
                className="link-list__item"
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                onClick={() => external && trackOutbound(s.href, s.label)}
              >
                <span>{s.label}</span>
                <span aria-hidden="true">{external ? "↗" : "→"}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
