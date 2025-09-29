"use client";
import { type ComponentProps, type ReactNode, Suspense } from "react";
import { Link } from "waku";
import type { RouteConfig } from "waku/router";
import {
  Tooltip,
  TooltipTrigger,
  UnstyledTooltipContent,
} from "#/components/ui/tooltip";
import { cn } from "#/utils/cn";
import { useMedia } from "#/utils/use-media";
import { ErrorBoundary } from "./error-boundary";
import { PostHoverPreviewCard } from "./post-hover-preview-card";

export let anchorClassName =
  "inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-primary underline-offset-4 hover:underline focus:underline";

type AnchorProps = ComponentProps<"a"> & {
  children: ReactNode;
};

export function Anchor(props: AnchorProps): ReactNode {
  return <a {...props} className={cn(anchorClassName, props.className)} />;
}

export function LinkAnchor({ href, ...props }: AnchorProps): ReactNode {
  let isPostLink = false;

  let isTouchLikeDevice = useMedia("(pointer: coarse)", {
    defaultMatches: true,
  });

  if (href?.startsWith("#")) {
    return (
      <a
        href={href}
        {...props}
        className={cn(anchorClassName, props.className)}
      />
    );
  }

  let parts = href?.split("/") ?? [];
  if (parts.length >= 2 && Number.isInteger(Number(parts[1]))) {
    isPostLink = true;
  }

  // external links should not have tooltips
  if (href?.startsWith("http")) {
    isPostLink = false;
  }

  // Don't worry about tooltips on touch devices
  if (isTouchLikeDevice) {
    isPostLink = false;
  }

  if (isPostLink) {
    return (
      <ErrorBoundary
        fallback={
          <Link
            {...props}
            to={href as RouteConfig["paths"]}
            className={cn(anchorClassName, props.className)}
          />
        }
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              {...props}
              to={href as RouteConfig["paths"]}
              className={cn(anchorClassName, props.className)}
            />
          </TooltipTrigger>
          <UnstyledTooltipContent
            className="w-[300px] min-w-10 bg-transparent rounded-md p-2"
            arrowClassName="bg-transparent fill-transparent"
          >
            <Suspense fallback={null}>
              <PostHoverPreviewCard path={href as string} />
            </Suspense>
          </UnstyledTooltipContent>
        </Tooltip>
      </ErrorBoundary>
    );
  }
  return (
    <Link
      {...props}
      to={href as RouteConfig["paths"]}
      className={cn(anchorClassName, props.className)}
    />
  );
}
