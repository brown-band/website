/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  // Handlebars gives you nothing to work with in terms of in-template logic.
  // These helper names are vaguely inspired by Racket.

  // comparison
  eleventyConfig.addHandlebarsHelper("even?", (x) => x % 2 === 0);
  eleventyConfig.addHandlebarsHelper("equal?", (x, y) => x === y);
  eleventyConfig.addHandlebarsHelper("add", (x, y) => x + y);

  // misc
  eleventyConfig.addHandlebarsHelper("not", (x) => !x);
  eleventyConfig.addHandlebarsHelper("last", (arr) => arr[arr.length - 1]);

  eleventyConfig.addHandlebarsHelper(
    "debug",
    (data) => JSON.stringify(data, null, 2) || String(data)
  );
};
