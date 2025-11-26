import { collectMetadata, getMDXFiles } from "./collect-metadata";
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
