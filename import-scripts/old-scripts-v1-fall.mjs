// @ts-check

import fs from "fs/promises";
import cheerio from "cheerio";
import dateFns from "date-fns";
import slugify from "slugify";
import { dump } from "js-yaml";

const scriptsDir = new URL("../old-scripts/", import.meta.url);

const getYear = (file) => parseInt(file.match(/^(?:fall|spring)(\d+)/)[1]);

const titleRe =
  /^Brown(?: (?:(?<brownScore>\d+)|__))? (?<loc>vs\.|versus|at) (?<opponent>[a-z ]+)( |$)(?:"(?<description>[^"]+)"( |$))?(?:(?<opponentScore>\d+)|__)?\s*$/i;

function parseTitle(title) {
  if (!title) throw TypeError();
  const { brownScore, opponentScore, loc, opponent, description } =
    title.match(titleRe).groups;
  const brownTeam = {
    name: "Brown",
    score: brownScore ? parseInt(brownScore) : undefined,
  };
  const otherTeam = {
    name: opponent,
    score: opponentScore ? parseInt(opponentScore) : undefined,
  };
  return {
    type: "football",
    teams: {
      home: loc === "at" ? otherTeam : brownTeam,
      away: loc === "at" ? brownTeam : otherTeam,
    },
    opponent,
    description,
  };
}

function parseDate(date, format) {
  const parsed = dateFns.parse(date, format, dateFns.startOfDay(new Date()));
  return dateFns.isValid(parsed) ? parsed : null;
}

const games = [];
const indexes = [];

for (const name of (await fs.readdir(scriptsDir)).filter((n) => {
  const year = getYear(n);
  return (
    n.startsWith("fall") &&
    ((1993 <= year && year < 2001) || year === 2004 || year === 2005)
  );
})) {
  console.log(`Processing ${name}...`);
  const s = new TextDecoder("latin1").decode(
    await fs.readFile(new URL(name, scriptsDir))
  );
  const $ = cheerio.load(s);
  const folder = `${getYear(name)}-${getYear(name) + 1}/fall`;

  let scripts = [];
  let currentScript;
  for (const child of $("body")
    .children()
    .toArray()
    .map((el) => $(el))) {
    const linkChild = child.find("a")[0]?.children[0];
    if (
      (linkChild
        ? $(linkChild).text().trim()
        : child[0].children[1]?.data?.trim() ?? child.text().trim()
      ).match(titleRe)
    ) {
      const date = child.find("small").text();
      const parsed =
        parseDate(date, "EEEE, MMMM d, yyyy") ??
        parseDate(date, "EEEE, MMMM d , yyyy");
      if (!linkChild) console.log("no linkChild", child.toString());
      if (currentScript) scripts.push(currentScript);

      const { opponent, ...script } = parseTitle(
        linkChild ? $(linkChild).text() : child[0].children[1].data
      );
      currentScript = {
        folder,
        index: { title: opponent, id: slugify(opponent).toLowerCase() },
        meta: {
          script,
          date: dateFns.isValid(parsed) ? parsed : { invalid: date },
        },
        content: [],
      };
    } else if (
      child.find("big>big>em").length ||
      child.find("font[size=4]").length ||
      child.is("h2")
    ) {
      if (!currentScript) console.log(child.toString());
      currentScript.content.push("## " + child.text().trim());
    } else if (child.is("p")) {
      if (
        child[0].children.length === 3 &&
        child.children().first().is("strong")
      ) {
        currentScript.content.push(
          `:sd[${child.children().first().html().trim().slice(1, -1)}]`
        );
      } else {
        currentScript.content.push(child.html().trim());
      }
    } else if (
      child.is("i") &&
      child.children().first().is("p") &&
      child.children()[0].children.length === 1 &&
      child.children().first().children().first().is("strong")
    ) {
      currentScript.content.push(
        `:sd[${child.children().first().children().first().html().trim()}]`
      );
    } else if (child.is("ul")) {
      currentScript.content.push(
        ":::script-list\n\n- " +
          child
            .children()
            .toArray()
            .map((el) => $(el).html().trim())
            .join("\n- ") +
          "\n\n:::"
      );
    } else if (!child.is("hr")) {
      currentScript.content.push(child.toString());
    }
  }
  if (currentScript) scripts.push(currentScript);

  indexes.push({
    folder,
    data: scripts.map((s) => s.index),
  });
  games.push(...scripts);
}

for (const index of indexes) {
  await fs.mkdir(new URL("../pages/scripts/" + index.folder, import.meta.url), {
    recursive: true,
  });
  await fs.writeFile(
    new URL("../pages/scripts/" + index.folder + "/index.yml", import.meta.url),
    dump(index.data)
  );
}

for (const game of games) {
  await fs.writeFile(
    new URL(
      "../pages/scripts/" + game.folder + "/" + game.index.id + ".md",
      import.meta.url
    ),
    `---\n${dump(game.meta)}---\n\n${game.content.join("\n\n")}`
  );
}
