const { createElement } = require("eleventy-hast-jsx");

const ButtonTable = require("../components/ButtonTable");

exports.data = {
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

const toplink = (
  <a href="#" style="float: right" class="h5 my-0 mt-2">
    top ↑
  </a>
);

exports.default = ({ buttons, specialButtons }) => (
  <>
    <h2 id="current">{buttons.currentYear} Season</h2>
    <p>
      <em>
        The current season's buttons are displayed below. They are only released
        the Tuesday before the football game! Don't forget to get your hands on
        one before they are all gone.
      </em>
    </p>
    <table class="table table-sm">
      <thead>
        <tr>
          <th class="pe-3" style="text-align: right">
            School
          </th>
          <th>Button</th>
        </tr>
      </thead>
      <tbody>
        {buttons.currentYearButtons.map((button) => (
          <tr>
            <td class="align-middle pe-3" style="text-align: right">
              <a
                href={`#${button.schoolId}`}
                style={`font-size: 1.25em; font-weight: bold; color: ${
                  buttons.schools[button.schoolId].color === "black"
                    ? "inherit"
                    : buttons.schools[button.schoolId].color
                }`}
              >
                {button.school}
              </a>
            </td>
            <td>
              <a href={button.image}>
                <img
                  alt={button.label}
                  title={button.label}
                  src={button.image}
                  width="100"
                  height="100"
                  style="border-radius: 50%"
                />
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2 id="ivies">Ivy League: Past Seasons {toplink}</h2>
    {buttons.bySchool.ivy.map((button) => (
      <ButtonTable {...button} />
    ))}

    <h2 id="recent">Recent Seasons: Other Schools {toplink}</h2>
    {buttons.bySchool.recent.map((button) => (
      <ButtonTable {...button} />
    ))}

    <h2 id="other">Past Seasons: Other Schools {toplink}</h2>
    {buttons.bySchool.other.map((button) => (
      <ButtonTable {...button} />
    ))}

    <h2 id="special">Special Buttons {toplink}</h2>
    <table class="table table-sm">
      <thead>
        <tr>
          <th>Year</th>
          <th>School</th>
          <th>Button</th>
        </tr>
      </thead>
      <tbody>
        {specialButtons.map((button) => (
          <tr>
            <td>{button.year}</td>
            <td>{button.school}</td>
            <td>
              <a href={button.image}>{button.label}</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2 id="unknown">Secret Mystery Buttons</h2>
    <em>if you know what year these are please tell us &lt;3</em>
    <table class="table table-sm">
      <thead>
        <tr>
          <th>Year/School</th>
          <th>Button</th>
        </tr>
      </thead>
      <tbody>
        {buttons.unknown.map((button) => (
          <tr>
            <td>{button.about}</td>
            <td>
              {button.image ? (
                <a href={button.image}>{button.label}</a>
              ) : (
                button.label
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
