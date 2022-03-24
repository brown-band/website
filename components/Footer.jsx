const Icon = require("./Icon.jsx");

module.exports = async () => (
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
          src="/assets/images/elrod-nav@3x.png"
          alt="Homepage"
          width="30"
          height="30"
          style="filter: grayscale(1); opacity: 0.8"
        />
      </a>

      <div class="mb-3 mb-md-0 text-secondary text-center">
        ©&nbsp;1955–present Brown&nbsp;University&nbsp;Band&nbsp;members
      </div>

      <ul class="nav list-unstyled justify-content-center justify-content-md-end d-flex flex-fill">
        <li class="ms-md-4">
          <a
            class="link-secondary"
            href="https://github.com/brown-band"
            aria-label="GitHub"
          >
            <Icon name="github" />
          </a>
        </li>
        <li class="ms-4 ms-sm-5 ms-md-4">
          <a
            class="link-secondary"
            href="https://twitter.com/BrownUBandStand"
            aria-label="Twitter"
          >
            <Icon name="twitter" />
          </a>
        </li>
        <li class="ms-4 ms-sm-5 ms-md-4">
          <a
            class="link-secondary"
            href="https://instagram.com/brownbandstagram/"
            aria-label="Instagram"
          >
            <Icon name="instagram" />
          </a>
        </li>
        <li class="ms-4 ms-sm-5 ms-md-4">
          <a
            class="link-secondary"
            href="https://facebook.com/BrownBand"
            aria-label="Facebook"
          >
            <Icon name="facebook" />
          </a>
        </li>
        <li class="ms-4 ms-sm-5 ms-md-4">
          <a
            class="link-secondary"
            href="https://www.youtube.com/user/BrownUBandstand"
            aria-label="YouTube"
          >
            <Icon name="youtube" size={28} />
          </a>
        </li>
      </ul>
    </div>
  </footer>
);
