import { Fragment } from "react";
import { HoverTooltip } from "@/components/ui/HoverTooltip";
import type { NewsBlock, NewsItem, TextPart } from "@/data/types";

export const TextParts = ({ parts }: { parts: TextPart[] }) => (
  <>
    {parts.map((part, index) =>
      typeof part === "string" ? (
        <Fragment key={index}>{part}</Fragment>
      ) : (
        <HoverTooltip key={index} content={part.tooltip}>
          <a
            href={part.href}
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {part.text}
          </a>
        </HoverTooltip>
      )
    )}
  </>
);

const sortBlocks = (blocks: NewsBlock[]) =>
  [...blocks].sort((a, b) => a.order - b.order);

export const NewsPreview = ({ item }: { item: NewsItem }) => {
  const firstBlock = sortBlocks(item.blocks)[0];

  if (!firstBlock) return null;

  if (firstBlock.type === "paragraph") {
    return <TextParts parts={firstBlock.content} />;
  }

  const paperTitle = firstBlock.href ? (
    <a href={firstBlock.href} className="text-link" target="_blank" rel="noopener noreferrer">
      {firstBlock.title}
    </a>
  ) : (
    firstBlock.title
  );

  return (
    <>
      <span className="font-medium">{paperTitle}</span>
      {firstBlock.label ? ` (${firstBlock.label})` : ""}
    </>
  );
};

const PaperBlock = ({ block }: { block: Extract<NewsBlock, { type: "paper" }> }) => (
  <div className="relative pl-7 sm:pl-8">
    <span
      aria-hidden="true"
      className="absolute left-1 top-0 text-xl leading-7 text-primary"
    >
      •
    </span>
    <div>
      <h3 className="text-base sm:text-lg font-bold leading-7 text-foreground">
        {block.href ? (
          <a
            href={block.href}
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {block.title}
          </a>
        ) : (
          block.title
        )}
      </h3>
      {block.label && (
        <p className="mt-0.5 text-sm text-muted-foreground">{block.label}</p>
      )}
      {block.authors && (
        <p className="mt-0.5 text-sm sm:text-base text-foreground/80">{block.authors}</p>
      )}
    </div>
  </div>
);

export const NewsContent = ({ item }: { item: NewsItem }) => {
  const blocks = sortBlocks(item.blocks);

  return (
    <div>
      {item.coverImage && (
        <figure className="mb-6">
          <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
            <img
              src={item.coverImage.src}
              alt={item.coverImage.alt ?? item.coverImage.caption ?? ""}
              className="max-h-[32rem] w-full object-contain"
              loading="lazy"
            />
          </div>
          {item.coverImage.caption && (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {item.coverImage.caption}
            </figcaption>
          )}
        </figure>
      )}

      <div className="space-y-5">
        {blocks.map((block, index) =>
          block.type === "paragraph" ? (
            <p key={`${block.type}-${block.order}-${index}`} className="leading-relaxed text-foreground">
              <TextParts parts={block.content} />
            </p>
          ) : (
            <PaperBlock key={`${block.type}-${block.order}-${index}`} block={block} />
          )
        )}
      </div>
    </div>
  );
};

