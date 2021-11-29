const xml2js = require("xml2js");

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

/**
 * @returns {{day: number, month: number, year: number}}
 */
function getDate({ day, month, year }) {
  return { day: +day, month: +month, year: +year };
}

/**
 * @returns {Array<{ name: string, year: number, abbreviatedYear: `'${number}` }>}
 */
function getScriptWriters(writers) {
  if (!writers) return [];
  return writers.map((w) => ({
    name: w.name,
    year: +w.year,
    abbreviatedYear: "'" + w.year.slice(-2),
  }));
}

function scriptTextToHTML(node) {
  const children = () => node.$$.map(scriptTextToHTML);
  switch (node["#name"]) {
    case "__text__":
      return node._;
    case "sp":
      return `<p>${children()}</p>`;
    case "sd":
      return `<span class="-69-direction">${children()}</span>`;
    case "sul":
      return `<ul class="-69-list">${children()}</ul>`;
    case "sli":
      return `<li>${children()}</li>`;
    case "sbr":
      return "<br />";
    case "stab":
      return '<span class="-69-tab"></span>';
    case "smdash":
      return "&mdash;";
    // only used once, for 2013 Georgetown
    case "sdlgename":
      return `<strong><em>${children()}:</em></strong>`;
    case "#comment":
      return "";
    case "sub":
    case "sup":
      return `<${node["#name"]}>${children()}</${node["#name"]}>`;
    default:
    // blockquote, ul, li, b, i, em, a
  }
}

async function parseScript(content, data) {
  const camel = await import("camelcase").then((m) => m.default);
  const { script } = await xml2js.parseStringPromise(content, {
    tagNameProcessors: [camel],
    attrNameProcessors: [camel],
    explicitArray: false,
    mergeAttrs: true,
  });
  const orderPreservedScript = await xml2js.parseStringPromise(content, {
    tagNameProcessors: [camel],
    attrNameProcessors: [camel],
    explicitArray: false,
    explicitChildren: true,
    preserveChildrenOrder: true,
    charsAsChildren: true,
  });
  const date = getDate(script.date);
  const scriptWriters = getScriptWriters(script.scriptWriter);

  switch (script.scriptType.name) {
    case "football": {
      const teams = getTeams(script);
    }
  }

  return [script, orderPreservedScript];
}

exports.parse = parseScript;
