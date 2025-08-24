"use client";

import { FolderGit2, Home, Library, Newspaper, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useRouter } from "waku";
import type { RouteConfig } from "waku/router";
import { cn } from "#/utils/cn";

interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
}

let navItems: Array<NavItem> = [
  {
    path: "/",
    label: "Home",
    icon: <Home className="h-5 w-5" />,
  },
  {
    path: "/blog",
    label: "Blog",
    icon: <Newspaper className="h-5 w-5" />,
  },
  {
    path: "/projects",
    label: "Projects",
    icon: <FolderGit2 className="h-5 w-5" />,
  },
  {
    path: "/bookshelf",
    label: "Bookshelf",
    icon: <Library className="h-5 w-5" />,
  },
  {
    path: "/about",
    label: "About",
    icon: <UserRound className="h-5 w-5" />,
  },
];

export function Nav(): ReactNode {
  let { path } = useRouter();

  return (
    <div
      // Ensure this element doesn't throw off the layout
      // if it renders before the CSS file loads
      style={{ position: "fixed" }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <nav className="flex h-14 items-center rounded-full border bg-background/80 px-2 shadow-lg backdrop-blur-md">
        <ul className="flex items-center">
          {navItems.map((item) => {
            let isActive = false;
            if (item.path === "/") {
              isActive = path === item.path;
            } else {
              isActive = path === item.path || path.startsWith(item.path);
            }

            return (
              <li key={item.path}>
                <Link
                  to={item.path as RouteConfig["paths"]}
                  className={cn(
                    "flex h-10 items-center gap-2 px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                    "mx-0.5 rounded-full",
                  )}
                >
                  <span className="flex items-center justify-center">
                    {item.icon}
                  </span>
                  <span className="sr-only md:not-sr-only">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
