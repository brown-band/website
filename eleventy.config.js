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
  eleventyConfig.ignores.add("pages/scripts/book.njk");

  /**
   * Data
   */
  // set the default layout
  eleventyConfig.addGlobalData("layout", "page.hbs");
  // set the domain of the media bucket
  eleventyConfig.addGlobalData(
    "recordings_url",
    "https://brown-band-recordings.s3.amazonaws.com"
  );

  /**
   * Assets
   */
  eleventyConfig.addPassthroughCopy("buttons/*/*.jpg");
  eleventyConfig.addWatchTarget("buttons");

  /**
   * Dev Mode
   */
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready(err, bs) {
        bs.addMiddleware("*", (req, res) => {
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          res.write(fs.readFileSync("public/404.html"));
          res.end();
        });
      },
    },
  });

  // disable printing each page as it is converted (since there are a lot of them)
  eleventyConfig.setQuietMode(true);

  return {
    // use Handlebars as the template engine (instead of Liquid)
    markdownTemplateEngine: "hbs",
    htmlTemplateEngine: "hbs",
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
