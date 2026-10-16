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
const LIVE = ["index.html", "en/index.html"];

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
      if (r.startsWith("/api/")) continue;
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
    assert.ok(desc.length >= 50 && desc.length <= 160, `${f}: description is ${desc.length} characters`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${P.siteUrl}/${lang === "en" ? "en/" : ""}">`), f);
    assert.equal(html.match(/<h1[\s>]/g)?.length, 1, `${f}: h1 count`);
    assert.doesNotMatch(html, /name="robots" content="noindex"/, f);
  }
});

test("structured data parses and describes the same person on both pages", async () => {
  for (const f of LIVE) {
    const html = await readFile(join(DIST, f), "utf8");
    const json = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s)?.[1];
    assert.ok(json, `${f}: no JSON-LD`);
    const graph = JSON.parse(json)["@graph"];
    const person = graph.find((n) => n["@type"] === "Person");
    assert.equal(person.name, P.name);
    assert.equal(person["@id"], `${P.siteUrl}/#person`);
    assert.ok(graph.find((n) => n["@type"] === "ProfilePage").mainEntity["@id"] === person["@id"]);
  }
});

test("design previews and the 404 page stay out of search results", async () => {
  for (const f of pages.map((p) => relative(DIST, p)).filter((p) => p.startsWith("designs/") || p === "404.html")) {
    assert.match(await readFile(join(DIST, f), "utf8"), /<meta name="robots" content="noindex">/, f);
  }
});

test("sitemap lists only pages that exist", async () => {
  const xml = await readFile(join(DIST, "sitemap.xml"), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(locs.length >= 2);
  for (const l of locs) assert.ok(await exists(join(DIST, l.slice(P.siteUrl.length))), l);
});

test("shipped scripts have no leftover console output", async () => {
  for (const f of (await walk(join(DIST, "assets"))).filter((f) => f.endsWith(".js"))) {
    assert.doesNotMatch(await readFile(f, "utf8"), /console\.(log|debug)\(/, f);
  }
});
