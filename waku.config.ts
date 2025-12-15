import nodeLoaderCloudflare from "@hiogawa/node-loader-cloudflare/vite";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "waku/config";
import { mdxConfig } from "./scripts/mdx-config";

export default defineConfig({
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
      nodeLoaderCloudflare({
        environments: ["rsc"],
        build: true,
        // https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
        getPlatformProxyOptions: {
          persist: {
            path: ".wrangler/state/v3",
          },
          remoteBindings: !process.env.CI,
        },
      }),
    ],
  },
});
