const fs = require("node:fs");
const path = require("node:path");
const formatDate = require("date-fns-tz/formatInTimeZone");
const listify = require("listify");

let tocExtractor;
Promise.all([
  import("rehype"),
  import("rehype-parse"),
  import("@stefanprobst/rehype-extract-toc"),
]).then(([{ rehype }, { default: parse }, { default: extractToc }]) => {
  tocExtractor = rehype().use(parse).use(extractToc);
});

const allIcons = [
  ...fs
    .readFileSync(
      path.join(path.dirname(__dirname), "assets", "icons.svg"),
      "utf-8"
    )
    .matchAll(/<symbol[^>]+id="(?<name>[^"]+)"/g),
].map((i) => i.groups.name);

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter("first", (...args) => args.find((x) => x));
  eleventyConfig.addFilter("reverse", (arr) => [...arr].reverse());
  eleventyConfig.addFilter("defined?", (x) => x != null);
  eleventyConfig.addFilter("not", (x) => !x);
  eleventyConfig.addFilter("and", (a, b) => a && b);
  eleventyConfig.addFilter("even?", (x) => x % 2 === 0);
  eleventyConfig.addFilter("equal?", (x, y) => x === y);
  eleventyConfig.addFilter("gt?", (a, b) => a > b);
  eleventyConfig.addFilter("starts-with?", (a, b) => a.startsWith(b));

  // add the site title at the end of the page title
  eleventyConfig.addFilter("page_title", function (title) {
    return title ? `${title} | ${this.site.title}` : this.site.title;
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
  eleventyConfig.addFilter("find_page", function (filePathStem, state) {
    const page = state.data.root.collections.all.find(
      (p) => p.filePathStem === "/" + filePathStem
    );
    if (page) {
      return {
        href: page.url,
        active: state.data.root.page.url === page.url ? "active" : "",
        title: page.data.title,
      };
    }
  });

  eleventyConfig.addFilter("debug", function (data) {
    return JSON.stringify(data, null, 2) || String(data);
  });

  // auto TOC
  eleventyConfig.addFilter("auto-toc", function (toc, content) {
    if (toc != null) return toc;

    const strip = (headers) =>
      headers
        .filter((h) => h.id)
        .map((h) => ({
          ...h,
          children: h.children ? strip(h.children) : h.children,
        }));
    // if (this.page.outputPath)
    //   console.log(tocExtractor.processSync(content).data.toc);
    return strip(tocExtractor.processSync(content).data.toc);
  });

  // insert an icon
  eleventyConfig.addHandlebarsShortcode(
    "icon",
    function (name, { size = 24 } = {}) {
      if (!allIcons.includes(name)) {
        throw new ReferenceError(`Unknown icon '${name}'`);
      }

      return new (require("handlebars").SafeString)(
        /* HTML */ `
      <svg class="icon" width="${size}" height="${size}">
        <use href="/assets/icons.svg#${name}" />
      </svg>
    `.trim()
      );
    }
  );
};
