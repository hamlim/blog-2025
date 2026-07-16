import { Post } from "#/components/post";
import Content, {
  frontmatter,
} from "#/mdx/2026/july/quick-tip-codex-chief-of-staff-thread.mdx";

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
