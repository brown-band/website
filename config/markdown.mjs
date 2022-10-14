// @ts-check
import fs from "node:fs";
import path from "node:path";

import { map } from "unist-util-map";
import { unified } from "unified";

import rehypeParse from "rehype-parse";
import remarkParse from "remark-parse";
import remarkHeadingId from "remark-heading-id";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";

// adapted from @fec/eleventy-plugin-remark
// Also used by Markdown.jsx
export const processor = unified()
  // parse the Markdown...
  .use(remarkParse)
  .data("micromarkExtensions", [
    // disable indented code blocks because they’re bad
    { disable: { null: ["codeIndented"] } },
  ])
  .use(remarkGfm)
  // handle {#id} syntax in headers
  .use(remarkHeadingId)
  // handle :sd[] etc syntax (see below)
  .use([remarkDirective, directivesPlugin])
  // convert the Markdown syntax to HTML, allowing “dangerous”
  // raw HTML in the markdown (which is fine since we write all the Markdown ourselves)
  .use(remarkRehype, { allowDangerousHtml: true });

const processorToString = processor
  // convert the HTML nodes to an HTML string
  .use(rehypeStringify, { allowDangerousHtml: true });

/** @param {string} str */
export async function render(str, path) {
  const file = await processorToString.process({ value: str, path });
  return file.value.toString("utf8");
}

const h = (hName, className, attrs = {}) => ({
  hName,
  hProperties: { className, ...attrs },
});

const svgParser = unified().use(rehypeParse, { fragment: true, space: "svg" });

function directivesPlugin() {
  return (nodeTree, file) =>
    map(nodeTree, (/** @type {import("mdast").Content} */ node, _, parent) => {
      if (node.type === "textDirective" && node.name === "script-tab") {
        return { type: "element", data: h("span", "_69-tab") };
      }
      if (node.type === "textDirective" && node.name === "break") {
        return {
          type: "element",
          data: h(
            "span",
            node.attributes.hyphens != null
              ? "_69-break-hyphenate"
              : "_69-break"
          ),
        };
      }
      if (node.type === "textDirective" && node.name === "sd") {
        return { ...node, data: h("span", "_69-direction") };
      }
      if (node.type === "textDirective" && node.name === "red") {
        return {
          ...node,
          data: {
            hName: "span",
            hProperties: {
              class: "text-danger",
              style: "font-weight: 650",
            },
          },
        };
      }
      if (node.type === "leafDirective" && node.name === "script-note") {
        return Object.assign(parent, {
          ...node,
          data: h("blockquote", "_69-note"),
        });
      }
      if (node.type === "leafDirective" && node.name === "page-break") {
        return Object.assign(parent, {
          ...node,
          data: h("blockquote", "_69-page-break"),
        });
      }
      if (node.type === "containerDirective" && node.name === "script-note") {
        return Object.assign(node, { data: h("blockquote", "_69-note") });
      }
      if (node.type === "leafDirective" && node.name === "svg") {
        if (node.children.length !== 1 || node.children[0].type !== "text") {
          throw new Error(
            `Expected a single text child inside svg directive containing alt text for image "${node.attributes.name}"`
          );
        }
        const svg = svgParser.parse(
          fs.readFileSync(
            path.join(
              path.dirname(file.path),
              path.basename(file.path, ".md"),
              node.attributes.name + ".svg"
            ),
            "utf-8"
          )
        ).children[0];

        if (!svg || svg.type !== "element" || svg.tagName !== "svg") {
          throw new Error(`Invalid SVG file "${node.attributes.name}.svg"`);
        }
        svg.properties.role = "img";
        svg.properties.ariaLabel = node.children[0].value;
        return Object.assign(node, {
          data: {
            hName: "figure",
            hProperties: {
              class: "_69-svg",
            },
            hChildren: [svg],
          },
        });
      }
      if (node.type === "containerDirective" && node.name === "script-list") {
        if (node.children.length !== 1) {
          throw new TypeError(
            `Unexpected number of children (${node.children.length}) in :::script-list`
          );
        }

        const list = node.children[0];
        if (list.type !== "list") {
          throw new TypeError(
            `Expected a list inside :::script-list, got ${list.type}`
          );
        }
        if (list.ordered) {
          throw new TypeError(
            `Expected an unordered list inside :::script-list, got an ordered list`
          );
        }
        if (list.spread) {
          throw new TypeError(
            `Expected a compact list inside :::script-list, got a spread list. Remove excess whitespace to fix the issue, or disable this check in markdown.mjs`
          );
        }

        try {
          const parsed = parseScriptList(list, file.path);
          return Object.assign(node, {
            children: parsed.flatMap((item) => [
              {
                type: "element",
                data: h("span", "_69-list-marker"),
                children: [{ type: "text", value: item.prefix }],
              },
              Object.assign(item.content, {
                data: h("span", "_69-list-content", { role: "listitem" }),
              }),
            ]),
            data: h("div", "_69-list", { role: "list" }),
          });
        } catch (error) {
          const ignored = [
            "./pages/scripts/1977-1978/fall/columbia.md",
            "./pages/scripts/1979-1980/fall/uri.md",
            "./pages/scripts/1993-1994/fall/columbia.md",
            "./pages/scripts/1993-1994/fall/yale.md",
            "./pages/scripts/1997-1998/spring/clarkson.md",
            "./pages/scripts/2019-2020/spring/cornell-mens.md",
          ];
          if (!ignored.includes(file.path)) {
            throw Object.assign(
              new Error(
                "Error parsing script list, add this file to the list of ignored files in markdown.mjs if the nonconformity is intentional"
              ),
              { originalError: error }
            );
          }
        }

        // merge in the only child, getting rid of the script-list in the process
        return Object.assign(node, list, {
          data: { hProperties: { className: "_69-legacy-list" } },
        });
      }

      // otherwise, return the node unchanged
      return node;
    });
}

const delimiters = [".", ")"];

function parseScriptList(list, path) {
  const prefixes = new Set();
  const result = [];
  for (const item of list.children) {
    try {
      if (item.children.length !== 1) {
        throw new Error(
          `Unexpected number of children (${item.children.length}) in script list item`
        );
      }
      const paragraph = item.children[0];
      if (paragraph.type !== "paragraph") {
        throw new Error(
          `Expected a paragraph inside script list item, got ${paragraph.type}`
        );
      }

      const prefix = findPrefix(paragraph);
      if (prefix == null) {
        throw new Error(
          `Expected a prefix inside script list item, got ${paragraph.type}`
        );
      }
      if (prefix.type) prefixes.add(prefix.type);
      result.push(prefix);
    } catch (error) {
      throw attachLocationToStack(error, path, item);
    }
  }

  if (prefixes.size !== 1) {
    throw attachLocationToStack(
      new Error(
        `Expected all script list items to have the same prefix, got ${JSON.stringify(
          Array.from(prefixes)
        )}`
      ),
      path,
      list
    );
  }

  return result;
}

function attachLocationToStack(error, file, node) {
  // +11 as an approximate offset for front matter
  const loc = [
    file,
    node.position.start.line + 11,
    node.position.start.column,
  ].join(":");
  error.stack = `${error.stack.split("\n")[0]}\n    at ${loc}\n${error.stack
    .split("\n")
    .slice(1)
    .join("\n")}`;
  return error;
}

// expects to find the prefix in the first text span
function findPrefix(paragraph) {
  const child = paragraph.children[0];
  if (child.type !== "text") {
    // throw new Error(
    //   `Expected list item to start with plain text, got ${child.type}`
    // );
    return {
      type: null,
      prefix: "",
      content: paragraph,
    };
  }

  if (paragraph.children.length === 1) {
    for (const delimiter of delimiters) {
      // when an element is empty
      if (child.value.endsWith(delimiter) && child.value.length < 5) {
        return {
          type: delimiter,
          prefix: child.value,
          content: { type: "paragraph", children: [] },
        };
      }
    }
  }

  const match = delimiters
    .map((d) => child.value.indexOf(d + " "))
    .filter((i) => i !== -1)
    .sort((a, b) => a - b)[0];
  if (match == null || match === 0) {
    throw new Error(
      `Expected list item to start with a delimiter, got “${child.value}”`
    );
    return null;
  }

  return {
    type: child.value[match],
    prefix: child.value.slice(0, match + 1),
    content: /** @type {import('mdast').Paragraph} */ ({
      type: "paragraph",
      children: [
        {
          type: "text",
          value: child.value.slice(match + 2),
        },
        ...paragraph.children.slice(1),
      ],
    }),
  };
}
