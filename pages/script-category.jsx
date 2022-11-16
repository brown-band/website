const listify = require("listify");
const { default: Script, ScriptTitle } = require("../components/Script");

exports.data = {
  pagination: {
    data: "collections.script",
    size: 1,
    alias: "category",
    addAllPagesToCollections: true,
    before(allScripts, { scripts }) {
      const categories = require("./script-utils").categorizeByOpponent(
        allScripts,
        scripts
      );

      return Object.values(categories).sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      );
    },
  },
  fakeData: [],
  tags: ["scriptCategory"],
  permalink: ({ category }) => `/scripts/${category.slug}/`,
  eleventyComputed: {
    title: ({ category }) => `All Scripts: ${category.title}`,
    pageHeader: ({ category }) => (
      <>
        <a href="/scripts/#categories" class="link-secondary">
          Scripts
        </a>{" "}
        &rsaquo; {category.title}
      </>
    ),
    toc: ({ category }) => {
      return [...category.scripts].reverse().map(({ semester }) => ({
        id: `${semester.semester}-${semester.year}`,
        value: semester.title,
      }));
    },
  },
};

exports.default = ({ site: { urls }, category, schoolColors, buttons }) => (
  <>
    <link rel="stylesheet" href="/assets/css/script.css" />
    {[...category.scripts].reverse().map((script, i) => (
      <>
        {i === 0 || <hr style="margin-bottom: 5em" />}
        <Script
          id={`${script.semester.semester}-${script.semester.year}`}
          urls={urls}
          script={script.script}
          buttons={buttons.byYear}
          semester={script.semester}
          schoolColors={schoolColors}
        >
          {script.script.data.writers?.length > 0 && (
            <p class="h5">
              Scriptwriter
              {script.script.data.writers.length === 1 ? "" : "s"}:{" "}
              {listify(
                script.script.data.writers.map((s) => s.replaceAll(" ", "\xA0"))
              )}
            </p>
          )}
        </Script>
      </>
    ))}
  </>
);
