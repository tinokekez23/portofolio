// Generates the static site into dist/:
//   index.html, en/index.html                       home page in HR and EN
//   projekti/<id>/, en/projekti/<id>/               one page per project
//   404.html, favicon.svg, site.webmanifest, sitemap.xml, llms.txt
import { readFile, writeFile, mkdir, cp, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
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

// Date of the last commit that touched what the pages are built from. Without git
// history (e.g. a ZIP download) the sitemap leaves <lastmod> out rather than guess.
function lastChanged() {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", "content", "src", "public"], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return /^\d{4}-\d{2}-\d{2}$/.test(out.trim()) ? out.trim() : "";
  } catch {
    return "";
  }
}

// Plain-text summary for AI tools (llmstxt.org). An experiment with no proven effect;
// everything in it is also in the HTML pages.
function llmsTxt() {
  const en = makeT("en");
  const projects = P.projects.filter((p) => p.status !== "planned");
  const lines = [
    `# ${P.name}`,
    "",
    `> ${P.name} ${en(P.headline)}`,
    "",
    `${en(P.study)}. ${en(P.location)}. ${P.available ? `${en(P.availability)}. ` : ""}Email: ${P.email}`,
    "",
    "## Pages",
    "",
    `- [Home page in English](${P.siteUrl}/en/): CV, experience, skills, projects and contact`,
    `- [Home page in Croatian](${P.siteUrl}/): the same content in Croatian`,
    `- [CV (PDF)](${P.siteUrl}/${en(P.cvFile)})`,
    "",
    "## Projects",
    "",
    ...projects.map((p) => `- [${en(p.title)}](${P.siteUrl}/en/projekti/${p.id}/): ${en(p.description || p.summary)}`),
    ...(P.socials.length ? ["", "## Profiles", "", ...P.socials.map((s) => `- [${s.label}](${s.url})`)] : [])
  ];
  return lines.join("\n") + "\n";
}

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

  const lastmod = lastChanged();
  const paths = ["", ...P.projects.filter((p) => p.status !== "planned").map((p) => `projekti/${p.id}/`)];
  const alt = (lang, path) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${P.siteUrl}/${lang === "en" ? "en/" : ""}${path}"/>`;
  const entry = (loc, path) => `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}${alt("hr", path)}${alt("en", path)}${alt("x-default", path)}</url>`;
  await writeFile(join(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.flatMap((p) => [entry(`${P.siteUrl}/${p}`, p), entry(`${P.siteUrl}/en/${p}`, p)]).join("\n")}
</urlset>
`);
  await writeFile(join(DIST, "llms.txt"), llmsTxt());
  console.log(`Built home and ${paths.length - 1} project pages in HR and EN${contactForm ? "" : " (contact form off: no RESEND_API_KEY)"}`);
}

build().catch((e) => { console.error(e); process.exit(1); });
