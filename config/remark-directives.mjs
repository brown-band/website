import { map } from "unist-util-map";
export default () => (nodeTree) =>
  map(nodeTree, (node) => {
    if (node.type === "textDirective" && node.name === "sd") {
      return {
        ...node,
        data: {
          hName: "span",
          hProperties: { className: "-69-direction" },
        },
      };
    }
    if (node.type === "leafDirective" && node.name === "sd") {
      return {
        ...node,
        data: {
          hName: "p",
          hProperties: { className: "-69-direction" },
        },
      };
    }
    return node;
  });
