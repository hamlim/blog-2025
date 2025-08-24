import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "waku/config";
import { mdxConfig } from "./scripts/mdx-config";

export default defineConfig({
  unstable_honoEnhancer: "./waku/waku.hono-enhancer",
  middleware: [
    "waku/middleware/context",
    "waku/middleware/dev-server",
    "./waku/waku.cloudflare-middleware",
    "waku/middleware/handler",
  ],
  vite: {
    resolve: {
      alias: {
        "#/*": "./src/*",
        "#utils/*": "./src/utils/*",
        "#mdx/*": "./src/mdx/*",
      },
    },
    plugins: [
      mdx({
        ...mdxConfig,
        providerImportSource: "#utils/mdx-components",
      }),
      tailwindcss(),
    ],
  },
});
