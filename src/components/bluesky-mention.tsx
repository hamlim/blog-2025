import type { ReactNode } from "react";
import { Anchor } from "./anchor";
import { BlueskyIcon } from "./bluesky-icon";

export function BlueskyMention({ children }: { children: string }): ReactNode {
  return (
    <Anchor
      target="_blank"
      rel="noopener noreferrer"
      href={`https://bsky.app/profile/${children}`}
    >
      <BlueskyIcon className="w-4 h-4 inline-block mr-1" />@{children}
    </Anchor>
  );
}
