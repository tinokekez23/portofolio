// Generates static HR and EN pages for every design into dist/.
//   dist/index.html, dist/en/            the design picked in site.config.mjs
//   dist/designs/<slug>/, .../en/        previews of every design (noindex)
//   dist/designs/index.html              page for choosing between them
//   dist/404.html, favicon.svg, site.webmanifest, sitemap.xml
import { readFile, writeFile, mkdir, cp, rm, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import config from "../site.config.mjs";
import P from "../content/profile.mjs";
import I18N from "../src/shared/i18n.mjs";
import { makeT, toRoot } from "../src/shared/util.mjs";
import { renderChooser } from "../src/chooser.mjs";
import { notFound } from "../src/shared/not-found.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SLUGS = ["noc", "cetina", "sekvencer", "otpremnica"];

const minifyCss = (css) =>
  css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*\n\s*/g, "\n").replace(/\n+/g, "\n").trim();

// Template literals leave indentation on lines whose content was empty.
const tidy = (html) => html.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n");

async function write(rel, html) {
  const file = join(DIST, rel, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, tidy(html));
}

// Scripts get a content hash in their name so vercel.json can cache /assets/ forever.
const hashed = {};
async function copyAsset(src, name) {
  const body = await readFile(src);
  const hash = createHash("sha256").update(body).digest("hex").slice(0, 10);
  hashed[name] = name.replace(/\.js$/, `.${hash}.js`);
  await writeFile(join(DIST, "assets", hashed[name]), body);
}
const asset = (name) => {
  if (!hashed[name]) throw new Error(`unknown asset ${name}`);
  return hashed[name];
};

async function loadDesign(slug) {
  const dir = join(ROOT, "src/designs", slug);
  const mod = await import(join(dir, "page.mjs"));
  const css = minifyCss(await readFile(join(dir, "style.css"), "utf8"));
  const files = await readdir(dir);
  return { slug, ...mod, css, clientFiles: files.filter((f) => f.endsWith(".client.js")) };
}

function renderPage(design, lang, dir, preview) {
  const altDir = lang === "hr" ? `${dir}${dir ? "/" : ""}en` : dir;
  const ctx = {
    P, lang, t: makeT(lang), ui: I18N[lang], asset,
    root: toRoot(lang === "hr" ? dir : `${dir}${dir ? "/" : ""}en`),
    page: { preview, altHref: lang === "hr" ? "en/" : "../", dir: lang === "hr" ? dir : altDir }
  };
  return "<!doctype html>\n" + design.render({ ...ctx, css: design.css });
}

async function build() {
  if (!SLUGS.includes(config.design)) throw new Error(`site.config.mjs: unknown design "${config.design}"`);
  await rm(DIST, { recursive: true, force: true });
  await mkdir(join(DIST, "assets"), { recursive: true });
  await cp(join(ROOT, "public"), DIST, { recursive: true });
  await copyAsset(join(ROOT, "src/shared/site.js"), "site.js");

  const designs = await Promise.all(SLUGS.map(loadDesign));
  for (const d of designs) {
    for (const f of d.clientFiles) await copyAsset(join(ROOT, "src/designs", d.slug, f), f.replace(".client", ""));
  }
  for (const d of designs) {
    for (const lang of ["hr", "en"]) {
      const dir = `designs/${d.slug}`;
      await write(lang === "hr" ? dir : `${dir}/en`, renderPage(d, lang, dir, true));
      if (d.slug === config.design) await write(lang === "hr" ? "" : "en", renderPage(d, lang, "", false));
    }
  }
  await write("designs", renderChooser(designs, config.design));

  const live = designs.find((d) => d.slug === config.design);
  await writeFile(join(DIST, "favicon.svg"), live.FAVICON);
  await writeFile(join(DIST, "404.html"), tidy(notFound({ P, favicon: live.FAVICON })));
  await writeFile(join(DIST, "site.webmanifest"), JSON.stringify({
    name: P.name,
    short_name: P.name,
    description: P.description.hr,
    lang: "hr",
    start_url: "/",
    display: "standalone",
    background_color: live.THEME_COLOR,
    theme_color: live.THEME_COLOR,
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }]
  }, null, 2));

  const today = new Date().toISOString().slice(0, 10);
  const alt = `<xhtml:link rel="alternate" hreflang="hr" href="${P.siteUrl}/"/><xhtml:link rel="alternate" hreflang="en" href="${P.siteUrl}/en/"/>`;
  await writeFile(join(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${P.siteUrl}/</loc><lastmod>${today}</lastmod>${alt}</url>
  <url><loc>${P.siteUrl}/en/</loc><lastmod>${today}</lastmod>${alt}</url>
</urlset>
`);
  console.log(`Built ${designs.length} designs (live: ${config.design}) into dist/`);
}

build().catch((e) => { console.error(e); process.exit(1); });
