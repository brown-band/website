import { rehype } from "rehype";
import minify from "rehype-preset-minify";
import format from "rehype-format";
import { visit } from "unist-util-visit";

export default rehype()
  // move the content of <head> tags inside <body> to the bottom of the actual <head>
  // adapted from rehype-css-to-top@3.0.0
  .use(() => (tree) => {
    /** @type {Array.<[Root|Element, Element]>} */
    const matches = [];
    /** @type {Element|undefined} */
    let head;

    visit(tree, "element", (node, _, parent) => {
      if (node.tagName !== "head") return;

      if (head) {
        const ancestor = /** @type {Root|Element} */ (parent);
        matches.append([ancestor, node]);
      } else {
        head = node;
      }
    });

    if (head) {
      matches.forEach(([ancestor, match], i) => {
        const siblings = ancestor.children;
        siblings.splice(siblings.indexOf(match), 1);
        head.children.push(...match.children);
      });
    }
  })
  .use(process.env.NODE_ENV === "production" ? minify : format)
  .use({
    // disable the most egregiously invalid HTML output
    settings: {
      entities: {
        omitOptionalSemicolons: false,
        useShortestReferences: true,
      },
      tightDoctype: false,
      upperDoctype: true,
    },
  });
