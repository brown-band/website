const listify = require("listify");
const { default: Script, ScriptTitle } = require("../components/Script");

const others = [
  "alumni",
  "fanueil",
  "haffenreffer",
  "hasbro-children's-hospital-ice-show",
  "nbc-show",
  "skating-party",
  "the-cat-in-the-hat",
];

exports.data = {
  pagination: {
    data: "collections.script",
    size: 1,
    alias: "category",
    addAllPagesToCollections: true,
    before(allScripts, { scripts }) {
      const categories = {};
      for (const script of allScripts) {
        let category = script.data.opponent || script.data.title;
        if (others.includes(script.data.page.fileSlug)) category = "other";
        if (!categories[category]) {
          categories[category] = {
            title: category,
            slug: category === "other" ? "other" : script.data.page.fileSlug,
            scripts: [],
          };
        }
        categories[category].scripts.push({
          // title: title,
          script,
          semester: scripts.semesters.find((s) =>
            script.filePathStem.includes(s.years + "/" + s.semester)
          ),
        });
      }

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
        <a href="/scripts/" class="link-secondary">
          Scripts
        </a>{" "}
        &rsaquo; {category.title}
      </>
    ),
    toc: ({ category }) => {
      return category.scripts.map(({ semester }) => ({
        id: `${semester.semester}-${semester.year}`,
        value: semester.title,
      }));
    },
  },
};

exports.default = ({
  site: { urls },
  pagination,
  category,
  schoolColors,
  buttons,
}) => (
  <>
    <link rel="stylesheet" href="/assets/css/script.css" />
    {category.scripts.map((script, i) => (
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
