const fs = require("node:fs");
const path = require("node:path");
const formatDate = require("date-fns-tz/formatInTimeZone");
const listify = require("listify");

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

  // insert an icon
  eleventyConfig.addShortcode("icon", function (name, { size = 24 } = {}) {
    if (!allIcons.includes(name)) {
      throw new ReferenceError(`Unknown icon '${name}'`);
    }

    return /* HTML */ `
        <svg class="icon" width="${size}" height="${size}">
          <use href="/assets/icons.svg#${name}" />
        </svg>
      `.trim();
  });
};
