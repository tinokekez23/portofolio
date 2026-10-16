// "Cetina": quiet and credible. One typeface, limestone and river-green, and a hero that is
// a single plain sentence about who Tino is and what he's looking for.
import { esc } from "../../shared/util.mjs";
import { head, picture, contactForm, langLink, script } from "../../shared/parts.mjs";
import { model } from "../../shared/model.mjs";

export const meta = {
  name: "Cetina",
  blurb: {
    hr: "Mirno i ozbiljno. Jedno pismo, boja vapnenca i zelenilo Cetine, a na vrhu jedna jasna rečenica o tome tko si i što tražiš. Najsigurniji izbor za poslodavce.",
    en: "Calm and credible. One typeface, limestone and Cetina river green, and a single plain sentence up top saying who you are and what you want. The safest choice for employers."
  }
};

export const THEME_COLOR = "#ECEEEA";
export const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0B6B63"/><path d="M14 44c8-10 14 6 22-4s10-12 14-12" fill="none" stroke="#ECEEEA" stroke-width="5" stroke-linecap="round"/></svg>`;

export function render(ctx) {
  const m = model(ctx);
  const { ui, lang, root } = ctx;
  const n = ui.nav;

  const job = (j) => `<li class="job">
  <p class="job-when">${esc(j.range)}${j.duration ? `<span>${esc(j.duration)}</span>` : ""}</p>
  <div class="job-body">
    <h3>${esc(j.role)}</h3>
    <p class="job-org">${esc(j.company)}, ${esc(j.place)}</p>
    ${j.points.length > 1 ? `<ul>${j.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : `<p>${esc(j.points[0])}</p>`}
  </div>
</li>`;

  const project = (p) => p.planned
    ? `<li class="proj proj-planned">
  <p class="proj-status">${ui.planned}</p>
  <h3>${esc(p.title)}</h3>
  <p>${esc(p.summary)}</p>
</li>`
    : `<li class="proj">
  ${p.video ? `<figure class="proj-shot"><video poster="${root}${esc(p.video.poster)}" width="${p.video.width}" height="${p.video.height}" muted loop playsinline preload="none" controls data-autoplay aria-label="${esc(p.video.alt)}"><source src="${root}${esc(p.video.src)}.webm" type="video/webm"><source src="${root}${esc(p.video.src)}.mp4" type="video/mp4"></video></figure>`
    : p.image ? `<figure class="proj-shot">${picture(ctx, p.image, { sizes: "(min-width: 64rem) 44rem, calc(100vw - 2.5rem)" })}</figure>` : ""}
  <div class="proj-text">
    <h3>${esc(p.title)} <span class="proj-year">${esc(p.year)}</span></h3>
    <p>${esc(p.summary)}</p>
    <p class="proj-stack">${p.stack.map(esc).join(", ")}</p>
    <details>
      <summary>${ui.howMade}</summary>
      <dl class="cs">
        <div><dt>${ui.problem}</dt><dd>${esc(p.problem)}</dd></div>
        <div><dt>${ui.solution}</dt><dd>${esc(p.solution)}</dd></div>
        <div><dt>${ui.result}</dt><dd>${esc(p.result)}</dd></div>
      </dl>
    </details>
    ${p.links.map((l) => `<a class="btn btn-small" href="${esc(l.url)}" rel="noopener">${esc(l.label)}</a>`).join(" ")}
  </div>
</li>`;

  return `<html lang="${lang}">
${head(ctx, { css: ctx.css, fonts: ["schibsted.woff2"], themeColor: THEME_COLOR, themeColorDark: "#102320", favicon: FAVICON })}
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
  <section class="hero wrap" id="top" aria-labelledby="hero-h">
    ${m.photo ? `<img class="hero-photo" src="${root}${esc(m.photo)}" alt="${esc(m.name)}" width="160" height="200">` : ""}
    <div class="hero-main">
    <h1 id="hero-h">${esc(m.name)} ${esc(m.headline)}</h1>
    <div class="hero-actions">
      <a class="btn btn-solid" href="${root}${esc(m.cv)}" download>${ui.downloadCv}</a>
      <a class="btn" href="#kontakt">${ui.writeMe}</a>
      ${m.availability ? `<p class="avail"><span class="avail-dot" aria-hidden="true"></span>${esc(m.availability)}</p>` : ""}
    </div>
    </div>
    <dl class="facts">
      <div><dt>${ui.location}</dt><dd>${esc(m.location)}</dd></div>
      <div><dt>${ui.study}</dt><dd>${esc(m.study)}</dd></div>
      <div><dt>${ui.languages}</dt><dd>${esc(m.languageNames)}</dd></div>
      <div><dt>${ui.email}</dt><dd><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></dd></div>
    </dl>
  </section>

  <section class="sec wrap" id="o-meni" aria-labelledby="h-about">
    <h2 id="h-about">${ui.about}</h2>
    <div class="sec-body prose">${m.about.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
  </section>

  <section class="sec wrap" id="iskustvo" aria-labelledby="h-exp">
    <h2 id="h-exp">${ui.experience}</h2>
    <div class="sec-body">
      <ol class="jobs">${m.jobs.map(job).join("")}</ol>
      <div class="two">
        <div>
          <h3 class="sub">${ui.education}</h3>
          <ul class="facts-list">${m.education.map((e) => `<li><b>${esc(e.title)}</b><span>${esc(e.school)}</span><span class="meta">${esc(e.range)}${e.note ? `, ${esc(e.note.toLowerCase())}` : ""}</span></li>`).join("")}</ul>
        </div>
        <div>
          <h3 class="sub">${ui.certificates}</h3>
          <ul class="facts-list">${m.certificates.map((c) => `<li><b>${esc(c.title)}</b>${c.issuer ? `<span>${esc(c.issuer)}</span>` : ""}${c.year ? `<span class="meta">${esc(c.year)}</span>` : ""}</li>`).join("")}</ul>
        </div>
      </div>
    </div>
  </section>

  <section class="sec wrap" id="vjestine" aria-labelledby="h-skills">
    <h2 id="h-skills">${ui.skills}</h2>
    <div class="sec-body">
      <dl class="skills">${m.skills.map((g) => `<div><dt>${esc(g.group)}</dt><dd>${g.items.map(esc).join(", ")}</dd></div>`).join("")}
        <div><dt>${ui.languages}</dt><dd>${m.languages.map((l) => `${esc(l.name)} (${esc(l.level)})`).join(", ")}</dd></div>
      </dl>
    </div>
  </section>

  <section class="sec wrap" id="projekti" aria-labelledby="h-proj">
    <h2 id="h-proj">${ui.projects}</h2>
    <div class="sec-body"><ul class="projs">${m.projects.map(project).join("")}</ul></div>
  </section>

  ${m.testimonials.length ? `<section class="sec wrap" id="preporuke" aria-labelledby="h-test">
    <h2 id="h-test">${ui.testimonials}</h2>
    <div class="sec-body">${m.testimonials.map((q) => `<figure class="quote"><blockquote><p>${esc(q.quote)}</p></blockquote><figcaption>${esc(q.name)}, ${esc(q.title)}</figcaption></figure>`).join("")}</div>
  </section>` : ""}

  <section class="sec wrap contact" id="kontakt" aria-labelledby="h-contact">
    <h2 id="h-contact">${ui.contact}</h2>
    <div class="sec-body contact-grid">
      <div class="contact-side">
        <p class="lead">${ui.contactLead}</p>
        <p class="mail"><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></p>
        <button class="btn btn-small" type="button" data-copy="${esc(m.email)}" data-copied="${ui.copied}" hidden>${ui.copy}</button>
        ${m.phone ? `<p class="phone"><a href="tel:${esc(m.phone.replace(/\s/g, ""))}">${esc(m.phone)}</a></p>` : ""}
        ${m.socials.length ? `<ul class="socials">${m.socials.map((s) => `<li><a href="${esc(s.url)}" rel="me noopener">${esc(s.label)}</a></li>`).join("")}</ul>` : ""}
      </div>
      ${contactForm(ctx)}
    </div>
  </section>
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
