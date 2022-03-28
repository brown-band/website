// @ts-check

/**
 * @typedef {{ title: string, file: string, type: string, arranger?: string }} FileTrack
 * @typedef {{ header: string }} HeaderTrack
 * @typedef {FileTrack | HeaderTrack} Track
 * @typedef {{ id: string, title: string, about: string, tracks: Track[] }} Album
 */

/**
 * @param {string} path
 * @param {object} [opts]
 * @param {(status: { received: number, total: number }) => void} [opts.onProgress]
 * @param {AbortSignal | null} [opts.signal]
 * @param {ArrayBuffer} [opts.iv]
 * @returns {Promise<ArrayBuffer>}
 */
const fetchFile = (
  path,
  {
    onProgress = () => {},
    signal = null,
    iv = new Uint8Array(path.match(/[\da-f]{2}/gi).map((d) => parseInt(d, 16)))
      .buffer,
  } = {}
) =>
  fetch(new URL("/" + path, globalThis.mediaHost).toString(), { signal })
    .then(async (res) => {
      // https://javascript.info/fetch-progress
      const reader = res.body.getReader();
      const total = +res.headers.get("Content-Length");
      let received = 0;
      let chunks = [];
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        received += value.length;

        onProgress({ received, total });
      }

      const result = new Uint8Array(received);
      let position = 0;
      for (const chunk of chunks) {
        result.set(chunk, position);
        position += chunk.length;
      }
      return result;
    })
    .then(async (data) =>
      crypto.subtle.decrypt(
        {
          name: "AES-CBC",
          iv: iv.slice(0, 16),
        },
        globalThis.decryptionKey,
        data
      )
    );

/** @type {HTMLAudioElement} */
const audio = document.querySelector(".player-wrapper audio");

/** @type {string | undefined} */
let urlToDispose;
/** @type {AbortController | undefined} */
let abortController;

const playTrack = (/** @type {FileTrack} */ track) => {
  audio.pause();
  audio.src = "";
  audio.load();
  audio.hidden = true;

  document.querySelector(".player-wrapper").removeAttribute("hidden");
  document.querySelector(".player-wrapper .now-playing").textContent =
    track.title;
  document.querySelector(".player-wrapper .player-status").textContent =
    "Loading";

  /** @type {HTMLProgressElement} */
  const progress = document.querySelector(".player-wrapper progress");
  progress.hidden = false;
  progress.removeAttribute("value");

  if (abortController) abortController.abort();
  abortController = new AbortController();

  fetchFile(track.file, {
    onProgress({ received, total }) {
      progress.max = total;
      progress.value = received;
    },
    signal: abortController.signal,
  })
    .then((song) =>
      URL.createObjectURL(
        new Blob([song], {
          type: track.type === "m4a" ? "audio/mp4" : `audio/${track.type}`,
        })
      )
    )
    .then((songURL) => {
      if (urlToDispose) URL.revokeObjectURL(urlToDispose);
      urlToDispose = songURL;

      audio.hidden = false;
      progress.hidden = true;

      document.querySelector(".player-wrapper .player-status").textContent =
        "Playing";
      audio.style.opacity = "1";
      audio.src = songURL;
      audio.play();
    });
};

const getTemplate = (
  /** @type {string} */ id,
  /** @type {(el: DocumentFragment) => void} */ modify = () => {}
) => {
  const template = /** @type {HTMLTemplateElement} */ (
    document.getElementById(id)
  );
  const node = /** @type {DocumentFragment} */ (
    template.content.cloneNode(true)
  );
  modify(node);
  return node;
};

/**
 * @param {Track} track
 * @param {boolean} includeArranger
 */
const renderTrack = (track, includeArranger) => {
  if ("header" in track) {
    return getTemplate("trackList-header", (row) => {
      const title = row.querySelector("th");
      title.colSpan = includeArranger ? 3 : 2;
      title.textContent = track.header;
    });
  } else {
    return getTemplate("trackList-track", (row) => {
      row.querySelector(".track-title").textContent = track.title;
      if (includeArranger) {
        row.querySelector(".track-arranger").textContent = track.arranger || "";
      } else {
        row.querySelector(".track-arranger").remove();
      }
      row.querySelector("button").addEventListener("click", () => {
        playTrack(track);
      });
    });
  }
};

const renderAlbum = (/** @type {Album} */ album) =>
  getTemplate("trackList", (sec) => {
    sec.querySelector("h2").id = album.id;
    sec.querySelector("h2").textContent = album.title;
    sec.querySelector("p").innerHTML = album.about;

    const includeArranger = album.tracks.some((t) => "arranger" in t);
    if (!includeArranger) {
      sec.querySelector(".arranger-title").remove();
    }

    for (const track of album.tracks) {
      sec
        .querySelector("tbody")
        .appendChild(renderTrack(track, includeArranger));
    }
  });

document.addEventListener("password:decrypt", async () => {
  /** @type {Album[]} */
  const inventory = await fetchFile("inventory.json", {
    iv: await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode("inventory.json")
    ),
  }).then((decrypted) => JSON.parse(new TextDecoder().decode(decrypted)));
  const root = document.querySelector("#root");
  root.innerHTML = "";
  root.style.opacity = 0;

  let oldHash;
  if (location.hash) {
    oldHash = location.hash;
    history.replaceState(
      {},
      document.title,
      window.location.href.split("#")[0]
    );
  }

  getTemplate("toc", (toc) => {
    [...toc.children]
      .reverse()
      .forEach((c) =>
        document.querySelector("h1").insertAdjacentElement("afterend", c)
      );
  });
  document
    .querySelector("h1")
    .insertAdjacentElement(
      "beforebegin",
      getTemplate("toc-button").firstElementChild
    );

  const tocUL = document.querySelector(".toc ul");
  inventory.forEach((album) => {
    root.appendChild(renderAlbum(album));
    tocUL.appendChild(
      getTemplate("toc-li", (li) => {
        li.querySelector("a").href = "#" + album.id;
        li.querySelector("a").textContent = album.title;
      })
    );
  });

  document.querySelector(".stop-player").addEventListener("click", () => {
    document.querySelector(".player-wrapper").setAttribute("hidden", "");
    audio.pause();
  });

  if (oldHash) {
    document.documentElement.classList.remove("smooth-scroll");
    setTimeout(() => {
      location.hash = oldHash;
      document.documentElement.classList.add("smooth-scroll");
      root.style.opacity = 1;
    });
  } else {
    root.style.opacity = 1;
  }
});

export {};
