// @ts-check
require("dotenv").config();

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  const env = process.env.NODE_ENV || "development";
  // creates per-semester collections of scripts
  eleventyConfig.addPlugin(require("./scripts"));
  // defines all the Handlebars helpers
  eleventyConfig.addPlugin(require("./templates"));
  // minify and/or format HTML, purge unused CSS in production
  eleventyConfig.addPlugin(require("./minify"));

  eleventyConfig.setServerOptions({
    domdiff: false,
  });

  /**
   * Markdown: use Remark with some customizations as the parser
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
  // add NODE_ENV as a global value
  eleventyConfig.addGlobalData("NODE_ENV", env);

  /**
   * Copy assets to the assets/ folder
   */
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy(
    Object.fromEntries(
      [
        "node_modules/bootstrap/dist/js/" +
          (env === "development" ? "bootstrap.js" : "bootstrap.min.js"),
        "node_modules/base64-arraybuffer/dist/base64-arraybuffer.umd.js",
      ].map((k) => [k, "assets/vendor/" + require("path").basename(k)])
    )
  );

  /**
   * Dev Mode
   */
  // in dev mode, rebuild the site when these files change
  // (pages and data files automatically trigger a rebuild)
  eleventyConfig.addWatchTarget("assets");
  eleventyConfig.addWatchTarget("components");
};
