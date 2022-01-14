const formatDate = require("date-fns-tz/formatInTimeZone");
const listify = require("listify");

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  // Handlebars gives you nothing to work with in terms of in-template logic.
  // These helper names are vaguely inspired by Racket.

  // comparison
  eleventyConfig.addHandlebarsHelper("defined?", (x) => x != null);
  eleventyConfig.addHandlebarsHelper("even?", (x) => x % 2 === 0);
  eleventyConfig.addHandlebarsHelper("equal?", (x, y) => x === y);
  eleventyConfig.addHandlebarsHelper("add", (x, y) => x + y);
  eleventyConfig.addHandlebarsHelper("gt?", (a, b) => a > b);

  // logic
  eleventyConfig.addHandlebarsHelper("not", (x) => !x);
  eleventyConfig.addHandlebarsHelper("and", (a, b) => a && b);
  eleventyConfig.addHandlebarsHelper("or", (a, b) => a || b);

  // misc
  eleventyConfig.addHandlebarsHelper("reverse", (arr) => [...arr].reverse());
  eleventyConfig.addHandlebarsHelper("last", (arr) => arr[arr.length - 1]);
  eleventyConfig.addHandlebarsHelper("starts-with?", (a, b) => a.startsWith(b));
  eleventyConfig.addHandlebarsHelper("format-utc", (date, format) =>
    formatDate(date, "UTC", format)
  );

  // convert a list to a format that’s human readable (commas between, “and” at the end)
  // and prevent insertion of line breaks within list elements
  eleventyConfig.addHandlebarsHelper("listify", (items) =>
    listify((items ?? []).map((s) => s.replaceAll(" ", "\xA0")))
  );

  // find the page with the given filePathStem in the given collection
  // used by nav.hbs
  eleventyConfig.addHandlebarsHelper("find-page", (id, state) => {
    const page = state.data.root.collections.all.find(
      (p) => p.filePathStem === "/" + id
    );
    if (page) {
      return {
        href: page.url,
        active: state.data.root.page.url === page.url ? "active" : "",
        title: page.data.title,
      };
    } else {
      throw new ReferenceError(
        `[find-page] Could not find page ${JSON.stringify(id)}`
      );
    }
  });

  eleventyConfig.addHandlebarsHelper(
    "debug",
    (data) => JSON.stringify(data, null, 2) || String(data)
  );
};
