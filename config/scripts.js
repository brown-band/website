// @ts-check

const fs = require("fs");
const path = require("path");

const scriptsDir = path.join(path.dirname(__dirname), "pages", "scripts");

/** @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => void} */
module.exports = (eleventyConfig) => {
  const years = fs.readdirSync(scriptsDir).filter((n) => !n.endsWith(".yml"));

  const yearCollections = [];
  const semesterCollections = [];
  for (const year of years) {
    const yearName = `scripts_${year.replace("-", "_")}`;
    eleventyConfig.addCollection(yearName, (collectionApi) => {
      return collectionApi
        .getFilteredByTag("script")
        .filter((page) => page.filePathStem.startsWith("/scripts/" + year));
    });
    const yearMap = { year, collection: yearName };
    for (const semester of fs
      .readdirSync(path.join(scriptsDir, year))
      .filter((n) => !n.endsWith(".yml"))) {
      const specificYear = year.split("-")[Number(semester === "spring")];
      const semesterName = `scripts_${semester}_${specificYear}`;
      eleventyConfig.addCollection(semesterName, (collectionApi) => {
        return collectionApi
          .getFilteredByTag("script")
          .filter((page) =>
            page.filePathStem.startsWith("/scripts/" + year + "/" + semester)
          );
      });

      yearMap[semester] = semesterName;
      semesterCollections.push({
        collection: semesterName,
        permalink: "scripts/" + year + "/" + semester + "/",
        title: `${semester[0].toUpperCase()}${semester.slice(
          1
        )} ${specificYear}`,
      });
    }
    yearCollections.push(yearMap);
  }

  eleventyConfig.addGlobalData("scripts", {
    yearCollections,
    semesterCollections,
  });
};
