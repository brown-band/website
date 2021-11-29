const xml2js = require("xml2js");
const dateFns = require("date-fns");
const listify = require("listify");

// TODO: define `colors`

/**
 * @param {string} key
 * @returns {{name: string, score: string | null}}
 */
function getTeamInfo(script, key) {
  const score = script.scores?.[key] ?? null;
  return {
    name: script.teamNames[key],
    score: score ? score : null,
  };
}

function getTeams(script) {
  return {
    home: getTeamInfo(script, "home"),
    away: getTeamInfo(script, "away"),
  };
}

function renderGameTitle({ home, away }) {
  return renderTitleHeading(/* HTML */ `
    <span style="color: #${colors[away.name]}">
      ${away.name}${away.score ? ` (${away.score})` : ""}
    </span>
    <span style="font-size: 70%; font-style: italic">at</span>
    <span style="color: #${colors[home.name]}">
      ${home.name}${home.score ? ` (${home.score})` : ""}
    </span>
  `);
}

function renderTitleHeading(title) {
  return /* HTML */ `<center class="not-to-latex">
    <h1 style="font-size: 300%">${title}</h1>
  </center>`;
}

function renderTitle(title) {
  // color is Cardinal Red
  return renderTitleHeading(
    `<span style="color: #c41e3a">${title.toUpperCase()}</span>`
  );
}

function renderDate({ day, month, year }) {
  return /* HTML */ `<center>
    <h2 style="font-weight: bold">
      ${dateFns.format(new Date(+year, month - 1, +day), "EEEE, MMMM do, y")}
    </h2>
  </center>`;
}

function renderScriptWriters(writers) {
  if (!writers || writers.length === 0) return "";
  return /* HTML */ `<center style="font-style: italic">
    Script writer${writers.length === 1 ? "" : "s"}:
    ${listify(writers.map((w) => `${w.name} '${w.year.slice(-2)}`))}
  </center>`;
}

/**
 * @param {Array} nodes
 * @returns {string}
 */
function scriptTextToHTML(nodes) {
  return nodes
    .map((node) => {
      const children = node.$$ && scriptTextToHTML(node.$$);
      switch (node["#name"]) {
        case "__text__":
          return node._;
        case "sp":
          return `<p>${children}</p>`;
        case "sd":
          return `<span class="-69-direction">${children}</span>`;
        case "sul":
          return `<ul class="-69-list">${children}</ul>`;
        case "sli":
          return `<li>${children}</li>`;
        case "sbr":
          return "<br />";
        case "stab":
          return '<span class="-69-tab"></span>';
        case "smdash":
          return "&mdash;";
        // only used once, for 2013 Georgetown
        case "sdlgename":
          return `<strong><em>${children}:</em></strong>`;
        case "a":
          return /* HTML */ `
            <a href="${node.href.replaceAll("&", "&amp;")}">${children}</a>
          `.trim();
        case "sub":
        case "sup":
        case "em":
        case "strong":
        default:
          return `<${node["#name"]}>${children}</${node["#name"]}>`;
        // blockquote, ul, li
      }
    })
    .join("");
}

function renderHeader(script) {
  return renderDate(script.date) + renderScriptWriters(script.scriptWriter);
}

function renderScriptSection(title, content, { suffix = "" } = {}) {
  if (content) {
    return `<h3 style="font-weight: bold;">${title}</h3>\n${content}${suffix}`;
  } else {
    return "";
  }
}

async function parseScript(content, data = {}) {
  const camel = await import("camelcase").then((m) => m.default);

  const { script } = await xml2js.parseStringPromise(content, {
    tagNameProcessors: [camel],
    attrNameProcessors: [camel],
    explicitArray: false,
    mergeAttrs: true,
  });
  const { script: orderPreservedScript } = await xml2js.parseStringPromise(
    content,
    {
      tagNameProcessors: [camel],
      attrNameProcessors: [camel],
      explicitArray: false,
      explicitChildren: true,
      preserveChildrenOrder: true,
      charsAsChildren: true,
    }
  );

  Object.assign(data, { script, orderPreservedScript });

  // return [script, orderPreservedScript];

  switch (script.scriptType.name) {
    case "football":
      return (
        renderGameTitle(getTeams(script)) +
        renderHeader(script) +
        renderScriptSection(
          "Pregame",
          scriptTextToHTML(orderPreservedScript.pregame.$$),
          { suffix: "<br />" }
        ) +
        renderScriptSection(
          "Halftime",
          scriptTextToHTML(orderPreservedScript.halftime.$$)
        )
      );

    case "hockey":
      return (
        renderGameTitle(getTeams(script)) +
        renderHeader(script) +
        "<br />" +
        scriptTextToHTML(orderPreservedScript.hockey.$$)
      );

    case "adoch":
      return (
        renderTitle("adoch") +
        renderHeader(script) +
        "<br />" +
        scriptTextToHTML(orderPreservedScript.adoch.$$)
      );

    case "stealth_show":
      return (
        renderTitle("stealth show") +
        renderHeader(script) +
        "<br />" +
        scriptTextToHTML(orderPreservedScript.stealthShow.$$)
      );

    case "haffenreffer":
      return (
        renderTitle("haffenreffer") +
        renderHeader(script) +
        renderScriptSection(
          "Pregame",
          scriptTextToHTML(orderPreservedScript.pregame.$$),
          { suffix: "<br />" }
        ) +
        renderScriptSection(
          "Halftime",
          scriptTextToHTML(orderPreservedScript.halftime.$$)
        )
      );

    case "other":
      return (
        renderTitle(script.event.name) +
        renderHeader(script) +
        "<br />" +
        scriptTextToHTML(orderPreservedScript.scriptText.$$)
      );
    default:
      throw new TypeError(
        `An invalid script type was given: '${script.scriptType.name}'`
      );
  }
}

exports.parse = parseScript;
