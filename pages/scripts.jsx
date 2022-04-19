exports.data = {
  summary:
    "The Brown Band shows possess a unique satirical humor that only could come from the twisted minds of our members. Although many hours of brainstorming go into each script, the true talent behind our show is our scriptwriters. Pay attention to the names that appear on the season’s page! So if you are ready, choose a season below.",
};

exports.default = async ({ collections, scripts, buttons }) => {
  const { groups, reverse } = await import("d3-array");

  const button = "btn btn-link fw-bold px-2 py-1";

  const thisYear = scripts.years[scripts.years.length - 1];

  const categories = require("./script-utils").categorizeByOpponent(
    collections.script,
    scripts
  );

  const countScripts = (name) => (
    <span class="text-muted ps-1">
      ({categories[name].scripts.length} script
      {categories[name].scripts.length === 1 ? "" : "s"})
    </span>
  );

  const fallSpring = (year) => [
    year.fall ? (
      <a class={button} href={"/" + year.fall}>
        Fall
      </a>
    ) : (
      <button class={button} style="opacity: 0.4" disabled>
        Fall
      </button>
    ),
    year.spring ? (
      <a class={button} href={"/" + year.spring}>
        Spring
      </a>
    ) : (
      <button class={button} style="opacity: 0.4" disabled>
        Spring
      </button>
    ),
  ];

  return (
    <>
      <h3>Check out this year’s scripts!</h3>
      {thisYear.fall && (
        <a
          class="btn btn-link btn-lg px-0 text-decoration-none"
          href={"/" + thisYear.fall}
        >
          <u>Fall</u> →
        </a>
      )}
      {thisYear.spring && (
        <p>
          <a
            class="btn btn-link btn-lg px-0 text-decoration-none"
            href={"/" + thisYear.spring}
          >
            <u>Spring</u> →
          </a>
        </p>
      )}

      <h2>Script Archive</h2>

      <p class="alert alert-warning mt-2" role="alert">
        <strong>Please note</strong>: The Brown Band has been writing scripts
        for over 60 years. Over this time, cultural norms have changed
        significantly. We recognize that some of the humor in our scripts goes
        beyond “edgy” and is at times discriminatory or otherwise highly
        offensive. We’ve decided to leave the scripts unchanged — typos included
        — as a part of an honest historical record. Don’t let this scare you
        away, though. Check out our more recent scripts and consider becoming a
        scriptwriter yourself!
      </p>

      <h3 id="years">Scripts By Year</h3>

      <dl class="index-list">
        {groups(reverse(scripts.years).slice(1), (d) => d.year.slice(0, 3)).map(
          ([decade, years], i) => (
            <div>
              <dt>{decade}0s</dt>
              {reverse(years).map((year) => (
                <dd>
                  <span style="font-family: var(--bs-font-sans-serif); font-variant: tabular-nums">
                    {year.year}
                  </span>
                  : {fallSpring(year)}
                </dd>
              ))}
            </div>
          )
        )}
      </dl>

      <h3 id="categories">Scripts By Opponent/Occasion</h3>

      <dl class="index-list">
        <div>
          <dt>Special Events</dt>
          <dd>
            <a href="/scripts/adoch/">ADOCH</a>
            {countScripts("ADOCH")}
          </dd>
          <dd>
            <a href="/scripts/stealth-show/">Stealth Show</a>
            {countScripts("Stealth Show")}
          </dd>
          <dd>
            <a href="/scripts/other/">Everything Else</a>
            {countScripts("Other")}
          </dd>
        </div>
        <div>
          <dt>Ivies</dt>
          {buttons.bySchool.ivy
            .filter(
              (school) =>
                !["brown", "hockey", "family-weekend", "caroling"].includes(
                  school.id
                )
            )
            .map((school) => (
              <dd>
                <a href={"/scripts/" + school.id}>{school.name}</a>
                <span class="text-muted ps-1">
                  ({categories[school.name].scripts.length} script
                  {categories[school.name].scripts.length === 1 ? "" : "s"})
                </span>
              </dd>
            ))}
        </div>
        <div>
          <dt>Recent</dt>
          {buttons.bySchool.recent
            .filter((school) => Object.keys(categories).includes(school.name))
            .sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            )
            .map((school) => (
              <dd>
                <a href={"/scripts/" + school.id}>{school.name}</a>
                {countScripts(school.name)}
              </dd>
            ))}
        </div>
        <div>
          <dt>Others</dt>
          {Object.keys(categories)
            .filter(
              (id) =>
                !buttons.bySchool.ivy.some((s) => s.name === id) &&
                !buttons.bySchool.recent.some((s) => s.name === id) &&
                !["ADOCH", "Stealth Show", "Other"].includes(id)
            )
            .sort(
              (a, b) =>
                categories[b].scripts[
                  categories[b].scripts.length - 1
                ].script.date.getFullYear() -
                  categories[a].scripts[
                    categories[a].scripts.length - 1
                  ].script.date.getFullYear() ||
                a.toLowerCase().localeCompare(b.toLowerCase())
            )
            .map((school) => (
              <dd>
                <a href={"/scripts/" + categories[school].slug}>
                  {categories[school].title}
                </a>
                <span class="text-muted ps-1">
                  (
                  {categories[school].scripts[
                    categories[school].scripts.length - 1
                  ].script.date.getFullYear()}
                  , {countScripts(school).children.slice(1, -1)})
                </span>
              </dd>
            ))}
        </div>
      </dl>
    </>
  );
};
