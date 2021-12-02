import xml2js from "xml2js";
import fs from "fs/promises";
import yaml from "js-yaml";
import camel from "camelcase";
import path from "path";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import { exit } from "process";

Error.stackTraceLimit = 100;

function getTeamInfo(script, key) {
  const score = script.scores?.[key] ?? null;
  return {
    name: script.teamNames[key],
    score: score ? +score : undefined,
  };
}

function getTeams(script) {
  return {
    home: getTeamInfo(script, "home"),
    away: getTeamInfo(script, "away"),
  };
}

function scriptTextToMDAST(nodes) {
  if (!nodes) return [];
  return nodes.flatMap((node, i) => {
    let children = node.$$ && scriptTextToMDAST(node.$$);
    switch (node["#name"]) {
      case "__text__":
        let value = node._.replace(/\s\s+/gm, " ");
        if (i === 0) value = value.trimStart();
        if (i === nodes.length - 1) value = value.trimEnd();

        return { type: "text", value };
      case "sp":
        return { type: "paragraph", children };
      case "sd":
        return { type: "textDirective", name: "sd", children };
      case "sul":
        // const kids = new Set(children.map((c) => c.type));
        // if (kids.size > 1) console.log(kids);
        return {
          type: "containerDirective",
          name: "script-list",
          children: [
            {
              type: "list",
              ordered: false,
              spread: false,
              children,
            },
            { type: "text", value: "\n" },
          ],
        };
      case "sli":
      case "li":
        return { type: "listItem", spread: false, checked: null, children };
      case "sbr":
        return { type: "break" };
      case "stab":
        return { type: "html", value: '<span class="-69-tab"></span>' };
      case "smdash":
        return { type: "text", value: "—" };
      // only used once, for 2013 Georgetown
      case "sdlgename":
        return { type: "emphasis", children: { type: "strong", children } };
      case "a":
        return { type: "link", children, url: node.$.href };
      case "em":
        return { type: "emphasis", children };
      case "strong":
        return { type: "strong", children };
      case "ul":
        return { type: "list", ordered: false, spread: false, children };
      case "blockquote":
        return { type: "blockquote", children };
      default:
        // sub, sup
        return [
          { type: "html", value: `<${node["#name"]}>` },
          ...children,
          { type: "html", value: `</${node["#name"]}>` },
        ];
    }
  });
}

function renderScriptSection(title, content) {
  if (content && content.length) {
    return [
      { type: "heading", depth: 2, children: [{ type: "text", value: title }] },
      ...content,
    ];
  } else {
    return [];
  }
}

async function scriptToMarkdown(xml) {
  const { script } = await xml2js.parseStringPromise(xml, {
    tagNameProcessors: [camel],
    attrNameProcessors: [camel],
    explicitArray: false,
    mergeAttrs: true,
  });

  const { script: orderPreservedScript } = await xml2js.parseStringPromise(
    xml,
    {
      tagNameProcessors: [camel],
      attrNameProcessors: [camel],
      explicitArray: false,
      explicitChildren: true,
      preserveChildrenOrder: true,
      charsAsChildren: true,
    }
  );

  let content = [];

  switch (script.scriptType.name) {
    case "football":
    case "haffenreffer":
      content = [
        ...renderScriptSection(
          "Pregame",
          scriptTextToMDAST(orderPreservedScript.pregame?.$$)
        ),
        ...renderScriptSection(
          "Halftime",
          scriptTextToMDAST(orderPreservedScript.halftime?.$$)
        ),
      ];
      break;
    case "hockey":
      content = scriptTextToMDAST(orderPreservedScript.hockey.$$);
      break;
    case "adoch":
      content = scriptTextToMDAST(orderPreservedScript.adoch.$$);
      break;
    case "stealth_show":
      content = scriptTextToMDAST(orderPreservedScript.stealthShow.$$);
      break;
    case "other":
      content = scriptTextToMDAST(orderPreservedScript.scriptText.$$);
      break;

    default:
      throw new TypeError(
        `An invalid script type was given: '${script.scriptType.name}'`
      );
  }

  content.forEach((n) => {
    visit(n, "paragraph", (para) =>
      para.children
        .reduce(
          (acc, el) => {
            if (el.type === "containerDirective") {
              acc.push(el);
              acc.push({ type: "paragraph", children: [] });
            } else {
              acc[acc.length - 1].children.push(el);
            }
            return acc;
          },
          [{ type: "paragraph", children: [] }]
        )
        .filter((p) => p.children.length > 0)
    );
    visit(n, "paragraph", (para) => {
      if (para.children[para.children.length - 1].type === "break") {
        para.children = para.children.slice(0, -1);
      }
      return para;
    });
  });

  const markdown = unified()
    .use(remarkDirective)
    .use(remarkStringify)
    .stringify({
      type: "root",
      children: content,
    })
    .replaceAll("&#x20;", " ");

  return `---\n${yaml
    .dump({
      script: {
        type: script.scriptType.name,
        teams: script.teamNames ? getTeams(script) : undefined,
      },
    })
    .trim()}\ndate: ${script.date.year}-${script.date.month.padStart(
    2,
    "0"
  )}-${script.date.day.padStart(2, "0")}\n---\n\n${markdown}`;
}

const scriptsDir = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "pages",
  "scripts"
);
const years = await fs.readdir(scriptsDir);

const allScripts = (
  await Promise.all(
    years.map((year) =>
      fs.readdir(path.join(scriptsDir, year)).then((semesters) =>
        Promise.all(
          semesters.map(async (semester) => {
            const dir = path.join(scriptsDir, year, semester);
            const files = await fs.readdir(dir);
            return files
              .map((f) => path.join(dir, f))
              .filter((f) => f.endsWith(".69"));
          })
        )
      )
    )
  )
).flat(2);

for (const script of allScripts) {
  console.log(`Converting ${script}...`);
  const content = await fs.readFile(script, "utf-8");
  await fs.writeFile(
    script.replace(".69", ".md"),
    await scriptToMarkdown(content)
  );
}
