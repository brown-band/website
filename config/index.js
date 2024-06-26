// @ts-check
const path = require("path");
const subsetFont = require("subset-font");
const fs = require("fs/promises");

require("dotenv").config();

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  const env = process.env.NODE_ENV || "development";
  // enables JSX-based templates and components
  eleventyConfig.addPlugin(require("eleventy-hast-jsx").plugin, {
    componentsDir: "components",
  });
  // minify and/or format HTML, purge unused CSS in production
  eleventyConfig.addPlugin(require("./minify"));

  eleventyConfig.setServerOptions({
    // doesn’t work well with client-side JS
    domdiff: false,
  });

  /**
   * Markdown: use Remark with some customizations as the parser
   */
  eleventyConfig.addExtension("md", {
    async compile(inputContent, inputPath) {
      let result = import("./markdown.mjs").then(({ render }) =>
        render(
          inputContent,
          inputPath,
          eleventyConfig[require("eleventy-hast-jsx").renderComponent]
        )
      );
      return () => result;
    },
  });

  /**
   * Data
   */
  // parse TOML files
  eleventyConfig.addDataExtension("toml", (contents) =>
    require("@iarna/toml").parse(contents)
  );
  // make front matter be TOML too
  eleventyConfig.setFrontMatterParsingOptions({
    engines: {
      toml: require("@iarna/toml").parse,
    },
    delimiters: "+++",
    language: "toml",
  });
  // add NODE_ENV as a global value
  eleventyConfig.addGlobalData("NODE_ENV", env);

  /**
   * Copy assets to the assets/ folder
   */
  const min = env === "development" ? "" : ".min";
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({
    ["node_modules/bootstrap/dist/js/bootstrap.bundle" + min + ".js"]:
      "assets/vendor/bootstrap" + min + ".js",
    "node_modules/base64-arraybuffer/dist/base64-arraybuffer.umd.js":
      "assets/vendor/base64-arraybuffer.js",
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource/quicksand/files/*variable*":
      "assets/fonts/quicksand/files/",
    "node_modules/@fontsource/quicksand/variable.css":
      "assets/fonts/quicksand/variable.css",
    "node_modules/@fontsource/niconne/index.css":
      "assets/fonts/niconne/index.css",
  });

  // Subset the logo font to only include the characters we use
  eleventyConfig.on("eleventy.after", async () => {
    const inputData = await fs.readFile(
      require.resolve(
        "@fontsource/niconne/files/niconne-latin-400-normal.woff2"
      )
    );

    const text = "The Brown Band";
    const [woff, woff2] = await Promise.all([
      subsetFont(inputData, text, { targetFormat: "woff" }),
      subsetFont(inputData, text, { targetFormat: "woff2" }),
    ]);
    await fs.mkdir("public/assets/fonts/niconne/files", { recursive: true });
    await fs.writeFile(
      "public/assets/fonts/niconne/files/niconne-latin-400-normal.woff",
      woff
    );
    await fs.writeFile(
      "public/assets/fonts/niconne/files/niconne-latin-400-normal.woff2",
      woff2
    );
  });

  /**
   * Dev Mode
   */
  // in dev mode, rebuild the site when these files change
  // (pages and data files automatically trigger a rebuild)
  eleventyConfig.addWatchTarget("assets");
  eleventyConfig.addWatchTarget("buttons");
  eleventyConfig.addWatchTarget("components");
};
