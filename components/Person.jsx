const { createElement } = require("eleventy-hast-jsx");
const slugify = require("@sindresorhus/slugify");
const Markdown = require("./Markdown");

module.exports = async ({ even, person }) => (
  <>
    {!even && (
      <img
        class="headshot shadow"
        src={`/assets/people/${slugify(person.name)}.jpg`}
        width="130"
        style="float: right"
      />
    )}

    <h3 class="h5">
      {person.position.sec ? (
        <a href={"/constitution#" + person.position.sec}>
          {person.position.name}
        </a>
      ) : (
        person.position
      )}
      {": "}
      <a href={"mailto:" + person.email}>{person.name}</a>&nbsp;
      {person.link ? (
        <a href={person.link} style="text-decoration: none; color: inherit">
          '
        </a>
      ) : (
        "'"
      )}
      {person.year}
    </h3>

    {even && (
      <img
        class="headshot shadow"
        src={`/assets/people/${slugify(person.name)}.jpg`}
        width="130"
        style="float: left"
      />
    )}

    {await (<Markdown content={person.position.role} />)}

    {await (<Markdown content={person.bio} />)}

    <div style="clear: both; padding-bottom: 2rem"></div>
  </>
);
