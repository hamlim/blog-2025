import { $ } from "bun";
import matter from "gray-matter";
import { glob } from "tinyglobby";
import type { HydratedFrontmatter } from "#/types";

export let mdxRootDir = "./src/mdx";

export async function getMDXFiles(): Promise<Array<string>> {
  let filePaths = await glob(`${mdxRootDir}/**/*.mdx`);
  return filePaths.filter((path) => !path.includes("__sandbox"));
}

async function getLastModifiedTimestamp(filePath: string): Promise<number> {
  try {
    let log = await $`git log -1 --format=%cI -- ${filePath}`.quiet().text();
    return new Date(log.trim()).getTime();
  } catch (error) {
    console.error(
      `Error getting last modified timestamp for ${filePath}:`,
      error,
    );
    return Date.now();
  }
}

export async function collectMetadata(
  files: Array<string>,
): Promise<Array<HydratedFrontmatter>> {
  let metadata: Array<HydratedFrontmatter> = [];

  await Promise.all(
    files.map(async (filePath) => {
      let file = Bun.file(filePath);
      let [content, lastModifiedTimestamp] = await Promise.all([
        file.text(),
        getLastModifiedTimestamp(filePath),
      ]);
      let { data } = matter(content);
      metadata.push({
        ...data,
        lastModified: lastModifiedTimestamp,
      } as HydratedFrontmatter);
    }),
  );

  return metadata.sort((a, b) => {
    let aDate = new Date(a.date);
    let bDate = new Date(b.date);
    if (Number.isNaN(aDate.getTime()) || Number.isNaN(bDate.getTime())) {
      return 0;
    }
    if (aDate.getTime() === bDate.getTime()) {
      return a.title.localeCompare(b.title);
    }
    return bDate.getTime() - aDate.getTime();
  });
}
