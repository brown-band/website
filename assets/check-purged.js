const toCheck = await fetch("/purged-names.json")
  .then((res) => res.json())
  .then((selectors) =>
    selectors.filter((sel) => {
      try {
        document.querySelector(sel);
        return true;
      } catch {
        return false;
      }
    })
  );
const merged = toCheck.join(",");

function check(node) {
  if (!node.querySelector(merged)) {
    return;
  }
  for (const selector of toCheck) {
    if (node.querySelector(selector))
      alert(
        `Purged selector was used: ${selector}. Add "${selector}" to the safelist in config/minify.js to ensure it works properly!`
      );
  }
}

console.time("checking initial purge correctness");
check(document);
console.timeEnd("checking initial purge correctness");

/** @type {Node[]} */
let changesToPurge = [];
function insertChangedNode(changed) {
  if (!changesToPurge.some((n) => n.contains(changed))) {
    changesToPurge = [
      ...changesToPurge.filter((n) => !changed.contains(n)),
      changed,
    ];
  }
}
const watcher = new MutationObserver((changes) => {
  if (!changesToPurge.length) {
    setTimeout(() => {
      console.time("checking purge correctness");
      for (const target of changesToPurge) {
        console.log("checking", target);
        check(target);
      }
      console.timeEnd("checking purge correctness");
      changesToPurge = [];
    });
  }
  changes.forEach((ch) => insertChangedNode(ch.target.parentNode ?? ch.target));
});
watcher.observe(document.documentElement, {
  subtree: true,
  attributes: true,
  childList: true,
});
