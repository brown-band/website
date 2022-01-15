// @ts-check

const renderPDF = import("./book/to-pdf.js").then((m) => m.renderPDF);

process.on("unhandledRejection", (err) => {
  console.log(err);
});

/**
 * @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => Partial<ReturnType<import("@11ty/eleventy/src/defaultConfig")>>}
 */
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(require("./config"));

  /**
   * Data
   */
  // don’t render any pages unless explicitly specified
  eleventyConfig.addGlobalData("permalink", false);

  // CHANGE THESE!
  eleventyConfig.addGlobalData("book", {
    extraYear: false,
    graduationYear: 2019,
  });

  eleventyConfig.addPassthroughCopy({
    "book/node_modules/pagedjs/dist/paged.polyfill.js":
      "assets/paged.polyfill.js",
  });

  let port;

  eleventyConfig.on("afterBuild", async () => {
    if (port) {
      (await renderPDF)(port);
    }
  });

  eleventyConfig.setBrowserSyncConfig({
    snippet: false,
    callbacks: {
      async ready(err, bs) {
        port = bs.server.address().port;
        await (
          await renderPDF
        )(port);
        if (process.env.BAND_BOOK_ONESHOT) {
          process.exit(0);
        }
      },
    },
  });
  return {
    markdownTemplateEngine: "md",
    htmlTemplateEngine: "html",
    // configures the locations of various directories
    dir: {
      input: "pages/scripts",
      includes: "../../includes",
      layouts: "../../layouts",
      data: "../../data",
      output: "book-html",
    },
  };
};
