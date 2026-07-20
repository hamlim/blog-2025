import { Post } from "#/components/post";
import Content, {
  frontmatter,
} from "#/mdx/2025/september/new-github-scams.mdx";

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
