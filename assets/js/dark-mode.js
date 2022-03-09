const media = matchMedia("(prefers-color-scheme: dark)");
const update = () => {
  document.documentElement.dataset.theme = media.matches ? "dark" : "light";
};
update();

media.addEventListener("change", update);
