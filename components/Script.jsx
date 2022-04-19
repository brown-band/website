const { Raw } = require("eleventy-hast-jsx");

const slugify = require("@sindresorhus/slugify");
const formatDate = require("date-fns-tz/formatInTimeZone");
const {
  defaultMaxListeners,
} = require("@11ty/eleventy/src/Util/AsyncEventEmitter");

/**
 * @param {Object} props
 * @param {Object} props.script a Page object from Eleventy.
 * See the README for info about the data format for scripts.
 * @param {Object} props.buttons `buttons.byYear` from global data
 * @param {Object} props.semester An entry from the global semesters array.
 * @param {Object} props.schoolColors from `data/schoolColors.yml`
 * @param {string} [props.id] an alternate ID to use for the script.
 * @param {string} [props.idPrefix] a prefix to add to the ID of the heading
 */
exports.default = ({
  urls,
  script: { fileSlug, data, date, templateContent },
  buttons,
  semester,
  schoolColors,
  id = fileSlug,
  idPrefix = "",
}) => (
  <article>
    <header style="text-align: center">
      {buttons && (
        <ButtonImage
          urls={urls}
          buttons={buttons}
          name={fileSlug}
          semester={semester}
        />
      )}
      <h1 class="display-5 fw-normal" id={idPrefix + id}>
        <ScriptTitle
          script={data}
          fileSlug={fileSlug}
          semester={semester}
          schoolColors={schoolColors}
        />
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
      {data.iceShowTheme && <h4>{data.iceShowTheme} Ice Show</h4>}
      <h3>{formatDate(date, "UTC", "EEEE, MMMM do, y")}</h3>
      {fileSlug.endsWith("-censored") && (
        <h4>
          <span class="script-censored">CENSORED</span>
        </h4>
      )}
    </header>
    <Raw html={templateContent} />
  </article>
);

function SchoolName({ team: { name, score }, schoolColors, inToc }) {
  const nameSlug = slugify(name, {
    decamelize: false,
    customReplacements: [["’", ""]],
  });
  return (
    <>
      <span
        class="school-color"
        style={`color: ${
          inToc && name === "Brown"
            ? "inherit"
            : schoolColors[nameSlug]?.color ?? "salmon; " + nameSlug
        }`}
      >
        {name}
      </span>
      {score != null && (
        <span style="font-size: 0.66em">
          {"\xA0"}({score})
        </span>
      )}
    </>
  );
}

exports.ScriptTitle = ScriptTitle;
function ScriptTitle({
  script: { teams, location, opponent, title, sport },
  fileSlug,
  semester,
  schoolColors,
  inToc = false,
}) {
  const Location = inToc ? "span" : "em";
  return (
    <>
      {teams?.home && !inToc ? (
        <>
          <SchoolName team={teams.away} schoolColors={schoolColors} />
          <Location style="font-size: 0.8em">
            {location ? " vs " : " at "}
          </Location>
          <SchoolName team={teams.home} schoolColors={schoolColors} />
        </>
      ) : opponent ? (
        <>
          {/* when we don’t know home/away or scores */}
          <SchoolName
            team={{ name: opponent }}
            schoolColors={schoolColors}
            inToc={inToc}
          />
          <Location style="font-size: 0.8em"> vs </Location>
          <SchoolName
            team={{ name: "Brown" }}
            schoolColors={schoolColors}
            inToc={inToc}
          />
        </>
      ) : (
        title
      )}
      {semester.semester === "fall" && sport === "hockey" && " (Hockey)"}
      {inToc && fileSlug.endsWith("-censored") && <small> [censored]</small>}
    </>
  );
}

function ButtonImage({ urls, buttons, name, semester }) {
  const image = `${urls.buttons}/${semester.years}/${name}.png`;
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
