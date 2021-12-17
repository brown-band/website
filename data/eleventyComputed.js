// @ts-check

const title = require("title");

// Heads up! this **overrides** data set anywhere else, including in the front matter of a page.
module.exports = {
  title: (data) =>
    data.title == ""
      ? title(data.page.fileSlug.replaceAll("-", " "))
      : data.title,
};
