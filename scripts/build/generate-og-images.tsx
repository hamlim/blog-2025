/// <reference types="bun" />
import { generateImage as generateBaseImage } from "pikitia";
import type { HydratedFrontmatter } from "#/types";
import imageCacheJSON from "../../image-cache.json";

let imageCache = new Map(Object.entries(imageCacheJSON)) as Map<
  string,
  { title: string; description: string }
>;

export async function generateImage({
  title,
  description,
  publishDate,
}: {
  title: string;
  description: string;
  publishDate: string;
}) {
  let pngBuffer = await generateBaseImage(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "50px 150px",
        background: "#f9f5ee",
        fontFamily: "Inter",
      }}
    >
      <h1 style={{ color: "#101828", fontSize: 40 }}>{title}</h1>
      <p style={{ color: "#307b34", fontSize: 30 }}>{description}</p>
      <p
        style={{
          color: "#307b34",
          fontSize: 30,
          position: "absolute",
          top: 25,
          right: 150,
        }}
      >
        {publishDate}
      </p>
      <p style={{ color: "#62748e", fontSize: 30 }}>Matt Hamlin</p>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );

  return pngBuffer;
}

export async function generateOGImages(metadata: Array<HydratedFrontmatter>) {
  for (let meta of metadata) {
    let description =
      meta.type === "micropost"
        ? `Status Update: ${new Date(meta.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}`
        : meta.description || "";
    if (imageCache.has(meta.slug)) {
      let cacheHit = imageCache.get(meta.slug);
      if (
        cacheHit &&
        "title" in cacheHit &&
        "description" in cacheHit &&
        cacheHit.title === meta.title &&
        cacheHit.description === description
      ) {
        continue;
      }
    }
    imageCache.set(meta.slug, {
      title: meta.title,
      description: description,
    });
    let pngBuffer = await generateImage({
      title: meta.title,
      description: description,
      publishDate: new Date(meta.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });

    await Bun.write(`./public/og-images/${meta.slug}.png`, pngBuffer);
  }

  await Bun.write(
    "./image-cache.json",
    JSON.stringify(Object.fromEntries(imageCache)),
  );
}
