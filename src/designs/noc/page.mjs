// "Noć": the first version's look (dark graphite, amber, wide Unbounded name, two-column
// sections) kept as the base, with the generated-looking parts taken out: no terminal
// prompt, no monospace caps labels, no coloured dot after the name, no skill meters.
import { esc } from "../../shared/util.mjs";
import { head, picture, contactForm, langLink, script } from "../../shared/parts.mjs";
import { model } from "../../shared/model.mjs";

export const meta = {
  name: "Noć",
  blurb: {
    hr: "Tvoj prvi dizajn, dotjeran. Ista tamna baza, jantarna boja i veliko ime, ali bez terminal prompta, sitnih oznaka velikim slovima i ukrasa koji odaju AI. Svijetla i tamna tema s prekidačem.",
    en: "Your first design, refined. Same dark base, amber accent and large name, without the terminal prompt, tiny caps labels and generated-looking extras. Light and dark themes with a toggle."
  }
};

const TEXT = {
  hr: { theme: "Tamna tema", outside: "Izvan posla", outsideText: "Gitara, klavir i bubnjevi, kickboxing i planinarenje.", current: "trenutno" },
  en: { theme: "Dark theme", outside: "Outside work", outsideText: "Guitar, piano and drums, kickboxing and hiking.", current: "current" }
};

export const THEME_COLOR = "#F3F4F6";
export const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#F2A93B"/><text x="32" y="42" font-family="Arial,sans-serif" font-weight="700" font-size="26" text-anchor="middle" fill="#14171C">TK</text></svg>`;

export function render(ctx) {
  const m = model(ctx);
  const { ui, lang, root } = ctx;
  const L = TEXT[lang];
  const n = ui.nav;

  const job = (j) => `<li class="job${j.current ? " is-current" : ""}">
  <p class="job-when">${esc(j.range)}${j.duration ? `<span>${esc(j.duration)}</span>` : ""}</p>
  <div class="job-body">
    <h3>${esc(j.role)}</h3>
    <p class="job-org">${esc(j.company)}, ${esc(j.place)}</p>
    ${j.points.length > 1 ? `<ul>${j.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : `<p>${esc(j.points[0])}</p>`}
  </div>
</li>`;

  const project = (p) => p.planned
    ? `<li class="proj proj-planned"><p class="proj-status">${ui.planned}</p><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p></li>`
    : `<li class="proj">
  ${p.image ? `<figure class="proj-shot">${picture(ctx, p.image, { sizes: "(min-width: 72rem) 30rem, (min-width: 52rem) 50vw, calc(100vw - 2rem)" })}</figure>` : ""}
  <div class="proj-text">
    <p class="proj-meta">${esc(p.year)}</p>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.summary)}</p>
    <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    <details>
      <summary>${ui.howMade}</summary>
      <dl class="cs">
        <div><dt>${ui.problem}</dt><dd>${esc(p.problem)}</dd></div>
        <div><dt>${ui.solution}</dt><dd>${esc(p.solution)}</dd></div>
        <div><dt>${ui.result}</dt><dd>${esc(p.result)}</dd></div>
      </dl>
    </details>
    ${p.links.map((l) => `<a class="link" href="${esc(l.url)}" rel="noopener">${esc(l.label)}</a>`).join(" ")}
  </div>
</li>`;

  const sec = (id, title, body, cls = "") => `<section class="sec wrap ${cls}" id="${id}" aria-labelledby="h-${id}">
    <h2 id="h-${id}">${title}</h2>
    <div class="sec-body">${body}</div>
  </section>`;

  return `<html lang="${lang}">
${head(ctx, { css: ctx.css, fonts: ["unbounded.woff2", "manrope.woff2"], themeColor: THEME_COLOR, themeColorDark: "#14171C", favicon: FAVICON, extra: `<script src="${root}assets/${ctx.asset("theme.js")}"></script>\n` })}
<body>
<a class="skip" href="#sadrzaj">${ui.skip}</a>
<header class="bar">
  <div class="wrap bar-in">
    <a class="brand" href="#top"><span class="mono" aria-hidden="true">${esc(ctx.P.initials)}</span>${esc(m.name)}</a>
    <nav id="nav" class="nav" aria-label="${ui.navLabel}" data-nav>
      <a href="#o-meni">${n.about}</a>
      <a href="#iskustvo">${n.experience}</a>
      <a href="#vjestine">${n.skills}</a>
      <a href="#projekti">${n.projects}</a>
      <a href="#kontakt">${n.contact}</a>
    </nav>
    <div class="tools">
      ${langLink(ctx, "tool")}
      <button class="tool" type="button" data-theme-toggle aria-pressed="true" hidden><span class="sr">${L.theme}</span>
        <svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>
        <svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>
      </button>
      <a class="tool menu-btn" href="#nav" aria-controls="nav" data-menu-button><span class="sr">${ui.menu}</span><span class="bars" aria-hidden="true"></span></a>
    </div>
  </div>
</header>

<main id="sadrzaj">
  <section class="hero wrap" id="top" aria-labelledby="hero-h">
    <div class="hero-main">
      ${m.availability ? `<p class="avail"><span class="avail-dot" aria-hidden="true"></span>${esc(m.availability)}</p>` : ""}
      <h1 id="hero-h">${esc(m.name)}</h1>
      <p class="role">${esc(m.role)}</p>
      <p class="tagline">${esc(m.tagline)}</p>
      <div class="actions">
        <a class="btn btn-primary" href="#projekti">${ui.seeProjects}</a>
        <a class="btn" href="${root}${esc(m.cv)}" download>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14"/></svg>${ui.downloadCv}</a>
      </div>
    </div>
    ${m.photo ? `<img class="hero-photo" src="${root}${esc(m.photo)}" alt="${esc(m.name)}" width="320" height="400" fetchpriority="high">` : ""}
    <dl class="facts">
      <div><dt>${ui.location}</dt><dd>${esc(m.location)}</dd></div>
      <div><dt>${ui.study}</dt><dd>${esc(m.study)}</dd></div>
      <div><dt>${ui.languages}</dt><dd>${esc(m.languageNames)}</dd></div>
      <div><dt>${ui.email}</dt><dd><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></dd></div>
    </dl>
  </section>

  ${sec("o-meni", ui.about, `<div class="prose">${m.about.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`)}

  ${sec("iskustvo", ui.experience, `<ol class="jobs">${m.jobs.map(job).join("")}</ol>
      <div class="two">
        <div>
          <h3 class="sub">${ui.education}</h3>
          <ul class="list">${m.education.map((e) => `<li><b>${esc(e.title)}</b><span>${esc(e.school)}</span><span class="meta">${esc(e.range)}</span></li>`).join("")}</ul>
        </div>
        <div>
          <h3 class="sub">${ui.certificates}</h3>
          <ul class="list">${m.certificates.map((c) => `<li><b>${esc(c.title)}</b>${c.issuer ? `<span>${esc(c.issuer)}</span>` : ""}${c.year ? `<span class="meta">${esc(c.year)}</span>` : ""}</li>`).join("")}</ul>
        </div>
      </div>`)}

  ${sec("vjestine", ui.skills, `<div class="skills">${m.skills.map((g) => `<div class="skill"><h3>${esc(g.group)}</h3><ul>${g.items.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>`).join("")}
        <div class="skill"><h3>${ui.languages}</h3><ul>${m.languages.map((l) => `<li>${esc(l.name)} <span class="meta">${esc(l.level)}</span></li>`).join("")}</ul></div>
        <div class="skill"><h3>${L.outside}</h3><p>${L.outsideText}</p></div>
      </div>`)}

  ${sec("projekti", ui.projects, `<ul class="projs">${m.projects.map(project).join("")}</ul>`)}

  ${m.testimonials.length ? sec("preporuke", ui.testimonials, m.testimonials.map((q) => `<figure class="quote"><blockquote><p>${esc(q.quote)}</p></blockquote><figcaption>${esc(q.name)}, ${esc(q.title)}</figcaption></figure>`).join("")) : ""}

  ${sec("kontakt", ui.contact, `<div class="contact-grid">
        <div class="contact-side">
          <p class="lead">${ui.contactLead}</p>
          <p class="mail"><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></p>
          <button class="btn btn-small" type="button" data-copy="${esc(m.email)}" data-copied="${ui.copied}" hidden>${ui.copy}</button>
          ${m.phone ? `<p class="phone"><a href="tel:${esc(m.phone.replace(/\s/g, ""))}">${esc(m.phone)}</a></p>` : ""}
          ${m.socials.length ? `<ul class="socials">${m.socials.map((s) => `<li><a href="${esc(s.url)}" rel="me noopener">${esc(s.label)}</a></li>`).join("")}</ul>` : ""}
        </div>
        ${contactForm(ctx)}
      </div>`, "contact")}
</main>

<footer class="foot">
  <div class="wrap foot-in">
    <p>© ${m.year} ${esc(m.name)}. ${ui.builtWith}</p>
    <a href="#top">${ui.toTop}</a>
  </div>
</footer>
${script(ctx)}
</body>
</html>`;
}
