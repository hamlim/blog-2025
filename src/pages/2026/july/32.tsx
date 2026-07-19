import { Post } from "#/components/post";
import Content, { frontmatter } from "#/mdx/2026/july/32.mdx";

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
