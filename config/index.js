/** @type {any} */
const formatDate = require("date-fns-tz/formatInTimeZone");
const listify = require("listify");

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(require("./scripts"));
  eleventyConfig.addPlugin(require("./build-css"));

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
        "node_modules/bootstrap/dist/js/bootstrap.min.js*",
        "node_modules/base64-arraybuffer/dist/base64-arraybuffer.umd.js*",
      ].map((k) => [k, "assets"])
    )
  );

  /**
   * Filters & Shortcodes
   */
  // add the site title at the end of the page title
  eleventyConfig.addFilter("page_title", function (title) {
    return title ? `${title} | ${this.ctx.site.title}` : this.ctx.site.title;
  });
  // format a date for display in a script header
  eleventyConfig.addFilter("script_date", function (date) {
    return formatDate(date, "UTC", "EEEE, MMMM do, y");
  });
  // convert a list to a format that’s human readable (commas between, “and” at the end)
  // and prevent insertion of line breaks within list elements
  eleventyConfig.addFilter("listify", function (items) {
    return listify((items ?? []).map((s) => s.replaceAll(" ", "\xA0")));
  });
  // find the page with the given filePathStem in the given collection
  // used by nav.njk
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
