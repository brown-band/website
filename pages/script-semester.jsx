const { createElement } = require("eleventy-hast-jsx");
const listify = require("listify");
const { default: Script } = require("../components/Script");

exports.data = {
  pagination: {
    data: "scripts.semesters",
    size: 1,
    alias: "semester",
  },
  permalink: (d) => d.semester.permalink,
  eleventyComputed: {
    title: (d) => d.semester.title,
    pageHeader: ({ semester }) => (
      <>
        <a href="/scripts/" class="link-secondary">
          Scripts
        </a>{" "}
        &rsaquo; {semester.title}
      </>
    ),
  },
};

exports.default = ({ pagination, collections, semester, schoolColors }) => {
  const collection = collections[semester.collection];
  const { writers } = collection[0].data;
  return (
    <>
      <link rel="stylesheet" href="/assets/css/script.css" />

      <p class="d-flex">
        {pagination.page.previous && (
          <a href={pagination.href.previous}>
            ← {pagination.page.previous.title}
          </a>
        )}
        <span class="flex-fill"></span>
        {pagination.page.next && (
          <a href={pagination.href.next}>{pagination.page.next.title} →</a>
        )}
      </p>

      {writers?.length > 0 && (
        <p class="h4">
          Scriptwriter
          {writers.length === 1 ? "" : "s"}:{" "}
          {listify(writers.map((s) => s.replaceAll(" ", "\xA0")))}
        </p>
      )}

      {collection.map((script, i) => (
        <>
          {i === 0 || <hr style="margin-bottom: 5em" />}
          {script.title}
          <Script
            script={script}
            semester={semester}
            schoolColors={schoolColors}
          />
        </>
      ))}
    </>
  );
  r;
};
