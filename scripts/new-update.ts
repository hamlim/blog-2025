import { mkdir } from "node:fs/promises";
import path from "node:path";

let now = Date.now();

let currentDate = new Date(now);

let formatter = new Intl.DateTimeFormat("en", {
  month: "long",
  weekday: "long",
  year: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

let res = formatter.format(currentDate);

let [_dayOfWeek, monthAndDate, yearAndTime] = res.split(", ") as [
  string,
  string,
  string,
];

let [year] = yearAndTime.split(" at ") as [string];

let [month] = monthAndDate.split(" ") as [string];

month = month.toLowerCase();

let args = process.argv.slice(2);

let help = args.includes("--help");
let debug = args.includes("--debug");
let title = args.find((arg) => arg.startsWith("title="))?.split("=")[1];
let slug = args.find((arg) => arg.startsWith("slug="))?.split("=")[1];

if (help) {
  console.log("");
  console.log("bun new-post ...");
  console.log("");
  console.log(" help                          Prints this dialog!");
  console.log(" debug                         Logs out debugging info");
  console.log(' title="<title>"               sets the title');
  console.log(' slug="<slug>"                 sets the slug');
  console.log("");
  process.exit(1);
}

if (debug) {
  console.log(args);
}

function missingArg(args: Array<string>): void {
  console.log("");
  console.log(
    `Error: Missing ${args.map((name) => `\`${name}\``).join(", ")} argument${args.length > 1 ? "s" : ""}.`,
  );
  console.log("");
  console.log(`Try re-running the command and provide: ${args.join(", ")}`);
  console.log("");
}

if (!title || !slug) {
  missingArg(
    [
      { val: title, name: "title" },
      { val: slug, name: "slug" },
    ]
      .filter(({ val }) => !val)
      .map(({ name }) => name),
  );
  process.exit(1);
}

if (/[^a-zA-Z0-9|-]/.exec(slug as string)) {
  console.log("");
  console.log(
    `Error: \`slug\` argument is malformed. Only use alphanumeric characters and dashes.`,
  );
  console.log("");
  console.log(`You provided:\n\t\t\`slug="${slug}"\``);
  console.log("");
  process.exit(1);
}

let mdxTemplate = `---
title: "${title}"
slug: ${slug}
path: /${year}/${month.toLowerCase()}/${slug}
date: ${now}
status: public
type: micropost
tags:
  - micropost
month: ${month.toLowerCase()}
year: ${year}
ogImage: /og-images/${slug}.png
blueskyPostUri: ""
location: ""
---

`;

await mkdir(path.join(process.cwd(), "src", "mdx", year, month), {
  recursive: true,
});

await Bun.write(
  path.join(process.cwd(), "src", "mdx", year, month, `${slug}.mdx`),
  mdxTemplate,
);

let pageTemplate = `import { Post } from "#/components/post";
import Content, { frontmatter } from "#/mdx/${year}/${month}/${slug}.mdx";

export default function Page() {
  return (
    <Post frontmatter={frontmatter}>
      <Content />
    </Post>
  );
}

export function getConfig() {
  return {
    render: "static",
  };
}
`;

await mkdir(path.join(process.cwd(), "src", "pages", year, month), {
  recursive: true,
});

await Bun.write(
  path.join(process.cwd(), "src", "pages", year, month, `${slug}.tsx`),
  pageTemplate,
);

console.log(`Created new post: ${title}`);
