// @ts-check
const fs = require("node:fs");

process.on("unhandledRejection", (err) => {
  console.log(err);
});

/**
 * @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => Partial<ReturnType<import("@11ty/eleventy/src/defaultConfig")>>}
 */
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(require("./config"));

  // ignore the book page
  eleventyConfig.ignores.add("pages/scripts/book.jsx");

  /**
   * Data
   */
  // set the default layout
  eleventyConfig.addGlobalData("layout", "page.jsx");

  /**
   * Assets
   */
  eleventyConfig.addPassthroughCopy({ "assets/root": "/" });

  // disable printing each page as it is converted (since there are a lot of them)
  eleventyConfig.setQuietMode(!process.env.CI);

  return {
    markdownTemplateEngine: "md",
    htmlTemplateEngine: "html",
    // configures the locations of various directories
    dir: {
      input: "pages",
      includes: "../includes",
      layouts: "../layouts",
      data: "../data",
      output: "public",
    },
  };
};
