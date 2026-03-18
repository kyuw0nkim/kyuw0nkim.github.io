import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
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
      <TooltipPrimitive.Content
        side={side}
        sideOffset={10}
        className={cn(
          "z-50 rounded-xl bg-white px-4 py-2.5 text-sm text-gray-800 shadow-lg border border-gray-200",
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
      >
        {content}
        <TooltipPrimitive.Arrow
          width={14}
          height={7}
          className="fill-white drop-shadow-sm"
        />
      </TooltipPrimitive.Content>
    </Tooltip>
  );
}
