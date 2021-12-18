// @ts-check

const title = require("title");

// Heads up! this **overrides** data set anywhere else, including in the front matter of a page.
module.exports = {
  script: ({ script }) =>
    script
      ? {
          ...script,
          teams: script.teams
            ? script.teams.home.name === "Brown"
              ? {
                  ...script.teams,
                  opponent: script.teams.away.name,
                  isHome: true,
                }
              : {
                  ...script.teams,
                  opponent: script.teams.home.name,
                  isHome: false,
                }
            : script.teams,
        }
      : script,
  title: (data) =>
    data.title == ""
      ? data.script?.teams
        ? data.script.teams.opponent +
          (data.page.filePathStem.endsWith("-censored") ? " (Censored)" : "") +
          (data.script.type === "hockey" && data.script.theme
            ? ` (${data.script.theme} Ice Show)`
            : "")
        : data.script?.type === "stealth_show"
        ? "Stealth Show"
        : data.script?.type === "adoch"
        ? "ADOCH"
        : title(data.page.fileSlug.replaceAll("-", " "), { special: ["NBC"] })
      : data.title,
};
