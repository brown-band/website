import fs from "fs/promises";
import cheerio from "cheerio";

function split(paragraphs, extra) {
  const result = [];
  let state = "halftime";
  for (const line of paragraphs) {
    const match = line.match(
      /Brown (?<type>at|vs\.) (?<team>.+?)\n(?<date>(?:\w+, )?\w+ \d+, \d+)/
    );
    if (match) {
      state = "halftime";
      result.push({ ...match.groups, ...extra, pregame: [], halftime: [] });
    } else if (line.trim() === "Pregame:") {
      state = "pregame";
    } else if (line.trim() === "Halftime:") {
      state = "halftime";
    } else {
      try {
        result[result.length - 1][state].push(line);
      } catch (e) {
        console.log(result, state, paragraphs.slice(0, 2));
        throw e;
      }
    }
  }
  return result;
}

const scriptsDir = new URL("../old-scripts/", import.meta.url);
const games = [];
for (const name of await fs.readdir(scriptsDir)) {
  console.log(`Processing ${name}...`);
  const s = new TextDecoder("latin1").decode(
    await fs.readFile(new URL(name, scriptsDir))
  );
  const $ = cheerio.load(s);
  games.push(
    ...split(
      $("p")
        .toArray()
        .map((el) => $(el).text().trim()),
      { semester: name }
    )
  );
}

await fs.writeFile(
  new URL("scripts.json", import.meta.url),
  JSON.stringify(games, null, 2)
);
