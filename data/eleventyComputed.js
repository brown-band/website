// @ts-check

const title = require("title");

// Heads up! this **overrides** data set anywhere else, including in the front matter of a page.
module.exports = {
  opponent({ teams, opponent }) {
    if (teams?.home) {
      if (teams.home.name === "Brown") {
        return teams.away.name;
      } else {
        return teams.home.name;
      }
    } else {
      return opponent;
    }
  },

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

  book({ book, scripts }) {
    if (!book) return undefined;
    if (book.allTheScripts) {
      return {
        ...book,
        semesters: scripts.semesters,
      };
    }

    const semesters = [];
    for (
      let year = Math.floor(book.graduationYear - (book.extraYear ? 5 : 4));
      year <= Math.floor(book.graduationYear);
      year++
    ) {
      semesters.push("scripts_spring_" + year);
      semesters.push("scripts_fall_" + year);
    }

    return {
      ...book,
      // remove spring before start and fall after end
      semesters: semesters
        .slice(1, String(book.graduationYear).endsWith(".5") ? undefined : -1)
        .map((s) => scripts.semesters.find((c) => c.collection === s)),
    };
  },
};
