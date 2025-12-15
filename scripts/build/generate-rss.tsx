import { Feed } from "feed";
import matter from "gray-matter";
import type { ReactNode } from "react";
import type { HydratedFrontmatter } from "#/types";
import { useMDXComponents as defaultUseMDXComponents } from "#/utils/mdx-components";
import { transformMdx } from "./transform-mdx";

export async function generateRSS(metadata: Array<HydratedFrontmatter>) {
  let feed = new Feed({
    title: "Matt Hamlin's Blog",
    description: "Matt Hamlin's Blog",
    id: "https://matthamlin.me",
    link: "https://matthamlin.me",
    language: "en",
    image: "https://matthamlin.me/me.png",
    favicon: "https://matthamlin.me/favicon.ico",
    copyright: "© 2025 Matt Hamlin",
    updated: new Date(),
    generator: "Matt by Hand",
    feedLinks: {
      rss2: "https://matthamlin.me/rss.xml",
    },
    author: {
      name: "Matt Hamlin",
      email: "matthewjameshamlin@gmail.com",
    },
  });

  let enhancedMetadata = await Promise.all(
    metadata.map(async (meta) => {
      let rawContent = await Bun.file(`./src/mdx/${meta.path}.mdx`).text();
      let { content } = matter(rawContent);
      try {
        let transformedContent = await transformMdx(
          content,
          {
            useMDXComponents() {
              return {
                ...defaultUseMDXComponents(),
                BlueskyPost(props: {
                  src: string;
                  children: ReactNode;
                }): ReactNode {
                  return <a href={props.src}>{props.src}</a>;
                },
                ThemeImage(props: {
                  lightSrc: string;
                  darkSrc: string;
                  alt: string;
                }): ReactNode {
                  return <img src={props.lightSrc} alt={props.alt} />;
                },
                Link(props: {
                  to: string;
                  children: ReactNode;
                }): ReactNode {
                  return <a href={props.to}>{props.children}</a>;
                },
                a(props: {
                  href: string;
                  children: ReactNode;
                }): ReactNode {
                  return <a href={props.href}>{props.children}</a>;
                },
              };
            },
          } as Parameters<typeof transformMdx>[1],
        );
        return { ...meta, content: transformedContent };
      } catch (error) {
        console.error(`Error transforming content for ${meta.path}:`, error);
        throw error;
      }
    }),
  );

  for (let meta of enhancedMetadata) {
    let url = `https://matthamlin.me/${meta.path}`;
    feed.addItem({
      title: meta.title,
      link: url,
      id: url,
      description: meta.type === "micropost"
        ? `Status Update: ${
          new Date(meta.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        }`
        : meta.description || "",
      date: new Date(meta.date),
      author: [
        {
          name: "Matt Hamlin",
          email: "matthewjameshamlin@gmail.com",
        },
      ],
      content: meta.content,
      image: `https://matthamlin.me${meta.ogImage}`,
    });
  }
  await Bun.write("./public/rss.xml", feed.rss2());
}
