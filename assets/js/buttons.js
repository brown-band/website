const modal = new bootstrap.Modal(buttonLightbox);

document.addEventListener("click", (event) => {
  if (event.currentTarget.className == "button-link") {
    event.preventDefault();
    const link =
      event.currentTarget.dataset.thumbnail || event.currentTarget.src;
    buttonLightboxImage.addEventListener("error", () => {
      location.href = link;
    });
    buttonLightboxImage.src = link;
    buttonLightboxLink.href = event.currentTarget.href;
    buttonLightboxImage.alt =
      event.currentTarget.textContent || event.target.alt;
    modal.show();
  }
});
