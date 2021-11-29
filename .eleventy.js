const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");

const scriptScript = require("./script-script-to-html");

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

  eleventyConfig.addExtension("69", {
    init() {
      // this.config
    },
    outputFileExtension: "html",
    compile(content, inputPath) {
      const { config } = this;
      return (data) => scriptScript.parse(content, data);
    },
  });

  eleventyConfig.setTemplateFormats(
    "html,liquid,ejs,md,hbs,mustache,haml,pug,njk,11ty.js" + ",69"
  );

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
