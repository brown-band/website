// @ts-check

/** @returns {Promise<ArrayBuffer>} */
const fetchFile = (path, onProgress = (_) => {}) =>
  fetch(new URL("/" + path, globalThis.mediaHost).toString())
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
          iv: await crypto.subtle
            .digest("SHA-256", new TextEncoder().encode(path))
            .then((buf) => buf.slice(0, 16)),
        },
        globalThis.decryptionKey,
        data
      )
    );

/** @type {HTMLAudioElement} */
const audio = document.querySelector(".player-wrapper audio");

let urlToDispose;

/**
 * @template {keyof HTMLElementTagNameMap} Name
 * @param {Name} name
 */
const createChild = (name, parent) => {
  const child = document.createElement(name);
  parent.appendChild(child);
  return child;
};

const playTrack = (track) => {
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

  fetchFile(track.file, ({ received, total }) => {
    progress.max = total;
    progress.value = received;
  })
    .then((song) =>
      URL.createObjectURL(new Blob([song], { type: `audio/${track.type}` }))
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

const renderTrack = (track, includeArranger) => {
  const row = document.createElement("tr");

  if (track.header) {
    const title = createChild("th", row);
    title.colSpan = includeArranger ? 3 : 2;
    title.textContent = track.header;
    title.className = "text-center";
    return row;
  }
  createChild("td", row).textContent = track.title;

  if (includeArranger) {
    createChild("td", row).textContent = track.arranger || "";
  }

  const button = createChild("button", createChild("td", row));
  button.className = "btn btn-secondary btn-sm";
  button.textContent = "Play!";
  button.addEventListener("click", () => {
    playTrack(track);
  });

  return row;
};

const renderAlbum = (album) => {
  const sec = document.createElement("section");

  createChild("h2", sec).textContent = album.title;
  createChild("p", sec).textContent = album.about;

  const table = createChild("table", sec);
  table.className = "table";

  const headerRow = createChild("tr", createChild("thead", table));
  createChild("th", headerRow).textContent = "Title";
  const includeArranger = album.tracks.some((t) => t.arranger);
  if (includeArranger) {
    createChild("th", headerRow).textContent = "Arranger";
  }
  createChild("th", headerRow).style.width = "60px";

  const tbody = createChild("tbody", table);
  album.tracks
    .map((t) => renderTrack(t, includeArranger))
    .forEach((el) => tbody.appendChild(el));

  return sec;
};

document.addEventListener("password:decrypt", async () => {
  const inventory = await fetchFile("inventory.json").then((decrypted) =>
    JSON.parse(new TextDecoder().decode(decrypted))
  );
  const root = document.querySelector("#root");
  root.innerHTML = "";
  inventory.map(renderAlbum).forEach((el) => root.appendChild(el));

  document.querySelector(".stop-player").addEventListener("click", () => {
    document.querySelector(".player-wrapper").setAttribute("hidden", "");
    audio.pause();
  });
});

export {};
