import fs from "fs/promises";
import cheerio from "cheerio";
import dateFns from "date-fns";

const scriptsDir = new URL("../old-scripts/", import.meta.url);

const getYear = (file) => parseInt(file.match(/^(?:fall|spring)(\d+)/)[1]);

function parseTitle(title) {
  if (!title) throw TypeError();
  const { brownScore, opponentScore, loc, opponent, description } = title.match(
    /^Brown(?: (?:(?<brownScore>\d+)|__))? (?<loc>vs\.|versus|at) (?<opponent>[a-z ]+)( |$)(?:"(?<description>[^"]+)"( |$))?(?:(?<opponentScore>\d+)|__)?\s*$/i
  ).groups;
  const brownTeam = {
    name: "Brown",
    score: brownScore ? parseInt(brownScore) : undefined,
  };
  const otherTeam = {
    name: opponent,
    score: opponentScore ? parseInt(opponentScore) : undefined,
  };
  return {
    teams: {
      home: loc === "at" ? otherTeam : brownTeam,
      away: loc === "at" ? brownTeam : otherTeam,
    },
    description,
  };
}

function parseDate(date, format) {
  const parsed = dateFns.parse(date, format, dateFns.startOfDay(new Date()));
  return dateFns.isValid(parsed) ? parsed : null;
}

const games = [];

for (const name of (await fs.readdir(scriptsDir)).filter((n) => {
  const year = getYear(n);
  return (
    n.startsWith("fall") &&
    ((1993 <= year && year <= 2001) || year === 2004 || year === 2005)
  );
})) {
  console.log(`Processing ${name}...`);
  const s = new TextDecoder("latin1").decode(
    await fs.readFile(new URL(name, scriptsDir))
  );
  const $ = cheerio.load(s);

  let currentScript;
  for (const child of $("body")
    .children()
    .toArray()
    .map((el) => $(el))) {
    if (child.is("h1")) {
      const date = child.find("small").text();
      const parsed =
        parseDate(date, "EEEE, MMMM d, yyyy") ??
        parseDate(date, "EEEE, MMMM d , yyyy");
      const linkChild = child.find("a")[0].children[0];
      if (!linkChild) console.log(child.toString());
      if (currentScript) games.push(currentScript);

      currentScript = {
        title: parseTitle(
          linkChild ? $(linkChild).text() : child[0].children[1].data
        ),
        date: dateFns.isValid(parsed) ? parsed : { invalid: date },
        id: child.find("a").attr("name"),
      };
    } else if (
      child.find("big>big>em").length ||
      child.find("font[size=4]").length ||
      child.is("h2")
    ) {
      console.log(child.text().trim());
    }
  }
  if (currentScript) games.push(currentScript);
}

await fs.writeFile(
  new URL("scripts.json", import.meta.url),
  JSON.stringify(games, null, 2)
);
