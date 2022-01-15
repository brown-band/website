const { createElement } = require("eleventy-hast-jsx");
const Markdown = require("../components/Markdown");
const PeopleTable = require("../components/PeopleTable");
const Person = require("../components/Person");

const intro = `
The **Band Board** is a six-member elected delegation of band members who manage both the behind-the-scenes and public day to day operations of the Band. The Band Board is elected for a one-year term that begins and ends at halftime at the last football game in November. If a position becomes vacant mid-term, that position is filled via a special election as soon as it is feasible. Specifics on election policy can be found in our bland yet informative [constitution](/constitution). Please feel free to email the appropriate Band Board member by clicking on their name. If you're not sure which Band Board member is appropriate, you may simply email the President, or all of Band Board. If your band is traveling to Brown, or if you have specific questions about band activities or events, the person to contact is the Corresponding Secretary. For general comments, suggestions, etc. please feel free to mail any member of the Band Board.
`;

const Heading = ({ title, id, section }) => (
  <h2 id={id}>
    <a href={"/constitution#" + section}>{title}</a>
  </h2>
);

exports.default = async ({ people }) => {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/people.css" />

      {await (<Markdown content={intro} />)}

      <Heading title="Band Board Officers" id="band-board" section="IIIA" />

      <p>For the term ending November 2022</p>

      {
        await Promise.all(
          people.bandBoard.map((person, i) => (
            <Person person={person} even={i % 2 === 0} />
          ))
        )
      }

      <Heading title="Conductors" id="conductors" section="IIIC1" />

      {
        await Promise.all(
          people.conductors.map((person, i) => (
            <Person person={person} even={i % 2 === 0} />
          ))
        )
      }

      <Heading title="Section Leaders" id="section-leaders" section="IIIB" />

      {await (<PeopleTable sections={people.sectionLeaders} />)}

      <Heading
        title="Appointed Positions"
        id="appointed-positions"
        section="IIIC"
      />

      {await (<PeopleTable sections={people.appointedPositions} />)}

      <Heading title="Faculty Advisor" id="faculty-advisor" section="VI" />

      <center>
        <a href="mailto:kmellor@alumni.brown.edu">Karen Mellor</a> '82
      </center>
    </>
  );
};
