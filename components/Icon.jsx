const { readFileSync } = require("node:fs");
const path = require("node:path");

const allIcons = [
  ...readFileSync(
    path.join(path.dirname(__dirname), "assets", "images", "icons.svg"),
    "utf-8"
  )
    // parsing SVG with regex. shame on me.
    // ...but shame on you if you break it ;)
    .matchAll(/<symbol[^>]+id="(?<name>[^"]+)"/g),
].map((i) => i.groups.name);

/**
 * @param {Object} props
 * @param {string} props.name The name of the icon to render (from icons.svg)
 * @param {number} props.size The size of the icon (default: 24)
 */
module.exports = ({ name, size = 24 }) => {
  if (!allIcons.includes(name)) {
    throw new ReferenceError(`Unknown icon '${name}'`);
  }
  return (
    <svg class="icon" width={size} height={size}>
      <use href={`/assets/images/icons.svg#${name}`} />
    </svg>
  );
};
