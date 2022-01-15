const { createElement } = require("eleventy-hast-jsx");
const listify = require("listify");
const { default: Script } = require("../components/Script");

exports.data = {
  pagination: {
    data: "scripts.semesters",
    size: 1,
    alias: "semester",
  },
  eleventyComputed: {
    permalink: (d) => d.semester.permalink,
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
  return (
    <>
      <link rel="stylesheet" href="/assets/css/script.css" />

      <p class="d-flex">
        {pagination.page.previous && (
          <a href={pagination.href.previous}>
            ←{pagination.page.previous.title}
          </a>
        )}
        <span class="flex-fill"></span>
        {pagination.page.next && (
          <a href={pagination.href.next}>←{pagination.page.next.title}</a>
        )}
      </p>

      {collection[0].data.writers && (
        <p class="h4">
          Scriptwriter
          {collection[0].data.writers.length === 1 ? "" : "s"}:{" "}
          {collection[0].data.writers.map((s) => s.replaceAll(" ", "\xA0"))}
        </p>
      )}

      {collection.map((script, i) => (
        <>
          {i === 0 || <hr style="margin-bottom: 5em" />}
          {script.title}
          <Script script={script} schoolColors={schoolColors} />
        </>
      ))}
    </>
  );
  r;
};
