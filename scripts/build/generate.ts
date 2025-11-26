import { generateMetadata } from "./generate-metadata";
import { generateOGImages } from "./generate-og-images";
import { generateRSS } from "./generate-rss";

console.log("Generating metadata...");
await generateMetadata();
console.log("Generating RSS...");
await generateRSS();
console.log("Generating OG images...");
await generateOGImages();
console.log("Done!");
