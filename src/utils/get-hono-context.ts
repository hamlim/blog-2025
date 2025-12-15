import type { Context } from "hono";
import { getContext } from "hono/context-storage";

export function getHonoContext(): null | Context<{ Bindings: Env }> {
  try {
    return getContext<{ Bindings: Env }>();
  } catch {
    return null;
  }
}
