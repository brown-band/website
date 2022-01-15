const { createElement } = require("eleventy-hast-jsx");
const Markdown = require("./Markdown");

module.exports = async ({ sections }) => (
  <table class="table">
    {
      await Promise.all(
        sections.flatMap((section) =>
          section.people.map(async (person, i) => (
            <tr>
              <th class="people-table-head">
                {i === 0 && (await (<Markdown content={section.name} />))}
              </th>
              <td>
                <a href={"mailto:" + person.email}>{person.name}</a> '
                {person.year}
              </td>
            </tr>
          ))
        )
      )
    }
  </table>
);
