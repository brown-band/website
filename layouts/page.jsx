const { Raw } = require("eleventy-hast-jsx");
const Toc = require("../components/Toc");
const TocButton = require("../components/TocButton");

exports.data = {
  layout: "web.jsx",
};

const Heading = ({ title, page_header, show_header }) =>
  title &&
  show_header != false && (
    <h1>{page_header ? <Raw html={page_header} /> : title}</h1>
  );

const tocExtractor = await Promise.all([
  import("unified"),
  import("rehype-parse"),
  import("@stefanprobst/rehype-extract-toc"),
]).then(([{ unified }, { default: parse }, { default: extractToc }]) =>
  unified().use(parse).use(extractToc).freeze()
);

const { VFile } = await import("vfile");

const getToc = async (toc, content) => {
  if (toc != null) return toc;

  // this is a hot path, so do a quick out if there are no headings
  if (!content.includes("<h") || !content.includes("id=")) return [];

  const strip = (headers) =>
    headers
      .filter((h) => h.id)
      .map((h) => ({
        ...h,
        children: h.children ? strip(h.children) : h.children,
      }));
  const file = new VFile(content);
  await tocExtractor.run(tocExtractor.parse(file), file);
  return strip(file.data.toc);
};

exports.default = async (data) => {
  const toc = await getToc(data.toc, data.content);
  return (
    <article>
      {toc && toc.length ? (
        <>
          <TocButton />
          <Heading {...data} />
          <Toc toc={toc} />
        </>
      ) : (
        <Heading {...data} />
      )}

      {data.summary ? (
        <blockquote>
          <p>
            <em>
              <Raw html={data.summary} />
            </em>
          </p>
        </blockquote>
      ) : (
        <></>
      )}

      <Raw html={data.content} />
    </article>
  );
};
