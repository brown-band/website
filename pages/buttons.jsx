const Icon = require("../components/Icon");

exports.data = {
  summary: `
    It just wouldn’t be complete if we cheered on the Bears without paying our
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

exports.default = ({ buttons, specialButtons, site: { urls } }) => (
  <>
    <h2 id="current">{buttons.currentYear} Season</h2>
    <p>
      The current season’s buttons are displayed below. They are only released
      the Tuesday before the football game! Don’t forget to get your hands on
      one before they are all gone.
    </p>
    <table class="table table-sm">
      <tbody>
        {buttons.currentYearButtons.map((button) => (
          <tr>
            <td class="align-middle pe-3" style="text-align: right; width: 50%">
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
              <a
                class="button-link"
                href={`${urls.buttons}/${button.image}`}
                data-thumbnail={`${urls.buttons}/${button.thumbnail}`}
              >
                <img
                  alt={button.label}
                  title={button.label}
                  src={`${urls.buttons}/${button.thumbnail}`}
                  width="100"
                  height="100"
                  class="rounded-circle my-3"
                />
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2 id="ivies">Ivy League: Past Seasons {toplink}</h2>
    {buttons.bySchool.ivy.map((school) => (
      <ButtonTable school={school} urls={urls} />
    ))}

    <h2 id="recent">Recent Seasons: Other Schools {toplink}</h2>
    {buttons.bySchool.recent.map((school) => (
      <ButtonTable school={school} urls={urls} />
    ))}

    <h2 id="other">Past Seasons: Other Schools {toplink}</h2>
    {buttons.bySchool.other.map((school) => (
      <ButtonTable school={school} urls={urls} />
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
      <tbody class="table-group-divider">
        {specialButtons.map((button) => (
          <tr>
            <td>{button.year}</td>
            <td>{button.school}</td>
            <td>
              <a
                class="button-link"
                href={`${urls.buttons}/${button.image}`}
                data-thumbnail={`${urls.buttons}/${button.thumbnail}`}
              >
                {button.label}
              </a>
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
      <tbody class="table-group-divider">
        {buttons.unknown.map((button) => (
          <tr>
            <td>{button.about}</td>
            <td>
              {button.image ? (
                <a
                  class="button-link"
                  href={`${urls.buttons}/${button.image}`}
                  data-thumbnail={`${urls.buttons}/${button.thumbnail}`}
                >
                  {button.label}
                </a>
              ) : (
                button.label
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <p class="fst-italic">
      See also the <a href="/buttons/by-year/">year-by-year archive</a>.
    </p>

    <div
      class="modal fade zoom"
      id="buttonLightbox"
      tabindex="-1"
      aria-labelledby="buttonLightboxImage"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <button
            type="button"
            class="btn-close position-absolute top-0 end-0 p-3"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
          <img
            src=""
            alt=""
            id="buttonLightboxImage"
            class="m-1"
            style="max-height: calc(100vh - 4rem - 2px); object-fit: contain;"
          />
          <a
            class="btn-close position-absolute bottom-0 end-0 p-3"
            id="buttonLightboxLink"
            href="#"
            style="background: none"
            target="_blank"
          >
            <Icon name="external-link" />
          </a>
        </div>
      </div>
    </div>

    <script async src="/assets/js/buttons.js" />
  </>
);

function ButtonTable({ school: { id, name, mascot, buttons, color }, urls }) {
  return (
    <>
      <a name={id} />
      <table class="table table-sm">
        <thead class={buttons.length > 10 ? "sticky-top" : null}>
          <tr>
            <th
              colspan="2"
              style={`color: white; background-color: ${color}; text-align: center`}
            >
              {name}
              {mascot && `: ${mascot}`}
            </th>
          </tr>
        </thead>
        <tbody>
          {buttons.map((button, i) => (
            <tr>
              <td style={i === 0 ? "width: 50px" : null}>{button.year}</td>
              <td>
                {button.image ? (
                  <a
                    class="button-link"
                    href={`${urls.buttons}/${button.image}`}
                    data-thumbnail={`${urls.buttons}/${button.thumbnail}`}
                  >
                    {button.label}
                  </a>
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
}
