// /designs/: a plain page for comparing the three designs. Not linked from the site.
import { esc } from "./shared/util.mjs";

export function renderChooser(designs, live) {
  const card = (d, i) => `<li class="d">
  <a class="d-shot" href="${d.slug}/" aria-label="${esc(d.meta.name)}: otvori prijedlog">
    <img src="../img/designs/${d.slug}-desktop.webp" width="1280" height="800" alt="" loading="${i ? "lazy" : "eager"}">
    <img class="d-phone" src="../img/designs/${d.slug}-mobile.webp" width="390" height="844" alt="" loading="lazy">
  </a>
  <div class="d-text">
    <h2>${i + 1}. ${esc(d.meta.name)}${d.slug === live ? ' <span class="live">trenutno na /</span>' : ""}</h2>
    <p>${esc(d.meta.blurb.hr)}</p>
    <p class="d-links"><a href="${d.slug}/">Otvori (HR)</a> <a href="${d.slug}/en/">Open (EN)</a></p>
  </div>
</li>`;
  return `<!doctype html>
<html lang="hr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Prijedlozi dizajna</title>
<style>
:root { --bg: #f4f4f2; --ink: #1d1d1b; --muted: #5d5d58; --line: #d6d6d0; --link: #0b57d0; color-scheme: light dark; }
@media (prefers-color-scheme: dark) { :root { --bg: #1c1c1a; --ink: #ececea; --muted: #a8a8a2; --line: #3a3a36; --link: #8ab4f8; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 1.0625rem/1.55 system-ui, -apple-system, "Segoe UI", sans-serif; }
main { max-width: 70rem; margin: 0 auto; padding: 3rem 1rem 5rem; }
h1 { font-size: 1.75rem; margin: 0 0 .5rem; }
.intro { color: var(--muted); max-width: 42rem; margin: 0 0 3rem; }
ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 4rem; }
.d { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 2rem; align-items: center; }
.d-shot { position: relative; display: block; padding-bottom: 2.5rem; }
.d-shot img { display: block; width: 100%; height: auto; border: 1px solid var(--line); border-radius: 6px; }
.d-shot .d-phone { position: absolute; right: -.5rem; bottom: 0; width: 24%; border-radius: 12px; box-shadow: 0 6px 24px rgb(0 0 0 / .18); }
h2 { font-size: 1.375rem; margin: 0 0 .5rem; }
.live { font-size: .85rem; font-weight: 500; color: var(--muted); border: 1px solid var(--line); border-radius: 99px; padding: .1rem .55rem; vertical-align: middle; }
.d-text p { margin: 0 0 1rem; }
.d-links { display: flex; gap: 1.5rem; }
a { color: var(--link); }
a:focus-visible { outline: 2px solid var(--link); outline-offset: 3px; }
@media (max-width: 48rem) { .d { grid-template-columns: 1fr; gap: 1rem; } }
</style>
</head>
<body>
<main>
<h1>Prijedlozi dizajna</h1>
<p class="intro">Svi koriste isti sadržaj iz <code>content/profile.mjs</code>, rade na mobitelu i računalu, imaju hrvatsku i englesku verziju te isti kontakt obrazac. Razlikuju se samo izgled i ton. Odaberi jedan; mijenja se jednim retkom u <code>site.config.mjs</code>.</p>
<ol>
${designs.map(card).join("\n")}
</ol>
</main>
</body>
</html>`;
}
