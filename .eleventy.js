module.exports = (eleventyConfig) => {
  // Data:
  eleventyConfig.addDataExtension("yml", (contents) =>
    require("js-yaml").load(contents)
  );

  // Assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({
    "node_modules/bootstrap/dist/css/bootstrap.min.css": "assets/bootstrap.css",
    "node_modules/bootstrap/dist/js/bootstrap.min.js": "assets/bootstrap.js",
    "node_modules/bootstrap/dist/js/bootstrap.min.js.map":
      "assets/bootstrap.min.js.map",
  });
  eleventyConfig.addWatchTarget("assets");

  return {
    passthroughFileCopy: true,
  };
};

function navShortcode(dropdowns) {
  console.log(this);
  return dropdowns.map(
    (d) => /* HTML */ `
      <li class="nav-item dropdown">
        <button
          class="nav-link dropdown-toggle bg-transparent border-0"
          style="outline: 0"
          id="dropdownMenuLink"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          ${d.title}
        </button>
        <ul
          class="dropdown-menu dropdown-menu-dark bg-brown4 rounded-3 lg-shadow-brown"
          aria-labelledby="dropdownMenuLink"
        >
          ${d.content}
        </ul>
      </li>
    `
  );
}
