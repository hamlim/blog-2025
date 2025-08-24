import { TwitterIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Anchor } from "./anchor";

export function TwitterMention({ children }: { children: string }): ReactNode {
  return (
    <Anchor
      target="_blank"
      rel="noopener noreferrer"
      href={`https://twitter.com/${children}`}
    >
      <TwitterIcon className="w-4 h-4 inline-block mr-1" />@{children}
    </Anchor>
  );
}
