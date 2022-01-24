const { createElement, Raw } = require("eleventy-hast-jsx");

const slugify = require("@sindresorhus/slugify");
const formatDate = require("date-fns-tz/formatInTimeZone");

/**
 * @param {Object} props
 * @param {Object} props.script a Page object from Eleventy.
 * See the README for info about the data format for scripts.
 * @param {Object} props.buttons `buttons.byYear` from global data
 * @param {Object} props.semester An entry from the global semesters array.
 * @param {Object} props.schoolColors from `data/schoolColors.yml`
 * @param {string} [props.idPrefix] a prefix to add to the ID of the heading
 */
exports.default = ({
  script: { fileSlug, data, date, templateContent },
  buttons,
  semester,
  schoolColors,
  idPrefix = "",
}) => (
  <article>
    <header style="text-align: center">
      {buttons && (
        <ButtonImage buttons={buttons} name={fileSlug} semester={semester} />
      )}
      <h1 class="display-5 fw-normal" id={idPrefix + fileSlug}>
        {data.teams?.home ? (
          <>
            <SchoolName team={data.teams.away} schoolColors={schoolColors} />
            <em style="font-size: 0.8em">{data.location ? " vs " : " at "}</em>
            <SchoolName team={data.teams.home} schoolColors={schoolColors} />
          </>
        ) : data.opponent ? (
          <>
            {/* when we don’t know home/away or scores */}
            <SchoolName team={{ name: "Brown" }} schoolColors={schoolColors} />
            <em style="font-size: 0.8em"> vs </em>
            <SchoolName
              team={{ name: data.opponent }}
              schoolColors={schoolColors}
            />
          </>
        ) : (
          data.title
        )}
        {semester.semester === "fall" && data.sport === "hockey" && " (Hockey)"}
      </h1>
      {data.location && (
        <h2>
          <em>at</em> <Raw html={data.location} />
        </h2>
      )}
      {data.subtitle && (
        <h2>
          <em>
            <Raw html={data.subtitle} />
          </em>
        </h2>
      )}
      <h3>{formatDate(date, "UTC", "EEEE, MMMM do, y")}</h3>
    </header>
    <Raw html={templateContent} />
  </article>
);

function SchoolName({ team: { name, score }, schoolColors }) {
  return (
    <>
      <span
        class="school-color"
        style={`color: ${
          schoolColors[slugify(name, { decamelize: false })]?.color ?? "salmon"
        }`}
      >
        {name}
      </span>
      {score != null && (
        <span style="font-size: 2rem">
          {"\xA0"}({score})
        </span>
      )}
    </>
  );
}

function ButtonImage({ buttons, name, semester }) {
  const image = `/buttons/${semester.years}/${name}.jpg`;
  const alt = buttons[semester.years]?.find((b) => b.schoolId === name)?.label;
  return (
    semester.semester === "fall" &&
    alt && (
      <a href={image}>
        <img
          src={image}
          alt={alt}
          class="semester-button"
          onerror="this.parentNode.remove()"
        />
      </a>
    )
  );
}
