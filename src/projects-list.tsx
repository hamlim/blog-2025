import { Anchor } from "#/components/anchor";

export let projects: Array<{
  link: string;
  title: React.ReactNode;
  description: React.ReactNode;
  key: number;
}> = [
  {
    link: "https://one-version.vercel.app/",
    title: "one-version",
    description: "A strict dependency conformance tool for monorepos!",
  },
  {
    link: "https://hohoro-docs.mhamlin.workers.dev/",
    title: "hohoro",
    description:
      "An incremental JS/TS/TSX library build tool that helps you build your library with ease!",
  },
  {
    link: "https://github.com/hamlim/template-monorepo",
    title: "Template Monorepo",
    description:
      "A template for creating a monorepo with Bun, Next.js, and Turborepo",
  },
  {
    link: "https://bluesky-embed-rsc.vercel.app/",
    title: (
      <>
        <code>@hamstack/bluesky-embed-rsc</code>
      </>
    ),
    description:
      "A React Server Component for embedding Bluesky posts within your app!",
  },
  {
    link: "https://bluesky-comments-docs.mhamlin.workers.dev/",
    title: (
      <>
        <code>@hamstack/bluesky-comments</code>
      </>
    ),
    description: "Add comments to any URL, powered by Bluesky!",
  },
  {
    link: "https://github.com/hamlim/rereplay",
    title: "Rereplay",
    description:
      "A native fetch-caching solution for idempotent network requests!",
  },
  {
    link: "https://pikitia-docs.mhamlin.workers.dev/",
    title: "Pikitia",
    description: "A minimal React based image generator!",
  },
  {
    link: "https://switch-kit.vercel.app/",
    title: "Switch Kit",
    description:
      "A “build-your-own” Feature Flagging/Toggling/Experimentation/etc system!",
  },
  {
    link: "https://github.com/hamlim/better-beacon",
    title: "Better Beacon",
    description: (
      <>
        A better version of <code>navigator.sendBeacon</code>, that doesn't
        break when you try to queue too many events!
      </>
    ),
  },
  {
    link: "https://kanapa-docs.vercel.app/",
    title: "Kanapa",
    description: (
      <>
        A syntax highlighting code block component based on shiki for use with
        React Server Components!
      </>
    ),
  },
  {
    link: "https://github.com/hamlim/milliform",
    title: "Milliform",
    description: "A super basic React.js form library!",
  },
  {
    link: "https://mdxlite-docs.mhamlin.workers.dev/",
    title: "mdxlite",
    description:
      "A minimal MDX runtime for constrained environments, e.g. Cloudflare Workers.",
  },
  {
    link: "https://github.com/hamlim/vndr/tree/main/packages/vndr",
    title: "vndr",
    description:
      "A lightweight CLI tool for downloading packages, repositories, and files from various sources.",
  },
  {
    link: "https://github.com/hamlim/rsc-form",
    title: "RSC Form",
    description:
      "A React Form component for use within React Server Components",
  },
  {
    link: "https://github.com/hamlim/clue",
    title: "Clue Notes",
    description:
      "A quick and dirty web app to keep track of your notes and assumptions while playing the board game Clue!",
  },
  {
    link: "https://tails-theta.vercel.app",
    title: "Tails",
    description: "A simple web app for saving and sharing cocktail recipes!",
  },
  {
    link: "https://github.com/hamlim/simple-cache",
    title: "Simple Cache",
    description:
      "A minimal, React cache implementation for both client and server components!",
  },
  {
    link: "https://github.com/ds-pack/simple-props",
    title: "Simple Props",
    description: "A minimal, CSS variable backed, style-prop library",
  },
  {
    link: "https://github.com/hamlim/inline-mdx.macro",
    title: (
      <>
        <code>inline-mdx.macro</code>
      </>
    ),
    description: (
      <>
        A babel macro for converting inline{" "}
        <Anchor
          href="https://mdxjs.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          MDX
        </Anchor>{" "}
        in JavaScript files.
      </>
    ),
  },
  {
    link: "https://github.com/hamlim/projects-old/tree/master/packages/reroute-core",
    title: "Reroute",
    description: "A React router package built for Suspense using hooks",
  },
  {
    link: "https://github.com/ds-pack/components",
    title: (
      <>
        <code>@ds-pack/components</code>
      </>
    ),
    description:
      "A component library built on Vanilla Extract, React, and TypeScript",
  },
  {
    link: "https://github.com/ds-pack/use-media",
    title: (
      <>
        <code>@ds-pack/use-media</code>
      </>
    ),
    description: (
      <>
        A React hook for <code>window.matchMedia</code> that is SSR safe.
      </>
    ),
  },
  {
    link: "https://github.com/ds-pack/use-refs",
    title: (
      <>
        <code>@ds-pack/use-refs</code>
      </>
    ),
    description: "Helpers and utilities for working with refs in React",
  },
  {
    link: "https://github.com/ds-pack/tapable",
    title: (
      <>
        <code>@ds-pack/tapable</code>
      </>
    ),
    description: "A React hook for creating accessible clickable primitives",
  },
  {
    link: "https://github.com/ds-pack/babel-plugin-docs",
    title: (
      <>
        <code>@ds-pack/babel-plugin-docs</code>
      </>
    ),
    description:
      "A collection of babel utilities (plugins, visitors) for transforming code related to design systems.",
  },
  {
    link: "https://github.com/hamlim/notedo",
    title: "Notedo",
    description: "A note and todo list web application using plain text.",
  },
].map((project, idx) => ({ ...project, key: idx }));
