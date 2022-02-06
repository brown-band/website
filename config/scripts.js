// @ts-check

const fs = require("node:fs");
const path = require("node:path");

const scriptsDir = path.join(path.dirname(__dirname), "pages", "scripts");

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  const yearCollections = [];
  const semesterCollections = [];
  for (const years of fs
    .readdirSync(scriptsDir)
    .filter((n) => !n.includes("."))) {
    const yearMap = { year: years };
    for (const semester of fs
      .readdirSync(path.join(scriptsDir, years))
      .filter((n) => !n.endsWith(".yml"))) {
      const year = years.split("-")[Number(semester === "spring")];
      const semesterName = `scripts_${semester}_${year}`;
      eleventyConfig.addCollection(semesterName, (collectionApi) => {
        return collectionApi
          .getFilteredByTag("script")
          .filter((page) => page.filePathStem.includes(years + "/" + semester));
      });

      const permalink = `scripts/${semester}-${year}/`;
      yearMap[semester] = permalink;
      semesterCollections.push({
        collection: semesterName,
        semester,
        year,
        years,
        permalink,
        title: `${semester[0].toUpperCase()}${semester.slice(1)} ${year}`,
      });
    }
    yearCollections.push(yearMap);
  }

  eleventyConfig.addGlobalData("scripts", {
    years: yearCollections,
    semesters: semesterCollections,
  });
};
