import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";

export function FootnoteRef({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <span className="inline-flex md:hidden">
        <Tooltip>
          <TooltipTrigger>
            <span className="bg-neutral-300 px-1 text-sm mx-1 align-baseline items-center justify-center rounded-full">
              fn-{id}
            </span>
          </TooltipTrigger>
          <TooltipContent>{children}</TooltipContent>
        </Tooltip>
      </span>

      <sup
        id={`fn-${id}`}
        className="hidden md:inline [&:target]:border-dashed [&:target]:border-primary border-1\ [&:not(:target)]:border-transparent"
      >
        <a
          href={`#fnref-${id}`}
          className="text-primary hover:underline focus:underline"
        >
          [{id}]<span className="sr-only">Jump to footnote</span>
        </a>
      </sup>
    </>
  );
}

export function Footnote({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <p
      id={`fnref-${id}`}
      className="hidden md:inline-block [&:target]:border-dashed [&:target]:border-primary border-2 border-transparent"
    >
      <a
        href={`#fn-${id}`}
        className="text-primary hover:underline focus:underline"
      >
        👆<span className="sr-only">Back to reference</span>
      </a>{" "}
      {children}
    </p>
  );
}
