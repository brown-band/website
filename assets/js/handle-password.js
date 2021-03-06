// @ts-check

// used by recordings.html

const keys = await fetch(
  new URL("/keys.json", globalThis.mediaHost).toString()
).then((res) => res.json());

const Base64 = window["base64-arraybuffer"];

/** @type {HTMLButtonElement} */ (
  document.querySelector(".decrypt-button")
).disabled = false;

/** @type {HTMLInputElement} */
const passwordInput = document.querySelector("#passwordInput");

globalThis.decrypt = async () => {
  const keyData = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(passwordInput.value)
  );
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
  const decoder = new TextDecoder();
  const extractedKeys = await Promise.all(
    keys.map(({ iv, data }) =>
      crypto.subtle
        .decrypt(
          { name: "AES-CBC", iv: Base64.decode(iv) },
          passwordKey,
          Base64.decode(data)
        )
        .then((jwk) =>
          crypto.subtle.importKey(
            "jwk",
            JSON.parse(decoder.decode(jwk)),
            { name: "AES-CBC" },
            false,
            ["decrypt"]
          )
        )
        .then(
          (key) => ({ success: true, key }),
          (error) => ({ success: false, error })
        )
    )
  );

  const key = extractedKeys.find((k) => k.success)?.key;
  if (key) {
    globalThis.decryptionKey = key;
    document.dispatchEvent(new CustomEvent("password:decrypt"));
  } else {
    passwordInput.classList.add("is-invalid");
  }
};

export {};
