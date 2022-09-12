const path = require("node:path");
const { PurgeCSS } = require("purgecss");
const CleanCSS = require("clean-css");
const extractFromHTML = require("purgecss-from-html");
const { writeFile, readFile, mkdir } = require("node:fs/promises");

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  // HTML
  const outDir = path.resolve(
    path.dirname(__dirname),
    eleventyConfig.dir.output
  );
  eleventyConfig.addTransform("clean-html", function (value) {
    if (this.outputPath && this.outputPath.endsWith(".html")) {
      return import("./html.mjs")
        .then(({ default: rehype }) =>
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
   * Remove unused Bootstrap CSS
   */
  const purger = new PurgeCSS();
  const minifier = new CleanCSS({ level: 2, returnPromise: true });
  eleventyConfig.on("eleventy.after", async () => {
    console.time("Bootstrap CSS");
    const result = await purger.purge({
      content: [`${outDir}/**/*.html`, `${outDir}/*.html`],
      css: [`assets/css/*.css`, `assets/vendor/bootstrap.css`],
      extractors: [{ extractor: extractFromHTML, extensions: ["html"] }],
      variables: true,
      keyframes: true,
      fontFace: true,
      safelist: {
        standard: [
          // used by recordings.js
          "is-invalid",
          // used by collapse (for mobile TOC)
          "collapsing",
          // added by Bootstrap when opening dropdowns in the navbar
          "show",
          "data-bs-popper",
          // added by Bootstrap when opening modals
          "modal-backdrop",
        ],
        // not sure why this isn’t picked up
        variables: ["--bs-font-monospace", "--bs-body-font-weight"],
      },
      dynamicAttributes: ["data-bs-theme"],
      rejected: process.env.NODE_ENV !== "production",
    });
    await mkdir(path.join(outDir, "assets", "vendor"), { recursive: true });
    if (process.env.NODE_ENV === "production") {
      const minified = await minifier.minify(result[result.length - 1].css);
      await writeFile(
        path.join(outDir, "assets", "vendor", "bootstrap.min.css"),
        minified.styles,
        "utf8"
      );
    } else {
      await writeFile(
        path.join(outDir, "assets", "vendor", "bootstrap.min.css"),
        await readFile(`assets/vendor/bootstrap.css`)
      );
    }
    if (result[result.length - 1].rejected) {
      await writeFile(
        path.join(outDir, "purged-names.json"),
        JSON.stringify(result[result.length - 1].rejected)
      );
    }
    console.timeEnd("Bootstrap CSS");
  });
};
