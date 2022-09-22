const fs = require("node:fs");
const path = require("node:path");

const scriptsDir = path.join(path.dirname(__dirname), "pages", "scripts");

// this is kinda terrible but there's not really a better way at this time :(
module.exports = () => {
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

      const permalink = `scripts/${semester}-${year}/`;
      yearMap[semester] = permalink;
      semesterCollections.push({
        collection: semesterName,
        semester,
        year,
        years,
        permalink,
        title: `${semester[0].toUpperCase()}${semester.slice(1)} ${year}`,
        // has to be a function because we don’t have access
        // to `collections` yet when this data is computed
        scripts: (allScripts) =>
          allScripts.filter((page) =>
            page.filePathStem.includes(years + "/" + semester)
          ),
      });
    }
    yearCollections.push(yearMap);
  }

  return {
    years: yearCollections,
    semesters: semesterCollections,
  };
};
