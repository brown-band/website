const fs = require("node:fs/promises");
const path = require("node:path");

const { createElement } = require("eleventy-hast-jsx");

const carouselDir = path.join(__dirname, "..", "assets", "carousels");

module.exports = async ({ folder, delay = 7e3 }) => {
  const images = await fs.readdir(path.join(carouselDir, folder));
  const id = `${folder}-carousel-${Math.random().toString(36).slice(2)}`;
  return (
    <>
      <link rel="stylesheet" href="/assets/css/carousel.css" />
      <div
        class="carousel slide carousel-fade my-3"
        id={id}
        data-ride="carousel"
        data-interval={delay}
      >
        <div class="carousel-inner">
          {images.map((image, i) => (
            <div class={"carousel-item" + (i == 0 ? " active" : "")}>
              <img
                src={"/assets/carousels/" + folder + "/" + image}
                class="d-block w-100"
              />
            </div>
          ))}
        </div>

        <CarouselControl direction="prev" title="Previous" target={id} />
        <CarouselControl direction="next" title="Next" target={id} />
      </div>
    </>
  );
};

function CarouselControl({ direction, title, target }) {
  return (
    <button
      class={`carousel-control-${direction}`}
      type="button"
      data-bs-target={`#${target}`}
      data-bs-slide={direction}
    >
      <span class={`carousel-control-${direction}-icon`} aria-hidden="true" />
      <span class="visually-hidden">{title}</span>
    </button>
  );
}
