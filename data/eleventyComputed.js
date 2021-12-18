// @ts-check

const title = require("title");

// Heads up! this **overrides** data set anywhere else, including in the front matter of a page.
module.exports = {
  title: (data) =>
    data.title == ""
      ? title(data.page.fileSlug.replaceAll("-", " "))
      : data.title,
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
};
