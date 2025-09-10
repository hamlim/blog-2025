import { Post } from "#/components/post";
import Content, { frontmatter } from "#/mdx/2025/september/in-review-the-nuphy-air75-v3.mdx";

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
