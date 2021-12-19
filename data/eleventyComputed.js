// @ts-check

const title = require("title");

// Heads up! this **overrides** data set anywhere else, including in the front matter of a page.
module.exports = {
  script: ({ script }) => ({
    ...script,
    ...(script?.teams?.home
      ? script.teams.home.name === "Brown"
        ? {
            opponent: script.teams.away.name,
            isHome: true,
          }
        : {
            opponent: script.teams.home.name,
            isHome: false,
          }
      : null),
  }),

  title(data) {
    if (data.title) return data.title;

    if (data.script.opponent) {
      return (
        data.script.opponent +
        (data.page.filePathStem.endsWith("-censored") ? " (Censored)" : "") +
        (data.script.type === "hockey" && data.script.theme
          ? ` (${data.script.theme} Ice Show)`
          : "")
      );
    }

    if (data.script.type === "stealth_show") return "Stealth Show";
    if (data.script.type === "adoch") return "ADOCH";

    return title(data.page.fileSlug.replaceAll("-", " "), { special: ["NBC"] });
  },
};
