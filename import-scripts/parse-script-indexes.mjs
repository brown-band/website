import fs from "fs/promises";
import cheerio from "cheerio";
import d3 from "d3";
import { dump } from "js-yaml";

const names = [];
for (const { title, body_value } of JSON.parse(
  await fs.readFile(new URL("script-indexes.json", import.meta.url))
)) {
  const [_, semester, semYear] = title.split(" ");
  const year =
    semester === "Fall"
      ? `${semYear}-${parseInt(semYear) + 1}`
      : semester === "Spring"
      ? `${parseInt(semYear) - 1}-${semYear}`
      : (console.error(semester), process.exit(1));
  const $ = cheerio.load(body_value);
  const games = $("a")
    .toArray()
    .map((el) => ({
      title: $(el).text(),
      id: $(el)
        .attr("href")
        .replace("http://students.brown.edu/band/show-scripts/", "")
        .replace(/^scripts-\w+-\d+-/, ""),
    }));

  names.push(...games);

  await fs.writeFile(
    new URL(
      `../pages/scripts/${year}/${semester.toLowerCase()}/index.yml`,
      import.meta.url
    ),
    dump(games)
  );
  // result.push({
  //   title,
  //   entries: ,
  // });
}

console.log(
  ...d3
    .groups(
      [...new Set(names.map(JSON.stringify))].map(JSON.parse),
      (d) => d.id
    )
    .filter((d) => d[1].length > 1)
);
