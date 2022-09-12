// This page is only enabled when generating script books

const listify = require("listify");
const { default: Script } = require("../../components/Script");

exports.data = {
  layout: "base.jsx",
  permalink: "/",
};

exports.default = ({ book, collections, schoolColors }) => (
  <>
    <head>
      <link rel="stylesheet" href="/assets/css/book.css" />
      <link rel="stylesheet" href="/assets/css/script.css" />
      <link rel="stylesheet" href="/assets/vendor/pagedjs-interface.css" />
      <script src="/assets/vendor/paged.polyfill.js" />
    </head>

    <header>
      <h1
        class="title"
        style="border-width: 0.7mm; font-size: 2.3em; background: #eee"
      >
        The Brown University Band
        <br />
        Football and Hockey Show Scripts
        <br />
        {book.semesters[0].title}–
        {book.semesters[book.semesters.length - 1].title}
      </h1>
    </header>

    <nav class="book-toc">
      <h2 style="margin-top: 0in; margin-bottom: 0.5in">Table of Contents</h2>
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
                    <span class="snap-width">{page.data.title}</span>
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
      const { writers } = scripts[0].data;
      return (
        <section>
          <header class="d-flex flex-column">
            <p class="opacity-0">https://brownband.org/{semester.permalink}</p>
            <div style="flex: 1" />
            <h1 class="title fw-bold" id={semester.collection}>
              {semester.title}
            </h1>
            {writers?.length > 0 && (
              <p class="h5 fw-normal">
                Scriptwriter{writers.length !== 1 && "s"}:{" "}
                {listify(writers.map((s) => s.replaceAll(" ", "\xA0"))).replace(
                  "and ",
                  "and\xA0"
                )}
              </p>
            )}
            <div style="flex: 1" />
            <p class="semester-url">
              https://brownband.org/{semester.permalink}
            </p>
          </header>

          {scripts.map((script) => (
            <Script
              script={script}
              buttons={false}
              semester={semester}
              schoolColors={schoolColors}
              idPrefix={semester.collection + "_"}
              inBook
            />
          ))}
        </section>
      );
    })}

    <span
      style="display: inline-block; position: absolute; opacity: 0;"
      class="dot-test"
    >
      .&nbsp;
    </span>
    <script>
      {`
        const snapWidth = document.querySelector(".dot-test").getBoundingClientRect().width;
        console.log(snapWidth)
        for (const toSnap of document.querySelectorAll(".snap-width")) {
          toSnap.style.width = (Math.ceil((toSnap.offsetWidth + snapWidth) / snapWidth) * snapWidth - snapWidth) + "px";
        }
      `}
    </script>
  </>
);
