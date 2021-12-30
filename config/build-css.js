const path = require("node:path");
const { PurgeCSS } = require("purgecss");
const extractFromHTML = require("purgecss-from-html");
const { writeFile } = require("node:fs/promises");

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  const purger = new PurgeCSS();
  eleventyConfig.on("afterBuild", async () => {
    const result = await purger.purge({
      content: ["public/**/*.html", "public/*.html"],
      css: ["node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css"],
      extractors: [{ extractor: extractFromHTML, extensions: ["html"] }],
      variables: true,
      safelist: [
        // used by recordings.js
        "is-invalid",
        // added by Bootstrap when opening dropdowns in the navbar
        "show",
      ],
    });
    for (const file of result) {
      await writeFile(
        path.join("public", "assets", path.basename("bootstrap.min.css")),
        file.css
      );
    }
  });
};
