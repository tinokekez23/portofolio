// Builds the site and checks the output: every local link and file reference resolves,
// and the live pages carry the metadata search engines and link previews rely on.
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import P from "../content/profile.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PROJECTS = P.projects.filter((p) => p.status !== "planned").map((p) => `projekti/${p.id}/index.html`);
const LIVE = ["index.html", "en/index.html", ...PROJECTS, ...PROJECTS.map((p) => `en/${p}`)];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const exists = (p) => stat(p).then((s) => (s.isDirectory() ? stat(join(p, "index.html")).then(() => true) : true)).catch(() => false);

function refs(html) {
  const found = [];
  for (const m of html.matchAll(/\s(?:href|src|poster)="([^"]+)"/g)) found.push(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) found.push(...m[1].split(",").map((s) => s.trim().split(/\s+/)[0]));
  for (const m of html.matchAll(/url\(([^)"']+)\)/g)) found.push(m[1]);
  return found.map((r) => r.replaceAll("&amp;", "&"));
}

let pages;
before(async () => {
  execFileSync(process.execPath, [join(ROOT, "scripts/build.mjs")], { stdio: "pipe" });
  pages = (await walk(DIST)).filter((f) => f.endsWith(".html"));
});

test("every local link, image, script and font resolves", async () => {
  const broken = [];
  for (const file of pages) {
    const html = await readFile(file, "utf8");
    for (let r of refs(html)) {
      if (/^(mailto:|tel:|data:|#|javascript:)/.test(r)) continue;
      if (r.startsWith(P.siteUrl)) r = r.slice(P.siteUrl.length) || "/";
      else if (/^[a-z]+:/i.test(r)) continue;
      if (r.startsWith("/api/") || r.startsWith("/_vercel/")) continue;
      const path = r.split(/[?#]/)[0];
      const target = path.startsWith("/") ? join(DIST, path) : join(dirname(file), path);
      if (!(await exists(target))) broken.push(`${relative(DIST, file)} -> ${r}`);
    }
  }
  assert.deepEqual(broken, []);
});

test("live pages have language, title, description, canonical and one h1", async () => {
  for (const f of LIVE) {
    const html = await readFile(join(DIST, f), "utf8");
    const lang = f.startsWith("en/") ? "en" : "hr";
    assert.match(html, new RegExp(`<html lang="${lang}"`), f);
    assert.match(html, /<title>[^<]{10,70}<\/title>/, f);
    const desc = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
    assert.ok(desc.length >= 120 && desc.length <= 160, `${f}: description is ${desc.length} characters`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${P.siteUrl}/${f.replace("index.html", "")}">`), f);
    assert.equal(html.match(/<h1[\s>]/g)?.length, 1, `${f}: h1 count`);
    assert.doesNotMatch(html, /name="robots" content="noindex"/, f);
  }
});

test("structured data parses and names the same person on every page", async () => {
  for (const f of LIVE) {
    const html = await readFile(join(DIST, f), "utf8");
    const json = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s)?.[1];
    assert.ok(json, `${f}: no JSON-LD`);
    const graph = JSON.parse(json)["@graph"];
    const person = graph.find((n) => n["@type"] === "Person");
    assert.equal(person.name, P.name);
    assert.equal(person["@id"], `${P.siteUrl}/#person`);
    const main = graph.find((n) => n["@type"] === "ProfilePage" || n["@type"] === "CreativeWork");
    assert.equal((main.mainEntity || main.creator)["@id"], person["@id"], f);
  }
});

test("the 404 page stays out of search results", async () => {
  assert.match(await readFile(join(DIST, "404.html"), "utf8"), /<meta name="robots" content="noindex">/);
});

test("every image has alt text", async () => {
  const missing = [];
  for (const file of pages) {
    for (const m of (await readFile(file, "utf8")).matchAll(/<img\b[^>]*>/g)) {
      if (!/\salt="[^"]+"/.test(m[0])) missing.push(`${relative(DIST, file)}: ${m[0].slice(0, 80)}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("sitemap lists only pages that exist", async () => {
  const xml = await readFile(join(DIST, "sitemap.xml"), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(locs.length >= 2);
  for (const l of locs) assert.ok(await exists(join(DIST, l.slice(P.siteUrl.length))), l);
  const urls = xml.match(/<url>.+?<\/url>/g);
  for (const u of urls) {
    for (const lang of ["hr", "en", "x-default"]) assert.match(u, new RegExp(`hreflang="${lang}"`), u);
    const lastmod = u.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    if (lastmod) assert.ok(lastmod <= new Date().toISOString().slice(0, 10), `lastmod ${lastmod} is in the future`);
  }
});

test("project pages show the breadcrumb their structured data describes, and their own share image", async () => {
  for (const p of P.projects.filter((p) => p.status !== "planned")) {
    for (const lang of ["hr", "en"]) {
      const f = `${lang === "en" ? "en/" : ""}projekti/${p.id}/index.html`;
      const html = await readFile(join(DIST, f), "utf8");
      const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s)[1])["@graph"];
      const names = graph.find((n) => n["@type"] === "BreadcrumbList").itemListElement.map((i) => i.name);
      const crumbs = html.match(/<nav class="crumbs"[^>]*>([\s\S]+?)<\/nav>/)?.[1] ?? "";
      const visible = [...crumbs.matchAll(/<li[^>]*>(?:<a[^>]*>)?([^<]+)/g)].map((m) => m[1].replaceAll("&amp;", "&"));
      assert.deepEqual(visible, names, f);
      // A project without its own image falls back to the profile's, which is fine.
      if (p.shareImage) {
        const og = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
        assert.equal(og, `${P.siteUrl}/${p.shareImage.src[lang]}`, f);
      }
    }
  }
});

test("llms.txt links only to pages and files that exist", async () => {
  const txt = await readFile(join(DIST, "llms.txt"), "utf8");
  const local = [...txt.matchAll(/\]\((https?:[^)]+)\)/g)].map((m) => m[1]).filter((u) => u.startsWith(P.siteUrl));
  assert.ok(local.length >= 3);
  for (const u of local) assert.ok(await exists(join(DIST, u.slice(P.siteUrl.length) || "/")), u);
});

test("every page loads the analytics script once, after site.js, when analytics is on", async () => {
  for (const f of [...LIVE, "404.html"]) {
    const html = await readFile(join(DIST, f), "utf8");
    const tags = html.match(/<script src="\/_vercel\/insights\/script\.js" defer><\/script>/g) ?? [];
    assert.equal(tags.length, P.analytics ? 1 : 0, f);
    const site = html.indexOf('src="/assets/site.');
    if (P.analytics && site !== -1) assert.ok(site < html.indexOf("/_vercel/insights/"), `${f}: analytics before site.js`);
  }
  // The CV can't run the script, so its download link is counted on click
  for (const f of ["index.html", "en/index.html"]) {
    assert.match(await readFile(join(DIST, f), "utf8"), /<a [^>]*href="\/cv[^"]*\.pdf"[^>]*data-count/, f);
  }
});

test("robots.txt keeps the site open and points to the sitemap", async () => {
  const txt = await readFile(join(DIST, "robots.txt"), "utf8");
  assert.doesNotMatch(txt, /^Disallow: \/\s*$/m);
  assert.match(txt, new RegExp(`^Sitemap: ${P.siteUrl}/sitemap.xml$`, "m"));
});

test("shipped scripts have no leftover console output", async () => {
  for (const f of (await walk(join(DIST, "assets"))).filter((f) => f.endsWith(".js"))) {
    assert.doesNotMatch(await readFile(f, "utf8"), /console\.(log|debug)\(/, f);
  }
});
