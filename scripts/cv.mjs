// Prints the CV from content/profile.mjs to PDF, in both languages:
//   npm run cv   -> public/cv.pdf (HR) and public/cv-en.pdf (EN)
// Run it after changing the profile, then commit the PDFs.
//
// Printing uses Playwright if it is installed (npm i -g playwright). Without it the
// script only writes cv-print/cv-hr.html and cv-print/cv-en.html: open one in Chrome,
// Print → Save as PDF, paper A4, margins Default, "Background graphics" on.
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import P from "../content/profile.mjs";
import I18N from "../src/shared/i18n.mjs";
import { makeT } from "../src/shared/util.mjs";
import { renderCv } from "../src/site/cv.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "cv-print");

let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)("playwright"));
} catch {
  console.log("Playwright isn't installed, so only the HTML is written; print it from Chrome.");
}

await mkdir(OUT, { recursive: true });
const browser = chromium && (await chromium.launch());
for (const lang of ["hr", "en"]) {
  const t = makeT(lang);
  const html = join(OUT, `cv-${lang}.html`);
  const pdf = join(ROOT, "public", t(P.cvFile));
  await writeFile(html, renderCv({ P, lang, t, ui: I18N[lang] }, { base: "../public/" }));
  if (!browser) {
    console.log(`${html} -> save as ${pdf}`);
    continue;
  }
  const page = await browser.newPage();
  await page.goto(pathToFileURL(html).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true, tagged: true });
  await page.close();
  console.log(pdf);
}
await browser?.close();
