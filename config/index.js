/** @type {any} */
const formatDate = require("date-fns-tz/formatInTimeZone");
const listify = require("listify");

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(require("./scripts"));

  /**
   * Configure the Markdown parser
   */
  eleventyConfig.addPlugin(require("@fec/eleventy-plugin-remark"), {
    enableRehype: false,
    plugins: [
      "remark-heading-id",
      "remark-directive",
      import("./remark-directives.mjs").then((m) => m.default),
      { plugin: "remark-rehype", options: { allowDangerousHtml: true } },
      "rehype-raw",
      "rehype-stringify",
    ],
  });

  // avoid conflict between {#id} syntax and comments
  eleventyConfig.setNunjucksEnvironmentOptions({
    tags: { commentStart: "<#", commentEnd: "#>" },
    throwOnUndefined: true,
  });

  /**
   * Data
   */
  // parse YAML files
  eleventyConfig.addDataExtension("yml", (contents) =>
    require("js-yaml").load(contents)
  );

  /**
   * Assets
   */
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy(
    Object.fromEntries(
      [
        "node_modules/bootstrap/dist/css/bootstrap.min.css*",
        "node_modules/bootstrap/dist/js/bootstrap.min.js*",
        "node_modules/base64-arraybuffer/dist/base64-arraybuffer.umd.js*",
      ].map((k) => [k, "assets"])
    )
  );

  /**
   * Shortcodes
   */
  // syntax: {{ title | page_title }}
  // adds the site title at the end of the page title
  eleventyConfig.addFilter("page_title", function (title) {
    return title ? `${title} | ${this.ctx.site.title}` : this.ctx.site.title;
  });
  eleventyConfig.addFilter("script_date", function (date) {
    return formatDate(date, "UTC", "EEEE, MMMM do, y");
  });
  eleventyConfig.addFilter("listify", function (items) {
    return listify((items ?? []).map((s) => s.replaceAll(" ", "\xA0")));
  });
  eleventyConfig.addFilter("debug", function (data) {
    return JSON.stringify(data, null, 2);
  });
  eleventyConfig.addFilter("find_page", function (filePathStem, collection) {
    return collection.find((p) => p.filePathStem === "/" + filePathStem);
  });

  /**
   * Dev Mode
   */
  // in dev mode, rebuild the site when these files change
  // (pages and data files automatically trigger a rebuild)
  eleventyConfig.addWatchTarget("assets");
};
