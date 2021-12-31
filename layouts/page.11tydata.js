module.exports = {
  layout: "web.hbs",
  eleventyComputed: {
    toc: (data) => data.toc ?? autoToc(data.content),
  },
};

async function autoToc(content, done) {
  const { rehype } = await import("rehype");

  const strip = (headers) =>
    headers
      .filter((h) => h.id)
      .map((h) => ({
        ...h,
        children: h.children ? strip(h.children) : h.children,
      }));

  done(
    null,
    strip(
      (
        await rehype()
          .use((await import("rehype-parse")).default)
          .use((await import("@stefanprobst/rehype-extract-toc")).default)
          .process(content)
      ).data.toc
    )
  );
}
