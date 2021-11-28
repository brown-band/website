module.exports = (eleventyConfig) => {
  // Data
  eleventyConfig.addDataExtension("yml", (contents) =>
    require("js-yaml").load(contents)
  );
  eleventyConfig.addGlobalData("layout", "base");

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
