import { fsRouter } from "waku";
import adapter from "waku/adapters/cloudflare";
import { contextStorage } from "hono/context-storage";
import type { MiddlewareHandler } from "hono";

// Workaround https://github.com/cloudflare/workers-sdk/issues/6577
function isWranglerDev(headers?: Headers): boolean {
  // This header seems to only be set for production cloudflare workers
  return !headers?.get("cf-visitor");
}

let rscPattern = /\/RSC\//;

let cloudflareMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    await next();
    // no index RSC requests/responses
    if (rscPattern.test(c.req.path)) {
      c.header("X-Robots-Tag", "noindex");
    }
    if (!import.meta.env?.PROD) {
      return;
    }
    if (!isWranglerDev(c.req.raw.headers)) {
      return;
    }
    let contentType = c.res.headers.get("content-type");
    if (
      !contentType ||
      contentType.includes("text/html") ||
      contentType.includes("text/plain")
    ) {
      c.res.headers.set("content-encoding", "Identity");
    }
  };
};

export default adapter(
  fsRouter(import.meta.glob("./**/*.{tsx,ts}", { base: "./pages" })),
  {
    middlewareFns: [
      contextStorage,
      cloudflareMiddleware,
    ],
  },
);

