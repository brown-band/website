// This file used to be longer but then I (Jed) made and
// published a plugin.Because I’m like that.

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(require("eleventy-hast-jsx").plugin);
};
