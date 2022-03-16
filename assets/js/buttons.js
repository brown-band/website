const modal = new bootstrap.Modal(buttonLightbox);

document.addEventListener("click", (event) => {
  if (
    event.target.className == "button-link" ||
    event.target.parentNode.className == "button-link"
  ) {
    event.preventDefault();
    const link = event.target.href || event.target.src;
    buttonLightboxImage.addEventListener("error", () => {
      location.href = link;
    });
    buttonLightboxImage.src = link;
    buttonLightboxLink.href = link;
    buttonLightboxImage.alt = event.target.textContent || event.target.alt;
    modal.show();
  }
});
