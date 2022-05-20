import { exec, spawnSync } from "node:child_process";
import { promisify } from "node:util";
import { parseDocument } from "yaml";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import semver from "semver";

let { stdout: pnpmVersion } = await promisify(exec)("pnpm --version", {
  encoding: "utf-8",
});
pnpmVersion = pnpmVersion.trim();

const workflowURL = new URL("./.github/workflows/deploy.yml", import.meta.url);
const workflow = parseDocument(await readFile(workflowURL, "utf-8"));
/** @type {import('yaml').Node} */
const pnpmStep = workflow
  .getIn(["jobs", "deploy", "steps"])
  .items.find((step) => step.get("id") === "pnpm");
const requestedVersion = pnpmStep.getIn(["with", "version"]);

const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[32m";
const bold = "\x1b[1m";
const reset = "\x1b[0m";

if (pnpmVersion !== requestedVersion) {
  if (process.argv.includes("--update")) {
    pnpmStep.setIn(["with", "version"], pnpmVersion);
    await writeFile(workflowURL, workflow.toString());
    spawnSync(
      "pnpm",
      [
        "exec",
        "prettier",
        "--write",
        "--loglevel",
        "warn",
        fileURLToPath(workflowURL),
      ],
      { stdio: "inherit" }
    );
    const action = semver.gt(pnpmVersion, requestedVersion)
      ? `upgraded`
      : `${yellow}downgraded${reset}${green}`;
    console.log(
      `${green}Successfully ${action} pnpm to v${requestedVersion} in .github/workflows/deploy.yml${reset}`
    );
  } else {
    console.error(
      `${red}Expected pnpm version ${pnpmVersion} but found v${requestedVersion} in .github/workflows/deploy.yml${reset}`
    );
    if (semver.lt(pnpmVersion, requestedVersion)) {
      console.log(
        `${yellow}*** This is a DOWNGRADE. Consider updating your local pnpm by running ${bold}pnpm update -g pnpm${reset}${yellow}! ***${reset}`
      );
    }
    console.error(
      ` → Run ${bold}node postinstall.mjs --update${reset} to update the workflow`
    );
    process.exit(1);
  }
} else if (process.argv.includes("--update")) {
  console.log(`No need to update pnpm in .github/workflows/deploy.yml`);
}
