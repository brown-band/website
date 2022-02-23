const { createElement } = require("eleventy-hast-jsx");

exports.data = {
  summary:
    "The Brown Band shows possess a unique satirical humor that only could come from the twisted minds of our members. Although many hours of brainstorming go into each script, the true talent behind our show is our scriptwriters. Pay attention to the names that appear on the season’s page! So if you are ready, choose a season below.",
};

exports.default = ({ scripts }) => (
  <>
    <p class="alert alert-warning" role="alert">
      <strong>Please note</strong>: The Brown Band has been writing scripts for
      over 60 years. Over this time, cultural norms have changed significantly.
      We recognize that some of the humor in our scripts goes beyond “edgy” and
      is at times discriminatory or otherwise highly offensive. We’ve decided to
      leave the scripts unchanged — typos included — as a part of an honest
      historical record. Don’t let this scare you away, though. Check out our
      more recent scripts and consider becoming a scriptwriter yourself!
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
                <a class="btn btn-link fw-bold" href={"/" + year.fall}>
                  Fall
                </a>
              )}
            </td>
            <td class="fw-bold py-0">
              {year.spring && (
                <a class="btn btn-link fw-bold" href={"/" + year.spring}>
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
