const { createElement } = require("eleventy-hast-jsx");
const Icon = require("./Icon.jsx");

module.exports = () => (
  <footer class="mt-auto border-top" style="padding-block: 2rem">
    <div
      class="container d-flex align-items-center flex-column flex-md-row"
      style="max-width: 900px"
    >
      <a
        href="/"
        class="me-2 mb-2 mb-md-0 text-muted text-decoration-none lh-1"
      >
        <img
          src="/assets/elrod.png"
          alt="Homepage"
          height="30"
          style="filter: grayscale(1); opacity: 0.8"
        />
      </a>

      <div class="mb-3 mb-md-0 text-secondary text-center">
        ©&nbsp;1967–present Brown&nbsp;University&nbsp;Band
      </div>

      <ul class="nav list-unstyled justify-content-center justify-content-md-end d-flex flex-fill">
        <li class="ms-md-4">
          <a
            class="link-secondary"
            href="https://twitter.com/BrownUBandStand"
            aria-label="Twitter"
          >
            <Icon name="twitter" />
          </a>
        </li>
        <li class="ms-5 ms-md-4">
          <a
            class="link-secondary"
            href="https://instagram.com/brownbandstagram/"
            aria-label="Instagram"
          >
            <Icon name="instagram" />
          </a>
        </li>
        <li class="ms-5 ms-md-4">
          <a
            class="link-secondary"
            href="https://facebook.com/BrownBand"
            aria-label="Facebook"
          >
            <Icon name="facebook" />
          </a>
        </li>
      </ul>
    </div>
  </footer>
);