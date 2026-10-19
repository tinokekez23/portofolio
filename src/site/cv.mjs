// Printable CV (A4) built from the same data as the site, so the PDF can't drift from
// the pages. scripts/cv.mjs prints it to public/cv.pdf and public/cv-en.pdf.
// Text only, one column: it prints cleanly and job portals can read it.
import { esc } from "../shared/util.mjs";
import { model } from "../shared/model.mjs";

const bare = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

// `base` is the path from the HTML file to public/, for the fonts.
export function renderCv(ctx, { base }) {
  const m = model(ctx);
  const { P, ui, lang } = ctx;
  const link = (url, text = bare(url)) => `<a href="${esc(url)}">${esc(text)}</a>`;
  const projectUrl = (p) => `${P.siteUrl}/${lang === "en" ? "en/" : ""}projekti/${p.id}/`;
  const section = (title, body) => `<section>
  <h2>${title}</h2>
  <div>${body}</div>
</section>`;
  const entry = (title, when, rest) => `<article class="entry">
    <div class="entry-head"><h3>${title}</h3>${when ? `<p class="when">${when}</p>` : ""}</div>
    ${rest}
  </article>`;

  const projects = m.projects.filter((p) => !p.planned).map((p) => entry(
    esc(p.title),
    esc(p.year),
    `<p>${esc(p.description)}</p>
    <p class="meta">${p.stack.map(esc).join(", ")} · ${link(projectUrl(p))}</p>`
  ));

  const jobs = m.jobs.map((j) => entry(
    esc(j.role),
    `${esc(j.range)}${j.duration ? ` · ${esc(j.duration)}` : ""}`,
    `<p class="org">${esc(j.company)}, ${esc(j.place)}</p>
    <ul>${j.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`
  ));

  const education = m.education.map((e) => entry(
    esc(e.title),
    esc(e.range),
    `<p class="org">${esc(e.school)}${e.note ? `. ${esc(e.note)}` : ""}</p>`
  ));

  const volunteering = m.volunteering.map((v) => entry(
    esc(v.role),
    esc(v.range),
    `<p class="org">${esc(v.company)}, ${esc(v.place)}</p>
    <p>${v.points.map(esc).join(" ")}</p>`
  ));

  const sport = m.certificates.filter((c) => !c.licences.length).map((c) => entry(
    esc(c.title),
    esc(c.year),
    c.issuer ? `<p class="org">${esc(c.issuer)}</p>` : ""
  ));

  const licences = m.certificates.flatMap((c) => c.licences.map((l) => esc(l.cat)));
  // Croatian doesn't capitalise language names mid-sentence
  const languages = m.languages.map((l, i) => `${esc(i && lang === "hr" ? l.name.toLowerCase() : l.name)} (${esc(l.level)})`).join(", ");
  const skills = `<dl class="skills">${m.skills.map((g) => `<div><dt>${esc(g.group)}</dt><dd>${g.items.map(esc).join(", ")}</dd></div>`).join("")}</dl>`;

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${esc(P.name)}, ${lang === "hr" ? "životopis" : "CV"}</title>
<style>
@font-face { font-family: "Schibsted"; src: url(${base}fonts/schibsted.woff2) format("woff2"); font-weight: 400 900; }
@font-face { font-family: "Schibsted"; src: url(${base}fonts/schibsted-hr.woff2) format("woff2"); font-weight: 400 900; unicode-range: U+0106-0107, U+010C-010D, U+0110-0111, U+0160-0161, U+017D-017E; }
@page { size: A4; margin: 15mm 17mm; }
:root { --ink: #17302B; --muted: #4A5F5A; --jade: #0B6B63; --line: #C6CFCB; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font: 9.5pt/1.45 "Schibsted", Arial, sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
a { color: var(--jade); text-decoration: none; }
header { padding-bottom: 4mm; border-bottom: .5mm solid var(--ink); }
h1 { font-size: 24pt; line-height: 1; font-weight: 650; letter-spacing: -.02em; }
.role { font-size: 11pt; color: var(--muted); margin-top: 2mm; }
.contact { display: flex; flex-wrap: wrap; list-style: none; padding: 0; margin-top: 3mm; font-size: 9pt; }
.contact li { margin: 0; }
.contact li + li::before { content: "·"; margin-inline: 2.5mm; color: var(--muted); }
.intro { display: grid; grid-template-columns: 32mm 1fr; column-gap: 6mm; padding-block: 4mm 1mm; }
.intro p { grid-column: 2; font-size: 10pt; }
.avail { color: var(--jade); font-weight: 600; margin-top: 1mm; }
section { display: grid; grid-template-columns: 32mm 1fr; column-gap: 6mm; padding-top: 3.5mm; margin-top: 3.5mm; border-top: .25mm solid var(--line); }
h2 { font-size: 9.5pt; font-weight: 650; color: var(--jade); break-after: avoid; }
.entry { break-inside: avoid; }
.entry + .entry { margin-top: 3mm; }
.entry-head { display: flex; justify-content: space-between; align-items: baseline; gap: 4mm; }
h3 { font-size: 10pt; font-weight: 600; }
.when { flex: none; font-size: 8.5pt; color: var(--muted); }
.org, .meta { color: var(--muted); }
.meta { font-size: 8.5pt; margin-top: .5mm; }
ul { margin-top: 1mm; padding-left: 3.5mm; }
li + li { margin-top: .5mm; }
li::marker { color: var(--jade); }
.skills div { display: grid; grid-template-columns: 34mm 1fr; gap: 3mm; }
.skills div + div { margin-top: 1mm; }
dt { color: var(--muted); }
</style>
</head>
<body>
<header>
  <h1>${esc(m.name)}</h1>
  <p class="role">${esc(m.role)}</p>
  <ul class="contact">
    <li>${esc(m.location)}</li>
    <li>${link(`mailto:${m.email}`, m.email)}</li>
    ${m.phone ? `<li>${link(`tel:${m.phone.replace(/\s/g, "")}`, m.phone)}</li>` : ""}
    <li>${link(`${P.siteUrl}/${lang === "en" ? "en/" : ""}`)}</li>
    ${m.socials.map((s) => `<li>${link(s.url)}</li>`).join("")}
  </ul>
</header>
<div class="intro">
  <p>${esc(m.tagline)}</p>
  ${m.availability ? `<p class="avail">${esc(m.availability)}</p>` : ""}
</div>
${section(ui.projects, projects.join(""))}
${jobs.length ? section(ui.experience, jobs.join("")) : ""}
${section(ui.education, education.join(""))}
${section(ui.skills, skills)}
${section(ui.languages, `<p>${languages}</p>`)}
${volunteering.length ? section(ui.volunteering, volunteering.join("")) : ""}
${sport.length ? section(ui.sport, sport.join("")) : ""}
${licences.length ? section(ui.licence, `<p>${licences.join(", ")}</p>`) : ""}
</body>
</html>
`;
}
