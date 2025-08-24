import { type ReactNode, Suspense } from "react";
import { ErrorBoundary } from "#/components/error-boundary";
import { Nav } from "#/components/nav";
import { QuickFindLoader } from "#/components/quick-find.loader";
import { TooltipProvider } from "#/components/ui/tooltip";
import "../styles.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative mb-26 min-h-screen">
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="var(--color-background)"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="var(--color-background)"
      />
      <meta name="color-scheme" content="light dark" />
      <link rel="shortcut icon" href="/favicon.ico" />

      <TooltipProvider>
        <Nav />
        <Suspense fallback={null}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Suspense>
        <Suspense fallback={null}>
          <QuickFindLoader />
        </Suspense>
      </TooltipProvider>
    </div>
  );
}

export function getConfig() {
  return {
    render: "static",
  };
}
