const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");

const scriptScript = require("./script-script-to-html");

module.exports = (eleventyConfig) => {
  /**
   * Configure the Markdown parser
   */
  // allow custom attributes on Markdown elements
  eleventyConfig.setLibrary(
    "md",
    markdownIt({ html: true }).use(markdownItAttrs)
  );
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

  /**
   * Assets
   */
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("buttons/*/*.jpg");
  eleventyConfig.addPassthroughCopy({
    "node_modules/bootstrap/dist/css/bootstrap.min.css": "assets/bootstrap.css",
    "node_modules/bootstrap/dist/js/bootstrap.min.js": "assets/bootstrap.js",
    "node_modules/bootstrap/dist/js/bootstrap.min.js.map":
      "assets/bootstrap.min.js.map",
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

  /**
   * Script parsing
   */
  // parse .69 files as scripts
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
  // add .69 to the list of supported extensions
  eleventyConfig.setTemplateFormats(
    "html,liquid,ejs,md,hbs,mustache,haml,pug,njk,11ty.js" + ",69"
  );

  return {
    // enable copyng assets
    passthroughFileCopy: true,
    // use Nunjucks as the template engine for Markdown
    markdownTemplateEngine: "njk",
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
