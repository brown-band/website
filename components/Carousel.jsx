const fs = require("node:fs/promises");
const path = require("node:path");

const { createElement } = require("eleventy-hast-jsx");

module.exports = async ({ folder, delay = 7e3, fade = 0.15 }) => {
  const carouselDir = path.join(__dirname, "..", "assets", "carousels", folder);
  const images = await fs.readdir(carouselDir);
  const css = String.raw;
  return (
    <>
      <link rel="stylesheet" href="/assets/css/carousel.css" />
      <style>{css`
        @keyframes carousel-${folder} {
          0% {
            opacity: 0;
          }
          ${(100 / images.length) * fade}% {
            opacity: 1;
          }
          ${100 / images.length}% {
            opacity: 1;
          }
          ${(100 / images.length) * (1 + fade)}% {
            opacity: 0;
          }
        }
      `}</style>
      <p class="carousel">
        {images.map((image, i) => (
          <img
            src={"/assets/carousels/" + folder + "/" + image}
            style={css`
              opacity: 0;
              animation-duration: ${delay * images.length}ms;
              animation-iteration-count: infinite;
              animation-delay: ${i * delay}ms;
              animation-name: carousel-${folder};
              pointer-events: none;
            `}
          />
        ))}
      </p>
    </>
  );
};
