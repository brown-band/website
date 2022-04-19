/* NOT A PAGE! */

const others = [
  "alumni",
  "fanueil",
  "haffenreffer",
  "hasbro-children's-hospital-ice-show",
  "nbc-show",
  "skating-party",
  "the-cat-in-the-hat",
];

// ideally part of computed data or something but
// that is not currently supported by Eleventy
/**
 * @param allScripts `collections.script`
 * @param scripts `scripts` in the global data
 */
exports.categorizeByOpponent = (allScripts, scripts) => {
  const categories = {};
  for (const script of allScripts) {
    let category = script.data.opponent || script.data.title;
    if (others.includes(script.data.page.fileSlug)) category = "Other";
    if (!categories[category]) {
      categories[category] = {
        title: category,
        slug: category === "Other" ? "other" : script.data.page.fileSlug,
        scripts: [],
      };
    }
    categories[category].scripts.push({
      // title: title,
      script,
      semester: scripts.semesters.find((s) =>
        script.filePathStem.includes(s.years + "/" + s.semester)
      ),
    });
  }
  return categories;
};
