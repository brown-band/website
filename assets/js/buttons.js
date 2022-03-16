const modal = new bootstrap.Modal(buttonLightbox);

document.addEventListener("click", (event) => {
  if (event.target.className == "button-link") {
    event.preventDefault();
    const image = buttonLightbox.querySelector("img");
    image.addEventListener("load", () => {
      modal.show();
    });
    image.addEventListener("error", () => {
      location.href = event.target.href;
    });
    image.src = event.target.href;
    image.alt = event.target.textContent;
  }
});
