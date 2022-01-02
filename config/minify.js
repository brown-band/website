const path = require("node:path");
const { PurgeCSS } = require("purgecss");
const extractFromHTML = require("purgecss-from-html");
const { writeFile, readFile } = require("node:fs/promises");

const rehypeTransformHTML = (async () => {
  const { rehype } = await import("rehype");
  const { default: minify } = await import("rehype-preset-minify");
  const { default: format } = await import("rehype-format");
  const { default: cssToTop } = await import("rehype-css-to-top");
  return (
    rehype()
      .use(process.env.NODE_ENV === "production" ? minify : format)
      .use({
        // disable the most egregiously invalid HTML output
        settings: {
          entities: {
            omitOptionalSemicolons: false,
            useShortestReferences: true,
          },
          tightDoctype: false,
          upperDoctype: true,
        },
      })
      // move CSS from the <body> (where templates stick it)
      // to the top
      .use(cssToTop)
  );
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
      // skip formatting/minifying since that will be handled by
      // whatever page this content ends up inside
      return value;
    }
  });

  /**
   * Remove unused CSS
   */
  const purger = new PurgeCSS();
  eleventyConfig.on("afterBuild", async () => {
    console.time("PurgeCSS");
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
    if (process.env.NODE_ENV === "production") {
      await writeFile(
        path.join(outDir, "assets", "bootstrap.min.css"),
        result[0].css,
        "utf8"
      );
    } else {
      await writeFile(
        path.join(outDir, "assets", "bootstrap.min.css"),
        await readFile(
          "node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css"
        )
      );
    }
    if (result[0].rejected) {
      await writeFile(
        path.join(outDir, "purged-names.json"),
        JSON.stringify(result[0].rejected)
      );
    }
    console.timeEnd("PurgeCSS");
  });
};
