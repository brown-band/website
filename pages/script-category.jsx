const listify = require("listify");
const { default: Script, ScriptTitle } = require("../components/Script");

const defaultSports = {
  fall: "football",
  spring: "hockey",
};

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
      return [...category.scripts].reverse().map(({ semester, script }) => ({
        id: `${semester.semester}-${semester.year}`,
        value:
          semester.title +
          (!script.data.sport ||
          script.data.sport === defaultSports[semester.semester]
            ? ""
            : ` (${script.data.sport})`),
      }));
    },
  },
};

exports.default = ({
  site: { urls },
  category,
  schoolColors,
  buttons,
  scripts,
}) => {
  const records = scripts.records(category.scripts.map((s) => s.script));
  return (
    <>
      <link rel="stylesheet" href="/assets/css/script.css" />

      {category.scripts.length > 1 &&
      (records.total.wins || records.total.losses || records.total.ties) ? (
        <p class="text-center mb-0 mt-3">
          Overall record: {records.total.toString()}
          {records.bySport.length === 0
            ? ` (all ${category.scripts[0].script.data.sport})`
            : ""}
          {records.bySport.map(([sport, record]) => (
            <>
              <br />
              {sport[0].toUpperCase()}
              {sport.slice(1)}: {String(record)}
            </>
          ))}
        </p>
      ) : null}

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
                  script.script.data.writers.map((s) =>
                    s.replaceAll(" ", "\xA0")
                  )
                )}
              </p>
            )}
          </Script>
        </>
      ))}
    </>
  );
};
