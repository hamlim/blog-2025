import { GithubIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Anchor } from "./anchor";

export function GitHubMention({ children }: { children: string }): ReactNode {
  return (
    <Anchor
      target="_blank"
      rel="noopener noreferrer"
      href={`https://github.com/${children}`}
    >
      <GithubIcon className="w-4 h-4 inline-block mr-1" />@{children}
    </Anchor>
  );
}
