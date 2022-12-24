// @ts-check

const fs = require("node:fs/promises");
const glob = require("fast-glob");
const path = require("node:path");

// pull the quotes out of the first paragraph of scripts
module.exports = async () => {
  // some of the older ones get pretty cringe, so keep this fairly recent
  const allFiles = await glob("pages/scripts/20*/*/*.md", {
    cwd: path.dirname(__dirname),
  });

  const regexes = [
    /Brown University (["“][^”"]+["”]) b/i,
    /ladies and gentlemen, .+?[,!] presenting (.+?), it['’]s/i,
  ];

  const matches = await Promise.all(
    allFiles.map(async (p) => {
      const content = await fs.readFile(p, "utf8");
      return regexes.map((re) => re.exec(content));
    })
  );

  const quotes = matches
    .flatMap((x) => x)
    .filter(Boolean)
    .map(([context, quote]) => quote)
    // attempt to prevent quotes from breaking onto >= 3 lines
    .filter((q) => q.length <= 70);

  return {
    all: quotes,
    random: () => quotes[Math.floor(Math.random() * quotes.length)],
  };
};
