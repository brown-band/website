exports.data = {
  permalink: "/sitemap.xml",
  layout: null,
  eleventyExcludeFromCollections: true,
};

exports.render = function (data) {
  return this.sitemap(
    data.collections.all.filter(
      (d) => !(d.url && d.url.startsWith("/scripts")) || d.url == "/404.html"
    )
  );
};
