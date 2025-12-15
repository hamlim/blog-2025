import { ProseContainer } from "#/components/container";
import { Heading } from "#/components/heading";

export default function NotFound() {
  return (
    <main className="pt-10">
      <title>404</title>
      <meta rel="description" content="Page not found" />
      <ProseContainer>
        <Heading level={1}>404</Heading>
        <p>Page not found</p>
        <p>@TODO: Add a better 404 page 😅</p>
      </ProseContainer>
    </main>
  );
}

export function getConfig() {
  return {
    render: "dynamic",
  };
}

