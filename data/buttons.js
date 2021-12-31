// @ts-check

module.exports = async () => {
  const fs = require("node:fs/promises");
  const path = require("node:path");
  const { default: slugify } = await import("slugify");
  const d3 = await import("d3-array"); // not "d3" because that takes ~300ms to load; see https://github.com/d3/d3/issues/3550
  const { load: loadYaml } = require("js-yaml");

  const readYaml = (...args) =>
    fs.readFile(path.join(buttonsDir, ...args), "utf8").then(loadYaml);

  const buttonsDir = path.join(path.dirname(__dirname), "buttons");
  const years = (await fs.readdir(buttonsDir)).filter(
    (y) => y !== "unknown" && y !== ".DS_Store"
  );

  const rawLabels = await Promise.all(
    years.map(
      async (year) =>
        /** @type {const} */ ([
          year,
          /** @type {{ [key: string]: string }} */ (
            await readYaml(year, "labels.yml")
          ),
        ])
    )
  );

  const allButtons = await Promise.all(
    rawLabels.map(async ([year, labels]) => {
      const buttonImages = await fs.readdir(path.join(buttonsDir, year));
      return Promise.all(
        Object.entries(labels).map(async ([school, label]) => {
          const schoolId = slugify(school).toLowerCase();
          return {
            year: year.split("-")[0],
            school,
            schoolId,
            label,
            image: buttonImages.includes(`${schoolId}.jpg`)
              ? `/buttons/${year}/${schoolId}.jpg`
              : null,
          };
        })
      );
    })
  ).then((arr) => arr.flat());

  /** @type {{ [key: string]: { color: string, type: "ivy" | "recent" | "other", mascot?: string } }} */
  const schools = await fs
    .readFile(path.join(__dirname, "schoolColors.yml"), "utf-8")
    .then(/** @type {(_: string) => any} */ (loadYaml));

  const allBySchool = d3
    .groups(allButtons, (d) => d.school)
    .map(([name, buttons]) => ({
      name,
      id: buttons[0].schoolId,
      buttons: d3.reverse(
        buttons.map(({ school: _, schoolId: _2, ...button }) => button)
      ),
      ...(schools[buttons[0].schoolId] ??
        /** @type {const} */ ({
          type: "other",
          color: "black",
        })),
    }));

  const currentYear = years[years.length - 1];
  return {
    currentYear,
    currentYearButtons: allButtons.filter(
      (b) => b.year === currentYear.split("-")[0]
    ),

    schools,
    bySchool: Object.fromEntries(d3.groups(allBySchool, (d) => d.type)),

    unknown:
      /** @type {{about: string, imageName?: number, label: string}[]} */ (
        await readYaml("unknown", "labels.yml")
      ).map(({ imageName, ...button }) => ({
        ...button,
        image: imageName ? `/buttons/unknown/${imageName}.jpg` : null,
      })),
  };
};
