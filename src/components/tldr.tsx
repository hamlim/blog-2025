import type { ReactNode } from "react";

export function TLDR({ children }: { children: ReactNode }): ReactNode {
  return (
    <details className="border border-green-400 rounded-md p-4 bg-green-50 dark:bg-green-900/20">
      <summary className="font-bold cursor-pointer underline underline-offset-1 decoration-wavy decoration-2 decoration-green-400">
        TL;DR
      </summary>
      <div className="py-4">{children}</div>
    </details>
  );
}
