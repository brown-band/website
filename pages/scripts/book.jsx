// This page is only enabled when generating script books

const { createElement } = require("eleventy-hast-jsx");
const listify = require("listify");
const { default: Script } = require("../../components/Script");

exports.data = {
  layout: "base.jsx",
  permalink: "/",
};

exports.default = ({ book, collections, schoolColors }) => (
  <>
    <link rel="stylesheet" href="/assets/css/book.css" />
    <link rel="stylesheet" href="/assets/css/script.css" />
    <link rel="stylesheet" href="/assets/css/pagedjs-interface.css" />
    <script src="/assets/paged.polyfill.js"></script>

    <header>
      <h1 class="title" style="border-width: 0.7mm; font-size: 1.85em;">
        The Brown University Band
        <br />
        Football and Hockey Show Scripts
        <br />
        {book.semesters[0].title}–
        {book.semesters[book.semesters.length - 1].title}
      </h1>
    </header>

    <nav class="book-toc">
      <h2 style="margin-top: 0; margin-bottom: 0.5in">Table of Contents</h2>
      <ol>
        {book.semesters.map((semester) => (
          <li>
            <a href={"#" + semester.collection} class="fw-bold">
              {semester.title}
            </a>
            <ol>
              {collections[semester.collection].map((page) => (
                <li>
                  <a href={`#${semester.collection}_${page.fileSlug}`}>
                    {page.data.title}
                  </a>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </nav>

    {book.semesters.map((semester) => {
      const scripts = collections[semester.collection];
      const writers = scripts[0].data.writers;
      return (
        <section>
          <header>
            <h1
              class="title text-decoration-underline"
              id={semester.collection}
            >
              {semester.title}
            </h1>
            {writers?.length > 0 && (
              <p class="h5 fst-italic fw-normal">
                Scriptwriter{writers.length !== 1 && "s"}: {listify(writers)}
              </p>
            )}
          </header>

          {scripts.map((script) => (
            <Script
              script={script}
              idPrefix={semester.collection + "_"}
              schoolColors={schoolColors}
            />
          ))}
        </section>
      );
    })}
  </>
);