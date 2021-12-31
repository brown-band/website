const path = require("node:path");
const { PurgeCSS } = require("purgecss");
const extractFromHTML = require("purgecss-from-html");
const { writeFile } = require("node:fs/promises");

const rehypeTransformHTML = (async () => {
  const { rehype } = await import("rehype");
  const { default: minify } = await import("rehype-preset-minify");
  const { default: format } = await import("rehype-format");
  return rehype().use(process.env.NODE_ENV === "production" ? minify : format);
})();

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  // HTML
  const outDir = path.resolve(
    path.dirname(__dirname),
    eleventyConfig.dir.output
  );
  eleventyConfig.addTransform("clean-html", function (value) {
    if (this.outputPath) {
      return rehypeTransformHTML
        .then((rehype) =>
          rehype.process({
            value,
            cwd: outDir,
            path: this.outputPath,
          })
        )
        .then((file) => file.value);
    } else {
      return value;
    }
  });

  // CSS
  const purger = new PurgeCSS();
  eleventyConfig.on("afterBuild", async () => {
    console.time("PurgeCSS");
    // this is run unconditionally because it could remove properties that are being used
    // and seeing that at dev time is better than seeing it at runtime
    const result = await purger.purge({
      content: [`${outDir}/**/*.html`, `${outDir}/*.html`],
      css: ["node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css"],
      extractors: [{ extractor: extractFromHTML, extensions: ["html"] }],
      variables: true,
      keyframes: true,
      fontFace: true,
      safelist: [
        // used by recordings.js
        "is-invalid",
        // used by collapse (for mobile TOC)
        "collapsing",
        // added by Bootstrap when opening dropdowns in the navbar
        "show",
        "data-bs-popper",
      ],
      rejected: process.env.NODE_ENV !== "production",
    });
    await writeFile(
      path.join(outDir, "assets", "bootstrap.min.css"),
      result[0].css
    );
    if (result[0].rejected) {
      await writeFile(
        path.join(outDir, "purged-names.json"),
        JSON.stringify(result[0].rejected)
      );
    }
    console.timeEnd("PurgeCSS");
  });
};