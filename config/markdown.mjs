// @ts-check
import { map } from "unist-util-map";
import { unified } from "unified";

import remarkParse from "remark-parse";
import remarkHeadingId from "remark-heading-id";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

// adapted from @fec/eleventy-plugin-remark
const processor = unified()
  // parse the Markdown...
  .use(remarkParse, {
    extensions: [
      // disable indented code blocks because they’re bad
      { disable: { null: ["codeIndented"] } },
    ],
  })
  // handle {#id} syntax in headers
  .use(remarkHeadingId)
  // handle :sd[] etc syntax (see below)
  .use([remarkDirective, directivesPlugin])
  // convert the Markdown syntax to HTML, allowing “dangerous”
  // raw HTML in the markdown (which is fine since we write all the Markdown ourselves)
  .use(remarkRehype, { allowDangerousHtml: true })
  // convert the HTML nodes to an HTML string
  .use(rehypeStringify, { allowDangerousHtml: true });

/** @param {string} str */
export async function render(str) {
  const file = await processor.process(str);
  return file.value.toString("utf8");
}

const h = (hName, className) => ({ hName, hProperties: { className } });
function directivesPlugin() {
  return (nodeTree) =>
    map(nodeTree, (/** @type {import("mdast").Content} */ node) => {
      if (node.type === "textDirective" && node.name === "script-tab") {
        return { type: "element", data: h("span", "_69-tab") };
      }
      if (node.type === "textDirective" && node.name === "sd") {
        return { ...node, data: h("span", "_69-direction") };
      }
      if (node.type === "leafDirective" && node.name === "sd") {
        return { ...node, data: h("p", "_69-direction") };
      }
      if (node.type === "containerDirective" && node.name === "script-list") {
        if (node.children.length !== 1) {
          throw new TypeError(
            `Unexpected number of children (${node.children.length}) in :::script-list`
          );
        }
        // merge in the only child, getting rid of the script-list in the process
        return Object.assign(node, node.children[0], {
          data: { hProperties: { className: "_69-list" } },
        });
      }

      // otherwise, return the node unchanged
      return node;
    });
}
