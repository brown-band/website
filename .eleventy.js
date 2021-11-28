const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");

module.exports = (eleventyConfig) => {
  // Markdown
  eleventyConfig.setLibrary(
    "md",
    markdownIt({ html: true }).use(markdownItAttrs)
  );
  eleventyConfig.setNunjucksEnvironmentOptions({
    tags: { commentStart: "<#", commentEnd: "#>" },
  });

  // Data
  eleventyConfig.addDataExtension("yml", (contents) =>
    require("js-yaml").load(contents)
  );
  eleventyConfig.addGlobalData("layout", "base");

  // Assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("buttons/*/*.jpg");
  eleventyConfig.addPassthroughCopy({
    "node_modules/bootstrap/dist/css/bootstrap.min.css": "assets/bootstrap.css",
    "node_modules/bootstrap/dist/js/bootstrap.min.js": "assets/bootstrap.js",
    "node_modules/bootstrap/dist/js/bootstrap.min.js.map":
      "assets/bootstrap.min.js.map",
  });
  eleventyConfig.addWatchTarget("assets");
  eleventyConfig.addWatchTarget("buttons/*/*.json");

  // Shortcodes
  eleventyConfig.addFilter("page_title", function (title) {
    return title ? `${title} | ${this.ctx.site.title}` : this.ctx.site.title;
  });

  return {
    passthroughFileCopy: true,
    markdownTemplateEngine: "njk",
    dir: {
      input: "pages",
      includes: "../includes",
      data: "../data",
      output: "public",
    },
  };
};
