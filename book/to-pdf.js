// props to Jack Wrenn for creating the first version of this file :)

import path from "node:path";
import chokidar from "chokidar";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(
  decodeURIComponent(new URL(import.meta.url).pathname)
);
const output = path.join(__dirname, "book.pdf");

(async () => {
  try {
    let browser = await puppeteer.launch({
      headless: true,
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });

    async function render_pdf() {
      const page = await browser.newPage();
      await page.goto("http://localhost:8080");
      await page.pdf({
        printBackground: true,
        width: "8.5in",
        height: "11in",
        path: output,
        preferCSSPageSize: true,
      });
      await page.close();
    }

    const tryRenderPdf = (changedPath) => {
      if (changedPath) console.log("changed", changedPath);
      render_pdf()
        .then(() => console.log("saved:", output))
        .catch((err) => console.error("ERROR:", err));
    };
    tryRenderPdf();

    const src = path.join(path.dirname(__dirname), "book-html", "index.html");
    chokidar
      .watch(src)
      .on("ready", () => console.log("watching", src))
      // .on("add", tryRenderPdf)
      .on("change", tryRenderPdf)
      .on("unlink", tryRenderPdf);
  } catch (e) {
    console.error("Error:");
    console.error(e);
    process.exit(1);
  }
})();
