module.exports = async () => {
  const fs = require("fs/promises");
  const path = require("path");
  const title = require("title");

  const scriptsDir = path.join(path.dirname(__dirname), "pages", "scripts");
  const years = await fs.readdir(scriptsDir);

  /** @type {{year: string, fall?: string[], spring?: string[]}[]} */
  const allScriptsByYear = await Promise.all(
    years.map(async (year) => ({
      year,
      ...(await fs
        .readdir(path.join(scriptsDir, year))
        .then((semesters) =>
          Promise.all(
            semesters.map(
              async (semester) =>
                /** @type {const} */ ([
                  semester,
                  (
                    await fs.readdir(path.join(scriptsDir, year, semester))
                  ).map((name) => name.slice(0, -3)),
                ])
            )
          )
        )
        .then((semesters) => Object.fromEntries(semesters))),
    }))
  );

  const makeFriendly = (school) =>
    title(school.replaceAll("-", " ").replaceAll("st ", "st. "), {
      special: ["ADOCH", "NBC", "RPI", "UConn", "URI", "UVM", "SUNY"],
    });

  return {
    index: allScriptsByYear.map(({ year, fall, spring }) => ({
      year,
      fall: fall != null,
      spring: spring != null,
    })),
    bySemester: allScriptsByYear
      .flatMap(({ year, fall, spring }) => [
        fall && {
          title: "Fall " + year.split("-")[0],
          permalink: `/scripts/${year}/fall/`,
          scripts: fall.map((name) => ({
            title: makeFriendly(name),
            id: name,
          })),
        },
        spring && {
          title: "Spring " + year.split("-")[1],
          permalink: `/scripts/${year}/spring/`,
          scripts: spring.map((name) => ({
            title: makeFriendly(name),
            id: name,
          })),
        },
      ])
      .filter(Boolean),
  };
};
