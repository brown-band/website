const fs = require("node:fs");
const path = require("node:path");
const formatDate = require("date-fns-tz/formatInTimeZone");
const listify = require("listify");

/** @type {import('unified').FrozenProcessor<import('hast').Root, import('hast').Node, import('hast').Node>} */
let tocExtractor;
/** @type {import('vfile').VFile} */
let VFile;
Promise.all([
  import("unified"),
  import("rehype-parse"),
  import("@stefanprobst/rehype-extract-toc"),
  import("vfile"),
]).then(
  ([
    { unified },
    { default: parse },
    { default: extractToc },
    { VFile: VFile_ },
  ]) => {
    // technically this could take time but at least locally the Promises
    // resolve before the value is needed by the template
    // so it can be accessed synchronously
    // https://github.com/handlebars-lang/handlebars.js/issues/717
    tocExtractor = unified().use(parse).use(extractToc).freeze();
    VFile = VFile_;
  }
);

const allIcons = [
  ...fs
    .readFileSync(
      path.join(path.dirname(__dirname), "assets", "icons.svg"),
      "utf-8"
    )
    // parsing SVG with regex. shame on me.
    .matchAll(/<symbol[^>]+id="(?<name>[^"]+)"/g),
].map((i) => i.groups.name);

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  // Handlebars gives you nothing to work with in terms of in-template logic.
  // These helper names are vaguely inspired by Racket.

  // comparison
  eleventyConfig.addHandlebarsHelper("defined?", (x) => x != null);
  eleventyConfig.addHandlebarsHelper("even?", (x) => x % 2 === 0);
  eleventyConfig.addHandlebarsHelper("equal?", (x, y) => x === y);
  eleventyConfig.addHandlebarsHelper("gt?", (a, b) => a > b);

  // logic
  eleventyConfig.addHandlebarsHelper("not", (x) => !x);
  eleventyConfig.addHandlebarsHelper("and", (a, b) => a && b);
  eleventyConfig.addHandlebarsHelper("or", (a, b) => a || b);

  // misc
  eleventyConfig.addHandlebarsHelper("reverse", (arr) => [...arr].reverse());
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

  // generate the table of contents
  eleventyConfig.addHandlebarsHelper("auto-toc", function (toc, content) {
    if (toc != null) return toc;

    // this is a hot path, so do a quick out if there are no headings
    if (!content.includes("<h") || !content.includes("id=")) return [];

    const strip = (headers) =>
      headers
        .filter((h) => h.id)
        .map((h) => ({
          ...h,
          children: h.children ? strip(h.children) : h.children,
        }));
    const file = new VFile(content);
    tocExtractor.runSync(tocExtractor.parse(file), file);
    return strip(file.data.toc);
  });

  // insert an icon
  eleventyConfig.addHandlebarsHelper("icon", (name, { size = 24 } = {}) => {
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
  });
};
