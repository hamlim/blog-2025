import { evaluate } from "@mdx-js/mdx";
import { Fragment } from "react";
import * as jsx from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { useMDXComponents as defaultUseMDXComponents } from "#utils/mdx-components.js";
import { mdxConfig } from "../mdx-config";

export async function transformMdx(
  content: string,
  {
    useMDXComponents = defaultUseMDXComponents,
  }: {
    useMDXComponents?: typeof defaultUseMDXComponents;
  } = {
    useMDXComponents: defaultUseMDXComponents,
  },
) {
  let { default: Component } = await evaluate(content, {
    ...mdxConfig,
    ...jsx,
    Fragment,
    useMDXComponents,
  });
  return renderToString(<Component />);
}
