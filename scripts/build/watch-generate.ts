import watcher from "@parcel/watcher";
import { mdxRootDir } from "./collect-metadata";
import { generateMetadata } from "./generate-metadata";
import { generateOGImages } from "./generate-og-images";
import { generateRSS } from "./generate-rss";

await generateMetadata();
await generateRSS();
await generateOGImages();

let subscription = await watcher.subscribe(mdxRootDir, async () => {
  await generateMetadata();
  await generateRSS();
  await generateOGImages();
});

process.on("SIGINT", async () => {
  await subscription.unsubscribe();
  console.log("Unsubscribed from watcher");
});
