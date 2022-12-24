// @ts-check

/**
 * @typedef {Object} School
 * @property {string} name
 * @property {string} id
 * @property {SchoolButton[]} buttons
 * @property {true} [ivy]
 * @property {string} color
 */

/**
 * @typedef {Object} SchoolButton
 * @property {string} year
 * @property {string} label
 * @property {string | null} image
 */

module.exports = async () => {
  const fs = require("node:fs/promises");
  const path = require("node:path");
  const { AssetCache } = require("@11ty/eleventy-fetch");
  const slugify = require("@sindresorhus/slugify");
  const d3 = await import("d3-array"); // not "d3" because that takes ~300ms to load; see https://github.com/d3/d3/issues/3550
  const { load: loadYaml } = require("js-yaml");

  const readYaml = (name) =>
    fs.readFile(path.join(buttonsDir, name), "utf8").then(loadYaml);

  // Find all the years for which we have buttons
  const buttonsDir = path.join(path.dirname(__dirname), "buttons");
  const years = (await fs.readdir(buttonsDir))
    .map((y) => y.replace(".yml", ""))
    .filter((y) => y !== "unknown" && y !== ".DS_Store");

  // Fetch the list of button image files from GitHub
  const imagesAsset = new AssetCache("button-images");
  if (!imagesAsset.isCacheValid("15m")) {
    const result = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query: buttonsQuery }),
    }).then((res) => res.json());

    if (!result.data) {
      console.error(result);
    }

    const buttons = result.data.repository.defaultBranchRef.target.tree.entries
      .filter(({ name, type }) => type === "tree" && !name.startsWith("."))
      .map(({ name, object }) => [
        name,
        object.entries.map(({ name }) => name),
      ]);

    await imagesAsset.save(buttons, "json");
  }

  /** @type {Map<string, string[]>} */
  const buttonImages = new Map(await imagesAsset.getCachedValue());

  // read the button labels from the local file system
  const rawLabels = await Promise.all(
    years.map(
      async (year) =>
        /** @type {const} */ ([
          year,
          /** @type {{ [key: string]: string }} */ (
            await readYaml(year + ".yml")
          ),
        ])
    )
  );

  // Pull together the local and remote data to connect button labels with images
  const allButtonsByYear = await Promise.all(
    rawLabels.map(async ([year, labels]) => {
      return /** @type {const} */ ([
        year,
        await Promise.all(
          Object.entries(labels).map(async ([school, label]) => {
            const schoolId = slugify(school, {
              customReplacements: [["UAlbany", "ualbany"]],
            }).toLowerCase();
            const image = buttonImages
              .get(year)
              ?.find((f) => f.startsWith(schoolId));
            return {
              year: year.split("-")[0],
              school,
              schoolId,
              label,
              image: image ? `${year}/${image}` : null,
              thumbnail: image
                ? image.endsWith(".svg")
                  ? `${year}/${image}`
                  : `${year}/${image.split(".")[0]}.webp`
                : null,
            };
          })
        ),
      ]);
    })
  );
  const allButtons = allButtonsByYear.flatMap((b) => b[1]);

  /** @type {{ [key: string]: { color: string, ivy?: true, mascot?: string } }} */
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
        /** @type {const} */ ({ color: "salmon; " + buttons[0].schoolId })),
    }));

  const currentYear = years[years.length - 1];
  const currentYearLabels = rawLabels.find(([year]) => year === currentYear)[1];
  // split non-ivy buttons into ones we’ve made in the last 4 years and ones we haven’t
  const { recent, other } = Object.fromEntries(
    d3.groups(
      // first sort by most recent year, then
      // alphabetically in case of ties.
      d3.sort(
        d3.sort(
          allBySchool.filter((d) => !d.ivy),
          (d) => d.name
        ),
        (d) => -parseInt(d.buttons[0].year)
      ),
      (d) =>
        parseInt(d.buttons[0].year) >= new Date().getFullYear() - 4
          ? "recent"
          : "other"
    )
  );

  return {
    currentYear,
    currentYearButtons: d3.sort(
      allButtons.filter((b) => b.year === currentYear.split("-")[0]),
      (d) => Object.keys(currentYearLabels).indexOf(d.school)
    ),

    schools,
    bySchool: {
      ivy: allBySchool.filter((d) => d.ivy),
      recent,
      other,
    },
    byYear: Object.fromEntries(allButtonsByYear),

    unknown:
      /** @type {{about: string, imageName?: number, label: string}[]} */ (
        await readYaml("unknown.yml")
      ).map(({ imageName, ...button }) => ({
        ...button,
        image: imageName ? `unknown/${imageName}.png` : null,
        thumbnail: imageName ? `unknown/${imageName}.webp` : null,
      })),
  };
};

// https://docs.github.com/en/graphql/overview/explorer
// fetch all the button files which are arranged like `{year}/{schoolId}.{ext}`
const buttonsQuery = /* GraphQL */ `
  query FetchButtons {
    repository(owner: "brown-band", name: "buttons") {
      defaultBranchRef {
        target {
          ... on Commit {
            tree {
              entries {
                name
                type
                object {
                  ... on Tree {
                    entries {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
