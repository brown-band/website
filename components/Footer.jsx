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
        <SocialLink
          href="https://github.com/brown-band"
          label="GitHub"
          icon="github"
          isFirst
        />
        <SocialLink
          href="https://twitter.com/BrownUBandStand"
          label="Twitter"
          icon="twitter"
        />
        <SocialLink
          href="https://instagram.com/brownbandstagram/"
          label="Instagram"
          icon="instagram"
        />
        <SocialLink
          href="https://facebook.com/BrownBand"
          label="Facebook"
          icon="facebook"
        />
        <SocialLink
          href="https://www.youtube.com/user/BrownUBandstand"
          label="YouTube"
          icon="youtube"
          size={28}
        />
      </ul>
    </div>
  </footer>
);

function SocialLink({ label, href, icon, size, isFirst }) {
  return (
    <li class={isFirst ? "ms-md-4" : "ms-4 ms-sm-5 ms-md-4"}>
      <a class="link-secondary" href={href} aria-label={label}>
        <Icon name={icon} size={size} />
      </a>
    </li>
  );
}
