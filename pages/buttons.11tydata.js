module.exports = {
  summary: `
    It just wouldn't be complete if we cheered on the Bears without paying our
    due respects to the opposition. Hence, we have the infamous buttons, a
    different set for each football game (plus a special one for homecoming)
    churned out every year. The Band proudly wears them, and we pass them out
    for free to anyone at the football game who wants one!
  `
    .trim()
    .replaceAll(/\n\s+/g, " "),
  eleventyComputed: {
    toc: (data) => [
      { id: "current", value: "Current Season" },
      {
        id: "ivies",
        value: "Ivies",
        children: data.buttons.bySchool.ivy.map((s) => ({
          id: s.id,
          value: s.name,
        })),
      },
      {
        id: "recent",
        value: "Recent",
        children: data.buttons.bySchool.recent.map((s) => ({
          id: s.id,
          value: s.name,
        })),
      },
      { id: "other", value: "Other Schools" },
      { id: "special", value: "Special Buttons" },
      { id: "unknown", value: "Secret Mystery Buttons" },
    ],
  },
};
