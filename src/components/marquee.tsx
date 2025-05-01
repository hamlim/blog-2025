import type { ComponentProps } from "react";

export interface MarqueeProps extends ComponentProps<"div"> {
  behavior?: "scroll" | "slide" | "alternate";
  direction?: "left" | "right" | "up" | "down";
  loop?: number | boolean;
  bgcolor?: string;
  height?: string;
  hspace?: number;
  scrollamount?: number;
  scrolldelay?: number;
  truespeed?: boolean;
  width?: string;
  vspace?: number;
}

export function Marquee(props: MarqueeProps) {
  // @ts-ignore
  // biome-ignore lint/a11y/noDistractingElements: <explanation>
  return <marquee {...props} />;
}
