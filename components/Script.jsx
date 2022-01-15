const { createElement, Raw } = require("eleventy-hast-jsx");

const slugify = require("@sindresorhus/slugify");
const formatDate = require("date-fns-tz/formatInTimeZone");

const SchoolName = ({ team: { name, score }, schoolColors }) => (
  <>
    <span
      class="school-color"
      style={`color: ${schoolColors[slugify(name)]?.color ?? "salmon"}`}
    >
      {name}
    </span>
    {score && <small style="font-size: 2rem">({score})</small>}
  </>
);

exports.default = ({
  script: { fileSlug, data, date, templateContent },
  idPrefix = "",
  schoolColors,
}) => (
  <article>
    <header style="text-align: center">
      <h1 class="display-5 fw-normal" id={idPrefix + fileSlug}>
        {data.teams?.home ? (
          <>
            <SchoolName team={data.teams.away} schoolColors={schoolColors} />{" "}
            <em style="font-size: 0.8em">{data.location ? "vs" : "at"}</em>{" "}
            <SchoolName team={data.teams.home} schoolColors={schoolColors} />
          </>
        ) : data.opponent ? (
          <>
            // when we don’t know home/away or scores
            <SchoolName team={{ name: "Brown" }} schoolColors={schoolColors} />
            <em style="font-size: 0.8em">vs</em>
            <SchoolName
              team={{ name: data.opponent }}
              schoolColors={schoolColors}
            />
          </>
        ) : (
          data.title
        )}
        {data.title.startsWith("Fall") && data.sport === "hockey" && "(Hockey)"}
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
