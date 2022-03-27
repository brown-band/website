const Icon = require("./Icon");
const Markdown = require("./Markdown");

const findPage = (id, all) => all.find((p) => p.filePathStem === "/" + id);

/**
 * @param {Object} props
 * @param {{ title: string }} props.site from `data/site.yml`
 * @param {ReturnType<import('../data/quote')>} props.quote
 * @param {{ nav: Array }} props.nav from `data/nav.yml`
 * @param {Array} props.all `collections.all` from the page data
 * @param {string} props.currentURL the URL of the current page (`page.url` from the page data)
 */
module.exports = async ({ site, quote, nav: { nav }, all, currentURL }) => (
  <>
    <link rel="stylesheet" href="/assets/css/navbar-colors.css" />
    <link rel="stylesheet" href="/assets/css/nav.css" />

    <nav class="navbar navbar-expand-md navbar-dark bg-brown2">
      <div class="container-lg">
        <div class="col-lg-1 col-xl-2" />
        <div
          class="col-md-12 col-lg-10 col-xl-9 d-flex align-items-center justify-content-between"
          style="flex-wrap: inherit"
        >
          <a
            class="navbar-brand mb-2 mb-md-0 me-0 me-md-4 d-flex align-items-center"
            href="/"
          >
            <img
              class="me-2"
              src="/assets/images/elrod-nav@3x.png"
              width="50"
              height="50"
              alt=""
            />
            <div class="d-flex flex-column">
              <span style="font-family: Niconne; font-size: 1.25em">
                {site.title}
              </span>
              <span class="header-quote">
                {(await (<Markdown content={quote.random()} />))[0].children}
              </span>
            </div>
          </a>
          <ul class="navbar-nav bg-brown3 flex-sm-row">
            {nav.map((item, index) => (
              <li>
                <details class="nav-item mx-sm-3 mx-md-1">
                  <summary
                    role="button"
                    tabIndex={0}
                    class={
                      "nav-link dropdown-toggle btn" +
                      (item.content.some(
                        (ch) =>
                          !ch.disabled &&
                          !ch.heading &&
                          !ch.url &&
                          findPage(ch, all).url === currentURL
                      )
                        ? " active"
                        : "")
                    }
                    style="outline: 0"
                  >
                    {item.title}
                  </summary>

                  <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-brown rounded-3 sm-shadow-brown mx-3 mx-sm-0 d-block">
                    {item.content.map((link) => {
                      if (link.heading) {
                        return (
                          <>
                            <li>
                              <hr class="dropdown-divider" />
                            </li>
                            <li>
                              <h6 class="dropdown-header">{link.heading}</h6>
                            </li>
                          </>
                        );
                      } else if (link.disabled) {
                        return (
                          <li class="dropdown-item disabled">
                            {link.disabled}
                          </li>
                        );
                      } else if (link.title) {
                        return (
                          <li>
                            <a class="dropdown-item" href={link.url}>
                              {link.title}{" "}
                              <Icon name="external-link" size={12} />
                            </a>
                          </li>
                        );
                      } else {
                        const page = findPage(link, all);
                        return (
                          <li>
                            <a
                              class={
                                "dropdown-item" +
                                (page.url === currentURL ? " active" : "")
                              }
                              href={page.url}
                            >
                              {page.data.title}
                            </a>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </details>
              </li>
            ))}
            <li class="nav-item mx-sm-3 mx-md-1">
              <a
                href="/contact/"
                class={
                  "nav-link" +
                  (findPage("contact", all).url === currentURL ? " active" : "")
                }
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div class="col-lg-1" />
      </div>
    </nav>
  </>
);
