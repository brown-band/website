module.exports = async () => {
  const fs = require("fs/promises");
  const path = require("path");

  const scriptsDir = path.join(path.dirname(__dirname), "pages", "scripts");
  const years = await fs.readdir(scriptsDir);
  return {
    byYear: await Promise.all(
      years.map(async (year) => [
        year,
        Object.fromEntries(
          await fs
            .readdir(path.join(scriptsDir, year))
            .then((semesters) =>
              Promise.all(
                semesters.map(async (semester) => [
                  semester,
                  (
                    await fs.readdir(path.join(scriptsDir, year, semester))
                  ).map((name) => name.slice(0, -3)),
                ])
              )
            )
        ),
      ])
    ),
  };
};
