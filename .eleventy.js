// @ts-check

process.on("unhandledRejection", (err) => {
  console.log(err);
});

/**
 * @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => Partial<ReturnType<import("@11ty/eleventy/src/defaultConfig")>>}
 */
module.exports = (eleventyConfig) => {
  eleventyConfig.ignores.add("pages/scripts/**/*.69");

  /**
   * Configure the Markdown parser
   */
  eleventyConfig.addPlugin(require("@fec/eleventy-plugin-remark"), {
    enableRehype: false,
    plugins: [
      "remark-heading-id",
      "remark-directive",
      import("./config/remark-directives.mjs").then((m) => m.default),
      { plugin: "remark-rehype", options: { allowDangerousHtml: true } },
      "rehype-raw",
      "rehype-stringify",
    ],
  });
  // avoid conflict between {#id} syntax and comments
  eleventyConfig.setNunjucksEnvironmentOptions({
    tags: { commentStart: "<#", commentEnd: "#>" },
  });

  /**
   * Data
   */
  // parse YAML files
  eleventyConfig.addDataExtension("yml", (contents) =>
    require("js-yaml").load(contents)
  );
  // set the default layout
  eleventyConfig.addGlobalData("layout", "base");
  // set the domain of the media bucket
  eleventyConfig.addGlobalData(
    "recordings_url",
    "https://brown-band-recordings.s3.amazonaws.com"
  );

  /**
   * Assets
   */
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("buttons/*/*.jpg");
  eleventyConfig.addPassthroughCopy({
    "node_modules/bootstrap/dist/css/bootstrap.min.css*": "assets",
    "node_modules/bootstrap/dist/js/bootstrap.min.js*": "assets",
    "node_modules/base64-arraybuffer/dist/base64-arraybuffer.umd.js*": "assets",
  });

  /**
   * Watch targets
   */
  // in dev mode, rebuild the site when these files change
  // (pages and data files automatically trigger a rebuild)
  eleventyConfig.addWatchTarget("assets");
  eleventyConfig.addWatchTarget("buttons");

  /**
   * Shortcodes
   */
  // syntax: {{ title | page_title }}
  // adds the site title at the end of the page title
  eleventyConfig.addFilter("page_title", function (title) {
    return title ? `${title} | ${this.ctx.site.title}` : this.ctx.site.title;
  });

  // disable printing each page as it is converted (since there are hundreds of them)
  eleventyConfig.setQuietMode(true);

  return {
    // use Nunjucks as the template engine (instead of Liquid)
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
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
