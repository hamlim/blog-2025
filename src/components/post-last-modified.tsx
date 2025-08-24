import type { ReactNode } from "react";
import { metadata } from "#/metadata.gen";
import type { HydratedFrontmatter } from "#/types";
import { FormattedDateTime } from "./formatted-date";

export function PostLastModified({
  frontmatter,
}: {
  frontmatter: HydratedFrontmatter;
}): ReactNode {
  let match = metadata.find((post) => post.path === frontmatter.path);
  if (!match) {
    return null;
  }

  if (!frontmatter.lastModified) {
    return (
      <>
        Last modified 📝: <FormattedDateTime date={match.date} />
      </>
    );
  }

  return (
    <>
      Last modified 📝: <FormattedDateTime date={match.lastModified} />
    </>
  );
}
