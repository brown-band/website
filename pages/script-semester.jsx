const listify = require("listify");
const { default: Script, ScriptTitle } = require("../components/Script");

exports.data = {
  pagination: {
    data: "scripts.semesters",
    size: 1,
    alias: "semester",
    addAllPagesToCollections: true,
  },
  tags: ["script-semester"],
  permalink: ({ semester }) => semester.permalink,
  eleventyComputed: {
    title: ({ semester }) => `Scripts: ${semester.title}`,
    pageHeader: ({ semester }) => (
      <>
        <a href="/scripts/" class="link-secondary">
          Scripts
        </a>{" "}
        &rsaquo; {semester.title}
      </>
    ),
    toc: ({ semester, schoolColors, collections }) => {
      return semester.scripts(collections.script).map((script) => ({
        id: script.fileSlug,
        value: (
          <ScriptTitle
            script={script.data}
            fileSlug={script.fileSlug}
            semester={semester}
            schoolColors={schoolColors}
            inToc
          />
        ),
      }));
    },
  },
};

exports.default = ({
  site: { urls },
  pagination,
  collections,
  semester,
  schoolColors,
  buttons,
  scripts: { records: getRecords },
}) => {
  const scripts = semester.scripts(collections.script);
  const { writers } = scripts[0].data;
  const records = getRecords(semester.scripts(collections.script));
  const resultText = (
    <>
      {records.total.wins || records.total.losses || records.total.ties
        ? `Overall semester record: ${records.total}`
        : ""}
      {records.bySport.map(([sport, record]) => (
        <>
          <br />
          {sport[0].toUpperCase()}
          {sport.slice(1)}: {record.toString()}
        </>
      ))}
    </>
  );
  return (
    <>
      <link rel="stylesheet" href="/assets/css/script.css" />

      <p class="d-flex">
        {pagination.page.previous && (
          <a href={pagination.href.previous}>
            ← {pagination.page.previous.title}
          </a>
        )}
        <span class="flex-fill text-center">
          <span class="d-none d-md-inline">{resultText}</span>
        </span>
        {pagination.page.next && (
          <a href={pagination.href.next}>{pagination.page.next.title} →</a>
        )}
      </p>

      <p class="d-md-none text-center">{resultText}</p>

      {writers?.length > 0 && (
        <p class="h4">
          Scriptwriter
          {writers.length === 1 ? "" : "s"}:{" "}
          {listify(writers.map((s) => s.replaceAll(" ", "\xA0")))}
        </p>
      )}

      {scripts.map((script, i) => (
        <>
          {i === 0 || <hr style="margin-bottom: 5em" />}
          <Script
            urls={urls}
            script={script}
            buttons={buttons.byYear}
            semester={semester}
            schoolColors={schoolColors}
          />
        </>
      ))}
    </>
  );
  r;
};
