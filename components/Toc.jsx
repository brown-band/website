/**
 * @typedef {Object} Heading
 * @property {string} id the HTML id="" attribute value
 * @property {string} value the text of the heading
 * @property {Heading[]} [children] any subheadings
 */

/**
 * @param {{toc: Heading[]}} props
 */
module.exports = ({ toc }) => (
  <>
    <head>
      <link rel="stylesheet" href="/assets/css/toc.css" />
    </head>

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

/**
 * @param {{ items: Heading[]}} props
 */
function TocList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li>
          <a href={`#${item.id}`}>{item.value}</a>
          {item.children ? <TocList items={item.children} /> : null}
        </li>
      ))}
    </ul>
  );
}
