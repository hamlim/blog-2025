import type { ReactNode } from "react";
import { cn } from "#/utils/cn";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container(props: ContainerProps): ReactNode {
  return (
    <article
      {...props}
      className={cn("mx-auto max-w-prose", props.className)}
    />
  );
}

export function ProseContainer(props: ContainerProps): ReactNode {
  return (
    <article
      {...props}
      className={cn(
        "prose prose-slate dark:prose-invert mx-auto max-w-[95vw] sm:max-w-prose",
        props.className,
      )}
    />
  );
}
