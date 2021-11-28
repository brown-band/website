module.exports = async () => {
  const fs = require("fs/promises");
  const path = require("path");
  const slugify = (await import("slugify")).default;
  const d3 = await import("d3");
  const { pathExists } = await import("path-exists");

  const readJSON = (...args) =>
    fs.readFile(path.join(buttonsDir, ...args), "utf8").then(JSON.parse);

  const buttonsDir = path.join(path.dirname(__dirname), "buttons");
  const years = (await fs.readdir(buttonsDir)).filter((y) => y !== "unknown");

  const rawLabels = await Promise.all(
    years.map(async (year) => [year, await readJSON(year, "labels.json")])
  );

  const allButtons = await Promise.all(
    rawLabels.flatMap(([year, labels]) =>
      Object.entries(labels).map(async ([school, label]) => {
        const buttonPath = [year, `${slugify(school).toLowerCase()}.jpg`];
        return {
          year: year.split("-")[0],
          school,
          label,
          image: (await pathExists(path.join(buttonsDir, ...buttonPath)))
            ? "/buttons/" + buttonPath.join("/")
            : null,
        };
      })
    )
  );

  const currentYear = years[years.length - 1];
  return {
    currentYear,
    currentYearButtons: allButtons.filter(
      (b) => b.year === currentYear.split("-")[0]
    ),

    bySchool: d3
      .groups(allButtons, (d) => d.school)
      .map(([name, buttons]) => ({
        name,
        buttons: d3.reverse(buttons.map(({ school: _, ...button }) => button)),
      })),

    unknown: (await readJSON("unknown", "labels.json")).map(
      ({ imageName, ...button }) => ({
        ...button,
        image: imageName ? `/buttons/unknown/${imageName}.jpg` : null,
      })
    ),
  };
};
