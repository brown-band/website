const fs = require("node:fs");
const path = require("node:path");

const scriptsDir = path.join(path.dirname(__dirname), "pages", "scripts");

// this is kinda terrible but there's not really a better way at this time :(
module.exports = () => {
  const yearCollections = [];
  const semesterCollections = [];
  // read all the years and semesters for which we have scripts
  for (const years of fs
    .readdirSync(scriptsDir)
    .filter((n) => !n.includes("."))) {
    const yearMap = { year: years };
    for (const semester of fs
      .readdirSync(path.join(scriptsDir, years))
      .filter((n) => !n.endsWith(".toml"))) {
      const year = years.split("-")[Number(semester === "spring")];
      const semesterName = `scripts_${semester}_${year}`;

      // create a new collection for each semester
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
    // Given a list of scripts, figure out how many times Brown has won,
    // lost, or tied both overall and per sport.
    records: (scripts) => {
      const template = {
        wins: 0,
        losses: 0,
        ties: 0,
        toString() {
          return `${this.wins}-${this.losses}-${this.ties}`;
        },
      };
      const records = { total: { ...template } };
      for (const script of scripts) {
        const { teams } = script.data;
        if (!teams || script.fileSlug.endsWith("-censored")) continue;
        records[script.data.sport] ||= { ...template };
        let key;
        if (teams.home.name === "Brown") {
          if (teams.home.score > teams.away.score) {
            key = "wins";
          } else if (teams.home.score < teams.away.score) {
            key = "losses";
          } else {
            key = "ties";
          }
        } else {
          if (teams.home.score > teams.away.score) {
            key = "losses";
          } else if (teams.home.score < teams.away.score) {
            key = "wins";
          } else {
            key = "ties";
          }
        }
        records.total[key]++;
        records[script.data.sport][key]++;
      }

      return {
        total: records.total,
        bySport: Object.entries(records).filter(
          ([_, record]) =>
            !(
              record.wins === records.total.wins &&
              record.losses === records.total.losses &&
              record.ties === records.total.ties
            )
        ),
      };
    },
  };
};
