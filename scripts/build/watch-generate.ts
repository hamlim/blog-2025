import watcher from "@parcel/watcher";
import { collectMetadata, getMDXFiles, mdxRootDir } from "./collect-metadata";
import { generateMetadata } from "./generate-metadata";
import { generateOGImages } from "./generate-og-images";
import { generateRSS } from "./generate-rss";

let mdxFiles = await getMDXFiles();
let metadata = await collectMetadata(mdxFiles);

await Promise.all([
  generateMetadata(metadata),
  generateRSS(metadata),
  generateOGImages(metadata),
]);

let subscription = await watcher.subscribe(mdxRootDir, async () => {
  mdxFiles = await getMDXFiles();
  metadata = await collectMetadata(mdxFiles);
  await Promise.all([
    generateMetadata(metadata),
    generateRSS(metadata),
    generateOGImages(metadata),
  ]);
});

process.on("SIGINT", async () => {
  await subscription.unsubscribe();
  console.log("Unsubscribed from watcher");
});
