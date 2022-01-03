// Checks all the CSS selectors that have been purged against the live webpage

// note: to be efficient, this code assumes that a change to a node can only
// affect other nodes it shares a parent with. This is currently a safe assumption,
// but new CSS features starting to become available as of 2022 will make this unsafe.
// Presumably something like Bootstrap won’t use :has() and friends for several more years.

const toCheck = await fetch("/purged-names.json")
  .then((res) => res.json())
  .then((selectors) =>
    selectors.filter((sel) => {
      try {
        // some selectors are invalid in some browsers,
        // including them would break the combined selector
        // and be a waste of time
        document.querySelector(sel);
        return true;
      } catch {
        return false;
      }
    })
  );
// enables quickly checking whether any selector matches
const merged = toCheck.join(",");

function check(node) {
  // quick return if nothing matches
  if (!node.querySelector(merged)) return;

  for (const selector of toCheck) {
    if (node.querySelector(selector))
      alert(
        `Purged selector was used: ${selector}. Add "${selector}" to the safelist in config/minify.js to ensure it works properly!`
      );
  }
}

// check the entire document right away to get a clean baseline
console.time("checking initial purge correctness");
check(document);
console.timeEnd("checking initial purge correctness");

/** @type {Node[]} */
let changesToPurge = [];
// mark a node as being changed
function insertChangedNode(changed) {
  // if it’s inside something marked as changed, skip it since it will be checked already
  if (!changesToPurge.some((n) => n.contains(changed))) {
    // otherwise, remove anything inside this node that is already in the list
    changesToPurge = [
      ...changesToPurge.filter((n) => !changed.contains(n)),
      changed,
    ];
  }
}

// check any changed nodes and their children to see if a purged selector is being used
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
