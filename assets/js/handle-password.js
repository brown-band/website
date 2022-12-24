// @ts-check

// used by recordings.html

/**
 * Array of keys, where the key is encrypted with the password using the IV
 * @type {Array<{ iv: string; data: string }>}
 */
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
  // derive the key-decryption key from the password
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
  // try to decrypt all of the encrypted keys using the password
  const extractedKeys =
    /** @type {Array<{ success: true, key: CryptoKey} | { success: false, error: Error }>} */ (
      await Promise.all(
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
      )
    );

  for (const key of extractedKeys) {
    if (key.success) {
      globalThis.decryptionKey = key.key;
      document.dispatchEvent(new CustomEvent("password:decrypt"));
      return;
    }
  }
  passwordInput.classList.add("is-invalid");
};

// makes this a module
export {};
