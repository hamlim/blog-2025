"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Anchor } from "#/components/anchor";

export function BlueskyMentions({ children }: { children: ReactNode }) {
  let [currentURL, setCurrentURL] = useState<string | null>(null);

  useEffect(() => {
    setCurrentURL(window.location.href);
  }, []);

  return (
    <Anchor
      target="_blank"
      rel="noopener"
      href={`https://bsky.app/search?q=${encodeURIComponent(currentURL ?? "")}`}
    >
      {children}
    </Anchor>
  );
}
