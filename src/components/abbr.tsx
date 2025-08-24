import type { ComponentProps } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";

export function Abbr(props: ComponentProps<"abbr">) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <abbr {...props} />
      </TooltipTrigger>
      <TooltipContent>{props.title}</TooltipContent>
    </Tooltip>
  );
}
