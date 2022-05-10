exports.data = {
  permalink: "/sitemap.xml",
  layout: null,
  eleventyExcludeFromCollections: true,
};

exports.render = function (data) {
  return this.sitemap(data.collections.all);
};
