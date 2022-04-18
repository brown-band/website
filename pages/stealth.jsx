const listify = require("listify");
const { default: Script, ScriptTitle } = require("../components/Script");

exports.data = {
  title: "Stealth Show Scripts",
};

exports.default = ({
  site: { urls },
  scripts,
  pagination,
  collections,
  schoolColors,
  buttons,
}) => {
  const collection = scripts.semesters
    .flatMap(({ collection }) => collections[collection])
    .filter((page) => page.filePathStem.includes("stealth-show"));
  return (
    <>
      <link rel="stylesheet" href="/assets/css/script.css" />

      {collection.map((script, i) => (
        <>
          {i === 0 || <hr style="margin-bottom: 5em" />}
          <Script
            urls={urls}
            script={script}
            buttons={buttons.byYear}
            semester={{}}
            schoolColors={schoolColors}
          />
        </>
      ))}
    </>
  );
  r;
};
