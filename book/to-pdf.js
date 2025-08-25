// props to Jack Wrenn for creating the first version of this file :)

// Uses Puppeteer to render a PDF from the book’s HTML

import * as path from "node:path";
import puppeteer from "puppeteer-core";
import prettyMS from "pretty-ms";
import { fileURLToPath } from "url";

const ms = (ms) => prettyMS(ms, { secondsDecimalDigits: 2, verbose: true });

// ON MAC: Uncomment the following, comment the Windows text

// const __dirname = path.dirname(
//   decodeURIComponent(new URL(import.meta.url).pathname)
// );
// const output = path.join(__dirname, "book.pdf");

// ON WINDOWS: Uncomment the following, comment the Mac text
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const output = path.resolve(__dirname, "book.pdf");

console.log(`[Book] Path: ${output}`);

// UPDATE EXECUTABLE PATH TO WHEREVER CHROME IS INSTALLED
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

export async function renderPDF(port) {
  const page = await browser.newPage();
  await page.goto("http://localhost:" + port);
  // wait for Paged.js to finish working before saving the PDF
  const { pages, duration } = await new Promise(async (resolve) => {
    await page.exposeFunction("resolveRenderPromise", resolve);
    page.evaluate(async () => {
      window.PagedPolyfill.on("rendered", (flow) => {
        window.resolveRenderPromise({
          pages: flow.total,
          duration: flow.performance,
        });
      });
    });
  });
  console.log(`[Book] Rendering ${pages} pages took ${ms(duration)}`);
  const start = Date.now();
  await page.pdf({
    printBackground: true,
    path: output,
    preferCSSPageSize: true,
  });
  console.log(`[Book] PDF saved in ${ms(Date.now() - start)}`);
  await page.close();
}
