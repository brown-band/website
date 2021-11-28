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
        const schoolId = slugify(school).toLowerCase();
        const buttonPath = [year, `${schoolId}.jpg`];
        return {
          year: year.split("-")[0],
          school,
          schoolId,
          label,
          image: (await pathExists(path.join(buttonsDir, ...buttonPath)))
            ? "/buttons/" + buttonPath.join("/")
            : null,
        };
      })
    )
  );

  const schools = await fs
    .readFile(path.join(__dirname, "schoolColors.yml"))
    .then(require("js-yaml").load);
  const schoolNames = Object.keys(schools);

  const allBySchool = d3
    .groups(allButtons, (d) => d.school)
    .map(([name, buttons]) => ({
      name,
      id: buttons[0].schoolId,
      buttons: d3.reverse(
        buttons.map(({ school: _, schoolId: _2, ...button }) => button)
      ),
    }));

  const currentYear = years[years.length - 1];
  return {
    currentYear,
    currentYearButtons: allButtons.filter(
      (b) => b.year === currentYear.split("-")[0]
    ),

    schools,
    bySchool: {
      ivy: schoolNames
        .filter((id) => schools[id].ivy)
        .map((id) => ({
          ...allBySchool.find((s) => s.id === id),
          ...schools[id],
        })),
      recent: schoolNames
        .filter((id) => !schools[id].ivy)
        .map((id) => ({
          ...allBySchool.find((s) => s.id === id),
          ...schools[id],
        })),
      other: d3.sort(
        allBySchool
          .filter((s) => !schoolNames.includes(s.id))
          .map((s) => ({ ...s, color: "black" })),
        (d) => d.name
      ),
    },

    unknown: (await readJSON("unknown", "labels.json")).map(
      ({ imageName, ...button }) => ({
        ...button,
        image: imageName ? `/buttons/unknown/${imageName}.jpg` : null,
      })
    ),
  };
};
