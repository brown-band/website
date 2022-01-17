const { createElement, Raw } = require("eleventy-hast-jsx");
const Nav = require("../components/Nav");
const Footer = require("../components/Footer");

exports.data = {
  layout: "base.jsx",
  bodyAttrs: {
    class: "d-flex flex-column h-100",
  },
};

exports.default = async ({ site, quote, nav, collections, page, content }) => (
  <>
    <Nav
      {...{ site, quote, nav }}
      all={collections.all}
      currentURL={page.url}
    />

    <div class="container mt-4 mb-5 px-md-0 flex-shrink-0">
      <div class="row">
        <div class="col-lg-1 col-xl-2"></div>
        <main class="col-lg-7 col-xl-6">
          <Raw html={content} />
        </main>
        <div class="col-lg-4"></div>
      </div>
    </div>

    {await (<Footer />)}

    {process.env.NODE_ENV !== "production" && (
      <script type="module" src="/assets/check-purged.js"></script>
    )}
  </>
);
