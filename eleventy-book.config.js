// @ts-check
const fs = require("fs");

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
  // set the default layout
  eleventyConfig.addGlobalData("permalink", false);

  // CHANGE THESE!
  eleventyConfig.addGlobalData("book", {
    extraYear: false,
    graduationYear: 2019,
  });

  eleventyConfig.addPassthroughCopy({
    "node_modules/pagedjs/dist/paged.polyfill.js": "assets/paged.polyfill.js",
  });

  return {
    // use Nunjucks as the template engine (instead of Liquid)
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
