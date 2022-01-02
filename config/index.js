// @ts-check

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(require("./scripts"));
  eleventyConfig.addPlugin(require("./templates"));
  eleventyConfig.addPlugin(require("./minify"));

  /**
   * Markdown
   */
  eleventyConfig.setLibrary("md", {
    set: () => {},
    render: (str) => import("./markdown.mjs").then(({ render }) => render(str)),
  });

  /**
   * Data
   */
  // parse YAML files
  eleventyConfig.addDataExtension("yml", (contents) =>
    require("js-yaml").load(contents)
  );
  eleventyConfig.addGlobalData(
    "NODE_ENV",
    process.env.NODE_ENV || "development"
  );

  /**
   * Assets
   */
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy(
    Object.fromEntries(
      [
        "node_modules/bootstrap/dist/js/bootstrap.min.js*",
        "node_modules/base64-arraybuffer/dist/base64-arraybuffer.umd.js*",
      ].map((k) => [k, "assets"])
    )
  );

  /**
   * Dev Mode
   */
  // in dev mode, rebuild the site when these files change
  // (pages and data files automatically trigger a rebuild)
  eleventyConfig.addWatchTarget("assets");
};
