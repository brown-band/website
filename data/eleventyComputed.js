// @ts-check

const title = require("title");

// Heads up! this **overrides** data set anywhere else, including in the front matter of a page.
module.exports = {
  opponent: ({ teams, opponent }) =>
    teams?.home
      ? teams.home.name === "Brown"
        ? teams.away.name
        : teams.home.name
      : opponent,

  title(data) {
    if (data.title) return data.title;

    if (data.opponent) {
      return (
        data.opponent +
        (data.page.filePathStem.endsWith("-hockey") ? " Hockey" : "") +
        (data.page.filePathStem.endsWith("-censored") ? " (Censored)" : "") +
        (data.iceShowTheme ? ` (${data.iceShowTheme} Ice Show)` : "")
      );
    }

    return title(data.page.fileSlug.replaceAll("-", " "), {
      special: ["NBC", "ADOCH"],
    });
  },
};
