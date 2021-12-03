import fs from "fs/promises";
import cheerio from "cheerio";

const result = [];
for (const { title, body_value } of JSON.parse(
  await fs.readFile(new URL("script-indexes.json", import.meta.url))
)) {
  // const [_, semester, year] = title.split(" ");
  const $ = cheerio.load(body_value);
  result.push(
    ...$("a")
      .toArray()
      .map((el) =>
        // text: $(el).text(),
        $(el)
          .attr("href")
          .replace("http://students.brown.edu/band/show-scripts/", "")
          .replace(/^scripts-\w+-\d+-/, "")
      )
  );
  // result.push({
  //   title,
  //   entries: ,
  // });
}

console.log(new Set(result));
