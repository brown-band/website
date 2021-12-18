// @ts-check

const fs = require("fs/promises");
const path = require("path");
const title = require("title");
const { load } = require("js-yaml");

module.exports = async () => {
  const scriptsDir = path.join(path.dirname(__dirname), "pages", "scripts");
  const years = (await fs.readdir(scriptsDir)).filter(
    (n) => n != "scripts.11tydata.yml"
  );

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
                  load(
                    await fs.readFile(
                      path.join(scriptsDir, year, semester, "index.yml"),
                      "utf-8"
                    )
                  ),
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
          scripts: fall,
        },
        spring && {
          title: "Spring " + year.split("-")[1],
          permalink: `/scripts/${year}/spring/`,
          scripts: spring,
        },
      ])
      .filter(Boolean),
  };
};
