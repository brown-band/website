const { createElement } = require("eleventy-hast-jsx");

exports.data = {
  summary:
    "The Brown Band shows possess a unique satirical humor that only could come from the twisted minds of our members. Although many hours of brainstorming go into each script, the true talent behind our show is our scriptwriters. Pay attention to the names that appear on the season’s page! So if you are ready, choose a season below.",
};

exports.default = ({ scripts }) => (
  <>
    <p class="alert alert-warning" role="alert">
      <strong>Please note</strong>: As with any organization, the culture of the
      Brown Band has changed over the years and as such, the content of the
      scripts has evolved to reflect this change. The band strives to be a
      welcoming, diverse and thoughtful community and the current band members
      do not condone any scripts that appear contrary to this goal.
    </p>

    <table
      class="table table-striped table-sm text-center"
      style="width: 250px"
    >
      <thead>
        <tr>
          <th>Year</th>
          <th colspan="2">Scripts</th>
        </tr>
      </thead>
      <tbody>
        {[...scripts.years].reverse().map((year) => (
          <tr>
            <td class="py-0 align-middle">{year.year}</td>
            <td class="fw-bold py-0">
              {year.fall && (
                <a
                  class="btn btn-link fw-bold"
                  href={`/scripts/${year.year}/fall`}
                >
                  Fall
                </a>
              )}
            </td>
            <td class="fw-bold py-0">
              {year.spring && (
                <a
                  class="btn btn-link fw-bold"
                  href={`/scripts/${year.year}/spring`}
                >
                  Spring
                </a>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
