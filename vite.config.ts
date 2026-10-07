import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // Notes are written in MDX; YAML frontmatter is exposed as `frontmatter`.
    mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }),
    reactRouter(),
  ],
});
