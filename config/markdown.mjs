// @ts-check
import fs from "node:fs";
import path from "node:path";

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

/**
 * @param {string} str
 * @param {string} path
 * @param {import("eleventy-hast-jsx").RenderComponent} renderComponent
 */
export async function render(str, path, renderComponent) {
  const file = await processorToString.process({
    value: str,
    path,
    data: { renderComponent },
  });
  return file.value.toString("utf8");
}

// helper to create hast properties for remark-rehype
const h = (hName, className, attrs = {}) => ({
  hName,
  hProperties: { className, ...attrs },
});

const svgParser = unified().use(rehypeParse, { fragment: true, space: "svg" });

function directivesPlugin() {
  return (nodeTree, file) =>
    // see README.md § Adding Scripts for more info
    map(nodeTree, (/** @type {import("mdast").Content} */ node, _, parent) => {
      // script-tab: insert some indentation/whitespace
      if (node.type === "textDirective" && node.name === "script-tab") {
        return { type: "element", data: h("span", "_69-tab") };
      }

      // break: enable hyphenation or character wrapping
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

      // sd: script/stage directions
      if (node.type === "textDirective" && node.name === "sd") {
        return { ...node, data: h("span", "_69-direction") };
      }

      // red text
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

      // script-note: insert an archivist’s note
      if (node.type === "leafDirective" && node.name === "script-note") {
        return Object.assign(parent, {
          ...node,
          data: h("blockquote", "_69-note"),
        });
      }
      if (node.type === "containerDirective" && node.name === "script-note") {
        return Object.assign(node, { data: h("blockquote", "_69-note") });
      }

      // page-break: insert a page break in the print version
      if (node.type === "leafDirective" && node.name === "page-break") {
        return Object.assign(parent, {
          ...node,
          data: h("blockquote", "_69-page-break"),
        });
      }

      // svg: insert an SVG image from the current directory
      // (used primarily for old scripts where the forms were illustrated rather than described)
      // Add {alt="some text"} to set alt text (required unless the image is unnecessary due to context)
      if (node.type === "leafDirective" && node.name === "svg") {
        if (node.children.length !== 1 || node.children[0].type !== "text") {
          throw new Error(`Expected a file name for the image`);
        }
        const name = node.children[0].value;
        const svg = svgParser.parse(
          fs.readFileSync(
            path.join(
              path.dirname(file.path),
              path.basename(file.path, ".md"),
              name + ".svg"
            ),
            "utf-8"
          )
        ).children[0];

        if (!svg || svg.type !== "element" || svg.tagName !== "svg") {
          throw new TypeError(
            `Invalid SVG file "${name}.svg": expected first child to be a <svg> but it was a ${
              svg.type === "element" ? `<${svg.tagName}>` : svg.type
            }`
          );
        }
        svg.properties.role = "img";
        svg.properties.ariaLabel = node.attributes.alt;
        return Object.assign(node, {
          data: {
            hName: "figure",
            hProperties: {
              class: "_69-svg",
              ariaHidden: node.attributes.alt ? undefined : "true",
            },
            hChildren: [svg],
          },
        });
      }

      // script-list: for our famous lists! Aligns the marker so the . lines up,
      // and handles line wrapping
      //
      // expected usage:
      // :::script-list
      //
      // - item 1
      // - item 2
      // - ...
      //
      // :::
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

        // (if we get here, the script list was malformed, but we still want it to look ok)
        // (yes this does happen and it doesn’t make sense to change it)
        // merge in the only child, getting rid of the script-list in the process
        return Object.assign(node, list, {
          data: { hProperties: { className: "_69-legacy-list" } },
        });
      }

      // component: run eleventy-hast-jsx
      if (node.type === "leafDirective" && node.name === "component") {
        if (node.children.length !== 1 || node.children[0].type !== "text") {
          throw new Error(`Expected a component name`);
        }
        const name = node.children[0].value;
        return file.data
          .renderComponent(name, node.attributes)
          .then((renderedHtml) => ({
            type: "html",
            value: renderedHtml,
          }));
      }

      // otherwise, return the node unchanged
      return node;
    });
}

// things used to separate A/B/C/D/E/F from the content of the list item over time
const delimiters = [".", ")"];

function parseScriptList(list, path) {
  // check that all script items use the same delimiter
  const delimiters = new Set();
  const result = [];
  for (const item of list.children) {
    try {
      // list items should just have one paragraph inside them, e.g.
      // - A. content
      // - B. **formatting** is *allowed*
      // - C. this is not ok though:
      //   - because it's a nested list
      //   - and that's not allowed
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
      if (prefix.type) delimiters.add(prefix.type);
      result.push(prefix);
    } catch (error) {
      throw attachLocationToStack(error, path, item);
    }
  }

  if (delimiters.size !== 1) {
    throw attachLocationToStack(
      new Error(
        `Expected all script list items to have the same prefix, got ${JSON.stringify(
          Array.from(delimiters)
        )}`
      ),
      path,
      list
    );
  }

  return result;
}

// modifies the stack trace to include the location of the current node
function attachLocationToStack(error, file, node) {
  // +11 as an approximate offset for front matter
  const loc = [
    file,
    "~" + (node.position.start.line + 11),
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
  // list items are expected to start with a plain text marker
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

  // handle a list item that’s just 'A.' or 'A)' (with no content or trailing whitespace)
  if (paragraph.children.length === 1) {
    for (const delimiter of delimiters) {
      if (child.value.endsWith(delimiter) && child.value.length < 5) {
        return {
          type: delimiter,
          prefix: child.value,
          content: { type: "paragraph", children: [] },
        };
      }
    }
  }

  // find the first delimiter
  const match = delimiters
    .map((d) => child.value.indexOf(d + " "))
    .filter((i) => i !== -1)
    .sort((a, b) => a - b)[0];
  if (match == null || match === 0) {
    throw new Error(
      `Expected list item to start with a maker followed by a delimiter, got “${child.value}”`
    );
  }

  return {
    // e.g. '.' or ')'
    type: child.value[match],
    // e.g. 'A.' or 'A)'
    prefix: child.value.slice(0, match + 1),
    // everything after the marker+delimiter+space
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

// Copied from unist-util-map to make it async
function map(tree, mapFunction) {
  return preorder(tree, null, null);

  async function preorder(node, index, parent) {
    const newNode = Object.assign({}, await mapFunction(node, index, parent));

    if ("children" in node) {
      newNode.children = await Promise.all(
        node.children.map((child, index) => preorder(child, index, node))
      );
    }

    return newNode;
  }
}
