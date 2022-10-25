const modal = new bootstrap.Modal(buttonLightbox);

document.addEventListener("click", (event) => {
  if (
    event.target.className == "button-link" ||
    event.target.parentNode.className == "button-link"
  ) {
    const button =
      event.target.className == "button-link"
        ? event.target
        : event.target.parentNode;
    event.preventDefault();
    buttonLightboxImage.addEventListener("error", () => {
      location.href = button.href;
    });
    buttonLightboxImage.src = button.dataset.thumbnail;
    buttonLightboxLink.href = button.href;
    buttonLightboxImage.alt = event.target.textContent || event.target.alt;
    modal.show();
  }
});
