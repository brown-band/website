// @ts-check

// @ts-ignore
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
    // uncomment to instead make a huge PDF of all scripts
    // allTheScripts: true,
    extraYear: false,
    graduationYear: 2024,
  });

  eleventyConfig.addPassthroughCopy({
    "book/node_modules/pagedjs/dist/paged.polyfill.js":
      "assets/vendor/paged.polyfill.js",
  });

  eleventyConfig.setServerOptions({
    module: "@11ty/eleventy-server-browsersync",
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

  let port;

  eleventyConfig.on("eleventy.after", async () => {
    if (port) {
      (await renderPDF)(port);
    }
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
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
