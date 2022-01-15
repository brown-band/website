const { createElement } = require("eleventy-hast-jsx");

const TocList = ({ items }) => (
  <ul>
    {items.map((item) => (
      <li>
        <a href={`#${item.id}`}>{item.value}</a>
        {item.children ? <TocList items={item.children} /> : <></>}
      </li>
    ))}
  </ul>
);

module.exports = ({ toc }) => (
  <>
    <link rel="stylesheet" href="/assets/css/toc.css" />

    <section class="toc">
      <div>
        <h2 class="d-none d-lg-block" style="font-size: 1.1em">
          <span class="px-1 bg-body position-relative rounded-pill">
            Contents
          </span>
        </h2>
        <nav id="tocNav" class="collapse d-lg-block">
          <TocList items={toc} />
        </nav>
      </div>
    </section>
  </>
);