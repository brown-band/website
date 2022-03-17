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
        …is the Band’s alumni newsletter. It has had two eras of production: the
        first era is called “Before Current Century” by the people (who{" "}
        <em>definitely</em> exist) that study the Band professionally, and the
        second era is called “After Printing’s Rebirth” by those same scholars.
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

      <h2 id="old">Before Current Century</h2>
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
