const fetchFile = (path) =>
  fetch(new URL("/" + path, mediaHost))
    .then((res) => res.arrayBuffer())
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

const renderTrack = (folder, track) => {
  const row = document.createElement("tr");

  if (track.header) {
    const title = document.createElement("th");
    title.colSpan = 2;
    title.textContent = track.header;
    row.appendChild(title);
    return row;
  }
  const title = document.createElement("td");
  title.textContent = track.title;
  row.appendChild(title);

  const button = document.createElement("button");
  button.textContent = "Play!";
  button.addEventListener("click", () =>
    console.log(
      "playing",
      `${encodeURIComponent(folder)}/${encodeURIComponent(track.file)}`
    )
  );
  const buttonTd = document.createElement("td");
  buttonTd.appendChild(button);
  row.appendChild(buttonTd);
  return row;
};

const renderAlbum = (album) => {
  const sec = document.createElement("section");

  const header = document.createElement("h2");
  header.textContent = album.title;
  sec.appendChild(header);

  const about = document.createElement("p");
  about.textContent = album.about;
  sec.appendChild(about);

  const table = document.createElement("table");
  table.classList.add("table");
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);
  sec.appendChild(table);

  album.tracks
    .map((t) => renderTrack(album.name, t))
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
});
