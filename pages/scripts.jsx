exports.data = {
  summary:
    "The Brown Band shows possess a unique satirical humor that only could come from the twisted minds of our members. Although many hours of brainstorming go into each script, the true talent behind our show is our scriptwriters. Pay attention to the names that appear on the season’s page! So if you are ready, choose a season below.",
};

exports.default = async ({ scripts }) => {
  const { groups, reverse } = await import("d3-array");

  const button = "btn btn-link fw-bold px-2 py-1";
  const style = "color: var(--bs-body-color); border: none;";

  const thisYear = scripts.years[scripts.years.length - 1];

  const fallSpring = (year) => [
    year.fall ? (
      <a class={button} style={style} href={"/" + year.fall}>
        Fall
      </a>
    ) : (
      <button class={button} style={style + "opacity: 0.4"} disabled>
        Fall
      </button>
    ),
    year.spring ? (
      <a class={button} style={style} href={"/" + year.spring}>
        Spring
      </a>
    ) : (
      <button class={button} style={style + "opacity: 0.4"} disabled>
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
    </>
  );
};
