const Icon = require("../components/Icon");

exports.data = {
  permalink: "/buttons/by-year/",
  summary:
    "You’ll probably want to peruse <a href='/buttons/'>the main buttons page</a>, as it is much better organized.",
};

const toplink = (
  <a href="#" style="float: right" class="h5 my-0 mt-2">
    top ↑
  </a>
);

exports.default = ({ buttons, site: { urls }, schoolColors }) => (
  <>
    <style>
      {`
        .school-name {
          font-weight: bold;
          /* text-shadow: ${[-0.5, 0, 0.5]
            .flatMap((dx) =>
              [-0.5, 0, 0.5].map((dy) => `${dx}px ${dy}px 0px white`)
            )
            .join(", ")}; */
        }
        [data-bs-theme="dark"] .school-name {
          color: white !important;
        }
      `}
    </style>
    {Object.entries(buttons.byYear).map(([year, buttons]) => (
      <>
        <h2 class="h3">
          {year} ({buttons.length})
        </h2>
        <table class="table table-sm">
          <tbody>
            {buttons.map((button) => (
              <tr>
                <td
                  class="school-name"
                  style={`color: ${
                    schoolColors[button.schoolId].color
                  }; width: 114px`}
                >
                  {button.school}
                </td>
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
    ))}

    {/* todo: use this from the main buttons page */}
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
