// Generates the static site into dist/:
//   index.html, en/index.html                       home page in HR and EN
//   projekti/<id>/, en/projekti/<id>/               one page per project
//   404.html, favicon.svg, site.webmanifest, sitemap.xml
import { readFile, writeFile, mkdir, cp, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import P from "../content/profile.mjs";
import I18N from "../src/shared/i18n.mjs";
import { makeT } from "../src/shared/util.mjs";
import { model } from "../src/shared/model.mjs";
import { notFound } from "../src/shared/not-found.mjs";
import { renderHome } from "../src/site/home.mjs";
import { renderProject } from "../src/site/project.mjs";
import { FAVICON, THEME_COLOR } from "../src/site/layout.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

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

async function build() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(join(DIST, "assets"), { recursive: true });
  await cp(join(ROOT, "public"), DIST, { recursive: true });
  await copyAsset(join(ROOT, "src/shared/site.js"), "site.js");
  const css = minifyCss(await readFile(join(ROOT, "src/site/style.css"), "utf8"));

  // The form only appears once Vercel has the key to send email; until then the page
  // shows the address alone instead of a form that can't deliver.
  const contactForm = Boolean(process.env.RESEND_API_KEY);

  for (const lang of ["hr", "en"]) {
    const ctx = { P, lang, t: makeT(lang), ui: I18N[lang], asset, css, contactForm };
    const prefix = lang === "hr" ? "" : "en/";
    await write(prefix, renderHome(ctx));
    const projects = model(ctx).projects.filter((p) => !p.planned);
    for (const [i, p] of projects.entries()) {
      await write(`${prefix}projekti/${p.id}`, renderProject(ctx, p, projects[(i + 1) % projects.length]));
    }
  }

  await writeFile(join(DIST, "favicon.svg"), FAVICON);
  await writeFile(join(DIST, "404.html"), tidy(notFound({ P, favicon: FAVICON })));
  await writeFile(join(DIST, "site.webmanifest"), JSON.stringify({
    name: P.name,
    short_name: P.name,
    description: P.description.hr,
    lang: "hr",
    start_url: "/",
    display: "standalone",
    background_color: THEME_COLOR,
    theme_color: THEME_COLOR,
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }]
  }, null, 2));

  const today = new Date().toISOString().slice(0, 10);
  const paths = ["", ...P.projects.filter((p) => p.status !== "planned").map((p) => `projekti/${p.id}/`)];
  const entry = (loc, path) => `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><xhtml:link rel="alternate" hreflang="hr" href="${P.siteUrl}/${path}"/><xhtml:link rel="alternate" hreflang="en" href="${P.siteUrl}/en/${path}"/></url>`;
  await writeFile(join(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.flatMap((p) => [entry(`${P.siteUrl}/${p}`, p), entry(`${P.siteUrl}/en/${p}`, p)]).join("\n")}
</urlset>
`);
  console.log(`Built home and ${paths.length - 1} project pages in HR and EN${contactForm ? "" : " (contact form off: no RESEND_API_KEY)"}`);
}

build().catch((e) => { console.error(e); process.exit(1); });
