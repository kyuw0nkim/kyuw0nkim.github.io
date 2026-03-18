import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HoverTooltipProps {
  children: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}

export function HoverTooltip({ children, content, className, side = "top" }: HoverTooltipProps) {
  if (!content) return <>{children}</>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children as React.ReactElement}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        className={cn(
          "text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-md",
          "bg-[hsl(var(--sub-color))] text-[hsl(220_20%_15%)] border-[hsl(var(--sub-color)/0.8)]",
          className
        )}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
