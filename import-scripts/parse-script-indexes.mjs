import fs from "fs/promises";
import xml2js from "xml2js";

const result = [];
for (const { title, body_value } of JSON.parse(
  await fs.readFile("script-indexes.json")
)) {
  const [_, semester, year] = title.split(" ");
  const links = await xml2js.parseStringPromise(
    "<body>" + body_value + "</body>",
    {
      // explicitRoot: false,
      // explicitChildren: true,
      // preserveChildrenOrder: true,
    }
  );
  result.push({
    title,
    entries: links.body.p.map((p) =>
      p.a?.[0].$.href.split("-").slice(3).join("-")
    ),
  });
}

console.log(result);
