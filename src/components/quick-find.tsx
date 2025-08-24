"use client";

import {
  FileUser,
  FolderGit2,
  Home,
  Library,
  Newspaper,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "waku";
import type { RouteConfig } from "waku/router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "#/components/ui/command";
import { metadata } from "#/metadata.gen";
import { projects } from "#/projects-list";
import { formatDate } from "#/utils/date-formatting";

export function QuickFind() {
  let [open, setOpen] = useState(false);

  useEffect(() => {
    let abortController = new AbortController();
    let abortSignal = abortController.signal;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    }

    document.addEventListener("keydown", onKeyDown, { signal: abortSignal });
    return () => {
      abortController.abort();
    };
  }, []);

  let router = useRouter();

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Quick Find"
      description="Search for anything..."
    >
      <CommandInput placeholder="Search for anything..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem
            value="home"
            onSelect={() => {
              setOpen(false);
              router.push("/");
            }}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </CommandItem>
          <CommandItem
            value="blog"
            onSelect={() => {
              setOpen(false);
              router.push("/blog");
            }}
          >
            <Newspaper className="h-5 w-5" />
            <span>Blog</span>
          </CommandItem>
          <CommandItem
            value="projects"
            onSelect={() => {
              setOpen(false);
              router.push("/projects");
            }}
          >
            <FolderGit2 className="h-5 w-5" />
            <span>Projects</span>
          </CommandItem>
          <CommandItem
            value="bookshelf"
            onSelect={() => {
              setOpen(false);
              router.push("/bookshelf");
            }}
          >
            <Library className="h-5 w-5" />
            <span>Bookshelf</span>
          </CommandItem>
          <CommandItem
            value="about"
            onSelect={() => {
              setOpen(false);
              router.push("/about");
            }}
          >
            <UserRound className="h-5 w-5" />
            <span>About</span>
          </CommandItem>
          <CommandItem
            value="resume"
            onSelect={() => {
              setOpen(false);
              router.push("/resume");
            }}
          >
            <FileUser className="h-5 w-5" />
            <span>Resume</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandItem
              key={project.key}
              value={project.link}
              onSelect={() => {
                setOpen(false);
                window.open(project.link, "_blank");
              }}
            >
              <FolderGit2 className="h-5 w-5" />
              <span>{project.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Blog Posts">
          {metadata.map((post) => (
            <CommandItem
              key={post.slug}
              value={`${post.title} ${formatDate(post.date)} ${post.location} ${post.type === "micropost" ? "micropost" : post.description || ""} ${post.slug}`}
              onSelect={() => {
                setOpen(false);
                router.push(post.path as RouteConfig["paths"]);
              }}
            >
              <Newspaper className="h-5 w-5" />
              <p>
                <span>{post.title}</span>
                <br />
                <span className="text-xs text-muted-foreground">
                  {formatDate(post.date)}
                </span>
                <br />
                <span className="text-xs text-muted-foreground">
                  {post.type === "micropost"
                    ? "micropost"
                    : post.description || ""}
                </span>
              </p>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
