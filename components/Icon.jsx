const { createElement } = require("eleventy-hast-jsx");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const allIcons = [
  ...readFileSync(
    path.join(path.dirname(__dirname), "assets", "icons.svg"),
    "utf-8"
  )
    // parsing SVG with regex. shame on me.
    .matchAll(/<symbol[^>]+id="(?<name>[^"]+)"/g),
].map((i) => i.groups.name);

module.exports = ({ name, size = 24 }) => {
  if (!allIcons.includes(name)) {
    throw new ReferenceError(`Unknown icon '${name}'`);
  }
  return (
    <svg class="icon" width={size} height={size}>
      <use href={`/assets/icons.svg#${name}`} />
    </svg>
  );
};
