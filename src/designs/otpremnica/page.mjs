// "Otpremnica": Tino's background is a commercial-clerk school and warehouse dispatch, so
// the page is printed like a shipping label: thermal-black rules, a real Code 128 barcode
// (it scans to the site) and one fluorescent sticker for availability.
import { readFileSync } from "node:fs";
import { esc } from "../../shared/util.mjs";
import { head, picture, contactForm, langLink, script } from "../../shared/parts.mjs";
import { model } from "../../shared/model.mjs";

const BARCODE = readFileSync(new URL("./barcode.svg", import.meta.url), "utf8");

export const meta = {
  name: "Otpremnica",
  blurb: {
    hr: "Duhovito i drukčije. Stranica izgleda kao otpremna naljepnica (veza sa školom za komercijalista i poslom u skladištu), s pravim barkodom koji vodi na stranicu i jednom fluorescentnom naljepnicom. Najviše se ističe, ali je i najodvažnija.",
    en: "Witty and different. The page looks like a shipping label (a nod to the commercial school and warehouse job), with a real barcode that scans to the site and one fluorescent sticker. Stands out the most, and is the boldest."
  }
};

const TEXT = {
  hr: { from: "Pošiljatelj", to: "Primatelj", toValue: "Vaš tim", parcel: "Paket 1 od 1", contactTitle: "Povratnica", tear: "Odreži i pošalji" },
  en: { from: "From", to: "To", toValue: "Your team", parcel: "Parcel 1 of 1", contactTitle: "Return slip", tear: "Fill in and send" }
};

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="#C7A57A"/><rect x="10" y="14" width="44" height="36" rx="3" fill="#fff" stroke="#151515" stroke-width="3"/><path d="M17 22v20M22 22v20M25 22v20M30 22v20M35 22v20M37 22v20M42 22v20M47 22v20" stroke="#151515" stroke-width="2.4"/></svg>`;

export function render(ctx) {
  const m = model(ctx);
  const { ui, lang, root } = ctx;
  const L = TEXT[lang];
  const n = ui.nav;

  const project = (p) => p.planned
    ? `<li class="proj proj-planned"><p class="proj-tag">${ui.planned}</p><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p></li>`
    : `<li class="proj">
  ${p.image ? `<figure class="proj-shot">${picture(ctx, p.image, { sizes: "(min-width: 70rem) 36rem, calc(100vw - 2.5rem)" })}</figure>` : ""}
  <div class="proj-text">
    <h3>${esc(p.title)}</h3>
    <p class="proj-meta">${esc(p.year)}: ${p.stack.map(esc).join(", ")}</p>
    <p>${esc(p.summary)}</p>
    <details>
      <summary>${ui.howMade}</summary>
      <dl class="cs">
        <div><dt>${ui.problem}</dt><dd>${esc(p.problem)}</dd></div>
        <div><dt>${ui.solution}</dt><dd>${esc(p.solution)}</dd></div>
        <div><dt>${ui.result}</dt><dd>${esc(p.result)}</dd></div>
      </dl>
    </details>
  </div>
</li>`;

  return `<html lang="${lang}">
${head(ctx, { css: ctx.css, fonts: ["barlow-condensed-800.woff2", "barlow-condensed-500.woff2", "barlow-condensed-700.woff2", "barlow-400.woff2"], themeColor: "#C7A57A", favicon: FAVICON })}
<body>
<a class="skip" href="#sadrzaj">${ui.skip}</a>
<header class="bar">
  <div class="wrap bar-in">
    <a class="mark" href="#top">${esc(m.name)}</a>
    <nav id="nav" class="nav" aria-label="${ui.navLabel}" data-nav>
      <a href="#o-meni">${n.about}</a>
      <a href="#iskustvo">${n.experience}</a>
      <a href="#vjestine">${n.skills}</a>
      <a href="#projekti">${n.projects}</a>
      <a href="#kontakt">${n.contact}</a>
    </nav>
    ${langLink(ctx, "lang")}
    <a class="menu-btn" href="#nav" aria-controls="nav" data-menu-button><span class="sr">${ui.menu}</span><span aria-hidden="true"></span></a>
  </div>
</header>

<main id="sadrzaj">
  <section class="hero" id="top" aria-labelledby="hero-h">
    <div class="wrap">
      <div class="label">
        <div class="row route">
          <div class="cell"><span class="k">${L.from}</span><span class="v">${esc(m.location)}</span></div>
          <div class="cell"><span class="k">${L.to}</span><span class="v">${L.toValue}</span></div>
          <div class="cell code">${BARCODE}</div>
        </div>
        <div class="row who">
          <div class="cell">
            <h1 id="hero-h">${esc(m.name)}</h1>
            <p class="role">${esc(m.role)}</p>
            ${m.availability ? `<p class="sticker"><span>${esc(m.availability)}</span></p>` : ""}
          </div>
          ${m.photo ? `<img class="photo" src="${root}${esc(m.photo)}" alt="${esc(m.name)}" width="150" height="190">` : ""}
        </div>
        <dl class="row facts">
          <div class="cell"><dt class="k">${ui.study}</dt><dd class="v">${esc(m.study)}</dd></div>
          <div class="cell"><dt class="k">${ui.languages}</dt><dd class="v">${m.languages.map((l) => `${esc(l.name)} ${esc(l.native ? "" : l.level)}`.trim()).join(", ")}</dd></div>
          <div class="cell"><dt class="k">${ui.email}</dt><dd class="v"><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></dd></div>
        </dl>
        <div class="row foot-row">
          <div class="cell actions">
            <a class="btn btn-ink" href="${root}${esc(m.cv)}" download>${ui.downloadCv}</a>
            <a class="btn" href="#kontakt">${ui.writeMe}</a>
          </div>
          <div class="cell parcel"><span>${L.parcel}</span></div>
        </div>
      </div>
    </div>
  </section>

  <div class="sheet">
    <section class="sec wrap" id="o-meni" aria-labelledby="h-about">
      <h2 id="h-about" class="strip">${ui.about}</h2>
      <div class="sec-body prose">${m.about.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
    </section>

    <section class="sec wrap" id="iskustvo" aria-labelledby="h-exp">
      <h2 id="h-exp" class="strip">${ui.experience}</h2>
      <ol class="jobs">${m.jobs.map((j) => `<li class="job">
        <p class="job-when">${esc(j.range)}${j.duration ? `<br>${esc(j.duration)}` : ""}</p>
        <div class="job-body">
          <h3>${esc(j.role)}</h3>
          <p class="job-org">${esc(j.company)}, ${esc(j.place)}</p>
          ${j.points.length > 1 ? `<ul>${j.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : `<p>${esc(j.points[0])}</p>`}
        </div>
      </li>`).join("")}</ol>
      <div class="two">
        <div><h3 class="sub">${ui.education}</h3><ul class="list">${m.education.map((e) => `<li><b>${esc(e.title)}</b><span>${esc(e.school)}</span><span class="meta">${esc(e.range)}</span></li>`).join("")}</ul></div>
        <div><h3 class="sub">${ui.certificates}</h3><ul class="list">${m.certificates.map((c) => `<li><b>${esc(c.title)}</b>${c.issuer ? `<span>${esc(c.issuer)}</span>` : ""}${c.year ? `<span class="meta">${esc(c.year)}</span>` : ""}</li>`).join("")}</ul></div>
      </div>
    </section>

    <section class="sec wrap" id="vjestine" aria-labelledby="h-skills">
      <h2 id="h-skills" class="strip">${ui.skills}</h2>
      <div class="skills">${m.skills.map((g) => `<div class="skill"><h3>${esc(g.group)}</h3><ul>${g.items.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>`).join("")}</div>
    </section>

    <section class="sec wrap" id="projekti" aria-labelledby="h-proj">
      <h2 id="h-proj" class="strip">${ui.projects}</h2>
      <ul class="projs">${m.projects.map(project).join("")}</ul>
    </section>

    ${m.testimonials.length ? `<section class="sec wrap" id="preporuke" aria-labelledby="h-test"><h2 id="h-test" class="strip">${ui.testimonials}</h2>${m.testimonials.map((q) => `<figure class="quote"><blockquote><p>${esc(q.quote)}</p></blockquote><figcaption>${esc(q.name)}, ${esc(q.title)}</figcaption></figure>`).join("")}</section>` : ""}

    <section class="sec wrap contact" id="kontakt" aria-labelledby="h-contact">
      <div class="slip">
        <p class="tear" aria-hidden="true">${L.tear}</p>
        <div class="slip-in">
          <div>
            <h2 id="h-contact">${L.contactTitle}</h2>
            <p class="lead">${ui.contactLead}</p>
            <p class="mail"><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></p>
            <button class="btn btn-small" type="button" data-copy="${esc(m.email)}" data-copied="${ui.copied}" hidden>${ui.copy}</button>
            ${m.phone ? `<p class="phone"><a href="tel:${esc(m.phone.replace(/\s/g, ""))}">${esc(m.phone)}</a></p>` : ""}
            ${m.socials.length ? `<ul class="socials">${m.socials.map((s) => `<li><a href="${esc(s.url)}" rel="me noopener">${esc(s.label)}</a></li>`).join("")}</ul>` : ""}
          </div>
          ${contactForm(ctx)}
        </div>
      </div>
    </section>
  </div>
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
