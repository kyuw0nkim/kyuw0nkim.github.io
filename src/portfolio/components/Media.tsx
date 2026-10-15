import type { Media as MediaData } from "../data/types";

/** A labelled empty frame. Makes missing assets obvious instead of faking them. */
export function PlaceholderFrame({ label, aspect = "16 / 10", compact = false }: { label?: string; aspect?: string; compact?: boolean }) {
  return (
    <div className={`placeholder-frame${compact ? " is-compact" : ""}`} style={{ aspectRatio: aspect }}>
      <span className="tag">Placeholder</span>
      {label && <span className="placeholder-frame__label">{label}</span>}
    </div>
  );
}

/** Inline note for text that has not been written/verified yet. */
export function PlaceholderNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="placeholder-note">
      <span className="tag">To be added</span>
      <span>{children}</span>
    </p>
  );
}

interface Props {
  media: MediaData;
  /** Load eagerly (hero images). */
  priority?: boolean;
  /** Hide the caption (e.g. in small previews). */
  bare?: boolean;
  className?: string;
}

export function Media({ media, priority = false, bare = false, className = "" }: Props) {
  const aspect = media.aspect ?? "3 / 2";
  const frame = media.frame ?? "bleed";
  let content: React.ReactNode;

  switch (media.kind) {
    case "image":
      content = (
        <img
          src={media.src}
          alt={media.alt ?? ""}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{ aspectRatio: aspect }}
        />
      );
      break;
    case "video":
      content = (
        <video
          src={media.src}
          poster={media.poster}
          controls
          playsInline
          preload="metadata"
          style={{ aspectRatio: aspect }}
          aria-label={media.alt}
        />
      );
      break;
    case "embed":
      content = (
        <iframe
          src={media.src}
          title={media.alt ?? media.caption ?? "Embedded demo"}
          loading="lazy"
          allow="fullscreen; autoplay; clipboard-write"
          style={{ aspectRatio: aspect }}
        />
      );
      break;
    default:
      content = <PlaceholderFrame label={media.label} aspect={aspect} compact={bare} />;
  }

  return (
    <figure className={`media media--${media.kind} media--${frame} ${className}`.trim()}>
      <div className="media__frame">{content}</div>
      {!bare && media.caption && <figcaption className="media__caption">{media.caption}</figcaption>}
    </figure>
  );
}
