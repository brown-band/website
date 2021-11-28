const title = require("title");

module.exports = {
  title: (data) =>
    data.title == ""
      ? title(data.page.fileSlug.replaceAll("-", " "))
      : data.title,
};
