// @ts-check
import { map } from "unist-util-map";

export default () => (nodeTree) =>
  map(nodeTree, (/** @type {import("mdast").Content} */ node) => {
    if (node.type === "textDirective" && node.name === "script-tab") {
      return {
        type: "element",
        data: {
          hName: "span",
          hProperties: { className: "_69-tab" },
        },
      };
    }
    if (node.type === "textDirective" && node.name === "sd") {
      return {
        ...node,
        data: {
          hName: "span",
          hProperties: { className: "_69-direction" },
        },
      };
    }
    if (node.type === "leafDirective" && node.name === "sd") {
      return {
        ...node,
        data: {
          hName: "p",
          hProperties: { className: "_69-direction" },
        },
      };
    }
    if (node.type === "containerDirective" && node.name === "script-list") {
      return Object.assign(node, node.children[0], {
        data: {
          hProperties: { className: "_69-list" },
        },
      });
    }
    return node;
  });
