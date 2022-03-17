exports.data = {
  title: "The Bandstand",
};

exports.default = async ({ bandstands }) => {
  const { groups, reverse } = await import("d3-array");
  const href = (type, { volume, issue }) =>
    `https://students.brown.edu/band/the-bandstand/${type}/${volume}-${issue}.pdf`;
  const Link = ({ type, to: issue }) => (
    <a href={href(type, issue)}>
      {issue.issue}
      {" • "}
      {issue.date}
    </a>
  );

  return (
    <>
      <p>
        …is the Band’s alumni newsletter. Lovingly composed from time to time by
        our ALs, it keeps our crusties up-to-date on the latest developments —
        musical and otherwise — of our esteemed organization.
      </p>

      <p>
        <a
          class="btn btn-link btn-lg px-0 text-decoration-none"
          href={href("new", bandstands.new[bandstands.new.length - 1])}
        >
          <u>
            Read the latest Bandstand (
            {bandstands.new[bandstands.new.length - 1].date})
          </u>{" "}
          →
        </a>
      </p>

      <h2 id="new">
        21<sup>st</sup>-century Bandstands
      </h2>
      <dl class="index-list">
        {reverse(groups(bandstands.new, (d) => d.volume)).map(
          ([volume, issues]) => (
            <div>
              <dt>Volume {volume}</dt>
              {issues.map((issue) => (
                <dd>
                  <Link type="new" to={issue} />
                </dd>
              ))}
            </div>
          )
        )}
      </dl>

      <h2 id="old">
        20<sup>th</sup>-century Bandstands
      </h2>
      <dl class="index-list">
        {groups(bandstands.old, (d) => d.volume).map(([volume, issues]) => (
          <div>
            <dt>Volume {volume}</dt>
            {issues.map((issue) => (
              <dd>
                <Link type="old" to={issue} />
              </dd>
            ))}
          </div>
        ))}
      </dl>
      <p>
        Do you have an issue of Bandstand that isn’t listed above? Send it to
        the webmasters and we can add it!
      </p>
    </>
  );
};
