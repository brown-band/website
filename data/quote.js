// @ts-check

const fs = require("node:fs/promises");
const glob = require("fast-glob");
const path = require("node:path");

module.exports = async () => {
  const allFiles = await glob("pages/scripts/20*/*/*.md", {
    cwd: path.dirname(__dirname),
  });

  const quotes = (
    await Promise.all(
      allFiles.reverse().map(async (p) => {
        const content = await fs.readFile(p, "utf8");
        return [
          /Brown University ["“]([^”"]+)["”] b/i.exec(content),
          /ladies and gentlemen, .+?[,!] presenting (.+?), it['’]s/i.exec(
            content
          ),
        ];
      })
    )
  )
    .flatMap((matches) => matches)
    .filter(Boolean)
    .map(([context, quote]) => quote)
    // attempt to prevent quotes from breaking onto >= 3 lines
    .filter((q) => q.length <= 70);
  return {
    all: quotes,
    random: () => quotes[Math.floor(Math.random() * quotes.length)],
  };
};
